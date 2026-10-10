---
title: VariablesService
---

The VariablesService provides access to environment variables and configuration values. This abstraction is necessary because some runtimes (like Cloudflare Workers) don't expose variables via `process.env`.

## Methods

### `get<T = string>(name: string): Promise<T | undefined> | T | undefined`

Retrieves a single variable by name, typed as `T` (defaults to `string`).

- **Parameters:**
  - `name`: The variable name
- **Returns:** The value typed as `T`, `undefined` if not found, or a Promise resolving to either

### `getVariables<T extends Record<string, unknown>>(names: (keyof T & string)[]): Promise<Partial<T>> | Partial<T>`

Retrieves multiple variables in a single batch operation, mirroring `SecretService.getSecrets`. Missing variables are omitted rather than throwing, so callers must handle keys that may be absent at runtime.

`getVariables` takes a list of names and returns an object keyed by name, so `getVariables(['FOO', 'BAR'])` gives you `FOO` and `BAR`.

### `getAll(): Promise<Record<string, string | undefined>> | Record<string, string | undefined>`

Retrieves all available variables.

- **Returns:** A record of all variables with their values, or a Promise resolving to the record

### `set(name: string, value: unknown): Promise<void> | void`

Sets a variable value.

### `has(name: string): Promise<boolean> | boolean`

Checks if a variable exists.

### `delete(name: string): Promise<void> | void`

Deletes a variable by name.

## Usage Example

```typescript @snippet co-variables-service
```

## Implementations

### Local (development)

`LocalVariablesService` from `@pikku/core/services`, constructed with
`process.env` by default:

```typescript reference title="local-variables.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-variables.ts
```

For Cloudflare Workers, pass the `env` object from the Workers handler into the
service — `new LocalVariablesService(env)`.

## Interface

```typescript reference title="variables-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/variables-service.ts
```
