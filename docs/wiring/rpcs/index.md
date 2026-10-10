---
sidebar_position: 0
title: RPC (Remote Procedure Calls)
description: Internal, external, and remote function invocation
---

# RPC (Remote Procedure Calls)

RPC lets you invoke Pikku functions — internally from other functions, externally from clients, or remotely across instances. This is how you orchestrate workflows, expose APIs, and compose smaller functions into larger operations.

## Three Types of RPCs

### Internal RPCs

Internal RPCs are function-to-function calls within your application. Use `rpc.invoke()` to call one function from another:

```typescript @snippet rpcInternalCall
```

**Use internal RPCs for:**
- Transforming function output before returning to clients
- Reusing business logic across different transports
- Recursion with depth tracking

See [Internal RPCs](./internal.md) for details.

### Exposed RPCs

Exposed RPCs expose your functions to external clients via HTTP POST endpoints. A function is exposed by setting `expose: true` — non-exposed functions cannot be called from outside:

```typescript @snippet rpcFunc
```

**Clients call it:**

```bash
POST /rpc/checkItemAvailability
Content-Type: application/json

{
  "data": { "itemId": "item-001" }
}
```

**Use external RPCs for:**
- Exposing functions to external systems
- Building API clients
- Type-safe API calls

See [Exposed RPCs](./external.md) for details.

### Remote RPCs

Remote RPCs let you invoke functions hosted on other instances — across microservices, scaled deployments, or separate processes. Pikku's deployment service handles function discovery and routing automatically:

```typescript @snippet wb-rpc-remote-call
```

**Use remote RPCs for:**
- Cross-instance function invocation
- Microservice communication
- Distributed workloads across scaled deployments

See [Remote](./deployment.md) for details.

## When to Use Each Type

**Internal RPC (`rpc.invoke()`)**:
- Calling one function from another within the same instance
- Orchestrating multi-step workflows
- Adapting function output for specific transports (HTTP, MCP, CLI)
- Recursion with depth tracking

**External RPC (HTTP endpoints)**:
- Exposing functions to external clients
- Building integrations between systems
- Type-safe API consumption

**Remote RPC (`rpc.remote()`)**:
- Calling functions on other instances
- Microservice-to-microservice communication
- Distributed deployments where functions live on different servers

## Key Benefits

**Type Safety**: Full TypeScript support for inputs and outputs

**Session Inheritance**: Internal RPCs inherit the caller's session and enforce auth/permissions

**Recursion Protection**: Built-in depth tracking prevents infinite loops

**Transport Agnostic**: Functions work the same whether called via RPC, HTTP, WebSocket, queues, or CLI

**Remote Discovery**: Deployment service automatically routes remote calls to the correct instance

## Next Steps

- [Internal RPCs](./internal.md) - Function-to-function calls
- [Exposed RPCs](./external.md) - Exposing functions to clients
- [Remote](./deployment.md) - Cross-instance invocation
- [React Query Hooks](./react-query.md) - Auto-generated typed hooks for your frontend
