---
sidebar_position: 11
title: Credentials
description: Per-user and platform-level credentials with OAuth2 support
ai: true
---

# Credentials

Credentials let you define typed, per-user or platform-level secrets that your functions and AI agents need at runtime — API keys, OAuth2 tokens, or any structured config that varies by user or tenant.

The CLI picks up `wireCredential()` calls, generates typed wrappers, and makes them available through the credential service. When an AI agent calls a tool that needs a credential the user hasn't connected yet, Pikku automatically suspends the agent run and signals the client to collect it.

## Defining a Credential

Use `wireCredential` from `@pikku/core/credential`. The call itself is a no-op at runtime — the CLI reads it via AST and generates metadata.

```typescript
import { wireCredential } from '@pikku/core/credential'
import { z } from 'zod'

wireCredential({
  name: 'stripe',
  displayName: 'Stripe API Key',
  description: 'API key for Stripe payment processing',
  type: 'wire',
  schema: z.object({ apiKey: z.string() }),
})
```

### Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ | Unique identifier for the credential |
| `displayName` | `string` | ✅ | Human-readable name (shown in Console and auth flows) |
| `description` | `string` | ❌ | Explains what this credential is for |
| `type` | `'singleton' \| 'wire'` | ✅ | Scope — see below |
| `schema` | Zod schema | ✅ | Shape of the credential data |
| `oauth2` | `object` | ❌ | OAuth2 flow configuration — see [OAuth2 Credentials](#oauth2-credentials) |

### Credential Types

**`wire`** — per-user credentials. Each user (or session) has their own value. Use this for things like personal API keys or per-user OAuth tokens.

**`singleton`** — platform-level credentials. One value shared across the entire app. Use this for credentials your platform owns, like your Slack bot token.

## OAuth2 Credentials

For services that use OAuth2, add an `oauth2` block. Pikku handles the authorization flow, token exchange, and refresh.

```typescript
wireCredential({
  name: 'google-sheets',
  displayName: 'Google Sheets',
  type: 'wire',
  schema: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
  }),
  oauth2: {
    appCredentialSecretId: 'GOOGLE_OAUTH_APP',
    tokenSecretId: 'GOOGLE_OAUTH_TOKENS',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  },
})
```

### OAuth2 Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `appCredentialSecretId` | `string` | ✅ | Secret ID where the OAuth app's client ID and client secret are stored |
| `tokenSecretId` | `string` | ✅ | Secret ID where exchanged tokens are persisted |
| `authorizationUrl` | `string` | ✅ | OAuth2 authorization endpoint |
| `tokenUrl` | `string` | ✅ | OAuth2 token exchange endpoint |
| `scopes` | `string[]` | ✅ | Requested OAuth scopes |
| `pkce` | `boolean` | ❌ | Enable PKCE (Proof Key for Code Exchange) |
| `additionalParams` | `Record<string, string>` | ❌ | Extra query params for the authorization URL |

The `appCredentialSecretId` points to a [secret](/docs/core-features/secrets) that holds your OAuth app's `clientId` and `clientSecret`.

## Singleton Example

A platform-level Slack credential shared by the entire app:

```typescript
wireCredential({
  name: 'slack',
  displayName: 'Slack',
  type: 'singleton',
  schema: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
  }),
  oauth2: {
    appCredentialSecretId: 'SLACK_OAUTH_APP',
    tokenSecretId: 'SLACK_OAUTH_TOKENS',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'channels:read'],
  },
})
```

## Simple API Key Example

Not everything needs OAuth. For plain API keys or bearer tokens:

```typescript
wireCredential({
  name: 'hmac-key',
  displayName: 'HMAC Signing Key',
  type: 'wire',
  schema: z.object({ secretKey: z.string() }),
})
```

## AI Agent Integration

When an AI agent calls a tool that belongs to an addon requiring a credential, Pikku checks whether the current user has that credential connected. If not, the agent run suspends with a `ToolCredentialRequired` error, and the client receives a signal to prompt the user to connect the credential.

This happens automatically — you don't need to write any credential-checking logic in your tools. The agent resumes once the credential is provided.

```typescript
// The agent just lists its tools — credential checks happen at runtime
export const assistant = pikkuAIAgent({
  name: 'assistant',
  description: 'A helpful assistant with integrations',
  instructions: 'Help the user with their integrations.',
  model: 'fast',
  tools: [listSheets, createSheet, sendSlackMessage],
  // If listSheets requires 'google-sheets' credential and the user
  // hasn't connected it, the agent pauses and asks the client to collect it.
})
```

## Generated Files

After running `pikku`, the CLI generates credential metadata in `.pikku/credentials/`:

- `pikku-credentials.gen.ts` — typed credential wrappers
- `pikku-credentials-meta.gen.json` — credential definitions metadata

These are consumed by the Console, deploy pipeline, and AI agent runtime.

## File Convention

Name your credential files `*.credential.ts` (e.g., `stripe.credential.ts`). This isn't required — the CLI finds `wireCredential()` calls anywhere in your source directories — but it keeps things organized.
