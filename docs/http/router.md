---
sidebar_position: 5
title: HTTP Router
description: Global HTTP middleware and permissions for routes
---

# HTTP Router APIs

The HTTP router APIs allow you to register global middleware and permissions that apply to HTTP routes based on path patterns. These are useful for cross-cutting concerns like authentication, logging, rate limiting, and access control.

## addHTTPMiddleware

Registers middleware that runs specifically for HTTP requests, either globally or for specific route patterns.

### Syntax

```typescript
import { addHTTPMiddleware, pikkuMiddleware } from '@pikku/core'

// Global middleware for all HTTP routes
addHTTPMiddleware([
  pikkuMiddleware(({ logger }, { http }, next) => {
    // Your middleware logic here
    await next()
  })
])

// Route-specific middleware
addHTTPMiddleware('/route/pattern', [
  pikkuMiddleware(({ logger }, { http }, next) => {
    // Your middleware logic here
    await next()
  })
])
```

### Parameters

- **middleware** - Array of middleware functions created with `pikkuMiddleware()`
- **route** (`string`) - Route pattern to apply middleware to (when used with second parameter)
- **middleware** - Array of middleware functions to apply to the specific route

### Examples

#### Global HTTP Middleware

```typescript
import { addHTTPMiddleware, pikkuMiddleware } from '@pikku/core'

const corsMiddleware = pikkuMiddleware((_services, { http }, next) => {
  http?.response.setHeader('Access-Control-Allow-Origin', '*')
  http?.response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  await next()
})

const responseTimeMiddleware = pikkuMiddleware((_services, { http }, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  http?.response.setHeader('X-Response-Time', `${end - start}ms`)
})

// Apply to all HTTP routes
addHTTPMiddleware([corsMiddleware, responseTimeMiddleware])
```

#### Route-Specific Middleware

```typescript
const adminAuthMiddleware = pikkuMiddleware((_services, { http }, next) => {
  const token = http?.request.getHeader('Authorization')
  if (!token || !isValidAdminToken(token)) {
    http?.response.setStatus(401).json({ error: 'Unauthorized' })
    return
  }
  await next()
})

const rateLimitMiddleware = pikkuMiddleware(async (_services, { http }, next) => {
  const ip = http?.request.getHeader('x-forwarded-for') || 'unknown'
  if (await isRateLimited(ip)) {
    http?.response.setStatus(429).json({ error: 'Too many requests' })
    return
  }
  await next()
})

// Apply middleware for admin routes only
addHTTPMiddleware('/admin/*', [adminAuthMiddleware])

// Add rate limiting to API routes
addHTTPMiddleware('/api/*', [rateLimitMiddleware])
```

## addHTTPPermission

:::info
This API doesn't exist yet but would follow the same pattern as `addHTTPMiddleware` for permissions.
:::

Would register permissions that apply to HTTP routes based on path patterns:

```typescript
// This would be the expected API
import { addHTTPPermission, pikkuPermission } from '@pikku/core'

const adminPermission = pikkuPermission((_services, _data, session) => {
  return session?.role === 'admin'
})

const ownerPermission = pikkuPermission<{ resourceId: string }>(async ({ kysely }, { resourceId }, session) => {
  if (!session?.userId) return false
  
  const resource = await kysely
    .selectFrom('resource')
    .select('ownerId')
    .where('resourceId', '=', resourceId)
    .executeTakeFirst()
  
  return resource?.ownerId === session.userId
})

// Apply admin permission to admin routes
addHTTPPermission('/admin/*', [adminPermission])

// Apply owner permission to resource routes
addHTTPPermission('/api/resources/*', [ownerPermission])
```

## Route Pattern Matching

Route patterns use [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax:

| Pattern | Matches | Examples |
|---------|---------|----------|
| `/admin/*` | All routes starting with `/admin/` | `/admin/users`, `/admin/settings` |
| `/api/users/:id` | User routes with ID parameter | `/api/users/123`, `/api/users/abc` |
| `/:category/:id` | Any two-segment path | `/books/123`, `/users/456` |
| `*` | All routes (global) | Any HTTP route |

## Middleware Execution Order

HTTP middleware runs in this specific order:

1. **Global HTTP middleware** (added with `addHTTPMiddleware([middleware])`)
2. **Route-specific HTTP middleware** (added with `addHTTPMiddleware(route, [middleware])`) 
3. **Tag-based middleware** (added with `addMiddleware(tag, [middleware])`)
4. **Route-level middleware** (defined in `wireHTTP`)
5. **Function-level middleware** (defined in function config)

## Common Use Cases

### Authentication Middleware

```typescript
import { pikkuMiddleware } from '@pikku/core'

const jwtAuthMiddleware = pikkuMiddleware(async ({ jwtService, userSessionService }, { http }, next) => {
  const token = http?.request.getHeader('Authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const payload = await jwtService.verify(token)
      await userSessionService.set(payload)
    } catch (error) {
      // Invalid token - let function-level auth handle this
    }
  }
  
  await next()
})

// Apply to all protected routes
addHTTPMiddleware('/api/protected/*', [jwtAuthMiddleware])
```

### Request Logging

```typescript
const requestLogger = pikkuMiddleware(({ logger }, { http }, next) => {
  const start = Date.now()
  const method = http?.request.method
  const url = http?.request.url
  
  logger.info(`${method} ${url} - Started`)
  
  await next()
  
  const duration = Date.now() - start
  const status = http?.response.status || 200
  logger.info(`${method} ${url} - ${status} (${duration}ms)`)
})

// Log all HTTP requests
addHTTPMiddleware([requestLogger])
```

### Content Type Validation

```typescript
const jsonOnlyMiddleware = pikkuMiddleware((_services, { http }, next) => {
  const contentType = http?.request.getHeader('Content-Type')
  
  if (http?.request.method === 'POST' && !contentType?.includes('application/json')) {
    http?.response.setStatus(415).json({ 
      error: 'Content-Type must be application/json' 
    })
    return
  }
  
  await next()
})

// Apply to API endpoints that expect JSON
addHTTPMiddleware('/api/*', [jsonOnlyMiddleware])
```

### Security Headers

```typescript
const securityHeadersMiddleware = pikkuMiddleware((_services, { http }, next) => {
  http?.response.setHeader('X-Content-Type-Options', 'nosniff')
  http?.response.setHeader('X-Frame-Options', 'DENY')
  http?.response.setHeader('X-XSS-Protection', '1; mode=block')
  await next()
})

// Apply security headers to all routes
addHTTPMiddleware([securityHeadersMiddleware])
```

<!-- ## Related

- [addMiddleware](../api/add-middleware.md) - Add tag-based middleware for any wiring type
- [addPermission](../api/add-permission.md) - Add tag-based permissions for any wiring type  
- [wireHTTP](./index.md) - Configure individual HTTP routes with middleware and permissions
- [Middleware Guide](../core/middleware.md) - Understanding middleware concepts
- [Permission Guards](../core/permission-guards.md) - Understanding permission concepts -->