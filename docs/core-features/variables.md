---
sidebar_position: 26
title: Variables
description: Type-safe configuration management
---

# Variables

Variables let you declare non-sensitive configuration your application needs using schemas. Like [secrets](./secrets.md), the Pikku CLI generates a `TypedVariablesService` that wraps your base `VariablesService` with compile-time type safety. Variables are for configuration values like database hosts, feature flags, and API endpoints rather than secrets.

## Defining Variables

Use `wireVariable` to declare a variable with its schema:

```typescript
import { wireVariable } from '#pikku'
import { z } from 'zod'

export const postgresParamsSchema = z.object({
  host: z.string().default('localhost'),
  port: z.string().default('5432'),
  database: z.string(),
  ssl: z.string().optional(),
})

wireVariable({
  name: 'postgres_params',
  displayName: 'PostgreSQL Params',
  variableId: 'POSTGRES_PARAMS',
  schema: postgresParamsSchema,
})
```

Schemas are defined using [Zod](https://zod.dev).

The `variableId` is the key used to look up the variable from your environment or variable store.

## Using Variables

Access variables through the `variables` service. When you use the generated `TypedVariablesService`, calls are fully typed:

```typescript
export const connectToDb = pikkuSessionlessFunc<void, { connected: boolean }>({
  func: async ({ variables }, _data) => {
    const config = await variables.getJSON('POSTGRES_PARAMS')
    // config.host, config.port, config.database are typed

    const connection = await createConnection(config)
    return { connected: true }
  },
})
```

The CLI generates a `TypedVariablesService` class that wraps your `VariablesService` implementation. Use it when creating your singleton services:

```typescript
import { TypedVariablesService } from '.pikku/pikku-types.gen.js'

const variables = new TypedVariablesService(new LocalVariablesService())
```

## Variables vs Secrets

| | Variables | Secrets |
|---|---|---|
| **Purpose** | Non-sensitive configuration | Sensitive values |
| **Examples** | Database hosts, ports, feature flags | API keys, tokens, passwords |
| **Wire function** | `wireVariable` | `wireSecret` |
| **Service** | `variables` | `secrets` |
| **Access method** | `variables.getJSON(id)` | `secrets.getSecretJSON(id)` |

Use variables for anything you'd comfortably put in a `.env` file without encrypting. Use secrets for anything that needs secure storage.

## Best Practices

**Descriptive variableIds**: Use names that clearly identify the configuration: `POSTGRES_PARAMS`, `REDIS_CONFIG`, `APP_SETTINGS`.

**Use schemas with defaults**: Define sensible defaults in your schema so the application works in development without explicit configuration:

```typescript
const redisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.string().default('6379'),
})
```

## Managing Variables with the Console

The [Pikku Console](/docs/console) provides a visual interface for viewing and editing variables per environment. See [Console Features](/docs/console/features#configuration) for details.
