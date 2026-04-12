---
sidebar_position: 4
title: Auth.js
description: Authenticate requests using Auth.js session cookies
ai: true
---

# Auth.js Authentication

The `@pikku/auth-js` package integrates [Auth.js](https://authjs.dev/) (NextAuth v5) with Pikku. It provides:

1. **Auth routes** — mounts all Auth.js endpoints (signin, callback, session, signout, etc.) as Pikku HTTP routes
2. **Session middleware** — reads Auth.js session cookies and bridges them into Pikku user sessions

## Installation

```bash
npm install @pikku/auth-js @auth/core
```

You'll also need at least one Auth.js provider (e.g., `@auth/core/providers/github`).

## Auth Routes

`createAuthRoutes` registers all the standard Auth.js routes under a base path (default: `/auth`). Mount it with `wireHTTPRoutes`:

```typescript
import { wireHTTPRoutes } from '#pikku'
import { createAuthRoutes } from '@pikku/auth-js'
import GitHub from '@auth/core/providers/github'

wireHTTPRoutes({
  routes: {
    auth: createAuthRoutes({
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
      ],
      secret: process.env.AUTH_SECRET!,
    }),
  },
})
```

This mounts the following routes:

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/csrf` | CSRF token |
| GET | `/auth/providers` | Available providers |
| GET/POST | `/auth/signin` | Sign in page |
| POST | `/auth/signin/:provider` | Provider-specific sign in |
| GET/POST | `/auth/callback/:provider` | OAuth callback |
| GET/POST | `/auth/signout` | Sign out |
| GET | `/auth/session` | Current session |
| GET | `/auth/error` | Error page |

### Dynamic Config

If your Auth.js config depends on services (e.g., reading secrets at runtime), pass a factory function:

```typescript
createAuthRoutes(async (services) => ({
  providers: [
    GitHub({
      clientId: await services.secrets.getSecret('GITHUB_CLIENT_ID'),
      clientSecret: await services.secrets.getSecret('GITHUB_CLIENT_SECRET'),
    }),
  ],
  secret: await services.secrets.getSecret('AUTH_SECRET'),
}))
```

### Custom Base Path

```typescript
createAuthRoutes(config, '/api/auth')
```

## Session Middleware

`authJsSession` is a Pikku middleware that reads Auth.js session cookies and sets the Pikku user session. Use it to authenticate all your non-auth routes.

```typescript
import { authJsSession } from '@pikku/auth-js'
import { addHTTPMiddleware } from '#pikku'

addHTTPMiddleware('*', [
  authJsSession({
    secretId: 'AUTH_SECRET',
    mapSession: (claims) => ({
      userId: claims.sub,
      email: claims.email,
      name: claims.name,
    }),
  }),
])
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `secret` | `string` | Auth.js secret for decoding the session cookie (use for dev/testing) |
| `secretId` | `string` | Secret ID resolved from `services.secrets` at request time (use for production) |
| `cookieName` | `string` | Cookie name override (default: `authjs.session-token`) |
| `mapSession` | `(claims) => UserSession` | Map decoded JWT claims to your Pikku user session type |

Provide either `secret` or `secretId` — not both.

### How It Works

1. Reads the `authjs.session-token` cookie (or `__Secure-authjs.session-token` on HTTPS)
2. Decodes it as a JWT using the Auth.js secret
3. Calls `mapSession` to convert the claims to your `UserSession` type
4. Sets the session on the wire — your functions receive it via `wire.session`

If no cookie is present or decoding fails, the middleware passes through without setting a session. Functions that require auth will reject the request as usual.

:::note
Auth.js sessions are read-only in Pikku. To modify sessions (e.g., sign out), use the Auth.js routes (`/auth/signout`). Attempting to change the session in a middleware chain after `authJsSession` will throw an error.
:::

## Full Example

```typescript
import { wireHTTPRoutes, wireHTTP, addHTTPMiddleware } from '#pikku'
import { createAuthRoutes, authJsSession } from '@pikku/auth-js'
import GitHub from '@auth/core/providers/github'

// Mount Auth.js routes
wireHTTPRoutes({
  routes: {
    auth: createAuthRoutes({
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
      ],
      secret: process.env.AUTH_SECRET!,
    }),
  },
})

// Bridge Auth.js sessions to Pikku
addHTTPMiddleware('*', [
  authJsSession({
    secret: process.env.AUTH_SECRET!,
    mapSession: (claims) => ({
      userId: claims.sub,
      email: claims.email,
    }),
  }),
])

// Your functions now have typed sessions
wireHTTP({
  method: 'get',
  route: '/api/me',
  func: getMe,  // wire.session.userId and .email are available
  auth: true,
})
```
