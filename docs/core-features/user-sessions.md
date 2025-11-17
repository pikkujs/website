---
sidebar_position: 40
title: User Sessions
description: Managing user authentication and session state
---

# User Sessions

User sessions are crucial for managing **authentication**, **security**, **auditing**, and **user-specific state** in modern applications. Pikku provides a unified session abstraction through the `userSessionService` that works consistently across different protocols.

:::info Protocol Support
Sessions are designed for interactive, user-facing protocols:
- **HTTP** – Cookie or token-based sessions
- **WebSocket (Channels)** – Connection-based sessions
- **CLI** – Interactive command sessions
- **MCP** – AI agent sessions

**Queue workers and scheduled tasks** typically run as service accounts rather than user sessions. Pikku supports this pattern, but it's handled differently and will be enhanced in future versions.
:::

## How It Works

Pikku doesn't make assumptions about how sessions are stored or managed. Instead, it provides the `userSessionService` abstraction that your middleware uses to load and persist sessions.

The key benefit: **your functions don't need to know** if the session comes from an HTTP cookie, a WebSocket connection, or somewhere else. They just use the `session` parameter, and it works across all protocols.

### Session Lifecycle

1. **Middleware loads the session** – Pikku's session middleware uses the `userSessionService` to load session data based on the protocol (e.g., from a cookie for HTTP, from connection state for WebSocket)

2. **Function receives session** – Your function gets the session as the third parameter

3. **Function can modify session** – Use `userSession.set()` or `userSession.clear()` to update session state

4. **Middleware persists changes** – Pikku's middleware saves any session changes back to the store

This separation means you can use different session strategies per protocol while keeping your function code identical.

## Pikku Session Middleware

Pikku provides session middleware for different protocols:

- **`@pikku/middleware-http-session`** – Cookie-based sessions for HTTP
- **`@pikku/middleware-channel-session`** – Connection-based sessions for WebSocket channels

These middleware handle loading sessions before your functions execute and persisting any changes afterward. You can customize the behavior or implement your own session middleware.

## Defining Your Session Type

Define what data you want to store in sessions by creating your `UserSession` type:

```typescript
// types/application-types.d.ts
import { CoreUserSession } from '@pikku/core'

interface UserSession extends CoreUserSession {
  userId: string
  email: string
  role: 'user' | 'admin'
  permissions: string[]
}
```

Now your session type is available throughout your application with full type safety.

## Setting a Session (Login)

Use `userSession.set()` to create or update a session. This typically happens in a login function:

```typescript
import { pikkuSessionlessFunc, UnauthorizedError } from '@pikku/core'

type LoginInput = {
  email: string
  password: string
}

type LoginResult = {
  token: string
  user: { id: string; email: string; role: string }
}

export const login = pikkuSessionlessFunc<LoginInput, LoginResult>({
  func: async ({ database, jwt }, data, { session }) => {
    // Verify credentials
    const user = await database.query('user', { email: data.email })

    if (!user || !await verifyPassword(data.password, user.passwordHash)) {
      throw new UnauthorizedError('Invalid credentials')
    }

    // Set the session - middleware will persist it
    await session?.set({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    })

    // Optionally return a JWT for client-side storage
    // (useful for mobile apps or when cookies aren't available)
    return {
      token: await jwt.sign({ userId: user.id }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  },
  auth: false,  // No existing session required for login
  docs: {
    summary: 'Authenticate a user',
    tags: ['auth']
  }
})
```

Notice we used `pikkuSessionlessFunc` and set `auth: false` – this function doesn't require an existing session since we're creating one.

## Clearing a Session (Logout)

Use `session?.clear()` to end a session:

```typescript
export const logout = pikkuFunc<void, { success: boolean }>({
  func: async ({}, data, { session }) => {
    await session?.clear()
    return { success: true }
  },
  docs: {
    summary: 'Logout user',
    tags: ['auth']
  }
})
```

What happens after `session?.clear()` depends on the protocol:
- **HTTP**: Session cookie is cleared
- **WebSocket**: Connection's session is marked as cleared (connection stays open)
- **CLI**: Authenticated session ends

## Accessing Session Data

In any function with `auth: true` (the default), the session is available as the third parameter:

```typescript
export const getProfile = pikkuFunc<void, UserProfile>({
  func: async ({ database }, data, { session }) => {
    // session is guaranteed to exist because auth: true
    const user = await session?.get()
    return await database.query('userProfile', {
      userId: user.userId
    })
  },
  docs: {
    summary: 'Get current user profile',
    tags: ['user']
  }
})
```

For functions that work with or without authentication, use `pikkuSessionlessFunc`:

```typescript
export const getPublicData = pikkuSessionlessFunc<void, PublicData>({
  func: async ({ database }, data, { session }) => {
    // session might be undefined
    const user = await session?.get()
    if (user) {
      // User is logged in, return personalized data
      return await database.query('publicData', { userId: user.userId })
    }
    // Return generic data for anonymous users
    return await database.query('publicData', { isPublic: true })
  },
  auth: false,
  docs: {
    summary: 'Get public data (personalized if logged in)',
    tags: ['public']
  }
})
```

## Updating Session Data

You can update the session anytime during a function call:

```typescript
export const updatePreferences = pikkuFunc<PreferencesInput, void>({
  func: async ({ database }, data, { session }) => {
    const user = await session?.get()
    // Save to database
    await database.update('userPreferences', {
      where: { userId: user.userId },
      set: data
    })

    // Update session - middleware will persist the change
    await session?.set({
      ...user,
      preferences: data,
      updatedAt: new Date().toISOString()
    })
  },
  docs: {
    summary: 'Update user preferences',
    tags: ['user']
  }
})
```

## Custom Middleware

You can create custom [middleware](/docs/core-features/middleware) to extend session behavior:

```typescript
// Automatically update last activity timestamp
export const refreshSessionMiddleware = pikkuMiddleware(async (
  {},
  wire,
  next
) => {
  const user = await wire.session?.get()
  if (user) {
    await wire.session?.set({
      ...user,
      lastActivity: new Date().toISOString()
    })
  }

  return await next()
})
```

## Summary

Pikku's session system provides:

- **Transport-agnostic abstraction** – Same `userSessionService` API for all protocols
- **Middleware-driven** – Pikku's middleware handles loading and persisting sessions
- **Type-safe** – Full TypeScript support for your session data
- **Protocol support** – Works with HTTP, WebSocket, CLI, and MCP
- **Flexible** – Use cookies, tokens, connection state, or custom strategies

The `userSessionService` is the key: it abstracts session management so your functions work identically whether called via HTTP, WebSocket, or any other protocol that supports user sessions.

For more details, see:
- [UserSessionService API](/docs/api/user-session-service)
- [Middleware](/docs/core-features/middleware)
- [Permission Guards](/docs/core-features/permission-guards)
