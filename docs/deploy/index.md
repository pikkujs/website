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
2. **Split** — each function becomes its own deployment unit. Gateways (MCP servers, agents, channels) get separate units that dispatch to function units via RPC
3. **Codegen** — per-unit entry points are generated with only the imports each unit needs
4. **Bundle** — each unit is bundled and tree-shaken independently
5. **Deploy** — the provider adapter provisions infrastructure (workers, queues, cron triggers, secrets) and uploads the bundles

The core principle: **one function = one deployment unit**. This gives you per-function scaling, isolation, and minimal cold-start sizes.

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

### Standalone Binary

Bundles your entire project into a single executable using `@yao-pkg/pkg`. Includes a uWebSockets.js server and in-process scheduler — no cloud provider needed.

```bash
npm install @pikku/deploy-standalone
```

Good for self-hosted deployments, on-premise, or edge devices.

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
