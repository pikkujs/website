---
sidebar_position: 50
title: Permission Guards
description: Authorization and access control
---

# Permission Guards

Permissions in Pikku run before your function executes. They're boolean checks that determine whether a request should proceed - if no permission group passes, the request is rejected with a 403 Forbidden.

Permissions should be independent checks that don't depend on execution order or side effects.

## Your First Permission

A permission is a function that returns a boolean. `pikkuPermission` comes from [`#pikku/auth`](/api#app/auth):

```typescript @snippet co-permission-basic
```

Use them in your function:

```typescript @snippet co-permission-on-func
```

Each key is a separate permission group, and groups use **OR logic** - the function executes if *either* `auth` or `owner` passes. To require both checks together, put them in an array under one key (see [Permission Logic and Execution](#permission-logic-and-execution)).

### Session-Only Checks with `pikkuAuth`

When a check only needs the session and no request data - a role or a feature gate - use `pikkuAuth` from the same `#pikku/auth` door. It receives `(services, session)` and is marked as an auth check, which is how agent tooling can tell it apart from an ordinary permission:

```typescript @snippet shopIsAuthenticated
```

## Permission Signature

The shape is `pikkuPermission<DataType>(async (services, data, { session }) => boolean)`: the services you need, the typed data, and the wire, returning a boolean.

Parameters:
- **services** - Your singleton services only (destructure what you need). Wire services are not available in permissions.
- **data** - The input data (typed with `DataType`)
- **wire** - The wire object (destructure `{ session }` to access the session directly)

Return `true` to allow access, `false` to deny with 403.

:::info Singleton Services Only
Permissions receive **only singleton services** in the first parameter, not wire services. This is because permissions run before wire services are created. If you need access to wire-scoped resources, use the `wire` parameter to access them.
:::

## Data-Based Permissions

Permissions can inspect the request data:

```typescript @snippet shopIsOrderOwner
```

Use it in a function by listing it under `permissions`, as in the first example (`owner: requireOwnership`). The data type of the permission must match the function's input.

## Permission Groups

You can compose multiple permissions. List as many as you need under `permissions`, each under its own key: for example `auth: requireAuth` next to `premium: requirePremium`, where the second permission looks up the user's record and checks an `isPremium` flag.

## Complex Permissions

Permissions can perform complex queries, such as a quota check that counts a user's open orders, or an activity check that reads when their basket was last updated:

```typescript @snippet co-permission-quota
```

## Global Permissions

Permissions live on the function definition. To apply an app-wide baseline that **every** function must additionally satisfy, use `addGlobalPermission`:

```typescript @snippet co-permission-global
```

Global permissions form an independent **AND** gate: they can only ever *narrow* access. Each function still enforces its own `permissions` in full — a broad global (e.g. `requireAuth`) can never satisfy a stricter function's own requirement (e.g. `requireOwnership`).

:::note
Wire-, tag-, and HTTP-route-level permissions (`addHTTPPermission`, `addTagPermission`, and a `permissions` field on the wiring) do not exist. Declare authorization on the function, plus the optional global gate above. Tags are organizational only — use tag/HTTP _middleware_ for cross-cutting request handling.
:::

## Error Handling

If a permission throws an error, it's treated as a server error (500), not unauthorized (403):

```typescript @snippet co-permission-throw-vs-false
```

Use `return false` for authorization failures. Only throw for actual errors.

## Permission Logic and Execution

:::warning Important: Don't Rely on Execution Order
Permission groups are evaluated until one passes (short-circuiting), and permissions inside an array run concurrently via `Promise.all`. This means:
- **Don't rely on execution order** - A group (or array member) may not run at all if an earlier group already passed
- **Avoid side effects** - Don't modify shared state or depend on other permissions running first
- **Keep them independent** - Each permission should be a self-contained check
:::

### OR Logic (Default)

When you list multiple permissions as object keys, **any one can pass** (OR logic):

Permissions under the same function are OR'd: list `owner`, `teamMember` and `assignee` side by side and the request proceeds if any one of them returns true.

Each key is a different way of being entitled to *this row*. That is what OR is
for here — and it is why "is an admin" is not one of them: an admin is entitled
to every row, which is a `scopes` entry rather than a third way of owning
something.

### AND Logic (Arrays)

To require multiple permissions to pass simultaneously, use arrays:

To require several permissions together, put them in an array under one key, for example `authAndVerified: [requireAuth, requireEmailVerified]`. The request proceeds only if every permission in the array returns true.

Don't depend on execution order - each permission should be an independent check.

## Auth vs Permissions

**auth** flag controls whether a session is required:

```typescript @snippet co-auth-flags
```

**permissions** run additional checks after auth:

```typescript @snippet co-auth-with-permissions
```

## Reusable Permissions

Define permissions once, reuse everywhere:

Keep your permissions in one `permissions.ts` file. A `requireAuth` that checks `session?.userId != null` is the baseline. Note what is *not* there: a `requireAdmin` comparing a role column. "Is an admin" is a fact about the caller, not about a row, so it belongs in `scopes`. Every permission asks about the *data* instead, such as `requireTeamMember` (a membership row exists for this team and user) and `requireOwnership` (the resource's `ownerId` is the session user).

Then import and use:

Import the permissions where you define functions and use them by key. A resource update takes `permissions: { auth: requireAuth, owner: requireOwnership }`. A user deletion takes `scopes: ['admin:users:remove']` for the capability and `permissions: { teamMember: requireTeamMember }` for being on the owning team. Both run: scopes AND together first, then permissions OR across keys.

## Permission Factories

For permissions that need configuration parameters, use `pikkuPermissionFactory`:

```typescript @snippet co-permission-factory
```

Calling the factory with `{ role: 'admin' }` gives a configured permission you can put under any key, as `deleteUser` does above.

Permission factories are useful when you have similar permission logic that varies by a parameter - roles, resource types, feature flags, etc.

## Best Practices

**Keep permissions focused** - One check per permission:

Keep each permission to a single responsibility: separate `requireAuth`, `requireOwnership` and `requireVerified` permissions, each registered under its own key, rather than one `requireEverything` that checks the session, a role and email verification at once. A role check in particular belongs in `scopes`, not in a permission.

**Optimize expensive checks** - Cache when possible:

A permission that runs on every request can cache an expensive lookup. Keep a map keyed by `sub:<userId>` holding the result of the subscription check, return the cached answer when there is one, and otherwise query once and store it. In a real app, use a shared store rather than a module-level map.

**Return false, don't throw** - For authorization failures:

Always return `false` for "not allowed". Throwing an error for an unauthenticated user surfaces as a 500, not a 403.

## Next Steps

- [Functions](./functions.md) - Understanding Pikku functions
- [HTTP Router](../wiring/http/router.md) - Global HTTP middleware for routes
- [Middleware](./middleware.md) - Request/response transformation
