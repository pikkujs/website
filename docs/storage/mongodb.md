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

```typescript
import { PikkuMongoDB } from '@pikku/mongodb'

const mongo = new PikkuMongoDB(
  logger,
  process.env.MONGODB_URI!,  // or an existing MongoClient
  'my-database'
)
await mongo.init()

// Use mongo.db with any service
```

**`PikkuMongoDB` constructor:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `logger` | `Logger` | Pikku logger instance |
| `clientOrUri` | `MongoClient \| string` | Existing client or connection URI |
| `dbName` | `string` | Database name |
| `options?` | `MongoClientOptions` | Optional driver options (only used with URI) |

If you pass a URI, `PikkuMongoDB` owns the connection and `close()` disconnects it. If you pass an existing `MongoClient`, it leaves the connection alone.

## Services

### MongoDBAIStorageService

Implements `AIStorageService` and `AIRunStateService` for AI Agent persistence — threads, messages, tool calls, working memory, and agent run state.

```typescript
import { MongoDBAIStorageService } from '@pikku/mongodb'

const aiStorage = new MongoDBAIStorageService(mongo.db)
await aiStorage.init()
```

Register in your singleton services:

```typescript
const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage, // Same instance implements both
})
```

### MongoDBAgentRunService

Read-only service for querying agent runs (used by the [Console](/docs/console)).

```typescript
import { MongoDBAgentRunService } from '@pikku/mongodb'

const agentRunService = new MongoDBAgentRunService(mongo.db)
await agentRunService.init()
```

### MongoDBWorkflowService

Implements `WorkflowService` for workflow run orchestration and step state management.

```typescript
import { MongoDBWorkflowService } from '@pikku/mongodb'

const workflowService = new MongoDBWorkflowService(mongo.db)
await workflowService.init()
```

### MongoDBWorkflowRunService

Read-only workflow run queries (used by the Console).

```typescript
import { MongoDBWorkflowRunService } from '@pikku/mongodb'

const workflowRunService = new MongoDBWorkflowRunService(mongo.db)
await workflowRunService.init()
```

### MongoDBChannelStore

WebSocket channel and subscription persistence.

```typescript
import { MongoDBChannelStore } from '@pikku/mongodb'

const channelStore = new MongoDBChannelStore(mongo.db)
await channelStore.init()
```

### MongoDBEventHubStore

Channel topic subscription tracking for the EventHub.

```typescript
import { MongoDBEventHubStore } from '@pikku/mongodb'

const eventHubStore = new MongoDBEventHubStore(mongo.db)
await eventHubStore.init()
```

### MongoDBDeploymentService

Multi-instance deployment tracking.

```typescript
import { MongoDBDeploymentService } from '@pikku/mongodb'

const deploymentService = new MongoDBDeploymentService(mongo.db)
await deploymentService.init()
```

### MongoDBSecretService

Encrypted secret storage with envelope encryption, key rotation, and optional audit logging.

```typescript
import { MongoDBSecretService } from '@pikku/mongodb'

const secrets = new MongoDBSecretService(mongo.db, {
  key: process.env.ENCRYPTION_KEY!,
  keyVersion: 1,
  audit: true,
})
await secrets.init()
```

**Config:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | — | Encryption key for envelope encryption |
| `keyVersion` | `number` | `1` | Key version (increment on rotation) |
| `previousKey` | `string` | — | Previous key for transparent re-wrapping |
| `audit` | `boolean` | `false` | Log secret write operations |
| `auditReads` | `boolean` | `false` | Also log read operations |

## Full Example

```typescript
import { PikkuMongoDB } from '@pikku/mongodb'
import {
  MongoDBAIStorageService,
  MongoDBAgentRunService,
  MongoDBWorkflowService,
  MongoDBWorkflowRunService,
  MongoDBChannelStore,
  MongoDBEventHubStore,
  MongoDBSecretService,
} from '@pikku/mongodb'

const mongo = new PikkuMongoDB(logger, process.env.MONGODB_URI!, 'pikku')
await mongo.init()

const aiStorage = new MongoDBAIStorageService(mongo.db)
const agentRunService = new MongoDBAgentRunService(mongo.db)
const workflowService = new MongoDBWorkflowService(mongo.db)
const workflowRunService = new MongoDBWorkflowRunService(mongo.db)
const channelStore = new MongoDBChannelStore(mongo.db)
const eventHubStore = new MongoDBEventHubStore(mongo.db)
const secrets = new MongoDBSecretService(mongo.db, {
  key: process.env.ENCRYPTION_KEY!,
})

// Initialize all services (creates collections and indexes)
await Promise.all([
  aiStorage.init(),
  agentRunService.init(),
  workflowService.init(),
  workflowRunService.init(),
  channelStore.init(),
  eventHubStore.init(),
  secrets.init(),
])

const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage,
  agentRunService,
  workflowService,
  workflowRunService,
  channelStore,
  eventHubStore,
  secrets,
})
```

## Collections

Each service creates its own collections with appropriate indexes on `init()`. You don't need to set up any schema ahead of time — just call `init()` and MongoDB handles the rest.

| Service | Collections Created |
|---------|-------------------|
| `MongoDBAIStorageService` | `ai_threads`, `ai_messages`, `ai_tool_calls`, `ai_working_memory`, `ai_runs`, `ai_pending_approvals` |
| `MongoDBAgentRunService` | (reads from `ai_runs`) |
| `MongoDBWorkflowService` | `workflow_runs`, `workflow_steps` |
| `MongoDBWorkflowRunService` | (reads from `workflow_runs`, `workflow_steps`) |
| `MongoDBChannelStore` | `channels`, `channel_subscriptions` |
| `MongoDBEventHubStore` | `eventhub_subscriptions` |
| `MongoDBDeploymentService` | `deployments` |
| `MongoDBSecretService` | `secrets`, `secret_audit` (if audit enabled) |
