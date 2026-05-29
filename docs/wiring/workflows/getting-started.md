# Getting Started with Workflows

This guide will walk you through setting up workflows in your Pikku project.

## Prerequisites

- A Pikku project with RPC and queue functionality set up
- An external state store (PostgreSQL or Redis)
- A queue service configured (see [Queue documentation](/docs/wiring/queue))

## Installation

```bash
# For PostgreSQL state storage
npm install @pikku/kysely-postgres

# For Redis state storage
npm install @pikku/redis

# Queue service (if not already installed)
npm install @pikku/queue-bullmq
# or
npm install @pikku/queue-pg-boss
```

## Configuration

### 1. (Optional) workflow queue names

Workflows work with no extra `pikku.config.json` configuration. If you want to
override the default queue names, add a `workflows` block:

```json
{
  "workflows": {
    "orchestratorQueue": "pikku-workflow-orchestrator",
    "workerQueue": "pikku-workflow-step-worker"
  }
}
```

### 2. Set up workflow state service

Add a `workflowService` to your singleton services. The execution mode is
decided automatically: if a `queueService` is also present, workflows run
remotely via queue workers; otherwise they run inline.

**PostgreSQL (Kysely):**
```typescript
import { PikkuKysely, PgKyselyWorkflowService } from '@pikku/kysely-postgres'
import type { KyselyPikkuDB } from '@pikku/kysely-postgres'

const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL!)
await pikkuKysely.init()

const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init()
```

**Redis:**
```typescript
import { RedisWorkflowService } from '@pikku/redis'

// (connection | RedisOptions | url | undefined, keyPrefix = 'workflows')
const workflowService = new RedisWorkflowService(process.env.REDIS_URL)
```

### 3. Generate workflow types

```bash
npx pikku
```

## Example: User Onboarding Workflow

Here's the workflow from the templates showing all three step types:

```typescript reference title="workflow.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/workflow.functions.ts
```

Each `pikkuWorkflowFunc` exported from a `*.workflow.ts` / functions file is discovered and registered automatically by `npx pikku` — there is no separate wiring call. The execution mode (inline vs remote) is determined automatically based on whether a queue service is configured in your singleton services.

## Running Workflows

### Start workflow workers

```bash
npm run workers
```

The CLI generates queue workers for:
- `pikku-workflow-orchestrator` - Executes workflow functions
- `pikku-workflow-step-worker` - Executes RPC steps

### Trigger a workflow

`rpc.startWorkflow` lives on the wire object (the 3rd function argument) and resolves to `{ runId }`:

```typescript
const { runId } = await rpc.startWorkflow('onboarding', {
  email: 'user@example.com',
  userId: 'user-123'
})
```

## Testing with Inline Mode

For testing, simply don't configure a queue service. When no `queueService` is available in your singleton services, workflows automatically run inline:

```typescript
// In your services setup - omit queueService for inline mode
const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  logger,
  workflowService,
  // queueService: ... (omit for inline mode)
})
```

Workflows themselves need no wiring call — exporting a `pikkuWorkflowFunc` is enough for it to be registered.

## Next Steps

- **[Step Types](./steps.md)**: Learn about RPC, inline, and sleep steps in detail
- **[Configuration](./configuration.md)**: Advanced configuration options
