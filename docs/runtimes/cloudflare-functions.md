---
title: Cloudflare Functions
description: Using Cloudflare Functions with Pikku
hide_title: true
image: /img/logos/cloudflare-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Cloudflare Functions is a serverless compute platform by Cloudflare, designed for low-latency execution at the edge.

Pikku integrates with Cloudflare Functions using the Node.js runtime via the `@pikku/cloudflare` package. It supports WebSockets, HTTP, and scheduled tasks.

There are multiple ways to deploy a function on Cloudflare. If you prefer an infrastructure-as-code approach, [Wrangler](https://developers.cloudflare.com/workers/wrangler/) is the recommended tool. 

This guide assumes you are using Wrangler for deployment, as it provides a seamless development experience, but the core principles apply regardless of method.

## Live Example

import { Stackblitz } from '@site/src/components/Stackblitz';

<Stackblitz repo="template-cloudflare-workers" initialFiles={['src/index.ts']} />

## Getting Started

### 1. Setup

To create a new Pikku project:

```bash npm2yarn
npm create pikku@latest
```

### 2. Run Locally

Start a local development server:

```bash npm2yarn
npm run start
```

This compiles the `hello-world` example and runs a local server:

```bash
[wrangler:inf] Ready on http://localhost:8787
```

To verify, run:

```bash
curl http://localhost:8787/hello-world  
```

## Deploying with Wrangler

Before deployment, ensure your Cloudflare account is configured and login via:

```bash
wrangler login
```

Then deploy:

```bash npm2yarn
npm run deploy
```

This process will set up your project and upload the function to Cloudflare’s edge network.

If successful, the output should resemble:

```bash
Your worker has access to the following bindings:
- Vars:
  - NODE_ENV: "production"
Uploaded my-app (4.63 sec)
Deployed my-app triggers (3.01 sec)
  https://my-app.<your-cloudflare-zone>.workers.dev
  schedule: * * * * 1
```

To verify the deployment, run:

```bash
curl https://my-app.<your-cloudflare-zone>.workers.dev/hello-world
```

## How Pikku Works with Cloudflare Functions

Pikku requires two key files for Cloudflare integration:

### 1. Setup services

```typescript reference title="setup-services.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/cloudflare-workers/src/setup-services.ts
```

This is a wrapper around the users `createSingletonServices`, but adds the LocalVariablesService to allow access to environment variables.

:::note
We want to make parts of the framework like this visible to the end user so they understand how things work. However, in the future this might move into a library or utility.
:::

### 2. Entry Point

```typescript reference title="index.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/cloudflare-workers/src/index.ts
```

This file acts as the entry point and routes requests to the Pikku runtime.

## Scheduled Tasks

Cloudflare Workers support cron triggers via the `scheduled` event handler:

```typescript
import { runScheduled } from '@pikku/cloudflare'

export default {
  async fetch(request, env, ctx) {
    // HTTP handling...
  },

  async scheduled(event, env, ctx) {
    const singletonServices = await setupServices(env)
    await runScheduled(event, singletonServices)
  },
}
```

Configure cron schedules in `wrangler.toml`:

```toml
[triggers]
crons = ["*/5 * * * *", "0 9 * * 1"]
```

`runScheduled` matches the cron pattern from the event against your registered scheduled tasks and executes the matching ones.

## WebSocket with Durable Objects

Cloudflare Workers support WebSocket connections using [Durable Objects](https://developers.cloudflare.com/durable-objects/) and WebSocket Hibernation:

```typescript
import { CloudflareWebSocketHibernationServer } from '@pikku/cloudflare'

export class WebSocketServer extends CloudflareWebSocketHibernationServer {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env, async (env) => {
      return setupServices(env)
    }, createWireServices)
  }
}
```

The `CloudflareWebSocketHibernationServer` abstract class handles:
- WebSocket upgrade requests
- Connection lifecycle (connect, message, disconnect, error)
- WebSocket hibernation for cost-effective idle connections
- Channel store using Durable Object storage

### wrangler.toml Configuration

```toml
[durable_objects]
bindings = [
  { name = "WEBSOCKET_SERVER", class_name = "WebSocketServer" }
]

[[migrations]]
tag = "v1"
new_classes = ["WebSocketServer"]
```

### HTTP Entry Point with WebSocket Upgrade

```typescript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Route WebSocket upgrades to Durable Object
    if (request.headers.get('Upgrade') === 'websocket') {
      const id = env.WEBSOCKET_SERVER.idFromName('default')
      const stub = env.WEBSOCKET_SERVER.get(id)
      return stub.fetch(request)
    }

    // Handle HTTP normally
    const singletonServices = await setupServices(env)
    return runFetch(request, singletonServices, createWireServices)
  },
}
```

## Environment Variables

Cloudflare Workers access environment variables through the `env` parameter rather than `process.env`. The `setupServices` helper bridges this:

```typescript
import { LocalVariablesService } from '@pikku/core/services'

export const setupServices = async (env: Record<string, string>) => {
  const config = await createConfig()
  return createSingletonServices(config, {
    variables: new LocalVariablesService(env),
  })
}
```

This maps Cloudflare's `env` bindings to Pikku's `VariablesService`, making them accessible via `variables.getVariable('MY_VAR')` in your functions.