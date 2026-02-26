---
title: JWTService
---

The JWTService encodes and decodes JSON Web Tokens. It's typically used in middleware to issue tokens on login and validate them on subsequent requests.

## Methods

### `encode<T>(expiresIn: RelativeTimeInput, payload: T): Promise<string>`

Encodes a payload into a signed JWT with expiration.

- **Parameters:**
  - `expiresIn`: How long until the token expires (e.g. `'15m'`, `'7d'`)
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

  const token = await services.jwt.encode<UserTokenPayload>('24h', {
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { token }
})

// Validate a token (typically done in middleware, not in functions directly)
const payload = await services.jwt.decode<UserTokenPayload>(
  token,
  new UnauthorizedError('Invalid or expired token')
)
```

## Relative Time Formats

```typescript
await services.jwt.encode('30s', payload)  // 30 seconds
await services.jwt.encode('15m', payload)  // 15 minutes
await services.jwt.encode('2h', payload)   // 2 hours
await services.jwt.encode('7d', payload)   // 7 days
await services.jwt.encode('1w', payload)   // 1 week
```

## Implementation

Pikku provides a JOSE-based implementation:

```typescript reference title="jose-jwt-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/jose/src/jose-jwt-service.ts
```

## Interface

```typescript reference title="jwt-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/jwt-service.ts
```
