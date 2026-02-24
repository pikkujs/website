---
sidebar_position: 4
title: Deployment
description: Deploy workflows with BullMQ or PG Boss queue backends
---

# Workflow Deployment

Workflows require a queue service and a workflow state store to run in production. This guide shows complete deployment setups with both BullMQ (Redis) and PG Boss (PostgreSQL).

## Architecture

A production workflow deployment has three components:

1. **HTTP Server** — handles API requests and starts workflows via `rpc.startWorkflow()`
2. **Queue Workers** — processes orchestrator and step worker jobs
3. **State Store** — persists workflow runs and step results (PostgreSQL or Redis)

All three typically run in the same process for simplicity, but can be split for horizontal scaling.

## BullMQ + Redis

Use BullMQ with `RedisWorkflowService` for Redis-backed workflow state:

```bash npm2yarn
npm install @pikku/queue-bullmq @pikku/redis
```

```typescript
import { PikkuExpressServer } from '@pikku/express'
import { BullServiceFactory } from '@pikku/queue-bullmq'
import { RedisWorkflowService } from '@pikku/redis'
import { InMemoryTriggerService } from '@pikku/core/services'
import { createSchedulerRuntimeHandlers } from '@pikku/core/scheduler'
import {
  createConfig,
  createWireServices,
  createSingletonServices,
} from './services.js'
import './.pikku/pikku-bootstrap.gen.js'

async function main() {
  const config = await createConfig()

  // 1. Initialize BullMQ
  const bullFactory = new BullServiceFactory()
  await bullFactory.init()

  // 2. Create workflow state store (Redis-backed)
  const workflowService = new RedisWorkflowService(undefined)

  // 3. Create scheduler
  const schedulerService = bullFactory.getSchedulerService()

  // 4. Build singleton services
  const singletonServices = await createSingletonServices(config, {
    queueService: bullFactory.getQueueService(),
    schedulerService,
    workflowService,
  })

  // 5. Wire scheduler and workflow services
  schedulerService.setServices(
    createSchedulerRuntimeHandlers({
      singletonServices,
      createWireServices,
    })
  )
  workflowService.setServices(singletonServices, createWireServices, config)

  // 6. Start HTTP server
  const appServer = new PikkuExpressServer(
    { ...config, port: 4002, hostname: 'localhost' },
    singletonServices,
    createWireServices
  )
  appServer.enableExitOnSigInt()
  await appServer.init()
  await appServer.start()

  // 7. Register and start queue workers
  const bullQueueWorkers = bullFactory.getQueueWorkers(
    singletonServices,
    createWireServices
  )
  await bullQueueWorkers.registerQueues()

  // 8. Start triggers and scheduler
  const triggerService = new InMemoryTriggerService()
  triggerService.setServices(singletonServices)
  await schedulerService.start()
  await triggerService.start()
}

main()
```

### Environment

BullMQ connects to Redis via the `REDIS_URL` environment variable (defaults to `redis://localhost:6379`).

## PG Boss + PostgreSQL

Use PG Boss with `PgWorkflowService` for PostgreSQL-backed workflow state:

```bash npm2yarn
npm install @pikku/queue-pg-boss @pikku/pg postgres
```

```typescript
import { PikkuExpressServer } from '@pikku/express'
import { PgBossServiceFactory } from '@pikku/queue-pg-boss'
import { PgWorkflowService } from '@pikku/pg'
import { InMemoryTriggerService } from '@pikku/core/services'
import { createSchedulerRuntimeHandlers } from '@pikku/core/scheduler'
import postgres from 'postgres'
import {
  createConfig,
  createWireServices,
  createSingletonServices,
} from './services.js'
import './.pikku/pikku-bootstrap.gen.js'

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:password@localhost:5432/pikku_queue'

async function main() {
  const config = await createConfig()

  // 1. Initialize PG Boss
  const sql = postgres(connectionString)
  const pgBossFactory = new PgBossServiceFactory(connectionString)
  await pgBossFactory.init()

  // 2. Create workflow state store (PostgreSQL-backed)
  const workflowService = new PgWorkflowService(sql)
  await workflowService.init()

  // 3. Create scheduler
  const schedulerService = pgBossFactory.getSchedulerService()

  // 4. Build singleton services
  const singletonServices = await createSingletonServices(config, {
    queueService: pgBossFactory.getQueueService(),
    schedulerService,
    workflowService,
  })

  // 5. Wire scheduler and workflow services
  schedulerService.setServices(
    createSchedulerRuntimeHandlers({
      singletonServices,
      createWireServices,
    })
  )
  workflowService.setServices(singletonServices, createWireServices, config)

  // 6. Start HTTP server
  const appServer = new PikkuExpressServer(
    { ...config, port: 4002, hostname: 'localhost' },
    singletonServices,
    createWireServices
  )
  appServer.enableExitOnSigInt()
  await appServer.init()
  await appServer.start()

  // 7. Register and start queue workers
  const pgBossQueueWorkers = pgBossFactory.getQueueWorkers(
    singletonServices,
    createWireServices
  )
  await pgBossQueueWorkers.registerQueues()

  // 8. Start triggers and scheduler
  await schedulerService.start()
  const triggerService = new InMemoryTriggerService()
  triggerService.setServices(singletonServices)
  await triggerService.start()
}

main()
```

### Database Setup

PG Boss creates its tables automatically on `init()`. The `PgWorkflowService` also runs its schema setup on `init()`.

Set `DATABASE_URL` to your PostgreSQL connection string.

## Startup Order

The initialization order matters:

1. **Queue factory** — `init()` connects to Redis/PostgreSQL
2. **Workflow service** — `init()` creates tables (PG Boss only)
3. **Singleton services** — wires everything together
4. **Scheduler + workflow setServices** — connects to singleton services
5. **HTTP server** — starts accepting requests
6. **Queue workers** — `registerQueues()` starts processing jobs
7. **Triggers + scheduler** — `start()` begins scheduled tasks

## Queue Workers

The Pikku CLI generates two internal queues for workflow execution:

| Queue | Purpose |
|-------|---------|
| `pikku-workflow-orchestrator` | Runs the workflow function, executing steps in order |
| `pikku-workflow-step-worker` | Executes individual RPC steps |

These are registered automatically when you call `registerQueues()`. Your custom queue workers (defined via `wireQueueWorker`) are also registered at the same time.

## Choosing a Backend

| | BullMQ + Redis | PG Boss + PostgreSQL |
|---|---|---|
| **State store** | `RedisWorkflowService` | `PgWorkflowService` |
| **Infrastructure** | Requires Redis | Uses existing PostgreSQL |
| **Performance** | Higher throughput | ACID transactions |
| **Best for** | High-volume, low-latency jobs | When you already have PostgreSQL |
| **Monitoring** | Redis-based tools | SQL queries |

## Next Steps

- [Workflow Overview](./index.md) — Core concepts and execution modes
- [Step Types](./steps.md) — RPC, inline, and sleep steps
- [BullMQ Runtime](../../runtimes/bullmq.md) — BullServiceFactory API
- [PG Boss Runtime](../../runtimes/pg-boss.md) — PgBossServiceFactory API
