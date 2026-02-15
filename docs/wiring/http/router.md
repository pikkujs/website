---
sidebar_position: 5
title: HTTP Router
description: Global HTTP middleware and permissions for routes
---

# HTTP Router APIs

The HTTP router APIs let you register middleware and permissions that apply across multiple HTTP routes. Use these for cross-cutting concerns like authentication, logging, and access control.

For route-specific middleware and permissions, see [wireHTTP](./index.md) configuration options.

## addHTTPMiddleware

Applies middleware globally or to routes matching a prefix.

```typescript
import { addHTTPMiddleware } from '#pikku/http'
import { corsMiddleware, responseTime } from './middleware.js'

// All HTTP routes
addHTTPMiddleware([corsMiddleware, responseTime])

// Routes starting with /admin
addHTTPMiddleware('/admin', [requireAuth, auditLog])
```

### Parameters

- **middleware** - Array of middleware functions when used globally
- **route** (`string`) - Route prefix pattern (first parameter)
- **middleware** - Array of middleware for the prefix (second parameter)

### Global HTTP Middleware

```typescript
import { addHTTPMiddleware } from '#pikku/http'
import { pikkuMiddleware } from '#pikku'

const cors = pikkuMiddleware(async (_services, { http }, next) => {
  if (http) {
    http.response.setHeader('Access-Control-Allow-Origin', '*')
    http.response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  }
  await next()
})

const responseTime = pikkuMiddleware(async (_services, { http }, next) => {
  const start = Date.now()
  await next()
  if (http) {
    const duration = Date.now() - start
    http.response.setHeader('X-Response-Time', `${duration}ms`)
  }
})

// Apply to all HTTP routes
addHTTPMiddleware([cors, responseTime])
```

### Prefix-Based Middleware

```typescript
const adminAuth = pikkuMiddleware(async ({ jwt }, { http, setSession }, next) => {
  if (!http) return await next()

  const token = http.request.getHeader('Authorization')
  if (!token) {
    http.response.setStatus(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = await jwt.verify(token.replace('Bearer ', ''))
    setSession(payload)
    await next()
  } catch (e) {
    http.response.setStatus(401).json({ error: 'Invalid token' })
  }
})

const rateLimit = pikkuMiddleware(async ({ cache }, { http }, next) => {
  if (!http) return await next()

  const ip = http.request.getHeader('x-forwarded-for') || 'unknown'
  const key = `ratelimit:${ip}`
  const count = (await cache.get(key)) || 0

  if (count > 100) {
    http.response.setStatus(429).json({ error: 'Too many requests' })
    return
  }

  await cache.set(key, count + 1, { ttl: 60 })
  await next()
})

// Admin routes need authentication
addHTTPMiddleware('/admin', [adminAuth])

// API routes are rate limited
addHTTPMiddleware('/api', [rateLimit])
```

## addHTTPPermission

Applies permissions globally or to routes matching a prefix.

```typescript
import { addHTTPPermission } from '#pikku/http'
import { requireAuth, requireAdmin } from './permissions.js'

// Routes starting with /admin require auth + admin
addHTTPPermission('/admin', {
  auth: requireAuth,
  admin: requireAdmin,
})

// All HTTP routes require authentication
addHTTPPermission('*', {
  auth: requireAuth,
})
```

### Parameters

- **route** (`string`) - Route prefix pattern, or `'*'` for global
- **permissions** (`Record<string, PikkuPermission>`) - Named permissions to apply

### Example with Multiple Permissions

```typescript
import { pikkuPermission } from '#pikku'

const requireAuth = pikkuPermission(async (_services, _data, { session }) => {
  return session?.userId != null
})

const requireAdmin = pikkuPermission(async (_services, _data, { session }) => {
  return session?.role === 'admin'
})

const requirePremium = pikkuPermission(async ({ database }, _data, { session }) => {
  if (!session?.userId) return false

  const dbUser = await database.query('users', {
    where: { id: session.userId }
  })

  return dbUser?.isPremium === true
})

// Admin routes need both auth and admin role
addHTTPPermission('/admin', {
  auth: requireAuth,
  admin: requireAdmin,
})

// Premium features need auth and premium subscription
addHTTPPermission('/api/premium', {
  auth: requireAuth,
  premium: requirePremium,
})
```

## Route Pattern Matching

Prefix patterns match routes that start with the given path:

| Pattern | Matches | Examples |
|---------|---------|----------|
| `/admin` | All routes starting with `/admin` | `/admin/users`, `/admin/settings` |
| `/api/v1` | All routes starting with `/api/v1` | `/api/v1/users`, `/api/v1/posts` |
| `*` | All routes (global) | Any HTTP route |

Note: These are prefix matches, not glob patterns. `/admin` matches `/admin/users` and `/admin/settings/profile`.

## Middleware Execution Order

See [Middleware](../../core-features/middleware.md#execution-order) for the complete execution order across all scopes.

For HTTP routes, middleware runs in this order:
1. **Global HTTP middleware** - `addHTTPMiddleware([...])`
2. **Prefix HTTP middleware** - `addHTTPMiddleware('/prefix', [...])`
3. **Wire-specific middleware** - `wireHTTP({ middleware: [...] })`
4. **Function-level middleware** - `pikkuFunc({ middleware: [...] })`

## Common Patterns

### Authentication Middleware

Extract JWT tokens and set user session:

```typescript
const jwtAuth = pikkuMiddleware(async ({ jwt }, { http, setSession }, next) => {
  if (!http) return await next()

  const token = http.request.getHeader('Authorization')?.replace('Bearer ', '')

  if (token) {
    try {
      const payload = await jwt.verify(token)
      setSession({
        userId: payload.userId,
        role: payload.role
      })
    } catch (error) {
      // Invalid token - continue without session
      // Let function-level auth/permissions handle it
    }
  }

  await next()
})

// Apply to all protected routes
addHTTPMiddleware('/api', [jwtAuth])
```

### Request Logging

Log all requests with timing:

```typescript
const requestLogger = pikkuMiddleware(async ({ logger }, { http }, next) => {
  if (!http) return await next()

  const start = Date.now()
  const method = http.request.method
  const url = http.request.url

  logger.info(`${method} ${url} - Started`)

  await next()

  const duration = Date.now() - start
  const status = http.response.status || 200
  logger.info(`${method} ${url} - ${status} (${duration}ms)`)
})

// Log all HTTP requests
addHTTPMiddleware([requestLogger])
```

### Security Headers

Add security headers to all responses:

```typescript
const securityHeaders = pikkuMiddleware(async (_services, { http }, next) => {
  await next()

  if (http) {
    http.response.setHeader('X-Content-Type-Options', 'nosniff')
    http.response.setHeader('X-Frame-Options', 'DENY')
    http.response.setHeader('X-XSS-Protection', '1; mode=block')
    http.response.setHeader('Strict-Transport-Security', 'max-age=31536000')
  }
})

// Apply to all routes
addHTTPMiddleware([securityHeaders])
```

## Next Steps

- [Middleware](../../core-features/middleware.md) - Understanding middleware concepts
- [Permission Guards](../../core-features/permission-guards.md) - Understanding permissions
- [wireHTTP](./index.md) - Route-specific configuration
