---
sidebar_position: 2
title: External RPCs
description: Exposing functions to external clients
---

# External RPCs

External RPCs let external clients invoke your Pikku functions via HTTP POST endpoints (and channels on roadmap).

## Exposing Functions

Functions with `expose: true` can be called by external systems:

```typescript
export const calculateOrderTotal = pikkuSessionlessFunc<
  { items: Array<{ price: number; quantity: number }> },
  { subtotal: number; tax: number; total: number }
>({
  func: async ({ database }, data) => {
    const subtotal = data.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )

    const taxRate = await database.query('config', {
      where: { key: 'tax_rate' }
    })

    const tax = subtotal * (taxRate?.value ?? 0.08)

    return { subtotal, tax, total }
  },
  expose: true,  // Can be called externally
  docs: {
    summary: 'Calculate order totals with tax',
    tags: ['orders']
  }
})
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
>({
  func: async ({ rpc }, { name, data }) => {
    return await rpc.invokeExposed(name, data)
  },
  docs: {
    summary: 'Call any exposed function via RPC',
    tags: ['rpc']
  }
})

// Wire it to HTTP
wireHTTP({
  method: 'post',
  route: '/rpc',
  func: rpcCaller
})
```

External clients call it:

```bash
POST /rpc
Content-Type: application/json

{
  "name": "calculateOrderTotal",
  "data": {
    "items": [
      { "price": 10, "quantity": 2 },
      { "price": 15, "quantity": 1 }
    ]
  }
}
```

Response:

```json
{
  "subtotal": 35,
  "tax": 2.8,
  "total": 37.8
}
```

## Type-Safe Client

Pikku generates a type-safe client for calling external RPCs:

```typescript
import { pikkuClient } from './pikku-fetch.gen.js'

const client = pikkuClient('https://api.example.com')

// Fully type-safe RPC calls
const totals = await client.calculateOrderTotal({
  items: [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
  ]
})

console.log(totals.subtotal)  // TypeScript knows the return type
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
