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

```typescript
import { PikkuKysely } from '@pikku/kysely-postgres'
import type { KyselyPikkuDB } from '@pikku/kysely-postgres'

const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(
  logger,
  process.env.DATABASE_URL!
)
await pikkuKysely.init()
```

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

```typescript
const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(
  logger,
  process.env.DATABASE_URL!,
  undefined,
  { maxPool: 20, statementTimeout: 30_000, prepare: false }
)
```

## Services

### PgKyselyAgentStorageService

Implements both `AgentStorageService` and `AgentRunStateService` for AI Agent persistence.

```typescript
import { PgKyselyAgentStorageService } from '@pikku/kysely-postgres'

const agentStorage = new PgKyselyAgentStorageService(pikkuKysely.kysely)
await agentStorage.init() // Creates tables
```

Register in your singleton services — the same instance implements both interfaces:

```typescript
const singletonServices = await createSingletonServices(config, {
  agentStorage,
  agentRunState: agentStorage, // Same instance implements both
})
```

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

Read-only service for querying agent runs (used by the [Console](/docs/console)).

```typescript
import { PgKyselyAgentRunService } from '@pikku/kysely-postgres'

const agentRunService = new PgKyselyAgentRunService(pikkuKysely.kysely)
```

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

```typescript
import { PgKyselyWorkflowService } from '@pikku/kysely-postgres'

const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init() // Creates tables
```

### PgKyselyWorkflowRunService

Read-only service for querying workflow runs (used by the [Console](/docs/console)).

```typescript
import { PgKyselyWorkflowRunService } from '@pikku/kysely-postgres'

const workflowRunService = new PgKyselyWorkflowRunService(pikkuKysely.kysely)
```

### PgKyselyChannelStore

WebSocket channel and subscription persistence.

```typescript
import { PgKyselyChannelStore } from '@pikku/kysely-postgres'

const channelStore = new PgKyselyChannelStore(pikkuKysely.kysely)
await channelStore.init() // Creates tables
```

### PgKyselyEventHubStore

Tracks channel topic subscriptions for pub/sub across instances.

```typescript
import { PgKyselyEventHubStore } from '@pikku/kysely-postgres'

const eventHubStore = new PgKyselyEventHubStore(pikkuKysely.kysely)
```

### PgEventHubService

A full `EventHubService` implementation backed by Postgres LISTEN/NOTIFY — real-time pub/sub across multiple server instances without Redis. Each process holds one dedicated LISTEN connection; publishes fan out locally first, then NOTIFY delivers the event to every other instance's connected WebSocket clients.

```typescript
import { PgEventHubService } from '@pikku/kysely-postgres'

const eventHub = new PgEventHubService(process.env.DATABASE_URL!)
await eventHub.init()
```

:::info
Postgres caps NOTIFY payloads at 8 kB. Keep event data small — for large payloads publish an ID and fetch the full record on the receiving side.
:::

### KyselyCredentialService

Encrypted per-user credential storage (OAuth tokens, per-user API keys), re-exported from `@pikku/kysely`.

```typescript
import { KyselyCredentialService } from '@pikku/kysely-postgres'

const credentialService = new KyselyCredentialService(pikkuKysely.kysely, {
  key: process.env.ENCRYPTION_KEY!,
})
await credentialService.init()
```

### PgKyselyDeploymentService

Tracks multi-instance deployments with heartbeat monitoring.

```typescript
import { PgKyselyDeploymentService } from '@pikku/kysely-postgres'

const deploymentService = new PgKyselyDeploymentService(
  { heartbeatInterval: 5000, heartbeatTtl: 15000 },
  pikkuKysely.kysely,
  singletonServices.jwt,
  singletonServices.secrets
)
await deploymentService.init()
```

## Full Example

```typescript
import {
  PikkuKysely,
  PgKyselyAgentStorageService,
  PgKyselyAgentRunService,
  PgKyselyWorkflowService,
} from '@pikku/kysely-postgres'
import type { KyselyPikkuDB } from '@pikku/kysely-postgres'
import { VercelAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'

const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL!)
await pikkuKysely.init()

const agentStorage = new PgKyselyAgentStorageService(pikkuKysely.kysely)
await agentStorage.init()

const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  agentStorage,
  agentRunState: agentStorage,
  agentRunService: new PgKyselyAgentRunService(pikkuKysely.kysely),
  workflowService,
  agentRunner: new VercelAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```

## Cleanup

Close the connection when shutting down:

```typescript
await pikkuKysely.close()
```
