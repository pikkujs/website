---
title: '#pikku/secrets'
sidebar_label: '#pikku/secrets'
sidebar_position: 4
description: 'Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime.'
paper: true
---

# `#pikku/secrets`

Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime.

```typescript
import { defineSecret, CredentialsMap, TypedSecretService } from '#pikku/secrets'
```

## Exports

<ApiExports items={[{"name":"CredentialsMap","kind":"type","anchor":"credentialsmap","summary":"Every secret this project declares with defineSecret, keyed by name. It is what gives secrets.getSecret('NAME') a real type."},{"name":"defineSecret","kind":"function","anchor":"definesecret","summary":"Declares a secret this project needs, with the shape of its value. The CLI collects every declaration into CredentialsMap, which is what makes secrets.getSecret('NAME') return the right type instead of unknown."},{"name":"TypedSecretService","kind":"class","anchor":"typedsecretservice","summary":"The secrets service as this project sees it: getSecret('NAME') resolves the value's type from CredentialsMap instead of returning unknown."}]} />

## Reference

<ApiSymbol>

### `CredentialsMap` {#credentialsmap}

<ApiMeta kind="type" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Every secret this project declares with `defineSecret`, keyed by name. It is
what gives `secrets.getSecret('NAME')` a real type.

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `defineSecret` {#definesecret}

<ApiMeta kind="function" origin="re-exported from @pikku/core/secret" />

<ApiSection label="Description">

Declares a secret this project needs, with the shape of its value. The CLI
collects every declaration into `CredentialsMap`, which is what makes
`secrets.getSecret('NAME')` return the right type instead of `unknown`.

</ApiSection>

<ApiSection label="Signature">

```typescript
defineSecret: <T>(_config: CoreSecret<T>) => void
```

</ApiSection>

<ApiSection label="Config keys (9)">

<details>
<summary>Show all 9</summary>

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

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `TypedSecretService` {#typedsecretservice}

<ApiMeta kind="class" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

The `secrets` service as this project sees it: `getSecret('NAME')` resolves
the value's type from `CredentialsMap` instead of returning `unknown`.

</ApiSection>

<ApiSection label="Signature">

```typescript
TypedSecretService: new TypedSecretService(secrets: SecretService)
```

</ApiSection>

<ApiSection label="Config keys (10)">

<details>
<summary>Show all 10</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `cache` <sup>required</sup> | `any` |  |
| `credentialsMeta` <sup>required</sup> | `any` |  |
| `deleteSecret` <sup>required</sup> | `(key: string) => Promise<void>` |  |
| `getAllStatus` <sup>required</sup> | `() => Promise<CredentialStatus[]>` |  |
| `getMissing` <sup>required</sup> | `() => Promise<CredentialStatus[]>` | The secrets a deployment still has to supply. An optional one is absent from this list however it is stored: `optional` already declares that absence is supported, which is why `getSecret` resolves `undefined` for it rather than throwing. Reporting it as missing contradicts that, and buries the required secrets someone actually has to go and configure. `getAllStatus` still reports it, flagged. |
| `getSecret` <sup>required</sup> | `{ <K>(key: K): Promise<SecretResult<CredentialsMap[K]>>; <T>(key: string): Promise<Secret…` | Throws if the secret is not found, unless `defineSecret` declared it `optional` — then absence resolves `undefined`. Unwrap the result with `.reveal()`. |
| `getSecrets` <sup>required</sup> | `<T extends Record<string, unknown> = Record<string, unknown>>(keys: (keyof T & string)[])…` | Missing keys are omitted rather than throwing, hence `Partial&lt;T&gt;`: callers must handle keys absent at runtime. Pass a shape as `T` to avoid casting, e.g. `getSecrets&lt;&#123; FOO: string; BAR: &#123; id: string &#125; &#125;&gt;(['FOO', 'BAR'])`. |
| `hasSecret` <sup>required</sup> | `(key: string) => Promise<boolean>` | Answers for any key, including a disallowed one — it must not throw. |
| `secrets` <sup>required</sup> | `any` |  |
| `setSecret` <sup>required</sup> | `<K>(key: K, value: K extends "BETTER_AUTH_SECRET" ? CredentialsMap[K] : unknown) => Promi…` |  |

</details>

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/secrets` — same 3 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc secrets` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
