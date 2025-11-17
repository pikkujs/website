---
sidebar_position: 5
title: Custom HTTP Runtime
image: /img/logos/custom-light.svg
hide_title: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

You can integrate Pikku into most javascript HTTP servers in three steps.

1) Create a bridge for the `request`
2) Create a bridge for the `response`
3) Call `fetch` from your runtimes event

:::info
We'll use express here as the example request/response as it's most popular.
:::

### Create a class to extend PikkuRequest

This wraps the request object provided into a pikku request object.

```typescript reference title="Pikku Express Request"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/runtimes/express-middleware/src/pikku-express-request.ts
```

### Create a class to extend PikkuResponse

This wraps the response object provided into a pikku response object.

```typescript reference title="Pikku Express Response"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/runtimes/express-middleware/src/pikku-express-response.ts
```

### Call fetch with the correct request and response object

The `runRoute` method will find the correct route to run, and check permissions / authentication, validate data against the schema and map any errors to their errors.

```typescript title="Pikku Middleware"
await fetch(
    new PikkuExpressRequest(req),
    new PikkuExpressResponse(res),
    singletonServices,
    createWireServices,
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

### Wiring this with express

To get an idea how this all ties together, let's now look at the express middleware plugin.

```typescript reference title="Pikku Express Middleware"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/runtimes/express-middleware/src/pikku-express-middleware.ts
```