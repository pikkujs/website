---
sidebar_position: 2
title: API Key
description: Authenticate requests using API keys in headers or query parameters
---

# API Key Authentication

The `authAPIKey` middleware extracts API keys from the `x-api-key` header or `apiKey` query parameter and decodes them as JWTs.

## Installation

```typescript
import { authAPIKey } from '@pikku/core/middleware'
```

## Usage

```typescript
import { authAPIKey } from '@pikku/core/middleware'

wireHTTP({
  // ...
  middleware: [authAPIKey({ source: 'header' })],
})
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `source` | `'header' \| 'query' \| 'all'` | Where to look for the API key |

- **`'header'`** — Reads from the `x-api-key` header only
- **`'query'`** — Reads from the `apiKey` query parameter only
- **`'all'`** — Checks the header first, falls back to query parameter

## How It Works

1. Extracts the API key from the configured source
2. Decodes the key as a JWT using `jwtService.decode()`
3. Sets the decoded payload as the user session

This means API keys are JWTs — you generate them with `jwtService.encode()` and the middleware decodes them on each request.

## Behavior

- **Skips** if no API key is found (allows unauthenticated routes)
- **Skips** if a session already exists (allows stacking with other auth middleware)
- Requires a `JWTService` in your singleton services

## Example: Generating API Keys

```typescript
export const createAPIKey = pikkuFunc<{ userId: string }, { apiKey: string }>({
  func: async ({ jwt }, data) => {
    const apiKey = await jwt.encode(
      { value: 365, unit: 'day' },
      { userId: data.userId }
    )
    return { apiKey }
  },
})
```
