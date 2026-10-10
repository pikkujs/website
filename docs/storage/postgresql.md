---
sidebar_position: 1
title: PostgreSQL
description: PostgreSQL storage backend for Pikku services
ai: true
---

# PostgreSQL (`@pikku/kysely-postgres`)

The `@pikku/kysely-postgres` package provides PostgreSQL implementations for all Pikku storage interfaces. It is built on [Kysely](https://kysely.dev) with the [`postgres`](https://github.com/porsager/postgres) (postgres.js) driver.

## Installation

```bash
npm install @pikku/kysely-postgres
```

## Connecting

All services take a Kysely instance. Create one with `PikkuKysely`, then pass `pikkuKysely.kysely` to each service:

Import `PikkuKysely` and the `KyselyPikkuDB` type from `@pikku/kysely-postgres`. Construct `new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL)` and `await pikkuKysely.init()`. The Kysely instance is `pikkuKysely.kysely`.

**Constructor:** `new PikkuKysely(logger, connectionOrConfig, defaultSchemaName?, poolConfig?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logger` | `Logger` | — | Logger instance |
| `connectionOrConfig` | `postgres.Sql \| postgres.Options \| string` | — | Postgres connection, options, or connection string |
| `defaultSchemaName` | `string` | — | Optional schema applied to all queries |
| `poolConfig` | `PostgresConfig` | — | Pool sizing and timeout options (see below) |

### Pool configuration

`poolConfig` maps to the `postgres` key of your Pikku config (`CoreConfig['postgres']`) and tunes the postgres.js pool. It only applies when `PikkuKysely` creates the connection itself (a connection string or options object) — if you pass an existing `postgres.Sql` instance, pool options are already fixed.

| Option | Description |
|--------|-------------|
| `maxPool` | Max connections in the pool (postgres.js default: 10) |
| `connectTimeout` | Seconds to wait establishing a new connection before failing |
| `idleTimeout` | Close a pooled connection after this many idle seconds |
| `maxLifetime` | Recycle a connection after this many seconds (guards against stale TCP connections) |
| `statementTimeout` | Server-side `statement_timeout` in ms — cancels runaway queries so they can't pin the pool |
| `prepare` | Set `false` behind a transaction-mode pooler (pgBouncer, Supabase pooler) that can't use prepared statements |

Pass an options object as the fourth argument (the third is `undefined`): `{ maxPool: 20, statementTimeout: 30_000, prepare: false }`.

## Services

### PgKyselyAgentStorageService

Implements both `AgentStorageService` and `AgentRunStateService` for AI Agent persistence.

`new PgKyselyAgentStorageService(pikkuKysely.kysely)` from `@pikku/kysely-postgres`, then `await agentStorage.init()` to create the tables.

Register in your singleton services — the same instance implements both interfaces:

Pass the same instance for both: `createSingletonServices(config, { agentStorage, agentRunState: agentStorage })`.

**AgentStorageService methods:**

| Method | Description |
|--------|-------------|
| `createThread(resourceId, options?)` | Create a new conversation thread |
| `getThread(threadId)` | Retrieve a thread by ID |
| `getThreads(resourceId)` | List all threads for a resource |
| `deleteThread(threadId)` | Delete a thread and all its messages |
| `getMessages(threadId, options?)` | Retrieve messages (supports `lastN` and `cursor` pagination) |
| `saveMessages(threadId, messages)` | Persist messages and their tool calls |
| `getWorkingMemory(id, scope)` | Get working memory for a thread or resource |
| `saveWorkingMemory(id, scope, data)` | Save working memory |

**AgentRunStateService methods:**

| Method | Description |
|--------|-------------|
| `createRun(run)` | Create a new agent run |
| `updateRun(runId, updates)` | Update run status and state |
| `getRun(runId)` | Get a run with its pending approvals |
| `getRunsByThread(threadId)` | List runs for a thread |
| `findRunByToolCallId(toolCallId)` | Find a suspended run by tool call ID |
| `resolveApproval(toolCallId, status)` | Approve or deny a pending tool call |

### PgKyselyAgentRunService

Read-only service for querying agent runs.

`new PgKyselyAgentRunService(pikkuKysely.kysely)` from `@pikku/kysely-postgres`.

**Methods:**

| Method | Description |
|--------|-------------|
| `listThreads(options?)` | List threads, optionally filtered by agent name |
| `getThread(threadId)` | Get thread details |
| `getThreadMessages(threadId)` | Get all messages in a thread |
| `getThreadRuns(threadId)` | Get all runs for a thread |
| `deleteThread(threadId)` | Delete a thread with cascade |
| `getDistinctAgentNames()` | List all registered agent names |

### PgKyselyWorkflowService

Workflow orchestration with PostgreSQL persistence.

It locks runs and steps on the [`PgKyselyLeaseService`](#pgkyselyleaseservice)
you pass it; register the same instance as `leaseService`.

Create `new PgKyselyLeaseService(pikkuKysely.kysely)` and `await init()` it. Then `new PgKyselyWorkflowService(pikkuKysely.kysely, { leaseService })` and `await workflowService.init()`, which creates the tables. Both come from `@pikku/kysely-postgres`.

### PgKyselyWorkflowRunService

Read-only service for querying workflow runs.

`new PgKyselyWorkflowRunService(pikkuKysely.kysely)` from `@pikku/kysely-postgres`.

### PgKyselyLeaseService

Named leases shared by every process on the database. The workflow engine uses
it to keep one orchestrator per run; your own functions can take it from
`leaseService`.

A lease is not a mutex. It ends when it is released or when it runs out, so a
holder that stalls past its expiry loses the key without knowing. Anything the
body writes that must not come from a stale holder should check the lease's
`token`, which rises every time the key changes hands.

Import `holdLease` from `@pikku/core/services`, and create and `init()` a `PgKyselyLeaseService`. Then call `holdLease(leaseService, 'nightly-report', async (lease, signal) => { ... })`. The lease is renewed every 10 seconds while the body runs, and a crashed holder blocks others for 30 seconds. `signal` aborts if the lease is lost while the body runs.

Leases are written and judged on the database's clock (`clock_timestamp()`),
so workers whose clocks disagree still agree on who holds a key. The table is
`pikku_lease`; `pikku db generate` writes it.

### PgKyselyChannelStore

WebSocket channel and subscription persistence.

`new PgKyselyChannelStore(pikkuKysely.kysely)` from `@pikku/kysely-postgres`, then `await channelStore.init()` to create the tables.

### PgKyselyEventHubStore

Tracks channel topic subscriptions for pub/sub across instances.

`new PgKyselyEventHubStore(pikkuKysely.kysely)` from `@pikku/kysely-postgres`.

### PgEventHubService

A full `EventHubService` implementation backed by Postgres LISTEN/NOTIFY — real-time pub/sub across multiple server instances without Redis. Each process holds one dedicated LISTEN connection; publishes fan out locally first, then NOTIFY delivers the event to every other instance's connected WebSocket clients.

`new PgEventHubService(process.env.DATABASE_URL)` from `@pikku/kysely-postgres`, then `await eventHub.init()`.

:::info
Postgres caps NOTIFY payloads at 8 kB. Keep event data small — for large payloads publish an ID and fetch the full record on the receiving side.
:::

### KyselyCredentialService

Encrypted per-user credential storage (OAuth tokens, per-user API keys), re-exported from `@pikku/kysely`.

`new KyselyCredentialService(pikkuKysely.kysely, { key })` from `@pikku/kysely-postgres`, with `key` from `ENCRYPTION_KEY`, then `await credentialService.init()`.

### PgKyselyDeploymentService

Tracks multi-instance deployments with heartbeat monitoring.

`new PgKyselyDeploymentService(...)` from `@pikku/kysely-postgres` takes four arguments: a config `{ heartbeatInterval: 5000, heartbeatTtl: 15000 }`, `pikkuKysely.kysely`, `singletonServices.jwt` and `singletonServices.secrets`. Then `await deploymentService.init()`.

## Full Example

A typical setup, in order:

1. Create `PikkuKysely<KyselyPikkuDB>` with the logger and `DATABASE_URL`, and `await init()`.
2. Create `PgKyselyAgentStorageService` over `pikkuKysely.kysely` and `init()` it.
3. Create `PgKyselyLeaseService` and `init()` it, then `PgKyselyWorkflowService` with `{ leaseService }` and `init()` that.
4. Call `createSingletonServices(config, ...)` with `agentStorage`, `agentRunState` (the same `agentStorage`), `agentRunService` (a `PgKyselyAgentRunService`), `leaseService`, `workflowService`, and an `agentRunner`: `new VercelAgentRunner({ openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }) })` using `@pikku/ai-vercel` and `@ai-sdk/openai`.

## Cleanup

Close the connection when shutting down:

On shutdown, await `pikkuKysely.close()`.
