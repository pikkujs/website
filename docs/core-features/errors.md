---
sidebar_position: 30
title: Errors
description: Error handling and HTTP status codes
---

# Errors

In Pikku, errors are mapped to HTTP status codes and messages. When you throw an error from a function, Pikku automatically converts it to the appropriate response format for the protocol being used (HTTP status codes, WebSocket error messages, etc.).

## Built-in Errors

Pikku provides a comprehensive set of built-in error classes covering all standard HTTP status codes. They all come from [`#pikku/error`](/api#app/error):

### Authentication & Authorization (4xx)

| Error Class | Status Code | Use Case |
|------------|-------------|----------|
| `UnauthorizedError` | 401 | Authentication required but missing or invalid |
| `MissingSessionError` | 401 | No session provided (more specific than Unauthorized) |
| `InvalidSessionError` | 401 | Session provided but not valid |
| `AIProviderAuthError` | 401 | The AI provider's API key is missing or invalid |
| `PaymentRequiredError` | 402 | Payment or subscription required |
| `ForbiddenError` | 403 | User authenticated but lacks permission |
| `InvalidOriginError` | 403 | Request from unauthorized origin (CORS) |
| `MissingScopeError` | 403 | The session does not hold a scope the function requires |
| `ReadonlySessionError` | 403 | A readonly session called a mutating function |
| `MissingCredentialError` | 403 | A credential the function needs is not configured |

### Client Errors (4xx)

| Error Class | Status Code | Use Case |
|------------|-------------|----------|
| `BadRequestError` | 400 | Malformed request syntax or invalid parameters |
| `NotFoundError` | 404 | Resource doesn't exist |
| `MethodNotAllowedError` | 405 | HTTP method not supported for this resource |
| `NotAcceptableError` | 406 | Can't produce response matching Accept headers |
| `ProxyAuthenticationRequiredError` | 407 | Proxy authentication required |
| `RequestTimeoutError` | 408 | Request took too long |
| `ConflictError` | 409 | Request conflicts with current state (e.g., duplicate) |
| `SystemRoleImmutableError` | 409 | An admin tried to change a role declared in code |
| `SystemRoleShadowedError` | 409 | A role was created with the name of a code-declared role |
| `GoneError` | 410 | Resource permanently deleted |
| `LengthRequiredError` | 411 | Content-Length header required |
| `PreconditionFailedError` | 412 | Precondition in headers not met |
| `PayloadTooLargeError` | 413 | Request body too large |
| `URITooLongError` | 414 | Request URI exceeds server limits |
| `UnsupportedMediaTypeError` | 415 | Content-Type not supported |
| `RangeNotSatisfiableError` | 416 | Requested range not satisfiable |
| `ExpectationFailedError` | 417 | Expect header requirement not met |
| `UnprocessableContentError` | 422 | Syntax correct but semantically invalid |
| `LockedError` | 423 | Resource is locked |
| `TooManyRequestsError` | 429 | Rate limit exceeded |

### Server Errors (5xx)

| Error Class | Status Code | Use Case |
|------------|-------------|----------|
| `InternalServerError` | 500 | Generic server error |
| `MissingSchemaError` | 500 | Schema not found during validation |
| `WeakKeyMaterialError` | 500 | A configured secret has too little entropy to use |
| `NotImplementedError` | 501 | Feature not yet implemented |
| `BadGatewayError` | 502 | Invalid response from upstream server |
| `ServiceUnavailableError` | 503 | Server temporarily unavailable |
| `FeatureUnavailableError` | 503 | A `featureFlag` on the function is switched off |
| `AIProviderNotConfiguredError` | 503 | No AI provider is configured for the agent |
| `GatewayTimeoutError` | 504 | Upstream server timeout |
| `HTTPVersionNotSupportedError` | 505 | HTTP version not supported |
| `MaxComputeTimeReachedError` | 524 | Function exceeded time limit (serverless) |

### Errors the Framework Throws

A few errors aren't yours to throw, they come from Pikku itself when something is wired wrong. They're all `PikkuError`s with a registered status, so they show up as proper responses rather than crashes.

| Error Class | Status Code | When you'll see it |
|------------|-------------|--------------------|
| `MissingServiceError` | 500 | A service the code needs isn't in your singleton services. The message names it, so register it in your services factory. |
| `PikkuMissingMetaError` | 500 | A queue worker, trigger source or workflow is running but its generated metadata isn't there. Re-run `npx pikku all` and make sure the generated `.pikku` output is the one you're deploying. |
| `LocalEnvironmentOnlyError` | 403 | A function that only makes sense in local development (it edits your source, for example) was called somewhere it isn't enabled. |

You can throw `MissingServiceError` and `LocalEnvironmentOnlyError` yourself when a function depends on an optional service:

```typescript @snippet missingServiceError
```

`PikkuMissingMetaError` is a different story: it's a sign the generated files are stale, not something to handle. When a queue job hits it through the remote-jobs entry point, it's turned into a `BadRequestError`, and the Node and Cloudflare queue handlers treat it as "don't retry", since retrying can't conjure metadata that isn't there.

### Expected vs Unexpected Errors

Some errors are the system working as intended: a missing role, an expired token, a validation failure. Others are bugs. Pikku draws that line with `isExpectedError`:

```typescript @snippet isExpectedError
```

An error is expected if it's a `PikkuError`, or if it carries `expected: true`. That second case exists because errors don't survive a trip through storage. When a workflow step fails, the error is serialized (message, stack, code) and later rebuilt as a plain `Error`, which would lose its `PikkuError` class. Pikku records the `expected` flag on the way in, so the rebuilt error is still recognisable.

What it buys you: callers can log an expected error's message alone and keep the full stack for the ones that deserve it. The CLI does exactly this, printing just the message for expected errors and the full stack for everything else.

### Usage Example

```typescript
import { NotFoundError, ForbiddenError, TooManyRequestsError } from '#pikku/error'

export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ database, rateLimit }, data, { session }) => {
    // Check rate limit
    if (!await rateLimit.check(session.userId)) {
      throw new TooManyRequestsError()
    }

    // Fetch book
    const book = await database.query('book', { id: data.bookId })
    if (!book) {
      throw new NotFoundError()
    }

    // Check permissions
    if (book.isPrivate && book.ownerId !== session.userId) {
      throw new ForbiddenError()
    }

    return book
  },
  title: 'Get a book by ID',
  tags: ['books']
})
```

## Custom Errors

You can create custom error classes for domain-specific errors:

```typescript
import { PikkuError, addError } from '#pikku/error'

export class BookLimitExceededError extends PikkuError {}
export class InvalidISBNError extends PikkuError {}
export class OutOfStockError extends PikkuError {}

addError(BookLimitExceededError, {
  status: 400,
  message: 'You have reached your book borrowing limit'
})

addError(InvalidISBNError, {
  status: 400,
  message: 'The provided ISBN is not valid'
})

addError(OutOfStockError, {
  status: 409,
  message: 'This book is currently out of stock'
})
```

Then use them in your functions:

```typescript
export const borrowBook = pikkuFunc<{ bookId: string }, BorrowReceipt>({
  func: async ({ database }, data, { session }) => {
    // Check user's borrow limit
    const borrowCount = await database.count('borrows', {
      userId: session.userId,
      returned: false
    })

    if (borrowCount >= 5) {
      throw new BookLimitExceededError()
    }

    // Check stock
    const book = await database.query('book', { id: data.bookId })
    if (book.stock === 0) {
      throw new OutOfStockError()
    }

    // Create borrow record
    return await database.insert('borrows', {
      userId: session.userId,
      bookId: data.bookId,
      borrowedAt: new Date()
    })
  },
  title: 'Borrow a book',
  tags: ['books']
})
```

## Error Messages and Customization

You can override the default error message when throwing:

```typescript
// Use default message
throw new NotFoundError()

// Custom message
throw new NotFoundError('Book with this ISBN does not exist')

// With additional context
const error = new BookLimitExceededError()
error.message = `You have borrowed ${borrowCount} books. Maximum is 5.`
throw error
```

## PikkuError Base Class

All Pikku errors extend `PikkuError`, which handles JavaScript's quirks with Error inheritance across modules and workspaces. This ensures:

- `instanceof` checks work correctly
- Stack traces are preserved
- Error names are properly set
- Errors work consistently in monorepos

Always extend `PikkuError` (not `Error`) when creating custom errors:

```typescript
// ✅ Correct
export class MyCustomError extends PikkuError {}

// ❌ Wrong - may not work properly in all contexts
export class MyCustomError extends Error {}
```

## Protocol-Specific Behavior

Errors are automatically adapted to the protocol being used:

### HTTP
- Status code from `addError()` mapping
- Message in response body
- Logs error details server-side

### WebSocket (Channels)
- Error message sent to client
- Connection stays open
- Error logged server-side

### MCP (AI Agents)
- MCP error code (if specified in `addError()`)
- Descriptive message for AI to understand
- Function call marked as failed

### Queue/Scheduled Tasks
- Error logged
- Task marked as failed
- Can trigger retry logic (if configured)

## Best Practices

1. **Use specific errors** – Prefer `NotFoundError` over generic `BadRequestError`

2. **Document expected errors** – List them in the function's `errors` array so API consumers know what to handle

3. **Provide context** – Customize error messages to help users understand what went wrong

4. **Don't catch and ignore** – Let errors bubble up unless you have a specific reason to catch them

5. **Use built-in errors when possible** – They're already mapped and well-understood

6. **Group related errors** – Create custom errors for your domain (e.g., `PaymentFailedError`, `SubscriptionExpiredError`)

## Summary

Pikku's error system provides:

- **Comprehensive built-in errors** – Covering all standard HTTP status codes
- **Custom error support** – Create domain-specific errors
- **Protocol-agnostic** – Errors work across HTTP, WebSocket, MCP, etc.
- **Type-safe** – Full TypeScript support
- **Automatic mapping** – Status codes and messages handled for you

For more details on error handling in functions, see [Functions](/docs/core-features/functions#error-handling).
