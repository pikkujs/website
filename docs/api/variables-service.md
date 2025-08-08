---
title: VariablesService
---

The VariablesService interface provides access to environment variables and configuration values in Pikku applications. This abstraction is needed since some runtimes (like Cloudflare Workers) don't provide environment variables via `process.env`.

## Methods

### `get(name: string): Promise<string | undefined> | string | undefined`

Retrieves a single environment variable by name.

- **Parameters:**
  - `name`: The name of the environment variable to retrieve
- **Returns:** The variable value as a string, undefined if not found, or a Promise resolving to either

### `getAll(): Promise<Record<string, string | undefined>> | Record<string, string | undefined>`

Retrieves all available environment variables.

- **Returns:** A record of all variables with their values, or a Promise resolving to the record

## Usage Example

```typescript
// Access variables in your function
const myFunction: CorePikkuFunction<{}, { config: any }> = async (services) => {
  // Get a specific variable
  const apiUrl = await services.variables.get('API_URL')
  
  // Get all variables  
  const allVars = await services.variables.getAll()
  
  return {
    config: {
      apiUrl,
      debug: allVars.DEBUG === 'true'
    }
  }
}
```

## Implementation

Pikku provides a local implementation for development and testing:

```typescript reference title="local-variables.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/local-variables.ts
```

## Interface

```typescript reference title="variables-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/variables-service.ts
```
