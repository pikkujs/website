# MCP Resources

Resources are data sources for AI agents. They provide queryable information - documentation, user data, search results, or any content your AI agents need to access.

:::info Single Type Parameter
MCP resource functions take a **single input type parameter** — the output is always `MCPResourceResponse`:

```typescript
// ✅ Correct - input type only
pikkuMCPResourceFunc<InputType>

// ❌ Wrong - there is no output type parameter
pikkuMCPResourceFunc<InputType, MCPResourceResponse>
```

Alternatively, pass a schema as `input` (e.g. Zod) and the input type is inferred.
:::

**Recommended Pattern**: Keep your MCP resources thin. Use RPC to invoke your existing domain functions, then format the response for MCP. This keeps your business logic reusable and your codebase clean.

## Your First Resource

Let's create a resource that provides user information. Both the domain function and MCP adapter live in the same file:

```typescript
// user.function.ts
import { pikkuFunc, pikkuMCPResourceFunc } from '#pikku'
import { NotFoundError } from '@pikku/core/errors'

// Domain function - reusable across all transports
export const getUserInfo = pikkuFunc<
  { userId: string },
  { userId: string; name: string; email: string; lastLogin: string }
>({
  func: async ({ database }, data) => {
    const user = await database.query('users', {
      where: { userId: data.userId }
    })

    if (!user) {
      throw new NotFoundError(`User not found: ${data.userId}`)
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin
    }
  },
  title: 'Get user information by ID',
  tags: ['users']
})

// MCP adapter - just formats the response for AI agents
export const getUserInfoMCP = pikkuMCPResourceFunc<{ userId: string }>(
  async (services, data, { rpc }) => {
    const user = await rpc.invoke('getUserInfo', data)

    return [
      {
        uri: `user://${user.userId}`,
        text: JSON.stringify(user)
      }
    ]
  }
)
```

```typescript
// user.mcp.ts
import { wireMCPResource } from '#pikku'
import { getUserInfoMCP } from './functions/user.function.js'

wireMCPResource({
  uri: 'user/{userId}',
  title: 'User Information',
  description: 'Retrieve user information by user ID',
  func: getUserInfoMCP,
  tags: ['user', 'profile']
})
```

Now your business logic in `getUserInfo` can be used from HTTP, WebSocket, or MCP - and `getUserInfoMCP` just makes it MCP-compatible.

## Static Resources

Resources without parameters return fixed data. First, the domain function:

```typescript
export const getProjectReadme = pikkuFunc<void, { content: string; path: string }>({
  func: async ({ database }) => {
    const readme = await database.query('files', {
      where: { path: 'README.md' }
    })

    return {
      content: readme.content,
      path: readme.path
    }
  },
  title: 'Get project README',
  tags: ['docs']
})
```

Then the MCP adapter:

```typescript
export const getProjectReadmeMCP = pikkuMCPResourceFunc<void>(
  async (services, data, { rpc }) => {
    const readme = await rpc.invoke('getProjectReadme', {})

    return [
      {
        uri: 'project://readme',
        text: readme.content
      }
    ]
  }
)
```

## Parameterized Resources

Resources can accept parameters to provide flexible data access. The domain function:

```typescript
export const searchDocs = pikkuFunc<
  { query: string; limit?: number },
  Array<{ id: string; section: string; content: string }>
>({
  func: async ({ database }, data) => {
    const results = await database.query('documentation', {
      where: { content: { contains: data.query } },
      limit: data.limit ?? 20
    })

    return results
  },
  title: 'Search documentation',
  tags: ['docs', 'search']
})
```

The MCP adapter that formats results:

```typescript
export const searchDocsMCP = pikkuMCPResourceFunc<{ query: string; limit?: number }>(
  async (services, data, { rpc }) => {
    const results = await rpc.invoke('searchDocs', data)

    // Return multiple resource objects
    return results.map(doc => ({
      uri: `docs://${doc.section}/${doc.id}`,
      text: doc.content
    }))
  }
)
```

## Response Format

Resources must return an array of resource objects:

```typescript
type MCPResourceResponse = Array<{
  uri: string       // Resource identifier (like a URL)
  text: string      // Resource content as text
}>
```

The `uri` field identifies each resource. Use any scheme that makes sense for your domain:
- `user://123` - User data
- `file:///path/to/file` - File contents
- `docs://getting-started` - Documentation section
- `search://results/xyz` - Search results

The `text` field contains the actual content, often as JSON:

```typescript
return [
  {
    uri: 'user://123',
    text: JSON.stringify({ name: 'John', email: 'john@example.com' })
  }
]
```

## Wiring Configuration

Wire your resource functions with these options:

```typescript
import { wireMCPResource } from '#pikku'
import { searchDocsMCP } from './functions/docs.function.js'
import { requireRead } from './permissions.js'
import { auditMiddleware } from './middleware.js'

wireMCPResource({
  // Required
  uri: 'docs/search/{query}',
  title: 'Search Documentation',
  description: 'Search project documentation',
  func: searchDocsMCP,

  // Optional
  middleware: [auditMiddleware],
  tags: ['docs', 'search']
})
```

## Error Handling

Your domain functions handle validation and errors:

```typescript
import { NotFoundError, BadRequestError } from '@pikku/core/errors'

export const getFile = pikkuFunc<
  { path: string },
  { path: string; content: string }
>({
  func: async ({ database }, data) => {
    if (!data.path || data.path.includes('..')) {
      throw new BadRequestError('Invalid file path')
    }

    const file = await database.query('files', {
      where: { path: data.path }
    })

    if (!file) {
      throw new NotFoundError(`File not found: ${data.path}`)
    }

    return file
  },
  title: 'Get file contents',
  tags: ['files']
})
```

The MCP adapter just formats the result:

```typescript
export const getFileMCP = pikkuMCPResourceFunc<{ path: string }>(
  async (services, data, { rpc }) => {
    const file = await rpc.invoke('getFile', data)

    return [
      {
        uri: `file://${file.path}`,
        text: file.content
      }
    ]
  }
)
```

Errors are automatically formatted according to MCP protocol with the registered error codes.

## Multiple Resources

Domain functions can return arrays that MCP adapters map to multiple resources:

```typescript
export const getRelatedDocs = pikkuFunc<
  { docId: string },
  { main: { id: string; content: string }; related: Array<{ id: string; content: string }> }
>({
  func: async ({ database }, data) => {
    const doc = await database.query('docs', {
      where: { id: data.docId }
    })

    const related = await database.query('docs', {
      where: { tags: { some: doc.tags } },
      limit: 5
    })

    return { main: doc, related }
  },
  title: 'Get document and related documents',
  tags: ['docs']
})
```

The MCP adapter returns multiple resource objects:

```typescript
export const getRelatedDocsMCP = pikkuMCPResourceFunc<{ docId: string }>(
  async (services, data, { rpc }) => {
    const result = await rpc.invoke('getRelatedDocs', data)

    // Return the main doc and all related docs
    return [
      { uri: `docs://${result.main.id}`, text: result.main.content },
      ...result.related.map(r => ({
        uri: `docs://${r.id}`,
        text: r.content
      }))
    ]
  }
)
```

This allows AI agents to efficiently fetch related data in a single request.

## Next Steps

- [MCP Tools](./tools.md) - Perform actions through AI agents
- [MCP Prompts](./prompts.md) - Generate structured conversation templates