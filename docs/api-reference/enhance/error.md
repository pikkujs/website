---
title: '#pikku/error'
sidebar_label: '#pikku/error'
sidebar_position: 2
description: 'The errors your functions throw and the HTTP status each one maps to, so a thrown error is part of the contract rather than a stack trace.'
---

# `#pikku/error`

The errors your functions throw and the HTTP status each one maps to, so a thrown error is part of the contract rather than a stack trace.

```typescript
import { addError, isExpectedError, ErrorDetails } from '#pikku/error'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`addError`](#adderror) | function | Registers one of your own error classes with the HTTP status and message it should produce, so throwing it maps to a real response instead of a 500. |
| [`ErrorDetails`](#errordetails) | interface | Types the exports above mention but do not themselves export. Without them a consumer's declaration emit has no name for the type it infers, and fails with TS2883 rather than reaching for the original entry point. |
| [`isExpectedError`](#isexpectederror) | function | A `PikkuError`, or any error carrying `expected: true` — the marker that survives serialization across a workflow step boundary and rehydration as a plain `Error`. Callers log the message alone for these, the full stack for everything else. |
| [`PikkuError`](#pikkuerror) | class |  |
| [`SerializedError`](#serializederror) | interface |  |

## Error classes

Throw one of these and every wiring turns it into its status — HTTP responds with the code, a queue marks the job failed, an agent sees the message.

| Error | Status | Thrown when |
| --- | --- | --- |
| `BadRequestError` | 400 |  |
| `AIProviderAuthError` | 401 |  |
| `InvalidSessionError` | 401 |  |
| `MissingSessionError` | 401 |  |
| `UnauthorizedError` | 401 |  |
| `PaymentRequiredError` | 402 |  |
| `ForbiddenError` | 403 |  |
| `InvalidOriginError` | 403 |  |
| `LocalEnvironmentOnlyError` | 403 |  |
| `MissingCredentialError` | 403 |  |
| `MissingScopeError` | 403 |  |
| `ReadonlySessionError` | 403 |  |
| `NotFoundError` | 404 |  |
| `MethodNotAllowedError` | 405 |  |
| `NotAcceptableError` | 406 |  |
| `ProxyAuthenticationRequiredError` | 407 |  |
| `RequestTimeoutError` | 408 |  |
| `ConflictError` | 409 |  |
| `SystemRoleImmutableError` | 409 | An administrative operation targeted a role that is declared in code. |
| `SystemRoleShadowedError` | 409 | A role was created with the name of a role declared in code. |
| `GoneError` | 410 |  |
| `LengthRequiredError` | 411 |  |
| `PreconditionFailedError` | 412 |  |
| `PayloadTooLargeError` | 413 |  |
| `URITooLongError` | 414 |  |
| `UnsupportedMediaTypeError` | 415 |  |
| `RangeNotSatisfiableError` | 416 |  |
| `ExpectationFailedError` | 417 |  |
| `UnprocessableContentError` | 422 |  |
| `LockedError` | 423 |  |
| `TooManyRequestsError` | 429 |  |
| `InternalServerError` | 500 |  |
| `InvalidMiddlewareWireError` | 500 |  |
| `MissingSchemaError` | 500 |  |
| `MissingServiceError` | 500 |  |
| `PikkuMissingMetaError` | 500 |  |
| `WeakKeyMaterialError` | 500 |  |
| `NotImplementedError` | 501 |  |
| `BadGatewayError` | 502 |  |
| `AIProviderNotConfiguredError` | 503 |  |
| `ServiceUnavailableError` | 503 |  |
| `GatewayTimeoutError` | 504 |  |
| `HTTPVersionNotSupportedError` | 505 |  |
| `MaxComputeTimeReachedError` | 524 |  |

## Reference

### `addError` {#adderror}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/errors`</span>

Registers one of your own error classes with the HTTP status and message it
should produce, so throwing it maps to a real response instead of a 500.

```typescript
addError: (error: any, { status, message, mcpCode }: ErrorDetails) => void
```

<details>
<summary>Config keys (3)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `mcpCode` | `number` | The JSON-RPC code an MCP client is given, where the HTTP status has no equivalent. |
| `message` <sup>required</sup> | `string` | What the caller is told. It leaves the process, so it must not name anything internal. |
| `status` <sup>required</sup> | `number` | The HTTP status this error answers with, instead of a 500. |

</details>

```typescript
export class OutOfStockError extends Error {}

addError(OutOfStockError, {
  status: 409,
  message: 'That item is out of stock',
})
```

### `ErrorDetails` {#errordetails}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/errors`</span>

Types the exports above mention but do not themselves export. Without
them a consumer's declaration emit has no name for the type it infers,
and fails with TS2883 rather than reaching for the original entry point.

<details>
<summary>Config keys (3)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `mcpCode` | `number` | The JSON-RPC code an MCP client is given, where the HTTP status has no equivalent. |
| `message` <sup>required</sup> | `string` | What the caller is told. It leaves the process, so it must not name anything internal. |
| `status` <sup>required</sup> | `number` | The HTTP status this error answers with, instead of a 500. |

</details>

### `isExpectedError` {#isexpectederror}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/errors`</span>

A `PikkuError`, or any error carrying `expected: true` — the marker that
survives serialization across a workflow step boundary and rehydration as a
plain `Error`. Callers log the message alone for these, the full stack for
everything else.

```typescript
isExpectedError: (error: unknown) => boolean
```

```typescript
try {
  await rpc.invoke('onLowStock', {
    itemId: row.itemId,
    name: row.name,
    stock: row.stock,
  })
} catch (error) {
  // An error pikku knows about carries a status and a message meant for
  // the caller; anything else is a bug and belongs on the floor.
  if (!isExpectedError(error)) throw error
  logger.warn({ event: 'low_stock_alert_failed', itemId: row.itemId })
}
```

### `PikkuError` {#pikkuerror}

<span className="api-symbol-meta">class · re-exported from `@pikku/core/errors`</span>

```typescript
PikkuError: new PikkuError(message?: string)
```

### `SerializedError` {#serializederror}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/errors`</span>

<details>
<summary>Config keys (4)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `code` | `string` | The error class's registered name, which is what a caller matches on rather than the message. |
| `expected` | `boolean` |  |
| `message` <sup>required</sup> | `string` | What went wrong, carried across a boundary that cannot carry an Error. |
| `stack` | `string` | Present only where the failure was unexpected; a deliberate error is logged by its message alone. |

</details>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/error` — same 49 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc error` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
