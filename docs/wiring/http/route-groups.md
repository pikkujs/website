---
sidebar_position: 1
title: Route Groups
description: Composable route contracts with shared configuration
---

# Route Groups

For larger APIs, `defineHTTPRoutes` and `wireHTTPRoutes` let you organise routes into composable groups with shared configuration — instead of wiring each route individually with `wireHTTP`.

## Defining Route Groups

Use `defineHTTPRoutes` to create a route contract:

```typescript reference title="todos.http.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/todos.http.ts
```

`defineHTTPRoutes` doesn't register anything — it returns a route contract that can be composed and wired later.

### Group Configuration

Group-level config applies to all routes in the contract:

| Property | Type | Description |
|----------|------|-------------|
| `basePath` | `string` | Prefix prepended to all routes |
| `tags` | `string[]` | Tags applied to all routes |
| `auth` | `boolean` | Default auth requirement for all routes |
| `middleware` | `Middleware[]` | Middleware applied to all routes |
| `permissions` | `PermissionGroup` | Permissions applied to all routes |

Individual routes can still override group-level settings.

## Wiring Route Groups

Use `wireHTTPRoutes` to register route contracts:

```typescript
// app.http.ts
import { wireHTTPRoutes } from '#pikku/http'
import { todosRoutes } from './routes/todos.routes.js'
import { authRoutes } from './routes/auth.routes.js'

wireHTTPRoutes({
  routes: {
    todos: todosRoutes,
    auth: authRoutes,
  },
})
```

### Base Path

Add a `basePath` to prefix all routes:

```typescript
wireHTTPRoutes({
  basePath: '/api/v1',
  routes: {
    todos: todosRoutes,
    auth: authRoutes,
  },
})
// Routes become: /api/v1/todos, /api/v1/todos/:id, etc.
```

### Array of Routes

You can also pass an array of routes directly:

```typescript
wireHTTPRoutes({
  basePath: '/api',
  routes: [
    { method: 'get', route: '/health', func: healthCheck, auth: false },
    { method: 'get', route: '/status', func: getStatus, auth: false },
  ],
})
```

## When to Use What

| Function | Purpose |
|----------|---------|
| `wireHTTP` | Wire a single route — good for one-off endpoints |
| `defineHTTPRoutes` | Define a reusable group of routes with shared config |
| `wireHTTPRoutes` | Register one or more route groups (or an array of routes) |
