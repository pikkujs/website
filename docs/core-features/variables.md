---
sidebar_position: 26
title: Variables
description: Type-safe configuration management
---

# Variables

Variables let you declare non-sensitive configuration your application needs using schemas. Like [secrets](./secrets.md), the Pikku CLI generates a `TypedVariablesService` that wraps your base `VariablesService` with compile-time type safety. Variables are for configuration values like database hosts, feature flags, and API endpoints rather than secrets.

## Defining Variables

Use `defineVariable`, from [`#pikku/variables`](/api#app/variables), to declare a variable with its schema:

```typescript @snippet variables
```

Schemas are defined using [Zod](https://zod.dev).

The `variableId` is the key used to look up the variable from your environment or variable store.

## Using Variables

Access variables through the `variables` service. When you use the generated `TypedVariablesService`, calls are fully typed:

```typescript @snippet co-variables-typed
```

The CLI generates a `TypedVariablesService` class that wraps your `VariablesService` implementation. Use it when creating your singleton services:

Wrap your base variables service in the generated typed one: `new TypedVariablesService(baseVariablesService)`, imported from `#pikku/variables`.

## Variables vs Secrets

| | Variables | Secrets |
|---|---|---|
| **Purpose** | Non-sensitive configuration | Sensitive values |
| **Examples** | Database hosts, ports, feature flags | API keys, tokens, passwords |
| **Wire function** | `defineVariable` | `defineSecret` |
| **Service** | `variables` | `secrets` |
| **Access method** | `variables.get(id)` | `secrets.getSecret(id)` |

Use variables for anything you'd comfortably put in a `.env` file without encrypting. Use secrets for anything that needs secure storage.

## Best Practices

**Descriptive variableIds**: Use names that clearly identify the configuration: `POSTGRES_PARAMS`, `REDIS_CONFIG`, `APP_SETTINGS`.

**Use schemas with defaults**: Define sensible defaults in your schema so the application works in development without explicit configuration:

Define a schema for any shape you want, such as a Redis config with a `host` that defaults to `'localhost'` and a `port` that defaults to `'6379'`, and point `defineVariable` at it.

## Generated Files

The CLI generates typed wrappers in `.pikku/variables/`:

- `pikku-variable-types.gen.ts` — re-exports `defineVariable` and types
- `pikku-variables.gen.ts` — `TypedVariablesService` with your `VariablesMap`
- `pikku-variables-meta.gen.json` — variable metadata for deploy
