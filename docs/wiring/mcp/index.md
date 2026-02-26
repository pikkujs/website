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
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/mcp.functions.ts
```

```typescript reference title="mcp.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/mcp.wiring.ts
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
export const getProjectDocs = pikkuMCPResourceFunc<
  { section: string },
  MCPResourceResponse
>({ ... })
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
import type { MCPResourceResponse } from '#pikku'

export const searchCode = pikkuMCPResourceFunc<
  { query: string; limit?: number },
  MCPResourceResponse
>({
  func: async ({ database }, data) => {
    const results = await database.query('code_index', {
      where: { content: { contains: data.query } },
      limit: data.limit ?? 20
    })

    return results.map(r => ({
      uri: `file://${r.filePath}:${r.lineNumber}`,
      text: r.codeSnippet
    }))
  },
  title: 'Search codebase',
  tags: ['mcp', 'code-search']
})
```

**Response format**: Array of `{ uri: string, text: string }`

### Tools

Tools let AI models perform actions - creating records, running operations, or modifying state. The template's `createTodoTool` (in `mcp.functions.ts` above) is an example. Tools return an array of content blocks:

**Response format**: Array of `{ type: 'text', text: string } | { type: 'image', data: string }`

### Prompts

Prompts generate reusable prompt templates for AI interactions:

```typescript
import type { MCPPromptResponse } from '#pikku'

export const codeReviewPrompt = pikkuMCPPromptFunc<
  { filePath: string; context: string },
  MCPPromptResponse
>({
  func: async ({ database }, data) => {
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
  },
  title: 'Generate code review prompt',
  tags: ['mcp', 'code-review']
})
```

**Response format**: Array of `{ role: 'user' | 'assistant' | 'system', content: { type: 'text' | 'image', text: string, data?: string } }`

## Wiring Configuration

Wire your MCP functions with these configuration options:

```typescript
import { wireMCPTool } from '#pikku/mcp'
import { createIssue } from './functions/issues.function.js'
import { requireAdmin } from './permissions.js'
import { auditMiddleware } from './middleware.js'

wireMCPTool({
  // Required
  name: 'createIssue',
  description: 'Create a new issue in the tracker',
  func: createIssue,

  // Optional
  title: 'Create Issue',  // Display name for the tool
  middleware: [auditMiddleware],
  permissions: { admin: requireAdmin },
  tags: ['issues', 'write']
})
```

**Required Properties:**
- `wireMCPResource`: `uri`, `title`, `description`, `func`
- `wireMCPTool`: `name`, `description`, `func` (optional: `title`)
- `wireMCPPrompt`: `name`, `description`, `func`

All three wiring functions support the same optional configuration (middleware, permissions, tags).

## Running the MCP Server

Start your MCP server to expose functions to AI agents:

```bash
npx pikku serve mcp
```

AI agents can now discover and invoke your resources, tools, and prompts through the MCP protocol.

## Error Handling

MCP functions should throw errors when operations fail. Register errors with both HTTP status codes and MCP error codes:

```typescript
import { PikkuError } from '@pikku/core/errors'
import { addError } from '#pikku'

export class ResourceNotFoundError extends PikkuError {}

addError(ResourceNotFoundError, {
  status: 404,
  mcpCode: -32601,  // MCP "method not found"
  message: 'The requested resource does not exist'
})
```

Now use your error in MCP functions:

```typescript
export const getFile = pikkuMCPResourceFunc<
  { path: string },
  MCPResourceResponse
>({
  func: async ({ database }, data) => {
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
  },
  title: 'Get file contents',
  tags: ['mcp']
})
```

## Next Steps

- [MCP Tools](./tools.md) - Actions AI agents can invoke
- [MCP Resources](./resources.md) - Data sources for AI agents
- [MCP Prompts](./prompts.md) - Template generators for AI interactions
