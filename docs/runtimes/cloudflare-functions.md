---
title: Cloudflare Workers
description: Deploy Pikku to Cloudflare Workers
hide_title: true
image: /img/logos/cloudflare-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Cloudflare Workers is a serverless compute platform designed for low-latency execution at the edge.

Pikku supports Cloudflare through two paths:

1. **`pikku deploy`** — automated deployment that provisions Workers, Queues, Cron Triggers, D1, and service bindings (recommended)
2. **`@pikku/cloudflare`** — handler adapters for manual integration with Wrangler and your own config

## Recommended: Pikku Deploy

The deploy pipeline is Cloudflare-first — it's the default provider and the most mature.

### Setup

Install the deploy adapter:

```bash
npm install @pikku/deploy-cloudflare
```

Add to your `pikku.config.json`:

```json
{
  "deploy": {
    "providers": {
      "cloudflare": "@pikku/deploy-cloudflare"
    },
    "defaultProvider": "cloudflare"
  }
}
```

Set your Cloudflare credentials:

```bash
export CLOUDFLARE_API_TOKEN=your-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
```

### Deploy

```bash
# Preview what will be created
npx pikku deploy plan

# Deploy
npx pikku deploy apply

# Check current state
npx pikku deploy info
```

The pipeline generates one Worker per deployment unit with:
- HTTP fetch handlers with routes
- Queue consumers and producers
- Cron triggers for scheduled tasks
- Service bindings between Workers (for RPC dispatch)
- D1 databases and R2 buckets (based on service requirements)
- Secrets provisioning

See the [Deploy guide](/docs/deploy) for full documentation.

## Manual Setup with `@pikku/cloudflare`

If you manage your own `wrangler.toml` and want fine-grained control, use the `@pikku/cloudflare` package directly.

### Installation

```bash
npm install @pikku/cloudflare
```

### Sub-path Exports

| Import | Description |
|--------|-------------|
| `@pikku/cloudflare` | All exports (fetch, scheduled, WebSocket, EventHub, handlers) |
| `@pikku/cloudflare/handler` | Handler factories for combined fetch/queue/scheduled workers |
| `@pikku/cloudflare/queue` | `CloudflareQueueService` — dispatches jobs via CF Queues |
| `@pikku/cloudflare/d1` | D1-backed Kysely services (workflows, AI storage, agent runs) |
| `@pikku/cloudflare/deployment` | `CloudflareDeploymentService` |
| `@pikku/cloudflare/websocket` | `CloudflareWebSocketHibernationServer` for Durable Objects |
| `@pikku/cloudflare/eventhub` | `CloudflareEventHubService` for pushing to connected clients |

### Entry Point

A basic Worker entry point with HTTP and scheduled task support:

```typescript
import '../../functions/.pikku/pikku-bootstrap.gen.js'
import { runFetch, runScheduled } from '@pikku/cloudflare'
import { LocalVariablesService, LocalSecretService } from '@pikku/core/services'
import { createConfig, createSingletonServices } from '../../functions/src/services.js'
import type { ExportedHandler, Response } from '@cloudflare/workers-types'

const setupServices = async (env: Record<string, string | undefined>) => {
  const variables = new LocalVariablesService(env)
  const config = await createConfig(variables)
  const secrets = new LocalSecretService(variables)
  return await createSingletonServices(config, { variables, secrets })
}

export default {
  async fetch(request, env): Promise<Response> {
    await setupServices(env)
    return await runFetch(request as unknown as Request)
  },

  async scheduled(controller, env) {
    await setupServices(env)
    await runScheduled(controller)
  },
} satisfies ExportedHandler<Record<string, string>>
```

`setupServices` registers the singleton services into Pikku's runtime state (via
the imported bootstrap), so `runFetch(request)` and `runScheduled(controller)`
resolve them automatically — you don't pass services into the handlers.

### Environment Variables

Cloudflare Workers access environment variables through the `env` parameter, not `process.env`. Bridge them to Pikku's `VariablesService`:

```typescript
import { LocalVariablesService } from '@pikku/core/services'

const variables = new LocalVariablesService(env)
```

### Scheduled Tasks

Configure cron triggers in `wrangler.toml`:

```toml
[triggers]
crons = ["*/5 * * * *", "0 9 * * 1"]
```

`runScheduled(controller)` matches the cron pattern from the `ScheduledController` against your registered scheduled tasks and executes the matching ones.

### WebSocket with Durable Objects

Cloudflare Workers support WebSocket via [Durable Objects](https://developers.cloudflare.com/durable-objects/) and WebSocket Hibernation:

Extend `CloudflareWebSocketHibernationServer` and override `getParams()` to
provide the singleton + wire services for each connection:

```typescript
import { CloudflareWebSocketHibernationServer, CloudflareEventHubService } from '@pikku/cloudflare'
import { createWireServices } from '../../functions/src/services.js'
import { setupServices } from './setup-services.js'

export class WebSocketHibernationServer extends CloudflareWebSocketHibernationServer {
  private singletonServices: SingletonServices | undefined

  protected async getParams() {
    if (!this.singletonServices) {
      this.singletonServices = await setupServices(this.env)
      this.singletonServices.eventHub = new CloudflareEventHubService(
        this.singletonServices.logger,
        this.ctx
      )
    }
    return { singletonServices: this.singletonServices, createWireServices }
  }
}
```

The `CloudflareWebSocketHibernationServer` handles:
- WebSocket upgrade requests
- Connection lifecycle (connect, message, disconnect, error)
- WebSocket hibernation for cost-effective idle connections
- Channel store using Durable Object storage

```toml
# wrangler.toml
[durable_objects]
bindings = [
  { name = "WEBSOCKET_HIBERNATION_SERVER", class_name = "WebSocketHibernationServer" }
]

[[migrations]]
tag = "v1"
new_classes = ["WebSocketHibernationServer"]
```

Resolve the Durable Object stub and pass it to `runFetch` as the second argument
— it detects WebSocket upgrade requests and routes them to the hibernation server:

```typescript
async fetch(request, env): Promise<Response> {
  const singletonServices = await setupServices(env)
  const durableObject: any = singletonServices.variables.get('WEBSOCKET_HIBERNATION_SERVER')
  const id = durableObject.idFromName('channel-name-goes-here')
  const webSocketHibernationServer = durableObject.get(id)
  return await runFetch(request as unknown as Request, webSocketHibernationServer)
}
```

### D1 Services

The `@pikku/cloudflare/d1` sub-path provides Kysely-backed services running on Cloudflare D1 (SQLite at the edge):

```typescript
import {
  createD1Kysely,
  CloudflareWorkflowService,
  CloudflareAIStorageService,
} from '@pikku/cloudflare/d1'

const kysely = createD1Kysely(env.MY_D1_DATABASE)
const workflowService = new CloudflareWorkflowService(kysely)
const aiStorage = new CloudflareAIStorageService(kysely)
```

### Queue Service

Dispatch jobs to Cloudflare Queues:

```typescript
import { CloudflareQueueService } from '@pikku/cloudflare/queue'

const queueService = new CloudflareQueueService(env)
```

Queue bindings are resolved from `env` by converting the queue name to `SCREAMING_SNAKE_CASE` (e.g., queue name `my-jobs` looks up `env.MY_JOBS`).

### Other Exports

| Export | Description |
|--------|-------------|
| `CloudflareQueueService` | Queue service using CF Queue producer bindings |
| `CloudflareDeploymentService` | Deployment tracking for CF Workers |
| `CloudflareEventHubService` | Push messages to connected WebSocket clients |
| `createD1Kysely` | Create a Kysely instance backed by D1 |
