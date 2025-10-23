---
sidebar_position: 60
title: Testing
description: Testing Pikku functions
---

# Testing

Testing Pikku functions is straightforward - they're just functions that take services, data, and session as parameters. Mock the services, call the function, assert the result.

## Basic Testing

```typescript
import { test } from 'node:test'
import * as assert from 'node:assert'
import { getBook } from './books.function.js'

test('should return book by ID', async () => {
  // Mock your services
  const mockServices = {
    database: {
      query: async () => ({ id: '123', title: 'Test Book' })
    }
  }

  // Call the function directly
  const result = await getBook.func(
    mockServices as any,
    { bookId: '123' },
    undefined // session
  )

  assert.equal(result.title, 'Test Book')
})
```

That's it. No special framework, no custom test utilities - just mock the services your function needs and call `.func()`.

## Testing with Sessions

```typescript
test('should use session userId', async () => {
  const mockServices = {
    database: {
      query: async (table: string, where: any) => {
        assert.equal(where.userId, 'user-123')
        return { id: '1', name: 'User Profile' }
      }
    }
  }

  const session = { userId: 'user-123' }

  await getProfile.func(mockServices as any, {}, session)
})
```

## Testing Errors

```typescript
test('should throw NotFoundError', async () => {
  const mockServices = {
    database: {
      query: async () => null
    }
  }

  await assert.rejects(
    getBook.func(mockServices as any, { bookId: 'invalid' }, undefined),
    NotFoundError
  )
})
```

## Reusable Mocks

Create mock factories if you're repeating yourself:

```typescript
// test-utils.ts
export const createMockServices = (overrides = {}) => ({
  database: {
    query: async () => null,
    insert: async (table, data) => ({ id: 'mock-id', ...data }),
    ...overrides.database
  },
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    ...overrides.logger
  },
  ...overrides
})
```

Use in tests:

```typescript
import { createMockServices } from './test-utils.js'

test('should create order', async () => {
  const services = createMockServices({
    database: {
      insert: async () => ({ id: '456', status: 'pending' })
    }
  })

  const result = await createOrder.func(services as any, { productId: 'abc' }, undefined)
  assert.equal(result.id, '456')
})
```

## Why This Works

Pikku functions are transport-agnostic and framework-independent. Your business logic doesn't depend on HTTP requests, WebSocket connections, or any runtime - it's just a function that receives services and data.

This means:
- **No test servers needed** - Just call functions directly
- **No framework mocking** - Mock your own services, not Pikku
- **Fast tests** - No I/O, no network, no overhead
- **Simple debugging** - Standard function calls with standard stack traces

Use any test framework you want (Node.js test runner, Jest, Vitest) - Pikku doesn't care.

## Next Steps

- [Functions](./functions.md) - Understanding Pikku functions
- [Services](./services.md) - Service architecture
