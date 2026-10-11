---
sidebar_position: 4
title: Deployment
description: Deploy workflows with BullMQ or PG Boss queue backends
ai: true
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

The start-up sequence for BullMQ and Redis is:

1. Create a `BullServiceFactory` and `await bullFactory.init()`.
2. Create `RedisLeaseService(process.env.REDIS_URL)` and a `RedisWorkflowService(process.env.REDIS_URL, { leaseService })`.
3. Get the scheduler with `bullFactory.getSchedulerService()`.
4. Call `createSingletonServices(config, { queueService: bullFactory.getQueueService(), schedulerService, leaseService, workflowService })`.
5. Start your HTTP server (for example `PikkuExpressServer` from `@pikku/express`), importing `#pikku/pikku-bootstrap.gen.js` once at the top of the entry file.
6. Register the queues with `bullFactory.getQueueWorkers().registerQueues()`. This includes the workflow queues.
7. Start `schedulerService` and an `InMemoryTriggerService`.

### Environment

BullMQ connects to Redis via the `REDIS_URL` environment variable (defaults to `redis://localhost:6379`).

## PG Boss + PostgreSQL

Use PG Boss with `PgKyselyWorkflowService` for PostgreSQL-backed workflow state:

```bash npm2yarn
npm install @pikku/queue-pg-boss @pikku/kysely-postgres
```

The start-up sequence for PG Boss and PostgreSQL is:

1. Create a `PikkuKysely` and a `PgBossServiceFactory` from your connection string, and `init()` both.
2. Get the scheduler with `pgBossFactory.getSchedulerService()`.
3. Create `PgKyselyLeaseService(pikkuKysely.kysely)` and `init()` it, so only one orchestrator runs per run at a time across every worker.
4. Create `PgKyselyWorkflowService(pikkuKysely.kysely, { leaseService })` and `init()` it. This creates its tables.
5. Call `createSingletonServices(config, { logger, queueService: pgBossFactory.getQueueService(), schedulerService, leaseService, workflowService })`.
6. Start your HTTP server (for example `PikkuExpressServer` from `@pikku/express`), importing `#pikku/pikku-bootstrap.gen.js` once at the top of the entry file.
7. Register the queues with `pgBossFactory.getQueueWorkers().registerQueues()`. This includes the workflow queues.
8. Start `schedulerService` and an `InMemoryTriggerService`.

### Database Setup

PG Boss creates its tables automatically on `init()`. The `PgKyselyWorkflowService` also runs its schema setup on `init()`.

Set `DATABASE_URL` to your PostgreSQL connection string.

## One Orchestrator Per Run

Every step that finishes sends its run back to the orchestrator queue, so with
several workers two passes over the same run can arrive at once. Only one may
run at a time:

| State store | Lease service to pass it |
|---|---|
| `RedisWorkflowService` | `RedisLeaseService` (`@pikku/redis`) |
| `PgKyselyWorkflowService` | `PgKyselyLeaseService` (`@pikku/kysely-postgres`) |
| `MySQLKyselyWorkflowService` | `MySQLKyselyLeaseService` (`@pikku/kysely-mysql`) |
| SQLite | `KyselyLeaseService` (`@pikku/kysely`) |
| `MongoDBWorkflowService` | Any of the above; `@pikku/mongodb` ships none |

Every persistent workflow service takes the lease service as a required
constructor option, `{ leaseService }`, and locks runs and steps on it; there
are no database-specific locks underneath. Register the same instance in your
singleton services as `leaseService`. Each pass holds `workflow-run:<runId>`. A
pass that finds the run held does not fail and does not spend the queue's
retries: it wakes the run again a second later and lets the holder finish.

On the SQL stores the lease lives in the `pikku_lease` table, which
`pikku db generate` writes for any project that runs workflows. A lease is
judged by the database's clock (Redis's, for `RedisLeaseService`), never by the
clock of the worker asking, so a worker whose clock runs fast cannot take a run
another worker still holds. `InMemoryLeaseService` from `@pikku/core/services`
works for a single process only.

## Startup Order

The initialization order matters:

1. **Queue factory** — `init()` connects to Redis/PostgreSQL
2. **Lease + workflow service** — the lease service is passed to the workflow service; `init()` creates tables (PG Boss only)
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
| **State store** | `RedisWorkflowService` (`@pikku/redis`) | `PgKyselyWorkflowService` (`@pikku/kysely-postgres`) |
| **Infrastructure** | Requires Redis | Uses existing PostgreSQL |
| **Performance** | Higher throughput | ACID transactions |
| **Best for** | High-volume, low-latency jobs | When you already have PostgreSQL |
| **Monitoring** | Redis-based tools | SQL queries |

## Next Steps

- [Workflow Overview](/docs/wiring/workflows) — Core concepts and execution modes
- [Step Types](/docs/wiring/workflows/steps) — RPC, inline, and sleep steps
- [BullMQ Runtime](/docs/runtimes/bullmq) — BullServiceFactory API
- [PG Boss Runtime](/docs/runtimes/pg-boss) — PgBossServiceFactory API
