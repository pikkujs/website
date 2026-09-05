---
title: The addon surface
sidebar_label: 'Building an addon'
sidebar_position: 7
description: 'The 15 doors an addon author imports from — what they share with the application surface, and what they do not.'
---

# The addon surface

An addon declares functions and contracts; the host application decides how the world reaches them. The same barrels are generated under `#pikku/addon/*`, minus every wiring — an addon that called `wireHTTP` would be registering a route in a registry it does not own.

An addon reaches its doors under `#pikku/addon/*` instead of `#pikku/*`: **15 doors, 154 exports**, from `@pikku/cli@0.12.133`.

## An addon declares; the application wires

That single rule explains almost every difference below. An addon ships functions, middleware, permissions and services — but the routes, channels and schedules that reach them belong to whoever installs it. So the addon doors are the application doors with the wiring calls taken out, and the CLI rejects an addon that tries anyway ([PKU920](/docs/pikku-cli/errors/pku920)).

What an addon cannot open at all:

- `#pikku/addon` — Installs an addon into this application, on its own or over rpc against a remote one.
- `#pikku/cli` — Wires a function as a command, with its flags and arguments derived from the function input.
- `#pikku/gateway` — Wires a function behind a gateway that receives requests on behalf of another system.
- `#pikku/queue` — Wires a function as a queue worker, so a job on the queue runs the same handler an HTTP route would.
- `#pikku/scheduler` — Wires a function to a cron expression to run it on a schedule.

## Every addon door

Doors marked *identical* export exactly what the application door does; follow the link for the full reference and read `#pikku/<door>` as `#pikku/addon/<door>`.

| Door | Exports | Difference from the application door |
| --- | --- | --- |
| [`#pikku/addon/function`](/docs/api-reference/create/function) | 20 | Identical — same exports, same shapes |
| [`#pikku/addon/setup`](/docs/api-reference/create/setup) | 8 | adds `AddonBaseServices`, `pikkuAddonConfig`, `pikkuAddonServices`, `pikkuAddonWireServices` |
| [`#pikku/addon/error`](/docs/api-reference/enhance/error) | 49 | Identical — same exports, same shapes |
| [`#pikku/addon/middleware`](/docs/api-reference/enhance/middleware) | 17 | Identical — same exports, same shapes |
| [`#pikku/addon/secrets`](/docs/api-reference/enhance/secrets) | 3 | Identical — same exports, same shapes |
| [`#pikku/addon/variables`](/docs/api-reference/enhance/variables) | 3 | Identical — same exports, same shapes |
| [`#pikku/addon/channel`](/docs/api-reference/wire/channel) | 4 | no `wireChannel` |
| [`#pikku/addon/http`](/docs/api-reference/wire/http) | 1 | no `wireHTTP`, `wireHTTPRoutes` |
| [`#pikku/addon/mcp`](/docs/api-reference/wire/mcp) | 3 | no `wireMCPPrompt`, `wireMCPResource` |
| [`#pikku/addon/trigger`](/docs/api-reference/wire/trigger) | 1 | no `wireTrigger`, `wireTriggerSource` |
| [`#pikku/addon/auth`](/docs/api-reference/guard/auth) | 6 | no `pikkuBetterAuth` |
| [`#pikku/addon/scopes`](/docs/api-reference/guard/scopes) | 2 | Identical — same exports, same shapes |
| [`#pikku/addon/agent`](/docs/api-reference/orchestrate/agent) | 7 | Identical — same exports, same shapes |
| [`#pikku/addon/workflow`](/docs/api-reference/orchestrate/workflow) | 6 | Identical — same exports, same shapes |
| [`#pikku/addon/scenarios`](/docs/api-reference/test/scenarios) | 24 | Identical — same exports, same shapes |

## Exports an addon has and an application does not

These exist only on the addon surface, so they are documented here in full.

### `#pikku/addon/setup`

The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in its own flavour, handed the logger, variables and secrets the host application already built. Everything else on this page is imported by features; these are imported by bootstrap and then left alone.

### `AddonBaseServices` {#addonbaseservices}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Base services provided to addon package service factories.
These are always available from the parent application.

### `pikkuAddonConfig` {#pikkuaddonconfig}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku config factory for addon packages.
Unlike `pikkuConfig`, this receives AddonBaseServices (logger, variables, secrets)
from the parent application, so addon packages can read variables/secrets during config creation.

```typescript
pikkuAddonConfig: <ExistingServices extends Omit<Partial<SingletonServices>, "variables" | "secrets"> & AddonBaseServices>(func: (services: ExistingServices) => Promise<Config>) => CreateConfig<Config>
```

### `pikkuAddonServices` {#pikkuaddonservices}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku singleton services factory for addon packages.
Unlike `pikkuServices`, this expects the parent application to provide
logger, variables, and secrets - no fallbacks needed.

```typescript
pikkuAddonServices: <T extends Record<string, any>, ExistingServices extends Omit<Partial<SingletonServices>, "variables" | "secrets"> & AddonBaseServices>(func: (config: Config, services: ExistingServices) => Promise<T>) => (config: Config, existingServices?: Partial<SingletonServices>) => Promise<RequiredSingletonServices>
```

```typescript
export const createSingletonServices = pikkuAddonServices(async (
  config,
  { secrets }
) => {
  const creds = await secrets.getSecret<GithubCredentials>('GITHUB_CREDENTIALS')
  const github = new GithubService(creds.reveal())
  return { github }
})
```

### `pikkuAddonWireServices` {#pikkuaddonwireservices}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku wire services factory for addon packages.
Wire services are created per-request and have access to the HTTP request context.

```typescript
pikkuAddonWireServices: <ExistingServices extends Omit<Partial<SingletonServices>, "variables" | "secrets"> & AddonBaseServices>(func: (services: ExistingServices, wire: PikkuWire) => Promise<Record<string, any>>) => any
```

```typescript
export const createWireServices = pikkuAddonWireServices(async (services, wire) => {
  const authHeader = wire.http?.request?.header('authorization')
  return { myService: new MyService(authHeader) }
})
```

---

Run `npx pikku doc --addon` to print this surface in the terminal, and see [Addons](/docs/addon) for how to build and publish one.
