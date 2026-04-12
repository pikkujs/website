# Documentation Audit & Update Plan

Audit date: 2026-04-12
Compared: website docs/pages vs `@pikku/*` packages source

---

## 1. Major Changes Found

### New Wirings (in source, not documented or barely documented)
- **Credentials** (`@pikku/core/credential`) — `wireCredential`, `CoreCredential`, per-user credential system with OAuth2 support. **No doc page exists.**
- **Secrets wiring** (`@pikku/core/secret`) — `wireSecret`, `CoreSecret`, typed secret definitions with OAuth2 credential config. Docs exist for `SecretService` API but not for the `wireSecret` wiring pattern.
- **Variables wiring** (`@pikku/core/variable`) — `wireVariable`, `CoreVariable`, typed variable definitions. Docs exist for `VariablesService` API but not for the `wireVariable` wiring pattern.
- **OAuth2** (`@pikku/core/oauth2`) — `OAuth2Client`, `createOAuth2Handler`. Only `docs/advanced/oauth2.md` exists — needs review for accuracy.
- **Node** (`@pikku/core/node`) — `CoreNodeConfig`, `NodeType`, `NodesMeta`. Console node system. **No doc page.**

### New CLI Commands (not documented)
- `pikku deploy plan` — show deployment plan (providers: cloudflare, aws)
- `pikku deploy apply` — execute deployment
- `pikku deploy info` — show deployment info
- `pikku enable rpc|console|agent|workflow` — scaffold feature enablement
- `pikku new addon` — scaffold addon package (with --oauth, --credential, --openapi, --mcp, --secret, --variable flags)
- `pikku new function|wiring|middleware|permission` — scaffold files
- `pikku versions init|check|update` — function contract versioning
- `pikku info functions|tags|middleware|permissions` — project introspection
- `pikku console` — start console UI with live watching
- `pikku watch --hmr` — HMR flag for hot module reload

### New Packages (not documented)
- **`@pikku/deploy-cloudflare`** — Cloudflare deploy adapter
- **`@pikku/deploy-serverless`** — Serverless Framework (AWS Lambda) adapter
- **`@pikku/deploy-azure`** — Azure Functions deploy adapter
- **`@pikku/deploy-standalone`** — Standalone binary via pkg
- **`@pikku/ai-vercel`** — `VercelAIAgentRunner` service
- **`@pikku/ai-voice`** — `voiceInput`, `voiceOutput`, STT/TTS services
- **`@pikku/assistant-ui`** — React components: `PikkuAgentChat`, `usePikkuAgentRuntime`, approval flows
- **`@pikku/gateway-slack`** — `SlackGatewayAdapter`, slash commands, message formatting
- **`@pikku/auth-js`** — `createAuthRoutes`, `createAuthHandler`, `authJsSession`
- **`@pikku/backblaze`** — `B2Content` service
- **`@pikku/mongodb`** — MongoDB implementations for channels, eventhub, workflows, AI storage, secrets, deployment
- **`@pikku/schema-cfworker`** — Cloudflare Worker schema validation
- **`@pikku/kysely-mysql`** — MySQL adapter for Kysely
- **`@pikku/kysely-sqlite`** — SQLite adapter for Kysely
- **`@pikku/ws`** — WS runtime (WebSocket-only, `PikkuWSServer`)
- **`@pikku/express`** — Full Express server (not just middleware)
- **`@pikku/fastify`** — Full Fastify server (not just plugin)
- **`@pikku/uws`** — Full uWS server (not just handler)
- **`@pikku/cloudflare`** — expanded exports: `/handler`, `/queue`, `/d1`, `/deployment`, `/websocket`, `/eventhub`
- **`@pikku/lambda`** — sub-path exports: `/http`, `/websocket`, `/queue`, `/scheduled`
- **`@pikku/next`** — sub-path exports: `/pikku-next-request`, `/pikku-session`
- **`create-pikku`** — project scaffolding CLI

### Generated Files (`.pikku/` directory) — needs comprehensive doc
The CLI generates a rich set of files that users interact with:
- `pikku-bootstrap.gen.ts` — main import hub
- `pikku-types.gen.ts` — re-exports all wiring types
- `pikku-services.gen.ts` — typed services factory
- `pikku-meta-service.gen.ts` — meta service for console
- `function/` — function types, meta (JSON + TS), registration
- `rpc/` — RPC wiring maps, internal meta
- `http/` — HTTP wiring maps, meta, types
- `channel/` — channel wiring maps, meta, types
- `queue/` — queue worker maps, meta, types
- `scheduler/` — scheduler wiring meta, types
- `workflow/` — workflow wiring maps, meta, types, workers
- `mcp/` — MCP wiring meta, types
- `agent/` — agent wiring maps, meta, types, `pikkuAIAgent` type helper
- `cli/` — CLI wiring meta, types, bootstrap
- `trigger/` — trigger wiring meta, types
- `gateway/` — gateway wiring file
- `middleware/` — middleware meta
- `permissions/` — permissions meta
- `schemas/` — JSON schemas + register file
- `secrets/` — typed secret wrappers, meta JSON
- `variables/` — typed variable wrappers, meta JSON
- `credentials/` — typed credential wrappers, meta JSON
- `addon/` — addon package meta, types
- `console/` — addon meta JSON, node types

---

## 2. Per-Page Audit

### Core Features (`docs/core-features/`)

| Page | Status | Issues |
|------|--------|--------|
| `functions.md` | **Review** | Uses `pikkuFunc<In, Out>({...})` — verify this matches current generated types. Check `pikkuVoidFunc`, `pikkuSessionlessFunc` variants are documented. |
| `services.md` | **Review** | Check if new services are listed: `DeploymentService`, `WorkflowService`, `GatewayService`, `TriggerService`, `AIAgentRunnerService`, `AIRunStateService`, `AIStorageService`, `AgentRunService` |
| `middleware.md` | **Review** | Check `pikkuMiddleware`, `pikkuMiddlewareFactory`, `pikkuAIMiddleware`, `pikkuChannelMiddleware` are covered |
| `wires.md` | **Update** | Needs to mention credential, secret, variable wirings. Check if `wireCredential`, `wireSecret`, `wireVariable` are documented |
| `user-sessions.md` | **Review** | Check if `auth-js` integration is mentioned |
| `permission-guards.md` | **Review** | Check `pikkuPermissionFactory`, `pikkuApprovalDescription` |
| `testing.md` | **Review** | Check `@pikku/core/testing` exports |
| `errors.md` | **Review** | Check all error types exported |
| `secrets.md` | **Update** | Should cover `wireSecret` pattern, not just `SecretService` |
| `variables.md` | **Update** | Should cover `wireVariable` pattern, not just `VariablesService` |
| `index.md` | OK | Overview page |

### Pikku CLI (`docs/pikku-cli/`)

| Page | Status | Issues |
|------|--------|--------|
| `index.mdx` | **Major update** | Missing commands: `deploy`, `enable`, `new`, `versions`, `info`, `console`, `watch --hmr`. Only covers `all`, `schemas`, `fetch`, `websocket`, `rpc` etc. |
| `configuration.md` | **Major update** | Missing config fields: `scaffold`, `addon`, `extends`, `clientFiles`, `deploy` settings, credential/secret/variable file configs, `globalHTTPPrefix`, `packageMappings`, `schema` options, `ignoreFiles` |
| `tree-shaking.mdx` | **Review** | Check accuracy |
| `errors/` | OK | Individual error pages — check if new codes exist |

### Wiring (`docs/wiring/`)

| Page | Status | Issues |
|------|--------|--------|
| `ai-agents/index.md` | **Review** | Only page for AI agents. Check: `agent()`, `agentStream()`, `agentResume()`, `agentApprove()` helpers. Missing: credential integration (`ToolCredentialRequired`), voice support, `@pikku/assistant-ui` |
| `gateway/index.md` | **Review** | Only page. Check: `wireGateway`, `createListenerMessageHandler`, `GatewayAdapter` type. Missing: `@pikku/gateway-slack` example |
| `http/` | **Review** | Check `wireHTTP`, `wireHTTPRoutes`, `defineHTTPRoutes`, `addHTTPMiddleware`, `addHTTPPermission`, `PikkuFetchHTTPRequest/Response` |
| `channels/` | **Review** | Check `wireChannel`, `openChannel`, `defineChannelRoutes`, `PikkuAbstractChannelHandler` |
| `queue/` | **Review** | Check `wireQueueWorker`, `runQueueJob`, `registerQueueWorkers`, `QueueJobDiscardedError`, `QueueJobFailedError` |
| `workflows/steps.md` | **Review** | Check `pikkuWorkflowGraph`, `template()`, `createGraph()`, `PikkuWorkflowService` |
| `scheduled-tasks.md` | **Review** | Check `wireScheduler`, `runScheduledTask`, `SchedulerService` |
| `mcp/` | **Review** | Check `MCPEndpointRegistry`, `wireMCPResource`, `wireMCPPrompt` |
| `cli/` | **Review** | Check `wireCLI`, `executeCLI`, `defineCLICommands`, `parseCLIArguments` |
| `triggers/` | **Review** | Check `wireTrigger`, `wireTriggerSource`, `PikkuTriggerService` |
| `rpcs/` | **Review** | Check `PikkuRPCService`, `rpcService`, `wireAddon` |

### Runtimes (`docs/runtimes/`)

| Page | Status | Issues |
|------|--------|--------|
| `aws-lambda.md` | **Update** | `@pikku/lambda` now has sub-path exports (`/http`, `/websocket`, `/queue`, `/scheduled`). Check if documented. |
| `cloudflare-functions.md` | **Update** | `@pikku/cloudflare` has many sub-paths (`/handler`, `/queue`, `/d1`, `/deployment`, `/websocket`, `/eventhub`). Check if documented. |
| `express-middleware.md` | **Review** | Also exists: `@pikku/express` (full server). Should mention both. |
| `fastify-plugin.md` | **Review** | Also exists: `@pikku/fastify` (full server). Should mention both. |
| `uws-handler.md` | **Review** | Also exists: `@pikku/uws` (full server). Should mention both. |
| `nextjs-app.md` | **Update** | `@pikku/next` now has sub-path exports. Check accuracy. |
| `google-cloud-run-functions.md` | **Verify** | No matching runtime package found in source. Is this still valid? |
| `ws-handler.md` | **Review** | Maps to `@pikku/ws` package |
| `azure-functions.md` | **Review** | Check against `@pikku/azure-functions` exports |
| `bullmq.md` | OK | |
| `pg-boss.md` | OK | |
| `mcp-server.md` | **Review** | Check against `@pikku/modelcontextprotocol` |

### Storage (`docs/storage/`)

| Page | Status | Issues |
|------|--------|--------|
| `index.md` | **Update** | Missing: MongoDB, SQLite, MySQL storage options |
| `postgresql.md` | **Review** | |
| `kysely.md` | **Update** | Missing: `@pikku/kysely-mysql`, `@pikku/kysely-sqlite` |
| `redis.md` | **Review** | |
| `aws-services.md` | **Review** | |
| Missing: `mongodb.md` | **Create** | `@pikku/mongodb` has channel store, eventhub, workflow, AI storage, secrets, deployment, agent run services |

### Middleware (`docs/middleware/`)

| Page | Status | Issues |
|------|--------|--------|
| `auth-jwt.md` | OK | |
| `auth-cookie.md` | OK | |
| `auth-apikey.md` | OK | |
| Missing: `auth-js.md` | **Create** | `@pikku/auth-js` — `createAuthRoutes`, `createAuthHandler`, `authJsSession` |

### Addons (`docs/addon/`)

| Page | Status | Issues |
|------|--------|--------|
| `index.md` | **Review** | |
| `creating.md` | **Update** | Check `pikku new addon` flags: `--oauth`, `--credential`, `--openapi`, `--mcp`, `--secret`, `--variable`, `--camelCase` |
| `consuming.md` | **Review** | Check `wireAddon` config |
| `secrets.md` | **Review** | |

### API Reference (`docs/api/`)

| Page | Status | Issues |
|------|--------|--------|
| All existing pages | **Review** | Check accuracy against current source types |
| Missing: `deployment-service.md` | **Create** | `DeploymentService` type |
| Missing: `workflow-service.md` | **Create** | `WorkflowService` type |
| Missing: `gateway-service.md` | **Create** | `GatewayService` type |
| Missing: `trigger-service.md` | **Create** | `TriggerService` type |
| Missing: `ai-agent-runner-service.md` | **Create** | `AIAgentRunnerService` type |
| Missing: `ai-run-state-service.md` | **Create** | `AIRunStateService` type |
| Missing: `ai-storage-service.md` | **Create** | `AIStorageService` type |
| Missing: `agent-run-service.md` | **Create** | `AgentRunService` type |
| Missing: `scheduler-service.md` | **Create** | `SchedulerService` class (exported from core) |

### Console (`docs/console/`)

| Page | Status | Issues |
|------|--------|--------|
| All pages | **Review** | Check against `@pikku/console` package |

### Custom Pages (`src/pages/`)

| Page | Status | Issues |
|------|--------|--------|
| `fabric.tsx` | **Review** | Recently rewritten — check against deploy packages |
| `deploy/cloudflare.tsx` | **New** | Verify matches `@pikku/deploy-cloudflare` |
| `deploy/serverless.tsx` | **New** | Verify matches `@pikku/deploy-serverless` |
| `deploy/azure.tsx` | **New** | Verify matches `@pikku/deploy-azure` |
| `wires/bot.tsx` | **Review** | Check against AI agent API |
| `wires/workflow.tsx` | **Review** | Check against workflow API |
| `wires/gateway.tsx` | **Review** | Check against gateway API |
| `core/versioning.tsx` | **Review** | Check against `pikku versions` CLI commands |
| `core/addons.tsx` | **Review** | Check against addon system |

---

## 3. New Pages Needed

### High Priority
1. **Credentials wiring** (`docs/wiring/credentials/index.md`) — `wireCredential`, OAuth2 credentials, per-user credential system
2. **Deploy guide** (`docs/deploy/index.md`) — `pikku deploy plan/apply/info`, deploy providers, generated infra
3. **CLI commands reference update** — complete rewrite of `docs/pikku-cli/index.mdx` with all commands
4. **Configuration reference update** — complete rewrite of `docs/pikku-cli/configuration.md`
5. **MongoDB storage** (`docs/storage/mongodb.md`)
6. **Auth.js middleware** (`docs/middleware/auth-js.md`)
7. **Generated files reference** — what `.pikku/` contains and how to use it

### Medium Priority
8. **AI Voice** — voiceInput/voiceOutput in AI agents docs
9. **Assistant UI** — `@pikku/assistant-ui` React component guide
10. **Addon creation (updated)** — `pikku new addon` with all flags
11. **Express/Fastify full server** runtimes — note both middleware and full-server options
12. **Lambda sub-path imports** — update AWS Lambda doc
13. **Cloudflare sub-path imports** — update Cloudflare doc
14. **Kysely MySQL/SQLite** — update Kysely doc
15. **Secrets & Variables wirings** — `wireSecret`/`wireVariable` pattern docs

### Low Priority
16. **Slack gateway** — example in gateway docs
17. **Backblaze content** — storage doc
18. **Schema validators** — `@pikku/schema-ajv` vs `@pikku/schema-cfworker`
19. **create-pikku** — project scaffolding guide
20. Additional API reference pages (services listed above)

---

## 4. Sidebar Updates Needed

- Add "Credentials" under Wiring section
- Add "Deploy" as new top-level category
- Add `ws-handler` runtime (already in sidebar, just verify)
- Consider adding full-server runtimes (express, fastify, uws) as separate entries
- Add MongoDB under Storage
- Add Auth.js under Middleware
- Remove `google-cloud-run-functions` if no runtime package exists (or clarify it's Cloudflare-deployed)

---

## 5. Things to Verify

- [ ] Does `google-cloud-run-functions.md` have a matching runtime? (no `packages/runtimes/gcp*` found)
- [ ] Are the `pikkuFunc` / `pikkuSessionlessFunc` / `pikkuVoidFunc` types documented correctly? (they come from generated code, not core)
- [ ] Is `#pikku` import alias documented? (used in function files, maps to generated types)
- [ ] `pikkuAIMiddleware` hooks — documented in AI agents page?
- [ ] `PikkuPackageState` — relevant for addon authors?
- [ ] `@pikku/schedule` package — what does it do? (not documented)
- [ ] `@pikku/openapi-parser` and `@pikku/openapi-to-zod-schema` — user-facing or internal?
