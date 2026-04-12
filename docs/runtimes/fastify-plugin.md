---
title: Fastify
description: Using Pikku with Fastify
hide_title: true
image: /img/logos/fastify-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku provides two Fastify packages:

- **`@pikku/fastify-plugin`** — drop Pikku into an existing Fastify app as a plugin
- **`@pikku/fastify`** — full managed server with health checks and graceful shutdown

## Fastify Plugin

Add Pikku to an existing Fastify app. Your non-Pikku routes and plugins work alongside it.

```bash
npm install @pikku/fastify-plugin
```

```typescript
import Fastify from 'fastify'
import pikkuFastifyPlugin from '@pikku/fastify-plugin'

import './.pikku/pikku-bootstrap.gen.js'

const app = Fastify()

const singletonServices = await createSingletonServices(config)

app.register(pikkuFastifyPlugin, {
  pikku: {
    singletonServices,
    createWireServices,
    respondWith404: true,
    logRoutes: true,
    loadSchemas: true,
  }
})

// Your own Fastify routes still work
app.get('/custom', async () => ({ hello: 'world' }))

await app.listen({ port: 3000 })
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `respondWith404` | `boolean` | `true` | Return 404 for routes not matched by Pikku |
| `logRoutes` | `boolean` | `false` | Log registered Pikku routes on startup |
| `loadSchemas` | `boolean` | `false` | Load JSON schemas for validation |

## Full Server (`PikkuFastifyServer`)

For projects where Pikku handles everything:

```bash
npm install @pikku/fastify
```

```typescript
import './.pikku/pikku-bootstrap.gen.js'
import { PikkuFastifyServer } from '@pikku/fastify'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const server = new PikkuFastifyServer(config, singletonServices.logger)

// Access the underlying Fastify app if needed
// server.app.register(myPlugin)

await server.init({
  singletonServices,
  createWireServices,
  logRoutes: true,
  loadSchemas: true,
})

process.on('SIGINT', async () => {
  await server.stop()
  process.exit(0)
})

await server.start()
```

The full server config extends `CoreConfig` with:

| Option | Type | Description |
|--------|------|-------------|
| `port` | `number` | Port to listen on |
| `hostname` | `string` | Hostname to bind to |
| `healthCheckPath` | `string` | Health check endpoint (default: `/health-check`) |

The underlying Fastify `app` is exposed as `server.app` if you need to add custom plugins or routes.
