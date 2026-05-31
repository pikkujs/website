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

`pikkuHTTPHandler` and `pikkuWebsocketHandler` each return a uWS handler that you
mount onto your own app with `app.any` / `app.ws`. Services come from Pikku's
global state, populated when you call `createSingletonServices` (and the bootstrap
import), so the handlers only need a `logger`:

```typescript
import * as uWS from 'uWebSockets.js'
import { pikkuHTTPHandler, pikkuWebsocketHandler } from '@pikku/uws-handler'

import './.pikku/pikku-bootstrap.gen.js'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const app = uWS.App()

// HTTP handler
app.any(
  '/*',
  pikkuHTTPHandler({
    logger: singletonServices.logger,
    logRoutes: true,
    loadSchemas: true,
  })
)

// WebSocket handler (optional)
app.ws(
  '/*',
  pikkuWebsocketHandler({
    logger: singletonServices.logger,
  })
)

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

await server.init()

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

The `@pikku/ws` package provides a WebSocket handler using the [`ws`](https://github.com/websockets/ws) library — attach it to your own Node HTTP server so channel upgrades work alongside your existing HTTP handling:

```bash
npm install @pikku/ws ws
```

```typescript
import { pikkuWebsocketHandler } from '@pikku/ws'
import { Server } from 'http'
import { WebSocketServer } from 'ws'

const server = new Server()
const wss = new WebSocketServer({ noServer: true })

pikkuWebsocketHandler({
  server,
  wss,
  logger: singletonServices.logger,
})

server.listen(4002, 'localhost')
```

See the [WebSocket runtime guide](./ws-handler) for the full setup.
