---
title: Pikku Tags And Middleware
description: Introducing Middleware & Tag Filtering in Pikku
---

We're excited to roll out two powerful new features in Pikku: **Middleware** and **Tag Filtering**. These enhancements provide you with more control over your API routes and streamline deployments by bundling only the routes you need.

<!-- truncate -->

## Middleware: Flexible and Powerful

Taking cues from frameworks like **Express**, **Koa**, and **Hono**, we've built a robust middleware system. Middleware in Pikku lets you:

- **Inject custom logic:** Whether it's setting up user sessions, managing timeouts, or manipulating headers.
- **Keep your code clean:** Separate cross-cutting concerns from your core route logic.
- **Enhance security:** Easily validate API keys or perform other authentication tasks.

### How It Works

A middleware function is simply a function that intercepts a request before it reaches your route handler. For example:

```typescript
const middleware: APIMiddleware = async (services, { http }, next) => {
    // Example: Check for a valid API key and set a user session
    if (http?.request?.getHeader('x-api-key') === 'my-token') {
        await services.userSession.set({ /* session data */ });
    }
    await next();
};
```

You can add middleware globally or per route:

- **Global Middleware:**  
  ```typescript
  addMiddleware('/admin/*', [adminMiddleware]);
  ```
- **Route-Specific Middleware:**  

  ```typescript
  addRoute({
      route: '/admin',
      method: 'get',
      func: yourFunction,
      middleware: [adminMiddleware]
  })
  ```

## Tag Filtering: Bundle Only What You Need

Tag filtering is designed to optimize your builds by including only the routes, channels, or transports that are necessary. This means:

- **Lean deployments:** Only bundle routes that match specific tags.
- **Customizable environments:** Easily manage routes for different environments (e.g., admin vs. public).

### Example Usage

In your CLI configuration, you might set up filters like this:

```json
{
    "filters": {
        "tags": ["admin"]
    }
}
```

And then tag your routes accordingly:

```typescript
addRoute({
    route: '/admin',
    method: 'get',
    func: yourFunction,
    tags: ['admin']
});
```

:::info
For tag filtering to work correctly, please ensure that each route is defined in its own file.
:::

## Looking Ahead

These new features are just the beginning. With middleware, you're empowered to add HTTP (and other) logic without affecting your main code, and tag filtering ensures your deployments are as slim and efficient as possible. We’re committed to evolving Pikku in a way that’s as forward-thinking as the projects you build.

Try these features out today and let us know how they improve your workflow!