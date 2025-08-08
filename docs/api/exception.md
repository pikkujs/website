---
title: Exceptions
---

Pikku provides a comprehensive set of HTTP-based exception classes that automatically map to appropriate HTTP status codes. These exceptions integrate with Pikku's error handling system and provide consistent error responses across your API.

## Base Exception Class

### `PikkuError`

The base class for all Pikku exceptions, extending the standard JavaScript Error class.

```typescript
class PikkuError extends Error {
  constructor(message: string = 'An error occurred')
}
```

## Common HTTP Exceptions

### Client Error Exceptions (4xx)

#### `BadRequestError` - 400
The server cannot process the request due to client error (malformed syntax, invalid parameters, etc.).

#### `UnauthorizedError` - 401  
Authentication is required and has failed or not been provided.

#### `MissingSessionError` - 401
More specific unauthorized error indicating no session was provided.

#### `InvalidSessionError` - 401
More specific unauthorized error indicating the provided session is invalid.

#### `ForbiddenError` - 403
The client lacks permission to access the requested resource.

#### `InvalidOriginError` - 403
The request was made from an origin not permitted to access the resource.

#### `NotFoundError` - 404
The server cannot find the requested resource.

#### `MethodNotAllowedError` - 405
The request method is not supported by the resource.

#### `ConflictError` - 409
Request conflicts with the current state of the target resource.

#### `UnprocessableContentError` - 422
Server understood the request but couldn't process the contained instructions.

#### `TooManyRequestsError` - 429
Rate limiting - too many requests sent in a given time period.

### Server Error Exceptions (5xx)

#### `InternalServerError` - 500
Generic server error when no more specific message is suitable.

#### `NotImplementedError` - 501
Server doesn't recognize the request method and cannot support it.

#### `BadGatewayError` - 502
Server acting as gateway received invalid response from upstream server.

#### `ServiceUnavailableError` - 503
Server is currently unavailable (overloaded or down for maintenance).

#### `GatewayTimeoutError` - 504
Server acting as gateway didn't receive timely response from upstream server.

## Usage Examples

```typescript
import { 
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError
} from '@pikku/core'

// Validate input and throw appropriate errors
const createUser: CorePikkuFunction<
  { email: string; password: string },
  { userId: string }
> = async (services, data, session) => {
  // Validate input
  if (!data.email || !data.password) {
    throw new BadRequestError('Email and password are required')
  }
  
  if (!isValidEmail(data.email)) {
    throw new BadRequestError('Invalid email format')
  }
  
  // Check if user already exists
  const existingUser = await services.database.getUserByEmail(data.email)
  if (existingUser) {
    throw new ConflictError('User with this email already exists')
  }
  
  try {
    const userId = await services.database.createUser(data)
    return { userId }
  } catch (error) {
    throw new InternalServerError('Failed to create user')
  }
}

// Authentication and authorization
const getProtectedResource: CorePikkuFunction<
  { resourceId: string },
  { data: any }
> = async (services, data, session) => {
  // Check authentication
  if (!session) {
    throw new UnauthorizedError('Authentication required')
  }
  
  // Get resource
  const resource = await services.database.getResource(data.resourceId)
  if (!resource) {
    throw new NotFoundError('Resource not found')
  }
  
  // Check authorization
  if (resource.ownerId !== session.userId && session.role !== 'admin') {
    throw new ForbiddenError('Access denied to this resource')
  }
  
  return { data: resource }
}

// Rate limiting example
const rateLimitedEndpoint: CorePikkuFunction<
  { message: string },
  { result: string }
> = async (services, data, session) => {
  const rateLimitKey = `rate_limit:${session?.userId || 'anonymous'}`
  const requests = await services.cache.get(rateLimitKey) || 0
  
  if (requests >= 100) {
    throw new TooManyRequestsError('Rate limit exceeded. Try again later.')
  }
  
  await services.cache.set(rateLimitKey, requests + 1, { ttl: 3600 })
  
  return { result: 'Success' }
}
```

## Custom Error Messages

You can provide custom error messages when throwing exceptions:

```typescript
// Default message
throw new BadRequestError()

// Custom message
throw new BadRequestError('Username must be at least 3 characters long')

// Dynamic message
throw new NotFoundError(`User with ID ${userId} not found`)
```

## Error Handling Integration

Pikku automatically converts thrown exceptions to appropriate HTTP responses:

```typescript
// This function throws a BadRequestError
const validateData: CorePikkuFunction<{ age: number }, { valid: boolean }> = async (services, data) => {
  if (data.age < 0) {
    throw new BadRequestError('Age cannot be negative')
  }
  return { valid: true }
}

// When called via HTTP, this automatically returns:
// HTTP 400 Bad Request
// {
//   "error": "Age cannot be negative"
// }
```

## Error Response Structure

All Pikku exceptions automatically generate consistent error responses:

```typescript
// Exception thrown in function
throw new ForbiddenError('Insufficient permissions')

// Automatically becomes HTTP response:
// Status: 403 Forbidden
// Body: {
//   "error": "Insufficient permissions"
// }
```

## Error Registration

Pikku maintains an internal registry of error types and their HTTP status codes. You can also register custom errors:

```typescript
import { PikkuError, addError } from '@pikku/core'

class CustomBusinessError extends PikkuError {}

// Register with custom status code
addError(CustomBusinessError, {
  status: 422,
  message: 'Business rule violation'
})
```

## Interface

```typescript reference title="error-handler.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/errors/error-handler.ts
```

## Complete Error List

```typescript reference title="errors.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/errors/errors.ts
```