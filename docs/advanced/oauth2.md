---
title: OAuth2 Credentials
description: Manage OAuth2 tokens for third-party service integrations
ai: true
---

# OAuth2 Credentials

Pikku provides built-in OAuth2 support for managing access tokens to third-party services like GitHub, Stripe, Google, and Slack. OAuth2 credentials are a special type of [secret](/docs/core-features/secrets) that handle token exchange, refresh, and expiration automatically.

## Defining an OAuth2 Credential

Use `defineCredential` with an `oauth2` block to register an OAuth2 integration:

```typescript
import { z } from 'zod'
import { defineCredential } from '#pikku/auth'

export const githubTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
})

defineCredential({
  name: 'github',
  displayName: 'GitHub',
  description: 'GitHub API access for repository operations',
  type: 'wire',
  schema: githubTokenSchema,
  oauth2: {
    appCredentialSecretId: 'GITHUB_OAUTH_APP',
    tokenSecretId: 'GITHUB_OAUTH_TOKENS',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['repo', 'read:user'],
  },
})
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique identifier for this credential |
| `displayName` | `string` | Human-readable name (shown in Console) |
| `description` | `string` | What this credential is used for |
| `type` | `'singleton' \| 'wire'` | `'singleton'` for one platform-level credential, `'wire'` for per-user credentials |
| `schema` | Zod schema | Shape of the stored token/credential value |
| `oauth2.appCredentialSecretId` | `string` | Secret containing the OAuth2 app credentials (`clientId`, `clientSecret`) |
| `oauth2.tokenSecretId` | `string` | Secret where access/refresh tokens are stored |
| `oauth2.authorizationUrl` | `string` | OAuth2 authorization endpoint |
| `oauth2.tokenUrl` | `string` | OAuth2 token exchange endpoint |
| `oauth2.scopes` | `string[]` | Requested permission scopes |
| `oauth2.pkce` | `boolean` | Enable PKCE flow (for public clients without a client secret) |
| `oauth2.additionalParams` | `Record<string, string>` | Extra parameters for the authorization URL |

## OAuth2 App Credentials

The `appCredentialSecretId` references a secret containing your OAuth2 application credentials:

```typescript
import { defineSecret } from '#pikku/secrets'

defineSecret({
  name: 'githubOAuthApp',
  displayName: 'GitHub OAuth App',
  description: 'GitHub OAuth application credentials',
  secretId: 'GITHUB_OAUTH_APP',
  schema: z.object({
    clientId: z.string(),
    clientSecret: z.string().optional(), // Optional for PKCE flows
  }),
})
```

Set this secret with your OAuth app's client ID and secret (via the Console or your secret service).

## Who Runs the Flow

You never write the token exchange. The CLI turns every `oauth2` declaration into an entry in the generated `CREDENTIAL_OAUTH2_CONFIGS`, and `@pikku/better-auth` turns those into one provider per credential:

```typescript title="auth.ts"
import { pikkuCredentialOAuth, credentialOAuthProviders } from '@pikku/better-auth'
import { CREDENTIAL_OAUTH2_CONFIGS } from '#pikku/credentials/pikku-credentials.gen.js'

plugins: [
  pikkuCredentialOAuth({
    config: await credentialOAuthProviders(
      CREDENTIAL_OAUTH2_CONFIGS,
      secrets,
      logger
    ),
    scopeService,
    logger,
  }),
]
```

The credential name is the provider id, so linking an account is what makes `getCredential(name)` resolve. `BetterAuthCredentialService` reads the token out of better-auth's `account` table, which refreshes it on read rather than serving a stale one; credentials without an `oauth2` block fall through to whatever `CredentialService` you passed it as a fallback.

A credential whose app secret isn't configured yet is skipped with a warning rather than throwing, so one unset provider doesn't take down auth for everything else.

## Using the Token

Functions read the token off the wire, by credential name:

```typescript
import { pikkuFunc } from '#pikku/function'
import { UnauthorizedError } from '#pikku/error'

export const listRepos = pikkuFunc<void, { names: string[] }>({
  func: async (services, _data, wire) => {
    const cred = await wire.getCredential?.<{ accessToken: string }>('github')
    if (!cred?.accessToken) {
      throw new UnauthorizedError('Connect GitHub first')
    }

    const response = await fetch('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${cred.accessToken}` },
    })
    const repos = (await response.json()) as Array<{ name: string }>
    return { names: repos.map((repo) => repo.name) }
  },
})
```

Addons do the same thing inside `pikkuAddonWireServices`, resolving the token once and handing it to the API service — see [Creating Addons](/docs/addon/creating).

`@pikku/core/oauth2` carries the two types involved, `OAuth2AppCredential` and `OAuth2Token`. There is no client class — the refresh lives in the credential service, not in something you construct.

## Console Integration

The [Pikku Console](/docs/console) provides a UI for managing OAuth2 credentials:

1. **Connect** — Initiates the OAuth2 flow, opening the provider's authorization page
2. **Status** — Shows whether the credential is connected, token expiration, and scope information
3. **Refresh** — Manually triggers a token refresh
4. **Disconnect** — Clears stored tokens

This makes it easy to set up third-party integrations per environment without writing custom OAuth flows.

## Token Storage

Tokens are stored by whatever `CredentialService` you wired up — with `@pikku/better-auth` that's better-auth's `account` table. The stored token has the shape of `OAuth2Token`:

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | `string` | The access token for API requests |
| `refreshToken` | `string` | Token used to obtain new access tokens |
| `expiresAt` | `number` | Unix timestamp when the access token expires |
| `tokenType` | `string` | Usually `"bearer"` |
| `scope` | `string` | Granted scopes (may differ from requested) |
