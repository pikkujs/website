---
sidebar_position: 1
title: Bearer Token (JWT)
description: Authenticate requests using JWT bearer tokens in the Authorization header
---

# Bearer Token Authentication

The `authBearer` middleware extracts and validates bearer tokens from the `Authorization` header. It supports two modes: JWT decoding (default) and static token validation.

## Installation

```typescript
import { authBearer } from '@pikku/core/middleware'
```

## JWT Mode (Default)

Decodes the bearer token as a JWT using the `JWTService` from your singleton services:

```typescript
import { authBearer } from '@pikku/core/middleware'

wireHTTP({
  // ...
  middleware: [authBearer()],
})
```

When a request arrives with `Authorization: Bearer <token>`, the middleware:

1. Extracts the token from the `Authorization` header
2. Validates the header format (`Bearer <token>`)
3. Decodes the token using `jwtService.decode()`
4. Sets the decoded payload as the user session

Requires a `JWTService` (e.g., `JoseJWTService` from `@pikku/jose`) in your singleton services.

## Static Token Mode

For simple scenarios where you want to validate against a known token value:

```typescript
wireHTTP({
  // ...
  middleware: [
    authBearer({
      token: {
        value: process.env.API_TOKEN!,
        userSession: { userId: 'system', role: 'admin' },
      },
    }),
  ],
})
```

When the bearer token matches the configured value, the provided `userSession` is set directly. No JWT service is required.

## Behavior

- **Skips** if no `Authorization` header is present (allows unauthenticated routes)
- **Skips** if a session already exists (allows stacking with other auth middleware)
- **Throws `InvalidSessionError`** if the header exists but has an invalid format (not `Bearer <token>`)

## Setting Up JoseJWTService

The `JoseJWTService` from `@pikku/jose` provides JWT signing and verification using the `jose` library:

```typescript
import { JoseJWTService } from '@pikku/jose'

const jwt = new JoseJWTService(
  async () => [
    { id: 'my-key', value: process.env.JWT_SECRET! },
  ],
  logger
)
```

The first argument is an async function that returns an array of signing keys. Each key has an `id` (used as the JWT `kid` header) and a `value`. This supports key rotation — new tokens are signed with the first key, while older tokens can be verified with any listed key.

### JWTService Interface

```typescript
interface JWTService {
  encode<T>(expiresIn: RelativeTimeInput, payload: T): Promise<string>
  decode<T>(hash: string): Promise<T>
}
```

- **`encode`**: Creates a signed JWT with the given expiration and payload
- **`decode`**: Decodes and verifies a JWT, returning the payload
