---
sidebar_position: 25
title: Secrets
description: Type-safe secret management
---

# Secrets

Secrets let you declare what sensitive values your application needs using schemas. The Pikku CLI generates a `TypedSecretService` that wraps your base `SecretService` with compile-time type safety.

## Defining Secrets

Use `wireSecret` to declare a secret with its schema:

```typescript
import { wireSecret } from '#pikku'
import { z } from 'zod'

export const stripeSecretsSchema = z.object({
  apiKey: z.string(),
  webhookSecret: z.string(),
})

wireSecret({
  name: 'stripe',
  displayName: 'Stripe API',
  description: 'API keys for Stripe payment processing',
  secretId: 'STRIPE_CREDENTIALS',
  schema: stripeSecretsSchema,
})
```

Schemas are defined using [Zod](https://zod.dev).

The `secretId` is the key used to look up the secret from your secret store.

## Using Secrets

Access secrets through the `secrets` service. When you use the generated `TypedSecretService`, calls are fully typed:

```typescript
export const chargeCard = pikkuSessionlessFunc<
  { amount: number },
  { chargeId: string }
>({
  func: async ({ secrets }, data) => {
    const stripe = await secrets.getSecretJSON('STRIPE_CREDENTIALS')
    // stripe.apiKey and stripe.webhookSecret are typed

    return { chargeId: '...' }
  },
})
```

The CLI generates a `TypedSecretService` class that wraps your `SecretService` implementation. Use it when creating your singleton services to get typed access:

```typescript
import { TypedSecretService } from '.pikku/pikku-types.gen.js'

const secrets = new TypedSecretService(new LocalSecretService())
```

## OAuth2 Secrets

For OAuth2 integrations, use `wireOAuth2Credential`:

```typescript
import { wireOAuth2Credential } from '#pikku'

wireOAuth2Credential({
  name: 'github',
  displayName: 'GitHub OAuth',
  description: 'GitHub OAuth2 integration',
  secretId: 'GITHUB_OAUTH_APP',
  tokenSecretId: 'GITHUB_OAUTH_TOKENS',
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  scopes: ['read:user', 'repo'],
})
```

OAuth2 secrets have two secret IDs:
- `secretId` — Stores the OAuth app secrets (client ID, client secret)
- `tokenSecretId` — Stores the access/refresh tokens

## OAuth2 Client

Use `OAuth2Client` to make authenticated requests with automatic token refresh:

```typescript
import { OAuth2Client } from '#pikku'

const github = new OAuth2Client({
  secretService: secrets,
  credential: githubOAuthConfig,
})

// Makes authenticated request, refreshes token if expired
const response = await github.request('https://api.github.com/user')
```

The client handles:
- Adding authorization headers
- Detecting expired tokens
- Refreshing tokens automatically
- Retrying failed requests after refresh

## Best Practices

**Descriptive secretIds**: Use names that clearly identify the secret: `STRIPE_CREDENTIALS`, `GITHUB_OAUTH_APP`, `AWS_S3_CREDENTIALS`.

**Separate OAuth secrets**: Keep app secrets (`secretId`) separate from tokens (`tokenSecretId`). App secrets rarely change; tokens change frequently.

## Next Steps

- [Variables](./variables.md) — Non-sensitive configuration management
