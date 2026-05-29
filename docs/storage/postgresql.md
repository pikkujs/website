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

**Constructor:** `new PikkuKysely(logger, connectionOrConfig, defaultSchemaName?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logger` | `Logger` | — | Logger instance |
| `connectionOrConfig` | `postgres.Sql \| postgres.Options \| string` | — | Postgres connection, options, or connection string |
| `defaultSchemaName` | `string` | — | Optional schema applied to all queries |

## Services

### PgKyselyAIStorageService

Implements both `AIStorageService` and `AIRunStateService` for AI Agent persistence.

```typescript
import { PgKyselyAIStorageService } from '@pikku/kysely-postgres'

const aiStorage = new PgKyselyAIStorageService(pikkuKysely.kysely)
await aiStorage.init() // Creates tables
```

Register in your singleton services — the same instance implements both interfaces:

```typescript
const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage, // Same instance implements both
})
```

**AIStorageService methods:**

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

**AIRunStateService methods:**

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
  PgKyselyAIStorageService,
  PgKyselyAgentRunService,
  PgKyselyWorkflowService,
} from '@pikku/kysely-postgres'
import type { KyselyPikkuDB } from '@pikku/kysely-postgres'
import { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'

const pikkuKysely = new PikkuKysely<KyselyPikkuDB>(logger, process.env.DATABASE_URL!)
await pikkuKysely.init()

const aiStorage = new PgKyselyAIStorageService(pikkuKysely.kysely)
await aiStorage.init()

const workflowService = new PgKyselyWorkflowService(pikkuKysely.kysely)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage,
  agentRunService: new PgKyselyAgentRunService(pikkuKysely.kysely),
  workflowService,
  aiAgentRunner: new VercelAIAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```

## Cleanup

Close the connection when shutting down:

```typescript
await pikkuKysely.close()
```
