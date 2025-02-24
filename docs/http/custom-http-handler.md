---
sidebar_position: 5
title: Writing your own handler
---

You can integrate Pikku into most javascript HTTP servers in three steps.

:::info
We'll use express here as the example request/response as it's most popular.
:::

### Create a class to extend PikkuRequest

This wraps the request object provided into a pikku handler

```typescript reference title="Pikku Express Request"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/packages/servers/express/express-middleware/src/pikku-express-request.ts
```

### Create a class to extend PikkuResponse

This wraps the response object provided into a pikku handler

```typescript reference title="Pikku Express Response"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/packages/servers/express/express-middleware/src/pikku-express-response.ts
```

### Call runHTTPRoute with the correct request and response object

```typescript title="Pikku Middleware"
await runHTTPRoute(
    new PikkuExpressRequest(req),
    new PikkuExpressResponse(res),
    singletonServices,
    createSessionServices,
    {
        // The HTTP method
        method: req.method.toLowerCase() as any,
        // The HTTP Route
        route: req.path,
        // Whether we want allow the route handler to return a 404, or 
        // not do anything if the route isn't found
        respondWith404: true
        // This skips us trying to find a session for a route that 
        // isn't authenticated
        skipUserSession: false
    }
)
```
