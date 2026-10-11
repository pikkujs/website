---
sidebar_position: 3
title: Remote
description: Cross-instance function discovery and remote invocation
ai: true
---

# Remote

When your application runs across multiple instances (microservices, scaled deployments, or separate processes), Pikku's deployment service enables automatic function discovery and remote invocation between instances.

## How It Works

```
1. Each instance registers with DeploymentService (ID, endpoint, functions)
2. Instances send periodic heartbeats to stay active
3. When rpc.remote('functionName', data) is called:
   a. Pikku hands the call to DeploymentService.invoke(funcName, data, ...)
   b. The deployment service invokes the function on that instance - it owns
      resolving the target and the transport
   c. The result is returned to the caller
4. On shutdown, instances deregister themselves
```

## Setup

### 1. Mark Functions as Exposed

Functions that should be callable from other instances need `expose: true`:

```typescript @snippet rpcFunc
```

### 2. Wire an RPC Endpoint

Create an HTTP endpoint that handles incoming remote RPC calls:

```typescript @snippet wb-rpc-exposed-endpoint
```

### 3. Configure DeploymentService

Add a deployment service to your singleton services:

Construct a `DeploymentService` from the backend that suits your infrastructure (see [Available Backends](#available-backends)): `PgKyselyDeploymentService` takes the heartbeat settings, a Kysely instance, the `jwt` service used to sign forwarded sessions, and `secrets`; `RedisDeploymentService` is the Redis equivalent. Add it to your singleton services as `deploymentService` and call `init()` on it.

### 4. Register the Instance

On startup, register your instance with its endpoint and functions:

```typescript @snippet wb-rpc-deployment-start
```

The snippet above also deregisters on shutdown with `deploymentService.stop()`.

### 5. Call Remote Functions

From any instance, use `rpc.remote()` to call functions on other instances:

```typescript @snippet wb-rpc-remote-call
```

## RemoteService Interface

The service you plug in implements four methods: `init()`, `start(config)` and `stop()` manage its lifecycle, and `invoke(funcName, data, session?, traceId?)` makes the call on the owning instance and resolves to its result. `start` takes a `DeploymentConfig` with a `deploymentId`, the instance's `endpoint`, and optionally the `functions` it hosts.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `heartbeatInterval` | `number` | `10000` | Milliseconds between heartbeat updates |
| `heartbeatTtl` | `number` | `30000` | Milliseconds before a deployment is considered stale |

## Available Backends

| Backend | Package | Class | Best For |
|---------|---------|-------|----------|
| PostgreSQL (Kysely) | `@pikku/kysely-postgres` | `PgKyselyDeploymentService` | Shared PostgreSQL infrastructure |
| Redis | `@pikku/redis` | `RedisDeploymentService` | Low-latency discovery with Redis |
| MongoDB | `@pikku/mongodb` | `MongoDBDeploymentService` | MongoDB-backed discovery |
| Kysely (generic) | `@pikku/kysely` | `KyselyDeploymentService` | Type-safe SQL with any Kysely dialect |

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

A complete setup comes down to the same steps in your server's entrypoint: create the singleton services (you need `jwt` and `secrets` first), create the deployment service from them, put it back into the singleton services as `deploymentService`, start the server, and then call `deploymentService.start({ deploymentId, endpoint })` once the server is listening. Give each instance a unique `deploymentId`, for example one derived from its port.
