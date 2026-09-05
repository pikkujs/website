---
title: CredentialService
ai: true
---

The CredentialService manages dynamic, managed credentials — OAuth tokens, per-user API keys, and other values that change at runtime. This is distinct from the [SecretService](./secret-service), which holds static, developer-configured values. It is registered as the `credentialService` singleton service and backs the [Credentials wiring](/docs/wiring/credentials).

Credentials are addressed by `name` and an optional `userId`: omit `userId` for platform-level credentials, pass it for per-user ones.

## Interface

```typescript reference title="credential-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/credential-service.ts
```

## Methods

### `get<T>(name: string, userId?: string): Promise<T | null>`

Retrieves a credential.

- **Parameters:**
  - `name`: The credential name (e.g. `'stripe'`, `'google-sheets'`)
  - `userId` *(optional)*: User ID for per-user credentials
- **Returns:** Promise resolving to the credential value, or `null` if not found

### `set(name: string, value: unknown, userId?: string): Promise<void>`

Stores a credential.

### `delete(name: string, userId?: string): Promise<void>`

Deletes a credential.

### `has(name: string, userId?: string): Promise<boolean>`

Checks whether a credential exists.

### `getAll(userId: string): Promise<Record<string, unknown>>`

Retrieves all credentials for a user as a name → value record.

### `getUsersWithCredential(name: string): Promise<string[]>`

Lists the user IDs that have a specific credential configured.

### `getAllUsers(): Promise<string[]>`

Lists all user IDs that have any credential configured.

## Usage Example

```typescript
export const connectStripe = pikkuFunc<{ apiKey: string }, void>(
  async (services, data, session) => {
    await services.credentialService.set('stripe', data.apiKey, session.userId)
  }
)

export const chargeCustomer = pikkuFunc<{ amount: number }, void>(
  async (services, data, session) => {
    const apiKey = await services.credentialService.get<string>(
      'stripe',
      session.userId
    )
    if (!apiKey) {
      throw new BadRequestError('Stripe is not connected')
    }
    // ...
  }
)
```

## Implementations

### LocalCredentialService (built-in)

In-memory storage — fine for development, lost on restart.

```typescript
import { LocalCredentialService } from '@pikku/core/services'
const credentialService = new LocalCredentialService()
```

```typescript reference title="local-credential-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-credential-service.ts
```

### KyselyCredentialService

Encrypted SQL storage with envelope encryption and key rotation — see [Storage Backends](/docs/storage/kysely#kyselycredentialservice):

```typescript
import { KyselyCredentialService } from '@pikku/kysely'

const credentialService = new KyselyCredentialService(db.kysely, {
  key: process.env.ENCRYPTION_KEY!,
})
await credentialService.init()
```

### TypedCredentialService (wrapper)

Wraps any `CredentialService` with a typed credential map, so `get('stripe')` returns the declared type instead of `unknown`. The Pikku CLI generates the map from your `defineCredential` declarations.

```typescript reference title="typed-credential-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/typed-credential-service.ts
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  credentialService: new LocalCredentialService(),
})
```
