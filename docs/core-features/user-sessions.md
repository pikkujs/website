---
sidebar_position: 40
title: User Sessions
description: Managing user authentication and session state
---

# User Sessions

User sessions are crucial for managing **authentication**, **security**, **auditing**, and **user-specific state** in modern applications. Pikku provides a unified session abstraction through the wire parameter that works consistently across different protocols.

:::info Protocol Support
Sessions are designed for interactive, user-facing protocols:
- **HTTP** – Cookie or token-based sessions
- **WebSocket (Channels)** – Connection-based sessions
- **CLI** – Interactive command sessions
- **MCP** – AI agent sessions

**Queue workers and scheduled tasks** typically run as service accounts rather than user sessions. Pikku supports this pattern, but it's handled differently and will be enhanced in future versions.
:::

## How It Works

Pikku doesn't make assumptions about how sessions are stored or managed. Instead, it provides a session abstraction through the wire parameter that your middleware uses to load and persist sessions.

The key benefit: **your functions don't need to know** if the session comes from an HTTP cookie, a WebSocket connection, or somewhere else. They just destructure `session`, `setSession`, `clearSession`, `getSession`, and `hasSessionChanged` from the wire parameter, and it works across all protocols. The resolved user id is also available as `pikkuUserId`.

### Session Lifecycle

1. **Middleware loads the session** – Pikku's session middleware loads session data based on the protocol (e.g., from a cookie for HTTP, from connection state for WebSocket)

2. **Function receives session** – Your function gets the session value by destructuring from the wire parameter

3. **Function can modify session** – Use `setSession()` or `clearSession()` from the wire parameter

4. **Middleware persists changes** – Pikku's middleware saves any session changes back to the store

This separation means you can use different session strategies per protocol while keeping your function code identical.

## Pikku Session Middleware

Pikku ships session-aware middleware in [`#pikku/middleware`](/api#app/middleware):

- **[`authCookie`](/docs/middleware/auth-cookie)** – Cookie-based sessions for HTTP
- **[`authBearer`](/docs/middleware/auth-jwt)** – Bearer/JWT token sessions
- **[`authAPIKey`](/docs/middleware/auth-apikey)** – API-key based sessions

These middleware handle loading sessions before your functions execute and persisting any changes afterward (the cookie middleware re-writes the cookie when the session changes). You can customize the behavior or implement your own session middleware.

## Defining Your Session Type

Define what data you want to store in sessions by creating your `UserSession` type:

Extend `CoreUserSession` in `types/application-types.d.ts` with your own fields, for example `userId`, `email`, a `role` of `'user' | 'admin'` and a `permissions` string array.

Now your session type is available throughout your application with full type safety.

## Setting a Session (Login)

Use `setSession()` to create or update a session. This typically happens in a login function:

```typescript @snippet co-func-auth-flow
```

Notice we used `pikkuSessionlessFunc` and set `auth: false` – this function doesn't require an existing session since we're creating one.

## Clearing a Session (Logout)

Use `clearSession()` to end a session, as the `logout` function in the example above does:

What happens after `clearSession()` depends on the protocol:
- **HTTP**: Session cookie is cleared
- **WebSocket**: Connection's session is marked as cleared (connection stays open)
- **CLI**: Authenticated session ends

## Accessing Session Data

In any function with `auth: true` (the default), the session is available by destructuring from the wire parameter:

```typescript @snippet sessionFunction
```

For functions that work with or without authentication, use `pikkuSessionlessFunc`:

```typescript @snippet co-session-optional
```

## Updating Session Data

You can update the session anytime during a function call:

```typescript @snippet co-session-update
```

## Custom Middleware

You can create custom [middleware](/docs/core-features/middleware) to extend session behavior:

```typescript @snippet co-session-refresh-middleware
```

## Summary

Pikku's session system provides:

- **Transport-agnostic abstraction** – Same wire-level `session`, `setSession`, `clearSession`, `getSession`, and `hasSessionChanged` API for all protocols
- **Middleware-driven** – Pikku's middleware handles loading and persisting sessions
- **Type-safe** – Full TypeScript support for your session data
- **Protocol support** – Works with HTTP, WebSocket, CLI, and MCP
- **Flexible** – Use cookies, tokens, connection state, or custom strategies

The wire parameter is the key: it provides `session`, `setSession`, and `clearSession` so your functions work identically whether called via HTTP, WebSocket, or any other protocol that supports user sessions.

For more details, see:
- [SessionService API](/docs/api/user-session-service)
- [Middleware](/docs/core-features/middleware)
- [Permission Guards](/docs/core-features/permission-guards)
