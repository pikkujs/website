---
title: MCP Server
description: Using MCP Server with Pikku
hide_title: true
image: /img/logos/mcp-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

The MCP server runtime allows you to expose your Pikku functions as MCP tools, resources, and prompts, enabling AI models to interact with your backend services directly through the Model Context Protocol.

## Live Example

import { Stackblitz } from '@site/src/components/Stackblitz';

<Stackblitz repo="template-mcp-server" initialFiles={['src/start.ts']} />

## Overview

The MCP server provides:
- **JSON-RPC 2.0 compliance** with the official MCP SDK
- **Automatic schema generation** from TypeScript types
- **stdio transport** for seamless MCP client integration
- **Type-safe endpoints** with full TypeScript support
- **Tools, resources, and prompts** in a unified API
- **Error handling** with proper JSON-RPC responses

## Quick Start

### 1. Create a New Project

Create a new Pikku project with MCP server support:

```bash
npm create pikku@latest
```

Select **MCP Server** as your runtime option during setup.

## Project Structure

After creating your project, you'll have these key files:

### MCP Functions

Define your MCP endpoints (tools, resources, prompts):

```typescript reference title="mcp.functions.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/mcp.functions.ts
```

### MCP Registration

Register your functions as MCP endpoints:

```typescript reference title="mcp.wiring.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/mcp.wiring.ts
```

### MCP Server Runtime

The main server that handles MCP protocol communication:

```typescript reference title="start.ts"
https://github.com/pikkujs/pikku/blob/main/templates/mcp-server/src/start.ts
```

The template runs over **stdio** by default. Run it with `--http` (and optionally
`MCP_PORT`, default `3000`) to serve the same endpoints over HTTP instead —
handy for browser clients and for testing without wiring the server into an MCP
client config.

## How It Works

1. **Define Functions**: Create MCP functions using specialized Pikku types
2. **Register Endpoints**: Associate functions with MCP endpoint types (tool/resource/prompt)  
3. **Generate Schemas**: Pikku CLI creates JSON schemas automatically
4. **Start Server**: `new PikkuMCPServer({ name, version, mcpJSON, capabilities }, logger)`, then `await server.init()` and `connectStdio()` or `connectHTTP({ port })`
5. **AI Integration**: AI models can call your functions through MCP protocol

## MCP Client Integration

The server uses stdio transport and works with any MCP client:

```json
{
  "mcpServers": {
    "pikku-mcp": {
      "command": "node",
      "args": ["dist/start.js"],
      "cwd": "/path/to/your/mcp-server"
    }
  }
}
```

## Protocol Support

- **JSON-RPC 2.0**: Full protocol compliance
- **Tools**: Functions AI can call to perform actions
- **Resources**: Data sources AI can read from
- **Prompts**: Template generators for AI interactions
- **Logging**: Built-in logging capabilities
- **Error Handling**: Proper error responses with stack traces

## Development

For development with auto-reload, use the template's dev script:

```bash
npm run dev
```

## Generated Files

Pikku automatically generates:
- `.pikku/mcp/mcp.gen.json`: JSON schemas for all endpoints
- `.pikku/pikku-bootstrap.gen.ts`: the import hub that registers your functions and wirings

## Extending

To add new MCP endpoints:

1. Define functions in `mcp.functions.ts`
2. Register them in `mcp.wiring.ts` 
3. Restart the server

The Pikku CLI handles all schema generation and type safety automatically.