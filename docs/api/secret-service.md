---
title: SecretService
---

The SecretService interface provides secure access to secrets and sensitive configuration values in Pikku applications. It abstracts secret retrieval across different environments and cloud providers.

## Methods

### `getSecret(key: string): Promise<string>`

Retrieves a secret value as a string.

- **Parameters:**
  - `key`: The key/name of the secret to retrieve
- **Returns:** Promise resolving to the secret value as a string

### `getSecretJSON<Return = {}>(key: string): Promise<Return>`

Retrieves a secret value and parses it as JSON.

- **Parameters:**
  - `key`: The key/name of the secret to retrieve
- **Returns:** Promise resolving to the parsed JSON object with the specified return type

## Usage Example

```typescript
// Define your secret types
interface DatabaseConfig {
  host: string
  username: string
  password: string
  database: string
}

// Use secrets in your function
const connectToDatabase: CorePikkuFunction<{}, { status: string }> = async (services) => {
  // Get a simple secret
  const apiKey = await services.secrets.getSecret('API_KEY')
  
  // Get a JSON secret
  const dbConfig = await services.secrets.getSecretJSON<DatabaseConfig>('DATABASE_CONFIG')
  
  // Use the secrets
  const connection = await createConnection({
    host: dbConfig.host,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
  })
  
  return { status: 'connected' }
}

// Environment-specific secrets
const getEnvironmentConfig: CorePikkuFunction<{}, { config: any }> = async (services) => {
  // Get secrets that vary by environment
  const jwtSecret = await services.secrets.getSecret('JWT_SECRET')
  const encryptionKey = await services.secrets.getSecret('ENCRYPTION_KEY')
  
  // Parse complex configuration
  const featureFlags = await services.secrets.getSecretJSON<Record<string, boolean>>('FEATURE_FLAGS')
  
  return {
    config: {
      hasJwt: !!jwtSecret,
      hasEncryption: !!encryptionKey,
      features: featureFlags
    }
  }
}
```

## Implementation

Pikku provides several secret service implementations:

### Local Secrets (Development)

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
