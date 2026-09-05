---
sidebar_position: 0
title: Addons
description: Reusable function packages with namespaced RPC
---

# Addons

Imagine an ecosystem of plug-and-play backend modules. Need Stripe? Install `@pikku/addon-stripe` and call `stripe:createCheckout`. Need analytics? Install `@pikku/addon-posthog` and call `posthog:track`. Each addon is a complete integration - tested, typed, and ready to use.

:::note Those two are illustrations, not shipping packages
The addon mechanism is real and documented on these pages; the published first-party addons today are `@pikku/addon-admin` (users, roles and scopes, credentials, audit trail), `@pikku/addon-console` and `@pikku/addon-graph`. Every other `@pikku/addon-*` name in this section is a stand-in for an addon you or someone else would write.
:::

"Why not just use the official SDK?" Many services don't have one - they're HTTP APIs with docs and nothing else. And even services with SDKs still require you to instantiate clients, manage secrets, handle errors, and wire everything into your application. Addons handle all of that. You install, configure secrets, and call functions.


## Why This Matters

**Drop-in functionality.** Install an addon, add one line of config, and call `rpc.invoke('stripe:createPayment', data)`. The addon author has already handled validation, error handling, and secret management.

**Type-safe across boundaries.** The CLI generates TypeScript definitions for all addon functions. Your IDE knows the exact input/output types for `analytics:trackEvent` even though that function lives in a separate npm package.

**Namespace isolation.** Each addon gets its own prefix. No naming collisions between `auth:validateToken` from one addon and `auth:refreshSession` from another.

**Shared infrastructure.** Addons reuse your existing logger, database connections, and services. No duplicate connections or configuration.

**Secret mapping.** Addons define what secrets they need. You control where those secrets come from in your infrastructure.

## What Can Be Exported

An addon *declares*; the application that installs it *wires*. That one rule is
why an addon can hand you a set of routes but cannot mount them, and why the CLI
rejects a `wire*` call inside addon code ([PKU920](/docs/pikku-cli/errors/pku920)).

Addons can include:

- **Functions** — business logic callable via RPC as `namespace:functionName`
- **Route contracts** — named groups of HTTP routes or channel messages, declared with `defineHTTPRoutes` / `defineChannelRoutes` and mounted by the consumer with `refHTTP` / `refChannel`
- **Middleware** — reusable request/response handlers the consumer chooses to apply
- **Permissions** — access control definitions the consumer attaches at wiring time
- **Secrets and credentials** — schemas the consumer maps onto their own infrastructure
- **Services** — singleton and wire services, built from the consumer's logger, variables and secrets
- **Trigger sources** — event listeners the consumer wires to their own handlers

## Where to Go Next

- [Creating Addons](./creating.md) — scaffolding, services, contracts, publishing
- [Consuming Addons](./consuming.md) — installing one and wiring what it declares
- [The addon surface](/docs/api-reference/addons) — every export available under `#pikku/addon/*`, door by door
