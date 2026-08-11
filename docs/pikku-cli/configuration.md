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
| `tsconfig` | `string` | ✅ | Path to TypeScript configuration file |
| `srcDirectories` | `string[]` | ✅ | Directories to scan for Pikku functions and wirings |
| `outDir` | `string` | ✅ | Where generated files are written (conventionally `.pikku`) |
| `rootDir` | `string` | ❌ | Root directory for resolving paths (default: config file directory) |
| `extends` | `string` | ❌ | Path to another `pikku.config.json` to inherit from |
| `ignoreFiles` | `string[]` | ❌ | Glob patterns to skip (default: `["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**", "**/dist/**"]`) |
| `globalHTTPPrefix` | `string` | ❌ | Prefix prepended to all HTTP routes (e.g., `/api/v1`) |
| `$schema` | `string` | ❌ | JSON schema URL for editor autocomplete |

## Client Generation

Client files can be specified under a `clientFiles` object. When set, the corresponding `pikku <command>` generates a type-safe client at that path.

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
| `startServerFnsFile` | `pikku tanstack-start` | TanStack Start server-function shim (`makeApi`) |
| `queueWiringsFile` | `pikku queue-service` | Queue service wrapper |
| `mcpJsonFile` | — | MCP server JSON manifest |
| `nextBackendFile` | `pikku nextjs` | Next.js backend integration |
| `nextHTTPFile` | `pikku nextjs` | Next.js HTTP route handler |

`clientFiles` also accepts `nextBackendTransport` (`local` \| `worker-rpc` \|
`http`), `nextBackendFetcherImport`, and `realtimeEventHubTopicsImport` for
advanced Next.js / realtime setups.

:::note Legacy format
You can also specify these at the top level (e.g., `"fetchFile": "..."` instead of `"clientFiles": { "fetchFile": "..." }`). The `clientFiles` object is recommended because paths inside it are resolved relative to the config file directory.
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
    "console": { "auth": false },
    "agent": true,
    "workflow": true
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `pikkuDir` | `string` | Directory for auto-generated scaffold files — RPC endpoints, agent endpoints, console functions, workflow routes, the Better Auth wiring (default: `<srcDirectories[0]>/scaffold`) |
| `functionDir` | `string` | Where `pikku new function` puts files |
| `wiringDir` | `string` | Where `pikku new wiring` puts files |
| `middlewareDir` | `string` | Where `pikku new middleware` puts files |
| `permissionDir` | `string` | Where `pikku new permission` puts files |
| `addonDir` | `string` | Where `pikku new addon` puts addon packages |

**Feature flags** — set via `pikku enable <feature>` or directly in config.

Each flag says only whether the *surface exists*, and whether reaching it needs
a session:

| Value | Meaning |
|---|---|
| `true` | the surface exists and requires a session |
| `{ "auth": false }` | the surface exists and is public |
| `false` | the surface is not generated |

| Option | Description |
|--------|-------------|
| `rpc` | Generate the public RPC endpoint |
| `console` | Generate console functions |
| `scenarios` | Generate scenario instrumentation functions (without needing the console addon) |
| `agent` | Generate agent endpoints |
| `workflow` | Generate workflow routes |
| `events` | Generate the realtime events channel + SSE stream (`events.gen.ts`) |
| `remoteRpc` | Generate the remote internal RPC queue worker + HTTP endpoint (`rpc-remote.gen.ts`) |

:::warning `"no-auth"` is no longer a mode
Older configs used `"auth"` / `"no-auth"` strings. Authentication is now
declared on the function or on the addon, and the scaffold flag only says
whether the surface exists — so `"no-auth"` became `{ "auth": false }` and
`"auth"` became `true`. A config still using the strings fails at startup with
an explicit message naming the replacement.
:::

## AI Agents

AI agent models are declared **per-agent** using the provider-qualified
`provider/model` form (e.g. `openai/gpt-5-mini`) on the agent definition itself —
there is no config-level model alias map, defaults block, or per-agent override
map in `pikku.config.json`. Request-time overrides are passed as `input.model`
when the agent runs. See [AI Agents](/docs/wiring/ai-agents) for details.

## Local Database

Configure the local development database used by `pikku dev` and the `pikku db` commands:

```json
{
  "db": {
    "engine": "sqlite",
    "pgVersion": 16
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `db.engine` | `"sqlite"` \| `"postgres"` | Local dev database engine (default: sqlite) |
| `db.pgVersion` | `number` | Postgres version when `engine` is `"postgres"` |

## Emails

```json
{
  "emailTemplatesDir": "src/emails"
}
```

Directory containing email templates, locales, partials, and `theme.json`. Used by `pikku emails init` / `pikku emails generate`.

## Auth (Better Auth)

| Option | Type | Description |
|--------|------|-------------|
| `authFile` | `string` | Path to write the generated Better Auth wiring (`auth.gen.ts`). Must be within `srcDirectories` |
| `authTypesFile` | `string` | Path for the typed `pikkuBetterAuth` re-export (default: `{outDir}/auth/auth.types.ts`) |
| `authMetaJsonFile` | `string` | Path for the generated auth metadata (enabled social providers/plugins; default: `{outDir}/auth/pikku-auth-meta.gen.json`) |

## Scenarios

Configure scenario actors and target environments for `pikku scenario run <environment>`:

```json
{
  "scenarios": {
    "actors": {
      "alice": {
        "email": "alice@example.com",
        "name": "Alice",
        "jobTitle": "Admin",
        "personality": "Skeptical power user who reads every tooltip"
      }
    },
    "environments": {
      "staging": {
        "apiUrl": "https://staging.example.com/api",
        "signInPath": "/auth/sign-in/actor",
        "rpcPath": "/rpc"
      }
    }
  }
}
```

Each actor takes an `email` (required) plus optional `name`, `jobTitle`, and `personality`. Actors generate a typed `createScenarioActors` factory (see the `scenarioActorsFile` output) and appear as personas in the Console. Each environment takes an `apiUrl` (with the HTTP prefix) plus optional `signInPath` (default: `/auth/sign-in/actor`) and `rpcPath` (default: `/rpc`).

The actor secret is never configured here — it comes from the `SCENARIO_ACTOR_SECRET` environment variable at run time.

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
| `deploy.providers` | `Record<string, string>` | Map of provider names to adapter packages (defaults: `cloudflare`, `serverless`, `azure`, `standalone`) |
| `deploy.defaultProvider` | `string` | Default provider for `pikku deploy` commands (default: `cloudflare`) |
| `deploy.serverlessIncompatible` | `string[]` | Function names that can't run in serverless (routed to server fallback) |
| `deploy.defaultTarget` | `"serverless"` \| `"server"` | Default deploy target for functions without an explicit `deploy` flag (default: `serverless`) |

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

The addon object also accepts `serverlessIncompatible` (function names that must run on a server) and `openapi` (`version` + `hash`, stamped by `pikku new addon --openapi` to track the spec the addon was generated from). Two related top-level keys: `addonName` overrides the addon's package name in generated metadata (defaults to the `name` in `package.json`), and `addonMetaJsonFile` overrides where the addon metadata JSON is written (default: `{outDir}/console/pikku-addon-meta.gen.json`).

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

Configure lint rules for the inspector:

```json
{
  "lint": {
    "servicesNotDestructured": "warn",
    "wiresNotDestructured": "error"
  }
}
```

| Rule | Values | Description |
|------|--------|-------------|
| `servicesNotDestructured` | `"off"` \| `"warn"` \| `"error"` | Warn when functions don't destructure services |
| `wiresNotDestructured` | `"off"` \| `"warn"` \| `"error"` | Warn when functions don't destructure wires |

## Advanced Options

| Option | Type | Description |
|--------|------|-------------|
| `forceRequiredServices` | `string[]` | Service names that must always be available, even if not detected |
| `schemasFromTypes` | `string[]` | Additional type names to generate schemas for |
| `verboseMeta` | `boolean` | Include extra metadata in generated JSON files |
| `runtimeDir` | `string` | Runtime artifacts directory (dev.db, content, tmp). Resolved relative to `rootDir`. Default: `<rootDir>/.pikku-runtime` |
| `namedFilters` | `Record<string, InspectorFilters>` | Named filter presets, selected via `pikku --filter <name>` |
| `stateOutput` / `stateInput` | `string` | Save/load inspector state to/from JSON (skips re-inspection) |
| `security` | `boolean` | Always run the data-classification security lint (same as `--security` per invocation) |
| `tsc` / `tscSummary` | `boolean` | Always run `tsc --noEmit` after codegen and fail on type errors (same as `--tsc` / `--tsc-summary`) |
| `tests.outputDir` | `string` | Output directory for the `pikku tests` harness |
| `addons.addonDir` | `string` | Where community-registry addons installed via `pikku fabric addon add` are copied (default: `addons/`) |
| `userSessionType` | `string` | Which `UserSession` type to use when the inspector finds more than one (same as `--user-session-type`) |
| `singletonServicesFactoryType` | `string` | Which singleton services factory to use when multiple exist (same as `--singleton-services-factory-type`) |
| `wireServicesFactoryType` | `string` | Which wire services factory to use when multiple exist (same as `--wire-services-factory-type`) |

### Output File Overrides

Every generated file path is individually overridable at the top level of the config. By default they're all derived from `outDir` (e.g. `functionsFile`, `httpWiringsFile`, `schemaDirectory`, `typesDeclarationFile`, `bootstrapFile`, `scenarioActorsFile`, and several dozen more — one key per generated file listed in [Generated Files](/docs/pikku-cli/generated-files)). You rarely need these; the common exceptions are `authFile` (which must live in your source tree) and the `clientFiles` block above.

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
    "rpc": "auth",
    "agent": "auth",
    "workflow": "auth"
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
