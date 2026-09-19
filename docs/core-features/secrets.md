---
sidebar_position: 25
title: Secrets
description: Type-safe secret management
---

# Secrets

Secrets let you declare what sensitive values your application needs using schemas. The Pikku CLI generates a `TypedSecretService` that wraps your base `SecretService` with compile-time type safety.

## Defining Secrets

Use `defineSecret`, from [`#pikku/secrets`](/api#app/secrets), to declare a secret with its schema:

```typescript
import { defineSecret } from '#pikku/secrets'
import { z } from 'zod'

export const stripeSecretsSchema = z.object({
  apiKey: z.string(),
  webhookSecret: z.string(),
})

defineSecret({
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

`secrets` is confined to `pikkuServices`, `pikkuWireServices`, addon service factories and middleware. It is stripped from the services a function receives, and reaching for it inside a function throws. Read the secret where the service is built and hand the resulting client to your functions:

```typescript
import { pikkuServices } from '#pikku/setup'
import { TypedSecretService } from '#pikku/secrets'
import { LocalSecretService } from '@pikku/core/services'

export const createSingletonServices = pikkuServices(
  async (config, existingServices) => {
    const secrets = new TypedSecretService(
      existingServices.secrets ?? new LocalSecretService(),
    )

    const stripe = await secrets.getSecret('STRIPE_CREDENTIALS')
    // stripe.reveal().apiKey and stripe.reveal().webhookSecret are typed
    const client = new StripeClient(stripe.reveal().apiKey)

    return { config, secrets, stripe: client }
  },
)
```

`getSecret` returns a `SecretValue` wrapper, not the raw value - call `.reveal()` at the point the value reaches the network. The CLI generates the `TypedSecretService` class, which calls are typed through:

```typescript
import { TypedSecretService } from '#pikku/secrets'

const secrets = new TypedSecretService(baseSecretService)
```

## OAuth2 and Credentials

For OAuth2 integrations and per-user credentials, see [Credentials](/docs/wiring/credentials/). Credentials build on top of secrets — the OAuth2 app credentials (client ID, client secret) are stored as secrets, while the credential system handles the authorization flow and token management.

## Using an OAuth2 Token

There's no client class to construct. The credential service owns the token and refreshes it, so a function just asks the wire for it by credential name:

```typescript
const cred = await wire.getCredential?.<{ accessToken: string }>('github')
if (!cred?.accessToken) {
  throw new UnauthorizedError('Connect GitHub first')
}

const response = await fetch('https://api.github.com/user', {
  headers: { Authorization: `Bearer ${cred.accessToken}` },
})
```

See [OAuth2 Credentials](/docs/advanced/oauth2) for who runs the authorization flow and where the tokens end up.

## Best Practices

**Descriptive secretIds**: Use names that clearly identify the secret: `STRIPE_CREDENTIALS`, `GITHUB_OAUTH_APP`, `AWS_S3_CREDENTIALS`.

**Separate OAuth secrets**: Keep app secrets (`secretId`) separate from tokens (`tokenSecretId`). App secrets rarely change; tokens change frequently.

## Managing Secrets with the Console

The [Pikku Console](/docs/console) provides a visual interface for managing secrets per environment. You can view, set, and update secret values — including running OAuth2 authorization flows for credentials like GitHub or Stripe — without touching code or environment files.

See [Console Features](/docs/console/features#secrets) for details.

## Generated Files

The CLI generates typed wrappers in `.pikku/secrets/`:

- `pikku-secret-types.gen.ts` — re-exports `defineSecret` and types
- `pikku-secrets.gen.ts` — `TypedSecretService` with your `CredentialsMap`
- `pikku-secrets-meta.gen.json` — secret metadata for Console and deploy

## Next Steps

- [Variables](./variables.md) — Non-sensitive configuration management
- [Credentials](/docs/wiring/credentials/) — Per-user credentials and OAuth2 flows
