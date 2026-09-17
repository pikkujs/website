---
sidebar_position: 4
title: Pikku Fetch
description: Pikku Fetch
---

Pikku can generate a typed HTTP client for your `wireHTTP` routes. It is a thin wrapper around `fetch` with compile-time route, input and output types, and no client-side dependencies.

![Pikku Client](/img/pikku-fetch.gif)

### Generating the client

Point `clientFiles.fetchFile` at the file you want generated, then run the CLI:

```json title="pikku.config.json"
{
  "clientFiles": {
    "fetchFile": ".pikku/pikku-fetch.gen.ts"
  }
}
```

```bash
npx pikku fetch
```

The route types the wrapper imports come from the HTTP map, so run `npx pikku` (the default `all` command) to generate both together; `npx pikku fetch` regenerates just the wrapper.

The generated file exports two things:

- `PikkuFetch` — a class extending `CorePikkuFetch` (`@pikku/fetch`) with a typed method per HTTP verb
- `pikkuFetch` — a ready-made instance of it

With the `fetchFile` above, the generated file is importable as `#pikku/pikku-fetch.gen.js`.

### Using it directly

```typescript
import { pikkuFetch } from '#pikku/pikku-fetch.gen.js'

pikkuFetch.setServerUrl('http://localhost:4002')

const todos = await pikkuFetch.get('/todos', { userId: 'user1' })
const todo = await pikkuFetch.post('/todos', {
  title: 'The Pikku Guide',
  priority: 'high',
  userId: 'user1',
})
const completed = await pikkuFetch.post('/todos/:id/complete', { id: todo.id })
await pikkuFetch.delete('/todos/:id', { id: todo.id })
```

The first argument is the route pattern as written in `wireHTTP` (including `:params`). The data argument carries path params, query params and the body merged into one object — the same shape the function receives.

### Methods

| Method | Description |
|--------|-------------|
| `get`, `post`, `patch`, `head`, `delete` | Typed call for that verb, returns the parsed output |
| `fetch(route, method, data, options?)` | Raw request, returns the `Response` |
| `api(route, method, data, options?)` | Parsed JSON response |
| `setServerUrl(url)` / `getServerUrl()` | Base URL used for every request |
| `setAuthorizationJWT(jwt \| null)` | Sends `Authorization: Bearer <jwt>` |
| `setAPIKey(key \| null)` | Sends `X-API-KEY` |
| `setHeader(name, value \| null)` | Sets or clears an arbitrary request header |
| `uploadFile(uploadInfo, body, contentType?)` | Uploads to a URL returned by `getUploadURL` |
| `subscribeToSSE(path, handler, onError?)` | Opens an event stream and calls `handler` per event |

Non-2xx responses throw a `PikkuFetchError` (from `@pikku/fetch`) carrying the status, the parsed server error and the raw `Response`.

### Using it with React

In a React app, pass the class to `createPikku` from `@pikku/react` so the fetch instance is shared by the RPC and realtime clients:

```tsx
import { createPikku, PikkuProvider } from '@pikku/react'
import { PikkuFetch } from '#pikku/pikku-fetch.gen.js'
import { PikkuRPC } from '#pikku/pikku-rpc.gen.js'

const pikku = createPikku(PikkuFetch, PikkuRPC, {
  serverUrl: 'http://localhost:4002',
})
```

`createPikku` accepts the same options as `PikkuFetch` (`transformDate`, `credentials`, `mode`, `cache`, `authHeaders`) plus `serverUrl`. Inside components, `usePikkuFetch()` returns the instance.

### Configuration options

```typescript
import { PikkuFetch } from '#pikku/pikku-fetch.gen.js'

const client = new PikkuFetch({
  serverUrl: 'https://api.example.com',
  transformDate: true,        // turn date-like strings into Date objects
  credentials: 'include',     // forward cookies
  authHeaders: { apiKey: '...' },
})
```

For additional functionality or feature requests, please submit an issue on the [Pikku repository](https://github.com/pikkujs/pikku).
