---
sidebar_position: 2
title: Exposed RPCs
description: Calling exposed functions from external clients
---

# Exposed RPCs

Exposed RPCs let external clients invoke your Pikku functions via HTTP POST endpoints.

## Exposing Functions

Functions with `expose: true` can be called by external systems:

Source: [`remote-rpc.functions.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/remote-rpc.functions.ts)

Everything else is derived from the function:
- Input validation from your types
- Authentication from `auth` setting (default: `true`)
- Permissions from `permissions` property
- Error responses from thrown errors

See [Middleware](/docs/core-features/middleware) for auth configuration.

## Wiring an RPC Endpoint

Wire an HTTP endpoint that calls any exposed function:

```typescript @snippet wb-rpc-exposed-endpoint
```

External clients call it:

```bash
POST /rpc/checkItemAvailability
Content-Type: application/json

{
  "data": {
    "itemId": "item-001"
  }
}
```

Response:

```json
{
  "available": true,
  "stock": 12,
  "name": "Blue Mug"
}
```

## Type-Safe Client

Pikku generates a type-safe `PikkuRPC` client (`pikku rpc`) for calling exposed RPCs by name:

```typescript @snippet rpcClient
```

The client:
- Enforces correct input types per RPC name
- Knows exact output types
- Handles authentication via `setAuthorizationJWT()` / `setAPIKey()`
- Formats errors appropriately

See [Fetch Client](/docs/wiring/http/fetch-client) for details.

## Next Steps

- [Internal RPCs](/docs/wiring/rpcs/internal) - Function-to-function calls
- [Fetch Client](/docs/wiring/http/fetch-client) - Type-safe HTTP client
- [React Query Hooks](/docs/wiring/rpcs/react-query) - Auto-generated typed React Query hooks
- [Functions](/docs/core-features/functions) - Understanding Pikku functions
