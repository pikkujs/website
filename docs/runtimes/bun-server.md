---
title: Bun
description: Run Pikku on Bun with a native Bun.serve server
ai: true
---

# Bun

`@pikku/bun-server` is a Bun-native Pikku server built on `Bun.serve`. It handles HTTP via the fetch handler and WebSockets via Bun's native websocket handler (backed by uWebSockets internally), so you get Bun's performance without writing any adapter code.

## Installation

```bash npm2yarn
npm install @pikku/bun-server
```

## Setup

```typescript title="src/start.ts"
import { PikkuBunServer, BunEventHubService } from '@pikku/bun-server'
import { InMemorySchedulerService } from '@pikku/schedule'
import { createConfig, createSingletonServices } from './services.js'
import './.pikku/pikku-bootstrap.gen.js'

async function main(): Promise<void> {
  const config = await createConfig()
  const schedulerService = new InMemorySchedulerService()
  const eventHub = new BunEventHubService()
  const singletonServices = await createSingletonServices(config, {
    schedulerService,
    eventHub,
  })

  const server = new PikkuBunServer(
    { ...config, port: 4002, hostname: 'localhost' },
    singletonServices.logger,
    { eventHub }
  )
  server.enableExitOnSignals()
  await server.init()
  await server.start()

  await schedulerService.start()
}

main()
```

`init()` compiles schemas and logs the registered routes and channels; `start()` boots `Bun.serve`. `enableExitOnSignals()` wires SIGINT/SIGTERM to a graceful shutdown that stops singleton services first.

:::warning Share the event hub
Pass the **same** `BunEventHubService` instance to both `createSingletonServices` and the server options. If they differ, a function's `eventHub.publish(...)` goes to a hub that isn't holding the live sockets, and connected WebSocket clients never receive the message.
:::

## Configuration

The server config extends `CoreConfig`:

| Option | Type | Description |
|--------|------|-------------|
| `port` | `number` | Port to listen on |
| `hostname` | `string` | Hostname to bind to (optional) |
| `healthCheckPath` | `string` | Path that returns `{"ok":true}` (optional) |

Server options (third constructor argument):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `eventHub` | `BunEventHubService` | fresh instance | Event hub backing channel pub/sub |
| `mcpJson` | `object` | `undefined` | Parsed `.pikku/mcp/mcp.gen.json` — mounts an MCP server when non-empty |
| `mcpPath` | `string` | `/mcp` | Path the MCP server is mounted at |

## Serving MCP

If your project has MCP tools, resources, or prompts, the server can mount them on the same port. Import the generated JSON statically so bundlers inline it:

```typescript title="src/start.ts"
import mcpJson from './.pikku/mcp/mcp.gen.json' with { type: 'json' }

const server = new PikkuBunServer(
  { ...config, port: 4002 },
  singletonServices.logger,
  { eventHub, mcpJson, mcpPath: '/mcp' }
)
```

`@pikku/modelcontextprotocol` is a peer dependency and is only imported dynamically when `mcpJson` is provided and non-empty.

## Supported Wirings

- **HTTP** — all routes, via the `Bun.serve` fetch handler
- **WebSocket channels** — via Bun's native websocket handler, including binary messages
- **MCP** — mounted at `mcpPath` when `mcpJson` is provided
- **Scheduled tasks** — run in-process with `InMemorySchedulerService` as shown above

## Notes

:::note
The bun template (`npm create pikku@latest` → Bun) generates this exact setup. WebSocket upgrades that fail channel authentication return `403 Forbidden` before the socket is opened.
:::
