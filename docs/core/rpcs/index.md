---
sidebar_position: 60
title: RPC (Remote Procedure Calls)
description: Internal and external function invocation
---

# RPC (Remote Procedure Calls)

RPC lets you invoke Pikku functions - either from other functions (internal) or from external clients (external). This is how you orchestrate workflows, expose APIs, and compose smaller functions into larger operations.

## Two Types of RPCs

### Internal RPCs

Internal RPCs are function-to-function calls within your application. Use `rpc.invoke()` to call one function from another:

```typescript
export const processOrder = pikkuFunc<OrderInput, OrderResult>({
  func: async ({ rpc }, data) => {
    // Internal RPC - calls another function
    const totals = await rpc.invoke('calculateOrderTotal', {
      items: data.items
    })

    return { orderId: '123', total: totals.total }
  }
})
```

**Use internal RPCs for:**
- Orchestrating complex workflows
- Transforming function output before returning to clients
- Reusing business logic across different transports
- Recursion with depth tracking

See [Internal RPCs](./internal.md) for details.

### External RPCs

External RPCs expose your functions to external clients via HTTP POST endpoints. Clients can invoke any function directly:

```typescript
// Function is automatically available as external RPC
export const calculateOrderTotal = pikkuFuncSessionless<
  { items: Array<{ price: number }> },
  { total: number }
>({
  func: async ({ database }, data) => {
    // Business logic
    return { total: 100 }
  }
})
```

**Clients call it:**

```bash
POST /rpc/calculateOrderTotal
Content-Type: application/json

{
  "items": [{ "price": 10 }, { "price": 20 }]
}
```

**Use external RPCs for:**
- Exposing functions to external systems
- Building API clients
- Microservice communication (on roadmap: remote server invocation)
- Type-safe API calls

See [External RPCs](./external.md) for details.

## When to Use Each Type

**Internal RPC (`rpc.invoke()`)**:
- Calling one function from another
- Orchestrating multi-step workflows
- Adapting function output for specific transports (HTTP, MCP, CLI)
- Recursion with depth tracking

**External RPC (HTTP endpoints)**:
- Exposing functions to external clients
- Building integrations between systems
- Type-safe API consumption
- Future: microservice-to-microservice calls

## Key Benefits

**Type Safety**: Full TypeScript support for inputs and outputs

**Session Inheritance**: Internal RPCs inherit the caller's session and enforce auth/permissions

**Recursion Protection**: Built-in depth tracking prevents infinite loops

**Transport Agnostic**: Functions work the same whether called via RPC, HTTP, WebSocket, queues, or CLI

**Future: Remote Calls**: On roadmap - invoke functions on remote servers (microservices)

## Next Steps

- [Internal RPCs](./internal.md) - Function-to-function calls
- [External RPCs](./external.md) - Exposing functions to clients
