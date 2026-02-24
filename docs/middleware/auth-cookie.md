---
sidebar_position: 3
title: Cookie Session
description: Authenticate requests using JWT-encoded session cookies
---

# Cookie Session Authentication

The `authCookie` middleware reads session data from a named cookie on incoming requests and automatically updates the cookie when the session changes (e.g., after login or logout).

## Installation

```typescript
import { authCookie } from '@pikku/core/middleware'
```

## Usage

```typescript
import { authCookie } from '@pikku/core/middleware'

wireHTTP({
  // ...
  middleware: [
    authCookie({
      name: 'session',
      expiresIn: { value: 30, unit: 'day' },
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      },
    }),
  ],
})
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Cookie name |
| `expiresIn` | `RelativeTimeInput` | Cookie expiration (e.g., `{ value: 30, unit: 'day' }`) |
| `options` | `SerializeOptions` | Cookie serialization options from the `cookie` package |

### SerializeOptions

Standard cookie options:

| Option | Type | Description |
|--------|------|-------------|
| `httpOnly` | `boolean` | Prevents client-side JavaScript access |
| `secure` | `boolean` | Only sent over HTTPS |
| `sameSite` | `'strict' \| 'lax' \| 'none'` | CSRF protection |
| `path` | `string` | Cookie path scope |
| `domain` | `string` | Cookie domain scope |

## How It Works

**On request:**
1. Reads the cookie value by the configured `name`
2. Decodes it as a JWT using `jwtService.decode()`
3. Sets the decoded payload as the user session

**After response:**
1. Checks if the session has changed during the request
2. If changed, encodes the current session as a JWT
3. Sets the cookie on the response with the configured expiration and options

This two-phase approach means sessions are automatically refreshed — when a login function calls `setSession()`, the cookie is updated in the same response.

## Behavior

- **Skips** if no cookie is present (allows unauthenticated routes)
- **Skips** if a session already exists (allows stacking with other auth middleware)
- **Auto-updates** the cookie when the session changes during the request
- Requires a `JWTService` in your singleton services

## Example: Login Flow

```typescript
export const login = pikkuFunc<
  { username: string; password: string },
  { success: boolean }
>({
  func: async ({ users }, data, { setSession }) => {
    const user = await users.verify(data.username, data.password)
    if (!user) throw new UnauthorizedError()

    // This triggers the cookie middleware to set the cookie in the response
    await setSession({ userId: user.id, role: user.role })
    return { success: true }
  },
})
```
