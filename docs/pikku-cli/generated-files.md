---
sidebar_position: 3
title: Generated Files
description: What the Pikku CLI generates and how to use it
ai: true
---

# Generated Files

When you run `pikku`, the CLI writes a set of generated files into your `outDir` (default: `.pikku/`). These files wire everything together — types, metadata, schemas, registration, and service maps. You import from them via the `#pikku` alias and never edit them by hand.

## The `#pikku` Import Alias

Your `package.json` maps `#pikku` to the generated output directory:

```json
{
  "imports": {
    "#pikku/*": "./.pikku/*"
  }
}
```

This lets you write clean imports throughout your code:

```typescript
import { pikkuFunc, wireHTTP } from '#pikku'
```

Instead of fragile relative paths like `../../.pikku/function/pikku-function-types.gen.js`.

## Directory Structure

```
.pikku/
├── pikku-bootstrap.gen.ts       # Master import — registers everything
├── pikku-types.gen.ts           # Re-exports all wiring-specific types
├── pikku-services.gen.ts        # Service dependency map
├── pikku-meta-service.gen.ts    # Meta service for Console
│
├── function/
│   ├── pikku-function-types.gen.ts    # pikkuFunc, pikkuSessionlessFunc, etc.
│   ├── pikku-functions.gen.ts         # Function registration calls
│   ├── pikku-functions-meta.gen.ts    # Function metadata (runtime)
│   └── pikku-functions-meta.gen.json  # Function metadata (static)
│
├── http/
│   ├── pikku-http-types.gen.ts        # wireHTTP and related types
│   ├── pikku-http-wirings.gen.ts      # HTTP route registration
│   ├── pikku-http-wirings-meta.gen.ts
│   └── pikku-http-wirings-map.gen.d.ts  # Typed route map
│
├── channel/
│   ├── pikku-channel-types.gen.ts     # wireChannel types
│   ├── pikku-channels.gen.ts          # Channel registration
│   ├── pikku-channels-meta.gen.ts
│   └── pikku-channels-map.gen.d.ts    # Typed channel map
│
├── rpc/
│   ├── pikku-rpc-wirings-map.gen.d.ts          # Public RPC type map
│   ├── pikku-rpc-wirings-map.internal.gen.d.ts # Internal RPC type map
│   ├── pikku-rpc-wirings-meta.internal.gen.ts  # RPC metadata
│   └── pikku-rpc-wirings-meta.internal.gen.json
│
├── queue/
│   ├── pikku-queue-types.gen.ts       # wireQueueWorker types
│   ├── pikku-queue-workers-wirings.gen.ts
│   ├── pikku-queue-workers-wirings-meta.gen.ts
│   └── pikku-queue-workers-wirings-map.gen.d.ts
│
├── scheduler/
│   └── pikku-scheduler-types.gen.ts   # wireScheduler types
│
├── workflow/
│   ├── pikku-workflow-types.gen.ts     # Typed workflow definitions
│   ├── pikku-workflow-wirings.gen.ts   # Workflow registration
│   ├── pikku-workflow-wirings-meta.gen.ts
│   ├── pikku-workflow-map.gen.d.ts     # Typed workflow map
│   └── meta/                           # Per-workflow JSON metadata
│       ├── myWorkflow.gen.json
│       └── myWorkflow-verbose.gen.json
│
├── agent/
│   ├── pikku-agent-types.gen.ts       # pikkuAIAgent type helper
│   ├── pikku-agent-wirings.gen.ts     # Agent registration
│   ├── pikku-agent-wirings-meta.gen.ts
│   ├── pikku-agent-wirings-meta.gen.json
│   └── pikku-agent-map.gen.d.ts       # Typed agent map
│
├── mcp/
│   ├── pikku-mcp-types.gen.ts         # MCP wiring types
│   ├── pikku-mcp-wirings.gen.ts
│   └── pikku-mcp-wirings-meta.gen.ts
│
├── cli/
│   ├── pikku-cli-types.gen.ts         # wireCLI, pikkuCLICommand types
│   ├── pikku-cli-wirings.gen.ts
│   ├── pikku-cli-wirings-meta.gen.ts
│   └── pikku-cli-bootstrap.gen.ts
│
├── trigger/
│   ├── pikku-trigger-types.gen.ts     # wireTrigger types
│   ├── pikku-trigger-wirings.gen.ts
│   └── pikku-trigger-wirings-meta.gen.ts
│
├── gateway/
│   └── pikku-gateway-wirings.gen.ts   # Gateway registration
│
├── middleware/
│   ├── pikku-middleware.gen.ts         # Middleware registration
│   └── pikku-middleware-groups-meta.gen.json
│
├── permissions/
│   ├── pikku-permissions.gen.ts
│   └── pikku-permissions-groups-meta.gen.json
│
├── schemas/
│   ├── register.gen.ts                # Schema registration
│   └── schemas/                       # Individual JSON schema files
│
├── secrets/
│   ├── pikku-secret-types.gen.ts      # Typed secret definitions
│   ├── pikku-secrets.gen.ts           # Typed SecretService wrapper
│   └── pikku-secrets-meta.gen.json
│
├── variables/
│   ├── pikku-variable-types.gen.ts    # Typed variable definitions
│   ├── pikku-variables.gen.ts         # Typed VariablesService wrapper
│   └── pikku-variables-meta.gen.json
│
├── credentials/
│   ├── pikku-credentials.gen.ts       # Typed credential wrappers
│   └── pikku-credentials-meta.gen.json
│
├── addon/
│   ├── pikku-package.gen.ts           # Addon package registration
│   └── pikku-addon-types.gen.ts       # Addon config/service types
│
└── console/
    ├── pikku-node-types.gen.ts        # Console node types
    └── pikku-addon-meta.gen.json      # Addon metadata for Console
```

Not every directory is generated for every project — only the ones relevant to your wirings. If you don't use workflows, there's no `workflow/` directory.

## Key Files

### `pikku-bootstrap.gen.ts`

The master entry point. Importing this file registers all your functions, wirings, metadata, middleware, schemas, and addon bootstraps. Your runtime entry point should import it before doing anything else:

```typescript
import './.pikku/pikku-bootstrap.gen.js'
```

### `pikku-types.gen.ts`

Re-exports all the type helpers you use in your code — `pikkuFunc`, `pikkuSessionlessFunc`, `wireHTTP`, `wireChannel`, `pikkuAIAgent`, etc. This is what `#pikku` resolves to when you write:

```typescript
import { pikkuFunc } from '#pikku'
```

### `pikku-services.gen.ts`

Maps which singleton and wire services your project actually uses. The CLI detects this by analyzing which services your functions destructure. This powers:

- **Type narrowing** — `RequiredSingletonServices` only requires the services you use
- **Deploy analysis** — the deploy pipeline knows what infrastructure each function needs
- **Validation** — the Console warns if a required service isn't provided

### Function Types (`function/pikku-function-types.gen.ts`)

This is the big one. It generates type-safe function constructors that are parameterized with your project's specific `UserSession`, `SingletonServices`, `Services`, and `Config` types:

```typescript
// These come from your application-types.d.ts
import type { UserSession } from '../../src/application-types.d.js'
import type { SingletonServices } from '../../src/application-types.d.js'
import type { Services } from '../../src/application-types.d.js'

// The generated pikkuFunc knows your exact types
export function pikkuFunc<In, Out>(config: {
  func: (services: SingletonServices, data: In, wire: PikkuWire<In, Out, true, UserSession>) => Promise<Out>
  // ...
}): { func: CorePikkuFunction<In, Out, SingletonServices, UserSession> }
```

This is why `pikkuFunc` "just works" with autocomplete for your services and session — the types are generated from your actual code.

## Metadata Files

Files ending in `.gen.json` contain static metadata used by:

- **The Console** — displays functions, routes, agents, workflows visually
- **The deploy pipeline** — analyzes what needs to be deployed
- **OpenAPI generation** — builds API specs from HTTP metadata
- **MCP servers** — exposes tool/resource/prompt catalogs

The `.gen.ts` counterparts register the same metadata at runtime.

## Regeneration

Generated files are fully deterministic — same source code always produces the same output. You should:

- **Add `.pikku/` to `.gitignore`** — regenerate in CI, don't commit
- **Run `pikku` in your build step** — `"prebuild": "pikku"` in `package.json`
- **Use `pikku watch`** in development — files stay in sync as you edit

## Next Steps

- **[Configuration](/docs/pikku-cli/configuration)** — Override output paths for any generated file
- **[Tree-Shaking](/docs/pikku-cli/tree-shaking)** — How filtering reduces generated output
