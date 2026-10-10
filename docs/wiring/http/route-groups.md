---
sidebar_position: 1
title: Route Groups
description: Composable route contracts with shared configuration
---

# Route Groups

For larger APIs, `defineHTTPRoutes` and `wireHTTPRoutes` let you organise routes into composable groups with shared configuration — instead of wiring each route individually with `wireHTTP`.

## Defining Route Groups

Use `defineHTTPRoutes` to create a route contract:

```typescript @snippet wa-http-define-routes
```

`defineHTTPRoutes` doesn't register anything — it returns a route contract that can be composed and wired later.

### Group Configuration

Group-level config applies to all routes in the contract:

| Property | Type | Description |
|----------|------|-------------|
| `basePath` | `string` | Prefix concatenated onto all routes in the group (nested groups concatenate down the chain) |
| `tags` | `string[]` | Tags merged (unioned) onto all routes in the group |
| `auth` | `boolean` | Default auth requirement for all routes |
| `middleware` | `Middleware[]` | Middleware applied to all routes, ahead of route-level middleware |

Individual routes can still override `auth`, and their `tags`/`middleware` are merged on top of the group's. Authorization is not a wiring concern — declare permissions on the function definition (see [Permission Guards](../../core-features/permission-guards.md)).

## Wiring Route Groups

Use `wireHTTPRoutes` to register route contracts:

```typescript @snippet wa-http-wire-route-groups
```

### Base Path

Add a `basePath` to prefix all routes:

```typescript @snippet wa-http-base-path
```

### Array of Routes

You can also pass an array of routes directly:

```typescript @snippet wa-http-route-array
```

## Real-World Example: Shop Routes

From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template) — a full catalogue and basket API defined as a single route group, with `auth: false` as the group default and individual routes overriding it where authentication is needed.

```typescript @snippet shopRoutes
```

All 13 routes share the `auth: false` default. Admin routes (`createCategory`, `createItem`, `updateItem`) override that with `auth: true`. The whole group registers with a single `wireHTTPRoutes` call.

## When to Use What

| Function | Purpose |
|----------|---------|
| `wireHTTP` | Wire a single route — good for one-off endpoints |
| `defineHTTPRoutes` | Define a reusable group of routes with shared config |
| `wireHTTPRoutes` | Register one or more route groups (or an array of routes) |
