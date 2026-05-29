# Workflow Configuration

This guide covers workflow configuration options for state storage and queue settings.

## pikku.config.json

Workflows require no `pikku.config.json` configuration to work. All workflows
share a single orchestrator queue and a single step-worker queue. You only need
a `workflows` block if you want to override the default queue names:

```json
{
  "workflows": {
    "orchestratorQueue": "pikku-workflow-orchestrator",
    "workerQueue": "pikku-workflow-step-worker"
  }
}
```

### Options

- **`orchestratorQueue`**: (string, optional) Custom queue name for workflow orchestration. Default: `pikku-workflow-orchestrator`
- **`workerQueue`**: (string, optional) Custom queue name for step execution. Default: `pikku-workflow-step-worker`

:::info Single Queue Mode
All workflows currently share one orchestrator queue job and one step-worker
queue job. In the future, individual queue jobs may be created per workflow for
more granular control, retries, and scaling.
:::

## State Storage

Workflows require a `workflowService` service in your singleton services. Choose between PostgreSQL or Redis.

### Option 1: PostgreSQL + pg-boss

Use PostgreSQL for both state storage and queue. The `PgBossServiceFactory`
provides the queue service; `PgKyselyWorkflowService` provides workflow state.

```typescript
import { PikkuKysely, PgKyselyWorkflowService } from '@pikku/kysely-postgres'
import type { KyselyPikkuDB } from '@pikku/kysely-postgres'
import { PgBossServiceFactory } from '@pikku/queue-pg-boss'

export const createSingletonServices = async (config, { logger }) => {
  const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL!)
  await pikkuKysely.init()

  const pgBossFactory = new PgBossServiceFactory(process.env.DATABASE_URL!)
  await pgBossFactory.init()

  const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
  await workflowService.init()

  return {
    queueService: pgBossFactory.getQueueService(),
    workflowService,
    // ... other services
  }
}
```

The PostgreSQL state service creates its run/step tables on `init()`.

**For inline mode (testing)**, simply omit `queueService` from the returned
services — no queue service means workflows run inline.

### Option 2: Redis + BullMQ

Use Redis for both state storage and queue. The `BullServiceFactory` provides
the queue service; `RedisWorkflowService(connection, keyPrefix = 'workflows')`
provides workflow state.

```typescript
import { RedisWorkflowService } from '@pikku/redis'
import { BullServiceFactory } from '@pikku/queue-bullmq'

export const createSingletonServices = async (config, { logger }) => {
  const bullFactory = new BullServiceFactory()
  await bullFactory.init()

  // connection: Redis | RedisOptions | url | undefined
  const workflowService = new RedisWorkflowService(process.env.REDIS_URL)

  return {
    queueService: bullFactory.getQueueService(),
    workflowService,
    // ... other services
  }
}
```

The Redis state service stores data in Redis hashes with the given key prefix.

**For inline mode (testing)**, simply omit `queueService` from the returned
services — no queue service means workflows run inline.

## Execution Mode

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
>(async ({ workflowService, logger }, data, { rpc }) => {
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

Workflows require queue workers to execute orchestrator and step jobs. See the [`workflows-pg-boss`](https://github.com/pikkujs/pikku/tree/main/templates/workflows-pg-boss) and [`workflows-bullmq`](https://github.com/pikkujs/pikku/tree/main/templates/workflows-bullmq) templates for complete worker setups.

Pikku automatically generates workers for:
- **`pikku-workflow-orchestrator`**: Executes workflow functions
- **`pikku-workflow-step-worker`**: Executes RPC steps

## Next Steps

- **[Main Guide](./index.md)**: Back to workflow overview
- **[Step Types](./steps.md)**: Learn about RPC, inline, and sleep steps
- **[Queue Documentation](/docs/wiring/queue)**: Configure queue workers
