---
sidebar_position: 3
title: Generated Files
description: What the Pikku CLI generates and how to use it
ai: true
---

# Generated Files

When you run `pikku`, the CLI writes a set of generated files into your `outDir` (default: `.pikku/`). These files wire everything together — types, metadata, schemas, registration, and service maps. You import from them via the `#pikku` alias and never edit them by hand.

## The `#pikku` Import Alias

Your `package.json` maps `#pikku/*` onto the generated output directory — one subpath per door, and no bare `#pikku`:

```json
{
  "imports": {
    "#pikku/*.js": "./.pikku/*.ts",
    "#pikku/*": ["./.pikku/*/index.ts", "./.pikku/*"]
  }
}
```

This lets you write clean imports throughout your code:

```typescript
import { pikkuFunc } from '#pikku/function'
import { wireHTTP } from '#pikku/http'
```

Instead of fragile relative paths like `../../.pikku/function/pikku-function-types.gen.js`.

## Directory Structure

```
.pikku/
├── pikku-bootstrap.gen.ts             # Master import — registers everything
├── pikku-bootstrap-scenarios.gen.ts   # The same, for scenario runs
├── pikku-services.gen.ts              # Service requirement maps
│
├── setup/
│   ├── pikku-setup-types.gen.ts       # pikkuConfig, pikkuServices, pikkuWireServices
│   ├── pikku-addon-setup-types.gen.ts # The addon's setup leaf (addon mode only)
│   └── index.ts                       # #pikku/setup
│
├── services/
│   └── pikku-meta-service.gen.ts      # LocalMetaService subclass for the Console
│
├── function/
│   ├── pikku-function-types.gen.ts    # pikkuFunc, pikkuSessionlessFunc, etc.
│   ├── pikku-functions.gen.ts         # Function registration calls
│   ├── pikku-functions-meta.gen.ts    # Function metadata (runtime)
│   ├── pikku-functions-meta.gen.json  # Function metadata (static)
│   └── index.ts                       # #pikku/function
│
├── http/
│   ├── pikku-http-types.gen.ts        # wireHTTP and related types
│   ├── pikku-http-wirings.gen.ts      # HTTP route registration
│   ├── pikku-http-wirings-meta.gen.ts
│   ├── pikku-http-wirings-meta.gen.json
│   ├── pikku-http-contracts-meta.gen.ts
│   ├── pikku-http-contracts-meta.gen.json
│   ├── pikku-http-wirings-map.gen.d.ts  # Typed route map
│   └── index.ts                       # #pikku/http
│
├── channel/
│   ├── pikku-channel-types.gen.ts     # wireChannel types
│   ├── pikku-channels.gen.ts          # Channel registration
│   ├── pikku-channels-meta.gen.ts
│   ├── pikku-channels-meta.gen.json
│   ├── pikku-channel-contracts-meta.gen.ts
│   ├── pikku-channel-contracts-meta.gen.json
│   ├── pikku-channels-map.gen.d.ts    # Typed channel map
│   └── index.ts                       # #pikku/channel
│
├── rpc/
│   ├── pikku-rpc-wirings-map.gen.d.ts          # Public RPC type map
│   ├── pikku-rpc-wirings-map.internal.gen.d.ts # Internal RPC type map
│   ├── pikku-rpc-wirings-map.remote.gen.d.ts   # The `remote: true` surface
│   ├── pikku-rpc-wirings-meta.internal.gen.ts  # RPC metadata
│   └── pikku-rpc-wirings-meta.internal.gen.json
│
├── queue/
│   ├── pikku-queue-types.gen.ts       # wireQueueWorker types
│   ├── pikku-queue-workers-wirings.gen.ts
│   ├── pikku-queue-workers-wirings-meta.gen.ts
│   ├── pikku-queue-workers-wirings-meta.gen.json
│   ├── pikku-queue-workers-wirings-map.gen.d.ts
│   └── index.ts                       # #pikku/queue
│
├── scheduler/
│   ├── pikku-scheduler-types.gen.ts   # wireScheduler types
│   ├── pikku-schedulers-wirings.gen.ts
│   ├── pikku-schedulers-wirings-meta.gen.ts
│   ├── pikku-schedulers-wirings-meta.gen.json
│   └── index.ts                       # #pikku/scheduler
│
├── workflow/
│   ├── pikku-workflow-types.gen.ts     # Typed workflow definitions
│   ├── pikku-workflow-wirings.gen.ts   # Workflow registration
│   ├── pikku-workflow-wirings-meta.gen.ts
│   ├── pikku-workflow-workers.gen.ts   # Workflow step workers
│   ├── pikku-workflow-map.gen.d.ts     # Typed workflow map
│   ├── pikku-scenario-step-map.gen.d.ts
│   ├── index.ts                        # #pikku/workflow
│   └── meta/                           # Per-workflow JSON metadata
│       ├── myWorkflow.gen.json
│       └── myWorkflow-verbose.gen.json
│
├── scenarios/
│   ├── pikku-scenario-types.gen.ts     # pikkuScenario / pikkuScenarioStep types
│   ├── pikku-personas.gen.ts           # Runtime persona/actor list
│   ├── pikku-scenario-functions.gen.ts
│   ├── pikku-scenario-functions-meta.gen.ts
│   ├── pikku-scenario-functions-meta.gen.json
│   ├── pikku-scenario-wirings.gen.ts
│   ├── pikku-scenario-wirings-meta.gen.ts
│   ├── index.ts                        # #pikku/scenarios
│   ├── meta/                           # Per-scenario JSON metadata
│   └── schemas/                        # Schemas only a scenario or step needs
│
├── agent/
│   ├── pikku-agent-types.gen.ts       # pikkuAgent type helper
│   ├── pikku-agent-wirings.gen.ts     # Agent registration
│   ├── pikku-agent-wirings-meta.gen.ts
│   ├── pikku-agent-wirings-meta.gen.json
│   ├── pikku-agent-map.gen.d.ts       # Typed agent map
│   ├── pikku-model-aliases.gen.ts     # Runtime `models` alias table
│   ├── pikku-scorer-wirings.gen.ts
│   ├── pikku-scorer-wirings-meta.gen.ts
│   ├── pikku-scorer-wirings-meta.gen.json
│   ├── pikku-scorer-names.gen.d.ts
│   └── index.ts                       # #pikku/agent
│
├── mcp/
│   ├── pikku-mcp-types.gen.ts         # MCP wiring types
│   ├── pikku-mcp-wirings.gen.ts
│   ├── pikku-mcp-wirings-meta.gen.ts
│   ├── pikku-mcp-wirings-meta.gen.json
│   ├── mcp.gen.json                   # MCP server manifest (read by deploy)
│   └── index.ts                       # #pikku/mcp
│
├── cli/
│   ├── pikku-cli-types.gen.ts         # wireCLI, pikkuCLICommand types
│   ├── pikku-cli-wirings.gen.ts
│   ├── pikku-cli-wirings-meta.gen.ts
│   ├── pikku-cli-wirings-meta.gen.json
│   ├── pikku-cli-contracts-meta.gen.ts
│   ├── pikku-cli-contracts-meta.gen.json
│   ├── pikku-cli-bootstrap.gen.ts
│   └── index.ts                       # #pikku/cli
│
├── trigger/
│   ├── pikku-trigger-types.gen.ts     # wireTrigger types
│   ├── pikku-trigger-wirings.gen.ts
│   ├── pikku-trigger-wirings-meta.gen.ts
│   ├── pikku-trigger-wirings-meta.gen.json
│   ├── pikku-trigger-sources-meta.gen.ts
│   ├── pikku-trigger-sources-meta.gen.json
│   └── index.ts                       # #pikku/trigger
│
├── gateway/
│   ├── pikku-gateway-types.gen.ts
│   ├── pikku-gateway-wirings.gen.ts   # Gateway registration
│   ├── pikku-gateway-wirings-meta.gen.ts
│   ├── pikku-gateway-wirings-meta.gen.json
│   └── index.ts                       # #pikku/gateway
│
├── middleware/
│   ├── pikku-middleware-types.gen.ts  # CorePikkuMiddleware typing
│   ├── pikku-middleware.gen.ts         # Middleware registration
│   ├── pikku-middleware-groups-meta.gen.json
│   └── index.ts                        # #pikku/middleware
│
├── permissions/
│   ├── pikku-permissions.gen.ts
│   └── pikku-permissions-groups-meta.gen.json
│
├── auth/
│   ├── pikku-auth-types.gen.ts        # Permissions, auth gates, defineCredential
│   ├── auth.types.ts                  # Typed pikkuBetterAuth re-export
│   └── pikku-auth-meta.gen.json       # Enabled social providers/plugins
│
├── scopes/
│   ├── pikku-scope-types.gen.ts       # defineScope, defineSystemRole, defineFeatureFlags
│   ├── pikku-scopes.gen.ts            # ScopeId union + declared scope set
│   ├── pikku-scopes-meta.gen.json
│   ├── pikku-roles.gen.ts             # SystemRoleName union + declared roles
│   ├── pikku-roles-meta.gen.json
│   ├── pikku-flags.gen.ts             # FeatureFlagName union + declared flags
│   ├── pikku-flags-meta.gen.json
│   ├── pikku-personas.gen.ts          # Typed definePersonas + PersonaId union
│   ├── pikku-personas-meta.gen.json
│   └── index.ts                        # #pikku/scopes
│
├── analytics/
│   ├── pikku-analytics-types.gen.ts   # defineAnalyticsEvents
│   ├── pikku-analytics-meta.gen.json
│   └── index.ts                       # #pikku/analytics
│
├── schemas/
│   ├── register.gen.ts                # Schema registration
│   └── schemas/                       # Individual JSON schema files
│
├── secrets/
│   ├── pikku-secret-types.gen.ts      # defineSecret types
│   ├── pikku-secrets.gen.ts           # Typed SecretService wrapper
│   ├── pikku-secrets-meta.gen.json
│   └── index.ts                       # #pikku/secrets
│
├── variables/
│   ├── pikku-variable-types.gen.ts    # defineVariable types
│   ├── pikku-variables.gen.ts         # Typed VariablesService wrapper
│   ├── pikku-variables-meta.gen.json
│   └── index.ts                       # #pikku/variables
│
├── credentials/
│   ├── pikku-credentials.gen.ts       # Typed credential wrappers
│   ├── pikku-credentials-meta.gen.json
│   └── index.ts                       # #pikku/credentials
│
├── error/
│   ├── pikku-error-types.gen.ts       # The error catalogue
│   └── index.ts                       # #pikku/error
│
├── email/                             # When emailTemplatesDir is set
│   ├── pikku-emails.gen.ts            # Typed email renderers
│   └── pikku-emails-meta.gen.json
│
├── db/                                # When the project has db/ migrations
│   ├── schema.gen.ts
│   ├── zod.gen.ts
│   ├── coercion.gen.ts
│   ├── enums.gen.ts
│   ├── classification.gen.ts
│   ├── classification-map.gen.d.ts
│   └── pikku-db-schema.gen.json
│
├── addon/
│   ├── pikku-package.gen.ts           # Addon package registration
│   ├── pikku-addon-types.gen.ts       # Addon config/service types
│   └── index.ts                       # #pikku/addon
│
└── console/
    └── pikku-addon-meta.gen.json      # Addon metadata for the Console
```

Any wiring's `.gen.json` meta can also have a `-verbose.gen.json` sibling (`pikku-http-wirings-meta-verbose.gen.json`, `myWorkflow-verbose.gen.json`); the minimal copy ships to every runtime, while the verbose one is read off disk by the Console and other documentation.

Not every directory is generated for every project — only the ones relevant to your wirings. If you don't use workflows, there's no `workflow/` directory. In addon mode (`"addon": true`) the whole tree is written one level deeper, at `outDir/addon/`, so every leaf an addon authors resolves as `#pikku/addon/<leaf>`.

A few generated files live **outside** `outDir`, in your source tree, because the inspector needs to scan them like regular code: the Better Auth wiring (`auth.gen.ts`, plus `auth-secrets.gen.ts` and `auth-middleware.gen.ts` beside it) at the `authFile` path, the feature scaffold files (`rpc-public.gen.ts`, `analytics.gen.ts`, `feature-flags.gen.ts`, `console.gen.ts`, `virtual-user.gen.ts`, `agent.gen.ts`, `workflow-routes.gen.ts`, `events.gen.ts`, `rpc-remote.gen.ts`, `remote-jobs.gen.ts`, `webhook.gen.ts`, `graph.wirings.gen.ts`) under `scaffold.pikkuDir`, and `db/annotations.gen.json` beside the authored `db/annotations.ts`.

## Key Files

### `pikku-bootstrap.gen.ts`

The master entry point. Importing this file registers all your functions, wirings, metadata, middleware, schemas, and addon bootstraps. Your runtime entry point should import it before doing anything else:

```typescript
import '#pikku/pikku-bootstrap.gen.js'
```

### Door barrels (`<door>/index.ts`)

Every concern directory carries an `index.ts` that `#pikku/<door>` resolves to. It re-exports that concern's generated types — so `#pikku/function` gives you `pikkuFunc` and `pikkuSessionlessFunc`, `#pikku/http` gives you `wireHTTP`, and so on:

```typescript
import { pikkuFunc } from '#pikku/function'
import { wireHTTP } from '#pikku/http'
```

The doors are `function`, `middleware`, `setup`, `error`, `http`, `channel`, `gateway`, `trigger`, `scheduler`, `queue`, `workflow`, `scenarios`, `mcp`, `agent`, `cli`, `addon`, `secrets`, `credentials`, `scopes`, `analytics`, `variables`, and `auth`. There is no single re-export hub and no bare `#pikku` — see [Import Patterns](/docs/advanced/import-patterns) for the full alias setup, and the [API Reference](/docs/api-reference) for what each door exports.

### `pikku-services.gen.ts`

Maps which singleton and wire services your project actually uses. The CLI detects this by analyzing which services your functions destructure. This powers:

- **Type narrowing** — `RequiredSingletonServices` only requires the services you use
- **Deploy analysis** — the deploy pipeline knows what infrastructure each function needs
- **Conditional loading** — your services factory can construct only what a deployment reaches

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
