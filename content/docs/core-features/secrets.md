---
sidebar_position: 25
title: Secrets
description: Type-safe secret management
---

# Secrets

Secrets let you declare what sensitive values your application needs using schemas. The Pikku CLI generates a `TypedSecretService` that wraps your base `SecretService` with compile-time type safety.

## Defining Secrets

Use `defineSecret`, from [`#pikku/secrets`](/api#app/secrets), to declare a secret with its schema:

```typescript @snippet secrets
```

Schemas are defined using [Zod](https://zod.dev).

The `secretId` is the key used to look up the secret from your secret store.

## Using Secrets

`secrets` is confined to `pikkuServices`, `pikkuWireServices`, addon service factories and middleware. It is stripped from the services a function receives, and reaching for it inside a function throws. Read the secret where the service is built and hand the resulting client to your functions:

```typescript @snippet co-secret-client
```

`getSecret` returns a `SecretValue` wrapper, not the raw value - call `.reveal()` at the point the value reaches the network. The CLI generates the `TypedSecretService` class, which calls are typed through:

Wrap your base secret service in the generated typed one: `new TypedSecretService(baseSecretService)`, imported from `#pikku/secrets`.

## OAuth2 and Credentials

For OAuth2 integrations and per-user credentials, see [Credentials](/docs/wiring/credentials/). Credentials build on top of secrets — the OAuth2 app credentials (client ID, client secret) are stored as secrets, while the credential system handles the authorization flow and token management.

## Using an OAuth2 Token

There's no client class to construct. The credential service owns the token and refreshes it, so a function just asks the wire for it by credential name:

```typescript @snippet co-credential-read
```

See [OAuth2 Credentials](/docs/advanced/oauth2) for who runs the authorization flow and where the tokens end up.

## Best Practices

**Descriptive secretIds**: Use names that clearly identify the secret: `STRIPE_CREDENTIALS`, `GITHUB_OAUTH_APP`, `AWS_S3_CREDENTIALS`.

**Separate OAuth secrets**: Keep app secrets (`secretId`) separate from tokens (`tokenSecretId`). App secrets rarely change; tokens change frequently.

## Generated Files

The CLI generates typed wrappers in `.pikku/secrets/`:

- `pikku-secret-types.gen.ts` — re-exports `defineSecret` and types
- `pikku-secrets.gen.ts` — `TypedSecretService` with your `CredentialsMap`
- `pikku-secrets-meta.gen.json` — secret metadata for deploy

## Next Steps

- [Variables](/docs/core-features/variables) — Non-sensitive configuration management
- [Credentials](/docs/wiring/credentials/) — Per-user credentials and OAuth2 flows
