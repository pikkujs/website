# Workflow Steps

Workflows are composed of steps. Each step represents a unit of work that can be cached and replayed. Pikku workflows support three types of steps.

## RPC Steps

RPC steps call other Pikku functions via queue workers. They execute asynchronously in separate worker processes.

### Syntax

```typescript @snippet wa-wf-rpc-step-syntax
```

### Example

```typescript @snippet wa-wf-rpc-step-example
```

### Retry Options

- **`retries`**: (number) Retry attempts after the initial failure. Total attempts = retries + 1. Default: `5` (`DEFAULT_STEP_RETRIES`).
- **`retryDelay`**: (string | number) Fixed delay between retries (`'5s'`, `'1min'`, or ms). Omitted, retried steps use exponential backoff. Pass `'exponential'` to force it.
- **`description`**: (string) Human-readable description of the step.
- **`onError`**: (string) Compensation RPC to invoke when the step ultimately fails.
- **`actor`**: (string) Actor the step runs as.

### Accessing Workflow Context in RPC Functions

RPC functions can access workflow step information through the `workflowStep` parameter:

```typescript @snippet wa-wf-workflow-step-wire
```

### When to use RPC steps

- Operations that should run in separate worker processes
- CPU-intensive tasks that benefit from horizontal scaling
- Operations that interact with external services (databases, APIs)
- Tasks that need independent retry logic

## Inline Steps

Inline steps execute code immediately within the workflow process. Results are cached for replay.

### Syntax

```typescript @snippet wa-wf-inline-step-syntax
```

### Example

```typescript @snippet wa-wf-inline-step-example
```

### When to use inline steps

- Fast operations that don't need queue workers
- Operations you want to cache and never re-execute
- Steps that should execute immediately without queue delay
- External API calls that are idempotent
- Operations that might fail and need retry logic

### Caching benefit

On replay, inline steps are never re-executed:

```typescript @snippet wa-wf-inline-caching
```

Without caching, the CRM user would be created twice!

## Sleep Steps

Sleep steps create time-based delays in workflows. They schedule the workflow to resume after a specified duration.

### Syntax

`await workflow.sleep(description, duration)`

Duration formats:
- Seconds: `'5s'`, `'30s'`, `'120s'`
- Minutes: `'5min'`, `'30min'`, `'120min'`
- Number (milliseconds): `5000` for 5 seconds

### Example

```typescript @snippet wa-wf-sleep-examples
```

### When to use sleep steps

- Delayed actions (send reminder after X days)
- Rate limiting (wait between API calls)
- Trial expirations (check status after 7 days)
- Scheduled follow-ups

## Workflow Cancellation

Workflows cancel themselves by throwing `WorkflowCancelledException`, which the
runner recognises. Its constructor takes `(runId, reason?)`.

### Syntax

`throw new WorkflowCancelledException(workflow.runId, reason)`

### Example

```typescript @snippet wa-wf-cancellation
```

When cancelled, the workflow run status is set to `'cancelled'` and execution stops immediately.

## Step Caching and Replay

All step results are cached in the workflow state. When a workflow resumes (after sleep, failure, or RPC completion), it **replays from the beginning** using cached results.

### Example: Replay behavior

```typescript @snippet wa-wf-replay
```

## Best Practices

### 1. Descriptive step names

Good: a name that says what the step does for whom, like `'Create user profile for john@example.com'`. Bad: `'Step 1'`.

### 2. Use RPC for heavy operations

Good: hand heavy computation to an RPC step, like `workflow.do('Generate report', 'generateMonthlyReport', { month: 'Jan' })`. Bad: running it inline with `workflow.do('Generate report', async () => heavyComputation())`, which blocks the orchestrator.

### 3. Don't modify step order

Once a workflow starts, don't rearrange steps:

```typescript @snippet wa-wf-step-order
```

## Next Steps

- **[Configuration](./configuration.md)**: Configure state storage and execution modes
- **[Main Guide](./index.md)**: Back to workflow overview
