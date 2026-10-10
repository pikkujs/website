# MCP Resources

Resources are data sources for AI agents. They provide queryable information - documentation, user data, search results, or any content your AI agents need to access.

:::info Single Type Parameter
MCP resource functions take a **single input type parameter** — the output is always `MCPResourceResponse`. Declare them as `pikkuMCPResourceFunc<InputType>`. There is no output type parameter, so `pikkuMCPResourceFunc<InputType, MCPResourceResponse>` is an error.

Alternatively, pass a schema as `input` (e.g. Zod) and the input type is inferred.
:::

**Recommended Pattern**: Keep your MCP resources thin. Use RPC to invoke your existing domain functions, then format the response for MCP. This keeps your business logic reusable and your codebase clean.

## Your First Resource

Let's create a resource that provides user information. Both the domain function and MCP adapter live in the same file:

```typescript @snippet wa-mcp-res-first
```

```typescript @snippet wa-mcp-res-first-wiring
```

Now your business logic in `getUserInfo` can be used from HTTP, WebSocket, or MCP - and `getUserInfoMCP` just makes it MCP-compatible.

## Static Resources

Resources without parameters return fixed data. This adapter calls an existing domain function over RPC and wraps the result:

```typescript @snippet wa-mcp-res-static
```

## Parameterized Resources

Resources can accept parameters to provide flexible data access. The adapter passes them to an existing domain function and formats the results:

```typescript @snippet wa-mcp-res-param-adapter
```

## Response Format

`MCPResourceResponse` is an array of `{ uri: string, text: string }` objects, where `uri` is a resource identifier (like a URL) and `text` is the resource content as text.

The `uri` field identifies each resource. Use any scheme that makes sense for your domain:
- `user://123` - User data
- `file:///path/to/file` - File contents
- `docs://getting-started` - Documentation section
- `search://results/xyz` - Search results

The `text` field contains the actual content, often as JSON:

The `text` field often holds JSON: stringify the object you want the model to read, for example `JSON.stringify({ name: 'John', email: 'john@example.com' })` against the uri `user://123`.

## Wiring Configuration

Wire your resource functions with these options:

```typescript @snippet wa-mcp-res-wiring-config
```

## Error Handling

Your domain functions handle validation and errors:

```typescript @snippet wa-mcp-res-errors-domain
```

The MCP adapter just formats the result:

```typescript @snippet wa-mcp-res-errors-adapter
```

Errors are automatically formatted according to MCP protocol with the registered error codes.

## Multiple Resources

An adapter can call several domain functions and return multiple resource objects:

```typescript @snippet wa-mcp-res-multi-adapter
```

This allows AI agents to efficiently fetch related data in a single request.

## Next Steps

- [MCP Tools](./tools.md) - Perform actions through AI agents
- [MCP Prompts](./prompts.md) - Generate structured conversation templates