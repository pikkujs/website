# Workflow Configuration

This guide covers workflow configuration options for state storage and queue settings.

## pikku.config.json

Add workflow configuration to your Pikku config:

```json
{
  "workflows": {
    "singleQueue": true,
    "path": "src/workflows/pikku.workflows.gen.ts"
  }
}
```

### Options

- **`singleQueue`**: (boolean, required) Must be `true` during initial testing phase
- **`path`**: (string) Output path for generated workflow types

:::info Single Queue Mode
Currently, only `singleQueue: true` is supported during initial testing. This means all workflows share a single orchestrator queue job and a single worker queue job to process them.

In the future, we'll allow individual queue jobs to be created per workflow for more granular control, retries, and scaling.
:::

## State Storage

Workflows require a `workflowService` service in your singleton services. Choose between PostgreSQL or Redis.

### Option 1: PostgreSQL + pg-boss

Use PostgreSQL for both state storage and queue:

```typescript
import { PgWorkflowService } from '@pikku/pg'
import { PgBossQueueService } from '@pikku/queue-pg-boss'
import postgres from 'postgres'

export const createSingletonServices = async () => {
  const sql = postgres('postgresql://localhost:5432/myapp')

  const queueService = new PgBossQueueService('postgresql://localhost:5432/myapp')

  const workflowService = new PgWorkflowService(
    sql,
    queueService,
    'workflows' // schema name
  )

  return {
    queueService,
    workflowService,
    // ... other services
  }
}
```

The PostgreSQL state service automatically creates:
- `workflow_runs` table - stores workflow run metadata
- `workflow_step` table - stores step results and status

**For inline mode (testing)**, pass `undefined` as the queue service:
```typescript
const workflowService = new PgWorkflowService(
  sql,
  undefined, // No queue service = inline mode
  'workflows'
)
```

### Option 2: Redis + BullMQ

Use Redis for both state storage and queue:

```typescript
import { RedisWorkflowService } from '@pikku/redis'
import { BullQueueService } from '@pikku/queue-bullmq'
import { Redis } from 'ioredis'

export const createSingletonServices = async () => {
  const redis = new Redis('redis://localhost:6379')

  const queueService = new BullQueueService('redis://localhost:6379')

  const workflowService = new RedisWorkflowService(
    redis,
    queueService,
    'workflows' // key prefix
  )

  return {
    queueService,
    workflowService,
    // ... other services
  }
}
```

The Redis state service stores data in Redis hashes with the specified prefix.

**For inline mode (testing)**, pass `undefined` as the queue service:
```typescript
const workflowService = new RedisWorkflowService(
  redis,
  undefined, // No queue service = inline mode
  'workflows'
)
```

## Workflow Metadata

Configure workflow metadata when wiring:

```typescript
wireWorkflow({
  name: 'order-fulfillment',
  description: 'Process order payment, inventory, and shipping',
  func: orderFulfillmentWorkflow,
  tags: ['orders', 'fulfillment', 'payments']
})
```

### Options

- **`name`**: (string, required) Unique workflow identifier
- **`description`**: (string) Human-readable description
- **`func`**: (function, required) Workflow function
- **`tags`**: (string[]) Tags for categorization and filtering

### Execution Mode

The execution mode (inline vs remote) is determined automatically:
- **Remote mode**: Used when a `queueService` is configured in singleton services
- **Inline mode**: Used when no `queueService` is available

You don't need to specify the execution mode in the wiring configuration.

## Workflow Service API

The `workflowService` provides methods to query and interact with workflow runs:

### getRun(runId)

Get workflow run details by ID:

```typescript
export const checkWorkflowStatus = pikkuSessionlessFunc<
  { runId: string },
  { status: string; output?: any }
>(async ({ workflowService }, data) => {
  const run = await workflowService!.getRun(data.runId)

  if (!run) {
    throw new Error(`Workflow not found: ${data.runId}`)
  }

  return {
    status: run.status,        // 'running' | 'completed' | 'failed' | 'cancelled'
    output: run.output,        // Output data if completed
    error: run.error,          // Error details if failed
    createdAt: run.createdAt,  // Creation timestamp
  }
})
```

### getRunHistory(runId)

Get all step attempts for a workflow run in chronological order:

```typescript
export const getWorkflowHistory = pikkuSessionlessFunc<
  { runId: string },
  Array<any>
>(async ({ workflowService }, data) => {
  const history = await workflowService!.getRunHistory(data.runId)

  // Each entry includes:
  // - stepName: Step description
  // - status: 'succeeded' | 'failed'
  // - attemptCount: Attempt number (1, 2, 3, ...)
  // - result: Step result (if succeeded)
  // - error: Error details (if failed)
  // - createdAt: Timestamp

  return history
})
```

### Polling for Completion

Example of polling for workflow completion:

```typescript
export const triggerAndWait = pikkuSessionlessFunc<
  { input: any },
  any
>(async ({ rpc, workflowService, logger }, data) => {
  // Start workflow
  const { runId } = await rpc.startWorkflow('myWorkflow', data.input)

  // Poll for completion
  const maxAttempts = 30
  const pollIntervalMs = 1000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const run = await workflowService!.getRun(runId)

    if (!run) {
      throw new Error(`Workflow not found: ${runId}`)
    }

    if (run.status === 'completed') {
      return run.output
    }

    if (run.status === 'failed') {
      throw new Error(run.error?.message || 'Workflow failed')
    }

    if (run.status === 'cancelled') {
      throw new Error('Workflow was cancelled')
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs))
  }

  throw new Error(`Workflow timeout after ${maxAttempts} attempts`)
})
```

## Running Workflow Workers

Workflows require queue workers to execute orchestrator and step jobs. See the [workflows template](https://github.com/pikku-org/pikku-workflows/tree/main/templates/workflows) for a complete example of setting up workers.

Pikku automatically generates workers for:
- **`pikku-workflow-orchestrator`**: Executes workflow functions
- **`pikku-workflow-step-worker`**: Executes RPC steps

## Next Steps

- **[Main Guide](./index.md)**: Back to workflow overview
- **[Step Types](./steps.md)**: Learn about RPC, inline, and sleep steps
- **[Queue Documentation](/docs/queue)**: Configure queue workers
