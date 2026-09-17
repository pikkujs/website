---
sidebar_position: 1
title: Configuration
description: Complete reference for pikku.config.json
---

# Configuration

The `pikku.config.json` file configures how the Pikku CLI scans your codebase and generates files. The CLI looks for it in the current directory and walks up parent directories until it hits the git repository root, so you can run `pikku` from anywhere inside your project.

## Minimal Configuration

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["src"],
  "outDir": ".pikku"
}
```

## Core Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `tsconfig` | `string` | ✅ | Path to TypeScript configuration file, resolved against `rootDir` |
| `srcDirectories` | `string[]` | ✅ | Directories to scan for Pikku functions and wirings |
| `outDir` | `string` | ✅ | Where generated files are written (conventionally `.pikku`) |
| `rootDir` | `string` | ❌ | Root directory for resolving paths (default: config file directory) |
| `extends` | `string` | ❌ | Path to another `pikku.config.json` to inherit from |
| `ignoreFiles` | `string[]` | ❌ | Glob patterns to skip (default: `["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**", "**/dist/**"]`) |
| `globalHTTPPrefix` | `string` | ❌ | Prefix prepended to all HTTP routes (e.g., `/api/v1`). Trailing slashes are stripped |
| `metaLocale` | `string` | ❌ | BCP-47 language tag for the meta the Console renders back to your team — function/step descriptions, feature and scenario names (default: `"en"`). Identifiers stay English; the language the app speaks to users is a separate setting |
| `$schema` | `string` | ❌ | JSON schema URL for editor autocomplete |

In addon mode (`"addon": true`) the generated tree roots at `outDir/addon`, so every leaf an addon authors is reached as `#pikku/addon/<leaf>`.

## Client Generation

Client files can be specified under a `clientFiles` object. When set, the corresponding `pikku <command>` generates a type-safe client at that path. Paths are resolved relative to the config file directory.

```json
{
  "clientFiles": {
    "fetchFile": "sdk/pikku-fetch.gen.ts",
    "websocketFile": "sdk/pikku-websocket.gen.ts",
    "rpcWiringsFile": "sdk/pikku-rpc.gen.ts",
    "queueWiringsFile": "sdk/pikku-queue.gen.ts",
    "mcpJsonFile": "sdk/pikku-mcp.gen.json",
    "nextBackendFile": "pikku-nextjs.ts",
    "nextHTTPFile": "pikku-nextjs-http.ts"
  }
}
```

| Key | CLI Command | Description |
|-----|-------------|-------------|
| `fetchFile` | `pikku fetch` | Type-safe HTTP fetch client |
| `websocketFile` | `pikku websocket` | Type-safe WebSocket client |
| `rpcWiringsFile` | `pikku rpc` | RPC client wrappers |
| `reactQueryFile` | `pikku react-query` | TanStack React Query hooks |
| `realtimeFile` | `pikku realtime` | Typed realtime client (WebSocket + SSE) |
| `tanstackStartFile` | `pikku tanstack-start` | TanStack Start server-function shim (`makeApi`). Requires `rpcWiringsFile` |
| `queueWiringsFile` | `pikku queue-service` | Queue service wrapper |
| `nextBackendFile` | `pikku nextjs` | Next.js backend integration |
| `nextHTTPFile` | `pikku nextjs` | Next.js HTTP route handler |
| `scopesFile` | `pikku` | Browser-side scope client — the project's `ScopeId` union plus `hasScopes()`. No imports, so a frontend never reaches into `@pikku/core` |
| `mcpJsonFile` | `pikku` | MCP server JSON manifest |

`clientFiles` also accepts `nextBackendTransport` (`local` \| `worker-rpc` \| `http`; default `local`), `nextBackendFetcherImport` (required for `worker-rpc`), and `realtimeEventHubTopicsImport` for advanced Next.js / realtime setups.

:::note `startServerFnsFile` was renamed
Older configs used `startServerFnsFile` for the TanStack Start shim. It is now `tanstackStartFile`; a config still using the old key fails at startup naming the replacement.
:::

## Scaffold

The `scaffold` section controls where `pikku new` puts generated files and which features are enabled.

```json
{
  "scaffold": {
    "pikkuDir": "src/pikku",
    "functionDir": "src/functions",
    "wiringDir": "src/wirings",
    "middlewareDir": "src/middleware",
    "permissionDir": "src/permissions",
    "addonDir": "packages/addons",
    "rpc": true,
    "console": true,
    "agent": true,
    "workflow": true
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `pikkuDir` | `string` | Directory for auto-generated scaffold files — RPC endpoints, agent endpoints, console functions, workflow routes, the Better Auth wiring (default: `<srcDirectories[0]>/scaffold`, resolved against `rootDir`) |
| `functionDir` | `string` | Where `pikku new function` puts files (default: `<srcDirectories[0]>/functions`) |
| `wiringDir` | `string` | Where `pikku new wiring` puts files (default: `<srcDirectories[0]>/wirings`) |
| `middlewareDir` | `string` | Where `pikku new middleware` puts files (default: `<srcDirectories[0]>/middleware`) |
| `permissionDir` | `string` | Where `pikku new permission` puts files (default: `<srcDirectories[0]>/permissions`) |
| `addonDir` | `string` | Base directory for `pikku new addon`; the package is created at `<addonDir>/addon-<name>` (default: current working directory) |

**Feature flags** — set via `pikku enable <feature>` or directly in config.

Each flag says only whether the *surface exists*, and where its file goes. It never says who may call the surface: authentication is declared on the function, its wiring, its scopes and its addon, and enforced there on every call.

| Value | Meaning |
|---|---|
| `true` | the surface exists, at its default path under `pikkuDir` |
| `{ "path": "src/my.gen.ts" }` | the surface exists and is written to `path` instead |
| `false` | the surface is not generated |

Only `path` is accepted as an object key. A bare string and the old `auth` key are both refused by the loader with an explicit message.

| Option | Description |
|--------|-------------|
| `rpc` | Generate the public RPC endpoint (`rpc-public.gen.ts`) |
| `analytics` | Generate the typed `POST /analytics` ingest (`analytics.gen.ts`) |
| `featureFlags` | Generate the `GET /feature-flags` read wire (`feature-flags.gen.ts`) |
| `console` | Generate console functions (`console.gen.ts`) |
| `scenarios` | Generate scenario instrumentation functions (`scenarios.gen.ts`) |
| `virtualUser` | Generate the virtual-user run/read RPCs (`virtual-user.gen.ts`). Requires at least one declared persona |
| `agent` | Generate agent endpoints (`agent.gen.ts`) |
| `workflow` | Generate workflow routes (`workflow-routes.gen.ts`) |
| `events` | Generate the realtime events channel + SSE stream (`events.gen.ts`) |
| `remoteRpc` | Generate the remote internal RPC queue worker + HTTP endpoint (`rpc-remote.gen.ts`) |
| `remoteJobs` | Generate the remote job inbox routes for queue and scheduled work (`remote-jobs.gen.ts`) |
| `webhook` | Generate the outgoing webhook delivery queue worker (`webhook.gen.ts`). Boolean only — no path override |
| `graph` | Wire the addon-graph package so `pikkuWorkflowGraph` can reference its native transforms (`graph.wirings.gen.ts`). Boolean only — no path override |

## Models

`models` is an alias table so an agent can name a model by what it is for, and one edit repoints every use:

```json
{
  "models": {
    "cheap": "openai/gpt-5-mini",
    "reasoning": "anthropic/claude-sonnet-5"
  }
}
```

A `model` containing `/` is used as written; a bare name that is not in this table fails codegen. `pikku dev` and `pikku serve` accept `--model alias:provider/model` (comma-separated for several) to repoint aliases for one run without editing the config. Request-time overrides are passed as `input.model` when the agent runs. See [AI Agents](/docs/wiring/ai-agents) for details.

## Environments and Scenarios

`environments` names the targets a run can point at. It is top-level rather than under `scenarios` because a scenario suite and a persona run are two different things that both point at an environment.

```json
{
  "environments": {
    "staging": {
      "apiUrl": "https://staging.example.com/api",
      "signInPath": "/auth/sign-in/actor",
      "rpcPath": "/rpc"
    }
  },
  "scenarios": {
    "emailDomain": "staging.example.com",
    "browserDriver": "@pikku/playwright",
    "model": "openai/gpt-5-mini"
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `environments.<name>.apiUrl` | `string` | Required. Base URL, including the HTTP prefix |
| `environments.<name>.signInPath` | `string` | Actor sign-in path under `apiUrl` (default: `/auth/sign-in/actor`) |
| `environments.<name>.sessionPath` | `string` | Where the session and its roles are read back (default: `get-session` under the sign-in path's mount) |
| `environments.<name>.rpcPath` | `string` | Exposed-RPC prefix under `apiUrl` (default: `/rpc`) |
| `environments.<name>.appUrl` | `string` | Frontend base URL for browser steps |
| `environments.<name>.production` | `boolean` | Marks an environment with real consequences: only an `accountable` persona may run against it |
| `scenarios.emailDomain` | `string` | Mail domain a persona's address is built on (default: `personas.invalid`, a domain nobody can own) |
| `scenarios.browserDriver` | `string` | Package driving `browser` step bindings. Anything exporting a `ScenarioBrowserProvider` works (default: `@pikku/playwright`) |
| `scenarios.model` | `string` | Model a persona thinks with. Not the model under test; a step can override it per conversation |

Personas are declared in code with `definePersonas`, not in `pikku.config.json`:

```typescript
import { definePersonas } from '#pikku/scopes/pikku-personas.gen.js'

definePersonas({
  susan: {
    name: 'Susan',
    jobTitle: 'Buys for a small café',
    roles: ['buyer'],
    personality: 'Hunts cheap deals. Tries three coupon codes before giving up.',
    goals: ['Get the weekly order in under five minutes'],
    account: {},
  },
})
```

Addresses are never written down: each is derived from the persona id and `scenarios.emailDomain`, and codegen materialises one actor per persona for scenario runs.

The actor secret is never configured here — it comes from the `SCENARIO_ACTOR_SECRET` environment variable at run time.

## Local Database

Configure how the CLI reaches the local development database used by `pikku dev` and the `pikku db` commands:

```json
{
  "db": {
    "schema": "app",
    "pgliteExtensions": ["citext"]
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `db.schema` | `string` | Postgres schema the generated runtime migrations create their tables in. Postgres only; with no schema the DDL is unqualified and lands wherever `search_path` points |
| `db.defaultSchema` | `string` | Schema whose qualifier is dropped from the generated Kysely types, so `app.user` is queried as `selectFrom('user')`. Usually the same value as `db.schema`; set it only for a schema the connection's `search_path` resolves |
| `db.pgliteExtensions` | `string[]` | Postgres extensions the CLI's embedded PGlite databases must load — the local dev database and the shadow one every `db` command migrates to diff a schema. A bare name is one of PGlite's bundled contrib extensions (`hstore`, `citext`, …); anything else must be a project dependency, such as `@electric-sql/pglite-pgvector` |

The dialect is not configured here. It comes from your project's `createConfig()`: a `postgresUrl` means Postgres, and an `sqliteDb` (or a `db/sqlite/` migrations directory) means SQLite. The `db.engine` and `db.pgVersion` keys are still accepted for compatibility but are not read by the current CLI.

## Emails

```json
{
  "emailTemplatesDir": "src/emails"
}
```

Directory containing email templates, locales, partials, and `theme.json`. Used by `pikku emails init` / `pikku emails generate`. `pikku emails init` scaffolds a starter tree and writes this key for you.

## Auth (Better Auth)

| Option | Type | Description |
|--------|------|-------------|
| `authFile` | `string` | Path to write the generated Better Auth wiring (`auth.gen.ts`, plus `auth-secrets.gen.ts` and `auth-middleware.gen.ts` beside it). The CLI inspects these explicitly, so they may sit outside `srcDirectories` (default: `<pikkuDir>/auth/auth.gen.ts`) |
| `authTypesFile` | `string` | Path for the typed `pikkuBetterAuth` re-export (default: `{outDir}/auth/auth.types.ts`) |
| `authMetaJsonFile` | `string` | Path for the generated auth metadata — enabled social providers/plugins, read by the Console SSO page (default: `{outDir}/auth/pikku-auth-meta.gen.json`) |

## Workflows

```json
{
  "workflows": {
    "orchestratorQueue": "pikku-workflow-orchestrator",
    "workerQueue": "pikku-workflow-worker"
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `orchestratorQueue` | `string` | Custom queue name for workflow orchestration |
| `workerQueue` | `string` | Custom queue name for workflow step execution |

## CLI Entrypoints

Configure CLI tools built with Pikku's CLI wiring.

```json
{
  "cli": {
    "entrypoints": {
      "my-cli": [
        { "type": "local", "path": "src/cli-local.ts" },
        {
          "type": "channel",
          "wirePath": "src/cli-channel.ts",
          "name": "cli",
          "route": "/cli"
        }
      ],
      "simple-cli": "src/simple-cli.ts"
    }
  }
}
```

Each entrypoint can be:
- A `string` — path to the wiring file
- `{ type: "local", path }` — direct command-line execution
- `{ type: "channel", wirePath, name?, route?, path? }` — remote execution via WebSocket
- An array of the above for multiple execution modes

## Deploy

Configure deployment providers and settings.

```json
{
  "deploy": {
    "providers": {
      "cloudflare": "@pikku/deploy-cloudflare",
      "aws": "@pikku/deploy-serverless"
    },
    "defaultProvider": "cloudflare",
    "serverlessIncompatible": ["heavy-compute-function"]
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `deploy.providers` | `Record<string, string>` | Map of provider names to adapter packages (defaults: `cloudflare` → `@pikku/deploy-cloudflare`, `serverless` → `@pikku/deploy-serverless`, `azure` → `@pikku/deploy-azure`, `standalone` → `@pikku/deploy-standalone`) |
| `deploy.defaultProvider` | `string` | Default provider for `pikku deploy` commands (default: `cloudflare`) |
| `deploy.serverlessIncompatible` | `string[]` | Service names that can't run in serverless — any function that reaches one is routed to the server target |
| `deploy.defaultTarget` | `"serverless"` \| `"server"` | Default deploy target for functions without an explicit `deploy` flag (default: `serverless`) |
| `deploy.grouping` | `object` | How many deployment units the app's functions collapse into — `{ strategy: "services" \| "function" \| "single", rules: [{ unit, tags?, addon?, routes? }] }` (`services` is the default). See [Deployment unit grouping](../deploy/index.md#deployment-unit-grouping) |
| `deploy.desktop` | `object` | Desktop shell settings used by `pikku deploy apply --desktop`: `{ identifier?, url? }` |

## Addon Mode

When building a reusable addon package, set `addon` to enable addon-specific codegen.

```json
{
  "addon": true
}
```

Or with metadata for the addon registry:

```json
{
  "addon": {
    "displayName": "Slack Integration",
    "description": "Slack API functions for Pikku",
    "categories": ["Communication"],
    "icon": "slack-icon.svg",
    "serverlessIncompatible": ["streamLargeExport"],
    "openapi": { "version": "1.2.0", "hash": "abc123" }
  }
}
```

The addon object also accepts `serverlessIncompatible` (service names that must run on a server) and `openapi` (`version` + `hash`, stamped by `pikku new addon --openapi` to track the spec the addon was generated from). Two related top-level keys: `addonName` overrides the addon's package name in generated metadata (defaults to the `name` in `package.json`), and `addonMetaJsonFile` overrides where the addon metadata JSON is written (default: `{outDir}/console/pikku-addon-meta.gen.json`).

## OpenAPI Generation

```json
{
  "openAPI": {
    "outputFile": "openapi.yml",
    "additionalInfo": {
      "info": {
        "title": "My API",
        "version": "1.0.0",
        "description": "API documentation"
      },
      "servers": [
        { "url": "https://api.example.com", "description": "Production" }
      ],
      "securitySchemes": {},
      "security": []
    }
  }
}
```

## Schema Options

```json
{
  "schema": {
    "additionalProperties": false,
    "supportsImportAttributes": true
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `additionalProperties` | `boolean` | `false` | Allow extra properties in generated JSON schemas |
| `supportsImportAttributes` | `boolean` | `true` | Use import attributes for schema imports (TypeScript 5.3+) |

## Monorepo Support

```json
{
  "packageMappings": {
    "packages/sdk": "@my-app/sdk",
    "packages/functions": "@my-app/functions"
  }
}
```

Maps local directory paths to published package names so generated imports use the package name instead of relative paths.

## Filtering

Permanently filter which functions are included in codegen output. These are the config-file equivalent of the CLI `--tags`, `--wires`, etc. flags.

```json
{
  "filters": {
    "tags": ["api", "public"],
    "wires": ["http", "rpc"],
    "directories": ["src/api"]
  }
}
```

All `InspectorFilters` keys are supported: `names`, `tags`, `wires`,
`directories`, `httpRoutes`, `httpMethods`, every `exclude*` variant
(`excludeNames`, `excludeTags`, `excludeWires`, …), and `target` /
`excludeTarget` (`serverless` | `server`). Named presets can be defined under
`namedFilters` and selected with `pikku --filter <name>`.

## Linting

Configure lint rules. The first three are evaluated by codegen; the last by
[`pikku validate`](/docs/pikku-cli#pikku-validate):

```json
{
  "lint": {
    "servicesNotDestructured": "warn",
    "wiresNotDestructured": "error",
    "functionDynamicImport": "warn",
    "customServerBootstrap": "error"
  }
}
```

| Rule | Values | Default | Description |
|------|--------|---------|-------------|
| `servicesNotDestructured` | `"off"` \| `"warn"` \| `"error"` | `"error"` | Warn when functions don't destructure services |
| `wiresNotDestructured` | `"off"` \| `"warn"` \| `"error"` | `"error"` | Warn when functions don't destructure wires |
| `functionDynamicImport` | `"off"` \| `"warn"` \| `"error"` | `"warn"` | Warn when a function body reaches for a dynamic `import()` |
| `customServerBootstrap` | `"off"` \| `"warn"` \| `"error"` | `"warn"` | Flag a `start`/`dev` script that boots a server without `pikku dev` or `pikku serve` |

## Advanced Options

| Option | Type | Description |
|--------|------|-------------|
| `forceRequiredServices` | `string[]` | Service names that must always be available, even if not detected |
| `allowShadowedServices` | `string[]` | Service names `createSingletonServices` may replace even though the host passed its own. Anything unlisted warns at boot, because the host's instance is the configured one and the replacement starts empty |
| `schemasFromTypes` | `string[]` | Additional type names to generate schemas for |
| `runtimeDir` | `string` | Runtime artifacts directory (dev.db, content, tmp). Resolved relative to `rootDir`. Default: `<rootDir>/.pikku-runtime` |
| `namedFilters` | `Record<string, InspectorFilters>` | Named filter presets, selected via `pikku --filter <name>` |
| `stateOutput` / `stateInput` | `string` | Save/load inspector state to/from JSON (skips re-inspection) |
| `security` | `boolean` | Always run the data-classification security lint (same as `--security` per invocation) |
| `tsc` / `tscSummary` | `boolean` | Always run `tsc --noEmit` after codegen and fail on type errors (same as `--tsc` / `--tsc-summary`) |
| `diff` | `boolean` | Emit a structural diff of the generated `.pikku` meta as a `PIKKU_DIFF <json>` line on stdout (same as `--diff`) |
| `addons.addonDir` | `string` | Where community-registry addons installed via `pikku fabric addon add` are copied (default: `addons/`) |
| `allow.permissionsInBody` | `boolean` | Permits `permissionsInBody: true` on a function config |
| `allow.complexWorkflows` | `boolean` | Permits `pikkuWorkflowComplexFunc`, whose inline steps cannot be serialized into the workflow graph |
| `userSessionType` | `string` | Which `UserSession` type to use when the inspector finds more than one (same as `--user-session-type`) |
| `singletonServicesFactoryType` | `string` | Which singleton services factory to use when multiple exist (same as `--singleton-services-factory-type`) |
| `wireServicesFactoryType` | `string` | Which wire services factory to use when multiple exist (same as `--wire-services-factory-type`) |
| `tests.outputDir` | `string` | Output directory for the old `pikku tests` harness. Scenarios own coverage now and no current command reads this key |

### Serving a Frontend

```json
{
  "frontend": {
    "dir": "apps/web/dist",
    "urlPrefix": "/",
    "spaFallback": true
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `dir` | `string` | Required. Directory of built frontend output, resolved relative to the config file |
| `urlPrefix` | `string` | Where the frontend is mounted (default: `/`) |
| `spaFallback` | `boolean` | Serve `index.html` for a path under the prefix that no route and no file claimed (default: `true`) |

This names *output*, not a project: `pikku serve` and `pikku deploy` read the directory and never build it. `pikku dev` ignores it — a frontend dev server owns that job and proxies API calls back to pikku.

### Output File Overrides

Every generated file path is individually overridable at the top level of the config. By default they're all derived from `outDir` (e.g. `functionsFile`, `httpWiringsFile`, `schemaDirectory`, `bootstrapFile`, `personasWiringFile`, and several dozen more — one key per generated file listed in [Generated Files](/docs/pikku-cli/generated-files)). You rarely need these; the common exceptions are `authFile` (which lives in your source tree) and the `clientFiles` block above.

### Native Binary

Compile a TypeScript entrypoint to a self-contained native binary with
`pikku binary` (uses `bun build --compile`):

```json
{
  "binary": {
    "entrypoint": "src/start.ts",
    "output": "dist/server",
    "targets": ["bun-linux-x64", "bun-darwin-arm64"]
  }
}
```

## Example Configurations

### Full-Featured App

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["src"],
  "outDir": ".pikku",
  "globalHTTPPrefix": "/api",
  "clientFiles": {
    "fetchFile": "sdk/pikku-fetch.gen.ts",
    "websocketFile": "sdk/pikku-websocket.gen.ts"
  },
  "scaffold": {
    "pikkuDir": "src/pikku",
    "rpc": true,
    "agent": true,
    "workflow": true
  },
  "deploy": {
    "providers": {
      "cloudflare": "@pikku/deploy-cloudflare"
    },
    "defaultProvider": "cloudflare"
  }
}
```

### Next.js Application

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["./backend"],
  "outDir": "./backend/.pikku",
  "clientFiles": {
    "nextBackendFile": "./pikku-nextjs.ts"
  }
}
```

### Monorepo with Shared SDK

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["packages/functions/src"],
  "outDir": "packages/functions/.pikku",
  "clientFiles": {
    "fetchFile": "packages/sdk/pikku-fetch.gen.ts",
    "websocketFile": "packages/sdk/pikku-websocket.gen.ts"
  },
  "packageMappings": {
    "packages/sdk": "@my-app/sdk",
    "packages/functions": "@my-app/functions"
  }
}
```

### Config Inheritance

Base config (`pikku.config.base.json`):
```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["src"],
  "outDir": ".pikku"
}
```

Extended config (`pikku.config.json`):
```json
{
  "extends": "./pikku.config.base.json",
  "filters": {
    "tags": ["public"],
    "wires": ["http"]
  }
}
```

## Next Steps

- [Pikku CLI Commands](/docs/pikku-cli) — Full CLI reference
- [Tree-Shaking](/docs/pikku-cli/tree-shaking) — How filtering and tree-shaking work
