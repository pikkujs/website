---
sidebar_position: 1
title: Documentation Guide
description: Navigate Pikku documentation
---

# Documentation Guide

Find what you need based on where you are in your Pikku journey.

## Getting Started

New to Pikku? Start here:

1. **[Introduction](/docs/philosophy)** — Understand what Pikku is and why it exists
2. **[Getting Started](/getting-started)** — From an empty folder to a running platform
3. **[Functions](/docs/core-features/functions)** — Learn the core abstraction

## Learning Path

### Fundamentals

- [Functions](/docs/core-features/functions) — Core building blocks
- [Services](/docs/core-features/services) — Dependency injection
- [Middleware](/docs/core-features/middleware) — Request processing
- [Errors](/docs/core-features/errors) — Error handling
- [Import Patterns](/docs/advanced/import-patterns) — Where `#pikku/*` imports come from

### Protocols

- [HTTP](/docs/wiring/http) — REST APIs
- [Channels](/docs/wiring/channels) — WebSocket real-time
- [Queue](/docs/wiring/queue) — Background jobs
- [Scheduled Tasks](/docs/wiring/scheduled-tasks) — Cron jobs
- [CLI](/docs/wiring/cli) — Command-line tools
- [MCP](/docs/wiring/mcp) — Model Context Protocol

### Looking something up

- [API Reference](/docs/api-reference) — Every export, by the door you import it from
- [`#pikku/function`](/docs/api-reference/create/function) — `pikkuFunc` and friends
- [`#pikku/http`](/docs/api-reference/wire/http) — `wireHTTP`, `defineHTTPRoutes`
- [`#pikku/error`](/docs/api-reference/enhance/error) — every error class and its status
- [CLI errors](/docs/pikku-cli/errors) — what a `PKUxxx` code means and how to clear it

Or run `npx pikku doc` for the same thing in your terminal, generated from the
version you actually have installed.

### Going deeper

- [User Sessions](/docs/core-features/user-sessions) — Authentication & state
- [Permission Guards](/docs/core-features/permission-guards) — Authorization
- [Testing](/docs/core-features/testing) — Unit testing functions
- [Scenarios](/docs/core-features/scenarios) — Driving the whole system like a user
- [Tree-Shaking](/docs/pikku-cli/tree-shaking) — Optimized builds

### Configuration & Deployment

- [CLI Configuration](/docs/pikku-cli/configuration) — Configure code generation
- [Deploy](/docs/deploy) — Ship to cloud infrastructure or a standalone server

## I Want To...

### Build an API

1. [Create functions](/docs/core-features/functions)
2. [Wire HTTP routes](/docs/wiring/http)
3. [Add user sessions](/docs/core-features/user-sessions)
4. [Generate OpenAPI spec](/docs/pikku-cli/configuration#openapi-generation)

### Add Real-Time Features

1. [Understand channels](/docs/wiring/channels)
2. [Wire WebSocket handlers](/docs/wiring/channels)
3. [Generate WebSocket client](/docs/pikku-cli/configuration#client-generation)

### Deploy to Production

1. [Run `pikku deploy`](/docs/deploy) for the common providers
2. Or wire a [runtime](/docs/runtimes/express-middleware) into a server you already run
3. [Configure tree-shaking](/docs/pikku-cli/tree-shaking) (optional)

### Work in a Monorepo

1. [Configure package mappings](/docs/pikku-cli/configuration#monorepo-support)
2. [Generate shared clients](/docs/pikku-cli/configuration#client-generation)
3. [See monorepo example](https://github.com/pikkujs/yarn-workspace-starter)

### Go Under the Hood

- [Runtimes](/docs/runtimes/express-middleware) — Wire pikku into an existing server
- [Creating runtimes](/docs/custom-runtimes/custom-http-runtime) — Build your own adapter
- [Storage backends](/docs/storage) — Postgres, Redis, Mongo and friends
- [Service Interfaces](/docs/api/logger) — The contracts you implement to bring your own

### Migrate from Another Framework / Integrate Pikku with Another Framework

- From Express — *Coming Soon*
- From Hono — *Coming Soon*

## Still Need Help?

- [GitHub Discussions](https://github.com/pikkujs/pikku/discussions)
- [Report an Issue](https://github.com/pikkujs/pikku/issues)
