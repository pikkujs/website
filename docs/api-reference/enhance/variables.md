---
title: '#pikku/variables'
sidebar_label: '#pikku/variables'
sidebar_position: 5
description: 'Configuration a function reads through the variables service, declared once so a deployment can be checked for what it is missing.'
---

# `#pikku/variables`

Configuration a function reads through the variables service, declared once so a deployment can be checked for what it is missing.

```typescript
import { defineVariable, TypedVariablesService, VariablesMap } from '#pikku/variables'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`defineVariable`](#definevariable) | function | Declares an environment variable this project needs, with the shape of its value. The CLI collects every declaration into `VariablesMap`, which is what makes `variables.get('NAME')` return the right type instead of `unknown`. |
| [`TypedVariablesService`](#typedvariablesservice) | class | The `variables` service as this project sees it: `get('NAME')` resolves the value's type from `VariablesMap` instead of returning `unknown`. |
| [`VariablesMap`](#variablesmap) | interface | Every variable this project declares with `defineVariable`, keyed by name. It is what gives `variables.get('NAME')` a real type. |

## Reference

### `defineVariable` {#definevariable}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/variable`</span>

Declares an environment variable this project needs, with the shape of its
value. The CLI collects every declaration into `VariablesMap`, which is what
makes `variables.get('NAME')` return the right type instead of `unknown`.

```typescript
defineVariable: <T>(_config: CoreVariable<T>) => void
```

<details>
<summary>Config keys (7)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` | `string` | What the value does, for the person setting it rather than the one reading it. |
| `displayName` <sup>required</sup> | `string` | The name shown to whoever configures the deployment. |
| `docsUrl` | `string` | Where to go to work out what to set this to. |
| `name` <sup>required</sup> | `string` | How the variable is asked for in code. Generated into `VariablesMap`, so it is what `variables.get` autocompletes. |
| `optional` | `boolean` | Required by default: this says the deployment is still correct without it. |
| `schema` <sup>required</sup> | `T` | The shape of the value. It arrives as a string, so this is also what parses it. |
| `variableId` <sup>required</sup> | `string` | The environment variable this reads, which is the name that has to exist on the host. |

</details>

```typescript
export const DatabaseUrlSchema = z.string()
export const LowStockThresholdSchema = z.number().int().positive()
export const ScenarioActorSecretSchema = z.string()
export const BetterAuthUrlSchema = z.string().url()

defineVariable({
  name: 'databaseUrl',
  displayName: 'Database URL',
  description: 'Primary database connection string (Postgres or libsql URL)',
  variableId: 'DATABASE_URL',
  schema: DatabaseUrlSchema,
})

defineVariable({
  name: 'lowStockThreshold',
  displayName: 'Low Stock Threshold',
  description: 'Item stock level that triggers a low-stock alert',
  variableId: 'LOW_STOCK_THRESHOLD',
  schema: LowStockThresholdSchema,
})

defineVariable({
  name: 'scenarioActorSecret',
  displayName: 'Scenario Actor Secret',
  description:
    'Impersonation secret for `pikku scenario run` actors. Leave unset to disable actor sign-in',
  variableId: 'SCENARIO_ACTOR_SECRET',
  schema: ScenarioActorSecretSchema,
})

defineVariable({
  name: 'betterAuthUrl',
  displayName: 'Better Auth Base URL',
  description:
    'Public origin the API is served from, used for auth callbacks and redirects',
  variableId: 'BETTER_AUTH_URL',
  schema: BetterAuthUrlSchema,
})
```

### `TypedVariablesService` {#typedvariablesservice}

<span className="api-symbol-meta">class · generated into `.pikku` by the CLI</span>

The `variables` service as this project sees it: `get('NAME')` resolves the
value's type from `VariablesMap` instead of returning `unknown`.

```typescript
TypedVariablesService: new TypedVariablesService(variables: VariablesService)
```

<details>
<summary>Config keys (12)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `delete` <sup>required</sup> | `(name: string) => Promise<void> \| void` |  |
| `get` <sup>required</sup> | `{ <K>(name: K): VariablesMap[K] \| Promise<VariablesMap[K] \| undefined> \| undefined; <T>(n…` |  |
| `getAll` <sup>required</sup> | `() => Promise<Record<string, string \| undefined>> \| Record<string, string \| undefined>` |  |
| `getAllStatus` <sup>required</sup> | `() => Promise<VariableStatus[]>` |  |
| `getMissing` <sup>required</sup> | `() => Promise<VariableStatus[]>` | What a deployment still has to be told. A variable that defaults is not on this list — it has a value, just not one anybody has to supply. |
| `getVariables` <sup>required</sup> | `<T extends Record<string, unknown> = Record<string, unknown>>(names: (keyof T & string)[]…` | Same contract as `SecretService.getSecrets`: missing keys are omitted, hence `Partial&lt;T&gt;`. |
| `has` <sup>required</sup> | `(name: string) => Promise<boolean> \| boolean` |  |
| `resolveDefault` <sup>required</sup> | `any` | The value the declaration answers with when the host set nothing, or `undefined` when it does not answer for itself. |
| `set` <sup>required</sup> | `(name: string, value: unknown) => Promise<void> \| void` |  |
| `variables` <sup>required</sup> | `any` |  |
| `variablesMeta` <sup>required</sup> | `any` |  |
| `withDefaults` <sup>required</sup> | `any` | Kept synchronous when the defaults resolve synchronously, so a caller that did not await `getVariables` before does not have to start. |

</details>

### `VariablesMap` {#variablesmap}

<span className="api-symbol-meta">interface · generated into `.pikku` by the CLI</span>

Every variable this project declares with `defineVariable`, keyed by name. It
is what gives `variables.get('NAME')` a real type.

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/variables` — same 3 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc variables` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
