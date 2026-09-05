---
sidebar_position: 50
title: Permission Guards
description: Authorization and access control
---

# Permission Guards

Permissions in Pikku run before your function executes. They're boolean checks that determine whether a request should proceed - if no permission group passes, the request is rejected with a 403 Forbidden.

Permissions should be independent checks that don't depend on execution order or side effects.

## Your First Permission

A permission is a function that returns a boolean. `pikkuPermission` comes from [`#pikku/auth`](/docs/api-reference/guard/auth):

```typescript
import { pikkuPermission } from '#pikku/auth'

export const requireAuth = pikkuPermission(async (_services, _data, { session }) => {
  return session?.userId != null
})

export const requireAdmin = pikkuPermission(async (_services, _data, { session }) => {
  return session?.role === 'admin'
})
```

Use them in your function:

```typescript
import { pikkuFunc } from '#pikku/function'

export const deleteUser = pikkuFunc<{ userId: string }, void>({
  func: async ({ database }, data) => {
    await database.delete('users', { where: { id: data.userId } })
  },
  permissions: {
    auth: requireAuth,
    admin: requireAdmin
  },
  title: 'Delete a user',
  tags: ['users']
})
```

Each key is a separate permission group, and groups use **OR logic** - the function executes if *either* `auth` or `admin` passes. To require both checks together, put them in an array under one key (see [Permission Logic and Execution](#permission-logic-and-execution)).

## Permission Signature

```typescript
pikkuPermission<DataType>(
  async (services, data, { session }) => boolean
)
```

Parameters:
- **services** - Your singleton services only (destructure what you need). Wire services are not available in permissions.
- **data** - The input data (typed with `DataType`)
- **wire** - The wire object (destructure `{ session }` to access the session directly)

Return `true` to allow access, `false` to deny with 403.

:::info Singleton Services Only
Permissions receive **only singleton services** in the first parameter, not wire services. This is because permissions run before wire services are created. If you need access to wire-scoped resources, use the `wire` parameter to access them.
:::

## Data-Based Permissions

Permissions can inspect the request data:

```typescript
export const requireOwnership = pikkuPermission<{ resourceId: string }>(
  async ({ database }, data, { session }) => {
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
  title: 'Update a resource',
  tags: ['resources']
})
```

## Permission Groups

You can compose multiple permissions:

```typescript
export const requirePremium = pikkuPermission(async ({ database }, _data, { session }) => {
  if (!session?.userId) return false

  const dbUser = await database.query('users', {
    where: { id: session.userId }
  })

  return dbUser?.isPremium === true
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
  title: 'Get premium content',
  tags: ['content']
})
```

## Complex Permissions

Permissions can perform complex queries:

```typescript
export const withinQuota = pikkuPermission(async ({ database }, _data, { session }) => {
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
  async ({ database }, _data, { session }) => {
    if (!session?.userId) return false

    const sub = await database.query('subscriptions', {
      where: { userId: session.userId }
    })

    if (!sub) return false

    return new Date(sub.expiresAt) > new Date()
  }
)
```

## Global Permissions

Permissions live on the function definition. To apply an app-wide baseline that **every** function must additionally satisfy, use `addGlobalPermission`:

```typescript
import { addGlobalPermission } from '#pikku/auth'
import { requireAuth } from './permissions.js'

// Every function now also requires a valid session
addGlobalPermission([requireAuth])
```

Global permissions form an independent **AND** gate: they can only ever *narrow* access. Each function still enforces its own `permissions` in full — a broad global (e.g. `requireAuth`) can never satisfy a stricter function's own requirement (e.g. `requireOwnership`).

:::note
Wire-, tag-, and HTTP-route-level permissions (`addHTTPPermission`, `addTagPermission`, and a `permissions` field on the wiring) were removed in 0.13. Declare authorization on the function, plus the optional global gate above. Tags are organizational only — use tag/HTTP _middleware_ for cross-cutting request handling.
:::

## Error Handling

If a permission throws an error, it's treated as a server error (500), not unauthorized (403):

```typescript
// ✅ Good - returns false for unauthorized
export const requireOwnership = pikkuPermission(async ({ database }, data, { session }) => {
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
export const requireOwnership = pikkuPermission(async ({ database }, data, { session }) => {
  if (!session?.userId) {
    throw new Error('Not authenticated')  // This returns 500, not 403!
  }
  // ...
})
```

Use `return false` for authorization failures. Only throw for actual errors.

## Permission Logic and Execution

:::warning Important: Don't Rely on Execution Order
Permission groups are evaluated until one passes (short-circuiting), and permissions inside an array run concurrently via `Promise.all`. This means:
- **Don't rely on execution order** - A group (or array member) may not run at all if an earlier group already passed
- **Avoid side effects** - Don't modify shared state or depend on other permissions running first
- **Keep them independent** - Each permission should be a self-contained check
:::

### OR Logic (Default)

When you list multiple permissions as object keys, **any one can pass** (OR logic):

```typescript
permissions: {
  owner: requireOwner,            // Can pass if it is theirs
  teamMember: requireTeamMember,  // OR if they are on the owning team
  assignee: requireAssignee       // OR if it is assigned to them
}
// Request proceeds if ANY permission returns true
```

Each key is a different way of being entitled to *this row*. That is what OR is
for here — and it is why "is an admin" is not one of them: an admin is entitled
to every row, which is a `scopes` entry rather than a third way of owning
something.

### AND Logic (Arrays)

To require multiple permissions to pass simultaneously, use arrays:

```typescript
permissions: {
  authAndVerified: [requireAuth, requireEmailVerified]  // Both must pass
}
// Request proceeds only if ALL permissions in the array return true
```

Don't depend on execution order - each permission should be an independent check.

## Auth vs Permissions

**auth** flag controls whether a session is required:

```typescript
// Requires session to exist (default)
export const getProfile = pikkuFunc({
  func: async ({ database }, _data, { session }) => {
    // session is guaranteed to exist
    return await database.query('users', { where: { id: session?.userId } })
  },
  auth: true,  // Default
  title: 'Get user profile',
  tags: ['users']
})

// No session required
export const getPublicContent = pikkuFunc({
  func: async ({ database }, data) => {
    return await database.query('content', { where: { id: data.id } })
  },
  auth: false,
  title: 'Get public content',
  tags: ['content']
})
```

**permissions** run additional checks after auth:

```typescript
export const deleteAccount = pikkuFunc({
  func: async ({ database }, _data, { session }) => {
    await database.delete('users', { where: { id: session?.userId } })
  },
  auth: true,  // Session required
  permissions: {
    verified: requireEmailVerified,  // Additional check
    notBanned: requireNotBanned      // Additional check
  },
  title: 'Delete account',
  tags: ['users']
})
```

## Reusable Permissions

Define permissions once, reuse everywhere:

```typescript
// permissions.ts
export const requireAuth = pikkuPermission(async (_services, _data, { session }) => {
  return session?.userId != null
})

// Note what is NOT here: a `requireAdmin` comparing a role column. "Is an
// admin" is a fact about the caller, not about a row, so it belongs in
// `scopes`. Every permission below asks about the *data* instead.
export const requireTeamMember = pikkuPermission<{ teamId: string }>(
  async ({ database }, data, { session }) => {
    if (!session?.userId) return false
    const membership = await database.query('memberships', {
      where: { teamId: data.teamId, userId: session.userId }
    })
    return membership != null
  }
)

export const requireOwnership = pikkuPermission<{ resourceId: string }>(
  async ({ database }, data, { session }) => {
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
import { requireAuth, requireTeamMember, requireOwnership } from './permissions.js'

export const updateResource = pikkuFunc({
  func: async ({ database }, data) => { /* ... */ },
  permissions: {
    auth: requireAuth,
    owner: requireOwnership
  },
  title: 'Update resource',
  tags: ['resources']
})

export const deleteUser = pikkuFunc({
  func: async ({ database }, data) => { /* ... */ },
  // The capability is a scope; being on the owning team is a permission.
  // Both run: scopes AND together first, then permissions OR across keys.
  scopes: ['admin:users:remove'],
  permissions: {
    teamMember: requireTeamMember
  },
  title: 'Delete user',
  tags: ['users']
})
```

## Permission Factories

For permissions that need configuration parameters, use `pikkuPermissionFactory`:

```typescript
import { pikkuPermissionFactory, pikkuPermission } from '#pikku/auth'

export const requireRole = pikkuPermissionFactory<{ role: string }>(({ role }) => {
  return pikkuPermission(async (_services, _data, { session }) => {
    if (!session || session.role !== role) {
      return false
    }
    return true
  })
})
```

Use the factory to create configured permissions:

```typescript
export const deleteUser = pikkuFunc<{ userId: string }, void>({
  func: async ({ database }, data) => {
    await database.delete('users', { where: { id: data.userId } })
  },
  permissions: {
    admin: requireRole({ role: 'admin' })
  },
  title: 'Delete a user',
  tags: ['users']
})
```

Permission factories are useful when you have similar permission logic that varies by a parameter - roles, resource types, feature flags, etc.

## Best Practices

**Keep permissions focused** - One check per permission:

```typescript
// ✅ Good - single responsibility
export const requireAuth = pikkuPermission(...)
export const requireOwnership = pikkuPermission(...)
export const requireVerified = pikkuPermission(...)

permissions: {
  auth: requireAuth,
  ownership: requireOwnership,
  verified: requireVerified
}

// ❌ Bad - doing too much, and one of the checks is not a permission at all
export const requireEverything = pikkuPermission(async (services, data, { session }) => {
  if (!session?.userId) return false
  if (session.role !== 'admin') return false   // ← belongs in `scopes`
  if (!session.emailVerified) return false
  // Too many concerns
})
```

**Optimize expensive checks** - Cache when possible:

```typescript
// ✅ Good - caches subscription check
export const requireSubscription = pikkuPermission(
  async ({ cache, database }, _data, { session }) => {
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
- [HTTP Router](../wiring/http/router.md) - Global HTTP middleware for routes
- [Middleware](./middleware.md) - Request/response transformation
