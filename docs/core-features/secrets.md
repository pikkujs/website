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
import { TypedSecretService } from './.pikku/secrets/pikku-secrets.gen.js'

const secrets = new TypedSecretService(baseSecretService)
```

## OAuth2 and Credentials

For OAuth2 integrations and per-user credentials, see [Credentials](/docs/wiring/credentials/). Credentials build on top of secrets — the OAuth2 app credentials (client ID, client secret) are stored as secrets, while the credential system handles the authorization flow and token management.

## OAuth2 Client

Use `OAuth2Client` from `@pikku/core/oauth2` to make authenticated requests with automatic token refresh:

```typescript
import { OAuth2Client } from '@pikku/core/oauth2'

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

## Managing Secrets with the Console

The [Pikku Console](/docs/console) provides a visual interface for managing secrets per environment. You can view, set, and update secret values — including running OAuth2 authorization flows for credentials like GitHub or Stripe — without touching code or environment files.

See [Console Features](/docs/console/features#configuration) for details.

## Generated Files

The CLI generates typed wrappers in `.pikku/secrets/`:

- `pikku-secret-types.gen.ts` — re-exports `wireSecret` and types
- `pikku-secrets.gen.ts` — `TypedSecretService` with your `CredentialsMap`
- `pikku-secrets-meta.gen.json` — secret metadata for Console and deploy

## Next Steps

- [Variables](./variables.md) — Non-sensitive configuration management
- [Credentials](/docs/wiring/credentials/) — Per-user credentials and OAuth2 flows
