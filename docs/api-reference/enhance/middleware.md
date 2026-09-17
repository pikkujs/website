---
title: '#pikku/middleware'
sidebar_label: '#pikku/middleware'
sidebar_position: 3
description: 'Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or aga…'
paper: true
---

# `#pikku/middleware`

Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or against an HTTP route or channel.

```typescript
import { addChannelMiddleware, addGlobalMiddleware, addHTTPMiddleware } from '#pikku/middleware'
```

## Exports

<ApiExports items={[{"name":"addChannelMiddleware","kind":"function","anchor":"addchannelmiddleware","summary":"Attaches channel middleware to every channel carrying the given tag, so the channels themselves stay free of the wiring."},{"name":"addGlobalMiddleware","kind":"function","anchor":"addglobalmiddleware","summary":"Wire-agnostic global middleware. Runs at the top of every wiring's middleware chain — before wire-, tag-, and function-level entries."},{"name":"addHTTPMiddleware","kind":"function","anchor":"addhttpmiddleware","summary":"Registers HTTP middleware either globally or for a specific route pattern."},{"name":"addTagMiddleware","kind":"function","anchor":"addtagmiddleware","summary":"Tag-scoped middleware. Applies to any wiring that carries the matching tag."},{"name":"authAPIKey","kind":"function","anchor":"authapikey","summary":"Reads an API key from the request and JWT-decodes it into a session. Leaves an existing session alone, so it composes with other auth middleware."},{"name":"authBearer","kind":"function","anchor":"authbearer","summary":"Validates a bearer token: JWT-decoded by default, or compared in constant time against a static value or a secretId resolved through the secrets service per request."},{"name":"authCookie","kind":"function","anchor":"authcookie","summary":"Reads a JWT session from a cookie, and re-issues the cookie after the request whenever the session changed (e.g. after login)."},{"name":"cors","kind":"function","anchor":"cors","summary":"Sets CORS headers on every response and short-circuits OPTIONS preflight with a 204. origin: true reflects the request origin; an array reflects a matching origin and otherwise sends no Access-Control-Allow-Origin at all, so the browser reports \"origin not allowed\" rather than an origin mismatch against whichever entry happened to be first."},{"name":"MiddlewarePriority","kind":"type","anchor":"middlewarepriority","summary":"Execution order: highest runs first (outermost in the onion), lowest runs last, closest to the function."},{"name":"pikkuAgentMiddleware","kind":"function","anchor":"pikkuagentmiddleware","summary":"Declares middleware for an agent run — hooks around the model call, its tool calls and the run's state."},{"name":"pikkuChannelMiddleware","kind":"function","anchor":"pikkuchannelmiddleware","summary":"Declares middleware for a channel — it runs around the connection and its messages rather than around a single request."},{"name":"PikkuChannelMiddleware","kind":"type","anchor":"pikkuchannelmiddleware-2","summary":"The shape of channel middleware — it runs around the connection and its messages rather than around a single request."},{"name":"pikkuChannelMiddlewareFactory","kind":"function","anchor":"pikkuchannelmiddlewarefactory","summary":"Declares channel middleware that takes options, so one definition can be wired several times with different configuration."},{"name":"pikkuMiddleware","kind":"function","anchor":"pikkumiddleware","summary":"Factory function for creating middleware with tree-shaking support. Supports both direct function and configuration object syntax."},{"name":"PikkuMiddleware","kind":"type","anchor":"pikkumiddleware-2","summary":"Type-safe middleware definition that can access your application's services and session. Use this to define reusable middleware that can be applied to multiple wirings."},{"name":"pikkuMiddlewareFactory","kind":"function","anchor":"pikkumiddlewarefactory","summary":"Factory function for creating middleware factories Use this when your middleware needs configuration/input parameters"},{"name":"requireOrigin","kind":"function","anchor":"requireorigin","summary":"Rejects a request with a 403 unless its Origin is this app's own or explicitly allowed."}]} />

## Reference

<ApiSymbol>

### `addChannelMiddleware` {#addchannelmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Attaches channel middleware to every channel carrying the given tag, so the
channels themselves stay free of the wiring.

</ApiSection>

<ApiSection label="Signature">

```typescript
addChannelMiddleware: (tag: string, middleware: PikkuChannelMiddleware[]) => CorePikkuChannelMiddleware[]
```

</ApiSection>

<ApiSection label="Example">

```typescript
addChannelMiddleware('orders', [tagChannelEvents('order-status')])
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `addGlobalMiddleware` {#addglobalmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Wire-agnostic global middleware. Runs at the top of every wiring's
middleware chain — before wire-, tag-, and function-level entries.

Resolution order: global -&gt; wire -&gt; tag -&gt; function.

</ApiSection>

<ApiSection label="Signature">

```typescript
addGlobalMiddleware: (middleware: PikkuMiddleware[]) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
addGlobalMiddleware([telemetryMiddleware])
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `addHTTPMiddleware` {#addhttpmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Registers HTTP middleware either globally or for a specific route pattern.

When a string route pattern is provided along with middleware, the middleware
is applied only to that route. Otherwise, if an array is provided, it is treated
as global middleware (applied to all routes).

</ApiSection>

<ApiSection label="Signature">

```typescript
addHTTPMiddleware: (routeOrMiddleware: PikkuMiddleware[] | string, middleware?: PikkuMiddleware[]) => void
```

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `addTagMiddleware` {#addtagmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Tag-scoped middleware. Applies to any wiring that carries the matching tag.

</ApiSection>

<ApiSection label="Signature">

```typescript
addTagMiddleware: (tag: string, middleware: PikkuMiddleware[]) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
addTagMiddleware('checkout', [auditMiddleware('checkout')])
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `authAPIKey` {#authapikey}

<ApiMeta kind="function" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Reads an API key from the request and JWT-decodes it into a session. Leaves
an existing session alone, so it composes with other auth middleware.

</ApiSection>

<ApiSection label="Signature">

```typescript
authAPIKey: CorePikkuMiddlewareFactory<{ source: "header" | "query" | "all"; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

</ApiSection>

<ApiSection label="Config keys (1)">

| Key | Type | What it does |
| --- | --- | --- |
| `source` <sup>required</sup> | `"header" \| "query" \| "all"` | Where to look: the `x-api-key` header, the `apiKey` query param, or both. |

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `authBearer` {#authbearer}

<ApiMeta kind="function" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Validates a bearer token: JWT-decoded by default, or compared in constant
time against a static `value` or a `secretId` resolved through the secrets
service per request.

</ApiSection>

<ApiSection label="Signature">

```typescript
authBearer: CorePikkuMiddlewareFactory<{ token?: { value: string; userSession: CoreUserSession; } | { secretId: string; userSession: CoreUserSession; }; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

</ApiSection>

<ApiSection label="Config keys (1)">

| Key | Type | What it does |
| --- | --- | --- |
| `token` | `{ value: string; userSession: CoreUserSession; } \| { secretId: string; userSession: CoreU…` | Omit to JWT-decode the token. Set it to accept one fixed token instead, matched in constant time. |

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `authCookie` {#authcookie}

<ApiMeta kind="function" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Reads a JWT session from a cookie, and re-issues the cookie after the
request whenever the session changed (e.g. after login).

</ApiSection>

<ApiSection label="Signature">

```typescript
authCookie: CorePikkuMiddlewareFactory<{ name: string; options: SerializeOptions; expiresIn: RelativeTimeInput; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

</ApiSection>

<ApiSection label="Config keys (3)">

| Key | Type | What it does |
| --- | --- | --- |
| `expiresIn` <sup>required</sup> | `RelativeTimeInput` | How long the re-issued cookie lives, as a relative time such as `'7d'`. |
| `name` <sup>required</sup> | `string` | Cookie name to read and write. |
| `options` <sup>required</sup> | `SerializeOptions` | Serialize options merged over the defaults, which are httpOnly and sameSite lax. |

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `cors` {#cors}

<ApiMeta kind="function" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Sets CORS headers on every response and short-circuits OPTIONS preflight
with a 204. `origin: true` reflects the request origin; an array reflects a
matching origin and otherwise sends no `Access-Control-Allow-Origin` at all,
so the browser reports "origin not allowed" rather than an origin mismatch
against whichever entry happened to be first.

</ApiSection>

<ApiSection label="Signature">

```typescript
cors: CorePikkuMiddlewareFactory<{ origin?: string | string[] | true; methods?: string[]; headers?: string[]; exposeHeaders?: string[]; credentials?: boolean; maxAge?: number; }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

</ApiSection>

<ApiSection label="Config keys (6)">

| Key | Type | What it does |
| --- | --- | --- |
| `credentials` | `boolean` | Whether cookies and auth headers ride along. Requires a named origin, never `*`. |
| `exposeHeaders` | `string[]` | Response headers the browser will let the caller's JavaScript read. Everything else is hidden from it even on a 200. |
| `headers` | `string[]` | Request headers a caller may send. Defaults to content-type, authorization and x-api-key. |
| `maxAge` | `number` | Seconds the browser may cache this preflight. Defaults to a day. |
| `methods` | `string[]` | Methods a cross-origin caller may use. Defaults to the common six; a method missing here fails preflight rather than the request. |
| `origin` | `string \| true \| string[]` | Which origins may call. Defaults to `*`, which the browser rejects alongside `credentials: true` — name the origins instead. |

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `MiddlewarePriority` {#middlewarepriority}

<ApiMeta kind="type" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Execution order: `highest` runs first (outermost in the onion), `lowest`
runs last, closest to the function.

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuAgentMiddleware` {#pikkuagentmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Declares middleware for an agent run — hooks around the model call, its tool
calls and the run's state.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuAgentMiddleware: <State extends Record<string, unknown> = Record<string, unknown>, RequiredServices extends SingletonServices = WiredSingletonServices>(hooks: PikkuAgentMiddlewareHooks<State, RequiredServices>) => PikkuAgentMiddlewareHooks<State, RequiredServices>
```

</ApiSection>

<ApiSection label="Config keys (7)">

| Key | Type | What it does |
| --- | --- | --- |
| `afterStep` | `((services: RequiredServices, ctx: { stepNumber: number; text: string; toolCalls: { toolC…` | Runs at the end of each model turn. For observation — it cannot change what happened. |
| `afterToolCall` | `((services: RequiredServices, ctx: { toolName: string; toolCallId: string; args: Record<s…` | Runs once a tool has returned, and may replace its result before the model sees it. |
| `beforeToolCall` | `((services: RequiredServices, ctx: { toolName: string; toolCallId: string; args: Record<s…` | Runs before a tool executes, and may rewrite the arguments the model chose. Returning nothing leaves them as they are. |
| `modifyInput` | `((services: RequiredServices, ctx: { messages: AgentMessage[]; instructions: string; shar…` | Rewrites what the model is about to see — messages and instructions — before each turn. |
| `modifyOutput` | `((services: RequiredServices, ctx: { text: string; messages: AgentMessage[]; usage: { inp…` | Rewrites the finished output of a turn, after streaming has completed. |
| `modifyOutputStream` | `((services: RequiredServices, ctx: { event: AgentStreamEvent; allEvents: readonly AgentSt…` | Sees the model's output as it streams, for redaction or live inspection. Keeps its own `state` across chunks, unlike the shared run notes. |
| `onError` | `((services: RequiredServices, ctx: { error: Error; stepNumber: number; messages: AgentMes…` | Runs when a turn throws, with the step it failed on. For logging and cleanup; it does not swallow the error. |

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuChannelMiddleware` {#pikkuchannelmiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Declares middleware for a channel — it runs around the connection and its
messages rather than around a single request.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuChannelMiddleware: <RequiredServices extends Services = Services, Event = unknown>(middleware: PikkuChannelMiddleware<RequiredServices, Event>) => PikkuChannelMiddleware<RequiredServices, Event>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const traceAgentStream = pikkuChannelMiddleware<any, AgentStreamEvent>(
  async ({ logger }, event, next) => {
    logger.debug({ event: 'agent_stream', type: event.type })
    await next(event)
  }
)
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `PikkuChannelMiddleware` {#pikkuchannelmiddleware-2}

<ApiMeta kind="type" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

The shape of channel middleware — it runs around the connection and its
messages rather than around a single request.

</ApiSection>

<ApiSection label="Signature">

```typescript
PikkuChannelMiddleware: PikkuChannelMiddleware<RequiredServices, Event>
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuChannelMiddlewareFactory` {#pikkuchannelmiddlewarefactory}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Declares channel middleware that takes options, so one definition can be
wired several times with different configuration.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuChannelMiddlewareFactory: <In = any>(factory: CorePikkuChannelMiddlewareFactory<In>) => CorePikkuChannelMiddlewareFactory<In>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const tagChannelEvents = pikkuChannelMiddlewareFactory(
  (channelName: string) =>
    async ({ logger }, event, next) => {
      logger.debug({ event: 'channel_event', channel: channelName })
      await next(event)
    }
)
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuMiddleware` {#pikkumiddleware}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Factory function for creating middleware with tree-shaking support.
Supports both direct function and configuration object syntax.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuMiddleware: <RequiredServices extends SingletonServices = WiredSingletonServices>(middleware: PikkuMiddleware<RequiredServices> | PikkuMiddlewareConfig<RequiredServices>) => PikkuMiddleware<RequiredServices>
```

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `PikkuMiddleware` {#pikkumiddleware-2}

<ApiMeta kind="type" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Type-safe middleware definition that can access your application's services and session.
Use this to define reusable middleware that can be applied to multiple wirings.

</ApiSection>

<ApiSection label="Signature">

```typescript
PikkuMiddleware: PikkuMiddleware<RequiredServices>
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuMiddlewareFactory` {#pikkumiddlewarefactory}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Factory function for creating middleware factories
Use this when your middleware needs configuration/input parameters

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuMiddlewareFactory: <In = any>(factory: (input: In) => PikkuMiddleware) => ((input: In) => PikkuMiddleware)
```

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `requireOrigin` {#requireorigin}

<ApiMeta kind="function" origin="re-exported from @pikku/core/middleware" />

<ApiSection label="Description">

Rejects a request with a 403 unless its `Origin` is this app's own or explicitly allowed.

This is not what `cors()` does. CORS sets response headers and is enforced by the
browser, so a non-browser client ignores them and the request still runs; this rejects
before the function body. It stops another site's page from posting to an unauthed
route — it is not flood control, because `Origin` is trusted from nobody but a browser.
A missing `Origin` is rejected too: a real browser sets one on a cross-origin-capable POST.

</ApiSection>

<ApiSection label="Signature">

```typescript
requireOrigin: CorePikkuMiddlewareFactory<{ origins?: string[] | ((services: CoreSingletonServices) => string[] | Promise<string[]>); }, CoreSingletonServices<{ logLevel?: LogLevel; secrets?: { requireAllowedHosts?: boolean; }; workflow?: WorkflowServiceConfig; webhook?: WebhookServiceConfig; postgres?: PostgresConfig; }>, CoreUserSession>
```

</ApiSection>

<ApiSection label="Config keys (1)">

| Key | Type | What it does |
| --- | --- | --- |
| `origins` | `string[] \| ((services: CoreSingletonServices) => string[] \| Promise<string[]>)` | Extra allowed origins beyond the request's own host, or a resolver for them. |

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/middleware` — same 17 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc middleware` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
