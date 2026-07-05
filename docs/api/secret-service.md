---
title: SecretService
---

The SecretService provides secure access to secrets and sensitive configuration values. It abstracts secret retrieval across different environments and cloud providers, so your functions don't need to know where secrets live.

## Methods

### `getSecret<T = string>(key: string): Promise<T>`

Retrieves a secret by key, typed as `T` (defaults to `string`). Throws if the secret is not found.

- **Parameters:**
  - `key`: The key/name of the secret
- **Returns:** Promise resolving to the secret value typed as `T`

### `hasSecret(key: string): Promise<boolean>`

Checks if a secret exists without throwing.

### `setSecret(key: string, value: unknown): Promise<void>`

Stores a secret value.

### `deleteSecret(key: string): Promise<void>`

Deletes a secret by key.

### `getSecrets<T extends Record<string, unknown>>(keys: (keyof T & string)[]): Promise<Partial<T>>`

Retrieves multiple secrets in a single batch operation. Returns a map of key → value for successfully fetched secrets; missing keys are omitted rather than throwing, so callers must handle keys that may be absent at runtime.

```typescript
const { FOO, BAR } = await secrets.getSecrets<{ FOO: string; BAR: { id: string } }>(['FOO', 'BAR'])
```

## Usage Example

```typescript
interface DatabaseConfig {
  host: string
  username: string
  password: string
  database: string
}

export const connectToDatabase = pikkuFunc<void, { status: string }>(
  async (services) => {
    const dbConfig = await services.secrets.getSecret<DatabaseConfig>('DATABASE_CONFIG')

    const connection = await createConnection({
      host: dbConfig.host,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
    })

    return { status: 'connected' }
  }
)
```

## Implementations

### Local (development)

Reads from a local `.secrets` file or environment variables:

```typescript reference title="local-secrets.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-secrets.ts
```

### AWS Secrets Manager

```typescript reference title="aws-secrets.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/aws-secrets.ts
```

## Interface

```typescript reference title="secret-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/secret-service.ts
```
