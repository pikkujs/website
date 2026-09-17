---
title: SessionService
---

The session is managed through the **wire** (the 3rd function argument), not a singleton service. Functions read `session` and call `setSession()` / `clearSession()` / `getSession()`; every wire also exposes `hasSessionChanged()` and `pikkuUserId`. Core backs those with the `SessionService` contract in `user-session-service.ts` and the built-in `PikkuSessionService` class, but you neither register nor reach for it — the HTTP, channel and function runners construct one per invocation.

## Interface

```typescript reference title="user-session-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/user-session-service.ts
```

The interface is generic — `SessionService<UserSession extends CoreUserSession>` — and `PikkuSessionService` takes an optional [`SessionStore`](./session-store) for persistence.

## Properties

### `sessionChanged: boolean`

`true` if the session has been modified since initialization. Used internally to determine whether the session needs to be persisted after a request.

### `initial: UserSession | undefined`

The snapshot `freezeInitial()` recorded at the start of the invocation.

## Methods

### `setInitial(session: UserSession): void`

Sets the session without marking it as changed. Called during session initialization; this is what `setSession()` maps to on the middleware wire, which must not persist.

### `freezeInitial(): UserSession | undefined`

Pins the session as it stood at the start of the request and returns it. The
first call records the current session as `initial`; later calls return that
same snapshot, so a comparison against it stays stable even after `set`.

### `set(session: UserSession): Promise<void> | void`

Updates the session and marks it as changed. When a `pikkuUserId` is known it also writes through to the registered `SessionStore`.

### `clear(): Promise<void> | void`

Clears the session and marks it as changed. Use this to log users out; it clears the store the same way `set` writes to it.

### `get(): UserSession | undefined`

Returns the current session, or `undefined` if no session exists.

## Usage Example

Functions don't access the `SessionService` directly — its operations are
exposed on the **wire** (the 3rd function argument) as `session`, `getSession()`,
`setSession()`, and `clearSession()`:

```typescript
// Read and update the session
export const touchSession = pikkuFunc<void, { ok: boolean }>(
  async (services, data, { session, setSession }) => {
    if (!session) return { ok: false }

    await setSession({
      ...session,
      lastActiveAt: new Date().toISOString()
    })

    return { ok: true }
  }
)

// Log out
export const logout = pikkuFunc<void, { success: boolean }>(
  async (services, data, { clearSession }) => {
    await clearSession()
    return { success: true }
  }
)
```

## Persistence

With a [`SessionStore`](./session-store) registered, `set()` and `clear()` write through to it whenever the wire carries a resolved `pikkuUserId`. A session set on a wire with no `pikkuUserId` lives for that invocation and is never persisted. On the read side, the function runner consults the store only when the wire arrives without a session — the store page has the full resolution order.
