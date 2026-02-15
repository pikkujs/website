---
sidebar_position: 0
title: External Packages
description: Reusable function packages with namespaced RPC
---

# External Packages

Imagine an ecosystem of plug-and-play backend modules. Need Stripe? Install `@pikku/stripe` and call `stripe:createCheckout`. Need analytics? Install `@pikku/posthog` and call `posthog:track`. Each package is a complete integration - tested, typed, and ready to use.

"Why not just use the official SDK?" Many services don't have one - they're HTTP APIs with docs and nothing else. And even services with SDKs still require you to instantiate clients, manage secrets, handle errors, and wire everything into your application. External packages handle all of that. You install, configure secrets, and call functions.

This architecture also powers Pikku Forge - where external packages become visual building blocks you can drag into workflows. The same package that works in your code works in Forge's no-code environment.

## Why This Matters

**Drop-in functionality.** Install a package, add one line of config, and call `rpc.invoke('stripe:createPayment', data)`. The package author has already handled validation, error handling, and secret management.

**Type-safe across boundaries.** The CLI generates TypeScript definitions for all external package functions. Your IDE knows the exact input/output types for `analytics:trackEvent` even though that function lives in a separate npm package.

**Namespace isolation.** Each package gets its own prefix. No naming collisions between `auth:validateToken` from one package and `auth:refreshSession` from another.

**Shared infrastructure.** External packages reuse your existing logger, database connections, and services. No duplicate connections or configuration.

**Secret mapping.** Packages define what secrets they need. You control where those secrets come from in your infrastructure.

## What Can Be Exported

External packages can include:

- **Functions** - Business logic callable via RPC
- **Routes** - Pre-defined HTTP routes, CLI commands, and channel handlers
- **Middleware** - Reusable request/response handlers
- **Permissions** - Access control definitions
- **Secrets** - Secret schemas (with override support)
- **Services** - Singleton and wire services
