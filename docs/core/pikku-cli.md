---
sidebar_position: 10
title: Pikku CLI Configuration
description: Complete reference for pikku.config.json
---

# Pikku CLI Configuration

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
| `middlewareServices` | `string[]` | Services available in middleware (before session creation) |

### Generated File Paths

Most users don't need to customize these - Pikku uses sensible defaults.

| Option | Default | Description |
|--------|---------|-------------|
| `bootstrapFile` | `.pikku/pikku-bootstrap.gen.ts` | Main bootstrap file |
| `typesDeclarationFile` | `.pikku/pikku-types.gen.ts` | Type definitions |
| `servicesFile` | `.pikku/pikku-services.gen.ts` | Service types |
| `functionsFile` | `.pikku/function/pikku-functions.gen.ts` | Function registry |
| `functionsMetaFile` | `.pikku/function/pikku-functions-meta.gen.ts` | Function metadata |
| `httpRoutesFile` | `.pikku/http/pikku-http-wirings.gen.ts` | HTTP routes |
| `httpRoutesMetaFile` | `.pikku/http/pikku-http-wirings-meta.gen.ts` | HTTP metadata |
| `httpRoutesMapDeclarationFile` | `.pikku/http/pikku-http-wirings-map.gen.d.ts` | HTTP type map |
| `channelsFile` | `.pikku/channel/pikku-channels.gen.ts` | WebSocket channels |
| `channelsMetaFile` | `.pikku/channel/pikku-channels-meta.gen.ts` | Channel metadata |
| `channelsMapDeclarationFile` | `.pikku/channel/pikku-channels-map.gen.d.ts` | Channel type map |
| `queueWorkersFile` | `.pikku/queue/pikku-queue-workers-wirings.gen.ts` | Queue workers |
| `queueWorkersMetaFile` | `.pikku/queue/pikku-queue-workers-wirings-meta.gen.ts` | Queue metadata |
| `queueMapDeclarationFile` | `.pikku/queue/pikku-queue-workers-wirings-map.gen.d.ts` | Queue type map |
| `schedulersFile` | `.pikku/scheduler/pikku-schedulers-wirings.gen.ts` | Scheduled tasks |
| `schedulersMetaFile` | `.pikku/scheduler/pikku-schedulers-wirings-meta.gen.ts` | Scheduler metadata |
| `rpcFile` | `.pikku/rpc/pikku-rpc-wirings.gen.ts` | RPC functions |
| `rpcMetaFile` | `.pikku/rpc/pikku-rpc-wirings-meta.gen.ts` | RPC metadata |
| `rpcMapDeclarationFile` | `.pikku/rpc/pikku-rpc-wirings-map.gen.d.ts` | RPC type map |
| `mcpEndpointsFile` | `.pikku/mcp/pikku-mcp-wirings.gen.ts` | MCP endpoints |
| `mcpEndpointsMetaFile` | `.pikku/mcp/pikku-mcp-wirings-meta.gen.ts` | MCP metadata |
| `mcpJsonFile` | `.pikku/mcp/pikku-mcp.gen.json` | MCP JSON manifest |
| `schemaDirectory` | `.pikku/schemas` | JSON schemas directory |

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

- [Getting Started](/docs/core) - Set up your first Pikku project
- [Tree-Shaking](/docs/concepts/tree-shaking) - Learn about filtering
