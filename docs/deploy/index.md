---
sidebar_position: 0
title: Deploy
description: Deploy your Pikku project to cloud infrastructure
ai: true
---

# Deploy

The Pikku deploy pipeline analyzes your project, splits it into deployment units, tree-shakes each one, generates provider-specific entry points, and provisions infrastructure — all from a single command.

## How It Works

1. **Analyze** — the CLI inspects your functions, wirings, and services to build a deployment manifest
2. **Split** — functions are grouped into deployment units by the services they build. Gateways (MCP servers, agents, channels) get separate units that dispatch to function units via RPC
3. **Codegen** — per-unit entry points are generated with only the imports each unit needs
4. **Bundle** — each unit is bundled and tree-shaken independently
5. **Deploy** — the provider adapter provisions infrastructure (workers, queues, cron triggers, secrets) and uploads the bundles

The core principle: **a unit holds only what its functions reach**. Each unit is bundled from its own imports, so it scales, fails and cold-starts on its own — and `deploy.grouping` decides how finely the app is cut, down to one function per unit.

## Quick Start

```bash
# See what will be deployed
npx pikku deploy plan

# Deploy it
npx pikku deploy apply

# Check current state
npx pikku deploy info
```

## Configuration

Add a `deploy` section to your `pikku.config.json`:

```json
{
  "deploy": {
    "providers": {
      "cloudflare": "@pikku/deploy-cloudflare"
    },
    "defaultProvider": "cloudflare"
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `providers` | `Record<string, string>` | Map of provider names to adapter packages |
| `defaultProvider` | `string` | Which provider to use when `--provider` isn't passed |
| `serverlessIncompatible` | `string[]` | Function names that can't run serverless (routed to a server fallback) |
| `defaultTarget` | `"serverless"` \| `"server"` | Target for functions with no explicit `deploy` flag (default: `serverless`) |
| `grouping` | `object` | How many deployment units the app's functions collapse into — see below |

## Deployment unit grouping

By default a function shares a deployment unit — a worker, a bundle, a set of
bindings — with every other function that builds the same set of singleton
services. One unit per function gives more isolation, and is a `strategy` away,
but it is not always the right shape: a large app then reaches a hundred workers
whose bundles are mostly the same framework and third-party code repeated, and
every one of them is a build and an upload.

`deploy.grouping` decides how many units you actually deploy.

```json
{
  "deploy": {
    "defaultTarget": "serverless",
    "serverlessIncompatible": ["pdfService"],
    "grouping": {
      "strategy": "single",
      "rules": [
        { "unit": "console", "addon": "console" },
        { "unit": "pdf", "tags": ["pdf"] },
        { "unit": "webhooks", "routes": ["/api/webhooks/*"] }
      ]
    }
  }
}
```

### `strategy`

What happens to a function that no rule matches.

| Value | Behaviour |
|-------|-----------|
| `"services"` | One unit per distinct set of singleton services. The default, and what you get with no `grouping` block at all. |
| `"function"` | One unit per function. |
| `"single"` | Every unmatched function shares one unit named `app`. |

#### `"services"` in detail

The default, because it is the middle ground: one-per-function is a cold start
and a deploy step for every function, and `"single"` is too coarse to reason
about. Functions are keyed on the singleton services their bodies destructure,
minus the ones every unit builds regardless — `config`, `logger`, `variables`,
`schema`, `secrets`, and the per-request `rpc`, `mcp`, `channel` and
`userSession`.

Each unit is named for its set, so a plan reads as what each unit builds:

```
svc-base                    19 functions   (nothing beyond the defaults)
svc-todo-store               9 functions
svc-event-hub-todo-store     4 functions
svc-workflow-service         4 functions
svc-kysely                   1 function
```

Every such unit records its key as `servicesKey` in `deployment-manifest.json`,
which is what tells two units apart when their capability lists look identical —
`workflowService` and `workflowRunService` both report as `workflow-state`.

The deploy target is part of the key. A `server` unit is named with a `-server`
suffix and never merges with its serverless twin, which is why this strategy
cannot produce the mixed-target refusal described below: two functions can need
exactly the same services and still run in different places, because a function
may declare `deploy: "server"` itself without any service crossing it.

How much this saves depends on how varied the app's service use is. On the
`templates/functions` app it is 10 units where one-per-function is 44. On an app
where nearly every function reaches the same database it collapses to something
close to `"single"` with a few carve-outs — run `pikku deploy plan` and read the
unit list. Set `"strategy": "function"` to get a unit per function back.

:::warning Changing the strategy renames units
A unit name is what a queue consumer, a scheduled task and a `dependsOn` point
at. The manifest rewrites all three for you, but anything holding a unit name
outside the manifest does not follow.

Units that fall out of the manifest are also not deleted — `deploy()` is
upsert-only ([#543](https://github.com/pikkujs/pikku/issues/543)), so the
previous generation of workers stays live until something removes it.
:::

### `rules`

Rules are evaluated **in order, first match wins**, and always beat the
strategy. Which direction a rule works in depends on the strategy: under
`"function"` a rule *merges* functions into a shared unit, under `"single"` or
`"services"` it *carves* them out.

| Key | Matches |
|-----|---------|
| `unit` | The deployment unit name. Required, and must be unique across rules. |
| `tags` | A function carrying **any** of these tags, from the function itself or from any wiring that reaches it. |
| `addon` | An addon namespace — places all of that addon's exposed functions in the unit. |
| `routes` | Glob patterns matched against a function's wired HTTP routes, with or without `globalHTTPPrefix`. |

Predicates within a single rule are ANDed, so
`{ "unit": "a", "tags": ["admin"], "routes": ["/api/admin/*"] }` matches only
functions that are both tagged `admin` and served under `/api/admin`. A rule
must carry at least one predicate.

:::tip Tags usually come from the wiring
Most projects tag the wiring rather than the function:

```typescript
wireHTTP({ method: 'get', route: '/todos', func: getTodos, tags: ['todos'] })
```

A rule matching `todos` picks up `getTodos` from that wiring. The same holds for
`wireQueueWorker`, `wireScheduledTask`, `wireChannel` and the MCP wirings — a
function inherits the tags of every wiring that points at it, unioned with any
it declares itself.
:::

Addons keep their own unit (`addon-<namespace>`) unless an `addon` rule says
otherwise — an addon is a separate package, so folding it into the app's unit
is something you opt into.

A unit only bootstraps the addons it actually uses. The `wireAddon` call that
declares an instance lives in one of your source files, and that file is
imported into a unit's generated bootstrap only while at least one addon it
wires survives that unit's filter — so a unit holding none of an addon's
functions neither registers them nor bundles the addon's dependencies. Wiring
several addons from a single file keeps them together: the file is the unit of
attribution, so give an addon its own wiring file if you want it dropped
independently.

### What merging does

| Field | Merged as |
|-------|-----------|
| `functionIds` | Union |
| `services` | Union by capability and source service name |
| `dependsOn` | Union, minus the unit itself |
| `tags` | Union |
| HTTP routes | Folded into one `fetch` handler |
| Queue and scheduled handlers | Kept as separate handler entries — one worker can serve all three |

### Grouping never changes a target

Functions that resolve to different deploy targets cannot share a unit. If a
rule would put a `serverless` and a `server` function together, the build fails
naming both sides rather than promoting the group to `server`:

```
deploy.grouping: unit "app" would hold both serverless and server functions
(listRetreats vs adminPurge). Give the server-target functions their own rule,
or drop them from "app".
```

The fix is a carve-out rule for the server-target functions. This is deliberate:
a grouping rule is about packaging, and it must not be able to move a function
off serverless as a side effect.

### Reading back why a unit is where it is

`deployment-manifest.json` records the decision, not just the outcome. Each unit
carries two optional fields:

| Field | Present when | Says |
|-------|--------------|------|
| `groupedBy` | A rule matched | The rule that put these functions together, verbatim |
| `targetForcedBy` | The target was forced | The `serverlessIncompatible` services that crossed the unit to `server` |

Their absence carries the same weight as their presence. A unit with no
`groupedBy` came from the fallback — a service set under the default
`strategy: "services"`, one unit per function under `"function"`, or the shared
`app` unit under `"single"`. A unit with no `targetForcedBy` is on the
target it was *asked* for, through a function's own `deploy` flag or through
`defaultTarget`, rather than one it was pushed onto.

That is what makes the refusal above diagnosable: read `targetForcedBy` on the
server-target unit to see which service crossed it, and `groupedBy` to see which
rule to carve the function out of.

### Choosing a shape

Grouping is authored, not inferred. There is no automatic packing by bundle
size, because bundle overlap is near-total — the shared framework floor is in
every unit — so clustering on shared bytes puts everything in one bin, and
clustering on *unique* bytes has almost no signal to work with. It would also be
unstable: adding one function reshuffles the bins and churns unrelated workers.

Tags are the packing. Pick boundaries that mean something to you — a domain, a
secret scope, a deploy cadence — and write them down.

:::info Grouping widens secret scope
Every function in a unit can read every secret and credential that unit is
granted. Grouping is therefore a security decision as well as a packaging one:
prefer a carve-out to merging something that holds a secret the rest of the
group has no business reading.
:::

## Commands

### `pikku deploy plan`

Preview what will be created, updated, or deleted — without touching anything.

```bash
npx pikku deploy plan
npx pikku deploy plan --provider aws
npx pikku deploy plan --result-file plan.json   # Save structured output
```

### `pikku deploy apply`

Execute the deployment.

```bash
npx pikku deploy apply
npx pikku deploy apply --provider aws
npx pikku deploy apply --from-plan              # Skip rebuild, use existing plan
npx pikku deploy apply --result-file result.json
```

### `pikku deploy info`

Show your project's deployment structure — units, routes, queues, scheduled tasks, channels, agents, secrets, and variables.

```bash
npx pikku deploy info
```

Example output:

```
Project: my-app

Units (4):
  function       my-app-get-books         [getBooks]
    GET /api/books
  function       my-app-create-book       [createBook]
    POST /api/books
  agent          my-app-assistant         [assistant]
  workflow       my-app-onboarding        [onboarding]

Queues (2):
  pikku-workflow-orchestrator    -> my-app-onboarding
  pikku-workflow-worker          -> my-app-onboarding

Scheduled Tasks (1):
  daily-cleanup                  0 3 * * *  -> my-app-daily-cleanup

Required Secrets (2):
  DATABASE_URL
  STRIPE_API_KEY
```

## Deployment Units

The analyzer creates a unit for each distinct workload:

| Role | Description |
|------|-------------|
| `function` | A single Pikku function with its HTTP routes, queue handlers, or cron triggers |
| `mcp` | MCP server — dispatches tool/resource/prompt calls to function units via RPC |
| `agent` | AI agent — dispatches tool calls to function units via RPC |
| `channel` | WebSocket channel handler |
| `workflow` | Workflow orchestrator |
| `workflow-step` | Individual workflow step execution |

Each unit lists its handlers (HTTP routes, queue consumers, cron schedules), service requirements (database, object storage, AI model, etc.), and dependencies on other units.

### Server Fallback

Some functions can't run in serverless environments (long-running processes, native dependencies, etc.). Mark them in config:

```json
{
  "deploy": {
    "serverlessIncompatible": ["heavy-compute", "video-transcode"]
  }
}
```

These get routed to a server-based deployment target instead of a serverless worker.

## Providers

### Cloudflare Workers

The default and most mature provider. Deploys each unit as a Cloudflare Worker with automatic queue, cron, and D1/R2 provisioning.

```bash
npm install @pikku/deploy-cloudflare
```

```json
{
  "deploy": {
    "providers": {
      "cloudflare": "@pikku/deploy-cloudflare"
    },
    "defaultProvider": "cloudflare"
  }
}
```

**What it provisions:**
- Workers (one per deployment unit)
- Queues and consumers
- Cron triggers
- Secrets
- D1 databases, R2 buckets (based on service requirements)
- Service bindings between workers (for RPC dispatch)

**Requirements:**
- Cloudflare account with Workers paid plan
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables

### AWS Lambda (Serverless Framework) {#aws-lambda}

:::note Beta
The Serverless Framework provider is in beta. The core deployment flow works, but some advanced features (multi-region, custom domains) are still being finalized.
:::

Deploys via the Serverless Framework, generating `serverless.yml` and Lambda entry points.

```bash
npm install @pikku/deploy-serverless
```

```json
{
  "deploy": {
    "providers": {
      "aws": "@pikku/deploy-serverless"
    }
  }
}
```

**What it provisions:**
- Lambda functions
- SQS queues
- EventBridge rules (for cron)
- API Gateway / WebSocket API
- S3 buckets

### Azure Functions {#azure-functions}

:::note Beta
The Azure Functions provider is in beta.
:::

Generates Azure Functions v4 entry points with code-based trigger registration.

```bash
npm install @pikku/deploy-azure
```

```json
{
  "deploy": {
    "providers": {
      "azure": "@pikku/deploy-azure"
    }
  }
}
```

**What it provisions:**
- Azure Functions (one per unit)
- Queue triggers
- Timer triggers (cron)
- `host.json` and `local.settings.json`

### Standalone

Collapses the entire project into a single artifact — HTTP server, in-process scheduler and queue workers, database migrations and, optionally, your built frontend. No cloud provider needed.

```bash
npm install -D @pikku/deploy-standalone
```

Two runtimes, chosen with `--runtime`:

- `node` (default) — a `bundle.js` served by `@pikku/node-http-server`, the same server `pikku dev` runs. Start it with `node bundle.js`.
- `bun` — compiled into a self-contained executable with `bun build --compile`, served by `@pikku/bun-server`. Nothing needs installing on the target host.

```bash
npx pikku deploy apply --provider standalone
npx pikku deploy apply --provider standalone --runtime bun
```

The artifact answers `--version` and `--help` without opening a database, and runs its own migrations with `./my-app db migrate`. Point `PIKKU_DATA_DIR` at a directory that outlives a release so a SQLite database is not replaced along with the bundle.

Adding `--desktop` to a `--runtime bun` build also generates a Tauri shell that runs the binary as a sidecar; `--desktop-url` points that shell at an already-deployed server and bundles nothing. Desktop builds are unsigned and do not auto-update.

Good for self-hosted deployments, on-premise, edge devices, or handing someone an app.

## Build Output

The deploy pipeline writes everything to `.deploy/<provider>/`:

```
.deploy/cloudflare/
├── units/
│   ├── my-app-get-books/
│   │   ├── index.js          # Bundled entry point
│   │   └── wrangler.toml     # Worker config
│   ├── my-app-create-book/
│   │   └── ...
│   └── my-app-assistant/
│       └── ...
├── infra.json                 # Infrastructure manifest
└── plan.json                  # Deployment plan
```

## Next Steps

- **[Configuration](/docs/pikku-cli/configuration#deploy)** — Full deploy config reference
- **[Tree-Shaking](/docs/pikku-cli/tree-shaking)** — How per-unit tree-shaking works
