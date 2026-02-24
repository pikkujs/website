---
sidebar_position: 3
title: Kysely
description: Kysely-based storage backend for Pikku services with type-safe SQL
ai: true
---

# Kysely (`@pikku/kysely`)

The `@pikku/kysely` package provides storage implementations using the [Kysely](https://kysely.dev/) query builder, giving you type-safe SQL and support for the Kysely ecosystem. It currently uses PostgreSQL via `postgres.js`.

## Installation

```bash
npm install @pikku/kysely kysely kysely-postgres-js postgres
```

## Services

### PikkuKysely

Connection manager and database abstraction. All other Kysely services require an instance of this.

```typescript
import { PikkuKysely } from '@pikku/kysely'
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!)
const db = new PikkuKysely(logger, sql)
await db.init()
```

**Constructor:** `new PikkuKysely(logger, connectionOrConfig, defaultSchemaName?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logger` | `Logger` | — | Pikku logger instance |
| `connectionOrConfig` | `postgres.Sql \| postgres.Options` | — | Postgres connection or config |
| `defaultSchemaName` | `string` | — | Default schema for table creation |

### KyselyAIStorageService

Implements both `AIStorageService` and `AIRunStateService` for AI Agent persistence.

```typescript
import { KyselyAIStorageService } from '@pikku/kysely'

const aiStorage = new KyselyAIStorageService(db.kysely)
await aiStorage.init()
```

Provides the same methods as [`PgAIStorageService`](./postgresql#pgaistorageservice).

### KyselyAgentRunService

Read-only agent run queries for the [Console](/docs/console).

```typescript
import { KyselyAgentRunService } from '@pikku/kysely'

const agentRunService = new KyselyAgentRunService(db.kysely)
```

### KyselyWorkflowService

Workflow orchestration with Kysely.

```typescript
import { KyselyWorkflowService } from '@pikku/kysely'

const workflowService = new KyselyWorkflowService(db.kysely)
await workflowService.init()
```

### KyselyWorkflowRunService

Read-only workflow run queries for the Console.

```typescript
import { KyselyWorkflowRunService } from '@pikku/kysely'

const workflowRunService = new KyselyWorkflowRunService(db.kysely)
```

### KyselyChannelStore

WebSocket channel and subscription persistence.

```typescript
import { KyselyChannelStore } from '@pikku/kysely'

const channelStore = new KyselyChannelStore(db.kysely)
await channelStore.init()
```

### KyselyDeploymentService

Multi-instance deployment tracking.

```typescript
import { KyselyDeploymentService } from '@pikku/kysely'

const deploymentService = new KyselyDeploymentService(config, db.kysely)
await deploymentService.init()
```

## Type-Safe Queries

The `KyselyPikkuDB` type provides full type safety for direct Kysely queries against Pikku tables:

```typescript
import type { KyselyPikkuDB } from '@pikku/kysely'
import type { Kysely } from 'kysely'

async function customQuery(db: Kysely<KyselyPikkuDB>) {
  return db
    .selectFrom('aiThreads')
    .where('resourceId', '=', 'user-123')
    .selectAll()
    .execute()
}
```

## Full Example

```typescript
import {
  PikkuKysely,
  KyselyAIStorageService,
  KyselyAgentRunService,
  KyselyWorkflowService,
} from '@pikku/kysely'
import { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!)
const db = new PikkuKysely(logger, sql)
await db.init()

const aiStorage = new KyselyAIStorageService(db.kysely)
await aiStorage.init()

const workflowService = new KyselyWorkflowService(db.kysely)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage,
  agentRunService: new KyselyAgentRunService(db.kysely),
  workflowService,
  aiAgentRunner: new VercelAIAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```

## Cleanup

```typescript
await db.close()
await sql.end()
```
