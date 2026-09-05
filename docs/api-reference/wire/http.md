---
title: '#pikku/http'
sidebar_label: '#pikku/http'
sidebar_position: 4
description: 'Wires a function to an HTTP route, with the path parameters checked against the function input.'
---

# `#pikku/http`

Wires a function to an HTTP route, with the path parameters checked against the function input.

```typescript
import { defineHTTPRoutes, wireHTTP, wireHTTPRoutes } from '#pikku/http'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`defineHTTPRoutes`](#definehttproutes) | function | Type-safe helper for defining route contracts that can be composed. |
| [`wireHTTP`](#wirehttp) | function | Registers an HTTP wiring with the Pikku framework. |
| [`wireHTTPRoutes`](#wirehttproutes) | function | Wires multiple HTTP routes from a nested map or array configuration. |

## Reference

### `defineHTTPRoutes` {#definehttproutes}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Type-safe helper for defining route contracts that can be composed.

```typescript
defineHTTPRoutes: { <T extends TypedHTTPRouteMap>(routes: T): TypedHTTPRouteContract<T>; <T extends TypedHTTPRouteMap>(config: TypedHTTPRoutesGroupConfig & { routes: T; }): TypedHTTPRouteContract<T>; }
```

```typescript
export const shopRoutes = defineHTTPRoutes({
  auth: false,
  routes: {
    // Categories
    listCategories: {
      method: 'get',
      route: '/categories',
      func: listCategories,
    },
    createCategory: {
      method: 'post',
      route: '/categories',
      func: createCategory,
      auth: true,
    },

    // Items
    listItems: { method: 'get', route: '/items', func: listItems },
    getItem: { method: 'get', route: '/items/:itemId', func: getItem },
    createItem: {
      method: 'post',
      route: '/items',
      func: createItem,
      auth: true,
    },
    updateItem: {
      method: 'patch',
      route: '/items/:itemId',
      func: updateItem,
      auth: true,
    },

    // Account
    getProfile: {
      method: 'get',
      route: '/profile',
      func: getProfile,
      auth: true,
    },

    // Basket (sessionless — works for guests too)
    getBasket: { method: 'get', route: '/basket', func: getBasket },
    addToBasket: { method: 'post', route: '/basket/items', func: addToBasket },
    removeFromBasket: {
      method: 'delete',
      route: '/basket/items/:itemId',
      func: removeFromBasket,
    },

    // Orders (require auth)
    createOrder: {
      method: 'post',
      route: '/orders',
      func: createOrder,
      auth: true,
    },
    listOrders: {
      method: 'get',
      route: '/orders',
      func: listOrders,
      auth: true,
    },
    getOrder: {
      method: 'get',
      route: '/orders/:orderId',
      func: getOrder,
      auth: true,
    },
    cancelOrder: {
      method: 'post',
      route: '/orders/:orderId/cancel',
      func: cancelOrder,
      auth: true,
    },
  },
})
```

### `wireHTTP` {#wirehttp}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers an HTTP wiring with the Pikku framework.

```typescript
wireHTTP: <In, Out, Route extends string>(httpWiring: HTTPWiring<In, Out, Route> & AssertHTTPWiringParams<In, Route>) => void
```

<details>
<summary>Config keys (11)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `boolean` | Whether reaching this route requires a session. Defaults to true — a route is closed unless it says otherwise. |
| `contentType` | `"xml" \| "json"` | How the body is serialised. Defaults to JSON; `xml` is for routes a caller you do not control insists on. |
| `func` <sup>required</sup> | `CorePikkuFunctionConfig<PikkuFunction<In, Out, "rpc" \| "session">, PikkuPermission<In>, P…` | The function to run. It is handed the session this route required. On an open route there is no session, so this must be a sessionless function. |
| `headers` | `HTTPHeadersSchema` | A schema the request headers are validated against, so a missing or malformed header fails before the function body runs. |
| `method` <sup>required</sup> | `"post" \| "get" \| "delete" \| "patch" \| "head" \| "put" \| "options"` | The HTTP method. A route and method together address one wiring. |
| `middleware` | `PikkuMiddleware[]` | Wraps every request to this route: auth, tracing, rate limiting. Runs before the permissions on `func`. |
| `returnsJSON` | `false` | Sends the returned value as-is rather than JSON-encoding it, for a route whose body is binary or already serialised. |
| `route` <sup>required</sup> | `string` | The path this wiring answers on. `:name` marks a parameter, and every parameter in the path must be a key of the function's input schema — a mismatch is a compile error rather than a 404 at runtime. |
| `sse` | `boolean` | Streams the response as server-sent events instead of returning it once. GET only. |
| `tags` | `string[]` | Filters this route in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `timeout` | `number` | Seconds before the request is abandoned. Work that can outlast a request should be dispatched instead, not given a longer timeout. |

</details>

```typescript
// Wire a single route — good for one-offs
wireHTTP({
  method: 'get',
  route: '/items/:itemId',
  func: getItem,
  auth: false,
})
```

### `wireHTTPRoutes` {#wirehttproutes}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Wires multiple HTTP routes from a nested map or array configuration.

```typescript
wireHTTPRoutes: (config: TypedWireHTTPRoutesConfig) => void
```

```typescript
wireHTTPRoutes({ routes: { shop: shopRoutes } })
```

## Inside an addon

Addon authors import this door as `#pikku/addon/http`, with one difference:

- Not available: `wireHTTP`, `wireHTTPRoutes` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc http` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
