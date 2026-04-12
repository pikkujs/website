---
title: Express
description: Using Pikku with Express
hide_title: true
image: /img/logos/express-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku provides two Express packages:

- **`@pikku/express-middleware`** — drop Pikku into an existing Express app as middleware
- **`@pikku/express`** — full managed server with health checks, CORS, and graceful shutdown

## Express Middleware

Add Pikku to an existing Express app. Your non-Pikku routes and middleware work alongside it.

```bash
npm install @pikku/express-middleware
```

```typescript
import express from 'express'
import { pikkuExpressMiddleware } from '@pikku/express-middleware'

import './.pikku/pikku-bootstrap.gen.js'

const app = express()

const singletonServices = await createSingletonServices(config)

app.use(pikkuExpressMiddleware(singletonServices, createWireServices, {
  respondWith404: false,  // Let Express handle unmatched routes
  logRoutes: true,
  loadSchemas: true,
}))

// Your own Express routes still work
app.get('/custom', (req, res) => res.json({ hello: 'world' }))

app.listen(3000)
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `respondWith404` | `boolean` | `false` | Return 404 for routes not matched by Pikku (set `true` if Pikku handles all routes) |
| `logRoutes` | `boolean` | `false` | Log registered Pikku routes on startup |
| `loadSchemas` | `boolean` | `false` | Load JSON schemas for validation |

## Full Server (`PikkuExpressServer`)

For projects where Pikku handles everything, the full server provides a batteries-included setup:

```bash
npm install @pikku/express
```

```typescript
import './.pikku/pikku-bootstrap.gen.js'
import { PikkuExpressServer } from '@pikku/express'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const server = new PikkuExpressServer(config, singletonServices.logger)

// Access the underlying Express app if needed
// server.app.use(myCustomMiddleware)

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
| `limits` | `Record<string, string>` | Request size limits |
| `content` | `LocalContentConfig` | Static content serving config |

The underlying Express `app` is exposed as `server.app` if you need to add custom middleware or routes.
