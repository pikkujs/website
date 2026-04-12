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
import './.pikku/pikku-bootstrap.gen.js'
import { runFetch, runScheduled } from '@pikku/cloudflare'
import { LocalVariablesService } from '@pikku/core/services'

let cachedServices: SingletonServices | undefined

const setupServices = async (env: Record<string, string>) => {
  if (!cachedServices) {
    const variables = new LocalVariablesService(env)
    const config = await createConfig(variables)
    cachedServices = await createSingletonServices(config, { variables })
  }
  return cachedServices
}

export default {
  async fetch(request: Request, env: any) {
    const services = await setupServices(env)
    return runFetch(request, services, createWireServices)
  },

  async scheduled(event: ScheduledEvent, env: any) {
    const services = await setupServices(env)
    await runScheduled(event, services)
  },
}
```

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

`runScheduled` matches the cron pattern from the event against your registered scheduled tasks and executes the matching ones.

### WebSocket with Durable Objects

Cloudflare Workers support WebSocket via [Durable Objects](https://developers.cloudflare.com/durable-objects/) and WebSocket Hibernation:

```typescript
import { CloudflareWebSocketHibernationServer } from '@pikku/cloudflare/websocket'

export class WebSocketServer extends CloudflareWebSocketHibernationServer {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env, async (env) => {
      return setupServices(env)
    }, createWireServices)
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
  { name = "WEBSOCKET_SERVER", class_name = "WebSocketServer" }
]

[[migrations]]
tag = "v1"
new_classes = ["WebSocketServer"]
```

Route WebSocket upgrades in your fetch handler:

```typescript
async fetch(request: Request, env: any) {
  if (request.headers.get('Upgrade') === 'websocket') {
    const id = env.WEBSOCKET_SERVER.idFromName('default')
    const stub = env.WEBSOCKET_SERVER.get(id)
    return stub.fetch(request)
  }

  const services = await setupServices(env)
  return runFetch(request, services, createWireServices)
}
```

### D1 Services

The `@pikku/cloudflare/d1` sub-path provides Kysely-backed services running on Cloudflare D1 (SQLite at the edge):

```typescript
import { createD1Kysely, createD1WorkflowService, createD1AIStorageService } from '@pikku/cloudflare/d1'

const kysely = createD1Kysely(env.MY_D1_DATABASE)
const workflowService = createD1WorkflowService(kysely)
const aiStorage = createD1AIStorageService(kysely)
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
