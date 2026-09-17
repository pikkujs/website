---
sidebar_position: 5
title: HTTP Router
description: Global HTTP middleware for routes
---

# HTTP Router APIs

The HTTP router APIs let you register middleware that applies across multiple HTTP routes. Use these for cross-cutting concerns like authentication, logging, and request transformation.

For route-specific middleware, see [wireHTTP](./index.md) configuration options. Authorization lives on the function definition — see [Permission Guards](../../core-features/permission-guards.md).

## addHTTPMiddleware

Applies middleware globally or to routes matching a pattern.

```typescript
import { addHTTPMiddleware } from '#pikku/middleware'
import { corsMiddleware, responseTime } from './middleware.js'

// All HTTP routes
addHTTPMiddleware('*', [corsMiddleware, responseTime])

// Every route under /admin/
addHTTPMiddleware('/admin/*', [requireAuth, auditLog])
```

### Parameters

- **pattern** (`string`) - Route pattern, or `'*'` for global. `*` matches any run of characters and the pattern is anchored, so `/admin/*` covers `/admin/users` but `/admin` on its own matches only the exact route.
- **middleware** - Array of middleware to apply to matching routes

### Global HTTP Middleware

```typescript
import { addHTTPMiddleware } from '#pikku/middleware'
import { pikkuMiddleware } from '#pikku/middleware'

const cors = pikkuMiddleware(async (_services, { http }, next) => {
  if (http) {
    http.response.header('Access-Control-Allow-Origin', '*')
    http.response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  }
  await next()
})

const responseTime = pikkuMiddleware(async (_services, { http }, next) => {
  const start = Date.now()
  await next()
  if (http) {
    const duration = Date.now() - start
    http.response.header('X-Response-Time', `${duration}ms`)
  }
})

// Apply to all HTTP routes
addHTTPMiddleware('*', [cors, responseTime])
```

### Pattern-Based Middleware

```typescript
const adminAuth = pikkuMiddleware(async ({ jwt }, { http, setSession }, next) => {
  if (!http) return await next()

  const token = http.request.header('Authorization')
  if (!token) {
    http.response.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = await jwt.decode(token.replace('Bearer ', ''))
    setSession(payload)
    await next()
  } catch (e) {
    http.response.status(401).json({ error: 'Invalid token' })
  }
})

const hits = new Map<string, { count: number; resetAt: number }>()

const rateLimit = pikkuMiddleware(async (_services, { http }, next) => {
  if (!http) return await next()

  const ip = http.request.header('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 60_000 })
    return await next()
  }

  if (entry.count >= 100) {
    http.response.status(429).json({ error: 'Too many requests' })
    return
  }

  entry.count++
  await next()
})

// Admin routes need authentication
addHTTPMiddleware('/admin/*', [adminAuth])

// API routes are rate limited
addHTTPMiddleware('/api/*', [rateLimit])
```

:::note
The rate limiter above keeps its counters in a process-local `Map`, which is the right shape for per-instance limiting. A limit that has to hold across instances belongs in a store the instances share, such as Redis or a database.
:::

## Authorization

Permissions are declared on the function definition, not on the router. For an app-wide baseline that every function must additionally pass, use `addGlobalPermission`:

```typescript
import { addGlobalPermission } from '#pikku/auth'
import { requireAuth } from './permissions.js'

// Every function also requires a valid session
addGlobalPermission([requireAuth])
```

Global permissions form an independent AND gate and can only narrow access. See [Permission Guards](../../core-features/permission-guards.md) for the full model.

## Route Pattern Matching

Patterns are anchored globs — `*` matches any run of characters, and the pattern must match the whole route:

| Pattern | Matches | Examples |
|---------|---------|----------|
| `*` | All routes (global) | Any HTTP route |
| `/admin/*` | Routes under `/admin/` | `/admin/users`, `/admin/settings/profile` |
| `/admin` | That exact route only | `/admin` |
| `/api/v1/*` | Routes under `/api/v1/` | `/api/v1/users`, `/api/v1/posts` |

Note: `/admin` is **not** a prefix match. To cover a subtree use `/admin/*`.

## Middleware Execution Order

See [Middleware](../../core-features/middleware.md#execution-order) for the complete execution order across all scopes.

For HTTP routes, middleware runs in this order:
1. **Global HTTP middleware** - `addHTTPMiddleware('*', [...])`
2. **Pattern HTTP middleware** - `addHTTPMiddleware('/prefix/*', [...])`
3. **Tag middleware** - wirings carrying a tag registered with `addTagMiddleware(...)`
4. **Wire-specific middleware** - `wireHTTP({ middleware: [...] })`
5. **Function-level middleware** - `pikkuFunc({ middleware: [...] })`

The full list is then sorted by middleware priority (highest first), so a `priority: 'highest'` middleware can jump ahead of a narrower scope.

## Common Patterns

### Authentication Middleware

Extract JWT tokens and set user session:

```typescript
const jwtAuth = pikkuMiddleware(async ({ jwt }, { http, setSession }, next) => {
  if (!http) return await next()

  const token = http.request.header('Authorization')?.replace('Bearer ', '')

  if (token) {
    try {
      const payload = await jwt.decode(token)
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
addHTTPMiddleware('/api/*', [jwtAuth])
```

### Request Logging

Log all requests with timing:

```typescript
const requestLogger = pikkuMiddleware(async ({ logger }, { http }, next) => {
  if (!http) return await next()

  const start = Date.now()
  const method = http.request.method()
  const url = http.request.path()

  logger.info(`${method} ${url} - Started`)

  await next()

  const duration = Date.now() - start
  const status = http.response.statusCode || 200
  logger.info(`${method} ${url} - ${status} (${duration}ms)`)
})

// Log all HTTP requests
addHTTPMiddleware('*', [requestLogger])
```

### Security Headers

Add security headers to all responses:

```typescript
const securityHeaders = pikkuMiddleware(async (_services, { http }, next) => {
  await next()

  if (http) {
    http.response.header('X-Content-Type-Options', 'nosniff')
    http.response.header('X-Frame-Options', 'DENY')
    http.response.header('X-XSS-Protection', '1; mode=block')
    http.response.header('Strict-Transport-Security', 'max-age=31536000')
  }
})

// Apply to all routes
addHTTPMiddleware('*', [securityHeaders])
```

## Next Steps

- [Middleware](../../core-features/middleware.md) - Understanding middleware concepts
- [Permission Guards](../../core-features/permission-guards.md) - Understanding permissions
- [wireHTTP](./index.md) - Route-specific configuration
