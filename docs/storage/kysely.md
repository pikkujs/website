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
| `@pikku/kysely` | — | Dialect-agnostic services, plugins and schemas (required by all of the below) |
| `@pikku/kysely-postgres` | PostgreSQL | `postgres.js` via `kysely-postgres-js` |
| `@pikku/kysely-mysql` | MySQL | `mysql2` via `kysely` |
| `@pikku/kysely-sqlite` | SQLite | `better-sqlite3` via `kysely` |
| `@pikku/kysely-node-sqlite` | SQLite | Node's built-in `node:sqlite` |
| `@pikku/kysely-bun-sqlite` | SQLite | Bun's built-in `bun:sqlite` |

All packages export the same service interfaces — choose the one matching your database. The `node-sqlite` and `bun-sqlite` packages are dialect adapters with zero native dependencies: they provide `createNodeSqliteKysely` / `createBunSqliteKysely` helpers that return a `Kysely` instance you pass to the `SQLiteKysely*` services.

## Installation

**PostgreSQL:**
```bash
npm install @pikku/kysely @pikku/kysely-postgres kysely kysely-postgres-js postgres
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

Import `PikkuKysely` from `@pikku/kysely-postgres` and `postgres` from the `postgres` package. Create a connection with `postgres(process.env.DATABASE_URL)`, then `new PikkuKysely(logger, sql)` and `await db.init()`. The Kysely instance is `db.kysely`.

**Constructor:** `new PikkuKysely(logger, connectionOrConfig, defaultSchemaName?, poolConfig?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logger` | `Logger` | — | Pikku logger instance |
| `connectionOrConfig` | `postgres.Sql \| postgres.Options \| string` | — | Postgres connection, config object, or connection string |
| `defaultSchemaName` | `string` | — | Default schema for table creation |
| `poolConfig` | `PostgresConfig` | — | Connection pool overrides |

### KyselyAgentStorageService

Implements both `AgentStorageService` and `AgentRunStateService` for AI Agent persistence.

`new KyselyAgentStorageService(db.kysely)` from `@pikku/kysely`, then `await agentStorage.init()`.

Provides the same methods as [`PgKyselyAgentStorageService`](./postgresql#pgkyselyagentstorageservice).

### KyselyAgentRunService

Read-only agent run queries.

`new KyselyAgentRunService(db.kysely)` from `@pikku/kysely`.

### KyselyWorkflowService

Workflow orchestration with Kysely.

It locks runs and steps on the lease service you pass it — on PostgreSQL
[`PgKyselyLeaseService`](./postgresql#pgkyselyleaseservice), on MySQL
`MySQLKyselyLeaseService`, on SQLite [`KyselyLeaseService`](#kyselyleaseservice).
Register the same instance as `leaseService`.

`new KyselyWorkflowService(db.kysely, { leaseService })` from `@pikku/kysely`, then `await workflowService.init()`.

### KyselyWorkflowRunService

Read-only workflow run queries.

`new KyselyWorkflowRunService(db.kysely)` from `@pikku/kysely`.

### KyselyLeaseService

Named leases on `pikku_lease`, for SQLite. It reads the clock of
the process asking, which is only safe when every process shares one host: on
PostgreSQL use `PgKyselyLeaseService`, and on MySQL `MySQLKyselyLeaseService`,
which judge leases by the database's clock.

`new KyselyLeaseService(db.kysely)` from `@pikku/kysely`, then `await leaseService.init()`.

### KyselyChannelStore

WebSocket channel and subscription persistence.

`new KyselyChannelStore(db.kysely)` from `@pikku/kysely`, then `await channelStore.init()`.

### KyselyDeploymentService

Multi-instance deployment tracking.

`new KyselyDeploymentService(config, db.kysely)` from `@pikku/kysely`, then `await deploymentService.init()`.

### KyselySecretService

Encrypted secret storage with envelope encryption and key rotation.

`new KyselySecretService(db.kysely, { key, keyVersion })` from `@pikku/kysely`, with `key` from `ENCRYPTION_KEY` and `keyVersion: 1`, then `await secrets.init()`.

### KyselyCredentialService

Per-user credential storage.

`new KyselyCredentialService(db.kysely, { key })` from `@pikku/kysely`, with `key` from `ENCRYPTION_KEY`, then `await credentialService.init()`.

### KyselyEventHubStore

Channel topic subscription tracking.

`new KyselyEventHubStore(db.kysely)` from `@pikku/kysely`, then `await eventHubStore.init()`.

### KyselySessionStore

Persists user sessions keyed by `pikkuUserId` — plugs into the `sessionStore` singleton service.

`new KyselySessionStore(db.kysely)` from `@pikku/kysely`, then `await sessionStore.init()`.

### KyselyAuditService

Durable audit event storage for functions wired with `audit: true`.

`new KyselyAuditService(db.kysely)` from `@pikku/kysely`.

## Type-Safe Queries

The `KyselyPikkuDB` type provides full type safety for direct Kysely queries against Pikku tables:

Type your own queries against `Kysely<KyselyPikkuDB>` (both types are exported, from `kysely` and `@pikku/kysely`). Pikku's tables are available by their camelCase names, so you can, for example, select from `aiThreads` where `resourceId` equals a user id, with `selectAll().execute()`.

## Full Example

A typical Postgres setup, in order:

1. Create the connection with `postgres(process.env.DATABASE_URL)`, then `new PikkuKysely(logger, sql)` and `await db.init()`.
2. Create `KyselyAgentStorageService` over `db.kysely` and `init()` it.
3. Create `PgKyselyLeaseService` (from `@pikku/kysely-postgres`) and `init()` it, then `KyselyWorkflowService` with `{ leaseService }` and `init()` that.
4. Call `createSingletonServices(config, ...)` with `agentStorage`, `agentRunState` (the same `agentStorage` instance), `agentRunService` (a `KyselyAgentRunService`), `leaseService`, `workflowService`, and an `agentRunner`: `new VercelAgentRunner({ openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }) })` using `@pikku/ai-vercel` and `@ai-sdk/openai`.

## MySQL (`@pikku/kysely-mysql`)

All services from `@pikku/kysely` have MySQL equivalents with the `MySQL` prefix:

Import the MySQL variants from `@pikku/kysely-mysql`. Each one is the plain name prefixed with `MySQLKysely`:

- `MySQLKyselyAgentStorageService`
- `MySQLKyselyAgentRunService`
- `MySQLKyselyWorkflowService`
- `MySQLKyselyWorkflowRunService`
- `MySQLKyselyChannelStore`
- `MySQLKyselyEventHubStore`
- `MySQLKyselyDeploymentService`
- `MySQLKyselySecretService`
- `MySQLKyselyLeaseService`

Usage is identical to the PostgreSQL versions — pass a `Kysely<KyselyPikkuDB>` instance backed by a MySQL dialect:

Construct them directly over your Kysely instance `db`, without `.kysely`: `new MySQLKyselyLeaseService(db)`, then `new MySQLKyselyWorkflowService(db, { leaseService })`. `await init()` each of them.

pikku ships no MySQL migrations, and the runtime tables' `text` primary keys
are not indexable on MySQL, so create the tables yourself with `varchar` keys.
The lease table:

```sql
create table pikku_lease (
  `key` varchar(255) primary key,
  holder text not null,
  token integer not null,
  expires_at bigint not null
);
```

## SQLite (`@pikku/kysely-sqlite`)

All services have SQLite equivalents with the `SQLite` prefix. The package also provides a helper for creating the Kysely instance:

Create the database with `createSQLiteKysely(new Database('./pikku.db'))`, using `createSQLiteKysely` from `@pikku/kysely-sqlite` and `Database` from `better-sqlite3`. Then build the services over it, each with `await init()`:

- `SQLiteKyselyAgentStorageService(db)`
- `KyselyLeaseService(db)` (from `@pikku/kysely`)
- `SQLiteKyselyWorkflowService(db, { leaseService })`

The other SQLite variants are `SQLiteKyselyAgentRunService`, `SQLiteKyselyWorkflowRunService`, `SQLiteKyselyChannelStore`, `SQLiteKyselyEventHubStore`, `SQLiteKyselyDeploymentService` and `SQLiteKyselySecretService`, all from `@pikku/kysely-sqlite`.

SQLite is used by the Cloudflare D1 integration (`@pikku/cloudflare/d1`) under the hood.

### Runtime-native SQLite drivers

If you'd rather avoid the `better-sqlite3` native module, `@pikku/kysely-node-sqlite` (Node's built-in `node:sqlite`) and `@pikku/kysely-bun-sqlite` (Bun's `bun:sqlite`) provide drop-in Kysely dialects. Pass the resulting instance to the same `SQLiteKysely*` services:

Use `createNodeSqliteKysely({ filename: './pikku.db' })` from `@pikku/kysely-node-sqlite` (or `createBunSqliteKysely` from `@pikku/kysely-bun-sqlite`) to get `db`. The services are the same as for better-sqlite3: `SQLiteKyselyAgentStorageService(db)`, `KyselyLeaseService(db)` and `SQLiteKyselyWorkflowService(db, { leaseService })`, each initialised with `await init()`.

## Cleanup

On shutdown, await `db.close()` and then `sql.end()`.
