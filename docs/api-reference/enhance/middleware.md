---
title: '#pikku/middleware'
sidebar_label: '#pikku/middleware'
sidebar_position: 3
description: 'Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or aga…'
---

# `#pikku/middleware`

Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or against an HTTP route or channel.

```typescript
import { addChannelMiddleware, addGlobalMiddleware, addHTTPMiddleware } from '#pikku/middleware'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`addChannelMiddleware`](#addchannelmiddleware) | function | Attaches channel middleware to every channel carrying the given tag, so the channels themselves stay free of the wiring. |
| [`addGlobalMiddleware`](#addglobalmiddleware) | function | Wire-agnostic global middleware. Runs at the top of every wiring's middleware chain — before wire-, tag-, and function-level entries. |
| [`addHTTPMiddleware`](#addhttpmiddleware) | function | Registers HTTP middleware either globally or for a specific route pattern. |
| [`addTagMiddleware`](#addtagmiddleware) | function | Tag-scoped middleware. Applies to any wiring that carries the matching tag. |
| [`authAPIKey`](#authapikey) | function | Reads an API key from the request and JWT-decodes it into a session. Leaves an existing session alone, so it composes with other auth middleware. |
| [`authBearer`](#authbearer) | function | Validates a bearer token: JWT-decoded by default, or compared in constant time against a static `value` or a `secretId` resolved through the secrets service per request. |
| [`authCookie`](#authcookie) | function | Reads a JWT session from a cookie, and re-issues the cookie after the request whenever the session changed (e.g. after login). |
| [`cors`](#cors) | function | Sets CORS headers on every response and short-circuits OPTIONS preflight with a 204. `origin: true` reflects the request origin; an array reflects a matching origin and otherwise sends no `Access-Control-Allow-Origin` at all, so the browser reports "origin not allowed" rather than an origin mismatch against whichever entry happened to be first. |
| [`MiddlewarePriority`](#middlewarepriority) | type | Execution order: `highest` runs first (outermost in the onion), `lowest` runs last, closest to the function. |
| [`pikkuAgentMiddleware`](#pikkuagentmiddleware) | function | Declares middleware for an agent run — hooks around the model call, its tool calls and the run's state. |
| [`pikkuChannelMiddleware`](#pikkuchannelmiddleware) | function | Declares middleware for a channel — it runs around the connection and its messages rather than around a single request. |
| [`PikkuChannelMiddleware`](#pikkuchannelmiddleware-2) | type | The shape of channel middleware — it runs around the connection and its messages rather than around a single request. |
| [`pikkuChannelMiddlewareFactory`](#pikkuchannelmiddlewarefactory) | function | Declares channel middleware that takes options, so one definition can be wired several times with different configuration. |
| [`pikkuMiddleware`](#pikkumiddleware) | function | Factory function for creating middleware with tree-shaking support. Supports both direct function and configuration object syntax. |
| [`PikkuMiddleware`](#pikkumiddleware-2) | type | Type-safe middleware definition that can access your application's services and session. Use this to define reusable middleware that can be applied to multiple wirings. |
| [`pikkuMiddlewareFactory`](#pikkumiddlewarefactory) | function | Factory function for creating middleware factories Use this when your middleware needs configuration/input parameters |
| [`requireOrigin`](#requireorigin) | function | Rejects a request with a 403 unless its `Origin` is this app's own or explicitly allowed. |

## Reference

### `addChannelMiddleware` {#addchannelmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Attaches channel middleware to every channel carrying the given tag, so the
channels themselves stay free of the wiring.

```typescript
addChannelMiddleware: (tag: string, middleware: PikkuChannelMiddleware[]) => CorePikkuChannelMiddleware[]
```

```typescript
addChannelMiddleware('orders', [tagChannelEvents('order-status')])
```

### `addGlobalMiddleware` {#addglobalmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Wire-agnostic global middleware. Runs at the top of every wiring's
middleware chain — before wire-, tag-, and function-level entries.

Resolution order: global -&gt; wire -&gt; tag -&gt; function.

```typescript
addGlobalMiddleware: (middleware: PikkuMiddleware[]) => void
```

```typescript
addGlobalMiddleware([telemetryMiddleware])
```

### `addHTTPMiddleware` {#addhttpmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers HTTP middleware either globally or for a specific route pattern.

When a string route pattern is provided along with middleware, the middleware
is applied only to that route. Otherwise, if an array is provided, it is treated
as global middleware (applied to all routes).

```typescript
addHTTPMiddleware: (routeOrMiddleware: PikkuMiddleware[] | string, middleware?: PikkuMiddleware[]) => void
```

```typescript
// Global middleware — applies to every HTTP route
addHTTPMiddleware('*', [
  async ({ logger }, data, next) => {
    const start = Date.now()
    await next()
    logger.info({ path: data.http?.request?.path(), ms: Date.now() - start })
  },
])

// Prefix middleware — applies only to /orders/*
addHTTPMiddleware('/orders', [
  async (_services, _data, next) => {
    // e.g. rate-limit order creation
    await next()
  },
])
```

### `addTagMiddleware` {#addtagmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Tag-scoped middleware. Applies to any wiring that carries the matching tag.

```typescript
addTagMiddleware: (tag: string, middleware: PikkuMiddleware[]) => void
```

```typescript
addTagMiddleware('checkout', [auditMiddleware('checkout')])
```

### `authAPIKey` {#authapikey}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/middleware`</span>

Reads an API key from the request and JWT-decodes it into a session. Leaves
an existing session alone, so it composes with other auth middleware.

```typescript
authAPIKey: CorePikkuMiddlewareFactory<{ source: "header" | "query" | "all"; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

<details>
<summary>Config keys (1)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `source` <sup>required</sup> | `"header" \| "query" \| "all"` | Where to look: the `x-api-key` header, the `apiKey` query param, or both. |

</details>

```typescript
/**
 * The ops integrations have no browser, so they cannot carry the Better Auth
 * cookie the storefront uses. Each of these leaves an existing session alone,
 * so they compose: the first one to recognise the caller wins and the rest
 * fall through.
 */
addHTTPMiddleware('/rpc', [
  authAPIKey({ source: 'header' }),
  authBearer({
    token: {
      secretId: 'OPS_API_TOKEN',
      userSession: { userId: 'ops-integration' },
    },
  }),
  authCookie({
    name: 'shop-session',
    options: { sameSite: 'lax' },
    expiresIn: { value: 7, unit: 'day' },
  }),
])
```

### `authBearer` {#authbearer}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/middleware`</span>

Validates a bearer token: JWT-decoded by default, or compared in constant
time against a static `value` or a `secretId` resolved through the secrets
service per request.

```typescript
authBearer: CorePikkuMiddlewareFactory<{ token?: { value: string; userSession: CoreUserSession; } | { secretId: string; userSession: CoreUserSession; }; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

<details>
<summary>Config keys (1)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `token` | `{ value: string; userSession: CoreUserSession; } \| { secretId: string; userSession: CoreU…` | Omit to JWT-decode the token. Set it to accept one fixed token instead, matched in constant time. |

</details>

```typescript
/**
 * The ops integrations have no browser, so they cannot carry the Better Auth
 * cookie the storefront uses. Each of these leaves an existing session alone,
 * so they compose: the first one to recognise the caller wins and the rest
 * fall through.
 */
addHTTPMiddleware('/rpc', [
  authAPIKey({ source: 'header' }),
  authBearer({
    token: {
      secretId: 'OPS_API_TOKEN',
      userSession: { userId: 'ops-integration' },
    },
  }),
  authCookie({
    name: 'shop-session',
    options: { sameSite: 'lax' },
    expiresIn: { value: 7, unit: 'day' },
  }),
])
```

### `authCookie` {#authcookie}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/middleware`</span>

Reads a JWT session from a cookie, and re-issues the cookie after the
request whenever the session changed (e.g. after login).

```typescript
authCookie: CorePikkuMiddlewareFactory<{ name: string; options: SerializeOptions; expiresIn: RelativeTimeInput; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

<details>
<summary>Config keys (3)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `expiresIn` <sup>required</sup> | `RelativeTimeInput` | How long the re-issued cookie lives, as a relative time such as `'7d'`. |
| `name` <sup>required</sup> | `string` | Cookie name to read and write. |
| `options` <sup>required</sup> | `SerializeOptions` | Serialize options merged over the defaults, which are httpOnly and sameSite lax. |

</details>

```typescript
/**
 * The ops integrations have no browser, so they cannot carry the Better Auth
 * cookie the storefront uses. Each of these leaves an existing session alone,
 * so they compose: the first one to recognise the caller wins and the rest
 * fall through.
 */
addHTTPMiddleware('/rpc', [
  authAPIKey({ source: 'header' }),
  authBearer({
    token: {
      secretId: 'OPS_API_TOKEN',
      userSession: { userId: 'ops-integration' },
    },
  }),
  authCookie({
    name: 'shop-session',
    options: { sameSite: 'lax' },
    expiresIn: { value: 7, unit: 'day' },
  }),
])
```

### `cors` {#cors}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/middleware`</span>

Sets CORS headers on every response and short-circuits OPTIONS preflight
with a 204. `origin: true` reflects the request origin; an array reflects a
matching origin and otherwise sends no `Access-Control-Allow-Origin` at all,
so the browser reports "origin not allowed" rather than an origin mismatch
against whichever entry happened to be first.

```typescript
cors: CorePikkuMiddlewareFactory<{ origin?: string | string[] | true; methods?: string[]; headers?: string[]; exposeHeaders?: string[]; credentials?: boolean; maxAge?: number; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

<details>
<summary>Config keys (6)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `credentials` | `boolean` | Whether cookies and auth headers ride along. Requires a named origin, never `*`. |
| `exposeHeaders` | `string[]` | Response headers the browser will let the caller's JavaScript read. Everything else is hidden from it even on a 200. |
| `headers` | `string[]` | Request headers a caller may send. Defaults to content-type, authorization and x-api-key. |
| `maxAge` | `number` | Seconds the browser may cache this preflight. Defaults to a day. |
| `methods` | `string[]` | Methods a cross-origin caller may use. Defaults to the common six; a method missing here fails preflight rather than the request. |
| `origin` | `string \| true \| string[]` | Which origins may call. Defaults to `*`, which the browser rejects alongside `credentials: true` — name the origins instead. |

</details>

```typescript
const corsMiddleware = pikkuMiddleware(
  async ({ variables, ...services }, { http, ...wire }, next) => {
    const middleware = cors({
      origin: await allowedOrigins(variables),
      credentials: true,
      headers: ['Content-Type', 'Authorization', 'X-Auth-Return-Redirect'],
    })
    // Both parameters are destructured and reassembled because the inspector
    // fails the build on an undestructured one (PKU410/PKU411, critical). The
    // delegate reads only `http` and no service at all.
    await middleware({ variables, ...services }, { http, ...wire }, next)
  }
)

addHTTPMiddleware('*', [corsMiddleware])
```

### `MiddlewarePriority` {#middlewarepriority}

<span className="api-symbol-meta">type · re-exported from `@pikku/core/middleware`</span>

Execution order: `highest` runs first (outermost in the onion), `lowest`
runs last, closest to the function.

### `pikkuAgentMiddleware` {#pikkuagentmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares middleware for an agent run — hooks around the model call, its tool
calls and the run's state.

```typescript
pikkuAgentMiddleware: <State extends Record<string, unknown> = Record<string, unknown>, RequiredServices extends SingletonServices = WiredSingletonServices>(hooks: PikkuAgentMiddlewareHooks<State, RequiredServices>) => PikkuAgentMiddlewareHooks<State, RequiredServices>
```

<details>
<summary>Config keys (7)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `afterStep` | `((services: RequiredServices, ctx: { stepNumber: number; text: string; toolCalls: { toolC…` | Runs at the end of each model turn. For observation — it cannot change what happened. |
| `afterToolCall` | `((services: RequiredServices, ctx: { toolName: string; toolCallId: string; args: Record<s…` | Runs once a tool has returned, and may replace its result before the model sees it. |
| `beforeToolCall` | `((services: RequiredServices, ctx: { toolName: string; toolCallId: string; args: Record<s…` | Runs before a tool executes, and may rewrite the arguments the model chose. Returning nothing leaves them as they are. |
| `modifyInput` | `((services: RequiredServices, ctx: { messages: AgentMessage[]; instructions: string; shar…` | Rewrites what the model is about to see — messages and instructions — before each turn. |
| `modifyOutput` | `((services: RequiredServices, ctx: { text: string; messages: AgentMessage[]; usage: { inp…` | Rewrites the finished output of a turn, after streaming has completed. |
| `modifyOutputStream` | `((services: RequiredServices, ctx: { event: AgentStreamEvent; allEvents: readonly AgentSt…` | Sees the model's output as it streams, for redaction or live inspection. Keeps its own `state` across chunks, unlike the shared run notes. |
| `onError` | `((services: RequiredServices, ctx: { error: Error; stepNumber: number; messages: AgentMes…` | Runs when a turn throws, with the step it failed on. For logging and cleanup; it does not swallow the error. |

</details>

```typescript
export const countAgentCharacters = pikkuAgentMiddleware<{
  charCount: number
}>({
  modifyInput: async ({ logger }, { messages, instructions }) => {
    logger.info({ event: 'agent_input', messages: messages.length })
    return { messages, instructions }
  },
  modifyOutputStream: async (_services, { event, state }) => {
    if (event.type === 'text-delta') {
      state.charCount = (state.charCount ?? 0) + event.text.length
    }
    return event
  },
})
```

### `pikkuChannelMiddleware` {#pikkuchannelmiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares middleware for a channel — it runs around the connection and its
messages rather than around a single request.

```typescript
pikkuChannelMiddleware: <RequiredServices extends Services = Services, Event = unknown>(middleware: PikkuChannelMiddleware<RequiredServices, Event>) => PikkuChannelMiddleware<RequiredServices, Event>
```

```typescript
export const traceAgentStream = pikkuChannelMiddleware<any, AgentStreamEvent>(
  async ({ logger }, event, next) => {
    logger.debug({ event: 'agent_stream', type: event.type })
    await next(event)
  }
)
```

### `PikkuChannelMiddleware` {#pikkuchannelmiddleware-2}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

The shape of channel middleware — it runs around the connection and its
messages rather than around a single request.

```typescript
PikkuChannelMiddleware: PikkuChannelMiddleware<RequiredServices, Event>
```

### `pikkuChannelMiddlewareFactory` {#pikkuchannelmiddlewarefactory}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares channel middleware that takes options, so one definition can be
wired several times with different configuration.

```typescript
pikkuChannelMiddlewareFactory: <In = any>(factory: CorePikkuChannelMiddlewareFactory<In>) => CorePikkuChannelMiddlewareFactory<In>
```

```typescript
export const tagChannelEvents = pikkuChannelMiddlewareFactory(
  (channelName: string) =>
    async ({ logger }, event, next) => {
      logger.debug({ event: 'channel_event', channel: channelName })
      await next(event)
    }
)
```

### `pikkuMiddleware` {#pikkumiddleware}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Factory function for creating middleware with tree-shaking support.
Supports both direct function and configuration object syntax.

```typescript
pikkuMiddleware: <RequiredServices extends SingletonServices = WiredSingletonServices>(middleware: PikkuMiddleware<RequiredServices> | PikkuMiddlewareConfig<RequiredServices>) => PikkuMiddleware<RequiredServices>
```

```typescript
// Direct function syntax
const middleware = pikkuMiddleware(({ logger }, wires, next) => {
  logger.info('Middleware executed')
  await next()
})

// Configuration object syntax with metadata
const logMiddleware = pikkuMiddleware({
  name: 'Request Logger',
  description: 'Logs all incoming requests',
  priority: 'high',
  func: async ({ logger }, wires, next) => {
    logger.info('Request started')
    await next()
  }
})
```

### `PikkuMiddleware` {#pikkumiddleware-2}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Type-safe middleware definition that can access your application's services and session.
Use this to define reusable middleware that can be applied to multiple wirings.

```typescript
PikkuMiddleware: PikkuMiddleware<RequiredServices>
```

### `pikkuMiddlewareFactory` {#pikkumiddlewarefactory}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Factory function for creating middleware factories
Use this when your middleware needs configuration/input parameters

```typescript
pikkuMiddlewareFactory: <In = any>(factory: (input: In) => PikkuMiddleware) => ((input: In) => PikkuMiddleware)
```

```typescript
export const auditMiddleware = pikkuMiddlewareFactory(
  (action: string) =>
    async ({ logger }, _data, next) => {
      const start = Date.now()
      const result = await next()
      logger.info({ event: 'audit', action, ms: Date.now() - start })
      return result
    }
)
```

### `requireOrigin` {#requireorigin}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/middleware`</span>

Rejects a request with a 403 unless its `Origin` is this app's own or explicitly allowed.

This is not what `cors()` does. CORS sets response headers and is enforced by the
browser, so a non-browser client ignores them and the request still runs; this rejects
before the function body. It stops another site's page from posting to an unauthed
route — it is not flood control, because `Origin` is trusted from nobody but a browser.
A missing `Origin` is rejected too: a real browser sets one on a cross-origin-capable POST.

```typescript
requireOrigin: CorePikkuMiddlewareFactory<{ origins?: string[] | ((services: CoreSingletonServices) => string[] | Promise<string[]>); }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

<details>
<summary>Config keys (1)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `origins` | `string[] \| ((services: CoreSingletonServices) => string[] \| Promise<string[]>)` | Extra allowed origins beyond the request's own host, or a resolver for them. |

</details>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/middleware` — same 17 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc middleware` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
