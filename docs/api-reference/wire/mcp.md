---
title: '#pikku/mcp'
sidebar_label: '#pikku/mcp'
sidebar_position: 5
description: 'Wires a function as an MCP tool, resource or prompt for a model to call.'
---

# `#pikku/mcp`

Wires a function as an MCP tool, resource or prompt for a model to call.

```typescript
import { pikkuMCPPromptFunc, pikkuMCPResourceFunc, pikkuMCPToolFunc } from '#pikku/mcp'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`pikkuMCPPromptFunc`](#pikkumcppromptfunc) | function | Creates a function for handling MCP prompt requests. These functions generate prompt templates for AI models. |
| [`pikkuMCPResourceFunc`](#pikkumcpresourcefunc) | function | Creates a function for handling MCP resource requests. These functions provide data that AI models can access. |
| [`pikkuMCPToolFunc`](#pikkumcptoolfunc) | function | Creates a function for handling MCP tool invocations. These functions perform actions that AI models can request. |
| [`wireMCPPrompt`](#wiremcpprompt) | function | Registers an MCP prompt with the Pikku framework. Prompts provide templates that AI models can use. |
| [`wireMCPResource`](#wiremcpresource) | function | Registers an MCP resource with the Pikku framework. Resources provide data that AI models can access. |

## Reference

### `pikkuMCPPromptFunc` {#pikkumcppromptfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function for handling MCP prompt requests.
These functions generate prompt templates for AI models.

Supports two patterns:
1. Generic types: `pikkuMCPPromptFunc&lt;Input&gt;(&#123; func: ... &#125;)`
2. Zod schemas: `pikkuMCPPromptFunc(&#123; input: z.object(...), func: ... &#125;)`

```typescript
pikkuMCPPromptFunc: { <InputSchema extends StandardSchemaV1>(config: MCPPromptFuncConfigWithSchema<InputSchema>): PikkuFunctionConfig<InferSchemaOutput<InputSchema>, MCPPromptResponse, "mcp" | "rpc">; <In>(func: PikkuFunctionSessionless<In, MCPPromptResponse, "mcp" | "rpc"> | { func: PikkuFunctionSessionless<In, MCPPromptResponse, "mcp" | "rpc">; name?: string; }): PikkuFunctionConfig<In, MCPPromptResponse, "mcp" | "rpc">; }
```

```typescript
// MCP prompts give AI agents reusable conversation starters.
export const productRecommendation = pikkuMCPPromptFunc<{
  category: string
  budget: number
}>(async ({}, { category, budget }) => {
  return [
    {
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `Recommend products in "${category}" under £${budget}. List top 3 with prices.`,
      },
    },
  ]
})

wireMCPPrompt({
  name: 'product_recommendation',
  description:
    'Generate a product recommendation prompt for a given category and budget',
  func: productRecommendation,
})
```

### `pikkuMCPResourceFunc` {#pikkumcpresourcefunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function for handling MCP resource requests.
These functions provide data that AI models can access.

Supports two patterns:
1. Generic types: `pikkuMCPResourceFunc&lt;Input&gt;(&#123; func: ... &#125;)`
2. Zod schemas: `pikkuMCPResourceFunc(&#123; input: z.object(...), func: ... &#125;)`

```typescript
pikkuMCPResourceFunc: { <InputSchema extends StandardSchemaV1>(config: MCPResourceFuncConfigWithSchema<InputSchema>): PikkuFunctionConfig<InferSchemaOutput<InputSchema>, MCPResourceResponse, "mcp" | "rpc">; <In>(func: PikkuFunctionSessionless<In, MCPResourceResponse, "mcp" | "rpc"> | { func: PikkuFunctionSessionless<In, MCPResourceResponse, "mcp" | "rpc">; name?: string; }): PikkuFunctionConfig<In, MCPResourceResponse, "mcp" | "rpc">; }
```

```typescript
// MCP resources let AI agents read data by URI template.
export const itemResource = pikkuMCPResourceFunc<{ itemId: string }>(
  async ({ kysely }, { itemId }, { mcp }) => {
    const item = await kysely
      .selectFrom('item')
      .selectAll()
      .where('itemId', '=', itemId)
      .executeTakeFirstOrThrow()
    return [{ uri: mcp.uri!, text: JSON.stringify(item) }]
  }
)

wireMCPResource({
  uri: 'shop://items/{itemId}',
  title: 'Shop Item',
  description: 'Retrieve a single shop item by ID',
  func: itemResource,
})
```

### `pikkuMCPToolFunc` {#pikkumcptoolfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function for handling MCP tool invocations.
These functions perform actions that AI models can request.

Supports two patterns:
1. Generic types: `pikkuMCPToolFunc&lt;Input&gt;(&#123; func: ... &#125;)`
2. Zod schemas: `pikkuMCPToolFunc(&#123; input: z.object(...), func: ... &#125;)`

```typescript
pikkuMCPToolFunc: { <InputSchema extends StandardSchemaV1>(config: MCPToolFuncConfigWithSchema<InputSchema>): PikkuFunctionConfig<InferSchemaOutput<InputSchema>, MCPToolResponse, "mcp" | "rpc">; <In>(func: PikkuFunctionSessionless<In, MCPToolResponse, "mcp" | "rpc"> | { func: PikkuFunctionSessionless<In, MCPToolResponse, "mcp" | "rpc">; description?: string; tags?: string[]; title?: string; summary?: string; name?: string; middleware?: PikkuMiddleware[]; permissions?: CorePermissionGroup<PikkuPermission<In>>; }): PikkuFunctionConfig<In, MCPToolResponse, "mcp" | "rpc">; }
```

```typescript
// Any Pikku function becomes an MCP tool — the same implementation already wired to HTTP.
export const getItemForAI = pikkuMCPToolFunc<{ itemId: string }>({
  description: 'Retrieve a shop item by its ID',
  func: async (_services, { itemId }, { rpc }) => {
    const result = await rpc.invoke('getItem', { itemId })
    return [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
  },
})
```

### `wireMCPPrompt` {#wiremcpprompt}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers an MCP prompt with the Pikku framework.
Prompts provide templates that AI models can use.

```typescript
wireMCPPrompt: <In>(mcpPrompt: MCPPromptWiring<In>) => void
```

<details>
<summary>Config keys (7)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` <sup>required</sup> | `string` | What the prompt is for, written for the human picking it out of a list. |
| `errors` | `string[]` | Names of error classes this may throw, so the client is told which failures are its own fault. |
| `func` <sup>required</sup> | `PikkuFunctionConfig<In, MCPPromptResponse, "rpc" \| "mcp" \| "session">` | The function to run. It is sessionless: an MCP client is not a logged-in user. |
| `middleware` | `CorePikkuMiddleware<any>[]` | Wraps every call: tracing, rate limiting, whatever the transport does not do. |
| `name` <sup>required</sup> | `string` | How the client asks for this prompt. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this wiring in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
// MCP prompts give AI agents reusable conversation starters.
export const productRecommendation = pikkuMCPPromptFunc<{
  category: string
  budget: number
}>(async ({}, { category, budget }) => {
  return [
    {
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `Recommend products in "${category}" under £${budget}. List top 3 with prices.`,
      },
    },
  ]
})

wireMCPPrompt({
  name: 'product_recommendation',
  description:
    'Generate a product recommendation prompt for a given category and budget',
  func: productRecommendation,
})
```

### `wireMCPResource` {#wiremcpresource}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers an MCP resource with the Pikku framework.
Resources provide data that AI models can access.

```typescript
wireMCPResource: <In, URI extends string>(mcpResource: MCPResourceWiring<In, URI> & AssertMCPResourceURIParams<In, URI>) => void
```

<details>
<summary>Config keys (11)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` <sup>required</sup> | `string` | What the resource holds, written for the model deciding whether to read it. |
| `errors` | `string[]` | Names of error classes this may throw, so the client is told which failures are its own fault. |
| `func` <sup>required</sup> | `PikkuFunctionConfig<In, MCPResourceResponse, "rpc" \| "mcp" \| "session">` | The function to run. It is sessionless: an MCP client is not a logged-in user. |
| `middleware` | `CorePikkuMiddleware<any>[]` | Wraps every call: tracing, rate limiting, whatever the transport does not do. |
| `mimeType` | `string` | The media type of what the function returns, so the client knows whether it is text, JSON or an image. |
| `size` | `number` | Size in bytes, where it is known ahead of the read. A client uses it to decide whether to fetch at all. |
| `streaming` | `boolean` | Whether the function returns the content in chunks rather than at once. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this wiring in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` <sup>required</sup> | `string` | The name a human sees in a client's resource list. |
| `uri` <sup>required</sup> | `string` | How the client addresses this resource. `&#123;name&#125;` marks a parameter, and every parameter must be a key of the function's input schema. |

</details>

```typescript
// MCP resources let AI agents read data by URI template.
export const itemResource = pikkuMCPResourceFunc<{ itemId: string }>(
  async ({ kysely }, { itemId }, { mcp }) => {
    const item = await kysely
      .selectFrom('item')
      .selectAll()
      .where('itemId', '=', itemId)
      .executeTakeFirstOrThrow()
    return [{ uri: mcp.uri!, text: JSON.stringify(item) }]
  }
)

wireMCPResource({
  uri: 'shop://items/{itemId}',
  title: 'Shop Item',
  description: 'Retrieve a single shop item by ID',
  func: itemResource,
})
```

## Inside an addon

Addon authors import this door as `#pikku/addon/mcp`, with one difference:

- Not available: `wireMCPPrompt`, `wireMCPResource` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc mcp` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
