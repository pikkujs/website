# pikku.dev Docs Audit — cloudflare-v6

Audit of all 128 doc pages under `website/docs/` against the current codebase
(branch `cloudflare-v6`, ~60 commits ahead of `main`). No live users yet, so
findings are framed as **"doc says X → code does Y → fix to Y"** — no
deprecation/migration notes needed.

Severity key: **C** critical (example will not run / removed API) · **H** high
(wrong name/signature/command, misleads) · **M** medium (renamed concept, stale
default, missing step) · **L** low (cosmetic/wording).

Status legend per page: `ok` · `minor` · `major` · `rewrite`.

---

## Global sweeps (cross-page find-replace — do these once across all docs)

> These patterns recur across many pages; fixing them centrally clears most
> findings. Each entry: pattern → replacement → confirmed pages (more may surface).

1. **`--types` CLI flag → `--wires`.** The codegen filter flag was renamed
   (`InspectorFilters.wires`, `cli.wiring.ts:136`). Confirmed:
   `pikku-cli/index.mdx`, `pikku-cli/tree-shaking.mdx`. Grep all docs for
   `--types` and `filters.types` / `"types":` in JSON config blocks.
2. **Config `filters: { types: [...] }` → `filters: { wires: [...] }`.**
   `InspectorFilters` has no `types` key (`packages/inspector/src/types.ts:179`).
   Confirmed: `pikku-cli/configuration.md`.
3. **Removed package `@pikku/runtime-*` names.** No `@pikku/runtime-express`
   etc. Real names: `@pikku/express`, `@pikku/express-middleware`, `@pikku/fastify`,
   `@pikku/fastify-plugin`, `@pikku/lambda`, `@pikku/cloudflare`, `@pikku/next`,
   `@pikku/node-http-server`, `@pikku/uws-handler`, `@pikku/azure-functions`,
   `@pikku/modelcontextprotocol` (`packages/runtimes/*/package.json`). Grep docs
   for `@pikku/runtime`.
4. **`vscode-extension` references** — package was removed (`58e68fb03`). Grep
   docs/blog for any mention. (Docs `grep` came back empty; re-check after edits.)
5. **Wire members live on the 3rd (wire) argument, NOT on services (1st arg).**
   `rpc`, `workflow`, `workflowStep`, `http`, `channel`, `mcp`, `queue`,
   `scheduledTask`, `cli`, `trigger`, `gateway`, `session` are all properties of
   `PikkuWire` (`packages/core/src/types/core.types.ts:250-290`); none are in
   `CoreServices`. So `async ({ rpc }, data) => …` and `async ({ workflow }, data)
   => …` are **wrong**; correct form is `async (services, data, { rpc }) => …` /
   `async (services, data, { workflow }) => …`. Confirmed wrong in:
   `rpcs/index.md`, `rpcs/internal.md`, `rpcs/external.md`,
   `workflows/steps.md` (workflow + workflowStep), `workflows/getting-started.md`.
   (`rpcs/deployment.md` and the e2e `*.workflow.ts` files do it correctly.) Grep
   docs for `({ rpc`, `({ workflow`, `({ workflowStep`, `, { rpc, `.
6. **Deployment-service class/package names.** There is no `@pikku/pg` /
   `PgDeploymentService`. Real classes: `PgKyselyDeploymentService` &
   `KyselyPikkuDB` from `@pikku/kysely-postgres`; `RedisDeploymentService` from
   `@pikku/redis`; `MongoDBDeploymentService` from `@pikku/mongodb`;
   `KyselyDeploymentService` from `@pikku/kysely`
   (`packages/services/*/src/*deployment-service.ts`,
   `templates/remote-rpc-pg/src/server.ts:2`).
7. **`PikkuExpressServer` (and peers) take `(config, logger)` — 2 args.**
   `new PikkuExpressServer({ ...config, port, hostname }, singletonServices.logger)`
   (`packages/runtimes/express-server/src/pikku-express-server.ts:39`). The
   3-arg form `(config, singletonServices, createWireServices)` is wrong — the
   server reads functions/services from the imported bootstrap, not constructor
   args. Confirmed/fixed in `rpcs/deployment.md`, `workflows/deployment.md`,
   `pikku-cli/tree-shaking.mdx`. **Re-verify each runtime server's exact ctor in
   the runtimes section** (Fastify/UWS/etc. may differ).
8. **Fabricated workflow/runtime symbols — do not exist:** `wireWorkflow`
   (workflows auto-register from `pikkuWorkflowFunc`/`pikkuWorkflowGraph` via
   `addWorkflow` codegen); `createSchedulerRuntimeHandlers` (`@pikku/core/scheduler`);
   `workflowService.setServices(...)`; `PgWorkflowService`/`PgDeploymentService`
   (`@pikku/pg`) → `PgKyselyWorkflowService`/`PgKyselyDeploymentService`
   (`@pikku/kysely-postgres`). Queue factory `getQueueWorkers()` takes **no args**.
9. **Workflow/queue service constructors:** `PgKyselyWorkflowService(kysely)`;
   `RedisWorkflowService(connection|opts|url|undefined, keyPrefix='workflows')`;
   queue via `PgBossServiceFactory(connStr)` / `BullServiceFactory()` →
   `.getQueueService()` / `.getSchedulerService()` / `.getQueueWorkers()`. Inline
   workflow mode = omit `queueService` from singleton services (NOT a ctor arg).
10. *(append new sweeps here as later sections surface them)*

---

## PROGRESS

- **CLI** (4 pages) — audited + **FIXED** in docs.
- **RPC** (5 pages) — audited + **FIXED** (react-query was already clean).
- **Workflows** (6 pages) — audited + **FIXED**.
- Remaining (~113 pages): event-hub/realtime, AI agents, runtimes (esp.
  Cloudflare), queue, channels, mcp, core-features, api, middleware, storage,
  addon/custom-runtimes, console, philosophy/comparison/advanced — **pending**.
- **Open judgment call for user:** `workflows/configuration.md` "Polling for
  Completion" section teaches a blocking `getRun` poll loop. Left structurally
  intact (API usage fixed) — flagged because it sits awkwardly against the
  "results propagate through the call chain, don't poll" principle. Decide
  whether to keep, reframe as client-side status polling, or cut.

### Audit order (high-churn first, per code divergence)
CLI ✅ → RPC → workflows → event-hub/realtime → AI agents → cloudflare/runtimes →
queue → channels → mcp → core-features → api → middleware → storage →
addon/custom-runtimes → console → philosophy/comparison/advanced (last).

---

## Source-of-truth reference (established once, reused throughout)

### CLI command surface (`packages/cli/src/cli.wiring.ts`)
Program `pikku`. Global options: `--config/-c`, `--log-level/-l` (default `info`),
`--output` (`text|json`), `--json/-j`, `--user-session-type`,
`--singleton-services-factory-type`, `--wire-services-factory-type`,
`--state-output`, `--state-input`, `--out-dir/-o`. Flags accept kebab-case
(both forms accepted).

Top-level commands:
- `all` (default) — generates everything. Filter options: `--filter` (named
  presets), `--tags/-t`, `--wires`, `--exclude-wires`, `--exclude-tags`,
  `--directories/-d`, `--exclude-directories`, `--http-methods`,
  `--exclude-http-methods`, `--http-routes`, `--exclude-http-routes`,
  `--names/-n`, `--exclude-names`, `--target`, `--exclude-target`.
- `bootstrap`, `watch` (`--hmr`), `dev` (`--port/-p` 3000, `--watch`, `--hmr`),
  `console` (`--port/-p` 51442, `--open/-o`, `--hmr`), `schemas`.
- `db` → `migrate` | `seed` | `reset`.
- `fabric` → subcommands (login, link, deploy, …).
- Client generators: `fetch`, `websocket`, `rpc`, `react-query`,
  `tanstack-start`, `realtime`, `queue-service`, `openapi`, `nextjs`.
- `enable` → `rpc` | `console` | `agent` | `workflow` | `events` (each `--no-auth`).
- `new` → `function` | `wiring` | `middleware` | `permission` | `addon`.
- `tests` → `init` | `coverage`.
- `versions` → `init` | `check` | `update`.
- `binary` (`--compile-target`).
- `deploy` → `plan` | `apply` | `info` (each `--provider/-p` default `cloudflare`).
- `skills` → `list` | `install` (`--agent`, `--only`, `--core`, `--fabric`, `--update`).
- `meta` → `context`, `clients`, `functions`, `schemas`, `workflows`,
  `middleware`, `permissions`, `wires`.
- `info` → `functions` | `tags` | `middleware` | `permissions`.

### Config keys (`packages/cli/types/config.d.ts`)
Input keys: `$schema`, `extends`, `rootDir`, `runtimeDir`, `srcDirectories`,
`ignoreFiles`, `packageMappings`, `addon`, `configDir`, `tsconfig`,
`clientFiles{ fetchFile, websocketFile, rpcWiringsFile, reactQueryFile,
realtimeFile, realtimeEventHubTopicsImport, queueWiringsFile, mcpJsonFile,
nextBackendFile, nextHTTPFile, nextBackendTransport, nextBackendFetcherImport,
startServerFnsFile }`, `openAPI`, `schema`, `cli{ entrypoints }`,
`workflows{ orchestratorQueue, workerQueue }`, `scaffold{ addonDir, functionDir,
wiringDir, middlewareDir, permissionDir, pikkuDir, rpc, console, agent, workflow,
events }`, `forceRequiredServices`, `schemasFromTypes`, `stateOutput`,
`stateInput`, `verboseMeta`, `lint{ servicesNotDestructured, wiresNotDestructured }`,
`globalHTTPPrefix`, `binary{ entrypoint, output, targets }`,
`deploy{ providers, defaultProvider, serverlessIncompatible }`, `namedFilters`,
`filters`. Computed adds: `wires`, `excludeWires`, `tags`, `userSessionType`, etc.

Note: config still has `filters` (InspectorFilters) + `namedFilters`; the
**CLI flags** that filter direct wirings are `--wires` / `--exclude-wires`
(the "filter types → wires" rename is at the flag/category level).

### Generated-file layout (`getPikkuCLIConfig`, same file)
`outDir` subdirs: `function/`, `http/`, `channel/`, `rpc/`, `scheduler/`,
`queue/`, `workflow/`, `mcp/`, `cli/`, `middleware/`, `gateway/`, `trigger/`,
`agent/`, `permissions/`, `console/`, `addon/`, `secrets/`, `credentials/`,
`variables/`, `schemas/`. Key filenames: `pikku-bootstrap.gen.ts`,
`pikku-services.gen.ts`, `pikku-types.gen.ts`, `function/pikku-functions.gen.ts`,
`http/pikku-http-wirings.gen.ts`, etc. (full map captured for the
generated-files page check). New since docs likely written: `agent/*`,
`trigger/*`, `gateway/*`, `secrets/*`, `credentials/*`, `variables/*`,
`workflow/meta/`, `startServerFnsFile`, `realtimeFile`.

---

## Findings by section

### `pikku-cli/` (4 main pages + 16 error pages)

#### `pikku-cli/index.mdx` — **major**
- **H** — Filtering table (L35) and all examples (L43, 46, 49, 91, 200, 243, 249) use
  `--types`. Flag was renamed: it is now **`--wires`** (+ `--exclude-wires`).
  `cli.wiring.ts:136`. Fix: replace every `--types` with `--wires`; the value
  set is unchanged (`http,channel,queue,scheduler,rpc,mcp,cli,workflow,trigger,agent`).
- **H** — Filtering table is missing most real flags. Add: `--filter` (named
  presets), `--exclude-tags`, `--exclude-directories`, `--exclude-names`,
  `--exclude-http-methods`, `--exclude-http-routes`, `--target`,
  `--exclude-target`. `cli.wiring.ts:128-182`.
- **H** — "Client Generation" list (L94-101) omits real commands: `react-query`,
  `tanstack-start`, `realtime`. `cli.wiring.ts:277-289`.
- **H** — Whole command groups are undocumented: `db` (migrate/seed/reset),
  `tests` (init/coverage), `binary`, `skills` (list/install), `meta`
  (context/clients/functions/schemas/workflows/middleware/permissions/wires),
  `fabric`. `cli.wiring.ts:242-750`.
- **M** — `pikku enable` (L141-153) is missing the **`events`** subcommand
  (`enable events` scaffolds `events.gen.ts`). `cli.wiring.ts:345`.
- **M** — Global Options table (L200-209) omits `--output` (`text|json`) and
  `--json/-j`. `cli.wiring.ts:90-99`.
- **L** — `new addon` flags table incomplete vs source (missing `--displayName`,
  `--description`, `--category`, `--test`). `cli.wiring.ts:416-467`.

#### `pikku-cli/configuration.md` — **rewrite** (has fabricated keys)
- **C** — The entire **"AI Agents"** section (L105-129: `models`,
  `agentDefaults`, `agentOverrides`) documents config keys that **do not exist**.
  `resolveModelConfig` is explicit: *"there is no config-level alias map"* —
  models are declared per-agent inline as `provider/model`.
  `packages/core/src/wirings/ai-agent/ai-agent-model-config.ts:1-19`. These keys
  are absent from `PikkuCLIInput` (`config.d.ts`). Fix: delete the section and the
  `models` blocks in the "Full-Featured App" example (L111-123, 333-336).
- **H** — Filtering section (L279-285) and Config-Inheritance example (L392-396)
  use `filters.types`. `InspectorFilters` has **no `types` key**; it is `wires`.
  `packages/inspector/src/types.ts:179-204`. Fix: `"types"` → `"wires"`.
- **M** — `filters` doc lists only `tags/types/directories`. Real
  `InspectorFilters` keys: `names, tags, wires, directories, httpRoutes,
  httpMethods`, every `exclude*` variant, and `target`/`excludeTarget`. Same ref.
- **M** — `clientFiles` table (L52-60) omits `reactQueryFile` (`pikku react-query`),
  `realtimeFile` (`pikku realtime`), `startServerFnsFile` (`pikku tanstack-start`),
  plus `nextBackendTransport`, `nextBackendFetcherImport`,
  `realtimeEventHubTopicsImport`. `config.d.ts:181-225`.
- **M** — `scaffold` feature-flag table (L98-103) omits **`events`**
  (`PikkuScaffoldFeature`). `config.d.ts:279`.
- **M** — Missing top-level config keys entirely: `runtimeDir`, `namedFilters`,
  `binary` (`{ entrypoint, output, targets }`), `stateOutput`/`stateInput`.
  `config.d.ts:159,300-304,312-313,286-287`.

#### `pikku-cli/generated-files.md` — **ok**
- Verified clean. `pikku-meta-service.gen.ts` IS emitted
  (`packages/cli/src/deploy/bundler/bundler.ts`,
  `functions/commands/pikku-command-bootstrap.ts`), and
  `schemas/register.gen.ts` IS the real filename
  (`packages/cli/src/utils/serialize-schemas.ts:24,69`). Directory tree matches
  `config.d.ts` (agent/, trigger/, gateway/, secrets/, credentials/, variables/).

#### `pikku-cli/tree-shaking.mdx` — **major**
- **H** — `--types` used throughout (L17, 91-93, 200, 210) → `--wires`. Same as index.
  (`pikkuServices` and `requiredSingletonServices` in L116/129 are **real**
  generated symbols — `packages/cli/src/functions/wirings/functions/pikku-command-services.ts`
  — so those examples are fine.)
- **M** — Generated-entry example (L222-233) imports `createHTTPHandler` from
  `@pikku/runtime-express`. Neither exists: there is no `createHTTPHandler` symbol
  anywhere in `packages/`, and the express runtimes are `@pikku/express` /
  `@pikku/express-middleware` (`packages/runtimes/express-server/package.json`).
  `.pikku/entry.ts` is not a real generated path either. Fix: relabel as
  illustrative pseudo-code or rewrite to a real runtime bootstrap.

#### `pikku-cli/errors/*` (16 pages) — **pending per-code verification** (see TODO)

---

### `wiring/rpcs/` (5 pages)

#### `wiring/rpcs/index.md` — **major**
- **H** — Internal/Remote examples (L19, L76) destructure `{ rpc }` from the
  services (1st) arg. `rpc` is on the wire (3rd) arg — Global Sweep #5. Fix:
  `async (services, data, { rpc }) => …`.
- **H** — "Exposed RPCs" says a function is *"automatically available as external
  RPC"* (L42 comment). Non-exposed functions are now hidden; a function must set
  `expose: true` (`packages/core/src/function/functions.types.ts:282`;
  `rpc-runner.ts:119` throws `RPCNotFoundError` when `!functionMeta.expose`). Fix:
  add `expose: true` to the example and reword.
- Correct: `rpc.invoke`, `rpc.remote`, `POST /rpc/:rpcName`, depth tracking,
  session inheritance (all match `PikkuRPC` in `rpc-types.ts` + `/rpc/:rpcName`
  route in `serialize-rpc-wrapper.ts:66`).

#### `wiring/rpcs/internal.md` — **major**
- **H** — Every example destructures `{ rpc, … }` from the services arg (L45,
  L106, L134, L195, L223). Move `rpc` to the 3rd (wire) arg — Global Sweep #5.
- Otherwise conceptually accurate: `rpc.invoke`, `rpc.depth`, session/auth
  inheritance all match `PikkuRPC` (`rpc-types.ts:1-28`).

#### `wiring/rpcs/external.md` — **major**
- **H** — `rpc.invokeExposed(name, data)` (L41) does not exist. The method is
  `rpc.exposed(name, data)` (`rpc-types.ts:12`; confirmed by `deployment.md:55`).
- **H** — `rpcCaller` destructures `{ rpc }` from the services arg (L39). Move to
  3rd arg — Global Sweep #5.
- **H** — Type-safe client section (L80-85): `import { pikkuClient }` +
  `pikkuClient(url)` + `client.greet(...)`. The generated fetch client exports a
  **`PikkuFetch` class** (used via `createPikku(PikkuFetch, …)` in
  `react-query.md`/`@pikku/react`), not a `pikkuClient` factory with
  method-per-RPC. Verify against fetch-client page and rewrite. (cross-ref:
  fetch-client.md audit.)

#### `wiring/rpcs/deployment.md` — **major**
- **H** — `import { PgDeploymentService } from '@pikku/pg'` (L72, L168) — neither
  exists. Use `PgKyselyDeploymentService` from `@pikku/kysely-postgres` — Global
  Sweep #6 (`templates/remote-rpc-pg/src/server.ts:2`).
- **H** — Deployment-service constructor shown as `(config, sql)` (L76-79,
  L171-174). Real signature: `new PgKyselyDeploymentService({ heartbeatInterval,
  heartbeatTtl }, kysely, jwt, secrets)` — 4 args
  (`templates/remote-rpc-pg/src/server.ts:31-36`).
- **H** — "Full Example" constructs `new PikkuExpressServer(config,
  singletonServices, createWireServices)` (L181-185). Template uses
  `new PikkuExpressServer({ ...config, port, hostname }, services.logger)` — 2 args
  (config, logger) (`templates/remote-rpc-pg/src/server.ts:46-49`). [Re-confirm in
  runtimes/express audit.]
- **M** — "Available Backends" table: PostgreSQL row points at `@pikku/pg`; should
  be `@pikku/kysely-postgres` (`PgKyselyDeploymentService`). Add `@pikku/mongodb`.
- Correct: `rpc.exposed`/`expose: true`, `/rpc/:rpcName`, `rpc.remote`, the
  RPC-methods table, and `PIKKU_REMOTE_SECRET` session forwarding
  (`packages/core/src/remote.ts:26`, `middleware/remote-auth.ts:13`).

#### `wiring/rpcs/react-query.md` — **ok**
- Verified clean. Hook names `usePikkuQuery`/`usePikkuMutation`/
  `usePikkuInfiniteQuery` and workflow hooks `useRunWorkflow`/`useStartWorkflow`/
  `useWorkflowStatus` all match `serialize-react-query-hooks.ts`.
  `createPikku(PikkuFetch, PikkuRPC, { serverUrl })`, `PikkuProvider`,
  `@pikku/react` all correct (`packages/frontend/react/src/create-pikku.ts:8-26`,
  `index.ts:10`).



---

## Session 2 — storage, runtimes, sessions, wire-args (applied)

**New cross-cutting fabrications found & fixed (all verified vs source/templates):**

- **No `@pikku/pg` package.** PostgreSQL = `@pikku/kysely-postgres` with `PgKysely*`
  classes (`PgKyselyAIStorageService`, `PgKyselyWorkflowService`,
  `PgKyselyDeploymentService`, `PgKyselyChannelStore`, `PgKyselyAgentRunService`,
  `PgKyselyWorkflowRunService`, `PgKyselyEventHubStore`, `PgKyselySecretService`)
  + `PgEventHubService`. Construct via `new PikkuKysely<KyselyPikkuDB>(logger,
  connStr)` → `.init()` → `new PgKysely*(pikkuKysely.kysely)`.
  `PgKyselyDeploymentService({heartbeat...}, kysely, jwt, secrets)`.
  `PgKyselyAIStorageService` serves both `aiStorage` and `aiRunState`.
  → fixed `storage/postgresql.md` (full rewrite), `storage/index.md`,
  `storage/redis.md`, `storage/kysely.md`, `core-features/services.md`,
  `ai-agents/index.md`. Redis also has `RedisSecretService`.
- **`createSchedulerRuntimeHandlers` / `registerQueueWorkers` (standalone) /
  `setHandlers` are fabricated.** Real: `factory.getQueueWorkers()` →
  `await .registerQueues()` (job runner auto-wired by bootstrap import);
  `factory.getSchedulerService()` → singletons → `.start()`/`.stop()`.
  → fixed `runtimes/bullmq.md`, `runtimes/pg-boss.md`.
- **AI agents:** removed fabricated `models`/`agentDefaults`/`agentOverrides`
  alias config — per-agent `model: 'provider/model'` + optional `temperature`/
  `maxSteps`; request-time override via `input.model`. (`ai-agents/index.md`)
- **Cloudflare** (`cloudflare-functions.md`): `runFetch(request, wsServer?,
  options?)` & `runScheduled(controller)` (services via global state, not passed);
  WS = extend `CloudflareWebSocketHibernationServer` + override `getParams()`,
  pass DO stub as runFetch 2nd arg; D1 = `createD1Kysely` + `new
  CloudflareWorkflowService(kysely)` (no `createD1*Service` factories).
- **`triggerService.setServices` fabricated** — only `start()`/`stop()`; services
  via bootstrap. (`triggers/index.md`)
- **No `@pikku/middleware-http-session`/`-channel-session` pkgs** — session
  middleware = `authCookie`/`authBearer`/`authAPIKey` from `@pikku/core/middleware`.
  (`user-sessions.md`)
- **`@pikku/scheduler` → `@pikku/schedule`** (`scheduled-tasks.md`).
- **No `userSession` service / `createUserSessionService`.** Session is on the
  WIRE: `session`, `setSession()`, `clearSession()`, `getSession()`,
  `hasSessionChanged()`, `pikkuUserId`. (`api/user-session-service.md` usage,
  `core-features/services.md`, `api/event-hub.md`). `userSession` legit only in
  `authBearer({ token: { value, userSession }})`.
- **`@pikku/ws` exports `pikkuWebsocketHandler`, not `PikkuWSServer`** — attach to
  a Node `http.Server` + `ws.WebSocketServer`. (`uws-handler.md`)
- **Wire-arg slips fixed** (channel/session/queue are wire; eventHub is a service):
  `channels/index.md` (×8), `cli/index.md`, `queue/index.md`, `functions.md`,
  `mcp/resources.md`+`tools.md`, `internal.md`, `api/event-hub.md`. Also fixed
  `data.channelId` → `channel.channelId` correctness bugs.

**Verified correct (no change):** runtime server ctors are 2-arg `(config, logger)`
for Express/Fastify/UWS; `@pikku/lambda` sub-paths `./http ./websocket ./queue
./scheduled` + `runFetchV2`/`runSQSQueueWorker`/`runLambdaScheduled`;
`@pikku/next` `./pikku-session` `getSession`; gateway (`wireGateway`,
`GatewayAdapter`, `LocalGatewayService`) and `wireCredential` all real;
`ws-handler.md`, `react-query.md` clean.

**Master sweeps (fabricated-symbol set + full wire-slip set) CLEAN across all docs.**

**Still unaudited:** gateway/credentials (symbols verified, semantics not deep-read),
runtimes azure/google-cloud-run/mcp-server/nextjs (deep), api refs (~6 remaining),
addon(4), console(3), http/SSE, channels/channel-route+websocket-client,
philosophy/comparison/advanced.

---

## Session 3 — runtimes deep-dive, HTTP service API, agent config, scheduler/content rewrites

Continued sequential audit. Highest-impact NEW fabrications found and fixed:

### Runtime handler/server APIs take NO services (global state)
All runtime entry points get services from Pikku's global state (populated by
`createSingletonServices` + the bootstrap import) — they do NOT accept
`singletonServices`/`createWireServices` as args. Fixed:
- **express-middleware.md** — `pikkuExpressMiddleware({ logger, respondWith404?,
  logRoutes?, loadSchemas? })` (single object, was `(singleton, createWire, opts)`);
  full server `server.init()` (was `init({singletonServices,createWireServices,...})`).
- **fastify-plugin.md** — plugin opts `{ pikku: { logger, logRoutes?, loadSchemas?,
  ...RunHTTPWiringOptions } }` (was `singletonServices`/`createWireServices`);
  `server.init()`.
- **uws-handler.md** — `pikkuHTTPHandler({ logger, ... })` / `pikkuWebsocketHandler
  ({ logger })` return handlers mounted via `app.any('/*',...)` / `app.ws('/*',...)`
  (was a fake `{ app, singletonServices, createWireServices }` single call);
  `server.init()`.
- **aws-lambda.md** — `runSQSQueueWorker(logger, event)` (was `{ event }`);
  `connectWebsocket/disconnectWebsocket/processWebsocketMessage(event, { channelStore })`
  (was `(event, singletonServices[, createWireServices])`); `PgChannelStore` →
  `PgKyselyChannelStore`.

`RunHTTPWiringOptions` = `{ skipUserSession, respondWith404, logWarningsForStatusCodes,
coerceDataFromSchema, bubbleErrors, exposeErrors, generateRequestId, traceId }` —
no services.

### HTTP request/response API (router.md, core-features/middleware.md)
Real `PikkuHTTPRequest`: `method()`, `path()`, `data()`, `json()`, `headers()`,
`header(name)`, `cookie(name?)`, `params()`, `query()` — all functions.
Real `PikkuHTTPResponse`: `statusCode` (readonly), `status(code)`, `header(name,value)`,
`json(data)`, `cookie()`, `arrayBuffer()`, `send?()`, `redirect()`. Fixed across both
docs: `getHeader`→`header`, `setHeader`→`header`, `setStatus`→`status`,
`request.method`→`request.method()`, `request.url`→`request.path()`,
`response.status` (read)→`response.statusCode`, `request.method !== 'GET'`→`=== 'get'`
(lowercase). Removed non-existent `response.body` read/write in the cache example.

### addHTTPMiddleware needs a pattern arg
`addHTTPMiddleware(pattern, middleware[])` — pattern is required (`'*'` for global).
Fixed all array-only `addHTTPMiddleware([...])` → `addHTTPMiddleware('*', [...])` in
core-features/middleware.md and wiring/http/router.md, plus router.md's Parameters
section (removed the non-existent array-only overload). `addHTTPPermission(pattern,
permissions)` confirmed correct (object-map permissions OK).

### AI agent config field is `goal`, not `instructions`
`CoreAIAgent` uses `goal: string` (NOT `instructions`). `model` is always
`provider/model` (no `'fast'` alias). Fixed wiring/ai-agents/index.md (7 configs +
properties table + `model: 'fast'`) and wiring/credentials/index.md. The only legit
`instructions` is the AI-middleware `modifyInput` ctx field. `pikkuAIAgent` is a
generated helper; real fields incl. summary/role/personality/agentMode/memory/etc.

### Full rewrites
- **api/pikku-task-scheduler.md** — was a fabricated `startAll()/stopAll()/start(names)/
  stop(names)` + `new PikkuTaskScheduler(singletonServices)` + wrong source URL. Real:
  `PikkuTaskScheduler` is an alias of `InMemorySchedulerService` (`@pikku/schedule`);
  API = `start()`/`stop()` (no args), `scheduleRPC(delay, rpcName, data?, session?)`,
  `unschedule(taskId)`, `getTask(taskId)`, `getAllTasks()`. Constructor takes no args.
  Server example fixed to `new PikkuExpressServer(config, singletonServices.logger)`.
- **api/content-service.md** — every method takes a single args OBJECT with `bucket`
  (was positional). `getUploadURL({bucket,fileKey,contentType,size?}) → UploadURLResult
  {uploadUrl,assetKey,uploadHeaders?,uploadMethod?}`, `signContentKey({bucket,contentKey,
  dateLessThan,dateGreaterThan?})`, `signURL`, `deleteFile/readFile/readFileAsBuffer
  ({bucket,key})`, `writeFile({bucket,key,stream})`, `copyFile({bucket,key,
  fromAbsolutePath})`. Added missing `readFileAsBuffer`.

### Other fixes
- **wiring/gateway/index.md** — middleware example unwrapped from `{ func: ... }` to a
  bare `(services, wire, next)` function (middleware = `CorePikkuMiddleware`, not config).
- **wiring/http/server-sent-events.md** — fixed corrupted line `new a'/todos/progress'`
  → `new EventSource('/todos/progress', { withCredentials: true })`.

### Verified correct (no change)
- runtimes: nextjs-app, mcp-server, ws-handler (live refs/correct), cloudflare (already).
- azure-functions.md + google-cloud-run-functions.md are `draft: true` stubs.
- Gateway types (`GatewayAdapter`, `GatewayInbound/Outbound/Attachment`, `PikkuGateway`
  {gatewayName,senderId,platform,send}), `LocalGatewayService` @ `@pikku/core/services`,
  `wireGateway` — all match.
- Credentials: `wireCredential`/`CoreCredential` + oauth2 config — match.
- wiring/http/{index(except middleware fix),route-groups,cors}, channels/{channel-route,
  websocket-client}.
- api: jwt-service (`encode(expiresIn,payload)`), variables (`get`/`getAll`), logger
  (`info`/`setLevel`/`LogLevel` trace|debug|info|warn|error|critical), secret-service
  (`getSecret`/`getSecretJSON`), event-hub + user-session-service (session 2).
- addon (index/creating/consuming/secrets): `wireAddon` config {name,package,
  rpcEndpoint?,auth?,mcp?,tags?,secretOverrides?,variableOverrides?,credentialOverrides?},
  `wireSecret`/`CoreSecret` {name,displayName,description?,secretId,schema}, `pikku new
  addon`, `defineHTTPRoutes`/`wireHTTPRoutes`. `@pikku/stripe|posthog|my-addon` are
  pedagogical examples — left as-is.
- console (index/getting-started/features): `npx pikku console`/`watch` commands exist.

### Master sweep — CLEAN across ALL docs
`@pikku/pg`, `@pikku/scheduler`, fake middleware-session pkgs, `createSchedulerRuntime
Handlers`, `registerQueueWorkers`, `.setServices(`, `PgWorkflowService`,
`PgAIStorageService`, `.setHeader(`/`.getHeader(`/`.setStatus(`, `request.method`(no
paren)/`request.url`/`response.body`, `services.userSession`, wire-as-service slips,
`model: 'fast'` aliases, `instructions:` agent configs, array-only `addHTTPMiddleware([`
— all return ZERO matches.

**Still unaudited (low code-claim density):** http/fetch-client.md, http/openapi.md,
api/schema-service.md + api/exception.md (symbols verified real), philosophy /
comparison / advanced / deploy / index.

---

## Session 3b — CLI skills audit (`pikku/packages/cli/skills/`)

Ran the same error-signature sweep across all 52 bundled SKILL.md files. Fixed:

- **pikku-ai-agent** + **pikku-addon** — agent config `instructions:` → `goal:`
  (API-ref field, examples). `model` already `provider/model`.
- **pikku-security** — `addHTTPMiddleware([...])` → `addHTTPMiddleware('*', [...])`.
- **pikku-http** — channel example `async ({ db, channel }, {})` →
  `async ({ db }, {}, { channel })` (channel is a wire member).
- **pikku-queue** — enqueue example was `async ({ db, queue }, ...) → queue.add()`.
  Fixed to `async ({ db, queueService }, ...) → queueService.add()`. NOTE: enqueue
  uses the `queueService` SINGLETON SERVICE (1st arg); `wire.queue` (3rd arg) is
  only the in-worker job context (`updateProgress`/`fail`/`discard`). The skill's
  `wire.queue.updateProgress(...)` worker examples were already correct.
- **pikku-mcp** — `new PikkuMCPServer(config, singletonServices, createWireServices)`
  + `server.start()` → real: `new PikkuMCPServer({ name, version, mcpJSON,
  capabilities }, singletonServices.logger)` then `server.init()` +
  `server.connectStdio()` (or `connectHTTP({port})`). No `start()` on MCP server.
- **pikku-concepts** — `new PikkuFastifyServer(config, singletonServices,
  createWireServices)` / `PikkuExpressServer(...3 args)` → `(config,
  singletonServices.logger)`; replaced fabricated `pikkuAWSLambdaHandler/
  PikkuCloudflareHandler/pikkuNextHandler(singletonServices)` alt-comments with the
  real `PikkuUWSServer` alternative.
- **pikku-backblaze** + **pikku-aws** — content method reference lists were
  positional; fixed to the real single-args-object form `{ bucket, ... }`
  (`signContentKey({bucket,contentKey,dateLessThan,dateGreaterThan?})`,
  `getUploadURL({bucket,fileKey,contentType,size?})`, `writeFile/copyFile/readFile/
  readFileAsBuffer/deleteFile({bucket,key,...})`).

Left as-is (correct): `pikku-rtl` `new URL(request.url)` — that's a native Web
`Request` in the Vite-SSR worker render, not a PikkuHTTPRequest. PikkuQueue client
class examples (`new PikkuQueue(queueService); queue.add(...)`) are the standalone
typed client, which does expose `.add()`.

Re-swept all 52 skills: CLEAN for fake pkgs, HTTP accessors, array-only
addHTTPMiddleware, agent `instructions:`/model-alias, 3-arg server constructors,
positional content calls, and wire-`{queue}`-enqueue.
