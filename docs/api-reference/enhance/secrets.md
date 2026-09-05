---
title: '#pikku/secrets'
sidebar_label: '#pikku/secrets'
sidebar_position: 4
description: 'Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime.'
---

# `#pikku/secrets`

Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime.

```typescript
import { defineSecret, CredentialsMap, TypedSecretService } from '#pikku/secrets'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`CredentialsMap`](#credentialsmap) | type | Every secret this project declares with `defineSecret`, keyed by name. It is what gives `secrets.getSecret('NAME')` a real type. |
| [`defineSecret`](#definesecret) | function | Declares a secret this project needs, with the shape of its value. The CLI collects every declaration into `CredentialsMap`, which is what makes `secrets.getSecret('NAME')` return the right type instead of `unknown`. |
| [`TypedSecretService`](#typedsecretservice) | class | The `secrets` service as this project sees it: `getSecret('NAME')` resolves the value's type from `CredentialsMap` instead of returning `unknown`. |

## Reference

### `CredentialsMap` {#credentialsmap}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Every secret this project declares with `defineSecret`, keyed by name. It is
what gives `secrets.getSecret('NAME')` a real type.

### `defineSecret` {#definesecret}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/secret`</span>

Declares a secret this project needs, with the shape of its value. The CLI
collects every declaration into `CredentialsMap`, which is what makes
`secrets.getSecret('NAME')` return the right type instead of `unknown`.

```typescript
defineSecret: <T>(_config: CoreSecret<T>) => void
```

<details>
<summary>Config keys (9)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `allowedHosts` | `string[]` | Hosts this secret may be sent to, e.g. `['api.notion.com']` or `'*.notion.com'`. Omitted means unrestricted unless `config.secrets.requireAllowedHosts` is set. |
| `description` | `string` | What this secret is for, shown beside the field someone has to fill in. |
| `displayName` <sup>required</sup> | `string` | How the secret is labelled wherever a person is asked to supply it. |
| `docsUrl` | `string` | Where a user goes to obtain this value, surfaced beside a missing one. |
| `name` <sup>required</sup> | `string` | The key code reads it by: `secrets.getSecret('NAME')`. SCREAMING_SNAKE_CASE. |
| `optional` | `boolean` | Required by default: this says absence is a supported state, and `getSecret` resolves `undefined` rather than throwing. |
| `rotationPeriod` | `string` | Rotation cadence as a duration string, e.g. `'1d'`, `'30day'`, `'1w'`. |
| `schema` <sup>required</sup> | `T` | The shape of the value, as a schema. This is what types `getSecret`'s result — pass the schema itself, not an instance of it. |
| `secretId` <sup>required</sup> | `string` | The id under the backing store, which is where the value actually lives. |

</details>

```typescript
// BETTER_AUTH_SECRET is not declared here — the CLI generates its defineSecret
// into src/scaffold/auth/ from the pikkuBetterAuth config, along with one per
// configured provider.
export const StripeKeySchema = z.string()

defineSecret({
  name: 'stripeSecretKey',
  displayName: 'Stripe Secret Key',
  description: 'Stripe secret key (optional — only needed for real payments)',
  secretId: 'STRIPE_SECRET_KEY',
  schema: StripeKeySchema,
})
```

### `TypedSecretService` {#typedsecretservice}

<span className="api-symbol-meta">class · generated into `.pikku` by the CLI</span>

The `secrets` service as this project sees it: `getSecret('NAME')` resolves
the value's type from `CredentialsMap` instead of returning `unknown`.

```typescript
TypedSecretService: new TypedSecretService(secrets: SecretService)
```

<details>
<summary>Config keys (10)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `cache` <sup>required</sup> | `any` |  |
| `credentialsMeta` <sup>required</sup> | `any` |  |
| `deleteSecret` <sup>required</sup> | `(key: string) => Promise<void>` |  |
| `getAllStatus` <sup>required</sup> | `() => Promise<CredentialStatus[]>` |  |
| `getMissing` <sup>required</sup> | `() => Promise<CredentialStatus[]>` |  |
| `getSecret` <sup>required</sup> | `{ <K>(key: K): Promise<SecretResult<CredentialsMap[K]>>; <T>(key: string): Promise<Secret…` | Throws if the secret is not found, unless `defineSecret` declared it `optional` — then absence resolves `undefined`. Unwrap the result with `.reveal()`. |
| `getSecrets` <sup>required</sup> | `<T extends Record<string, unknown> = Record<string, unknown>>(keys: (keyof T & string)[])…` | Missing keys are omitted rather than throwing, hence `Partial&lt;T&gt;`: callers must handle keys absent at runtime. Pass a shape as `T` to avoid casting, e.g. `getSecrets&lt;&#123; FOO: string; BAR: &#123; id: string &#125; &#125;&gt;(['FOO', 'BAR'])`. |
| `hasSecret` <sup>required</sup> | `(key: string) => Promise<boolean>` | Answers for any key, including a disallowed one — it must not throw. |
| `secrets` <sup>required</sup> | `any` |  |
| `setSecret` <sup>required</sup> | `<K>(key: K, value: K extends "BETTER_AUTH_SECRET" ? CredentialsMap[K] : unknown) => Promi…` |  |

</details>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/secrets` — same 3 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc secrets` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
