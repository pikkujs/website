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

Import the generated channel wiring in your server:

```typescript
import { createPikkuExpressApp } from '@pikku/express'
import './wirings/cli-channel.gen.js' // Import channel wiring

const app = createPikkuExpressApp({
  createConfig,
  createSingletonServices,
  createSessionServices,
})

app.listen(3000)
```

The channel is now available at `ws://localhost:3000/cli`.

## Client Usage

Set the WebSocket URL (optional, defaults to `ws://localhost:3000/cli`):

```bash
export PIKKU_WS_URL=ws://localhost:3000/cli
```

Run commands:

```bash
node .pikku/cli-remote.gen.ts greet Alice
node .pikku/cli-remote.gen.ts user create alice@example.com
```

Or add to `package.json`:

```json
{
  "scripts": {
    "cli:remote": "node .pikku/cli-remote.gen.ts"
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

## Important Note

Renderers for remote CLI must be **service-free** since they execute on the client, not the server.

```typescript
import { pikkuCLIRender } from '#pikku/cli'

// ✅ Good (no services)
export const renderer = pikkuCLIRender((_, data) => {
  console.log(data.message)
})

// ❌ Bad (uses services)
export const renderer = pikkuCLIRender((services, data) => {
  services.logger.info(data.message) // Won't work in remote CLI
})
```
