---
title: Shipped Addons
description: The addons Pikku maintains — admin and graph
---

# Shipped Addons

Pikku publishes a small set of first-party addons alongside the framework. They
are ordinary addons — install the package and register it with `wireAddon`.

```typescript
import { wireAddon } from '#pikku/addon'
```

## `@pikku/addon-admin`

Administration for a Pikku application, as ordinary namespaced RPCs: the user
directory, roles and scopes, credentials, and the audit trail.

It touches nothing but the services your application already has, so it can be
wired into a deployed serverless unit and called from your own admin screens.

```bash
npm install @pikku/addon-admin
```

```typescript
wireAddon({
  name: 'admin',
  package: '@pikku/addon-admin',
  globalCredentials:
    'administering credentials means setting and clearing any of them, for any user, so it cannot be scoped to a declared set',
})
```

`globalCredentials` is required for the `admin:credential*` functions — an addon
declares what it can read, and this is the deliberate opt-out for functions whose
job is administering credentials themselves.

## `@pikku/addon-graph`

Built-in `graph:*` primitives for Pikku workflow graphs — the pure transforms
(map, cast, filter and friends) that graphs compose without needing a bespoke
addon per operation.

```typescript
{ type: 'graph:map', input: { items: ref('fetch.output') } }
```

## Next Steps

- **[Addons](./index.md)** — how `wireAddon` works and what an addon ships
- **[Creating an Addon](./creating.md)** — scaffold, build and publish one
- **[Graph Workflows](../wiring/workflows/graph-workflows.md)** — where `graph:*` primitives run
