---
title: Node HTTP
description: Run Pikku on plain node:http — the default server behind pikku dev and container deploys
ai: true
---

# Node HTTP

`@pikku/node-http-server` is a plain `node:http`-based Pikku server with no framework dependency. It's what `pikku dev` and container deployments use under the hood, and it ships with production hardening out of the box: header/request timeouts, keep-alive tuning, per-socket request caps, and a graceful drain on shutdown.

:::info When to use it
Not optimised for raw throughput — when traffic terminates at this server directly (public ingress, hot path), prefer [`@pikku/uws`](./uws-handler.md). When something sits in front — Cloudflare, a load balancer, the `pikku dev` proxy — this is the right default.
:::

## Installation

```bash npm2yarn
npm install @pikku/node-http-server
```

## Setup

```typescript title="src/start.ts"
import { PikkuNodeHTTPServer } from '@pikku/node-http-server'
import { createConfig, createSingletonServices } from './services.js'
import './.pikku/pikku-bootstrap.gen.js'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const server = new PikkuNodeHTTPServer(
  { ...config, port: 3000, hostname: '0.0.0.0', healthCheckPath: '/health-check' },
  singletonServices.logger
)
server.enableExitOnSignals()
await server.init()
await server.start()
```

## Configuration

The server config extends `CoreConfig` with hardening defaults tuned for running behind a load balancer:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | `number` | — | Port to listen on |
| `hostname` | `string` | — | Hostname to bind to |
| `healthCheckPath` | `string` | `undefined` | Path that returns `{"ok":true}` |
| `content` | `LocalContentConfig` | `undefined` | Enable local file upload/asset serving |
| `headersTimeout` | `number` | `30000` | Max wait for request headers (slowloris mitigation) |
| `requestTimeout` | `number` | `30000` | Max wait for the entire request |
| `keepAliveTimeout` | `number` | `65000` | Idle keep-alive hold — longer than typical LB idle timeouts (CF / AWS ALB / GCP) to avoid connection-reuse races |
| `maxRequestsPerSocket` | `number` | `1000` | Requests per socket before forced close |
| `shutdownGracePeriodMs` | `number` | `10000` | Grace period before force-closing in-flight connections on `stop()` |

## Server Options

The third constructor argument:

| Option | Type | Description |
|--------|------|-------------|
| `configureServer` | `(server: http.Server) => void` | Attach extra listeners before start — e.g. WebSocket upgrades via [`@pikku/ws`](./ws-handler.md) |
| `mcpJson` | `object` | Parsed `.pikku/mcp/mcp.gen.json` — mounts an MCP server when non-empty |
| `mcpPath` | `string` | Path the MCP server is mounted at (default `/mcp`) |
| `dispatchJobs` | `boolean` | Mount `POST /__pikku/queue-job` and `/__pikku/scheduler-job` so a trusted dispatcher can deliver queue jobs and scheduled tasks to this container |
| `dispatchSecret` | `string` | Shared secret required in the `x-pikku-dispatch` header on the dispatch routes |

### WebSockets

The server itself only handles HTTP. Add channels by hooking the upgrade event:

```typescript title="src/start.ts"
import { WebSocketServer } from 'ws'
import { pikkuWebsocketHandler } from '@pikku/ws'

const server = new PikkuNodeHTTPServer(config, logger, {
  configureServer: (httpServer) => {
    const wss = new WebSocketServer({ noServer: true })
    pikkuWebsocketHandler({ server: httpServer, wss, logger })
  },
})
```

See [WS Handler](./ws-handler.md) for the full WebSocket setup.

### Dispatch routes

When a container target has no platform queue or cron binding of its own, a trusted dispatcher (e.g. Pikku Fabric) can deliver jobs over HTTP. Always set a secret — without one the routes accept any caller and a warning is logged at startup:

```typescript
const server = new PikkuNodeHTTPServer(config, logger, {
  dispatchJobs: true,
  dispatchSecret: await singletonServices.secrets.getSecret('PIKKU_DISPATCH_SECRET'),
})
```

Responses follow the worker contract: `204` acknowledged, `422` don't retry (missing meta / discarded), `503` retry, `401` bad secret.

### Local content

Setting `content` enables a filesystem-backed content service: `PUT` uploads under `uploadUrlPrefix` and signed-URL-validated `GET`s under `assetUrlPrefix`, with path-traversal protection and a configurable `sizeLimit`. Signed URLs are verified against the `jwt` service when one is registered.

## Supported Wirings

- **HTTP** — all routes
- **WebSocket channels** — via `configureServer` + `@pikku/ws`
- **MCP** — mounted at `mcpPath` when `mcpJson` is provided
- **Queue / Scheduled tasks** — via the dispatch routes, or in-process services

## Graceful Shutdown

`stop()` drains cleanly: it stops accepting connections, drops idle keep-alive sockets immediately, and force-closes anything still in flight after `shutdownGracePeriodMs`. `enableExitOnSignals()` runs this on SIGINT/SIGTERM after stopping singleton services.
