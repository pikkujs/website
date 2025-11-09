# Workflows

Pikku workflows provide a powerful way to orchestrate multi-step processes with automatic state management, deterministic replay, and step caching. They're perfect for complex business processes that span multiple operations, need to handle failures gracefully, or require time-based delays.

## What are Workflows?

Workflows are long-running, multi-step processes that can survive server restarts, handle failures, and resume from where they left off. Unlike simple function calls or RPC chains, workflows maintain their state in a persistent external store and use deterministic replay to ensure correctness.

**Key features:**

- **Deterministic Replay**: Completed steps are never re-executed. When a workflow resumes, it replays from the beginning using cached results for completed steps.
- **State Persistence**: Workflow state is stored in an external store (like PostgreSQL or Redis), surviving server restarts and crashes.
- **Step Caching**: Each step's result is cached, preventing duplicate work during replay.
- **Multiple Execution Modes**: Run workflows inline (synchronous) for testing or remote (asynchronous via queue workers) for production.
- **Type Safety**: Full TypeScript support with generated types for workflow inputs and outputs.

## When to Use Workflows

Workflows are ideal for scenarios that involve:

- **Multi-step business processes**: User onboarding, order fulfillment, approval workflows
- **Operations requiring time delays**: Sending reminder emails after X days, trial expiration handling
- **Processes that need to survive failures**: Payment processing, data migration, batch operations
- **Long-running tasks**: Report generation, video processing, data aggregation

### Workflows vs Other Pikku Features

| Feature | Use Case | State Management | Execution |
|---------|----------|------------------|-----------|
| **Workflows** | Multi-step processes with delays and failure recovery | Persistent (external store) | Asynchronous (queue-based) or synchronous |
| **Queue Jobs** | Single background tasks | None (fire-and-forget) | Asynchronous (queue-based) |
| **Scheduled Tasks** | Recurring cron-like jobs | None | Time-based triggers |
| **RPC Calls** | Direct function invocations | None | Synchronous or asynchronous |

## Core Concepts

### Workflow Runs

Each workflow execution is called a **run**. A run has:
- A unique `runId`
- Current status: `running`, `completed`, `failed`, or `cancelled`
- Input data
- Output data (when completed)
- Metadata (creation time, last interaction, etc.)

### Steps

Workflows are composed of **steps**. Each step has:
- A descriptive name (used for logging and debugging)
- A status: `pending`, `scheduled`, `succeeded`, or `failed`
- Cached result data (for replay)
- Execution metadata (including `attemptCount` for retries)

There are three types of steps:

1. **RPC Steps**: Call other Pikku functions via queue workers (with optional retry configuration)
2. **Inline Steps**: Execute code immediately with caching (with optional retry configuration)
3. **Sleep Steps**: Time-based delays

Learn more in [Step Types](./steps.md).

### Execution Modes

Workflows automatically run in one of two modes based on your configuration:

**Inline Mode** (synchronous):
- Used when no queue service is configured
- Executes immediately in the same process
- Perfect for testing and development
- No queue workers required
- Steps execute sequentially without queue jobs

**Remote Mode** (asynchronous):
- Used when a queue service is configured
- Executes via Pikku queue workers
- Production-ready with horizontal scaling
- Survives server restarts
- Steps execute in separate worker processes

The mode is determined automatically based on whether a `queueService` is available in your singleton services.

## How Workflows Work

### Remote Mode Flow

```
1. User calls rpc.startWorkflow('workflow-name', inputData)
2. Workflow run created in state storage
3. Orchestrator job added to queue
4. Orchestrator executes workflow function
5. On RPC step:
   a. Step marked as "scheduled"
   b. Step worker job added to queue
   c. Worker executes RPC call
   d. Result stored in state
   e. Orchestrator resumed
6. Orchestrator replays from beginning
   - Uses cached results for completed steps
   - Continues from last completed step
7. Process repeats until workflow completes or fails
```

### Deterministic Replay

When a workflow resumes (after a delay, failure, or RPC step completion), it **replays from the beginning**. However, completed steps are not re-executed - their cached results are used instead.

This ensures:
- Workflows can survive failures and resume correctly
- Step results are consistent across replays
- Complex branching logic works as expected
- Time-based operations (sleep) don't reset

**Example:**

```typescript
// First execution
await workflow.do('Step 1', async () => createUser()) // Executes
await workflow.do('Step 2', async () => sendEmail()) // Executes
await workflow.sleep('Wait', '5min')                 // Schedules timer

// After 5 minutes (replay)
await workflow.do('Step 1', async () => createUser()) // SKIPPED (cached)
await workflow.do('Step 2', async () => sendEmail()) // SKIPPED (cached)
await workflow.sleep('Wait', '5min')                 // SKIPPED (cached)
await workflow.do('Step 3', async () => sendReminder()) // Executes
```

## Quick Example

Here's a simple user onboarding workflow:

```typescript
import { pikkuWorkflowFunc } from './.pikku/workflow/pikku-workflow-types.gen'

export const onboardingWorkflow = pikkuWorkflowFunc<
  { email: string; userId: string },
  { success: boolean }
>(async ({ workflow, rpc }, data) => {
  // Step 1: Create user profile (RPC step - runs in queue worker)
  await workflow.do(
    'Create user profile in database',
    'createUserProfile',
    data
  )

  // Step 2: Generate welcome message (inline step - runs immediately)
  const message = await workflow.do(
    'Generate welcome message',
    async () => `Welcome to our platform, ${data.email}!`
  )

  // Step 3: Wait 5 minutes before sending email
  await workflow.sleep('Wait 5 minutes before welcome email', '5min')

  // Step 4: Send welcome email (RPC step - runs in queue worker)
  await workflow.do(
    'Send welcome email',
    'sendEmail',
    { to: data.email, message }
  )

  return { success: true }
})
```

Wire it to your application:

```typescript
import { wireWorkflow } from './.pikku/workflow/pikku-workflow-types.gen'
import { onboardingWorkflow } from './workflows.functions'

wireWorkflow({
  name: 'onboarding',
  description: 'User onboarding workflow',
  func: onboardingWorkflow,
  tags: ['onboarding', 'users']
})
```

Note: Execution mode (inline vs remote) is determined automatically based on whether a queue service is configured.

Start the workflow:

```typescript
// Via RPC
const runId = await rpc.startWorkflow('onboarding', {
  email: 'user@example.com',
  userId: 'user-123'
})
```

## Next Steps

- **[Getting Started](./getting-started.md)**: Set up workflows in your project
- **[Step Types](./steps.md)**: Learn about RPC, inline, and sleep steps
- **[Configuration](./configuration.md)**: Configure state storage and execution modes
