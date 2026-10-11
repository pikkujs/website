---
sidebar_position: 2
title: Consuming Addons
description: How to use addons in your application
---

# Consuming Addons

Once an addon is published, any Pikku application can consume it with minimal configuration. Functions become available via namespaced RPC calls, and trigger sources can be wired to your own handler functions.

There are two ways to get an addon into your project:

1. **npm** — install a published package (`npm install @pikku/addon-postgres`) and wire it by package name
2. **Community registry** — copy the addon's source into your repo with `pikku fabric addon add` (shadcn-style)

## Installing from the Community Registry

`pikku fabric addon add` installs an addon from the Fabric community registry by **copying its source** into your project — like shadcn/ui components, the code lands in your repo where you can read, audit, and fork it:

```bash
npx pikku fabric addon add <id>
yarn install
```

What it does:

- Downloads the addon artifact and extracts it into `<addonDir>/<name>/` (default `addons/`, override with `--dir` or `addons.addonDir` in `pikku.config.json`)
- Registers `<addonDir>/*` as a workspace glob in your root `package.json`, so `yarn install` symlinks the addon into `node_modules` — `wireAddon({ package })` then resolves it by package name, unchanged
- Records provenance (registry id + version) in a CLI-owned `pikku-addons.json`, so the origin is known even after you edit or fork the copied source

After installing, wire it exactly like an npm addon:

```typescript @snippet rt-wire-addon-local
```

| Option | Description |
|--------|-------------|
| `--dir` | Addon directory (overrides `pikku.config.json` `addons.addonDir`, default `addons/`) |
| `--apiUrl` | Override the fabric-api URL for this call |

:::tip[Publishing your own]
The other side of the registry is `pikku fabric addon verify` (check an addon directory is correctly built) and `pikku fabric addon publish` (pack and upload it). See [Creating Addons](/docs/addon/creating).
:::

## Configuration

Wire addons in a `*.wiring.ts` file:

```typescript @snippet rt-wire-addon-postgres
```

The `name` becomes the namespace prefix for all RPC calls to that addon's functions.

## Setting Up Services

Your `services.ts` provides the base services that addons need — logger, secrets, and variables. Addons receive these automatically:

Your `createSingletonServices` is built with `pikkuServices` from `#pikku/setup`. An addon only needs `variables` and `secrets` to resolve its own secrets, so a minimal factory reuses `existingServices?.variables` or creates a `LocalVariablesService(process.env)`, does the same for `secrets` with a `LocalSecretService(variables)`, and returns those two plus a `logger` (`existingServices?.logger` or a `ConsoleLogger`). All three classes come from `@pikku/core/services`.

The addon's service factory (created with `pikkuAddonServices`) receives your logger, secrets, and variables to build its own services on top.

## Namespaced RPC Calls

Call addon functions using the `namespace:functionName` syntax:

Call the addon's functions through `rpc.invoke` inside any function. This example, in a `pikkuSessionlessFunc<void, void>`, uses the postgres addon's four operations, each taking a `table`:

| RPC | Other input |
| --- | --- |
| `postgres:insert` | `data`, such as `{ name: 'alice', email: 'alice@example.com' }` |
| `postgres:select` | `where` |
| `postgres:update` | `data` and `where` |
| `postgres:deleteRows` | `where` |

A `where` is `{ conditions: [{ column: 'name', operator: '=', value: 'alice' }] }`.

### Calling an addon over HTTP

`rpc.invoke` reaches any addon function. `rpc.exposed`, which is what the generated `POST /rpc/:rpcName` endpoint forwards to, only reaches the functions you choose to expose. By default that is whatever the addon itself marked `expose: true`. `wireAddon`'s `expose` option overrides it for that instance:

```typescript @snippet rt-addon-expose
```

| `expose` | Reachable through `rpc.exposed` |
|----------|---------------------------------|
| unset or `true` | the functions the addon declared `expose: true` |
| `false` | none |
| `['a', 'b']` | exactly `a` and `b` |

The list is typed against the functions the addon publishes, and a name it doesn't publish fails the build with [PKU343](/docs/pikku-cli/errors/pku343). The setting belongs to the instance, so two `wireAddon` calls for the same package can expose different things. Deploys follow it too: the unit that serves an addon's `/rpc` routes only carries the functions its wiring exposes. `rpc.invoke` from your own functions isn't affected, because a unit whose code invokes an addon function bundles that addon itself.

`expose` controls what can be reached, not who can call it. An exposed function still runs its own `auth` and permissions, plus the instance's `auth` and `scopes`. If you list a sessionless function and none of those gate it, it is public.

## Type Safety

The CLI generates type definitions for all addon functions. Your IDE provides full autocompletion and type checking for both inputs and outputs:

```typescript @snippet rt-addon-typed-invoke
```

This works through generated type maps that prefix addon function types with their namespace:

The CLI generates `FlattenedRPCMap` for you: it is your own `RPCMap` intersected with each addon's map under its namespace prefix (`PrefixKeys<PostgresRPCMap, 'postgres'>`). You never write it.

## Wiring Addon Route Contracts

An addon cannot wire its own routes — that decision is yours. What it can ship is
a *contract*: a named group of routes with methods and paths already worked out.
Mount one with `refHTTP`, which takes the same `namespace:name` key as
`rpc.invoke`:

In `addons.wiring.ts`, call `wireHTTPRoutes(refHTTP('todos:todosRoutes'))`, with `wireHTTPRoutes` from `#pikku/http` and `refHTTP` from `#pikku/function`.

Pass a `basePath` to mount it somewhere else, and wrap it in a group config to
apply your own middleware to everything the addon exposes:

`wireHTTPRoutes` also accepts a config object. Give it `middleware` (such as `[rateLimit()]`) and a `routes` map, where each entry is a `refHTTP` call that can override the mount point: `todos: refHTTP('todos:todosRoutes', { basePath: '/api/todos' })`.

Group config accepts `basePath`, `tags`, `auth` and `middleware`. The addon's
contract carries none of those by design ([PKU921](/docs/pikku-cli/errors/pku921)),
so nothing is fighting you for them.

`refChannel` does the same for `defineChannelRoutes` contracts inside
`wireChannel`'s `onMessageWiring`. Both helpers resolve against the addon's
published contract metadata — no addon source is imported, and an unknown key is
a type error rather than a route that silently never mounts.

## Using Trigger Sources

Addons can export trigger source functions that listen for events. You wire them to your own handler functions in a `*.wiring.ts` file:

In a `change.wiring.ts`, import `wireTrigger` and `wireTriggerSource` from `#pikku/trigger`, the addon's `onChanges` from `@pikku/addon-postgres`, and your own `onChange` handler. Declare the trigger with `wireTrigger({ name: 'onChange', func: onChange })`. Then wire the addon's source to it with `wireTriggerSource({ name: 'onChange', func: onChanges, input: { events: ['DELETE', 'INSERT', 'UPDATE'], table: 'users' } })`.

Your handler function receives the trigger's output as typed input:

```typescript @snippet rt-addon-trigger-handler
```

This pattern works with any trigger source — Redis pub/sub, Telegram updates, file watchers, and more:

The Redis addon works the same way. Import `subscribe` from `@pikku/addon-redis` and wire it with `wireTriggerSource({ name: 'subscribe', func: subscribe, input: { channels: new Set(['notifications']), jsonParseBody: true } })`, after declaring `wireTrigger({ name: 'subscribe', func: onMessage })` for your own handler.

See [Triggers](/docs/wiring/triggers) for more details on how triggers work, and the [`#pikku/addon` door in the SDK explorer](/api#app/addon) for every option `wireAddon` takes.

## Multiple Addons

Wire multiple addons, each under their own namespace:

```typescript @snippet rt-wire-addon-multiple
```

Each addon's functions are prefixed with its namespace. For example, `rpc.invoke('postgres:insert', { table: 'orders', data: order })`, `rpc.invoke('redis:keySet', { key, value })` (the value being a JSON string) and `rpc.invoke('stripe:chargeCreate', { amount: 2000, currency: 'usd', source: 'tok_visa' })`.

## Secret Overrides

Addons define secrets with their own `secretId` names. If your application stores the same secret under a different name, you can override the mapping:

```typescript @snippet rt-wire-addon-secret-overrides
```

When the addon calls `(await secrets.getSecret('SENDGRID_API_KEY')).reveal()`, Pikku transparently looks up `MY_EMAIL_API_KEY` instead. The addon code doesn't need to know about your naming conventions.

## Best Practices

**Namespace naming**: Use short, descriptive namespaces (`postgres`, `stripe`, `redis`) that identify the addon's purpose.

**Provide secrets**: Addons declare what secrets they need via `defineSecret`. Make sure you've configured those secrets in your secret store before calling addon functions.

**Trigger configuration**: When wiring trigger sources, the `input` parameter controls what the trigger listens for. Check the addon documentation for available options.
