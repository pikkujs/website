---
sidebar_position: 0
title: MCP (Model Context Protocol)
description: Expose functions to AI agents as resources, tools, and prompts
---

# MCP (Model Context Protocol)

MCP lets AI agents access your application's data and capabilities. Your Pikku functions can become resources (data sources), tools (actions), and prompts (templates) that AI models interact with directly.

Your domain functions don't need to know they're being called by an AI agent. They receive typed input, do their work, and return structured data. Pikku handles all the MCP protocol details.

## Your First MCP Endpoint

Here are MCP functions and wiring from the templates, showing a tool, resource, and two prompts:

```typescript reference title="mcp.functions.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/mcp.functions.ts
```

```typescript reference title="mcp.wiring.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/mcp.wiring.ts
```

That's it! AI agents can now request your documentation. Pikku automatically:
- **Generates JSON schemas** from your TypeScript types (during `npx pikku`)
- **Validates the input** against your function's type
- **Calls your function** with clean, typed data
- **Formats the response** according to MCP protocol
- **Handles errors** appropriately

### Automatic Schema Generation

When you define an MCP function with TypeScript types:

```typescript
export const getProjectDocs = pikkuMCPResourceFunc<{ section: string }>(
  async (services, data, { mcp }) => { ... }
)
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

```typescript
export const searchCode = pikkuMCPResourceFunc<{ query: string; limit?: number }>(
  async ({ database }, data) => {
    const results = await database.query('code_index', {
      where: { content: { contains: data.query } },
      limit: data.limit ?? 20
    })

    return results.map(r => ({
      uri: `file://${r.filePath}:${r.lineNumber}`,
      text: r.codeSnippet
    }))
  }
)
```

**Response format**: Array of `{ uri: string, text: string }`

### Tools

Tools let AI models perform actions - creating records, running operations, or modifying state. The template's `createTodoTool` (in `mcp.functions.ts` above) is an example. Tools return an array of content blocks:

**Response format**: Array of `{ type: 'text', text: string } | { type: 'image', data: string }`

### Prompts

Prompts generate reusable prompt templates for AI interactions:

```typescript
export const codeReviewPrompt = pikkuMCPPromptFunc<{ filePath: string; context: string }>(
  async ({ database }, data) => {
    const file = await database.query('files', {
      where: { path: data.filePath }
    })

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Review this code:\n\nFile: ${data.filePath}\n\nContext: ${data.context}\n\nCode:\n${file.content}`
        }
      }
    ]
  }
)
```

**Response format**: Array of `{ role: 'user' | 'assistant' | 'system', content: { type: 'text' | 'image', text: string, data?: string } }`

## Wiring Configuration

Resources and prompts are wired explicitly; tools register themselves when exported:

```typescript
import { wireMCPResource, wireMCPPrompt } from '#pikku/mcp'
import { getUserInfo, codeReviewPrompt } from './functions/mcp.functions.js'

wireMCPResource({
  uri: 'user/{userId}',
  title: 'User Information',
  description: 'Get user profile by ID',
  func: getUserInfo
})

wireMCPPrompt({
  name: 'codeReview',
  description: 'Generate a code review prompt',
  func: codeReviewPrompt
})
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

```typescript
import { PikkuError, addError } from '#pikku/error'

export class ResourceNotFoundError extends PikkuError {}

addError(ResourceNotFoundError, {
  status: 404,
  mcpCode: -32601,  // MCP "method not found"
  message: 'The requested resource does not exist'
})
```

Now use your error in MCP functions:

```typescript
export const getFile = pikkuMCPResourceFunc<{ path: string }>(
  async ({ database }, data) => {
    const file = await database.query('files', {
      where: { path: data.path }
    })

    if (!file) {
      throw new ResourceNotFoundError(`File not found: ${data.path}`)
    }

    return [
      {
        uri: `file://${data.path}`,
        text: file.content
      }
    ]
  }
)
```

## Next Steps

- [MCP Tools](./tools.md) - Actions AI agents can invoke
- [MCP Resources](./resources.md) - Data sources for AI agents
- [MCP Prompts](./prompts.md) - Template generators for AI interactions
- [`#pikku/mcp` API reference](/docs/api-reference/wire/mcp) - every export on the MCP door
