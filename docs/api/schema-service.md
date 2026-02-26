---
title: SchemaService
---

The SchemaService validates function inputs against JSON schemas at runtime. Pikku's CLI generates those schemas automatically from your TypeScript types — you don't write schemas by hand. At bootstrap, the generated schemas are compiled into the service; on every function call, input data is validated before your function runs.

You don't call the SchemaService directly — Pikku handles it internally. You just need to choose an implementation and register it in your singleton services.

## Choosing an Implementation

| | `@pikku/schema-ajv` | `@pikku/schema-cfworker` |
|---|---|---|
| **Package** | `AjvSchemaService` | `CFWorkerSchemaService` |
| **Backend** | [Ajv](https://ajv.js.org/) + ajv-formats | [@cfworker/json-schema](https://github.com/cfworker/cfworker) |
| **Runtime** | Node.js, Bun, Deno | Cloudflare Workers, Node.js |
| **Format validation** | Built-in (email, date, uri, etc.) | Not included |
| **Type coercion** | Yes (`coerceTypes: true`) | No |
| **Default values** | Yes (`useDefaults: true`) | No |
| **Best for** | Node.js servers | Cloudflare Workers (no Node.js APIs) |

### AJV Schema Service

The default choice for Node.js environments. Supports format validation, type coercion, and default value injection:

```bash npm2yarn
npm install @pikku/schema-ajv
```

```typescript
import { AjvSchemaService } from '@pikku/schema-ajv'

const singletonServices = await createSingletonServices(config, {
  schemaService: new AjvSchemaService(logger),
})
```

AJV automatically:
- Coerces types (e.g., string `"42"` → number `42`)
- Applies default values from your schemas
- Validates formats like `email`, `date-time`, `uri`

### Cloudflare Worker Schema Service

For Cloudflare Workers, which don't have access to Node.js APIs that AJV depends on:

```bash npm2yarn
npm install @pikku/schema-cfworker
```

```typescript
import { CFWorkerSchemaService } from '@pikku/schema-cfworker'

const singletonServices = await createSingletonServices(config, {
  schemaService: new CFWorkerSchemaService(logger),
})
```

:::note
`CFWorkerSchemaService` deep-clones schema values before compilation to avoid mutation issues with the `@cfworker/json-schema` validator.
:::

## Methods

### `compileSchema(name: string, value: any): Promise<void> | void`

Compiles a schema with the provided name and value, making it available for validation.

- **Parameters:**
  - `name`: The unique name for the schema
  - `value`: The schema definition or configuration to be compiled
- **Returns:** A promise if asynchronous, or void if synchronous

### `validateSchema(schema: string, data: any): Promise<void> | void`

Validates data against a specified schema. Throws `UnprocessableContentError` if validation fails.

- **Parameters:**
  - `schema`: The name of the schema to validate against
  - `data`: The data to validate against the schema
- **Returns:** A promise if asynchronous, or void if synchronous
- **Throws:** `UnprocessableContentError` if data doesn't match schema

### `getSchemaNames(): Set<string>`

Retrieves a set of all registered schema names.

- **Returns:** A set containing the names of all available schemas

### `getSchemaKeys(schemaName: string): string[]`

Returns the top-level property keys of a compiled schema. Useful for CLI argument parsing.

- **Parameters:**
  - `schemaName`: The name of the compiled schema
- **Returns:** Array of property key names, or empty array if schema has no properties

## Interface

```typescript reference title="schema-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/schema-service.ts
```

## Source

### AJV Schema Service

```typescript reference title="ajv-schema-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/schema-ajv/src/ajv-schema-service.ts
```

### Cloudflare Worker Schema Service

```typescript reference title="cfworker-json-schema.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/schema-cfworker/src/cfworker-json-schema.ts
```
