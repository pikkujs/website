---
sidebar_position: 10
title: Functions
description: How functions work
---

# Functions

Functions are at the heart of Pikku. They contain your application's domain logic - the "what" your application does, completely separate from "how" it's accessed.

The beauty of Pikku functions is that they're **transport-agnostic**. Write your function once, and it can be called via HTTP REST API, WebSocket messages, background queue jobs, scheduled cron tasks, CLI commands, or even as an MCP tool for AI agents. The function doesn't need to know or care.

## Your First Function

Here's a simple function that fetches a book from a database:

```typescript
import { pikkuFunc } from '#pikku/pikku-types.gen.js'

export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ database }, data) => {
    try {
      return await database.query('book', { bookId: data.bookId })
    } catch (e) {
      throw new NotFoundError()
    }
  },
  docs: {
    summary: 'Fetch a book by ID',
    description: 'Returns a book from the database',
    tags: ['books'],
    errors: ['NotFoundError']
  }
})
```

This function can now be wired to:
- A `GET /books/:bookId` HTTP endpoint
- A WebSocket action `{ action: 'getBook', bookId: '123' }`
- A queue worker that processes book lookup jobs
- A CLI command `myapp book get <bookId>`
- An MCP resource that AI agents can query

All without changing a single line of the function code.

## The Function Signature

Pikku functions use an object configuration with a `func` property that contains your logic:

```typescript
const myFunction = pikkuFunc<InputType, OutputType>({
  func: async (services, data, session) => {
    // Your logic here
    return result
  },
  // Optional configuration
  auth: true,
  permissions: { /* ... */ },
  docs: { /* ... */ }
})
```

### Parameters Explained

**1. Services** - Your application's singleton services (database, cache, logger, etc.)

We highly recommend destructuring services directly in the parameter list - this allows Pikku to tree-shake unused services:

```typescript
func: async ({ database, logger }, data) => {
  logger.info('Fetching book', { bookId: data.bookId })
  // Only database and logger are included in the bundle
}
```

:::info Accessing Transport-Specific Information
If you need access to transport-specific information (like HTTP headers or WebSocket channel info), you can also destructure the `interaction` object from services:

```typescript
func: async ({ database, interaction }, data) => {
  if (interaction.http) {
    const userAgent = interaction.http.headers['user-agent']
  }
  // interaction.http, interaction.channel, interaction.queue, etc.
}
```
:::

**2. Data** - The input to your function

Pikku automatically merges data from wherever it comes from - URL paths, query parameters, request bodies, WebSocket messages, queue payloads, etc. Your function just receives clean, typed data.

**Automatic Validation**: Pikku automatically generates JSON schemas from your TypeScript input types and validates all incoming data against them. If the data doesn't match your type signature, the function won't even be called - an error is returned immediately.

```typescript
type CreateBookInput = {
  title: string
  author: string
  publishedYear?: number
}

export const createBook = pikkuFunc<CreateBookInput, Book>({
  func: async ({ database }, data) => {
    // data is guaranteed to match CreateBookInput
    // title and author are strings, publishedYear is optional number
    return await database.insert('book', data)
  },
  docs: {
    summary: 'Create a new book',
    tags: ['books']
  }
})
```

**3. Session** - The authenticated user's session (if `auth: true`)

```typescript
func: async (services, data, session) => {
  const userId = session?.userId
  // session is available if auth is enabled
}
```

## Sessions and Authentication

By default, Pikku functions require authentication (`auth: true`). This means a user session must exist for the function to execute.

### Setting a Session (Login)

```typescript
export const login = pikkuFuncSessionless<LoginInput, LoginResult>({
  func: async ({ database, userSession, jwt }, data) => {
    const user = await database.query('user', { email: data.email })

    if (!user || !await verifyPassword(data.password, user.passwordHash)) {
      throw new UnauthorizedError('Invalid credentials')
    }

    // Set the session - works across HTTP, WebSocket, etc.
    await userSession.set({
      userId: user.id,
      role: user.role
    })

    return { token: await jwt.sign({ userId: user.id }), user }
  },
  auth: false,  // No existing session required for login
  docs: {
    summary: 'Authenticate a user',
    tags: ['auth']
  }
})
```

Notice we used `pikkuFuncSessionless` for the login function and set `auth: false` - it doesn't require an existing session since we're creating one.

### Clearing a Session (Logout)

```typescript
export const logout = pikkuFunc<void, void>({
  func: async ({ userSession }) => {
    await userSession.clear()
  },
  docs: {
    summary: 'Logout user',
    tags: ['auth']
  }
})
```

The `userSession` service abstracts session storage, so it works identically whether your users are connecting via HTTP cookies, WebSocket connections, or any other transport that requires a session.

See [User Sessions](./user-sessions.md) for more details on session management.

## Permissions

Functions can declare fine-grained permissions for authorization:

```typescript
export const deleteBook = pikkuFunc<{ bookId: string }, void>({
  func: async ({ database }, data) => {
    await database.delete('book', { bookId: data.bookId })
  },
  permissions: {
    // User must be either the owner OR an admin
    owner: requireBookOwner,
    admin: requireAdmin
  },
  docs: {
    summary: 'Delete a book',
    tags: ['books']
  }
})
```

Permissions are defined separately and can be reused across functions:

```typescript
// permissions.ts
export const requireBookOwner: PikkuPermission<{ bookId: string }> =
  async ({ database }, data, session) => {
    if (!session?.userId) return false

    const book = await database.query('book', {
      bookId: data.bookId,
      ownerId: session.userId
    })

    return !!book
  }
```

See [Permission Guards](./permission-guards.md) for more details.

## Calling Functions from Functions

Sometimes one function needs to call another. Use `rpc.invoke()` for this - it's for internal function-to-function calls (in the future this could also mean between microservices), and still enforces all permissions, auth, and function middleware:

```typescript
export const processOrder = pikkuFunc<{ orderId: string }, Order>({
  func: async ({ database, rpc }, data) => {
    // Orchestrate multiple domain operations
    // Each invoke still enforces permissions and auth
    const invoice = await rpc.invoke('generateInvoice', {
      orderId: data.orderId
    })

    const payment = await rpc.invoke('processPayment', {
      invoiceId: invoice.id
    })

    return await database.update('order', {
      where: { orderId: data.orderId },
      set: { status: 'completed', paymentId: payment.id }
    })
  },
  docs: {
    summary: 'Process an order end-to-end',
    tags: ['orders']
  }
})
```

:::tip
RPC calls are great for orchestrating complex workflows while maintaining security boundaries. Each `rpc.invoke()` still runs through the full auth and permission checks.

<!-- TODO: Document bailout mechanism for skipping auth/permissions in trusted contexts -->
:::

See [RPC (Remote Procedure Calls)](./rpcs.md) for more details on when and how to use RPC.

## Error Handling

Errors in Pikku are thrown, not returned. Use built-in error classes or extend `PikkuError`:

```typescript
import { BadRequestError, NotFoundError } from '@pikku/core/errors'

export const updateBook = pikkuFunc<UpdateBookInput, Book>({
  func: async ({ database }, data) => {
    if (!data.title || data.title.length < 1) {
      throw new BadRequestError('Title is required')
    }

    try {
      return await database.update('book', {
        where: { bookId: data.bookId },
        set: { title: data.title }
      })
    } catch (e) {
      throw new NotFoundError('Book not found')
    }
  },
  docs: {
    summary: 'Update a book',
    tags: ['books'],
    errors: ['NotFoundError', 'BadRequestError']
  }
})
```

When called via HTTP, `BadRequestError` becomes a 400 response and `NotFoundError` becomes a 404. When called via WebSocket, they become error messages. The function doesn't need to handle this - Pikku does it automatically.

See [Errors](./errors.md) for more on error handling and creating custom errors.

## Documenting Functions

The `docs` block on each function serves multiple purposes:

```typescript
docs: {
  summary: 'A short one-liner describing what this does',
  description: 'Optional longer description with more context',
  tags: ['category', 'grouping'],
  errors: ['NotFoundError', 'ValidationError']
}
```

This documentation is used to:
- Generate OpenAPI specifications for your HTTP APIs
- Create type-safe clients
- Build developer documentation
- Help AI agents understand your MCP tools

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

:::info
This structure isn't required - you can organize your code however you want. This is just what's most tested and tree-shakable.
:::

## Next Steps

Now that you understand how functions work, learn how to connect them to the outside world:

- [Wire functions to HTTP routes](../http/index.md)
- [Handle real-time WebSocket connections](../channels/index.md)
- [Process background jobs with queues](../queue/index.md)
- [Run scheduled tasks](../scheduled-tasks.md)
- [Build CLI tools](../cli/index.md)
- [Expose functions as MCP tools for AI agents](../mcp/index.md)
