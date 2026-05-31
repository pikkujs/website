---
sidebar_position: 2
title: Exposed RPCs
description: Calling exposed functions from external clients
---

# Exposed RPCs

Exposed RPCs let external clients invoke your Pikku functions via HTTP POST endpoints.

## Exposing Functions

Functions with `expose: true` can be called by external systems:

```typescript reference title="remote-rpc.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/remote-rpc.functions.ts
```

Everything else is derived from the function:
- Input validation from your types
- Authentication from `auth` setting (default: `true`)
- Permissions from `permissions` property
- Error responses from thrown errors

See [Middleware](../../core-features/middleware.md) for auth configuration.

## Wiring an RPC Endpoint

Wire an HTTP endpoint that calls any exposed function:

```typescript
import { wireHTTP } from '#pikku/http'
import { pikkuSessionlessFunc } from '#pikku'

// Generic RPC caller function
export const rpcCaller = pikkuSessionlessFunc<
  { name: string; data: unknown },
  unknown
>(async (services, { name, data }, { rpc }) => {
  return await rpc.exposed(name, data)
})

// Wire it to HTTP
wireHTTP({
  method: 'post',
  route: '/rpc/:rpcName',
  func: rpcCaller
})
```

External clients call it:

```bash
POST /rpc/greet
Content-Type: application/json

{
  "data": {
    "name": "Alice",
    "greeting": "Hello"
  }
}
```

Response:

```json
{
  "message": "Hello, Alice!",
  "timestamp": 1234567890000,
  "serverPort": 3001
}
```

## Type-Safe Client

Pikku generates a type-safe `PikkuRPC` client (`pikku rpc`) for calling exposed RPCs by name:

```typescript
import { PikkuRPC } from './pikku-rpc.gen.js'

const rpc = new PikkuRPC()
rpc.setServerUrl('https://api.example.com')

// Fully type-safe RPC calls — input and output are inferred from the function
const result = await rpc.invoke('greet', {
  name: 'Alice',
  greeting: 'Hello'
})

console.log(result.message)  // TypeScript knows the return type
```

The client:
- Enforces correct input types per RPC name
- Knows exact output types
- Handles authentication via `setAuthorizationJWT()` / `setAPIKey()`
- Formats errors appropriately

See [Fetch Client](../http/fetch-client.md) for details.

## Next Steps

- [Internal RPCs](./internal.md) - Function-to-function calls
- [Fetch Client](../http/fetch-client.md) - Type-safe HTTP client
- [React Query Hooks](./react-query.md) - Auto-generated typed React Query hooks
- [Functions](../../core-features/functions.md) - Understanding Pikku functions
