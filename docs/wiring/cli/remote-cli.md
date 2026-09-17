---
sidebar_position: 2
title: Remote CLI
description: Invoke remote functions via WebSocket channel
---

# Remote CLI

Remote CLI connects to a WebSocket server and executes functions remotely. Pikku automatically generates both the channel wiring and the client.

## Configuration

Add a channel entrypoint to `pikku.config.json`:

```json
{
  "cli": {
    "entrypoints": {
      "my-cli": [
        {
          "type": "channel",
          "name": "cli",
          "route": "/cli",
          "wirePath": "src/wirings/cli-channel.gen.ts",
          "path": ".pikku/cli-remote.gen.ts"
        }
      ]
    }
  }
}
```

Run `npx pikku` to generate:
- `src/wirings/cli-channel.gen.ts` - Server-side channel handler (must live in a source directory so the inspector can discover the `wireChannel()` call)
- `.pikku/cli-remote.gen.ts` - Client executable

## Server Setup

The channel wiring is generated into a source directory, so the generated bootstrap imports it — starting a Pikku server is enough to serve it. The bundled dev server serves HTTP and WebSocket channels when `@pikku/ws` and `ws` are installed:

```bash
npx pikku dev            # port 3000
# or: npx pikku serve    # no watch, no codegen
```

The channel is then available at `ws://localhost:3000/cli`.

If you run your own server, attach the WebSocket handler from `@pikku/ws`:

```typescript
import { PikkuExpressServer } from '@pikku/express'
import { WebSocketServer } from 'ws'
import { DEFAULT_WS_MAX_PAYLOAD, pikkuWebsocketHandler } from '@pikku/ws'
import { createConfig } from './config.js'
import { createSingletonServices } from './services.js'
import '#pikku/pikku-bootstrap.gen.js'

const config = await createConfig()
const singletonServices = await createSingletonServices(config)

const appServer = new PikkuExpressServer(
  { ...config, port: 4002, hostname: 'localhost' },
  singletonServices.logger
)
await appServer.init()
await appServer.start()

const wss = new WebSocketServer({
  noServer: true,
  maxPayload: DEFAULT_WS_MAX_PAYLOAD,
})
pikkuWebsocketHandler({
  server: appServer.getHttpServer(),
  wss,
  logger: singletonServices.logger,
})
```

## Client Usage

The generated client connects to `ws://localhost:4002/<route>` by default. Set `PIKKU_WS_URL` when your server is elsewhere — for example the dev server's port 3000:

```bash
export PIKKU_WS_URL=ws://localhost:3000/cli
```

Run commands:

```bash
npx tsx .pikku/cli-remote.gen.ts greet Alice
npx tsx .pikku/cli-remote.gen.ts user create alice@example.com
```

Or add to `package.json`:

```json
{
  "scripts": {
    "cli:remote": "tsx .pikku/cli-remote.gen.ts"
  }
}
```

Then run:

```bash
yarn cli:remote greet Alice
yarn cli:remote user create alice@example.com
```

## SSE Support

SSE (Server-Sent Events) support is coming soon.

## Authentication

The generated client sends credentials with the WebSocket connection: `PIKKU_API_KEY` as an `x-api-key` header if set, otherwise the token saved by `pikku login` as a bearer token. The channel requires a session unless the program sets `auth: false` on `wireCLI` — `auth` guards only this remote channel, not local runs.

## Important Note

Renderers for remote CLI run on the client, so the only service they can reach is `logger`. Reaching for any other service fails generation, because there is no service container on the client to resolve it from.

```typescript
import { pikkuCLIRender } from '#pikku/cli'

// ✅ Good (logger only)
export const renderer = pikkuCLIRender((services, data) => {
  services.logger.info(data.message)
})

// ✅ Good (no services at all)
export const renderer = pikkuCLIRender((_, data) => {
  console.log(data.message)
})

// ❌ Bad (needs a service the client doesn't have)
export const renderer = pikkuCLIRender((services, data) => {
  services.database // Generation fails
})
```
