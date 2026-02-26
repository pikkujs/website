---
title: UserSessionService
---

The UserSessionService manages user session data within a single request or connection. It provides methods to get, set, and clear the session, with automatic sync to the channel store for WebSocket connections.

## Interface

```typescript reference title="user-session-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/user-session-service.ts
```

## Properties

### `sessionChanged: boolean`

`true` if the session has been modified since initialization. Used internally to determine whether the session needs to be persisted after a request.

## Methods

### `setInitial(session: UserSession): void`

Sets the initial session without marking it as changed. Called during session initialization — not intended for use in functions.

### `set(session: UserSession): Promise<void> | void`

Updates the session and marks it as changed.

### `clear(): Promise<void> | void`

Clears the session and marks it as changed. Use this to log users out.

### `get(): Promise<UserSession | undefined> | UserSession | undefined`

Returns the current session, or `undefined` if no session exists.

## Usage Example

```typescript
// Read and update the session
export const touchSession = pikkuFunc<void, { ok: boolean }>(
  async (services) => {
    const session = await services.userSession.get()
    if (!session) return { ok: false }

    await services.userSession.set({
      ...session,
      lastActiveAt: new Date().toISOString()
    })

    return { ok: true }
  }
)

// Log out
export const logout = pikkuFunc<void, { success: boolean }>(
  async (services) => {
    await services.userSession.clear()
    return { success: true }
  }
)
```

## Channel Integration

When used with WebSocket channels, session changes are automatically synced to the channel store, so all connections belonging to the same user see consistent session state.
