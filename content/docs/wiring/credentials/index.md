---
sidebar_position: 11
title: Credentials
description: Per-user and platform-level credentials with OAuth2 support
ai: true
---

# Credentials

Credentials let you define typed, per-user or platform-level secrets that your functions and AI agents need at runtime — API keys, OAuth2 tokens, or any structured config that varies by user or tenant.

The CLI picks up `defineCredential()` calls, generates typed wrappers, and makes them available through the credential service. When an AI agent calls a tool that needs a credential the user hasn't connected yet, Pikku automatically suspends the agent run and signals the client to collect it.

## Defining a Credential

Use `defineCredential` from `#pikku/auth`. The call itself is a no-op at runtime — the CLI reads it via AST and generates metadata.

```typescript @snippet wa-cred-define
```

### Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ | Unique identifier for the credential |
| `displayName` | `string` | ✅ | Human-readable name (shown in auth flows) |
| `description` | `string` | ❌ | Explains what this credential is for |
| `type` | `'singleton' \| 'wire'` | ✅ | Scope — see below |
| `schema` | Zod schema | ✅ | Shape of the credential data |
| `oauth2` | `object` | ❌ | OAuth2 flow configuration — see [OAuth2 Credentials](#oauth2-credentials) |

### Credential Types

**`wire`** — per-user credentials. Each user (or session) has their own value. Use this for things like personal API keys or per-user OAuth tokens.

**`singleton`** — platform-level credentials. One value shared across the entire app. Use this for credentials your platform owns, like your Slack bot token.

## OAuth2 Credentials

For services that use OAuth2, add an `oauth2` block. Pikku handles the authorization flow, token exchange, and refresh.

```typescript @snippet wa-cred-oauth2
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

```typescript @snippet wa-cred-singleton
```

## Simple API Key Example

Not everything needs OAuth. For plain API keys or bearer tokens:

```typescript @snippet wa-cred-api-key
```

## AI Agent Integration

When an AI agent calls a tool that belongs to an addon requiring a credential, Pikku checks whether the current user has that credential connected. If not, the agent run suspends with a `ToolCredentialRequired` error, and the client receives a signal to prompt the user to connect the credential.

This happens automatically — you don't need to write any credential-checking logic in your tools. The agent resumes once the credential is provided.

```typescript @snippet wa-cred-agent
```

## Generated Files

After running `pikku`, the CLI generates credential metadata in `.pikku/credentials/`:

- `pikku-credentials.gen.ts` — typed credential wrappers
- `pikku-credentials-meta.gen.json` — credential definitions metadata

These are consumed by the deploy pipeline and AI agent runtime.

## File Convention

Name your credential files `*.credential.ts` (e.g., `stripe.credential.ts`). This isn't required — the CLI finds `defineCredential()` calls anywhere in your source directories — but it keeps things organized.
