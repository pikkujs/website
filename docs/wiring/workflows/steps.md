# Workflow Steps

Workflows are composed of steps. Each step represents a unit of work that can be cached and replayed. Pikku workflows support three types of steps.

## RPC Steps

RPC steps call other Pikku functions via queue workers. They execute asynchronously in separate worker processes.

### Syntax

```typescript
const result = await workflow.do(
  'Step description',
  'rpcFunctionName',
  inputData,
  {
    retries: 3,           // Optional: number of retry attempts (default: 0)
    retryDelay: '1s'      // Optional: delay between retries (default: 0)
  }
)
```

### Example

```typescript
// Call the createUserProfile RPC function
const user = await workflow.do(
  'Create user profile in database',
  'createUserProfile',
  { email: data.email, userId: data.userId }
)

// With retry options
const payment = await workflow.do(
  'Process payment',
  'processPayment',
  { amount: 100, userId: data.userId },
  {
    retries: 2,          // Retry up to 2 times (3 total attempts)
    retryDelay: '5s'     // Wait 5 seconds between retries
  }
)
```

### Retry Options

- **`retries`**: (number) Number of retry attempts after initial failure. Total attempts = retries + 1. Default: 0 (no retries)
- **`retryDelay`**: (string | number) Delay between retries. Supports duration strings like `'5s'`, `'1min'` or milliseconds as number. Default: 0

### Accessing Workflow Context in RPC Functions

RPC functions can access workflow step information through the `workflowStep` parameter:

```typescript
export const processPayment = pikkuSessionlessFunc<
  { amount: number; userId: string },
  { success: boolean }
>({
  func: async ({ logger, workflowStep }, data) => {
    // Access workflow context
    if (workflowStep) {
      const attempt = workflowStep.attemptCount  // Current attempt number (1, 2, 3, ...)
      const runId = workflowStep.runId           // Workflow run ID
      const stepId = workflowStep.stepId         // Current step ID

      logger.info(`Payment attempt ${attempt} for run ${runId}`)

      // Different behavior based on attempt count
      if (attempt === 1) {
        // First attempt - might fail
      } else {
        // Retry attempt - use different strategy
      }
    }

    // Process payment...
    return { success: true }
  }
})
```

### When to use RPC steps

- Operations that should run in separate worker processes
- CPU-intensive tasks that benefit from horizontal scaling
- Operations that interact with external services (databases, APIs)
- Tasks that need independent retry logic

## Inline Steps

Inline steps execute code immediately within the workflow process. Results are cached for replay.

### Syntax

```typescript
const result = await workflow.do(
  'Step description',
  async () => {
    // Your code here
    return someValue
  },
  {
    retries: 3,           // Optional: number of retry attempts (default: 0)
    retryDelay: '1s'      // Optional: delay between retries (default: 0)
  }
)
```

### Example

```typescript
// Create user in CRM system
const crmUser = await workflow.do(
  'Create user in CRM system',
  async () => {
    return await crmApi.createUser({
      email: user.email,
      name: user.name,
      source: 'signup'
    })
  }
)

// With retry options for flaky external API
const analyticsUser = await workflow.do(
  'Create analytics profile',
  async () => {
    return await analyticsApi.createProfile(user)
  },
  {
    retries: 2,          // Retry up to 2 times if API fails
    retryDelay: '3s'     // Wait 3 seconds between retries
  }
)
```

### When to use inline steps

- Fast operations that don't need queue workers
- Operations you want to cache and never re-execute
- Steps that should execute immediately without queue delay
- External API calls that are idempotent
- Operations that might fail and need retry logic

### Caching benefit

On replay, inline steps are never re-executed:

```typescript
// First execution
const crmUser = await workflow.do(
  'Create user in CRM',
  async () => crmApi.createUser(...) // ✓ Creates user in CRM
)
await workflow.sleep('Wait 5min', '5min')

// After sleep (replay)
const crmUser = await workflow.do(
  'Create user in CRM',
  async () => crmApi.createUser(...) // ✗ SKIPPED - uses cached crmUser
)
```

Without caching, the CRM user would be created twice!

## Sleep Steps

Sleep steps create time-based delays in workflows. They schedule the workflow to resume after a specified duration.

### Syntax

```typescript
await workflow.sleep('Step description', duration)
```

Duration formats:
- Seconds: `'5s'`, `'30s'`, `'120s'`
- Minutes: `'5min'`, `'30min'`, `'120min'`
- Number (milliseconds): `5000` for 5 seconds

### Example

```typescript
await workflow.sleep('Wait 5 minutes before sending email', '5min')
await workflow.sleep('Wait 30 seconds before retry', '30s')
await workflow.sleep('Wait 1 day before follow-up', '1440min')
```

### When to use sleep steps

- Delayed actions (send reminder after X days)
- Rate limiting (wait between API calls)
- Trial expirations (check status after 7 days)
- Scheduled follow-ups

## Workflow Cancellation

Workflows can be cancelled programmatically using the `workflow.cancel()` method. This is useful for conditional cancellation based on business logic.

### Syntax

```typescript
await workflow.cancel(reason)
```

### Example

```typescript
export const orderWorkflow = pikkuWorkflowFunc<
  { orderId: string; amount: number },
  { success: boolean }
>(async ({ workflow }, data) => {
  // Cancel if amount is invalid
  if (data.amount <= 0) {
    await workflow.cancel(`Invalid order amount: ${data.amount}`)
  }

  // Cancel if order is already cancelled in database
  const order = await workflow.do('Fetch order', 'getOrder', { orderId: data.orderId })
  if (order.status === 'cancelled') {
    await workflow.cancel(`Order ${data.orderId} was already cancelled`)
  }

  // Continue with order processing...
  return { success: true }
})
```

When cancelled, the workflow run status is set to `'cancelled'` and execution stops immediately.

## Step Caching and Replay

All step results are cached in the workflow state. When a workflow resumes (after sleep, failure, or RPC completion), it **replays from the beginning** using cached results.

### Example: Replay behavior

```typescript
export const workflow = pikkuWorkflowFunc(async ({ workflow }, data) => {
  // First execution
  const user = await workflow.do('Create user', 'createUser', data) // ✓ Executes
  const crm = await workflow.do('Add to CRM', async () => crmApi.create()) // ✓ Executes
  await workflow.sleep('Wait', '5min')                               // ✓ Schedules

  // --- 5 minutes pass ---

  // Replay (orchestrator restarts workflow)
  const user = await workflow.do('Create user', 'createUser', data) // ✗ Skipped (cached)
  const crm = await workflow.do('Add to CRM', async () => crmApi.create()) // ✗ Skipped (cached)
  await workflow.sleep('Wait', '5min')                               // ✗ Skipped (cached)
  await workflow.do('Send email', 'sendEmail', { user })             // ✓ Executes (new)
})
```

## Best Practices

### 1. Descriptive step names

Use clear, specific descriptions:

```typescript
// Good
await workflow.do('Create user profile for john@example.com', ...)

// Bad
await workflow.do('Step 1', ...)
```

### 2. Use RPC for heavy operations

Use RPC steps for CPU-intensive or long-running tasks:

```typescript
// Good: Heavy computation via RPC
await workflow.do('Generate report', 'generateMonthlyReport', { month: 'Jan' })

// Bad: Heavy computation inline (blocks orchestrator)
await workflow.do('Generate report', async () => heavyComputation())
```

### 3. Don't modify step order

Once a workflow starts, don't rearrange steps:

```typescript
// ❌ WRONG: Adding step before completed steps
export const workflow = pikkuWorkflowFunc(async ({ workflow }, data) => {
  await workflow.do('New step', ...) // ← DON'T INSERT HERE if workflow already running
  await workflow.do('Existing step 1', ...)
  await workflow.do('Existing step 2', ...)
})

// ✓ CORRECT: Add new steps at end
export const workflow = pikkuWorkflowFunc(async ({ workflow }, data) => {
  await workflow.do('Existing step 1', ...)
  await workflow.do('Existing step 2', ...)
  await workflow.do('New step', ...) // ← Safe to add here
})
```

## Next Steps

- **[Configuration](./configuration.md)**: Configure state storage and execution modes
- **[Main Guide](./index.md)**: Back to workflow overview
