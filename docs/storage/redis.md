---
sidebar_position: 2
title: Redis
description: Redis storage backend for Pikku services
ai: true
---

# Redis (`@pikku/redis`)

The `@pikku/redis` package provides Redis implementations for workflow orchestration, channel state, and deployment tracking. It uses the [`ioredis`](https://github.com/redis/ioredis) driver.

:::note
Redis does **not** provide `AgentStorageService` or `AgentRunStateService`. For AI Agent persistence, use [`@pikku/kysely-postgres`](./postgresql) or [`@pikku/kysely`](./kysely).
:::

## Installation

```bash
npm install @pikku/redis ioredis
```

## Services

### RedisWorkflowService

Workflow orchestration with Redis persistence using hashes and sorted sets.

```typescript
import { RedisLeaseService, RedisWorkflowService } from '@pikku/redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)
const leaseService = new RedisLeaseService(redis)
const workflowService = new RedisWorkflowService(redis, { leaseService })
await workflowService.init()
```

**Constructor:** `new RedisWorkflowService(connectionOrConfig, options: WorkflowServiceOptions & { keyPrefix?: string })`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `connectionOrConfig` | `Redis \| RedisOptions \| string \| undefined` | — | ioredis connection, options, or URL |
| `options.leaseService` | `LeaseService` | — | Required. Locks runs and steps; register the same instance as `leaseService` |
| `options.keyPrefix` | `string` | `'workflows'` | Key prefix for all Redis keys |
| `options.queueStrategy`, `queueConcurrency`, `queueGroupConcurrency` | `WorkflowQueueOptions` | — | Workflow queue overrides |

### RedisLeaseService

Named leases on Redis, shared by every process that uses the same server. The
workflow service takes one to keep one orchestrator per run; your own
functions can take it from `leaseService`. Every lease is judged by Redis's own
clock, so a worker whose clock runs fast can neither take a live lease nor
stretch its own.

```typescript
import { RedisLeaseService } from '@pikku/redis'

const leaseService = new RedisLeaseService(redis)
```

**Constructor:** `new RedisLeaseService(connectionOrConfig, { keyPrefix? })` —
`connectionOrConfig` is a `Redis` instance, `RedisOptions`, a URL, or
`undefined`; `keyPrefix` defaults to `'pikku'`. There is no `init()`; call
`close()` on shutdown.

### RedisWorkflowRunService

Read-only workflow run queries for the [Console](/docs/console).

```typescript
import { RedisWorkflowRunService } from '@pikku/redis'

const workflowRunService = new RedisWorkflowRunService(redis)
```

### RedisAgentRunService

Read-only agent run queries for the Console. Reads from Redis-backed AI state.

```typescript
import { RedisAgentRunService } from '@pikku/redis'

const agentRunService = new RedisAgentRunService(redis)
```

### RedisChannelStore

WebSocket channel and subscription persistence.

```typescript
import { RedisChannelStore } from '@pikku/redis'

const channelStore = new RedisChannelStore(redis)
await channelStore.init()
```

### RedisDeploymentService

Multi-instance deployment tracking with heartbeat.

```typescript
import { RedisDeploymentService } from '@pikku/redis'

const deploymentService = new RedisDeploymentService(config, redis)
await deploymentService.init()
```

### RedisSessionStore

Persists user sessions keyed by `pikkuUserId`, so a session survives a restart
and is shared across instances. The optional third argument sets a TTL in
seconds; leave it off and sessions do not expire.

```typescript
import { RedisSessionStore } from '@pikku/redis'

const sessionStore = new RedisSessionStore(redis, 'pikku', 60 * 60 * 24)
```

### RedisEventHubStore

Tracks which channels are subscribed to which topics, so a broadcast reaches
subscribers on every instance rather than only the one holding the socket.

```typescript
import { RedisEventHubStore } from '@pikku/redis'

const eventHubStore = new RedisEventHubStore(redis)
```

## Key Structure

Redis keys use the configured prefix (default `pikku:`) with the following patterns:

| Pattern | Purpose |
|---------|---------|
| `workflows:run:<id>` | Workflow run state (hash) |
| `workflows:step:<runId>:<step>` | Workflow step state (hash) |
| `workflows:step-history:<runId>` | Step execution history (sorted set) |
| `ai:thread:<id>` | AI thread data (hash) |
| `ai:threads` | Thread index by update time (sorted set) |
| `ai:messages:<threadId>` | Messages per thread (sorted set) |
| `ai:run:<id>` | Agent run data (hash) |

## Full Example

```typescript
import {
  RedisLeaseService,
  RedisWorkflowService,
  RedisChannelStore,
  RedisAgentRunService,
} from '@pikku/redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

const leaseService = new RedisLeaseService(redis)
const workflowService = new RedisWorkflowService(redis, { leaseService })
await workflowService.init()

const channelStore = new RedisChannelStore(redis)
await channelStore.init()

const singletonServices = await createSingletonServices(config, {
  leaseService,
  workflowService,
  channelStore,
  agentRunService: new RedisAgentRunService(redis),
})
```
