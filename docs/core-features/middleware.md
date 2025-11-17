---
sidebar_position: 10
title: Middleware
description: How middleware works
---

# Middleware

Middleware in Pikku follows an **onion model** - each middleware wraps around the next, running before and after your function executes. This is the same pattern used by Koa and Hono.

Think of it like layers wrapping a core: the request passes through each outer layer to reach the function at the center, then unwinds back out through the same layers to send the response.

```mermaid
graph LR
    A(Request) -->|Enter| M1["Middleware One"]
    subgraph Layer 1
        M1 -->|Pass| M2["Middleware Two"]
        subgraph Layer 2
            M2 -->|Pass| M3["Middleware Three"]
            subgraph Layer 3
                M3 -->|Call| F["Function"]
                F -->|Return| M3
            end
            M3 -->|Return| M2
        end
        M2 -->|Return| M1
    end
    M1 -->|Response| B(Response)
```

## Your First Middleware

Let's write middleware that tracks response time:

```typescript
import { pikkuMiddleware } from '#pikku'

export const responseTime = pikkuMiddleware(async ({ logger }, wire, next) => {
  const start = Date.now()

  // Call next middleware/function
  await next()

  // After function completes
  const duration = Date.now() - start
  logger.info(`Request completed in ${duration}ms`)

  // For HTTP, you can set headers
  if (wire.http) {
    wire.http.response.setHeader('X-Response-Time', `${duration}ms`)
  }
})
```

The middleware:
- Destructures `logger` from services (tree-shaking benefit)
- Has access to the `wire` object (http, channel, queue, etc.)
- Calls `next()` to continue the chain
- Can run code before and after the function

## Middleware Signature

```typescript
pikkuMiddleware(async (services, wire, next) => {
  // Your middleware logic
})
```

**Parameters:**
- **services** - Your singleton services only (destructure what you need). Wire services are not available in middleware.
- **wire** - The wire object containing transport-specific details (http, channel, queue, etc.)
- **next** - Function to call the next middleware or the main function

:::info Singleton Services Only
Middleware receives **only singleton services** in the first parameter, not wire services. This is because middleware wraps around the wire lifecycle. If you need access to wire-scoped resources, use the `wire` parameter to access them.
:::

## Authentication Middleware

A common use case is extracting authentication info:

```typescript
export const authMiddleware = pikkuMiddleware(async ({ jwt, userSession }, wire, next) => {
  let token = null

  // Extract token based on transport
  if (wire.http) {
    token = wire.http.request.getHeader('Authorization')?.replace('Bearer ', '')
  } else if (wire.channel) {
    // For channels, auth is typically handled during connection
    token = wire.channel.channelData?.token
  }

  if (token) {
    try {
      const payload = await jwt.verify(token)
      await userSession.set({
        userId: payload.userId,
        role: payload.role
      })
    } catch (e) {
      // Invalid token - continue without session
    }
  }

  await next()
})
```

## Middleware Scopes

Pikku lets you apply middleware at different scopes. Understanding these scopes helps you find the right balance - too broad and you pay a performance cost, too narrow and you end up repeating yourself.

### Function-Level Middleware

Applied directly in your function definition:

```typescript
export const createOrder = pikkuFunc<OrderInput, Order>({
  func: async ({ database }, data) => {
    return await database.insert('orders', data)
  },
  middleware: [validateOrder, checkInventory],
  docs: {
    summary: 'Create a new order',
    tags: ['orders']
  }
})
```

Use function-level middleware for:
- Function-specific validation
- Business logic guards
- Operations that only make sense for this specific function

### Wire-Specific Middleware

Applied when wiring a function to a transport:

```typescript
wireHTTP({
  method: 'post',
  route: '/orders',
  func: createOrder,
  middleware: [rateLimit, auditLog]
})
```

Use wire-specific middleware for:
- Transport-specific concerns (rate limiting for HTTP)
- Route-specific logging or auditing
- Overriding behavior for a specific endpoint

### HTTP Transport Middleware

For HTTP routes specifically, you can apply middleware globally or per-prefix:

```typescript
import { addHTTPMiddleware } from '#pikku/http'

// All HTTP routes will run this middleware
addHTTPMiddleware([corsHeaders, securityHeaders])

// All routes starting with /admin will run this middleware
addHTTPMiddleware('/admin', [requireAuth, requireAdmin])

// All routes starting with /api/v1 will run this middleware
addHTTPMiddleware('/api/v1', [apiKeyValidation])
```

Use HTTP transport middleware for:
- CORS headers for all HTTP routes
- Security headers for all HTTP responses
- Admin section protection
- API versioning concerns
- Different auth strategies per route prefix

### Scheduler Transport Middleware

For scheduled tasks, you can apply middleware globally:

```typescript
import { addSchedulerMiddleware } from '#pikku/scheduler'

// All scheduled tasks will run this middleware
addSchedulerMiddleware([withSchedulerMetrics, withRetry])
```

Use scheduler transport middleware for:
- Performance monitoring across all scheduled tasks
- Retry logic for failed tasks
- Alerting on task failures

## Execution Order

Middleware executes from the broadest scope inward to the most specific. Think of it like layers of an onion - the outer layers run first:

1. **Transport-specific middleware** - All HTTP (`addHTTPMiddleware([...])`) or all Schedulers (`addSchedulerMiddleware([...])`)
2. **Prefix-based middleware** - HTTP routes matching prefix (`addHTTPMiddleware('/prefix', [...])`)
3. **Wire-specific middleware** - Defined in `wireHTTP`/`wireChannel`/etc.
4. **Function-level middleware** - Defined in function config

After the function completes, they run in reverse order (onion model).

Example showing all scopes:

```typescript
// Transport-specific - all HTTP routes
addHTTPMiddleware([corsHeaders])

// Prefix-based - matches /api/v1
addHTTPMiddleware('/api/v1', [apiKeyValidation])

// Function definition
export const updateSettings = pikkuFunc<SettingsInput, Settings>({
  func: async ({ database }, data) => {
    return await database.update('settings', data)
  },
  middleware: [validateSettings],  // Function-level
  docs: {
    summary: 'Update system settings',
    tags: ['settings']
  }
})

// Wiring
wireHTTP({
  method: 'patch',
  route: '/api/v1/settings',
  func: updateSettings,
  middleware: [auditLog]  // Wire-specific
})
```

For this request, middleware runs in this order:
1. `corsHeaders` (transport-specific - all HTTP)
2. `apiKeyValidation` (prefix-based - matches '/api/v1')
3. `auditLog` (wire-specific)
4. `validateSettings` (function-level)
5. **Your function runs**
6. `validateSettings` (after)
7. `auditLog` (after)
8. `apiKeyValidation` (after)
9. `corsHeaders` (after)

## Wire Object

Middleware receives a `wire` object that varies by transport:

```typescript
export const transportAware = pikkuMiddleware(async (services, wire, next) => {
  if (wire.http) {
    // HTTP-specific: request, response
    const userAgent = wire.http.request.getHeader('User-Agent')
    wire.http.response.setHeader('X-Custom', 'value')
  }

  if (wire.channel) {
    // Channel-specific: connectionId, channelData, userId
    const connectionId = wire.channel.connectionId
    const customData = wire.channel.channelData
  }

  if (wire.queue) {
    // Queue-specific: queue name, payload, attempt
    const attempt = wire.queue.attempt
  }

  if (wire.scheduledTask) {
    // Scheduler-specific: cron, lastRun, nextRun
    const cron = wire.scheduledTask.cron
  }

  await next()
})
```

## Error Handling

Middleware can catch and transform errors:

```typescript
export const errorHandler = pikkuMiddleware(async ({ logger }, wire, next) => {
  try {
    await next()
  } catch (error) {
    logger.error('Request failed', {
      error: error.message,
      stack: error.stack
    })

    // For HTTP, you can set custom error responses
    if (wire.http) {
      wire.http.response.setStatus(500)
      wire.http.response.setHeader('X-Error-Id', generateErrorId())
    }

    // Re-throw to let Pikku handle it
    throw error
  }
})
```

## Conditional Middleware

Sometimes you only want middleware to run in certain conditions:

```typescript
export const conditionalCache = pikkuMiddleware(async ({ cache }, wire, next) => {
  // Only cache GET requests
  if (wire.http?.request.method !== 'GET') {
    return await next()
  }

  const cacheKey = wire.http.request.path
  const cached = await cache.get(cacheKey)

  if (cached) {
    // Short-circuit - don't call next()
    wire.http.response.body = cached
    return
  }

  await next()

  // Cache the response after function completes
  await cache.set(cacheKey, wire.http.response.body)
})
```

## Automatic Schema Validation

Pikku automatically generates and validates schemas based on your TypeScript types. No middleware needed for input validation - it happens before your function runs.

If validation fails, Pikku throws a `ValidationError` with details about which fields failed.

## Best Practices

**Destructure services** - Helps Pikku tree-shake unused services:
```typescript
// ✅ Good - only bundles logger
pikkuMiddleware(({ logger }, wire, next) => { ... })

// ❌ Bad - bundles all services
pikkuMiddleware((services, wire, next) => { ... })
```

:::tip Transport-Agnostic vs Transport-Specific Middleware
**Prefer function-level middleware for transport-agnostic logic** - Logging, metrics, validation, etc. should work regardless of whether your function is called via HTTP, WebSocket, or queue.

**Use transport-specific middleware (like `addHTTPMiddleware`) for HTTP-only concerns** - Things like cookie parsing, CORS headers, or security headers that only make sense for HTTP. These middleware should throw `InvalidMiddlewareInteractionError` if used on non-HTTP transports to fail fast:

```typescript
import { InvalidMiddlewareInteractionError } from '@pikku/core/errors'

export const cookieParser = pikkuMiddleware(async (services, wire, next) => {
  if (!wire.http) {
    throw new InvalidMiddlewareInteractionError()
  }
  // Parse cookies from HTTP request
  await next()
})

// Apply only to HTTP routes
addHTTPMiddleware([cookieParser, corsHeaders])
```

This ensures your middleware fails fast if accidentally used on the wrong transport, rather than silently doing nothing or causing subtle bugs.
:::

**Keep middleware focused** - Each middleware should do one thing well:
```typescript
// ✅ Good - separate concerns
[authMiddleware, loggingMiddleware, metricsMiddleware]

// ❌ Bad - doing too much
[authLoggingMetricsMiddleware]
```

## Next Steps

- [Permissions](./permission-guards.md) - Authorization and permissions
- [Functions](./functions.md) - Understanding Pikku functions
- [HTTP Wiring](../wiring/http/index.md) - Wire functions to HTTP routes
