---
title: SchemaService
---

The SchemaService interface provides schema compilation, validation, and management capabilities in Pikku. It allows you to define, compile, and validate data against JSON schemas.

## Methods

### `compileSchema(name: string, value: any): Promise<void> | void`

Compiles a schema with the provided name and value, making it available for validation.

- **Parameters:**
  - `name`: The unique name for the schema
  - `value`: The schema definition or configuration to be compiled
- **Returns:** A promise if asynchronous, or void if synchronous

### `validateSchema(schema: string, data: any): Promise<void> | void`

Validates data against a specified schema.

- **Parameters:**
  - `schema`: The name of the schema to validate against
  - `data`: The data to validate against the schema
- **Returns:** A promise if asynchronous, or void if synchronous
- **Throws:** Validation error if data doesn't match schema

### `getSchemaNames(): Set<string>`

Retrieves a set of all registered schema names.

- **Returns:** A set containing the names of all available schemas

## Usage Example

```typescript
import { AjvSchemaService } from '@pikku/schema-ajv'

// Create schema service
const schemaService = new AjvSchemaService()

// Compile a schema
await schemaService.compileSchema('user', {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
})

// Validate data
const userData = { name: 'John', age: 30 }
await schemaService.validateSchema('user', userData) // Passes

// Get all schema names
const schemas = schemaService.getSchemaNames() // Set{'user'}
```

## Implementations

Pikku provides several schema service implementations:

### AJV Schema Service

```typescript reference title="ajv-schema-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/schema-ajv/src/ajv-schema-service.ts
```

### Cloudflare Worker Schema Service

```typescript reference title="cfworker-json-schema.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/schema-cfworker/src/cfworker-json-schema.ts
```

## Interface

```typescript reference title="schema-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/schema-service.ts
```
