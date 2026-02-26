---
title: VariablesService
---

The VariablesService provides access to environment variables and configuration values. This abstraction is necessary because some runtimes (like Cloudflare Workers) don't expose variables via `process.env`.

## Methods

### `get(name: string): Promise<string | undefined> | string | undefined`

Retrieves a single variable by name.

- **Parameters:**
  - `name`: The variable name
- **Returns:** The value as a string, `undefined` if not found, or a Promise resolving to either

### `getAll(): Promise<Record<string, string | undefined>> | Record<string, string | undefined>`

Retrieves all available variables.

- **Returns:** A record of all variables with their values, or a Promise resolving to the record

## Usage Example

```typescript
export const myFunction = pikkuFunc<void, { apiUrl: string; debug: boolean }>(
  async (services) => {
    const apiUrl = await services.variables.get('API_URL')
    const allVars = await services.variables.getAll()

    return {
      apiUrl: apiUrl ?? '',
      debug: allVars.DEBUG === 'true'
    }
  }
)
```

## Implementations

### Local (development)

Reads from `process.env`. Used automatically in Node.js and Bun environments:

```typescript reference title="local-variables.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/local-variables.ts
```

For Cloudflare Workers, pass the `env` object from the Workers handler into your service setup.

## Interface

```typescript reference title="variables-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/variables-service.ts
```
