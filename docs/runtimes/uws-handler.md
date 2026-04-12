---
title: uWebSockets
description: Using Pikku with uWebSockets.js
hide_title: true
image: /img/logos/uws-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

[uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) is a high-performance HTTP and WebSocket server. Pikku provides two uWS packages:

- **`@pikku/uws-handler`** — HTTP and WebSocket handlers to plug into your own uWS app
- **`@pikku/uws`** — full managed server with health checks and graceful shutdown

## uWS Handler

Add Pikku handlers to an existing uWS app:

```bash
npm install @pikku/uws-handler
```

```typescript
import * as uWS from 'uWebSockets.js'
import { pikkuHTTPHandler, pikkuWebsocketHandler } from '@pikku/uws-handler'

import './.pikku/pikku-bootstrap.gen.js'

const app = uWS.App()
const singletonServices = await createSingletonServices(config)

// HTTP handler
pikkuHTTPHandler({
  app,
  singletonServices,
  createWireServices,
  logRoutes: true,
  loadSchemas: true,
})

// WebSocket handler (optional)
pikkuWebsocketHandler({
  app,
  singletonServices,
  createWireServices,
})

app.listen(3000, () => console.log('Listening on 3000'))
```

## Full Server (`PikkuUWSServer`)

For projects where Pikku handles everything:

```bash
npm install @pikku/uws
```

```typescript
import './.pikku/pikku-bootstrap.gen.js'
import { PikkuUWSServer } from '@pikku/uws'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const server = new PikkuUWSServer(config, singletonServices.logger)

// Access the underlying uWS app if needed
// server.app.get('/custom', ...)

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

The underlying uWS `app` is exposed as `server.app` if you need to add custom routes.

## WS (WebSocket-only)

The `@pikku/ws` package provides a standalone WebSocket server using the [`ws`](https://github.com/websockets/ws) library — useful when you want Pikku channels without a full HTTP server:

```bash
npm install @pikku/ws
```

```typescript
import { PikkuWSServer } from '@pikku/ws'
```

This is a lighter alternative when you only need WebSocket support and are handling HTTP separately.
