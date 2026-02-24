---
title: OAuth2 Credentials
description: Manage OAuth2 tokens for third-party service integrations
---

# OAuth2 Credentials

Pikku provides built-in OAuth2 support for managing access tokens to third-party services like GitHub, Stripe, Google, and Slack. OAuth2 credentials are a special type of [secret](/docs/core-features/secrets) that handle token exchange, refresh, and expiration automatically.

## Defining an OAuth2 Credential

Use `wireOAuth2Credential` to register an OAuth2 integration:

```typescript
import { wireOAuth2Credential } from '@pikku/core/oauth2'

wireOAuth2Credential({
  name: 'github',
  displayName: 'GitHub',
  description: 'GitHub API access for repository operations',
  secretId: 'github-app-credentials',
  tokenSecretId: 'github-oauth-token',
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  scopes: ['repo', 'read:user'],
})
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique identifier for this credential |
| `displayName` | `string` | Human-readable name (shown in Console) |
| `description` | `string` | What this credential is used for |
| `secretId` | `string` | Secret containing the OAuth2 app credentials (`clientId`, `clientSecret`) |
| `tokenSecretId` | `string` | Secret where access/refresh tokens are stored |
| `authorizationUrl` | `string` | OAuth2 authorization endpoint |
| `tokenUrl` | `string` | OAuth2 token exchange endpoint |
| `scopes` | `string[]` | Requested permission scopes |
| `pkce` | `boolean` | Enable PKCE flow (for public clients without a client secret) |
| `additionalParams` | `Record<string, string>` | Extra parameters for the authorization URL |

## OAuth2 App Credentials

The `secretId` references a secret containing your OAuth2 application credentials:

```typescript
import { wireSecret } from '@pikku/core/secret'

wireSecret({
  name: 'github-app-credentials',
  displayName: 'GitHub App',
  description: 'GitHub OAuth application credentials',
  schema: z.object({
    clientId: z.string(),
    clientSecret: z.string().optional(), // Optional for PKCE flows
  }),
})
```

Set this secret with your OAuth app's client ID and secret (via the Console or your secret service).

## OAuth2Client

The `OAuth2Client` class manages token lifecycle:

```typescript
import { OAuth2Client } from '@pikku/core/oauth2'

const client = new OAuth2Client(
  appCredentials,  // { clientId, clientSecret }
  oauthConfig,     // { tokenUrl, scopes, ... }
  secretService,   // For reading/writing tokens
  tokenSecretId    // Where tokens are stored
)
```

### Token Auto-Refresh

`OAuth2Client` automatically handles token refresh:

- Checks token validity before each request (with 60-second buffer for clock skew)
- Refreshes expired tokens using the stored refresh token
- Prevents concurrent refresh requests using a promise lock
- Falls back to re-authorization if refresh fails

### Making Authenticated Requests

```typescript
// OAuth2Client wraps fetch with automatic token management
const response = await client.request('https://api.github.com/user/repos', {
  method: 'GET',
  headers: { 'Accept': 'application/json' },
})
```

If the access token has expired, `OAuth2Client` refreshes it before making the request. If the request returns a 401, it refreshes and retries once.

## Console Integration

The [Pikku Console](/docs/console) provides a UI for managing OAuth2 credentials:

1. **Connect** — Initiates the OAuth2 flow, opening the provider's authorization page
2. **Status** — Shows whether the credential is connected, token expiration, and scope information
3. **Refresh** — Manually triggers a token refresh
4. **Disconnect** — Clears stored tokens

This makes it easy to set up third-party integrations per environment without writing custom OAuth flows.

## PKCE Support

For public clients (e.g., CLI tools or SPAs) that can't securely store a client secret, enable PKCE:

```typescript
wireOAuth2Credential({
  name: 'google',
  displayName: 'Google',
  secretId: 'google-app-credentials',
  tokenSecretId: 'google-oauth-token',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  scopes: ['openid', 'email', 'profile'],
  pkce: true,
})
```

With PKCE enabled, the `clientSecret` in your app credentials is optional.

## Token Storage

OAuth2 tokens are stored as secrets via your `SecretService`. The token object contains:

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | `string` | The access token for API requests |
| `refreshToken` | `string` | Token used to obtain new access tokens |
| `expiresAt` | `number` | Unix timestamp when the access token expires |
| `tokenType` | `string` | Usually `"bearer"` |
| `scope` | `string` | Granted scopes (may differ from requested) |
