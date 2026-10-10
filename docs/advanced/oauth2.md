---
title: OAuth2 Credentials
description: Manage OAuth2 tokens for third-party service integrations
ai: true
---

# OAuth2 Credentials

Pikku provides built-in OAuth2 support for managing access tokens to third-party services like GitHub, Stripe, Google, and Slack. OAuth2 credentials are a special type of [secret](/docs/core-features/secrets) that handle token exchange, refresh, and expiration automatically.

## Defining an OAuth2 Credential

Use `defineCredential` with an `oauth2` block to register an OAuth2 integration:

```typescript @snippet shopCredential
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique identifier for this credential |
| `displayName` | `string` | Human-readable name (shown in UIs that list credentials) |
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

```typescript @snippet co-oauth-app-secret
```

Set this secret with your OAuth app's client ID and secret (via your secret service).

## Who Runs the Flow

You never write the token exchange. The CLI turns every `oauth2` declaration into an entry in the generated `CREDENTIAL_OAUTH2_CONFIGS`, and `@pikku/better-auth` turns those into one provider per credential:

Add `pikkuCredentialOAuth` to the `plugins` array of your Better Auth config, with `config` set to `await credentialOAuthProviders(CREDENTIAL_OAUTH2_CONFIGS, secrets, logger)` (the configs come from the generated `pikku-credentials.gen.js`), plus your `scopeService` and `logger`. Both helpers are exported from `@pikku/better-auth`.

The credential name is the provider id, so linking an account is what makes `getCredential(name)` resolve. `BetterAuthCredentialService` reads the token out of better-auth's `account` table, which refreshes it on read rather than serving a stale one; credentials without an `oauth2` block fall through to whatever `CredentialService` you passed it as a fallback.

A credential whose app secret isn't configured yet is skipped with a warning rather than throwing, so one unset provider doesn't take down auth for everything else.

## Using the Token

Functions read the token off the wire, by credential name:

```typescript @snippet co-credential-read
```

Addons do the same thing inside `pikkuAddonWireServices`, resolving the token once and handing it to the API service — see [Creating Addons](/docs/addon/creating).

`@pikku/core/oauth2` carries the two types involved, `OAuth2AppCredential` and `OAuth2Token`. There is no client class — the refresh lives in the credential service, not in something you construct.

## Token Storage

Tokens are stored by whatever `CredentialService` you wired up — with `@pikku/better-auth` that's better-auth's `account` table. The stored token has the shape of `OAuth2Token`:

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | `string` | The access token for API requests |
| `refreshToken` | `string?` | Token used to obtain new access tokens |
| `expiresAt` | `number?` | Unix timestamp when the access token expires |
| `tokenType` | `string` | Usually `"bearer"` |
| `scope` | `string?` | Granted scopes (may differ from requested) |
