---
title: '#pikku/setup'
sidebar_label: '#pikku/setup'
sidebar_position: 2
description: 'The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in it…'
---

# `#pikku/setup`

The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in its own flavour, handed the logger, variables and secrets the host application already built. Everything else on this page is imported by features; these are imported by bootstrap and then left alone.

```typescript
import { pikkuConfig, pikkuServices, pikkuWireServices } from '#pikku/setup'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`Config`](#config) | interface | This project's own config — whatever `createConfig` returns. Every singleton service is built from it. |
| [`pikkuConfig`](#pikkuconfig) | function | Creates a Pikku config factory. Use this to define your application's configuration factory. |
| [`pikkuServices`](#pikkuservices) | function | Creates a Pikku singleton services factory. Use this to define services that are created once and shared across all requests. |
| [`pikkuWireServices`](#pikkuwireservices) | function | Creates a Pikku wire services factory. Use this to define services that are created per-request/session. |

## Reference

### `Config` {#config}

<span className="api-symbol-meta">interface · re-exported from `@pikku/templates-functions`</span>

This project's own config — whatever `createConfig` returns. Every singleton
service is built from it.

<details>
<summary>Config keys (5)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `logLevel` | `LogLevel` |  |
| `postgres` | `PostgresConfig` |  |
| `secrets` | `{ requireAllowedHosts?: boolean; }` |  |
| `webhook` | `WebhookServiceConfig` |  |
| `workflow` | `WorkflowServiceConfig` |  |

</details>

### `pikkuConfig` {#pikkuconfig}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku config factory.
Use this to define your application's configuration factory.

```typescript
pikkuConfig: (func: (variables?: any, ...args: any[]) => Promise<Config>) => (variables?: any, ...args: any[]) => Promise<Config>
```

```typescript
export const createConfig = pikkuConfig(async () => ({
  port: parseInt(process.env.API_PORT || '4003', 10),
  hostname: process.env.HOST || '0.0.0.0',
}))
```

### `pikkuServices` {#pikkuservices}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku singleton services factory.
Use this to define services that are created once and shared across all requests.

```typescript
pikkuServices: (func: (config: Config, existingServices: Partial<SingletonServices>) => Promise<Partial<Omit<RequiredSingletonServices, "auth">>>) => (config: Config, existingServices?: Partial<SingletonServices>) => Promise<RequiredSingletonServices>
```

```typescript
export const createSingletonServices = pikkuServices(async (config, existingServices) => {
  return {
    config,
    logger: new CustomLogger(),
    db: await createDatabaseConnection(config.dbUrl)
  }
})
```

### `pikkuWireServices` {#pikkuwireservices}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku wire services factory.
Use this to define services that are created per-request/session.

```typescript
pikkuWireServices: (func: (services: SingletonServices, wire: any) => Promise<RequiredWireServices>) => CreateWireServices
```

```typescript
export const createWireServices = pikkuWireServices(
  async (singletonServices, wire) => {
    if (!singletonServices.audit) {
      return {}
    }
    const auditLog = createInvocationAudit(singletonServices.audit, wire)
    // auditLog is ALWAYS injected, but `auditLog.write(...)` only PERSISTS when this
    // function set `audit: true` — createInvocationAudit gates on wire.audit, so
    // without it write() is a warn-only no-op (see @pikku/core audit-service.ts).
    // `auditLog.config` is set ONLY when audit: true is on, and when it is, ALSO wrap
    // kysely so every query is captured and the runner flushes the buffer on close.
    // Without audit: true, leave the plain kysely untouched — no per-query overhead.
    if (!auditLog.config) {
      return { auditLog }
    }
    return {
      auditLog,
      kysely: createAuditedKysely(singletonServices.kysely, {
        audit: auditLog,
      }),
    }
  }
)
```

## Inside an addon

Addon authors import this door as `#pikku/addon/setup`, with one difference:

- Addon-only: `AddonBaseServices`, `pikkuAddonConfig`, `pikkuAddonServices`, `pikkuAddonWireServices` — see [the addon surface](/docs/api-reference/addons).

---

Run `npx pikku doc setup` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
