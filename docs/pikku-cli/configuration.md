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

## Configuration Options

### Core Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `tsconfig` | `string` | ✅ | Path to TypeScript configuration file |
| `srcDirectories` | `string[]` | ✅ | Directories to scan for Pikku functions and wirings |
| `outDir` | `string` | ✅ | Where generated files are written (default: `.pikku`) |
| `rootDir` | `string` | ❌ | Root directory for resolving paths (default: config file directory) |
| `$schema` | `string` | ❌ | JSON schema URL for editor autocomplete |

### Client Generation

| Option | Type | Description |
|--------|------|-------------|
| `fetchFile` | `string` | Generate type-safe HTTP client (fetch-based) |
| `websocketFile` | `string` | Generate type-safe WebSocket client |
| `queueFile` | `string` | Generate type-safe queue client |
| `rpcWiringsFile` | `string` | Generate type-safe RPC client |
| `nextBackendFile` | `string` | Generate Next.js backend integration |
| `nextHTTPFile` | `string` | Generate Next.js HTTP route handler |

**Example:**
```json
{
  "fetchFile": "sdk/pikku-fetch.gen.ts",
  "websocketFile": "sdk/pikku-websocket.gen.ts",
  "queueFile": "sdk/pikku-queue.gen.ts",
  "rpcWiringsFile": "sdk/pikku-rpc.gen.ts"
}
```

### Workflows

Configure workflow execution mode and queue settings.

**Single Queue Mode:**

| Option | Type | Description |
|--------|------|-------------|
| `workflows.singleQueue` | `true` | Use single queue for all workflows |
| `workflows.path` | `string` | Output path for generated workflow types |
| `workflows.orchestratorQueue` | `string` | Optional custom orchestrator queue name |
| `workflows.workerQueue` | `string` | Optional custom worker queue name |

**Example (Single Queue):**
```json
{
  "workflows": {
    "singleQueue": true,
    "path": "src/workflows/pikku.workflows.gen.ts",
    "orchestratorQueue": "pikku-workflow-orchestrator",
    "workerQueue": "pikku-workflow-worker"
  }
}
```

### CLI

Configure CLI entrypoints. Each CLI can have multiple execution modes: local (direct command-line), channel (remote via WebSocket), or a simple string path.

| Option | Type | Description |
|--------|------|-------------|
| `cli.entrypoints` | `object` | Map of CLI names to their configuration(s) |

**Entrypoint types:**
- `string` - Simple path to wiring file
- `{ type: 'local', path: string }` - Local CLI execution
- `{ type: 'channel', wirePath: string, name?: string, route?: string, path?: string }` - Remote CLI via WebSocket
- Array of any above types - Multiple execution modes for one CLI

**Example:**
```json
{
  "cli": {
    "entrypoints": {
      "my-cli": [
        {
          "type": "local",
          "path": "src/cli-local.ts"
        },
        {
          "type": "channel",
          "wirePath": "src/cli-channel.ts",
          "name": "cli",
          "route": "/cli",
          "path": "src/cli-remote.ts"
        }
      ],
      "simple-cli": "src/simple-cli.ts"
    }
  }
}
```

### Filtering

| Option | Type | Description |
|--------|------|-------------|
| `filters.tags` | `string[]` | Only include functions/wirings with these tags |
| `filters.types` | `string[]` | Only include these wiring types: `http`, `channel`, `queue`, `scheduler`, `rpc`, `mcp`, `cli` |
| `filters.directories` | `string[]` | Only scan these directories |

**Example:**
```json
{
  "filters": {
    "tags": ["api", "public"],
    "types": ["http", "rpc"],
    "directories": ["src/api"]
  }
}
```

### Monorepo Support

| Option | Type | Description |
|--------|------|-------------|
| `packageMappings` | `object` | Map local paths to published package names |

**Example:**
```json
{
  "packageMappings": {
    "packages/sdk": "@my-app/sdk",
    "packages/functions": "@my-app/functions"
  }
}
```

This ensures generated imports use `@my-app/sdk` instead of relative paths like `../../packages/sdk`.

### OpenAPI Generation

| Option | Type | Description |
|--------|------|-------------|
| `openAPI.outputFile` | `string` | Where to write OpenAPI spec (`.yml` or `.json`) |
| `openAPI.additionalInfo.info` | `object` | API metadata (title, version, description) |
| `openAPI.additionalInfo.servers` | `array` | Server URLs |
| `openAPI.additionalInfo.tags` | `array` | Tag descriptions |
| `openAPI.additionalInfo.securitySchemes` | `object` | Security scheme definitions |
| `openAPI.additionalInfo.security` | `array` | Global security requirements |

**Example:**
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
        { "url": "https://api.example.com", "description": "Production" },
        { "url": "http://localhost:3000", "description": "Development" }
      ]
    }
  }
}
```

### Advanced Options

| Option | Type | Description |
|--------|------|-------------|
| `extends` | `string` | Extend another Pikku config file |
| `supportsImportAttributes` | `boolean` | Enable import attributes for schema imports (TypeScript 5.3+) |

## Example Configurations

### Monorepo with Shared SDK

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["packages/functions/src"],
  "outDir": "packages/functions/.pikku",
  "fetchFile": "packages/sdk/.pikku/pikku-fetch.gen.ts",
  "websocketFile": "packages/sdk/.pikku/pikku-websocket.gen.ts",
  "packageMappings": {
    "packages/sdk": "@my-app/sdk",
    "packages/functions": "@my-app/functions"
  }
}
```

### Next.js Application

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["./backend"],
  "outDir": "./backend/.pikku",
  "nextBackendFile": "./pikku-nextjs.ts"
}
```

### Filtered Build (Public API Only)

```json
{
  "tsconfig": "./tsconfig.json",
  "srcDirectories": ["src"],
  "outDir": ".pikku",
  "filters": {
    "tags": ["public"],
    "types": ["http"]
  }
}
```

## Next Steps

- [Getting Started](/docs/core-features) - Set up your first Pikku project
- [Tree-Shaking](/docs/pikku-cli/tree-shaking) - Learn about filtering
