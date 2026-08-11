---
sidebar_position: 0
title: Better Auth
description: Full authentication with Better Auth — email/password, social sign-in, API keys, and sessions
ai: true
---

# Better Auth

The `@pikku/better-auth` package integrates [Better Auth](https://www.better-auth.com/) with Pikku. Better Auth handles the hard parts of authentication — email/password, social sign-in, sessions, API keys, plugins — while Pikku wires its endpoints into your app and bridges its sessions into every Pikku function.

This is the recommended way to do authentication in Pikku. New projects created with `npm create pikku@latest` ship with it configured.

## How it works

Three pieces work together:

1. **`pikkuBetterAuth`** — you export a factory that builds a `betterAuth(...)` instance from your Pikku services (secrets, database). The Pikku CLI detects this export during inspection and generates everything else.
2. **Generated auth routes** — the CLI emits a catch-all HTTP wiring (`/api/auth{/*splat}`, GET and POST) that forwards requests to Better Auth's handler. Sign-in, sign-up, callbacks, sign-out — all of Better Auth's endpoints work without any manual wiring.
3. **Session middleware** — the CLI registers middleware on `*` that reads the Better Auth session on each request and calls `setSession`, so `session.userId` is available in your functions like any other Pikku session.

Because it all flows through normal CLI inspection, the auth routes, required secrets (`BETTER_AUTH_SECRET`, OAuth credentials), and database tables show up in the deploy manifest, the console, and `pikku db migrate` automatically.

## Installation

```bash npm2yarn
npm install @pikku/better-auth better-auth
```

## Setup

Define your auth instance with `pikkuBetterAuth`. The factory runs lazily on the first auth request and receives your singleton services, so it can pull secrets and the database from them:

```typescript title="src/auth.ts"
import { betterAuth } from 'better-auth'
import { pikkuBetterAuth } from '@pikku/better-auth'
import type { CoreSingletonServices } from '@pikku/core'
import type { Kysely } from 'kysely'
import type { KyselyPikkuDB } from '@pikku/kysely'

export const auth = pikkuBetterAuth(
  async ({
    secrets,
    kysely,
  }: CoreSingletonServices & { kysely: Kysely<KyselyPikkuDB> }) => {
    const { BETTER_AUTH_SECRET, GITHUB_OAUTH } = await secrets.getSecrets<{
      BETTER_AUTH_SECRET: string
      GITHUB_OAUTH: { clientId: string; clientSecret: string }
    }>(['BETTER_AUTH_SECRET', 'GITHUB_OAUTH'])

    if (!BETTER_AUTH_SECRET) {
      throw new Error('Missing required secret: BETTER_AUTH_SECRET')
    }

    return betterAuth({
      secret: BETTER_AUTH_SECRET,
      database: { db: kysely, type: 'sqlite' },
      emailAndPassword: { enabled: true },
      // Enables the stateless session middleware (the CLI detects this)
      session: { cookieCache: { enabled: true } },
      socialProviders: {
        ...(GITHUB_OAUTH ? { github: GITHUB_OAUTH } : {}),
      },
    })
  }
)
```

That's the whole setup. Run `npx pikku dev` (or `npx pikku all`) and the CLI generates:

- `pikku/auth.gen.ts` — the `/api/auth{/*splat}` HTTP wiring using `createAuthHandler`
- `pikku/auth-middleware.gen.ts` — `addHTTPMiddleware('*', [...])` with the right session middleware
- `pikku/auth-secrets.gen.ts` — a `defineSecret` for `BETTER_AUTH_SECRET` and one for each configured social provider (e.g. `GITHUB_OAUTH`), so the platform knows which credentials to collect

Better Auth owns its own tables (`user`, `session`, `account`, `verification`) — run `pikku db migrate` to create them.

## Session middleware

Two middleware variants bridge Better Auth sessions into Pikku sessions. The CLI picks one automatically, but you can also register them yourself.

**1. `betterAuthSession`** — the full variant. Calls Better Auth's `getSession` on each request, which validates against the database. Supports cookie and bearer sessions, API keys, and impersonation.

```typescript title="middleware.ts"
import { betterAuthSession } from '@pikku/better-auth'
import { addHTTPMiddleware } from '#pikku'

addHTTPMiddleware('*', [
  betterAuthSession({
    // Optional: enrich the Pikku session beyond { userId }
    mapSession: async ({ user }, services) => ({
      userId: user.id,
      role: user.role,
    }),
  }),
])
```

**2. `betterAuthStatelessSession`** — the lean variant. Verifies the signed session cookie cache using only the `BETTER_AUTH_SECRET` signing secret — no database call, no Better Auth server bundled. This is what non-auth workers and serverless functions use, and what the CLI generates when your config enables `session.cookieCache`.

```typescript title="middleware.ts"
import { betterAuthStatelessSession } from '@pikku/better-auth'
import { addHTTPMiddleware } from '#pikku'

addHTTPMiddleware('*', [betterAuthStatelessSession()])
```

:::note Stateless tradeoff
`betterAuthStatelessSession` requires `session: { cookieCache: { enabled: true } }` in your Better Auth config. Server-side session revocation isn't seen until the cookie cache expires — but sign-out is still immediate, since it deletes the cookie.
:::

Both variants skip silently when a session is already set, so they stack with other auth middleware (API keys, JWT) without conflict. If no valid session is found, the request continues anonymously — routes with `auth: true` then reject it.

### Options

| Option | Applies to | Description |
|--------|-----------|-------------|
| `mapSession` | both | Map the Better Auth `{ user, session }` result to your app's session shape. Receives `services`, so you can look up org membership, roles, etc. Defaults to `{ userId: user.id }`. |
| `apiKey` | `betterAuthSession` | Resolve machine callers via Better Auth's API Key plugin. `apiKey.header` (default `x-api-key`) names the header; `apiKey.mapKey(key, services)` maps a verified key to a session — return `null` to reject. |
| `impersonation` | both | Let privileged users act as another user via a request header. |
| `secretId` | `betterAuthStatelessSession` | Secret holding the signing key. Defaults to `BETTER_AUTH_SECRET`. |

## Social providers and SSO

Add providers under `socialProviders` in your Better Auth config. The CLI reads the provider keys and emits a `defineSecret` for each one it recognizes (GitHub → `GITHUB_OAUTH`, Google → `GOOGLE_OAUTH`, and so on), so OAuth credentials are collected like any other Pikku secret — through your secret service locally, or through the console in production.

The convention: each provider secret is an object with `clientId` and `clientSecret`, read in the factory and spread into the config:

```typescript
socialProviders: {
  github: await secrets.getSecret('GITHUB_OAUTH'),
  google: await secrets.getSecret('GOOGLE_OAUTH'),
}
```

Some providers (Cognito, Okta-style OIDC) also need non-secret variables like a domain or tenant id — the CLI knows about these and surfaces them as variables alongside the secret.

## Client side

Use Better Auth's own client libraries — Pikku doesn't get in the way:

```typescript title="client.ts"
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000/api/auth',
})

await authClient.signIn.email({ email, password })
await authClient.signIn.social({ provider: 'github' })
```

After sign-in, the session cookie rides along on your Pikku fetch/websocket clients automatically (same origin), and every Pikku function sees the session.

## Next.js

When running inside Next.js, mount the handler as a route instead of relying on the generated catch-all wiring:

```typescript title="app/api/auth/[...all]/route.ts"
import { toNextJsAuthHandler } from '@pikku/next'
import { auth } from '../../../../src/auth'
import { createConfig, createSingletonServices } from '../../../../src/services'

export const { GET, POST } = toNextJsAuthHandler(
  auth,
  createConfig,
  createSingletonServices
)
```

`toNextJsAuthHandler` accepts your `pikkuBetterAuth` factory plus the config/services creators, resolves the instance once, and returns Next.js `GET`/`POST` route handlers. It also re-exports Better Auth's `nextCookies` plugin for server-action cookie handling.

## Actors (synthetic test users)

The `actor` plugin adds a `POST /sign-in/actor` endpoint used by [scenarios](/docs/core-features/testing) to sign in synthetic users during automated flows:

```typescript
import { actor } from '@pikku/better-auth'

return betterAuth({
  // ...
  plugins: [
    actor({ secret: await secrets.getSecret('SCENARIO_ACTOR_SECRET') }),
  ],
})
```

Actor rows are flagged with an `actor: true` column and auto-created on first sign-in. Sign-in for a non-actor user is always refused — knowing the secret never impersonates real users — and the flag rides into the Pikku session so audits and analytics can identify synthetic traffic. A missing secret disables the endpoint entirely.

## Delegated sign-in (upstream credentials)

The `delegatedAuth` plugin lets users sign in with the credentials they already have on an upstream API — useful when your app fronts an existing system (typically one imported as an [addon](/docs/addon/creating#auth-config-overrides)). The upstream API is the identity provider: no separate password, no invite flow.

It adds a `POST /sign-in/delegated` endpoint that accepts `{ email, password }` or `{ apiKey }`, verifies them against the upstream via your `authenticate` callback, and on success:

1. **JIT-provisions a real user** — email-keyed and `emailVerified` (the upstream just verified those credentials), linked to the upstream via an `account` row (`providerId: 'delegated'`, `accountId` = the upstream user id).
2. **Persists the upstream token per-user** via `storeCredential`, *before* the session is minted — if the token can't be stored, the sign-in fails, since every proxied call would be dead anyway.
3. **Mints a normal Better Auth session** and refreshes `name`/`role` from the upstream on every sign-in.

Passwords are never stored — they're forwarded to `authenticate` and discarded.

```typescript title="src/auth.ts"
import { delegatedAuth } from '@pikku/better-auth'
import { authenticateAcmeUpstream } from '@my-org/acme-addon'

export const auth = pikkuBetterAuth(async (services) => {
  const { credentialService } = services

  return betterAuth({
    // ...
    plugins: [
      delegatedAuth({
        authenticate: (credentials) =>
          authenticateAcmeUpstream(credentials, 'https://api.acme.example'),
        storeCredential: async (userId, identity) => {
          await credentialService.set('acme', identity.credential, userId)
        },
        defaultRole: 'member',
      }),
    ],
  })
})
```

### Options

| Option | Required | Description |
|--------|----------|-------------|
| `authenticate` | yes | Verify the credentials against the upstream and return an `UpstreamIdentity` (`externalId`, `email`, optional `name`/`role`/`tenantId`, plus an opaque `credential` — by convention `{ token, expiresAt?, tenantId? }`). Return `null` to reject; a thrown error is logged server-side and treated as a rejection without leaking upstream detail. |
| `storeCredential` | yes | Persist `identity.credential` for the user — typically `credentialService.set('<addon>', identity.credential, userId)`. Runs before the session is created. |
| `defaultRole` | no | Role assigned when the upstream identity carries none. Requires the `admin()` plugin's role column. |
| `mapRole` | no | Map an upstream role onto an app role. Defaults to pass-through. |

### Guard rails

- Exactly **one** upstream system of record per app — additional imported APIs are linked integrations, not extra login methods.
- An email already bound to a *different* upstream user is refused, and delegated identities never attach to synthetic operator/actor rows.
- The user's email is not updated on later sign-ins — an upstream email change must not collide with another local row.

:::tip Generated authenticate callback
When you generate an addon from an OpenAPI spec with `pikku new addon --auth-config`, a ready-made `authenticate<Name>Upstream()` implementation is emitted for you — see [Auth Config Overrides](/docs/addon/creating#auth-config-overrides).
:::

## Related

- [User Sessions](/docs/core-features/user-sessions) — how sessions flow through Pikku functions
- [Middleware](/docs/core-features/middleware) — how middleware ordering works
- [API Key](/docs/middleware/auth-apikey) / [JWT](/docs/middleware/auth-jwt) / [Cookie](/docs/middleware/auth-cookie) — lighter-weight alternatives
