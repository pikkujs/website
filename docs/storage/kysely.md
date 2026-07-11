---
sidebar_position: 3
title: Kysely
description: Kysely-based storage backend for Pikku services with type-safe SQL
ai: true
---

# Kysely

The Kysely packages provide storage implementations using the [Kysely](https://kysely.dev/) query builder, giving you type-safe SQL across multiple databases.

| Package | Database | Driver |
|---------|----------|--------|
| `@pikku/kysely` | PostgreSQL | `postgres.js` via `kysely-postgres-js` |
| `@pikku/kysely-mysql` | MySQL | `mysql2` via `kysely` |
| `@pikku/kysely-sqlite` | SQLite | `better-sqlite3` via `kysely` |
| `@pikku/kysely-node-sqlite` | SQLite | Node's built-in `node:sqlite` |
| `@pikku/kysely-bun-sqlite` | SQLite | Bun's built-in `bun:sqlite` |

All packages export the same service interfaces — choose the one matching your database. The `node-sqlite` and `bun-sqlite` packages are dialect adapters with zero native dependencies: they provide `createNodeSqliteKysely` / `createBunSqliteKysely` helpers that return a `Kysely` instance you pass to the `SQLiteKysely*` services.

## Installation

**PostgreSQL:**
```bash
npm install @pikku/kysely kysely kysely-postgres-js postgres
```

**MySQL:**
```bash
npm install @pikku/kysely-mysql kysely mysql2
```

**SQLite:**
```bash
npm install @pikku/kysely-sqlite kysely better-sqlite3
```

**SQLite without native modules (Node / Bun built-ins):**
```bash
npm install @pikku/kysely-sqlite @pikku/kysely-node-sqlite kysely
# or on Bun
bun add @pikku/kysely-sqlite @pikku/kysely-bun-sqlite kysely
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

Provides the same methods as [`PgKyselyAIStorageService`](./postgresql#pgkyselyaistorageservice).

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

### KyselySecretService

Encrypted secret storage with envelope encryption and key rotation.

```typescript
import { KyselySecretService } from '@pikku/kysely'

const secrets = new KyselySecretService(db.kysely, {
  key: process.env.ENCRYPTION_KEY!,
  keyVersion: 1,
})
await secrets.init()
```

### KyselyCredentialService

Per-user credential storage.

```typescript
import { KyselyCredentialService } from '@pikku/kysely'

const credentialService = new KyselyCredentialService(db.kysely, {
  key: process.env.ENCRYPTION_KEY!,
})
await credentialService.init()
```

### KyselyEventHubStore

Channel topic subscription tracking.

```typescript
import { KyselyEventHubStore } from '@pikku/kysely'

const eventHubStore = new KyselyEventHubStore(db.kysely)
await eventHubStore.init()
```

### KyselySessionStore

Persists user sessions keyed by `pikkuUserId` — plugs into the `sessionStore` singleton service.

```typescript
import { KyselySessionStore } from '@pikku/kysely'

const sessionStore = new KyselySessionStore(db.kysely)
await sessionStore.init()
```

### KyselyAuditService

Durable audit event storage for functions wired with `audit: true`.

```typescript
import { KyselyAuditService } from '@pikku/kysely'

const audit = new KyselyAuditService(db.kysely)
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

## MySQL (`@pikku/kysely-mysql`)

All services from `@pikku/kysely` have MySQL equivalents with the `MySQL` prefix:

```typescript
import {
  MySQLKyselyAIStorageService,
  MySQLKyselyAgentRunService,
  MySQLKyselyWorkflowService,
  MySQLKyselyWorkflowRunService,
  MySQLKyselyChannelStore,
  MySQLKyselyEventHubStore,
  MySQLKyselyDeploymentService,
  MySQLKyselySecretService,
} from '@pikku/kysely-mysql'
```

Usage is identical to the PostgreSQL versions — pass a `Kysely<KyselyPikkuDB>` instance backed by a MySQL dialect.

## SQLite (`@pikku/kysely-sqlite`)

All services have SQLite equivalents with the `SQLite` prefix. The package also provides a helper for creating the Kysely instance:

```typescript
import Database from 'better-sqlite3'
import { createSQLiteKysely } from '@pikku/kysely-sqlite'
import {
  SQLiteKyselyAIStorageService,
  SQLiteKyselyAgentRunService,
  SQLiteKyselyWorkflowService,
  SQLiteKyselyWorkflowRunService,
  SQLiteKyselyChannelStore,
  SQLiteKyselyEventHubStore,
  SQLiteKyselyDeploymentService,
  SQLiteKyselySecretService,
} from '@pikku/kysely-sqlite'

const db = createSQLiteKysely(new Database('./pikku.db'))

const aiStorage = new SQLiteKyselyAIStorageService(db)
await aiStorage.init()
```

SQLite is used by the Cloudflare D1 integration (`@pikku/cloudflare/d1`) under the hood.

### Runtime-native SQLite drivers

If you'd rather avoid the `better-sqlite3` native module, `@pikku/kysely-node-sqlite` (Node's built-in `node:sqlite`) and `@pikku/kysely-bun-sqlite` (Bun's `bun:sqlite`) provide drop-in Kysely dialects. Pass the resulting instance to the same `SQLiteKysely*` services:

```typescript
import { createNodeSqliteKysely } from '@pikku/kysely-node-sqlite'
// or: import { createBunSqliteKysely } from '@pikku/kysely-bun-sqlite'
import { SQLiteKyselyAIStorageService } from '@pikku/kysely-sqlite'

const db = createNodeSqliteKysely({ filename: './pikku.db' })

const aiStorage = new SQLiteKyselyAIStorageService(db)
await aiStorage.init()
```

## Cleanup

```typescript
await db.close()
await sql.end()
```
