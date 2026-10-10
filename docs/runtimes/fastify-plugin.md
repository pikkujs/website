---
title: Fastify
description: Using Pikku with Fastify
hide_title: true
image: /img/logos/fastify-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku provides two Fastify packages:

- **`@pikku/fastify-plugin`** — drop Pikku into an existing Fastify app as a plugin
- **`@pikku/fastify`** — full managed server with health checks and graceful shutdown

## Fastify Plugin

Add Pikku to an existing Fastify app. Your non-Pikku routes and plugins work alongside it.

```bash
npm install @pikku/fastify-plugin
```

Create a Fastify instance, import the generated bootstrap, and build your config and singleton services. Register the plugin with `app.register(pikkuFastifyPlugin, { pikku: { ... } })`, where `pikkuFastifyPlugin` is the default export of `@pikku/fastify-plugin`. The `pikku` options are `logger`, `respondWith404: true`, `logRoutes: true` and `loadSchemas: true`. Your own Fastify routes keep working beside it, and you finish with `await app.listen({ port: 3000 })`.

Calling `createSingletonServices` registers the services into Pikku's global
state (the bootstrap import wires up the function and wire-service registry), so
the plugin only needs a `logger`.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `respondWith404` | `boolean` | `true` | Return 404 for routes not matched by Pikku |
| `logRoutes` | `boolean` | `false` | Log registered Pikku routes on startup |
| `loadSchemas` | `boolean` | `false` | Load JSON schemas for validation |

## Full Server (`PikkuFastifyServer`)

For projects where Pikku handles everything:

```bash
npm install @pikku/fastify
```

Import the generated bootstrap and `PikkuFastifyServer` from `@pikku/fastify`. After creating the config and singleton services, construct `new PikkuFastifyServer(config, singletonServices.logger)`. The underlying Fastify app is on `server.app` if you need to register your own plugins. Await `server.init()`, register a `SIGINT` handler that awaits `server.stop()` and exits, and then await `server.start()`.

The full server config extends `CoreConfig` with:

| Option | Type | Description |
|--------|------|-------------|
| `port` | `number` | Port to listen on |
| `hostname` | `string` | Hostname to bind to |
| `healthCheckPath` | `string` | Health check endpoint (default: `/health-check`) |

The underlying Fastify `app` is exposed as `server.app` if you need to add custom plugins or routes.
