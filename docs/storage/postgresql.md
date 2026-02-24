---
sidebar_position: 1
title: PostgreSQL
description: PostgreSQL storage backend for Pikku services
ai: true
---

# PostgreSQL (`@pikku/pg`)

The `@pikku/pg` package provides PostgreSQL implementations for all Pikku storage interfaces. It uses the [`postgres`](https://github.com/porsager/postgres) (postgres.js) driver.

## Installation

```bash
npm install @pikku/pg postgres
```

## Services

### PgAIStorageService

Implements both `AIStorageService` and `AIRunStateService` for AI Agent persistence.

```typescript
import { PgAIStorageService } from '@pikku/pg'
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!)
const aiStorage = new PgAIStorageService(sql)
await aiStorage.init() // Creates tables
```

Register in your singleton services:

```typescript
const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage, // Same instance implements both
})
```

**Constructor:** `new PgAIStorageService(connectionOrConfig, schemaName?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `connectionOrConfig` | `postgres.Sql \| postgres.Options` | — | Postgres connection or config |
| `schemaName` | `string` | `'pikku_ai'` | Database schema name |

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

### PgAgentRunService

Read-only service for querying agent runs (used by the [Console](/docs/console)).

```typescript
import { PgAgentRunService } from '@pikku/pg'

const agentRunService = new PgAgentRunService(sql, 'pikku_ai')
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

### PgWorkflowService

Workflow orchestration with PostgreSQL persistence.

```typescript
import { PgWorkflowService } from '@pikku/pg'

const workflowService = new PgWorkflowService(sql)
await workflowService.init() // Creates tables
```

### PgWorkflowRunService

Read-only service for querying workflow runs (used by the [Console](/docs/console)).

```typescript
import { PgWorkflowRunService } from '@pikku/pg'

const workflowRunService = new PgWorkflowRunService(sql, 'pikku_workflow')
```

### PgChannelStore

WebSocket channel and subscription persistence.

```typescript
import { PgChannelStore } from '@pikku/pg'

const channelStore = new PgChannelStore(sql)
await channelStore.init() // Creates tables
```

### PgDeploymentService

Tracks multi-instance deployments with heartbeat monitoring.

```typescript
import { PgDeploymentService } from '@pikku/pg'

const deploymentService = new PgDeploymentService(config, sql)
await deploymentService.init()
```

## Full Example

```typescript
import { PgAIStorageService, PgAgentRunService, PgWorkflowService } from '@pikku/pg'
import { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!)

const aiStorage = new PgAIStorageService(sql)
await aiStorage.init()

const workflowService = new PgWorkflowService(sql)
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage,
  agentRunService: new PgAgentRunService(sql),
  workflowService,
  aiAgentRunner: new VercelAIAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```

## Cleanup

Close the connection when shutting down:

```typescript
await aiStorage.close()
await sql.end()
```
