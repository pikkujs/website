# Technical Documentation Audit — Pikku Framework

You are a technical documentation expert. Your task is to audit the Pikku framework's public APIs, example templates, and existing documentation to produce a comprehensive gap analysis and documentation plan.

## What is Pikku?

Pikku is a TypeScript backend framework that lets you write business logic once and wire it to any protocol — HTTP, WebSockets, queues, scheduled tasks, CLI, MCP (Model Context Protocol), workflows, triggers, and AI agents. It supports deployment to Express, Fastify, Next.js, AWS Lambda, Cloudflare Workers, Azure Functions, uWebSockets, and more.

## Your Goals

1. **Identify every public API surface** across all packages
2. **Cross-reference against existing documentation** to find gaps
3. **Review all templates** to understand what features are demonstrated but not documented
4. **Produce a prioritized documentation plan** covering what's missing, what's outdated, and what needs improvement

## Source Material

### Monorepo Location

The monorepo is at `/pikku/` (root). The documentation website is at `/website/`.

### Packages to Audit

**Core:**
- `@pikku/core` — The main framework. Exports: middleware, functions, channels (local/serverless), HTTP, queue, scheduler, trigger, RPC, MCP, AI-agent, CLI, node wiring, secrets, variables, OAuth2, services (local-content, gopass-secrets), schema utilities
- `pikku` — High-level wrapper bundling `@pikku/core`, `@pikku/jose`, `@pikku/schema-ajv`
- `@pikku/cli` — CLI tool for code generation, schema generation, watch mode, console launch
- `@pikku/inspector` — Schema generation and workflow graph inspection
- `@pikku/console` — Web-based visual control plane (Vite + React + Mantine). Private package but user-facing feature

**Client Libraries:**
- `@pikku/fetch` — Type-safe HTTP fetch client
- `@pikku/websocket` — Type-safe WebSocket client

**Service Integrations:**
- `@pikku/pg` — PostgreSQL (via `postgres` library)
- `@pikku/redis` — Redis (via `ioredis`)
- `@pikku/kysely` — SQL query builder
- `@pikku/queue-bullmq` — BullMQ queue integration
- `@pikku/queue-pg-boss` — PG Boss queue integration
- `@pikku/pino` — Pino logging
- `@pikku/jose` — JWT/JOSE cryptography
- `@pikku/schema-ajv` — JSON Schema validation (AJV)
- `@pikku/schema-cfworker` — Cloudflare Worker-compatible schema validation
- `@pikku/ai-vercel` — Vercel AI SDK integration
- `@pikku/aws-services` — AWS SDK (S3 content service, Secrets Manager)

**Runtime Integrations:**
- `@pikku/express` + `@pikku/express-middleware`
- `@pikku/fastify` + `@pikku/fastify-plugin`
- `@pikku/uws` — µWebSockets
- `@pikku/ws` — WS (Node.js WebSocket)
- `@pikku/lambda` — AWS Lambda (HTTP, WebSocket, Queue handlers)
- `@pikku/cloudflare` — Cloudflare Workers
- `@pikku/next` — Next.js (request handler, session management)
- `@pikku/azure-functions` — Azure Functions
- `@pikku/modelcontextprotocol` — MCP server

**External Packages:**
- `@pikku/external-console` — Backend support for console functionality

### Templates to Review (22 templates)

Each template is a complete working project. Review every template to understand what patterns, APIs, and features they demonstrate:

1. `templates-express-server` — Express.js server
2. `templates-fastify-server` — Fastify server
3. `templates-nextjs` — Next.js full-stack
4. `templates-aws-lambda` — AWS Lambda
5. `templates-aws-lambda-websocket` — Lambda + WebSocket
6. `templates-cloudflare-workers` — Cloudflare Workers
7. `templates-cloudflare-websocket` — Cloudflare + WebSocket
8. `templates-express-middleware` — Express middleware integration
9. `templates-fastify-plugin` — Fastify plugin integration
10. `templates-uws` — µWebSockets
11. `templates-ws` — WS library
12. `templates-mcp-server` — MCP server
13. `templates-cli` — CLI application (local & remote channels)
14. `templates-functions` — Core function definitions & examples
15. `templates-function-external` — External function service
16. `templates-bullmq` — BullMQ queue
17. `templates-pg-boss` — PG Boss queue
18. `templates-workflows-bullmq` — Workflows with BullMQ
19. `templates-workflows-pg-boss` — Workflows with PG Boss
20. `templates-ai-postgres` — AI agents + PostgreSQL
21. `templates-remote-rpc-pg` — Remote RPC with PostgreSQL
22. `templates-remote-rpc-redis` — Remote RPC with Redis

### Existing Documentation Structure (120 pages)

```
docs/
├── index.mdx, navigation.md
├── advanced/ — import-patterns.md
├── api/ — content-service, event-hub, exception, jwt-service, logger,
│          pikku-task-scheduler, schema-service, secret-service,
│          user-session-service, variables-service
├── comparison/ — index, encore, hono, nestjs
├── console/ — index, getting-started, features
├── core-features/ — index, functions, middleware, permission-guards, secrets,
│                     services, testing, user-sessions, variables, wires, errors
├── custom-runtimes/ — custom-http-runtime, custom-mcp-server,
│                       custom-queue-runtime, custom-scheduler-handler,
│                       custom-websocket-handler
├── external-packages/ — index, consuming, creating, secrets
├── middleware/ — auth-apikey, auth-cookie, auth-jwt
├── philosophy/ — index, architecture, limitations, typed-clients,
│                  types-and-schemas, vision
├── pikku-cli/ — index, configuration, tree-shaking, errors/ (16 error codes)
├── runtimes/ — aws-lambda, azure-functions, bullmq, cloudflare-functions,
│               express-middleware, fastify-plugin, google-cloud-run-functions,
│               mcp-server, nextjs-app, pg-boss, uws-handler, ws-handler
├── wiring/
│   ├── scheduled-tasks
│   ├── channels/ — index, channel-route, websocket-client
│   ├── cli/ — index, local-cli, remote-cli
│   ├── http/ — index, cors, fetch-client, openapi, router, server-sent-events
│   ├── mcp/ — index, prompts, resources, tools
│   ├── queue/ — index, client, examples
│   ├── rpcs/ — index, internal, external
│   ├── triggers/ — index
│   └── workflows/ — index, getting-started, configuration, steps, graph-workflows
```

## Audit Process

### Step 1: Public API Surface Analysis

For each package, examine:
- **Exported types, classes, functions, and interfaces** — Read the package's `src/index.ts` or equivalent entry points and all files referenced by `exports` in `package.json`
- **Configuration options** — What can users configure?
- **Integration points** — How does this package interact with `@pikku/core`?

Focus only on **public** APIs — things users import and use. Skip internal implementation details.

### Step 2: Template Analysis

For each template:
- What features does it demonstrate?
- What patterns does it use that aren't documented?
- Are there configuration approaches, service setups, or wiring patterns that are only shown by example but never explained in the docs?

### Step 3: Gap Analysis

Cross-reference the public API surfaces and template patterns against the existing documentation. For each gap, classify it as:

- **Missing** — No documentation exists at all
- **Incomplete** — Documentation exists but doesn't cover all public APIs or options
- **Outdated** — Documentation references old APIs or patterns (the project recently went through a v0.11 API audit)
- **Example-only** — Feature is demonstrated in templates but has no dedicated documentation

### Step 4: Documentation Plan

Produce a prioritized plan with:

1. **Critical gaps** — Core features that users need and have no docs for
2. **High-value additions** — Features that are documented but missing important details
3. **Nice-to-have** — Completeness improvements, additional examples, edge cases

For each item, specify:
- What page to create or update
- What content is needed
- Which source files to reference for accurate information
- Estimated scope (small/medium/large)

## Output Format

Produce your findings as a structured markdown document with these sections:

```
# Pikku Documentation Audit

## Executive Summary
(2-3 paragraphs summarizing the state of documentation)

## Public API Coverage Matrix
(Table: Package | Exported APIs | Documented? | Gaps)

## Template Feature Coverage
(Table: Template | Features Demonstrated | Documented? | Gaps)

## Detailed Gap Analysis
### Missing Documentation
### Incomplete Documentation
### Outdated Documentation
### Example-Only Features

## Prioritized Documentation Plan
### Critical (Must-have)
### High Priority
### Medium Priority
### Low Priority

## Recommended Documentation Structure Changes
(Any suggestions for reorganizing, merging, or splitting pages)
```

## Important Notes

- The project is at version 0.12.0. A major v0.11 API audit was recently completed, so most core docs should be current — but verify this.
- Features marked as "alpha" or "coming soon": AI agents, console, some workflow features. These still need documentation but should be marked accordingly.
- The `@pikku/cli` package (BUSL-1.1 license) and `@pikku/inspector` are not MIT — note this but still document their public-facing features.
- The `@pikku/console` package is private (not published to npm) but is a user-facing feature launched via `pikku console`. Document the user experience, not the internals.
- Pay special attention to the `@pikku/core` exports map — it's the largest package and most likely to have undocumented features.
