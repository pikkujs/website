---
title: JWTService
---

The JWTService encodes and decodes JSON Web Tokens. It's typically used in middleware to issue tokens on login and validate them on subsequent requests.

## Methods

### `encode<T>(expiresIn: RelativeTimeInput, payload: T): Promise<string>`

Encodes a payload into a signed JWT with expiration.

- **Parameters:**
  - `expiresIn`: How long until the token expires, as a `{ value, unit }` pair (see below)
  - `payload`: The data to encode
- **Returns:** Promise resolving to the JWT string

### `decode<T>(token: string, invalidTokenError?: Error, debug?: boolean): Promise<T>`

Decodes and validates a JWT, returning the payload.

- **Parameters:**
  - `token`: The JWT string to decode
  - `invalidTokenError`: Optional custom error to throw if invalid
  - `debug`: Optional flag for verbose validation logging
- **Returns:** Promise resolving to the decoded payload
- **Throws:** If the token is invalid, expired, or malformed

## Usage Example

```typescript
interface UserTokenPayload {
  userId: string
  email: string
  role: string
}

// Issue a token on login
export const login = pikkuFunc<
  { email: string; password: string },
  { token: string }
>(async (services, data) => {
  const user = await services.db.getUserByEmail(data.email)
  if (!user || !await services.db.verifyPassword(data.password, user.passwordHash)) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const token = await services.jwt.encode<UserTokenPayload>(
    { value: 24, unit: 'hour' },
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    }
  )

  return { token }
})

// Validate a token (typically done in middleware, not in functions directly)
const payload = await services.jwt.decode<UserTokenPayload>(
  token,
  new UnauthorizedError('Invalid or expired token')
)
```

## Relative Time Format

`expiresIn` is a `RelativeTimeInput` — `{ value: number, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'year' }` — exported from `@pikku/core/utils`:

```typescript
await services.jwt.encode({ value: 30, unit: 'second' }, payload) // 30 seconds
await services.jwt.encode({ value: 15, unit: 'minute' }, payload) // 15 minutes
await services.jwt.encode({ value: 2, unit: 'hour' }, payload)    // 2 hours
await services.jwt.encode({ value: 7, unit: 'day' }, payload)     // 7 days
await services.jwt.encode({ value: 1, unit: 'week' }, payload)    // 1 week
```

## Implementation

Pikku provides a JOSE-based implementation:

```typescript reference title="jose-jwt-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/jose/src/jose-jwt-service.ts
```

## Interface

```typescript reference title="jwt-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/jwt-service.ts
```
