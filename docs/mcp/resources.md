# MCP Resources

MCP resources provide data sources that AI models can read from. They support both static and parameterized URIs for flexible data access.

## Creating Resources

Use `pikkuMCPResourceFunc` to create MCP resources:

```typescript
import { pikkuMCPResourceFunc } from '../.pikku/pikku-types.gen.js'

export const getStaticResource = pikkuMCPResourceFunc(async ({ mcp }) => {
  return [
    {
      uri: mcp.uri!,
      text: JSON.stringify('Hello! This is a static resource.'),
    },
  ]
})
```

## Parameterized Resources

Resources can accept parameters through URI templates:

```typescript
import { NotFoundError } from '@pikku/core'

export const getUserInfo = pikkuMCPResourceFunc<{ userId: string }>(
  async (services, { userId }) => {
    services.logger.info(`Getting user info for: ${userId}`)

    // Mock user data - in a real app this would come from a database
    const mockUsers: Record<
      string,
      { userId: string; name: string; email: string; lastLogin: string }
    > = {
      '123': {
        userId: '123',
        name: 'John Doe',
        email: 'john@example.com',
        lastLogin: '2024-01-15T10:30:00Z',
      },
      '456': {
        userId: '456',
        name: 'Jane Smith',
        email: 'jane@example.com',
        lastLogin: '2024-01-14T15:45:00Z',
      },
    }

    const user = mockUsers[userId]
    if (!user) {
      throw new NotFoundError(`User not found: ${userId}`)
    }

    return [
      {
        uri: `getUserInfo/${userId}`,
        text: JSON.stringify(user),
      },
    ]
  }
)
```

## Registering Resources

Register your resources in the routes file:

```typescript
// mcp.routes.ts
import { addMCPResource } from '../.pikku/pikku-types.gen.js'
import { getStaticResource, getUserInfo } from './mcp.functions.js'

addMCPResource({
  uri: 'getStaticResource',
  title: 'Static Resource',
  description: 'Gets a static resource with predefined data',
  func: getStaticResource,
})

addMCPResource({
  uri: 'getUserInfo/{userId}',
  title: 'User Information',
  description: 'Retrieve user information by user ID',
  func: getUserInfo,
  tags: ['user', 'profile', 'data'],
})
```

## Return Format

Resources return an array of resource objects:

```typescript
return [
  {
    uri: 'resource-identifier',
    text: 'Resource content as text',
    // Optional: mimeType, blob for binary data
  },
]
```

## Error Handling

Use Pikku's built-in error types for proper error responses:

```typescript
import { NotFoundError, BadRequestError } from '@pikku/core'

if (!user) {
  throw new NotFoundError(`User not found: ${userId}`)
}
```