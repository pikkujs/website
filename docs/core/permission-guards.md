---
sidebar_position: 50
title: Permission Guards
description: Authorization and access control
---

# Permission Guards

Permissions in Pikku run before your function executes. They're boolean checks that determine whether a request should proceed - if any permission returns `false`, the request is rejected with a 403 Forbidden.

Permissions run in parallel, so they should be independent checks that don't depend on execution order.

## Your First Permission

A permission is a function that returns a boolean:

```typescript
import { pikkuPermission } from '#pikku/pikku-types.gen.js'

export const requireAuth = pikkuPermission(async (_services, _data, session) => {
  return session?.userId != null
})

export const requireAdmin = pikkuPermission(async (_services, _data, session) => {
  return session?.role === 'admin'
})
```

Use them in your function:

```typescript
import { pikkuFunc } from '#pikku/pikku-types.gen.js'

export const deleteUser = pikkuFunc<{ userId: string }, void>({
  func: async ({ database }, data) => {
    await database.delete('users', { where: { id: data.userId } })
  },
  permissions: {
    auth: requireAuth,
    admin: requireAdmin
  },
  docs: {
    summary: 'Delete a user',
    tags: ['users']
  }
})
```

Both permissions must pass for the function to execute. If either returns `false`, the request is rejected.

## Permission Signature

```typescript
pikkuPermission<DataType>(
  async (services, data, session) => boolean
)
```

Parameters:
- **services** - Your application services (destructure what you need)
- **data** - The input data (typed with `DataType`)
- **session** - The current user session (from `userSession.get()`)

Return `true` to allow access, `false` to deny with 403.

## Data-Based Permissions

Permissions can inspect the request data:

```typescript
export const requireOwnership = pikkuPermission<{ resourceId: string }>(
  async ({ database }, data, session) => {
    if (!session?.userId) return false

    const resource = await database.query('resources', {
      where: { id: data.resourceId }
    })

    return resource?.ownerId === session.userId
  }
)
```

Use it in a function with matching data type:

```typescript
export const updateResource = pikkuFunc<
  { resourceId: string; content: string },
  Resource
>({
  func: async ({ database }, data) => {
    return await database.update('resources', {
      where: { id: data.resourceId },
      data: { content: data.content }
    })
  },
  permissions: {
    auth: requireAuth,
    owner: requireOwnership  // Uses resourceId from data
  },
  docs: {
    summary: 'Update a resource',
    tags: ['resources']
  }
})
```

## Permission Groups

You can compose multiple permissions:

```typescript
export const requirePremium = pikkuPermission(async ({ database }, _data, session) => {
  if (!session?.userId) return false

  const user = await database.query('users', {
    where: { id: session.userId }
  })

  return user?.isPremium === true
})

// Use multiple permissions together
export const getPremiumContent = pikkuFunc<{ contentId: string }, Content>({
  func: async ({ database }, data) => {
    return await database.query('premium_content', {
      where: { id: data.contentId }
    })
  },
  permissions: {
    auth: requireAuth,
    premium: requirePremium
  },
  docs: {
    summary: 'Get premium content',
    tags: ['content']
  }
})
```

## Complex Permissions

Permissions can perform complex queries:

```typescript
export const withinQuota = pikkuPermission(async ({ database }, _data, session) => {
  if (!session?.userId) return false

  const usage = await database.query('api_usage', {
    where: {
      userId: session.userId,
      date: new Date().toISOString().split('T')[0]
    }
  })

  return (usage?.requestCount || 0) < 1000  // Daily limit
})

export const activeSubscription = pikkuPermission(
  async ({ database }, _data, session) => {
    if (!session?.userId) return false

    const sub = await database.query('subscriptions', {
      where: { userId: session.userId }
    })

    if (!sub) return false

    return new Date(sub.expiresAt) > new Date()
  }
)
```

## HTTP-Specific Permissions

For HTTP routes, you can apply permissions at the route level or globally:

```typescript
import { wireHTTP } from '#pikku/pikku-types.gen.js'

// Route-level permissions
wireHTTP({
  method: 'delete',
  route: '/users/:userId',
  func: deleteUser,
  permissions: {
    auth: requireAuth,
    admin: requireAdmin
  }
})
```

Or apply to all routes with a prefix:

```typescript
import { addHTTPPermission } from '#pikku/pikku-types.gen.js'

// All /admin routes require authentication and admin role
addHTTPPermission('/admin', {
  auth: requireAuth,
  admin: requireAdmin
})

// All routes require authentication
addHTTPPermission('*', {
  auth: requireAuth
})
```

See [HTTP Router](../http/router.md) for more on `addHTTPPermission`.

## Error Handling

If a permission throws an error, it's treated as a server error (500), not unauthorized (403):

```typescript
// ✅ Good - returns false for unauthorized
export const requireOwnership = pikkuPermission(async ({ database }, data, session) => {
  if (!session?.userId) return false

  try {
    const resource = await database.query('resources', {
      where: { id: data.resourceId }
    })
    return resource?.ownerId === session.userId
  } catch (error) {
    // Database error - let it throw (500)
    throw error
  }
})

// ❌ Bad - throws for unauthorized
export const requireOwnership = pikkuPermission(async ({ database }, data, session) => {
  if (!session?.userId) {
    throw new Error('Not authenticated')  // This returns 500, not 403!
  }
  // ...
})
```

Use `return false` for authorization failures. Only throw for actual errors.

## Parallel Execution

All permissions run in parallel. The first one to return `false` or throw an error will stop the request:

```typescript
permissions: {
  auth: requireAuth,        // Runs in parallel
  admin: requireAdmin,      // Runs in parallel
  quota: withinQuota,       // Runs in parallel
}
```

Don't depend on execution order - each permission should be an independent check.

## Auth vs Permissions

**auth** flag controls whether a session is required:

```typescript
// Requires session to exist (default)
export const getProfile = pikkuFunc({
  func: async ({ database }, _data, session) => {
    // session is guaranteed to exist
    return await database.query('users', { where: { id: session.userId } })
  },
  auth: true,  // Default
  docs: {
    summary: 'Get user profile',
    tags: ['users']
  }
})

// No session required
export const getPublicContent = pikkuFunc({
  func: async ({ database }, data) => {
    return await database.query('content', { where: { id: data.id } })
  },
  auth: false,
  docs: {
    summary: 'Get public content',
    tags: ['content']
  }
})
```

**permissions** run additional checks after auth:

```typescript
export const deleteAccount = pikkuFunc({
  func: async ({ database }, _data, session) => {
    await database.delete('users', { where: { id: session.userId } })
  },
  auth: true,  // Session required
  permissions: {
    verified: requireEmailVerified,  // Additional check
    notBanned: requireNotBanned      // Additional check
  },
  docs: {
    summary: 'Delete account',
    tags: ['users']
  }
})
```

## Reusable Permissions

Define permissions once, reuse everywhere:

```typescript
// permissions.ts
export const requireAuth = pikkuPermission(async (_services, _data, session) => {
  return session?.userId != null
})

export const requireAdmin = pikkuPermission(async (_services, _data, session) => {
  return session?.role === 'admin'
})

export const requireOwnership = pikkuPermission<{ resourceId: string }>(
  async ({ database }, data, session) => {
    if (!session?.userId) return false
    const resource = await database.query('resources', {
      where: { id: data.resourceId }
    })
    return resource?.ownerId === session.userId
  }
)
```

Then import and use:

```typescript
import { requireAuth, requireAdmin, requireOwnership } from './permissions.js'

export const updateResource = pikkuFunc({
  func: async ({ database }, data) => { /* ... */ },
  permissions: {
    auth: requireAuth,
    owner: requireOwnership
  },
  docs: {
    summary: 'Update resource',
    tags: ['resources']
  }
})

export const deleteUser = pikkuFunc({
  func: async ({ database }, data) => { /* ... */ },
  permissions: {
    auth: requireAuth,
    admin: requireAdmin
  },
  docs: {
    summary: 'Delete user',
    tags: ['users']
  }
})
```

## Best Practices

**Keep permissions focused** - One check per permission:

```typescript
// ✅ Good - single responsibility
export const requireAuth = pikkuPermission(...)
export const requireAdmin = pikkuPermission(...)
export const requireVerified = pikkuPermission(...)

permissions: {
  auth: requireAuth,
  admin: requireAdmin,
  verified: requireVerified
}

// ❌ Bad - doing too much
export const requireEverything = pikkuPermission(async (services, data, session) => {
  if (!session?.userId) return false
  if (session.role !== 'admin') return false
  if (!session.emailVerified) return false
  // Too many concerns
})
```

**Optimize expensive checks** - Cache when possible:

```typescript
// ✅ Good - caches subscription check
export const requireSubscription = pikkuPermission(
  async ({ cache, database }, _data, session) => {
    if (!session?.userId) return false

    const cacheKey = `sub:${session.userId}`
    const cached = await cache.get(cacheKey)
    if (cached !== null) return cached === 'true'

    const sub = await database.query('subscriptions', {
      where: { userId: session.userId }
    })

    const isActive = sub && new Date(sub.expiresAt) > new Date()
    await cache.set(cacheKey, isActive ? 'true' : 'false', { ttl: 300 })

    return isActive
  }
)
```

**Return false, don't throw** - For authorization failures:

```typescript
// ✅ Good
if (!session?.userId) return false

// ❌ Bad
if (!session?.userId) throw new Error('Unauthorized')  // Returns 500, not 403
```

## Next Steps

- [Functions](./functions.md) - Understanding Pikku functions
- [HTTP Router](../http/router.md) - HTTP-specific permissions with `addHTTPPermission`
- [Middleware](./middleware.md) - Request/response transformation
