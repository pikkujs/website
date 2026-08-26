---
sidebar_position: 25
title: Secrets
description: Type-safe secret management
---

# Secrets

Secrets let you declare what sensitive values your application needs using schemas. The Pikku CLI generates a `TypedSecretService` that wraps your base `SecretService` with compile-time type safety.

## Defining Secrets

Use `defineSecret` to declare a secret with its schema:

```typescript
import { defineSecret } from '#pikku'
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

Secrets are read where services are **constructed**, and functions receive the
configured client rather than the vault:

```typescript title="src/services.ts"
export const createSingletonServices = async (config, { secrets }) => {
  const stripeCredentials = (
    await secrets.getSecret<{ apiKey: string; webhookSecret: string }>(
      'STRIPE_CREDENTIALS'
    )
  ).reveal()

  return { stripe: new Stripe(stripeCredentials.apiKey) }
}
```

`getSecret` returns a `SecretValue<T>`, not the value — `.reveal()` is the
deliberate unwrap, and it is what keeps a secret from being stringified into a
log or a response by accident.

```typescript
export const chargeCard = pikkuSessionlessFunc<
  { amount: number },
  { chargeId: string }
>({
  func: async ({ stripe }, data) => {
    const charge = await stripe.charges.create({ amount: data.amount })
    return { chargeId: charge.id }
  },
})
```

### Functions cannot reach `secrets` at all

This is not a convention — it is the type. Every function-, permission- and
auth-facing services type is bounded by `SecretlessServices<Services>`, which is
`Omit<Services, 'secrets'>`. Destructuring `secrets` inside a `pikkuFunc` body
is a compile error, not a lint:

```
Property 'secrets' does not exist on type 'WiredServices'
```

The places that legitimately hold a `SecretService` are the ones that build
things: `pikkuServices`, `pikkuWireServices`, addon service factories, and
middleware. Renaming the service does not get around it — the CLI follows the
type and reports [PKU950](/docs/pikku-cli/errors/pku950) for a `SecretService`
reaching a function under any alias.

A function that genuinely needs to *ask about* a secret — "is this one set?" —
does it through a service of your own that holds `secrets` and exposes only that
question. That is exactly how the Console's addon readiness check is built.

### Typed access

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

const github = new OAuth2Client(
  {
    tokenSecretId: 'GITHUB_TOKENS',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['read:user'],
  },
  'GITHUB_OAUTH_APP',
  secrets
)

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

See [Console Features](/docs/console/features#secrets) for details.

## Generated Files

The CLI generates typed wrappers in `.pikku/secrets/`:

- `pikku-secret-types.gen.ts` — re-exports `defineSecret` and types
- `pikku-secrets.gen.ts` — `TypedSecretService` with your `CredentialsMap`
- `pikku-secrets-meta.gen.json` — secret metadata for Console and deploy

## Next Steps

- [Variables](./variables.md) — Non-sensitive configuration management
- [Credentials](/docs/wiring/credentials/) — Per-user credentials and OAuth2 flows
