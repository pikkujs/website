---
title: '#pikku/setup'
sidebar_label: '#pikku/setup'
sidebar_position: 2
description: 'The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in it…'
paper: true
---

# `#pikku/setup`

The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in its own flavour, handed the logger, variables and secrets the host application already built. Everything else on this page is imported by features; these are imported by bootstrap and then left alone.

```typescript
import { pikkuConfig, pikkuServices, pikkuWireServices } from '#pikku/setup'
```

## Exports

<ApiExports items={[{"name":"Config","kind":"interface","anchor":"config","summary":"This project's own config — whatever createConfig returns. Every singleton service is built from it."},{"name":"pikkuConfig","kind":"function","anchor":"pikkuconfig","summary":"Creates a Pikku config factory. Use this to define your application's configuration factory."},{"name":"pikkuServices","kind":"function","anchor":"pikkuservices","summary":"Creates a Pikku singleton services factory. Use this to define services that are created once and shared across all requests."},{"name":"pikkuWireServices","kind":"function","anchor":"pikkuwireservices","summary":"Creates a Pikku wire services factory. Use this to define services that are created per-request/session."}]} />

## Reference

<ApiSymbol>

### `Config` {#config}

<ApiMeta kind="interface" origin="re-exported from @pikku/templates-functions" />

<ApiSection label="Description">

This project's own config — whatever `createConfig` returns. Every singleton
service is built from it.

</ApiSection>

<ApiSection label="Config keys (5)">

| Key | Type | What it does |
| --- | --- | --- |
| `logLevel` | `LogLevel` |  |
| `postgres` | `PostgresConfig` |  |
| `secrets` | `{ requireAllowedHosts?: boolean; }` |  |
| `webhook` | `WebhookServiceConfig` |  |
| `workflow` | `WorkflowServiceConfig` |  |

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuConfig` {#pikkuconfig}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Creates a Pikku config factory.
Use this to define your application's configuration factory.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuConfig: (func: (variables?: any, ...args: any[]) => Promise<Config>) => (variables?: any, ...args: any[]) => Promise<Config>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const createConfig = pikkuConfig(async () => ({
  port: parseInt(process.env.API_PORT || '4003', 10),
  hostname: process.env.HOST || '0.0.0.0',
}))
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuServices` {#pikkuservices}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Creates a Pikku singleton services factory.
Use this to define services that are created once and shared across all requests.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuServices: (func: (config: Config, existingServices: Partial<SingletonServices>) => Promise<Partial<Omit<RequiredSingletonServices, "auth">>>) => (config: Config, existingServices?: Partial<SingletonServices>) => Promise<RequiredSingletonServices>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const createSingletonServices = pikkuServices(async (config, existingServices) => {
  return {
    config,
    logger: new CustomLogger(),
    db: await createDatabaseConnection(config.dbUrl)
  }
})
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuWireServices` {#pikkuwireservices}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Creates a Pikku wire services factory.
Use this to define services that are created per-request/session.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuWireServices: (func: (services: SingletonServices, wire: any) => Promise<RequiredWireServices>) => CreateWireServices
```

</ApiSection>

<ApiSection label="Example">

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

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors import this door as `#pikku/addon/setup`, with one difference:

- Addon-only: `AddonBaseServices`, `pikkuAddonConfig`, `pikkuAddonServices`, `pikkuAddonWireServices` — see [the addon surface](/docs/api-reference/addons).

---

Run `npx pikku doc setup` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
