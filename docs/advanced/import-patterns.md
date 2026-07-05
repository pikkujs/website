# Import Patterns

Pikku generates a `.pikku/` directory containing typed wiring helpers, schemas, and bootstrap code. Your application code imports from a single alias — `#pikku` — which points at the generated type hub.

## Everything Comes from `#pikku`

Core function types **and** wiring functions are all exported from `#pikku`:

```typescript
import {
  // Function types
  pikkuFunc,
  pikkuSessionlessFunc,
  pikkuVoidFunc,
  pikkuMiddleware,
  pikkuPermission,
  // HTTP
  wireHTTP,
  defineHTTPRoutes,
  wireHTTPRoutes,
  addHTTPMiddleware,
  // Channels
  wireChannel,
  pikkuChannelConnectionFunc,
  // Queues, schedulers, CLI, MCP
  wireQueueWorker,
  wireScheduler,
  wireCLI,
  pikkuCLICommand,
  wireMCPResource,
  wireMCPPrompt,
} from '#pikku'
```

There are no per-transport subpaths like `#pikku/http` — the generated `pikku-types.gen.ts` file re-exports the HTTP, channel, queue, scheduler, CLI, MCP, and trigger helpers from one place.

## Configuring the Alias

The `#pikku` alias maps to `.pikku/pikku-types.gen.ts`. There are two ways to set it up, and scaffolded projects come pre-configured.

**Node.js subpath imports** in `package.json` (works at runtime and with modern TypeScript resolution):

```json
{
  "imports": {
    "#pikku": "./.pikku/pikku-types.gen.js",
    "#pikku/*": "./.pikku/*"
  }
}
```

**TypeScript path mapping** in `tsconfig.json` (type-level only — pair with a bundler or the subpath imports above):

```json
{
  "compilerOptions": {
    "paths": {
      "#pikku": ["./.pikku/pikku-types.gen.ts"]
    }
  }
}
```

Relative imports work too — some templates import directly:

```typescript
import { pikkuSessionlessFunc } from '../../.pikku/pikku-types.gen.js'
```

The alias is just a convenience; either style resolves to the same generated file.

## Generated Files Location

The `.pikku/` directory is organized by concern:

- `.pikku/pikku-types.gen.ts` – The type hub that `#pikku` points at; re-exports everything below
- `.pikku/function/` – `pikkuFunc`, middleware, and permission helpers
- `.pikku/http/`, `.pikku/channel/`, `.pikku/queue/`, `.pikku/scheduler/`, `.pikku/cli/`, `.pikku/mcp/`, `.pikku/trigger/` – Per-transport wiring helpers and metadata
- `.pikku/pikku-bootstrap.gen.ts` – Imports all your wirings; your server entry point imports this once
- `.pikku/pikku-services.gen.ts`, `.pikku/schemas/` – Service type maps and validation schemas

These files are regenerated whenever you change your functions or wirings (`pikku all`, or continuously with `pikku dev`). Don't edit them manually – they're automatically kept in sync with your source code.

See [Generated Files](/docs/pikku-cli/generated-files) for the full list of what the CLI produces.
