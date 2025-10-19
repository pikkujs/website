# Inline Middleware Support

## Error Message

```
Inline middleware cannot be used with addHTTPMiddleware/addSchedulerMiddleware.
```

## What This Means

You're trying to use inline (anonymous) middleware with `addHTTPMiddleware()` or `addSchedulerMiddleware()`, but these functions require named, exported middleware for tree-shaking optimization.

## Why This Restriction Exists

Pikku generates middleware imports at compile-time to enable optimal tree-shaking. Only middleware functions that are exported from files can be imported in the generated code. Inline middleware functions don't have exports and can't be imported.

## ❌ Incorrect Usage

```typescript
// This will cause an error
addHTTPMiddleware('/api/*', [
  pikkuMiddleware(async ({ logger }, interaction, next) => {
    // Inline middleware - no export!
    logger.info('Request received')
    await next()
  })
])
```

```typescript
// This will also cause an error
addSchedulerMiddleware([
  pikkuMiddleware(async ({ logger }, interaction, next) => {
    logger.info('Task started')
    await next()
  })
])
```

## ✅ Correct Usage

**Option 1: Export the middleware function**

```typescript
// middleware/logging.ts
export const loggingMiddleware = pikkuMiddleware(
  async ({ logger }, interaction, next) => {
    logger.info('Request received')
    await next()
  }
)

// http.wiring.ts
import { loggingMiddleware } from './middleware/logging.js'

addHTTPMiddleware([loggingMiddleware])
```

**Option 2: Use inline middleware directly in wirings**

Inline middleware IS supported when used directly in `wireHTTP`, `wireChannel`, etc.:

```typescript
wireHTTP({
  route: '/users',
  method: 'GET',
  func: getUsers,
  middleware: [
    // Inline middleware is OK here!
    pikkuMiddleware(async ({ logger }, interaction, next) => {
      logger.info('Fetching users')
      await next()
    })
  ]
})
```

## When Can I Use Inline Middleware?

Inline middleware can be used:
- ✅ Directly in `wireHTTP({ middleware: [...] })`
- ✅ Directly in `wireChannel({ middleware: [...] })`
- ✅ Directly in `wireQueueWorker({ middleware: [...] })`
- ✅ Directly in `wireScheduler({ middleware: [...] })`
- ✅ Directly in `pikkuFunc({ middleware: [...] })`

Inline middleware cannot be used:
- ❌ In `addHTTPMiddleware([...])`
- ❌ In `addHTTPMiddleware('/pattern', [...])`
- ❌ In `addSchedulerMiddleware([...])`

## Best Practice

For reusable middleware, always export it from a dedicated file:

```typescript
// middleware/index.ts
export const authMiddleware = pikkuMiddleware(...)
export const loggingMiddleware = pikkuMiddleware(...)
export const rateLimitMiddleware = pikkuMiddleware(...)
```

This enables:
- Tree-shaking optimization
- Code reusability
- Better organization
- Type safety
