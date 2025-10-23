---
sidebar_position: 0
title: HTTP Routes
description: Connecting functions to HTTP endpoints
---

# HTTP Routes

HTTP routes are how you connect your Pikku functions to the web. Once you've written your domain functions, you wire them to HTTP endpoints - turning them into REST APIs that can be called from browsers, mobile apps, or any HTTP client.

Your functions don't need to know they're being called via HTTP (but you can access the HTTP object if you like). They just receive data, do their work, and return results. Pikku handles all the HTTP-specific details like status codes, headers, request parsing, and error responses.

## Your First HTTP Route

Let's wire a function to an HTTP endpoint:

```typescript
// books.function.ts
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
    tags: ['books'],
    errors: ['NotFoundError']
  }
})
```

```typescript
// get-book.http.ts
import { wireHTTP } from './pikku-types.gen.js'
import { getBook } from './functions/books.function.js'

wireHTTP({
  method: 'get',
  route: '/books/:bookId',
  func: getBook
})
```

That's it! Your function is now available at `GET /books/:bookId`. Pikku automatically:
- Extracts `:bookId` from the URL path
- Merges it with any query parameters
- Validates the data against your function's input type
- Calls your function with the clean, typed data
- Converts the result to a JSON response
- Maps any errors to appropriate HTTP status codes

## Wiring Configuration

The `wireHTTP` function accepts a configuration object with all routing options:

```typescript
import { wireHTTP } from './pikku-types.gen.js'
import { deleteBook } from './functions/books.function.js'
import { requireBookOwner, requireAdmin } from './permissions.js'
import { auditMiddleware, setCookieMiddleware } from './middleware.js'

wireHTTP({
  // Required
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,

  // Optional - Authentication
  auth: true,  // Requires user session (default: true)

  // Optional - Permissions
  permissions: {
    owner: requireBookOwner,
    admin: requireAdmin
  },

  // Optional - Middleware
  middleware: [auditMiddleware, setCookieMiddleware],

  // Optional - Server-Sent Events
  sse: false,  // Enable SSE for GET routes (default: false)

  // Optional - Documentation
  docs: {
    description: 'Delete a book from the library',
    tags: ['books'],
    errors: ['NotFoundError', 'UnauthorizedError']
  }
})
```

Let's break down each option:

### Method

```typescript
method: 'get' | 'post' | 'put' | 'patch' | 'delete'
```

The HTTP method for this route.

### Route

Route patterns use path parameters with `:` syntax:

```typescript
wireHTTP({
  method: 'get',
  route: '/books/:bookId',        // Single parameter
  func: getBook
})

wireHTTP({
  method: 'get',
  route: '/authors/:authorId/books/:bookId',  // Multiple parameters
  func: getAuthorBook
})
```

### Func

The Pikku function to call when this route is matched. Import from your `*.function.ts` files.

### Auth

Override the function's default authentication requirement:

```typescript
// Public endpoint - no auth required
wireHTTP({
  method: 'get',
  route: '/books',
  func: listBooks,
  auth: false
})
```

By default, functions require authentication (`auth: true`).

### Permissions

Add transport-specific permissions for this HTTP route:

```typescript
wireHTTP({
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,
  permissions: {
    owner: requireBookOwner,
    admin: requireAdmin
  }
})
```

These permissions **add to** the permissions defined on the function itself.

You can also apply permissions globally or to route prefixes:

```typescript
import { addHTTPPermission } from './pikku-types.gen.js'
import { requireAuth, requireAdmin } from './permissions.js'

// Global permissions - applies to all HTTP routes
addHTTPPermission('*', {
  auth: requireAuth
})

// Prefix permissions - applies to routes starting with /admin
addHTTPPermission('/admin', {
  admin: requireAdmin
})
```

See [Permission Guards](../core-features/permission-guards.md) for more details.

### Middleware

Attach middleware that runs specifically for this wire:

```typescript
import { setCookieMiddleware, auditMiddleware } from './middleware.js'

wireHTTP({
  method: 'post',
  route: '/login',
  func: login,
  middleware: [setCookieMiddleware, auditMiddleware]
})
```

You can also apply middleware globally or to route prefixes:

```typescript
import { addHTTPMiddleware } from './pikku-types.gen.js'
import { corsMiddleware, loggingMiddleware, adminAuthMiddleware } from './middleware.js'

// Global - applies to all HTTP routes
addHTTPMiddleware([corsMiddleware, loggingMiddleware])

// Prefix - applies to routes starting with /admin
addHTTPMiddleware('/admin', [adminAuthMiddleware])
```

Middleware runs in this order:
1. Global HTTP middleware
2. Prefix-based middleware (`/admin/*`)
3. Tag-based middleware
4. Wire-specific middleware (defined in `wireHTTP`)
5. Function-level middleware

See [Middleware](../core-features/middleware.md) for more details.

### SSE (Server-Sent Events)

Enable Server-Sent Events for GET routes:

```typescript
wireHTTP({
  method: 'get',
  route: '/jobs/:jobId/progress',
  func: streamProgress,
  sse: true  // Enables SSE
})
```

Your function can then send incremental updates through the `channel` service. See [Server-Sent Events](./server-sent-events.md) for more details.

### Docs

Documentation for OpenAPI generation:

```typescript
docs: {
  description: 'Detailed description of what this endpoint does',
  tags: ['category'],
  errors: ['NotFoundError', 'BadRequestError']
}
```

Combined with the `docs` on your function, this generates complete OpenAPI documentation. See [OpenAPI](./openapi.md) for more details.

## How Data Flows

Pikku automatically merges data from multiple sources into a single, typed input for your function:

```typescript
// GET /books/123?includeAuthor=true
wireHTTP({
  method: 'get',
  route: '/books/:bookId',
  func: getBook
})

// Your function receives:
// { bookId: '123', includeAuthor: true }
```

For POST/PUT/PATCH requests, body data is also merged:

```typescript
// POST /books with body: { title: 'My Book', author: 'Jane' }
wireHTTP({
  method: 'post',
  route: '/books',
  func: createBook
})

// Your function receives:
// { title: 'My Book', author: 'Jane' }
```

If the same parameter appears in multiple places (path, query, body), they must all have the same value - otherwise Pikku throws a validation error to prevent ambiguity.

:::note
This means data sent as an array in a body will be passed in as `data.data`, since the query keys will live on the top-most object. The same applies to ArrayBuffers.
:::

## Error Handling

Pikku automatically maps errors to HTTP status codes. You can use built-in errors or create custom ones:

```typescript
// errors.ts
import { PikkuError } from '@pikku/core/errors'
import { addError } from '#pikku/pikku-types.gen.js'

export class BookNotAvailableError extends PikkuError {
}

// Register the error with HTTP status code
addError(BookNotAvailableError, {
  status: 409,  // Conflict
  message: 'Book is currently unavailable'
})
```

Now use your custom error in functions:

```typescript
import { NotFoundError, BadRequestError } from '@pikku/core/errors'
import { BookNotAvailableError } from './errors.js'

export const borrowBook = pikkuFunc<{ bookId: string }, BorrowResult>({
  func: async ({ database }, data) => {
    const book = await database.query('book', { bookId: data.bookId })

    if (!book) {
      throw new NotFoundError('Book not found')  // → 404
    }

    if (book.status === 'borrowed') {
      throw new BookNotAvailableError('This book is already borrowed')  // → 409
    }

    return await database.update('book', {
      where: { bookId: data.bookId },
      set: { status: 'borrowed' }
    })
  },
  docs: {
    summary: 'Borrow a book',
    tags: ['books'],
    errors: ['NotFoundError', 'BookNotAvailableError']
  }
})
```

See [Errors](../core-features/errors.md) for more on error handling.

## Next Steps

- [Global HTTP Middleware and Permissions](./router.md)
- [Server-Sent Events](./server-sent-events.md)
- [OpenAPI Documentation](./openapi.md)
- [CORS Configuration](./cors.md)
- [Fetch Client](./fetch-client.md) - Type-safe HTTP client generation
