---
title: UserSessionService
---

The UserSessionService interface manages user session data in Pikku applications. It provides methods to get, set, and clear user sessions, with support for channel-based sessions in real-time applications.

## Interface

```typescript reference title="user-session-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/user-session-service.ts
```

## Properties

### `sessionChanged: boolean`

Indicates whether the session has been modified since initialization. This is useful for determining if session data needs to be persisted.

## Methods

### `setInitial(session: UserSession): void`

Sets the initial session data without marking it as changed. Used during session initialization.

- **Parameters:**
  - `session`: The session object to set as initial state

### `set(session: UserSession): Promise<void> | void`

Sets or updates the session data and marks it as changed.

- **Parameters:**
  - `session`: The new session data
- **Returns:** Promise or void, depending on implementation

### `clear(): Promise<void> | void`

Clears the current session data and marks the session as changed.

- **Returns:** Promise or void, depending on implementation

### `get(): Promise<UserSession | undefined> | UserSession | undefined`

Retrieves the current session data.

- **Returns:** The session data, undefined if no session exists, or a Promise resolving to either

## Implementation

Pikku provides a default implementation `PikkuUserSessionService` that supports both regular sessions and channel-based sessions for WebSocket connections:

```typescript
class PikkuUserSessionService<UserSession extends CoreUserSession>
  implements UserSessionService<UserSession>
```

### Constructor Parameters

- `channelStore?`: Optional channel store for WebSocket session management
- `channelId?`: Optional channel ID when using channel store

## Usage Example

```typescript
// Define your session type
interface MyUserSession extends CoreUserSession {
  userId: string
  email: string
  role: string
}

// Use in a function
const getUserData: CorePikkuFunction<
  {},
  { user: MyUserSession | null }
> = async (services, data, session) => {
  // Get current session
  const currentSession = await services.userSession?.get()
  
  if (currentSession) {
    // Update session data
    const updatedSession = {
      ...currentSession,
      lastActivity: new Date().toISOString()
    }
    await services.userSession?.set(updatedSession)
  }
  
  return { user: currentSession || null }
}

// Clear session (logout)
const logout: CorePikkuFunction<{}, { success: boolean }> = async (services) => {
  await services.userSession?.clear()
  return { success: true }
}
```

## Channel Integration

When used with WebSocket channels, the UserSessionService automatically syncs session data with the channel store:

```typescript
// Session changes are automatically propagated to connected clients
const updateProfile: CorePikkuFunction<
  { name: string },
  { success: boolean }
> = async (services, data, session) => {
  if (!session) throw new Error('Not authenticated')
  
  // Update session - this will be synced across all user's connections
  await services.userSession?.set({
    ...session,
    name: data.name,
    updatedAt: new Date().toISOString()
  })
  
  return { success: true }
}
```