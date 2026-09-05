---
sidebar_position: 5
title: Built-in Middleware
description: CORS, telemetry, and remote RPC auth shipped with @pikku/core
ai: true
---

# Built-in Middleware

Beyond the auth middleware, Pikku ships a small set of general-purpose middleware: CORS handling, telemetry logging, and remote RPC authentication. `cors` is on your app's `#pikku/middleware` door alongside `addHTTPMiddleware`; the telemetry pair isn't re-exported, so it comes straight from `@pikku/core/middleware`.

```typescript
import { cors, addHTTPMiddleware } from '#pikku/middleware'
import { telemetryOuter, telemetryInner } from '@pikku/core/middleware'
```

## CORS

Handles cross-origin requests, including `OPTIONS` preflight — preflights are answered directly with `204 No Content` without hitting your functions.

```typescript title="cors.ts"
import { cors, addHTTPMiddleware } from '#pikku/middleware'

addHTTPMiddleware('*', [
  cors({
    origin: 'https://app.example.com',
    credentials: true,
  }),
])
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `origin` | `string \| string[] \| true` | `'*'` | Allowed origin(s). `'*'` allows any origin, `true` reflects the request origin, an array allows multiple origins. |
| `methods` | `string[]` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | Allowed HTTP methods. |
| `headers` | `string[]` | `Content-Type, Authorization, x-api-key` | Allowed request headers. |
| `credentials` | `boolean` | `false` | Sets `Access-Control-Allow-Credentials`. |
| `maxAge` | `number` | `86400` | Preflight cache duration in seconds. |

When `origin` is `true` or an array, a `Vary: Origin` header is added so caches don't serve one origin's response to another.

:::warning Wildcard + credentials
`cors({ origin: '*', credentials: true })` throws at startup — browsers reject that combination, so Pikku refuses the misconfiguration up front. Use an explicit origin (or `origin: true`) with credentials.
:::

## Timeout

There is no timeout middleware. A timeout is declared on the HTTP wiring itself, as `timeout` in **seconds**:

```typescript title="wirings/report.http.ts"
import { wireHTTP } from '#pikku/http'
import { generateReport } from '../functions/report.function.js'

wireHTTP({
  method: 'post',
  route: '/reports',
  func: generateReport,
  timeout: 30,
})
```

It's a per-route number, not a chain wrapper, so there's no ordering to get right. Work that can outlast a request should be dispatched to a [queue](/docs/wiring/queue) rather than given a longer timeout.

## Telemetry

Two middleware that emit structured JSON log entries (via `services.logger`) with durations and outcomes, designed to be parsed by log-based monitoring:

- **`telemetryOuter()`** — runs at `highest` priority (outermost). Captures **total** request duration including all middleware, the outcome (`ok`/`error`), and HTTP method/path/status when applicable.
- **`telemetryInner()`** — runs at `lowest` priority (innermost, right next to the function). Captures the **function-only** duration and the authenticated `pikkuUserId`.

```typescript title="telemetry.ts"
import { telemetryOuter, telemetryInner } from '@pikku/core/middleware'
import { addGlobalMiddleware } from '#pikku/middleware'

addGlobalMiddleware([telemetryOuter(), telemetryInner()])
```

Every entry carries the wire metadata (`traceId`, `wireType`, `wireId`) and is tagged `__pikku_telemetry: 'end'` with a `__pikku_layer` of `outer` or `inner`. Comparing the two durations tells you how much time middleware (auth, session lookup) costs per request. Both accept optional `{ environmentId, orgId }` to stamp entries in multi-tenant deployments.

## Remote RPC auth

`pikkuRemoteAuthMiddleware` protects the `/remote/rpc/*` endpoints used for [remote RPC calls](/docs/wiring/rpcs) between services. It verifies a JWT bearer token (audience `pikku-remote`), checks the token is scoped to the function being called, and decrypts the caller's session so it carries across service boundaries.

It activates only when the `PIKKU_REMOTE_SECRET` secret is configured — without it, remote RPC endpoints reject all calls and everything else passes through untouched. The generated bootstrap wires this up for you when you use remote RPCs; you rarely register it by hand.

## Related

- [Middleware](/docs/core-features/middleware) — how middleware ordering and priorities work
- [API reference: enhance/middleware](/docs/api-reference/enhance/middleware) — everything on the `#pikku/middleware` door
- [Better Auth](/docs/middleware/better-auth) / [JWT](/docs/middleware/auth-jwt) / [API Key](/docs/middleware/auth-apikey) — authentication middleware
