---
title: WorkflowService
ai: true
---

The WorkflowService is the persistence and orchestration backend for [Workflows](/docs/wiring/workflows). It stores run and step state, drives replay and resumption, and manages workflow versions. It is registered as the `workflowService` singleton service.

Most of its methods are called by the Pikku workflow runtime, not by your functions — you define workflows with the workflow wiring and Pikku uses this service to execute them. You interact with it directly mainly to start workflows programmatically or inspect runs.

## Interface

```typescript reference title="workflow-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/workflow-service.ts
```

## Key Methods

### `startWorkflow<I>(name: string, input: I, wire: WorkflowRunWire, rpcService: any, options?): Promise<{ runId: string }>`

Starts a workflow run and returns immediately with its run ID.

- **Parameters:**
  - `name`: The wired workflow name
  - `input`: Input data for the workflow
  - `wire`: Where the run originated (used for tracing/auditing)
  - `rpcService`: The RPC service used to invoke step functions
  - `options` *(optional)*: `{ inline?: boolean, startNode?: string }`
- **Returns:** Promise resolving to `{ runId }`

### `runToCompletion<I>(name: string, input: I, rpcService: any, options?): Promise<unknown>`

Starts a workflow and polls until it finishes, returning its output.

- **Parameters:**
  - `options` *(optional)*: `{ pollIntervalMs?: number, wire?: WorkflowRunWire }`

### `getRun(id: string): Promise<WorkflowRun | null>` / `getRunStatus(id: string): Promise<WorkflowRunStatus | null>`

Fetches a run (or just its status) by ID.

### `getRunHistory(runId: string): Promise<Array<StepState & { stepName: string }>>`

Returns the executed steps of a run with their state, results, and errors.

### `getRunTimeline(id: string): Promise<RunTimeline | null>` / `reconstructRunStateAt(id, at?)`

Returns the full event timeline of a run, or reconstructs what the run state looked like at a given point in time — this powers the time-travel view in the [Console](/docs/console).

### `resumeWorkflow(runId: string): Promise<void>`

Resumes a suspended or interrupted run from its last persisted step.

## Method Groups

The rest of the interface is runtime plumbing, grouped by concern:

| Group | Methods | Called by |
|-------|---------|-----------|
| Run state | `createRun`, `updateRunStatus`, `withRunLock`, `close` | Workflow runtime |
| Orchestration | `orchestrateWorkflow`, `runWorkflowJob`, `executeWorkflowSleepCompleted`, `wireQueueWorkers` | Workflow runtime / queue workers |
| Step state | `insertStepState`, `getStepState`, `setStepRunning`, `setStepScheduled`, `setStepResult`, `setStepChildRunId`, `setStepError`, `createRetryAttempt` | Step executor |
| Step execution | `executeWorkflowStep` | Queue workers |
| Versions | `upsertWorkflowVersion`, `updateWorkflowVersionStatus`, `getWorkflowVersion`, `getAIGeneratedWorkflows` | Deploy + AI agent tooling |

## Implementations

### InMemoryWorkflowService (built-in)

In-process execution with no persistence — the default in development. Runs are lost on restart.

```typescript
import { InMemoryWorkflowService } from '@pikku/core/services'
const workflowService = new InMemoryWorkflowService()
```

```typescript reference title="in-memory-workflow-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/in-memory-workflow-service.ts
```

### Persistent backends

For durable, resumable workflows use a storage backend — see [Storage Backends](/docs/storage) for setup:

- `PgKyselyWorkflowService` — [`@pikku/kysely-postgres`](/docs/storage/postgresql)
- `KyselyWorkflowService` — [`@pikku/kysely`](/docs/storage/kysely) (MySQL/SQLite variants included)
- `RedisWorkflowService` — [`@pikku/redis`](/docs/storage/redis)
- `MongoDBWorkflowService` — [`@pikku/mongodb`](/docs/storage/mongodb)
- Cloudflare Durable Objects — `@pikku/cloudflare`

## Registration

```typescript
import { PgKyselyWorkflowService } from '@pikku/kysely-postgres'

const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  workflowService,
})
```
