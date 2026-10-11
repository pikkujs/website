---
title: SecretService
---

The SecretService provides secure access to secrets and sensitive configuration values. It abstracts secret retrieval across different environments and cloud providers, so the code that reads a secret doesn't need to know where it lives.

## Methods

### `getSecret<T = string>(key: string): Promise<SecretValue<T>>`

Retrieves a secret by key, typed as `T` (defaults to `string`) and wrapped in a
`SecretValue<T>`. Unwrap it deliberately with `.reveal()` where the value reaches
the wire — the wrapper is nominal, so it is not assignable to `string` and every
concrete sink rejects it. Throws if the secret is not found, unless `defineSecret`
declared it `optional`, in which case absence resolves to `undefined`.

- **Parameters:**
  - `key`: The key/name of the secret
- **Returns:** Promise resolving to the secret wrapped as `SecretValue<T>`

### `hasSecret(key: string): Promise<boolean>`

Checks if a secret exists without throwing.

### `setSecret(key: string, value: unknown): Promise<void>`

Stores a secret value.

### `deleteSecret(key: string): Promise<void>`

Deletes a secret by key.

### `getSecrets<T extends Record<string, unknown>>(keys: (keyof T & string)[]): Promise<Partial<SecretValues<T>>>`

Retrieves multiple secrets in a single batch operation. Returns a map of key →
`SecretValue` for successfully fetched secrets; missing keys are omitted rather
than throwing, so callers must handle keys that may be absent at runtime.

`getSecrets` takes a list of ids and returns an object keyed by id, so `getSecrets(['FOO', 'BAR'])` gives you `values.FOO` and `values.BAR`. Each entry is a wrapper (or undefined when missing): call `reveal()` to read the value.

## Usage Example

`secrets` is stripped from the services a function receives, so read secrets in a
service factory (or middleware) and hand the resolved value to a service:

```typescript @snippet co-secret-client
```

## Implementations

### Local (development)

`LocalSecretService` from `@pikku/core/services`. Keeps values `setSecret` wrote
to it in memory and falls back to environment variables through the variables
service:

Source: [`local-secrets.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-secrets.ts)

### AWS Secrets Manager

`AWSSecrets` from `@pikku/aws-services`:

Source: [`aws-secrets.ts`](https://github.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/aws-secrets.ts)

## Interface

Source: [`secret-service.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/secret-service.ts)
