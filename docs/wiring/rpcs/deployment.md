---
sidebar_position: 3
title: Deployment & Remote RPC
description: Cross-instance function discovery and remote invocation
ai: true
---

# Deployment & Remote RPC

When your application runs across multiple instances (microservices, scaled deployments, or separate processes), Pikku's deployment service enables automatic function discovery and remote invocation between instances.

## How It Works

```
1. Each instance registers with DeploymentService (ID, endpoint, functions)
2. Instances send periodic heartbeats to stay active
3. When rpc.remote('functionName', data) is called:
   a. DeploymentService finds which instance hosts that function
   b. Pikku makes an HTTP POST to that instance's endpoint
   c. The result is returned to the caller
4. On shutdown, instances deregister themselves
```

## Setup

### 1. Mark Functions as Exposed

Functions that should be callable from other instances need `expose: true`:

```typescript
export const greet = pikkuSessionlessFunc<
  { name: string },
  { greeting: string }
>({
  expose: true,
  func: async ({ logger }, data) => {
    return { greeting: `Hello, ${data.name}!` }
  },
})
```

### 2. Wire an RPC Endpoint

Create an HTTP endpoint that handles incoming remote RPC calls:

```typescript
import { wireHTTP } from './.pikku/pikku-types.gen'

const rpcCaller = pikkuSessionlessFunc<
  { rpcName: string; data?: unknown },
  unknown
>({
  auth: false,
  func: async (_services, { rpcName, data }, { rpc }) => {
    return await rpc.exposed(rpcName, data)
  },
})

wireHTTP({
  route: '/rpc/:rpcName',
  method: 'post',
  auth: false,
  func: rpcCaller,
})
```

### 3. Configure DeploymentService

Add a deployment service to your singleton services:

```typescript
import { PgDeploymentService } from '@pikku/pg'
// or
import { RedisDeploymentService } from '@pikku/redis'

const deploymentService = new PgDeploymentService(
  { heartbeatInterval: 5000, heartbeatTtl: 15000 },
  sql
)
await deploymentService.init()
```

### 4. Register the Instance

On startup, register your instance with its endpoint and functions:

```typescript
await deploymentService.start({
  deploymentId: `server-${process.env.PORT}`,
  endpoint: `http://localhost:${process.env.PORT}`,
  functions: ['greet', 'getUserProfile'], // exposed function names
})
```

On shutdown, deregister:

```typescript
process.on('SIGTERM', async () => {
  await deploymentService.stop()
  process.exit(0)
})
```

### 5. Call Remote Functions

From any instance, use `rpc.remote()` to call functions on other instances:

```typescript
export const remoteGreet = pikkuSessionlessFunc<
  { name: string },
  { greeting: string }
>({
  func: async ({ logger }, data, { rpc }) => {
    return await rpc.remote('greet', data)
  },
})
```

## DeploymentService Interface

```typescript
interface DeploymentService {
  init(): Promise<void>
  start(config: DeploymentConfig): Promise<void>
  stop(): Promise<void>
  findFunction(name: string): Promise<DeploymentInfo[]>
}

interface DeploymentConfig {
  deploymentId: string
  endpoint: string
  functions?: string[]
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `heartbeatInterval` | `number` | `10000` | Milliseconds between heartbeat updates |
| `heartbeatTtl` | `number` | `30000` | Milliseconds before a deployment is considered stale |

## Available Backends

| Backend | Package | Best For |
|---------|---------|----------|
| PostgreSQL | `@pikku/pg` | Shared PostgreSQL infrastructure |
| Redis | `@pikku/redis` | Low-latency discovery with Redis |
| Kysely | `@pikku/kysely` | Type-safe SQL with Kysely |

See [Storage Backends](/docs/storage/) for setup details.

## RPC Methods

| Method | Description |
|--------|-------------|
| `rpc.invoke(name, data)` | Call a function in the current process |
| `rpc.remote(name, data)` | Call a function on a remote instance via DeploymentService |
| `rpc.exposed(name, data)` | Call an exposed function (enforces `expose: true`) |

## Session Forwarding

When `PIKKU_REMOTE_SECRET` is set, remote RPC calls automatically encrypt and forward the current user session. The receiving instance decrypts it using the shared secret, so remote functions execute with the caller's session context.

## Full Example

```typescript
import { PgDeploymentService } from '@pikku/pg'
import { PikkuExpressServer } from '@pikku/express'

const deploymentService = new PgDeploymentService(
  { heartbeatInterval: 5000, heartbeatTtl: 15000 },
  sql
)
await deploymentService.init()

const singletonServices = await createSingletonServices(config, {
  deploymentService,
})

const server = new PikkuExpressServer(
  { port: 3001, hostname: 'localhost' },
  singletonServices,
  createWireServices
)
await server.init()
await server.start()

await deploymentService.start({
  deploymentId: `server-3001`,
  endpoint: 'http://localhost:3001',
})
```
