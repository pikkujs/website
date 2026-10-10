---
sidebar_position: 0
title: MCP (Model Context Protocol)
description: Expose functions to AI agents as resources, tools, and prompts
---

# MCP (Model Context Protocol)

MCP lets AI agents access your application's data and capabilities. Your Pikku functions can become resources (data sources), tools (actions), and prompts (templates) that AI models interact with directly.

Your domain functions don't need to know they're being called by an AI agent. They receive typed input, do their work, and return structured data. Pikku handles all the MCP protocol details.

## Your First MCP Endpoint

Here are MCP functions and wiring from the templates, showing a tool, a resource, and a prompt:

```typescript @snippet wa-mcp-first-functions
```

```typescript @snippet wa-mcp-first-wiring
```

That's it! AI agents can now request your documentation. Pikku automatically:
- **Generates JSON schemas** from your TypeScript types (during `npx pikku`)
- **Validates the input** against your function's type
- **Calls your function** with clean, typed data
- **Formats the response** according to MCP protocol
- **Handles errors** appropriately

### Automatic Schema Generation

When you define an MCP function with TypeScript types:

```typescript @snippet wa-mcp-typed-resource
```

Pikku automatically:
1. Extracts your TypeScript types (`{ section: string }`)
2. Converts them to JSON Schema
3. Includes the schema in the MCP endpoint definition
4. Tells AI agents exactly what parameters are expected

**AI agents receive schemas that specify:**
- Which parameters are required
- What type each parameter is (string, number, array, object, etc.)
- Nested object structures
- Array item types

**You never write schemas manually.** Your TypeScript types are the single source of truth.

## MCP Function Types

### Resources

Resources provide data sources for AI models - documentation, user data, search results, or any queryable information:

```typescript @snippet wa-mcp-search-resource
```

**Response format**: Array of `{ uri: string, text: string }`

### Tools

Tools let AI models perform actions - creating records, running operations, or modifying state. `createItemTool` in the first example above is one. Tools return an array of content blocks:

**Response format**: Array of `{ type: 'text', text: string } | { type: 'image', data: string }`

### Prompts

Prompts generate reusable prompt templates for AI interactions:

```typescript @snippet wa-mcp-review-prompt
```

**Response format**: Array of `{ role: 'user' | 'assistant' | 'system', content: { type: 'text' | 'image', text: string, data?: string } }`

## Wiring Configuration

Resources and prompts are wired explicitly; tools register themselves when exported:

```typescript @snippet wa-mcp-wiring-config
```

**Required Properties:**
- `wireMCPResource`: `uri`, `title`, `description`, `func`
- `wireMCPPrompt`: `name`, `description`, `func`
- Tools have **no wiring call** — pass `description` (plus optional `name`, `title`, `summary`, `middleware`, `permissions`, `tags`) directly to `pikkuMCPToolFunc`.

Both wiring functions also accept optional `middleware`, `permissions`, and `tags`.

## Running the MCP Server

MCP endpoints run through the MCP server runtime (stdio transport), which any MCP client can connect to. See the [MCP Server runtime](/docs/runtimes/mcp-server) for setup and client configuration.

AI agents can then discover and invoke your resources, tools, and prompts through the MCP protocol.

## Error Handling

MCP functions should throw errors when operations fail. Register errors with both HTTP status codes and MCP error codes:

```typescript @snippet wa-mcp-error
```

Now use your error in MCP functions:

```typescript @snippet wa-mcp-error-usage
```

## Next Steps

- [MCP Tools](./tools.md) - Actions AI agents can invoke
- [MCP Resources](./resources.md) - Data sources for AI agents
- [MCP Prompts](./prompts.md) - Template generators for AI interactions
- [`#pikku/mcp` in the SDK explorer](/api#app/mcp) - every export on the MCP door
