---
sidebar_position: 1
title: Internal RPCs
description: Function-to-function calls
---

# Internal RPCs

Internal RPCs let you call one function from another using `rpc.invoke()`. This is how you orchestrate workflows, reuse business logic, and transform outputs for specific transports.

## Your First Internal RPC

Let's call a function from another function:

```typescript @snippet rpcInternalCall
```

Here `sweepLowStock` finds the items that are running low and hands each one to `onLowStock` by name, so `onLowStock` is reusable:
- Called via internal RPC from `sweepLowStock`
- Can be wired to HTTP, a trigger or a CLI command
- Can be used in queue jobs

The function doesn't change - it works everywhere.

## Transforming Output for Transports

RPC is perfect for calling a function and transforming its output before returning to the client. For example, an MCP resource can call a domain function through `rpc.invoke` and reshape the result into the `{ uri, text }` entries MCP expects. The domain function stays untouched, and the MCP wiring (`wireMCPResource`, which carries the `title`, `description` and `tags`) owns the transport-specific shape. See the [MCP guide](/docs/wiring/mcp) for a worked resource.

This pattern keeps business logic in one place while adapting output for different transports (HTTP, MCP, CLI, etc.).

## Recursion with Depth Tracking

RPC tracks how deep a chain of calls has gone. `rpc.depth` is the current call depth, so a function that calls itself (walking a category tree, say) can read it, log it, and stop when it gets too deep.

Access current depth via `rpc.depth` to:
- Prevent infinite recursion
- Limit processing depth
- Track call chains for debugging

## Session and Auth Inheritance

Internal RPCs inherit the caller's session and still enforce auth/permissions. A function with `auth: true` or `permissions` keeps them when it's called through RPC. The caller's session is passed along, and the callee checks its own `auth` requirement and permissions against it. If the session doesn't satisfy them, the call throws, exactly as if the callee had been invoked from outside.

RPC calls:
- Inherit the caller's session
- Still enforce the called function's `auth` requirement
- Still check the called function's permissions
- Maintain security boundaries

## Error Handling

RPC calls throw errors just like direct function calls:

```typescript @snippet wb-rpc-error-handling
```

## When NOT to Use Internal RPC

**Don't use RPC for simple service calls.** Don't wrap a simple service call in a second function just to call it through RPC: a `getCard` that does nothing but `rpc.invoke('loadCard', ...)` adds a hop and nothing else.

Instead, have `getCard` call the service directly (a query through `kysely`, for instance) and keep RPC for the cases below.

Use RPC when:
- Orchestrating multiple operations
- Transforming output for specific transports
- The operation involves reusable business logic
- Auth/permissions need to be enforced
- You need recursion with depth tracking

## Type Safety

Internal RPC calls are type-checked against your functions. The function name must be one that exists, the input must match that function's input type, and the result has the function's output type. A misspelled name, a wrong input field, or reading a property the output doesn't have is a compile error, not a runtime surprise.

## Next Steps

- [Exposed RPCs](/docs/wiring/rpcs/external) - Exposing functions to clients
- [Functions](/docs/core-features/functions) - Understanding Pikku functions
- [Middleware](/docs/core-features/middleware) - Applying middleware
