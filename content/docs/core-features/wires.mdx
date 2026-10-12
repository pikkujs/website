---
sidebar_position: 11
title: Wires
description: Transport-specific context passed to functions and middleware
---

# Wires

Every Pikku function receives three arguments: **services**, **data**, and **wire**. The wire is the transport-specific context — it tells your function _how_ it was called and gives access to transport-specific capabilities.

The wire is the third argument of every function: `func: async (services, data, wire) => { ... }`. It holds the transport-specific properties.

The same function can be called via HTTP, WebSocket, RPC, CLI, or any other transport. The wire is what changes between them.

## What's in a Wire

The wire object (`PikkuWire`) contains these properties, all optional depending on which transport invoked the function:

| Property | Type | Available When |
|----------|------|---------------|
| `session` | `UserSession \| undefined` | A session was loaded (auth is enabled) |
| `setSession` | `(session) => Promise<void> \| void` | Session management is available |
| `clearSession` | `() => Promise<void> \| void` | Session management is available |
| `getSession` | `() => Promise<UserSession> \| UserSession \| undefined` | Session management is available |
| `hasSessionChanged` | `() => boolean` | Session management is available |
| `pikkuUserId` | `string \| undefined` | A user id could be resolved for the call |
| `http` | `PikkuHTTP` | Called via HTTP |
| `channel` | `PikkuChannel` | Called via WebSocket or SSE |
| `rpc` | `PikkuRPC` | Always (for calling other functions) |
| `queue` | `PikkuQueue` | Called as a queue job |
| `scheduledTask` | `PikkuScheduledTask` | Called as a scheduled task |
| `cli` | `PikkuCLI` | Called via CLI |
| `mcp` | `PikkuMCP` | Called via MCP |
| `trigger` | `PikkuTrigger` | Called as a trigger source |
| `workflow` | `PikkuWorkflowWire` | Called within a workflow |
| `workflowStep` | `WorkflowStepWire` | Called as a workflow step |
| `scenario` | `PikkuScenarioWire` | Called within a scenario |
| `gateway` | `PikkuGateway` | Called through a gateway (e.g. Slack) |

## Destructuring

Always destructure the wire to access only what you need:

```typescript @snippet co-func-wire-http
```

```typescript @snippet co-func-session-read
```

```typescript @snippet co-session-refresh-middleware
```

## Session

The session is the most commonly used wire property. When auth is enabled, the session is available directly as a value — not an accessor:

```typescript @snippet co-session-wire-ops
```

See [User Sessions](/docs/core-features/user-sessions) for more details.

## Transport-Specific Properties

### HTTP

Available when the function is called via an HTTP route:

```typescript @snippet co-wire-http
```

### Channel (WebSocket / SSE)

Available when the function is called via a WebSocket channel or SSE:

```typescript @snippet co-wire-channel
```

### Queue

Available when the function is processing a queue job:

```typescript @snippet queueJobControl
```

### Scheduled Task

Available when the function runs as a scheduled task:

```typescript @snippet cronSkip
```

### RPC

Available in all contexts for calling other Pikku functions:

```typescript @snippet co-wire-rpc-remote
```

### Trigger

Available in trigger source functions:

```typescript @snippet co-wire-trigger
```

## Why Wires?

Wires are what make Pikku functions transport-agnostic. Your business logic lives in the function, and the wire provides the bridge to whichever transport called it. This means:

- The same function works across HTTP, WebSocket, RPC, CLI, and more
- You can access transport-specific features when you need them
- Functions remain testable — just pass the wire properties you need
- Middleware operates on the wire to handle cross-cutting concerns like auth

## Next Steps

- [Middleware](/docs/core-features/middleware) — Cross-cutting concerns that operate on wires
- [User Sessions](/docs/core-features/user-sessions) — Session management via the wire
- [HTTP Routes](/docs/wiring/http) — Wiring functions to HTTP endpoints
- [Channels](/docs/wiring/channels) — Real-time bidirectional communication
