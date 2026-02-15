---
sidebar_position: 11
title: Wires
description: Transport-specific context passed to functions and middleware
---

# Wires

Every Pikku function receives three arguments: **services**, **data**, and **wire**. The wire is the transport-specific context — it tells your function _how_ it was called and gives access to transport-specific capabilities.

```typescript
export const myFunc = pikkuFunc<Input, Output>({
  func: async (services, data, wire) => {
    // wire contains transport-specific properties
  }
})
```

The same function can be called via HTTP, WebSocket, RPC, CLI, or any other transport. The wire is what changes between them.

## What's in a Wire

The wire object (`PikkuWire`) contains these properties, all optional depending on which transport invoked the function:

| Property | Type | Available When |
|----------|------|---------------|
| `session` | `UserSession \| undefined` | Auth is enabled |
| `setSession` | `(session) => void` | Auth middleware is active |
| `clearSession` | `() => void` | Auth middleware is active |
| `http` | `PikkuHTTP` | Called via HTTP |
| `channel` | `PikkuChannel` | Called via WebSocket or SSE |
| `rpc` | `PikkuRPC` | Always (for calling other functions) |
| `queue` | `PikkuQueue` | Called as a queue job |
| `scheduledTask` | `PikkuScheduledTask` | Called as a scheduled task |
| `cli` | `PikkuCLI` | Called via CLI |
| `mcp` | `PikkuMCP` | Called via MCP |
| `trigger` | `PikkuTrigger` | Called as a trigger source |
| `workflow` | `PikkuWorkflowWire` | Called within a workflow |

## Destructuring

Always destructure the wire to access only what you need:

```typescript
// HTTP-aware function
export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ database }, data, { http }) => {
    const book = await database.query('book', { bookId: data.bookId })
    // Access HTTP-specific details if needed
    if (http?.request) {
      const userAgent = http.request.header('user-agent')
    }
    return book
  }
})
```

```typescript
// Function that uses session
export const getProfile = pikkuFunc<void, Profile>({
  func: async ({ database }, _data, { session }) => {
    return await database.query('user', { userId: session.userId })
  }
})
```

```typescript
// Middleware destructures wire too
const authMiddleware = pikkuMiddleware(
  async ({ jwt }, { http, setSession }, next) => {
    const token = http?.request?.header('authorization')
    if (token) {
      const session = await jwt.decode(token)
      setSession(session)
    }
    await next()
  }
)
```

## Session

The session is the most commonly used wire property. When auth is enabled, the session is available directly as a value — not an accessor:

```typescript
// ✅ session is the value directly
async (services, data, { session }) => {
  const userId = session.userId
}

// ✅ Set a new session (e.g., after login)
async (services, data, { setSession }) => {
  setSession({ userId: '123', role: 'admin' })
}

// ✅ Clear the session (e.g., on logout)
async (services, _data, { clearSession }) => {
  clearSession()
}
```

See [User Sessions](./user-sessions.md) for more details.

## Transport-Specific Properties

### HTTP

Available when the function is called via an HTTP route:

```typescript
async (services, data, { http }) => {
  // Request details
  const method = http.request.method()
  const path = http.request.path()
  const authHeader = http.request.header('authorization')
  const cookie = http.request.cookie('session')

  // Response control
  http.response.status(201)
  http.response.header('X-Custom', 'value')
  http.response.cookie('session', token, { httpOnly: true })
}
```

### Channel (WebSocket / SSE)

Available when the function is called via a WebSocket channel or SSE:

```typescript
async (services, data, { channel }) => {
  // Send data to the client
  channel.send({ message: 'hello' })

  // Close the connection
  channel.close()
}
```

### Queue

Available when the function is processing a queue job:

```typescript
async (services, data, { queue }) => {
  queue.updateProgress(50)  // Report progress
  queue.fail('reason')      // Fail the job
  queue.discard('reason')   // Discard without retry
}
```

### Scheduled Task

Available when the function runs as a scheduled task:

```typescript
async (services, _data, { scheduledTask }) => {
  console.log(scheduledTask.name)           // Task name
  console.log(scheduledTask.schedule)        // Cron expression
  console.log(scheduledTask.executionTime)   // Current execution time
  scheduledTask.skip('maintenance window')   // Skip this execution
}
```

### RPC

Available in all contexts for calling other Pikku functions:

```typescript
async (services, data, { rpc }) => {
  // Call another function internally
  const result = await rpc.invoke('getUser', { userId: data.userId })

  // Call a remote function
  const remote = await rpc.remote('externalService', data)
}
```

### Trigger

Available in trigger source functions:

```typescript
async (services, input, { trigger }) => {
  // Fire the trigger when an event occurs
  trigger.invoke({ payload: 'event data' })
}
```

## Why Wires?

Wires are what make Pikku functions transport-agnostic. Your business logic lives in the function, and the wire provides the bridge to whichever transport called it. This means:

- The same function works across HTTP, WebSocket, RPC, CLI, and more
- You can access transport-specific features when you need them
- Functions remain testable — just pass the wire properties you need
- Middleware operates on the wire to handle cross-cutting concerns like auth

## Next Steps

- [Middleware](./middleware.md) — Cross-cutting concerns that operate on wires
- [User Sessions](./user-sessions.md) — Session management via the wire
- [HTTP Routes](../wiring/http/index.md) — Wiring functions to HTTP endpoints
- [Channels](../wiring/channels/index.md) — Real-time bidirectional communication
