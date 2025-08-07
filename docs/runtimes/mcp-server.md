# MCP Server Runtime

The MCP server runtime allows you to expose your Pikku functions as MCP tools, resources, and prompts, enabling AI models to interact with your backend services directly through the Model Context Protocol.

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
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/mcp.functions.ts
```

### MCP Registration

Register your functions as MCP endpoints:

```typescript reference title="mcp.routes.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/mcp.routes.ts
```

### MCP Server Runtime

The main server that handles MCP protocol communication:

```typescript reference title="start.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/mcp-server/src/start.ts
```

## How It Works

1. **Define Functions**: Create MCP functions using specialized Pikku types
2. **Register Endpoints**: Associate functions with MCP endpoint types (tool/resource/prompt)  
3. **Generate Schemas**: Pikku CLI creates JSON schemas automatically
4. **Start Server**: MCP server connects via stdio transport
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

For development with auto-reload:

```bash
npm run pikku --watch
```

## Generated Files

Pikku automatically generates:
- `mcp.gen.json`: JSON schemas for all endpoints
- `pikku-bootstrap-mcp.gen.ts`: Endpoint registration bootstrap
- Type definitions for full TypeScript support

## Extending

To add new MCP endpoints:

1. Define functions in `mcp.functions.ts`
2. Register them in `mcp.routes.ts` 
3. Restart the server

The Pikku CLI handles all schema generation and type safety automatically.