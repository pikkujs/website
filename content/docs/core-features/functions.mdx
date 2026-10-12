---
sidebar_position: 10
title: Functions
description: How functions work
---

# Functions

Functions are at the heart of Pikku. They contain your application's domain logic - the "what" your application does, completely separate from "how" it's accessed.

The beauty of Pikku functions is that they're **transport-agnostic**. Write your function once, and it can be called via HTTP REST API, WebSocket messages, background queue jobs, scheduled cron tasks, CLI commands, or even as an MCP tool for AI agents. The function doesn't need to know or care.

## Your First Function

Here's a simple function that fetches a book from a database. The definers live behind the [`#pikku/function`](/api#app/function) door the CLI generates:

```typescript @snippet co-func-basic
```

This function can now be wired to:
- A `GET /books/:bookId` HTTP endpoint
- A WebSocket action `{ action: 'getBook', bookId: '123' }`
- A queue worker that processes book lookup jobs
- A CLI command `myapp book get <bookId>`
- An MCP resource that AI agents can query

All without changing a single line of the function code.

:::tip[The Pikku Mental Model]
Think of Pikku functions like serverless functions (Lambda, Cloudflare Workers) but **without the lock-in**. You write pure business logic that's completely decoupled from the runtime. The difference? You can call the same function from HTTP, WebSocket, a queue, or anything else – and deploy it to any platform. One function, infinite entry points.
:::

## The Function Signature

Pikku functions use an object configuration with a `func` property that contains your logic:

A function is a `pikkuFunc` config object. `func` takes the services you need, the data and the wire, and every other key is optional: `auth`, `permissions`, `title`, `description` and `tags`.

Three definers cover the common shapes: `pikkuFunc` (requires a session), `pikkuSessionlessFunc` (may run without one), and `pikkuVoidFunc` (no input, no output — for scheduled tasks and cleanup). All three accept either a bare function or this config object.

### Parameters Explained

**1. Services** - Your application's singleton services (database, cache, logger, etc.)

**Always destructure services** directly in the parameter list - this is critical for Pikku to tree-shake unused services and optimize your bundle:

```typescript @snippet co-func-services
```

:::info[Accessing Transport-Specific Information]
If you need access to transport-specific information (like HTTP headers or WebSocket channel info), you can destructure from the `wire` parameter:

```typescript @snippet co-func-wire-http
```
:::

**2. Data** - The input to your function

Pikku automatically merges data from wherever it comes from - URL paths, query parameters, request bodies, WebSocket messages, queue payloads, etc. Your function just receives clean, typed data.

**Automatic Validation**: When a function declares an `input` schema (or its input type is listed under `schemasFromTypes` in `pikku.config.json`), Pikku generates the JSON Schema and validates all incoming data against it. If the data doesn't match, the function won't even be called - an error is returned immediately.

```typescript @snippet co-func-typed-input
```

**3. Wire** - Access to session and transport-specific details

When you need the user's session or transport-specific information, destructure from the third parameter:

```typescript @snippet co-func-session-read
```

## Sessions and Authentication

By default, Pikku functions require authentication (`auth: true`). This means a user session must exist for the function to execute.

### Authentication Functions (Login, Logout, GetMe)

```typescript @snippet co-func-auth-flow
```

The `login` function verifies the credentials and calls `setSession` to start the session. The `logout` function calls `clearSession()` to clear the session. The `getMe` function reads the current session to return the authenticated user.

The `session` from the wire parameter abstracts session storage, so it works identically whether your users are connecting via HTTP cookies, WebSocket connections, or any other transport that requires a session.

See [User Sessions](/docs/core-features/user-sessions) for more details on session management.

## Permissions

Functions can declare fine-grained permissions for authorization:

```typescript @snippet co-permission-on-func
```

Permissions are defined separately and can be reused across functions:

```typescript @snippet permissionFunction
```

See [Permission Guards](/docs/core-features/permission-guards) for more details.

## Calling Functions from Functions

Sometimes one function needs to call another. Use `rpc.invoke()` for this - it's for internal function-to-function calls (in the future this could also mean between microservices), and still enforces all permissions, auth, and function middleware:

```typescript @snippet rpcInternalCall
```

:::tip
RPC calls are great for orchestrating complex workflows while maintaining security boundaries. Each `rpc.invoke()` still runs through the full auth and permission checks.
:::

See [RPC (Remote Procedure Calls)](/docs/wiring/rpcs) for more details on when and how to use RPC.

## Error Handling

Errors in Pikku are thrown, not returned. Use built-in error classes or extend `PikkuError`:

```typescript @snippet co-func-errors
```

When called via HTTP, `BadRequestError` becomes a 400 response and `NotFoundError` becomes a 404. When called via WebSocket, they become error messages. The function doesn't need to handle this - Pikku does it automatically.

See [Errors](/docs/core-features/errors) for more on error handling and creating custom errors.

## Function Metadata

Functions support metadata properties for documentation and API generation:

Add `title` (a short one-liner), `description` (optional longer context) and `tags` (categories for grouping) alongside `func`.

This metadata is used to:
- Generate OpenAPI specifications for your HTTP APIs
- Create type-safe clients
- Build developer documentation
- Help AI agents understand your MCP tools

## Input and Output Validation

Pikku supports runtime validation using any [Standard Schema](https://standardschema.dev) validator, such as [Zod](https://zod.dev). The schemas are also the source of the data and return types, so use either schemas or generics - never both:

```typescript @snippet co-func-zod
```

The `input` and `output` schemas provide runtime validation on top of the compile-time type checking, and `data`/the return value are inferred from them.

## Visibility Control

Control how your functions are exposed:

```typescript @snippet co-func-expose
```

- `expose: true` - Makes the function available for external RPC calls
- Functions are internal-only by default - without `expose: true` they can only be called from wirings and other functions
- `mcp: true` - Additionally surfaces the function as an MCP tool

## Organizing Your Code

A typical Pikku project structure looks like:

```
packages/functions/src/
  functions/
    books.function.ts        # Your domain functions
    auth.function.ts
    orders.function.ts
  services/
    database.service.ts      # Plain TypeScript services
    email.service.ts
  services.ts                # Service factory
  permissions.ts             # Permission guards
  middleware.ts              # Middleware definitions
  errors.ts                  # Custom error types
  config.ts                  # Configuration
```

Functions live in `*.function.ts` files and only export Pikku functions. Services are plain TypeScript classes that don't depend on Pikku - this keeps your business logic portable and easy to test.

:::tip[Why This Matters: Portability & Testability]
By keeping your services as plain TypeScript (no Pikku dependencies), you can:
- **Test functions in isolation** - Just call `myFunction.func(mockServices, mockData, mockWire)`
- **Reuse logic elsewhere** - Your database service can be used in scripts, migrations, or other tools
- **Avoid lock-in** - If you ever move away from Pikku, your core logic stays intact

This is intentional: Pikku is just the glue between your logic and the outside world. Your actual business logic should be framework-independent.
:::

:::info
This structure isn't required - you can organize your code however you want. This is just what's most tested and tree-shakable.
:::

## Next Steps

Now that you understand how functions work, learn how to connect them to the outside world:

- [Wire functions to HTTP routes](/docs/wiring/http)
- [Handle real-time WebSocket connections](/docs/wiring/channels)
- [Process background jobs with queues](/docs/wiring/queue)
- [Run scheduled tasks](/docs/wiring/scheduled-tasks)
- [Build CLI tools](/docs/wiring/cli)
- [Expose functions as MCP tools for AI agents](/docs/wiring/mcp)
