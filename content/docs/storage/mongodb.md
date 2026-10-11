---
sidebar_position: 4
title: MongoDB
description: MongoDB storage backend for Pikku services
ai: true
---

# MongoDB (`@pikku/mongodb`)

The `@pikku/mongodb` package provides MongoDB implementations for all Pikku storage interfaces. It uses the official [`mongodb`](https://www.npmjs.com/package/mongodb) driver.

## Installation

```bash
npm install @pikku/mongodb mongodb
```

## Setup

All MongoDB services take a `Db` instance from the MongoDB driver. Use `PikkuMongoDB` for a managed connection, or pass your own `Db` directly.

Import `PikkuMongoDB` from `@pikku/mongodb` and construct it with the logger, a connection string (`process.env.MONGODB_URI`, or an existing `MongoClient`) and a database name, then `await mongo.init()`. Every service below takes `mongo.db`.

**`PikkuMongoDB` constructor:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `logger` | `Logger` | Pikku logger instance |
| `clientOrUri` | `MongoClient \| string` | Existing client or connection URI |
| `dbName` | `string` | Database name |
| `options?` | `MongoClientOptions` | Optional driver options (only used with URI) |

If you pass a URI, `PikkuMongoDB` owns the connection and `close()` disconnects it. If you pass an existing `MongoClient`, it leaves the connection alone.

## Services

### MongoDBAgentStorageService

Implements `AgentStorageService` and `AgentRunStateService` for AI Agent persistence — threads, messages, tool calls, working memory, and agent run state.

`new MongoDBAgentStorageService(mongo.db)` from `@pikku/mongodb`, then `await agentStorage.init()`.

Register in your singleton services:

Pass the same instance for both: `createSingletonServices(config, { agentStorage, agentRunState: agentStorage })`.

### MongoDBAgentRunService

Read-only service for querying agent runs.

`new MongoDBAgentRunService(mongo.db)` from `@pikku/mongodb`.

### MongoDBWorkflowService

Implements `WorkflowService` for workflow run orchestration and step state management.

It locks runs and steps on the lease service you pass it. `@pikku/mongodb`
ships no lease service, so pair it with
[`RedisLeaseService`](./redis#redisleaseservice), a Kysely lease service, or
`InMemoryLeaseService` from `@pikku/core/services` when only one process runs.
Register the same instance as `leaseService`.

Create a `RedisLeaseService` (from `@pikku/redis`) with `process.env.REDIS_URL`, then `new MongoDBWorkflowService(mongo.db, { leaseService })` and `await workflowService.init()`.

### MongoDBWorkflowRunService

Read-only workflow run queries.

`new MongoDBWorkflowRunService(mongo.db)` from `@pikku/mongodb`.

### MongoDBChannelStore

WebSocket channel and subscription persistence.

`new MongoDBChannelStore(mongo.db)` from `@pikku/mongodb`, then `await channelStore.init()`.

### MongoDBEventHubStore

Channel topic subscription tracking for the EventHub.

`new MongoDBEventHubStore(mongo.db)` from `@pikku/mongodb`, then `await eventHubStore.init()`.

### MongoDBDeploymentService

Multi-instance deployment tracking.

`new MongoDBDeploymentService({ heartbeatInterval: 10_000, heartbeatTtl: 30_000 }, mongo.db)` from `@pikku/mongodb`, then `await deploymentService.init()`.

### MongoDBSecretService

Encrypted secret storage with envelope encryption, key rotation, and optional audit logging.

`new MongoDBSecretService(mongo.db, { key, keyVersion: 1, audit: true })` from `@pikku/mongodb`, with `key` from `ENCRYPTION_KEY`, then `await secrets.init()`.

**Config:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | — | Encryption key for envelope encryption |
| `keyVersion` | `number` | `1` | Key version (increment on rotation) |
| `previousKey` | `string` | — | Previous key for transparent re-wrapping |
| `audit` | `boolean` | `false` | Log secret write operations |
| `auditReads` | `boolean` | `false` | Also log read operations |

### MongoDBSessionStore

Persists user sessions keyed by `pikkuUserId`, so a session survives a restart
and is shared across instances.

`new MongoDBSessionStore(mongo.db)` from `@pikku/mongodb`, then `await sessionStore.init()`.

## Full Example

A complete setup, in order:

1. Create `PikkuMongoDB` with the logger, `MONGODB_URI` and a database name, and `await init()`.
2. Create `MongoDBAgentStorageService`, `MongoDBAgentRunService`, `MongoDBWorkflowRunService`, `MongoDBChannelStore` and `MongoDBEventHubStore`, each over `mongo.db`.
3. Create a `RedisLeaseService` from `REDIS_URL`, then `MongoDBWorkflowService` over `mongo.db` with `{ leaseService }`.
4. Create `MongoDBSecretService` with the encryption key.
5. Initialise everything that has an `init()` (agent storage, workflow service, channel store, event hub store, secrets) with `Promise.all`. This creates the collections and indexes.
6. Call `createSingletonServices(config, ...)` with `agentStorage`, `agentRunState` (the same `agentStorage`), `agentRunService`, `leaseService`, `workflowService`, `workflowRunService`, `channelStore`, `eventHubStore` and `secrets`.

## Collections

Most services create their own collections with appropriate indexes on `init()`. You don't need to set up any schema ahead of time — just call `init()` and MongoDB handles the rest. `MongoDBAgentRunService` and `MongoDBWorkflowRunService` have no `init()`; they read from collections the other services create.

| Service | Collections Created |
|---------|-------------------|
| `MongoDBAgentStorageService` | `agent_threads`, `agent_message`, `agent_tool_call`, `agent_working_memory`, `agent_run`, `agent_run_score` |
| `MongoDBAgentRunService` | (reads from `agent_run`) |
| `MongoDBWorkflowService` | `workflow_runs`, `workflow_steps` |
| `MongoDBWorkflowRunService` | (reads from `workflow_runs`, `workflow_steps`) |
| `MongoDBChannelStore` | `channels`, `channel_subscriptions` |
| `MongoDBEventHubStore` | `eventhub_subscriptions` |
| `MongoDBDeploymentService` | `deployments` |
| `MongoDBSecretService` | `secrets`, `secret_audit` (if audit enabled) |
