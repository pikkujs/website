---
title: "Getting Started with Workflows"
---
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

Every persistent workflow service takes a required `leaseService`, which it
locks runs and steps on; register the same instance as `leaseService` too.

**PostgreSQL (Kysely):**
For PostgreSQL, install `@pikku/kysely-postgres` and build the services in this order:

1. `new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL!)`, then `await pikkuKysely.init()`.
2. `new PgKyselyLeaseService(pikkuKysely.kysely)`, then `await leaseService.init()`.
3. `new PgKyselyWorkflowService(pikkuKysely.kysely, { leaseService })`, then `await workflowService.init()`.

**Redis:**
For Redis, install `@pikku/redis` and construct the two services from the same connection (a Redis instance, `RedisOptions`, a URL, or `undefined`):

1. `new RedisLeaseService(process.env.REDIS_URL)`.
2. `new RedisWorkflowService(process.env.REDIS_URL, { leaseService })`. It also accepts a `keyPrefix` option (default `'workflows'`).

### 3. Generate workflow types

```bash
npx pikku
```

## Example: Order Follow-Up Workflow

Here's a workflow showing all three step types (RPC, inline and sleep):

```typescript @snippet wa-wf-quick-example
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

```typescript @snippet wa-wf-start
```

## Testing with Inline Mode

For testing, simply don't configure a queue service. When no `queueService` is available in your singleton services, workflows automatically run inline:

Build the workflow service and the lease service exactly as above, and pass `leaseService` and `workflowService` to your `createSingletonServices` call, but leave `queueService` out. With no `queueService` among the singleton services, workflows run inline.

Workflows themselves need no wiring call — exporting a `pikkuWorkflowFunc` is enough for it to be registered.

## Next Steps

- **[Step Types](/docs/wiring/workflows/steps)**: Learn about RPC, inline, and sleep steps in detail
- **[Configuration](/docs/wiring/workflows/configuration)**: Advanced configuration options
