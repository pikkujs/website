---
sidebar_position: 10
title: Middleware  
description: How middleware works 
---

In Pikku we have the main `Functions` that are run.

Each middleware is called in order before the main function, and then called in reverse once the function is completed.

This is similar to the onion approach used by Koa and Hono.

```mermaid
graph LR
    A(Request) -->|Enter| M1["Middleware One"]
    subgraph Layer 1
        M1 -->|Pass| M2["Middleware Two"]
        subgraph Layer 2
            M2 -->|Pass| M3["Middleware Three"]
            subgraph Layer 3
                M3 -->|Call| F["Function"]
                F -->|Return| M3
            end
            M3 -->|Return| M2
        end
        M2 -->|Return| M1
    end
    M1 -->|Response| B(Response)
```

A few examples:

## Response Time

```typescript
const responseTimeMiddlware = async (services, { http }, next) => {
  const start = Date.now()
  // This will wait until all next middleware and function run
  await next()
  const end = Date.now()
  http?.response.setHeader('X-Response-Time', `${end - start}`)
}
```

## Authentication

This is an example on how you can set the user session by simply grabbing it off an `X-user-id` header.

```typescript
const userIdFromHeaderMiddleware = async (services, { http }, next) => {
  await services.userSessionService.set({
    userId: http.request.getHeader('X-user-id')
  })
  // Run next middleware, but nothing else needed
  await next()
}
```

