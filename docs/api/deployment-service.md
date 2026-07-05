---
title: DeploymentService
ai: true
---

The DeploymentService handles service discovery and remote RPC dispatch between deployments. When your functions are split across multiple deployments (e.g. an HTTP server plus a queue worker, or per-provider serverless functions), it resolves which deployment owns a function and carries the call there — including session propagation and the network transport. It is registered as the `deploymentService` singleton service.

## Interface

```typescript reference title="deployment-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/deployment-service.ts
```

## Methods

### `init(): Promise<void>`

Initializes the service (creates tables, opens connections).

### `start(config: DeploymentConfig): Promise<void>`

Registers this deployment and begins heartbeating.

- **Parameters:**
  - `config`: `{ deploymentId, endpoint, functions? }` — the deployment's ID, its reachable endpoint, and optionally the function names it serves

### `stop(): Promise<void>`

Deregisters the deployment and stops heartbeating.

### `invoke(funcName: string, data: unknown, session?: unknown, traceId?: string): Promise<unknown>`

Dispatches a remote RPC call to whichever deployment owns the function. The implementation owns the full transport: target resolution (endpoint, service binding, etc.), session propagation (JWT signing, headers), and the network call itself.

- **Parameters:**
  - `funcName`: The function to invoke
  - `data`: Input data for the function
  - `session` *(optional)*: User session to propagate
  - `traceId` *(optional)*: Trace ID to carry across the call
- **Returns:** Promise resolving to the function's output

:::info
You rarely call `invoke` yourself — `services.rpc.invoke(...)` routes through the deployment service automatically when the target function lives in another deployment.
:::

## Configuration

Database-backed implementations accept a `DeploymentServiceConfig`:

| Option | Description |
|--------|-------------|
| `heartbeatInterval` | How often (ms) this instance refreshes its liveness record |
| `heartbeatTtl` | How long (ms) before a silent instance is considered dead |

## Implementations

Database-backed (for standalone/server deployments) — see [Storage Backends](/docs/storage):

- `PgKyselyDeploymentService` — [`@pikku/kysely-postgres`](/docs/storage/postgresql)
- `KyselyDeploymentService` — [`@pikku/kysely`](/docs/storage/kysely)
- `RedisDeploymentService` — [`@pikku/redis`](/docs/storage/redis)
- `MongoDBDeploymentService` — [`@pikku/mongodb`](/docs/storage/mongodb)

Platform-native (created by the runtime adapters, using the platform's own discovery):

- `CloudflareDeploymentService` — `@pikku/cloudflare` (service bindings)
- `LambdaDeploymentService` — `@pikku/lambda`
- `AzureDeploymentService` — `@pikku/azure-functions`

## Registration

```typescript
import { PgKyselyDeploymentService } from '@pikku/kysely-postgres'

const deploymentService = new PgKyselyDeploymentService(
  { heartbeatInterval: 5000, heartbeatTtl: 15000 },
  pikkuKysely.kysely,
  singletonServices.jwt,
  singletonServices.secrets
)
await deploymentService.init()

const singletonServices = await createSingletonServices(config, {
  deploymentService,
})
```
