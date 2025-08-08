---
title: JWTService
---

The JWTService interface provides JSON Web Token (JWT) encoding and decoding capabilities in Pikku applications. It handles token creation, validation, and payload extraction with configurable expiration times.

## Methods

### `encode<T>(expiresIn: RelativeTimeInput, payload: T): Promise<string>`

Encodes a payload into a signed JWT with expiration.

- **Parameters:**
  - `expiresIn`: The expiration time for the token (relative time input)
  - `payload`: The data to encode in the token
- **Returns:** Promise resolving to the encoded JWT string

### `decode<T>(hash: string, invalidHashError?: Error, debug?: boolean): Promise<T>`

Decodes and validates a JWT, returning the payload.

- **Parameters:**
  - `hash`: The JWT string to decode
  - `invalidHashError`: Optional custom error to throw if the token is invalid
  - `debug`: Optional flag for debugging token validation
- **Returns:** Promise resolving to the decoded payload
- **Throws:** Error if the token is invalid, expired, or malformed

## Usage Example

```typescript
// Define your token payload types
interface UserTokenPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
}

interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
}

// Create and validate tokens
const authService: CorePikkuFunction<
  { email: string; password: string },
  { accessToken: string; refreshToken: string }
> = async (services, data) => {
  // Validate user credentials (implementation not shown)
  const user = await validateUserCredentials(data.email, data.password)
  
  // Create access token (expires in 15 minutes)
  const accessPayload: UserTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  }
  const accessToken = await services.jwt.encode('15m', accessPayload)
  
  // Create refresh token (expires in 7 days)
  const refreshPayload: RefreshTokenPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion
  }
  const refreshToken = await services.jwt.encode('7d', refreshPayload)
  
  return { accessToken, refreshToken }
}

// Validate and use tokens
const protectedEndpoint: CorePikkuFunction<
  { data: string },
  { message: string; user: UserTokenPayload }
> = async (services, data) => {
  // Get token from request header
  const authHeader = services.http.request?.header('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No valid authorization header')
  }
  
  const token = authHeader.substring(7)
  
  // Decode and validate token
  try {
    const payload = await services.jwt.decode<UserTokenPayload>(
      token,
      new Error('Invalid or expired token')
    )
    
    // Use the payload data
    return {
      message: `Hello ${payload.email}`,
      user: payload
    }
  } catch (error) {
    throw new Error('Authentication failed')
  }
}

// Refresh token endpoint
const refreshTokens: CorePikkuFunction<
  { refreshToken: string },
  { accessToken: string }
> = async (services, data) => {
  // Validate refresh token
  const refreshPayload = await services.jwt.decode<RefreshTokenPayload>(
    data.refreshToken,
    new Error('Invalid refresh token')
  )
  
  // Get user and verify token version
  const user = await getUserById(refreshPayload.userId)
  if (user.tokenVersion !== refreshPayload.tokenVersion) {
    throw new Error('Refresh token has been invalidated')
  }
  
  // Create new access token
  const newAccessPayload: UserTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  }
  const accessToken = await services.jwt.encode('15m', newAccessPayload)
  
  return { accessToken }
}
```

## Relative Time Input

The `expiresIn` parameter accepts various time formats:

```typescript
// Examples of valid RelativeTimeInput values
await services.jwt.encode('15m', payload)    // 15 minutes
await services.jwt.encode('2h', payload)     // 2 hours  
await services.jwt.encode('7d', payload)     // 7 days
await services.jwt.encode('1w', payload)     // 1 week
await services.jwt.encode('30s', payload)    // 30 seconds
```

## Implementation

Pikku provides a JOSE (JSON Web Signature and Encryption) implementation:

```typescript reference title="jose-jwt-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/jose/src/jose-jwt-service.ts
```

## Interface

```typescript reference title="jwt-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/jwt-service.ts
```
