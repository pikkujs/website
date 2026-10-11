---
icon: http,websocket,sse
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

Import `uWebSockets.js` and the generated bootstrap, create the config and singleton services, and create `uWS.App()`. Register the HTTP handler with `app.any('/*', pikkuHTTPHandler({ logger, logRoutes: true, loadSchemas: true }))`. If you need WebSockets, add `app.ws('/*', pikkuWebsocketHandler({ logger }))`. Both handlers come from `@pikku/uws-handler`. End with `app.listen(3000, ...)`.

## Full Server (`PikkuUWSServer`)

For projects where Pikku handles everything:

```bash
npm install @pikku/uws
```

Import the generated bootstrap and `PikkuUWSServer` from `@pikku/uws`. After creating the config and singleton services, construct `new PikkuUWSServer(config, singletonServices.logger)`. The underlying uWS app is on `server.app` if you need to add your own routes. Await `server.init()`, register a `SIGINT` handler that awaits `server.stop()` and exits, and then await `server.start()`.

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

Create a plain `http` `Server` and a `WebSocketServer` from `ws` with `{ noServer: true }`. Call `pikkuWebsocketHandler({ server, wss, logger })` from `@pikku/ws`, then `server.listen(4002, 'localhost')`.

See the [WebSocket runtime guide](./ws-handler) for the full setup.
