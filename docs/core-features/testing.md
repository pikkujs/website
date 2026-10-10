---
sidebar_position: 60
title: Testing
description: Testing Pikku functions
---

# Testing

Testing Pikku functions is straightforward - they're just functions that take services, data, and a wire object as parameters. Mock the services, call the function, assert the result.

## Basic Testing

```typescript @snippet co-test-direct-call
```

That's it. No special framework, no custom test utilities - just mock the services your function needs and call `.func()`.

## Testing with Sessions

```typescript @snippet co-test-session
```

## Testing Errors

```typescript @snippet co-test-error
```

## Reusable Mocks

Create mock factories if you're repeating yourself:

```typescript @snippet co-test-mock-helper
```

The helper lets each test override only the service it cares about, as the second half of the snippet shows.

## End-to-End Testing

Unit tests never leave the process - they mock the services a function destructures, so auth, middleware, serialization, and permissions are not exercised. When you need that, write a [Scenario](./scenarios.md) instead: a `pikkuScenario` drives your app as signed-in actors over the real transport, so the same definition works as an e2e test locally, a smoke test against staging, and a health check against production. Live coverage is attributed to scenario runs (`pikku dev --coverage` plus `pikku scenario run <env> --coverage`), not to unit tests.

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
