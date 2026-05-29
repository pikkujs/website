---
sidebar_position: 1
title: Configuration
description: Complete reference for pikku.config.json
---

# Configuration

The `pikku.config.json` file configures how the Pikku CLI scans your codebase and generates files.

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
| `outDir` | `string` | ✅ | Where generated files are written (default: `.pikku`) |
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
    "rpc": "auth",
    "console": "no-auth",
    "agent": "auth",
    "workflow": "auth"
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `pikkuDir` | `string` | Directory for auto-generated scaffold files (RPC endpoints, agent endpoints, console functions, workflow routes) |
| `functionDir` | `string` | Where `pikku new function` puts files |
| `wiringDir` | `string` | Where `pikku new wiring` puts files |
| `middlewareDir` | `string` | Where `pikku new middleware` puts files |
| `permissionDir` | `string` | Where `pikku new permission` puts files |
| `addonDir` | `string` | Where `pikku new addon` puts addon packages |

**Feature flags** — set via `pikku enable <feature>` or directly in config:

| Option | Values | Description |
|--------|--------|-------------|
| `rpc` | `"auth"` \| `"no-auth"` \| `false` | Generate public RPC endpoint |
| `console` | `"auth"` \| `"no-auth"` \| `false` | Generate console functions |
| `agent` | `"auth"` \| `"no-auth"` \| `false` | Generate public agent endpoints |
| `workflow` | `"auth"` \| `"no-auth"` \| `false` | Generate workflow routes |
| `events` | `"auth"` \| `"no-auth"` \| `false` | Generate the realtime events channel + SSE stream (`events.gen.ts`) |

## AI Agents

AI agent models are declared **per-agent** using the provider-qualified
`provider/model` form (e.g. `openai/gpt-5-mini`) on the agent definition itself —
there is no config-level model alias map, defaults block, or per-agent override
map in `pikku.config.json`. Request-time overrides are passed as `input.model`
when the agent runs. See [AI Agents](/docs/wiring/ai-agents) for details.

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
| `deploy.providers` | `Record<string, string>` | Map of provider names to adapter packages |
| `deploy.defaultProvider` | `string` | Default provider for `pikku deploy` commands |
| `deploy.serverlessIncompatible` | `string[]` | Function names that can't run in serverless (routed to server fallback) |

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
    "icon": "slack-icon.svg"
  }
}
```

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
