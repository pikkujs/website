---
title: SecretService
---

The SecretService provides secure access to secrets and sensitive configuration values. It abstracts secret retrieval across different environments and cloud providers, so your functions don't need to know where secrets live.

## Methods

### `getSecret(key: string): Promise<string>`

Retrieves a secret value as a string.

- **Parameters:**
  - `key`: The key/name of the secret
- **Returns:** Promise resolving to the secret value

### `getSecretJSON<T>(key: string): Promise<T>`

Retrieves a secret and parses it as JSON.

- **Parameters:**
  - `key`: The key/name of the secret
- **Returns:** Promise resolving to the parsed object typed as `T`

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
    const dbConfig = await services.secrets.getSecretJSON<DatabaseConfig>('DATABASE_CONFIG')

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
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/local-secrets.ts
```

### AWS Secrets Manager

```typescript reference title="aws-secrets.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/aws-secrets.ts
```

## Interface

```typescript reference title="secret-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/secret-service.ts
```
