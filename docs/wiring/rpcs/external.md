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
>(async ({ rpc }, { name, data }) => {
  return await rpc.invokeExposed(name, data)
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

Pikku generates a type-safe client for calling external RPCs:

```typescript
import { pikkuClient } from './pikku-fetch.gen.js'

const client = pikkuClient('https://api.example.com')

// Fully type-safe RPC calls
const result = await client.greet({
  name: 'Alice',
  greeting: 'Hello'
})

console.log(result.message)  // TypeScript knows the return type
```

The client:
- Enforces correct input types
- Knows exact output types
- Handles authentication
- Formats errors appropriately

See [Fetch Client](../http/fetch-client.md) for details.

## Next Steps

- [Internal RPCs](./internal.md) - Function-to-function calls
- [Fetch Client](../http/fetch-client.md) - Type-safe HTTP client
- [Functions](../../core-features/functions.md) - Understanding Pikku functions
