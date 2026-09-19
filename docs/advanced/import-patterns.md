---
title: Import Patterns
description: How the generated `.pikku` directory is laid out and how `#pikku/*` resolves onto it
---

# Import Patterns

Pikku's CLI generates a `.pikku/` directory, and your code reaches it through the
`#pikku/*` subpath alias. There is one barrel per concern — a **door** — and you
import from the door for the thing you are doing.

## One door per concern

```typescript
import { pikkuFunc, pikkuSessionlessFunc } from '#pikku/function'
import { wireHTTP, defineHTTPRoutes, wireHTTPRoutes } from '#pikku/http'
import { addHTTPMiddleware, pikkuMiddleware } from '#pikku/middleware'
import { wireChannel, pikkuChannelConnectionFunc } from '#pikku/channel'
import { wireQueueWorker } from '#pikku/queue'
import { wireScheduler } from '#pikku/scheduler'
import { wireCLI, pikkuCLICommand } from '#pikku/cli'
import { wireMCPResource, wireMCPPrompt } from '#pikku/mcp'
import { NotFoundError } from '#pikku/error'
import { pikkuPermission } from '#pikku/auth'
```

There is **no bare `#pikku`**. `import { pikkuFunc } from '#pikku'` does not
resolve — the alias only ever matches a subpath.

The [SDK explorer](/api) lists every door and everything it
exports, and `npx pikku doc` prints the same thing for the version you have
installed.

## Why a door and not `@pikku/core`

`#pikku/http` is *your project's* HTTP door. The CLI generates it against your
session type, your services and your function names, so `wireHTTP` knows what you
are allowed to pass it and a wrong route parameter is a compile error rather than
a 404. Importing the same helper straight from `@pikku/core/http` gets you the
generic version with none of that inference.

The exception is concrete service implementations you pass in during setup —
`ConsoleLogger`, `LocalSecretService`, `LocalVariablesService` and friends really
do come from `@pikku/core/services`, because they are values rather than
project-shaped types.

## Configuring the alias

Scaffolded projects come pre-configured. The map lives in `package.json` under
Node's [subpath imports](https://nodejs.org/api/packages.html#subpath-imports),
so it works at runtime and under modern TypeScript resolution without a bundler:

```json title="package.json"
{
  "imports": {
    "#pikku/*.js": "./.pikku/*.ts",
    "#pikku/*": ["./.pikku/*/index.ts", "./.pikku/*"]
  }
}
```

The first entry lets a `.js` specifier resolve to the `.ts` source, which is what
`NodeNext` emits — that is how `#pikku/pikku-fetch.gen.js` reaches a generated
artifact that is not a door. The second resolves `#pikku/http` to the door barrel
`.pikku/http/index.ts`, with the bare `./.pikku/*` as a fallback for specifiers
that name a generated file rather than a door.

An addon builds to `dist/` first, so its map points there instead, with an array
fallback because a published package is read by tools with a range of resolution
behaviour:

```json title="package.json (addon)"
{
  "imports": {
    "#pikku/*.js": "./dist/.pikku/*.js",
    "#pikku/*": ["./dist/.pikku/*/index.js", "./dist/.pikku/*"]
  }
}
```

An addon's generated tree roots one level down, at `.pikku/addon/`, so its source
reaches every leaf as `#pikku/addon/<leaf>` (`#pikku/addon/function`,
`#pikku/addon/setup`, …). Its own build resolves those through `paths` in
`tsconfig.json`, because a linked addon's flat `#pikku/function` would otherwise
match the *host application's* leaf and type the addon against the host's
services:

```json title="tsconfig.json (addon)"
{
  "compilerOptions": {
    "paths": {
      "#pikku/*.js": ["./.pikku/*.ts"],
      "#pikku/*": ["./.pikku/*/index.ts", "./.pikku/*"]
    }
  }
}
```

An addon also must not wire transports. `wireHTTP`, `wireChannel`,
`wireQueueWorker`, `wireScheduler`, `wireCLI`, `wireGateway`, `wireTrigger`,
`wireMCPResource`/`wireMCPPrompt`, `wireAddon` and `wireRemoteAddon` are refused
in an addon package ([PKU920](/docs/pikku-cli/errors/pku920)): the addon declares
contracts with the `define*` helpers and exports functions, and the consuming
app wires them with `refHTTP` / `refChannel` / `refCLI`.

Relative imports resolve to exactly the same files if you would rather not use
the alias:

```typescript
import { pikkuSessionlessFunc } from '../../.pikku/function/index.js'
```

In a monorepo the generated imports between packages are rewritten to package
names: `packageMappings` in `pikku.config.json` maps each source directory to
the package that publishes it — see
[Monorepo Support](/docs/pikku-cli/configuration#monorepo-support).

## What is in `.pikku/`

One directory per door, plus a handful of generated files that are not doors:

- `function/`, `setup/`, `middleware/`, `error/`, `auth/`, `scopes/`, `secrets/`,
  `credentials/`, `variables/`, `addon/`, `analytics/` — the everyday doors
- `http/`, `channel/`, `queue/`, `scheduler/`, `cli/`, `mcp/`, `trigger/`,
  `gateway/` — one per transport
- `workflow/`, `agent/`, `scenarios/` — orchestration and testing
- `pikku-bootstrap.gen.ts` — imports every wiring; your server entry point
  imports this once so the registrations happen
- `pikku-services.gen.ts` — the service dependency map
- `pikku-fetch.gen.ts`, `pikku-rpc.gen.ts` — the typed clients for consumers.
  The route maps they are typed against live inside the door directories, as
  `http/pikku-http-wirings-map.gen.d.ts` and `rpc/pikku-rpc-wirings-map.gen.d.ts`
- `schemas/` — the validation schemas derived from your input and output types

These are regenerated on every `pikku all`, or continuously under `pikku dev`.
Don't edit them by hand — they are rewritten from your source each run.

See [Generated Files](/docs/pikku-cli/generated-files) for the full inventory.
