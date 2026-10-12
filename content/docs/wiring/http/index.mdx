---
sidebar_position: 0
title: HTTP Routes
description: Connecting functions to HTTP endpoints
---

# HTTP Routes

HTTP routes are how you connect your Pikku functions to the web. Once you've written your domain functions, you wire them to HTTP endpoints - turning them into REST APIs that can be called from browsers, mobile apps, or any HTTP client.

Your functions don't need to know they're being called via HTTP (but you can access the HTTP object if you like). They just receive data, do their work, and return results. Pikku handles all the HTTP-specific details like status codes, headers, request parsing, and error responses.

## Your First HTTP Route

Let's wire a function to an HTTP endpoint:

```typescript @snippet wa-http-first-function
```

```typescript @snippet wa-http-first-wire
```

That's it! Your function is now available at `GET /books/:bookId`. Pikku automatically:
- Extracts `:bookId` from the URL path
- Merges it with any query parameters
- Validates the data against your function's input type
- Calls your function with the clean, typed data
- Converts the result to a JSON response
- Maps any errors to appropriate HTTP status codes

## Wiring Configuration

The `wireHTTP` function accepts a configuration object with all routing options:

```typescript @snippet wa-http-wiring-config
```

Let's break down each option:

### Method

The HTTP method for this route: one of `get`, `post`, `put`, `patch`, `delete`, `head` or `options`.

The HTTP method for this route.

### Route

Route patterns use path parameters with `:` syntax:

```typescript @snippet wa-http-route-params
```

### Func

The Pikku function to call when this route is matched. Import from your `*.function.ts` files.

### Auth

Override the function's default authentication requirement:

```typescript @snippet wa-http-public-route
```

By default, functions require authentication (`auth: true`).

### Permissions

Authorization is not a wiring concern. Declare permissions on the function definition itself:

```typescript @snippet wa-http-permissions
```

For an app-wide baseline every function must also pass, use `addGlobalPermission`. See [Permission Guards](/docs/core-features/permission-guards) for details.

### Middleware

Attach middleware that runs specifically for this wire:

```typescript @snippet wa-http-wire-middleware
```

You can also apply middleware globally or to route patterns:

```typescript @snippet wa-http-global-pattern-middleware
```

Middleware runs in this order:
1. Global HTTP middleware
2. Route-pattern middleware (`/admin/*`)
3. Tag-based middleware
4. Wire-specific middleware (defined in `wireHTTP`)
5. Function-level middleware

See [Middleware](/docs/core-features/middleware) for more details.

### SSE (Server-Sent Events)

Enable Server-Sent Events for GET routes:

```typescript @snippet wa-http-sse-flag
```

Your function can then send incremental updates through the `channel` object on the third (wire) argument: `async (_services, data, { channel }) => ...`. See [Server-Sent Events](/docs/wiring/http/server-sent-events) for more details.

## How Data Flows

Pikku automatically merges data from multiple sources into a single, typed input for your function:

```typescript @snippet wa-http-data-flow-get
```

For POST/PUT/PATCH requests, body data is also merged:

```typescript @snippet wa-http-data-flow-post
```

If the same parameter appears in multiple places (path, query, body), they must all have the same value - otherwise Pikku throws a validation error to prevent ambiguity.

:::note
This means data sent as an array in a body will be passed in as `data.data`, since the query keys will live on the top-most object. The same applies to ArrayBuffers.
:::

## Error Handling

Pikku automatically maps errors to HTTP status codes. You can use built-in errors or create custom ones:

```typescript @snippet wa-http-custom-error
```

Now use your custom error in functions:

```typescript @snippet wa-http-error-usage
```

See [Errors](/docs/core-features/errors) for more on error handling.

## Next Steps

- [Route Groups](/docs/wiring/http/route-groups) - Composable route contracts with `defineHTTPRoutes` / `wireHTTPRoutes`
- [Global HTTP Middleware and Permissions](/docs/wiring/http/router)
- [Server-Sent Events](/docs/wiring/http/server-sent-events)
- [OpenAPI Documentation](/docs/wiring/http/openapi)
- [CORS Configuration](/docs/wiring/http/cors)
- [Fetch Client](/docs/wiring/http/fetch-client) - Type-safe HTTP client generation
- [`#pikku/http` in the SDK explorer](/api#app/http) - every export on the HTTP door
