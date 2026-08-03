---
sidebar_position: 21
title: Server Lifecycle
description: Run setup and teardown work around your server with lifecycle hooks
---

# Server Lifecycle

Your service factory's job is to **build** services. But plenty of startup work isn't building anything — running migrations, seeding development data, warming a cache, starting a background consumer, draining a queue on the way down.

Lifecycle hooks are where that work goes. They run around your server starting and stopping, and each one receives the singleton services that have already been created.

## Your First Lifecycle Hook

Export a `pikkuServerLifecycle` from anywhere in your `srcDirectories`:

```typescript title="src/lifecycle.ts"
import { pikkuServerLifecycle } from "@pikku/core";
import type { SingletonServices } from "../types/application-types.js";

export const lifecycle = pikkuServerLifecycle<SingletonServices>({
  afterStart: async ({ logger }) => {
    logger.info("Server ready");
  },
});
```

That's the whole setup. There's no registration step — the Pikku CLI finds the export by static analysis, the same way it finds your functions and wirings.

## The Four Hooks

All four are optional. Each receives your singleton services.

| Hook          | When it runs                                                        |
| ------------- | ------------------------------------------------------------------- |
| `beforeStart` | Services are built, server is initialised, port is **not** open yet |
| `afterStart`  | Server is listening and accepting traffic                           |
| `beforeStop`  | Shutdown requested, services still alive                            |
| `afterStop`   | Server stopped and services already shut down                       |

The full order is:

```text
create services
  → beforeStart
  → server starts
  → afterStart
        ... serving ...
  → beforeStop
  → services stopped
  → server stopped
  → afterStop
```

Use `beforeStart` for anything that must be true before the first request lands — migrations, required schema checks. Use `afterStart` for work that wants a live server, like seeding data through your own API.

:::warning `afterStop` runs after your services are stopped
`afterStop` still receives the services object, but the services inside it have already been shut down. Calling into your database or queue there is a use-after-close bug. **Anything that needs a live service belongs in `beforeStop`.**
:::

## A Fuller Example

```typescript title="src/lifecycle.ts"
import { pikkuServerLifecycle } from "@pikku/core";
import type { SingletonServices } from "../types/application-types.js";

export const lifecycle = pikkuServerLifecycle<SingletonServices>({
  beforeStart: async ({ kysely, logger }) => {
    await migrateToLatest(kysely);
    logger.info("Database up to date");
  },

  afterStart: async ({ logger, variables }) => {
    if (variables.get("SEED_DEV_DATA") === "true") {
      await seedTodos();
      logger.info("Seeded development data");
    }
  },

  beforeStop: async ({ queueService, logger }) => {
    await queueService.drain();
    logger.info("Queue drained");
  },
});
```

Note that hooks read configuration through the `variables` service, exactly like your functions do — `process.env` doesn't belong here either.

## Where the Hooks Run

:::info Only `pikku dev` and `pikku serve` run lifecycle hooks
These two commands own the whole lifecycle: they create your config and services, start the server, and shut it down cleanly. The hooks are how you get a word in.

If you bootstrap your own server — Express, Fastify, uWS, Lambda, Cloudflare, Next.js — Pikku is embedded in a server _you_ control, and no runtime adapter invokes these hooks. Do that work directly in your entrypoint instead.
:::

This is the main thing to decide up front. If you don't need a specific runtime, letting `pikku serve` own the server means you write no bootstrap code at all:

```json title="package.json"
{
  "scripts": {
    "dev": "pikku dev",
    "start": "pikku serve"
  }
}
```

If you do need a specific runtime, keep your `start.ts` — that's what runtime adapters are for.

## Discovery Rules

The CLI reads your source with the TypeScript AST and never executes it, so the export has to be statically visible:

- It must be an exported `const` initialised with a **direct call** to `pikkuServerLifecycle`. A re-export, a conditional, or a factory that returns the object is invisible.
- **Export exactly one** per project. The filename is free — `src/lifecycle.ts` is the convention.
- The file must live under a directory listed in `srcDirectories` in your `pikku.config.json`.

:::tip Checking your setup
`pikku workspace validate` warns when your `start`/`dev` script boots a server by hand _and_ no Pikku runtime adapter is installed — the combination that means lifecycle hooks were available and went unused. Silence it with `"lint": { "customServerBootstrap": "off" }` in `pikku.config.json`, or set `"error"` to enforce it.
:::

## Related

- [Services](/docs/core-features/services) – Building the singleton services the hooks receive
- [Variables](/docs/core-features/variables) – Reading configuration inside a hook
- [Pikku CLI](/docs/pikku-cli) – `pikku dev` and `pikku serve`
