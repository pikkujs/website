# Pikku Documentation Audit

## Executive Summary

The Pikku framework (v0.12.0) has a strong documentation foundation for its core features — functions, services, middleware, permissions, sessions, HTTP wiring, and WebSocket channels are comprehensively documented with examples. The philosophy, architecture, and CLI tooling sections are also well-covered.

However, several significant gaps exist. The **AI agent system** (`@pikku/core/ai-agent`) has a large public API surface with 15+ types and 7+ functions but lacks any dedicated documentation page. **Triggers**, **graph workflows**, **remote RPC/deployment**, and the **external console backend** are either undocumented or have only stub coverage. Many **service integration packages** (pg, redis, kysely, ai-vercel, aws-services) have no dedicated documentation — users must rely on template examples. The **runtime integration pages** vary in completeness: Express and MCP are reasonably covered, while Azure Functions, Cloudflare, and uWS have minimal content.

Overall, the documentation covers approximately **60-65% of the public API surface** comprehensively. The remaining gaps are concentrated in newer features (AI agents, graph workflows, triggers, deployment services) and service/runtime integration details.

---

## Public API Coverage Matrix

### @pikku/core (25 export paths, 150+ types, 100+ functions)

| Export Path | Key APIs | Documented? | Gaps |
|---|---|---|---|
| `.` (main) | pikkuMiddleware, pikkuAuth, pikkuPermission, addFunction, PikkuRequest, fetch, runPikkuFunc, workflow, createGraph, SchedulerService | Partial | Many utility functions undocumented (formatVersionedId, isVersionedId, parseVersionedId, pikkuState, initializePikkuState, addPackageServiceFactories) |
| `./middleware` | authAPIKey, authCookie, authBearer, pikkuRemoteAuthMiddleware, cors | Partial | pikkuRemoteAuthMiddleware undocumented; auth middleware pages are minimal stubs |
| `./function` | addFunction, getAllFunctionNames, CorePikkuFunction types | Yes | Covered in core-features/functions.md |
| `./channel` | wireChannel, openChannel, PikkuAbstractChannelHandler, ChannelStore, EventHubStore, defineChannelRoutes | Partial | ChannelStore/EventHubStore classes undocumented; defineChannelRoutes undocumented |
| `./channel/local` | PikkuLocalChannelHandler, LocalEventHubService, runLocalChannel | No | No docs for local channel runtime classes |
| `./channel/serverless` | runChannelConnect, runChannelDisconnect, runChannelMessage | No | No docs for serverless channel handlers |
| `./workflow` | PikkuWorkflowService, workflow(), workflowStart(), workflowStatus(), graphStart(), pikkuWorkflowGraph(), template(), createGraph() | Partial | Graph workflows (graphStart, pikkuWorkflowGraph) undocumented; WorkflowSuspendedException, WorkflowCancelledException undocumented; 30+ graph workflow types (BranchStepMeta, ParallelGroupStepMeta, FanoutStepMeta, SwitchStepMeta, FilterStepMeta, etc.) undocumented |
| `./http` | fetch, fetchData, wireHTTP, addHTTPMiddleware, addHTTPPermission, PikkuFetchHTTPRequest/Response, defineHTTPRoutes | Yes | defineHTTPRoutes and fetchData not explicitly documented |
| `./queue` | wireQueueWorker, runQueueJob, createQueueJobRunner, QueueJobDiscardedError, QueueJobFailedError, registerQueueWorkers, validateWorkerConfig | Partial | registerQueueWorkers, createQueueJobRunner, validateWorkerConfig undocumented |
| `./scheduler` | wireScheduler, runScheduledTask, createSchedulerRuntimeHandlers, getScheduledTasks, logSchedulers | Partial | createSchedulerRuntimeHandlers undocumented (used in every workflow template) |
| `./trigger` | wireTrigger, wireTriggerSource, PikkuTriggerService | Minimal | Triggers page exists but API details sparse; TriggerSource cleanup pattern undocumented |
| `./rpc` | PikkuRPCService, rpcService, RPCNotFoundError | Partial | rpcService factory function undocumented; remote/exposed RPC flow needs more detail |
| `./mcp` | MCPEndpointRegistry, wireMCPResource, wireMCPPrompt, runMCPTool/Resource/Prompt, getMCPResourcesMeta/ToolsMeta/PromptsMeta | Yes | Covered across MCP section pages |
| **`./ai-agent`** | **runAIAgent, streamAIAgent, resumeAIAgent, addAIAgent, approveAIAgent, getAIAgents, ToolApprovalRequired, 15+ types** | **No** | **Entirely undocumented — no dedicated page exists** |
| `./cli` | wireCLI, runCLICommand, pikkuCLIRender, executeCLI, parseCLIArguments, generateCommandHelp, defineCLICommands | Partial | CLI wiring basics documented; render functions, argument parsing, help generation undocumented |
| `./cli/channel` | executeCLIViaChannel | Minimal | Referenced in remote-cli.md but API details thin |
| `./node` | CoreNodeConfig, NodeType, NodesMeta | No | Node system entirely undocumented |
| `./secret` | wireSecret, validateAndBuildSecretDefinitionsMeta | Yes | Covered in core-features/secrets.md |
| `./variable` | wireVariable, validateAndBuildVariableDefinitionsMeta | Yes | Covered in core-features/variables.md |
| `./oauth2` | OAuth2Client, wireOAuth2Credential | Partial | Referenced in secrets.md but no dedicated page |
| `./errors` | 33 error classes (BadRequestError through MaxComputeTimeReachedError) | Yes | Covered in core-features/errors.md |
| `./services` | ConsoleLogger, LocalSecretService, LocalVariablesService, TypedSecretService, TypedVariablesService, ScopedSecretService, PikkuSessionService, InMemoryWorkflowService, InMemoryTriggerService, DeploymentService, AIStorageService, AIAgentRunnerService, AIRunStateService, CredentialStatus, VariableStatus | Partial | DeploymentService, AIStorageService, AIAgentRunnerService, AIRunStateService, InMemoryTriggerService undocumented; CredentialMeta/VariableMeta types undocumented |
| `./services/local-content` | LocalContent, LocalContentConfig | Partial | Referenced in content-service.md but details thin |
| `./services/gopass-secrets` | GopassSecretService | No | Entirely undocumented |
| `./schema` | addSchema, getSchema, compileAllSchemas, coerceTopLevelDataFromSchema, validateSchema | No | Schema utility functions undocumented (internal-facing but used in runtimes) |

### Other Packages

| Package | Key APIs | Documented? | Gaps |
|---|---|---|---|
| `pikku` | Re-exports @pikku/core + @pikku/jose + @pikku/schema-ajv | Partial | Documented as installation option but export bundling not explained |
| `@pikku/cli` | 13 commands, PikkuCLIConfig, global options | Yes | CLI docs are comprehensive; some new commands (versions-check, schemas, openapi) may need pages |
| `@pikku/inspector` | inspect(), InspectorState, 45+ ErrorCodes, filterInspectorState, serializeManifest | Partial | Inspector itself not user-documented (internal tool), but ErrorCodes are documented in pikku-cli/errors/ |
| `@pikku/console` | Private React app — user-facing feature | Partial | Console getting-started and features pages exist; could use more depth |
| `@pikku/external-console` | getAllMeta, getFunctionsMeta, oauthConnect/Disconnect/Status, WiringService, ExternalService | No | Entirely undocumented backend service |
| `@pikku/fetch` | CorePikkuFetch (setServerUrl, setAuthorizationJWT, setAPIKey, get/post/patch/head/api) | Yes | Documented in wiring/http/fetch-client.md |
| `@pikku/websocket` | CorePikkuWebsocket, CorePikkuRouteHandler (subscribe, send, getRoute) | Yes | Documented in wiring/channels/websocket-client.md |
| `@pikku/pg` | PgChannelStore, PgEventHubStore, PgWorkflowService, PgWorkflowRunService, PgDeploymentService, PgAIStorageService, PgAgentRunService | No | No dedicated docs — only referenced in templates |
| `@pikku/redis` | RedisChannelStore, RedisEventHubStore, RedisWorkflowService, RedisWorkflowRunService, RedisDeploymentService, RedisAgentRunService | No | No dedicated docs — only referenced in templates |
| `@pikku/kysely` | PikkuKysely, KyselyChannelStore, KyselyEventHubStore, KyselyWorkflowService, + 4 more services | No | No dedicated docs |
| `@pikku/queue-bullmq` | BullServiceFactory (getQueueService, getQueueWorkers, getSchedulerService) | Minimal | Referenced in runtimes/bullmq.md but factory API details sparse |
| `@pikku/queue-pg-boss` | PgBossServiceFactory (getQueueService, getQueueWorkers, getSchedulerService) | Minimal | Referenced in runtimes/pg-boss.md but factory API details sparse |
| `@pikku/pino` | PinoLogger (info, warn, error, debug, setLevel) | No | No dedicated docs; only mentioned in logger API page |
| `@pikku/jose` | JoseJWTService (encode, decode, verify, init) | Partial | Referenced in JWT service docs but constructor/init not detailed |
| `@pikku/schema-ajv` | AjvSchemaService (compileSchema, validateSchema, getSchemaNames, getSchemaKeys) | No | No dedicated docs; schema-service API page exists but doesn't detail implementations |
| `@pikku/schema-cfworker` | CFWorkerSchemaService | No | No dedicated docs; not even mentioned when to use vs AJV |
| `@pikku/ai-vercel` | VercelAIAgentRunner (stream, constructor with providers) | No | No dedicated docs |
| `@pikku/aws-services` | S3Content, AWSSecrets, SQSQueueService | No | No dedicated docs for S3 or SQS; AWSSecrets partially referenced |
| `@pikku/express` | PikkuExpressServer (init, start, stop, enableCors, enableStaticAssets, enableReaper) | Partial | Referenced in runtimes/express-middleware.md |
| `@pikku/express-middleware` | pikkuExpressMiddleware (logRoutes, loadSchemas, coerceDataFromSchema) | Yes | Covered in runtimes/express-middleware.md |
| `@pikku/fastify` | PikkuFastifyServer (init, start, stop) | Partial | Referenced in runtimes/fastify-plugin.md |
| `@pikku/fastify-plugin` | pikkuFastifyPlugin (Fastify plugin with pikku options) | Yes | Covered in runtimes/fastify-plugin.md |
| `@pikku/uws` | PikkuUWSServer (init, start, stop, app) | Minimal | runtimes/uws-handler.md exists but may be thin |
| `@pikku/uws-handler` | pikkuHTTPHandler, pikkuWebsocketHandler | Minimal | Referenced in uws-handler.md |
| `@pikku/ws` | pikkuWebsocketHandler (server, wss options) | Minimal | runtimes/ws-handler.md exists but may be thin |
| `@pikku/lambda` | runFetch (HTTP), processWebsocket* (WS), runSQSQueueWorker (Queue), LambdaEventHubService | Partial | runtimes/aws-lambda.md exists; SQS worker and WS handlers may need more detail |
| `@pikku/cloudflare` | runFetch, runScheduled, CloudflareWebSocketHibernationServer | Partial | runtimes/cloudflare-functions.md exists; Durable Objects WebSocket pattern needs dedicated coverage |
| `@pikku/next` | PikkuNextJS (actionRequest, staticActionRequest, apiRequest), getSession | Yes | runtimes/nextjs-app.md covers this |
| `@pikku/azure-functions` | AzInvocationLogger, PikkuAZTimerRequest | Minimal | runtimes/azure-functions.md exists but API details thin |
| `@pikku/modelcontextprotocol` | PikkuMCPServer (init, connect, stop, wrapLogger, enableTools/Resources/Prompts) | Partial | runtimes/mcp-server.md + wiring/mcp/ section; dynamic capability toggling undocumented |

---

## Template Feature Coverage

| Template | Key Features Demonstrated | Documented? | Gaps |
|---|---|---|---|
| Express Server | PikkuExpressServer, InMemorySchedulerService, graceful shutdown | Yes | Scheduler setup pattern example missing from docs |
| Fastify Server | PikkuFastifyServer, bootstrap loading | Yes | Covered |
| Next.js | Generated handlers, catch-all routing, JWT | Yes | Generated file structure could be better explained |
| AWS Lambda HTTP | Cold start caching, multi-handler (HTTP+SQS+Scheduler), Serverless Framework | Partial | Cold start pattern, multi-handler export pattern undocumented |
| AWS Lambda WebSocket | PgChannelStore, PgEventHubStore, LambdaEventHubService, API Gateway WS | Partial | Lambda WebSocket channel store setup undocumented |
| Cloudflare Workers | ExportedHandler, runFetch, runScheduled, per-request service setup | Partial | Environment variable mapping pattern undocumented |
| Cloudflare WebSocket | CloudflareWebSocketHibernationServer, Durable Objects, migrations | No | Durable Objects WebSocket pattern entirely undocumented |
| Express Middleware | pikkuExpressMiddleware integration with existing Express apps | Yes | Covered in runtimes/express-middleware.md |
| Fastify Plugin | pikkuFastifyPlugin registration pattern | Yes | Covered in runtimes/fastify-plugin.md |
| µWebSockets | PikkuUWSServer combined HTTP+WS | Partial | Combined pattern briefly covered |
| WS Library | pikkuWebsocketHandler, manual HTTP upgrade, health check | Partial | Manual upgrade pattern undocumented |
| MCP Server | PikkuMCPServer, StdioTransport, capabilities config, logger wrapping | Partial | Server lifecycle and capabilities undocumented |
| CLI | UWS-based CLI server, WebSocket channel for CLI commands | Partial | CLI-over-WebSocket architecture undocumented |
| Functions | 11 function types, TodoStore, all wiring patterns | Yes | Core examples well-referenced in docs |
| External Functions | External package pattern, NoopService, external permissions, node metadata | Partial | External packages section exists; node metadata undocumented |
| BullMQ Queue | BullServiceFactory, registerQueueWorkers, graceful shutdown | Minimal | Factory lifecycle pattern needs docs |
| PG Boss Queue | PgBossServiceFactory, DATABASE_URL config | Minimal | Factory lifecycle pattern needs docs |
| Workflows (BullMQ) | Express+BullMQ+Redis, createSchedulerRuntimeHandlers, trigger service | Minimal | Workflow deployment setup is complex and poorly documented |
| Workflows (PG Boss) | Express+PgBoss+PgWorkflowService, dual DB connections | Minimal | Same as above with PG-specific gaps |
| AI Agents (Postgres) | VercelAIAgentRunner, multi-provider AI, PgAIStorageService, secret-based provider detection | No | AI agent setup entirely undocumented |
| Remote RPC (PG) | PgDeploymentService, heartbeat, multi-server spawning, rpc.remote(), rpc.exposed() | No | Deployment service and remote RPC coordination undocumented |
| Remote RPC (Redis) | RedisDeploymentService, same pattern with Redis | No | Same gaps as PG version |

---

## Detailed Gap Analysis

### Missing Documentation

These features have **no dedicated documentation page** at all:

| Feature | API Surface | Source Reference | Priority |
|---|---|---|---|
| **AI Agents** | runAIAgent, streamAIAgent, resumeAIAgent, approveAIAgent, addAIAgent, ToolApprovalRequired, AIAgentMemoryConfig, 15+ types | `@pikku/core/ai-agent`, `@pikku/ai-vercel`, templates/ai-postgres | **Critical** |
| **AI Agent Wiring** | wireAIAgent patterns, model configuration, tool integration, memory, approval flows | templates/functions/agent.functions.ts | **Critical** |
| **@pikku/pg package** | PgChannelStore, PgEventHubStore, PgWorkflowService, PgWorkflowRunService, PgDeploymentService, PgAIStorageService, PgAgentRunService | packages/services/pg/ | **Critical** |
| **@pikku/redis package** | RedisChannelStore, RedisEventHubStore, RedisWorkflowService, RedisDeploymentService, RedisAgentRunService | packages/services/redis/ | **Critical** |
| **Graph Workflows** | pikkuWorkflowGraph(), graphStart(), BranchStepMeta, ParallelGroupStepMeta, FanoutStepMeta, SwitchStepMeta, FilterStepMeta, 20+ types | `@pikku/core/workflow`, templates/functions/graph.wiring.ts | **High** |
| **Deployment Service** | DeploymentService, DeploymentConfig, heartbeat, multi-instance coordination | `@pikku/core/services`, `@pikku/pg`, `@pikku/redis` | **High** |
| **@pikku/kysely package** | PikkuKysely, Kysely-based stores for channels, workflows, AI | packages/services/kysely/ | **Medium** |
| **@pikku/ai-vercel package** | VercelAIAgentRunner, provider configuration, streaming | packages/services/ai-vercel/ | **Medium** |
| **@pikku/pino package** | PinoLogger setup and configuration | packages/services/pino/ | **Medium** |
| **@pikku/aws-services (S3/SQS)** | S3Content (upload/download/sign), SQSQueueService | packages/services/aws-services/ | **Medium** |
| **@pikku/schema-cfworker** | CFWorkerSchemaService, when to use vs AJV | packages/services/schema-cfworker/ | **Medium** |
| **Node Metadata System** | CoreNodeConfig, NodeType, NodesMeta, graph node categories | `@pikku/core/node` | **Low** |
| **GopassSecretService** | GopassSecretService for gopass secret management | `@pikku/core/services/gopass-secrets` | **Low** |
| **External Console Backend** | WiringService, ExternalService, OAuthService, FileWatcherService, SchemaService | packages/external-console/ | **Low** (internal) |

### Incomplete Documentation

These pages exist but are **missing significant API details**:

| Page | What's Covered | What's Missing |
|---|---|---|
| **docs/middleware/auth-jwt.md** | Brief mention of JWT in Authorization header | JoseJWTService constructor, init(), encode/decode examples, secret rotation, RelativeTimeInput |
| **docs/middleware/auth-apikey.md** | Brief mention of API key in x-api-key header | Full middleware configuration, custom header names, validation logic |
| **docs/middleware/auth-cookie.md** | Brief mention of cookie session retrieval | Cookie configuration, domain/path/secure options, session serialization |
| **docs/wiring/triggers/index.md** | Basic trigger concept | wireTriggerSource API, cleanup function pattern, PikkuTriggerService, InMemoryTriggerService, trigger.invoke() |
| **docs/runtimes/bullmq.md** | Basic BullMQ reference | BullServiceFactory lifecycle, getQueueService/getQueueWorkers/getSchedulerService, Redis configuration, graceful shutdown |
| **docs/runtimes/pg-boss.md** | Basic PG Boss reference | PgBossServiceFactory lifecycle, connection string config, init/close lifecycle |
| **docs/runtimes/aws-lambda.md** | HTTP handler | SQS queue worker (runSQSQueueWorker), WebSocket handlers, cold start optimization, multi-handler patterns |
| **docs/runtimes/cloudflare-functions.md** | Basic Cloudflare Worker | runScheduled, Durable Objects, CloudflareWebSocketHibernationServer, environment variable patterns |
| **docs/runtimes/azure-functions.md** | Basic Azure reference | AzInvocationLogger, PikkuAZTimerRequest, timer trigger integration |
| **docs/runtimes/uws-handler.md** | Basic uWS reference | pikkuHTTPHandler/pikkuWebsocketHandler options, combined HTTP+WS setup |
| **docs/runtimes/ws-handler.md** | Basic WS reference | pikkuWebsocketHandler options, manual HTTP upgrade, health check pattern |
| **docs/wiring/workflows/** | Overview, getting-started, steps, configuration | Graph workflow configuration, workflow context variables, WorkflowSuspendedException/CancelledException, advanced step types |
| **docs/wiring/cli/** | Overview, local, remote | CLI render function API, parseCLIArguments, generateCommandHelp, option types, positional args |
| **docs/wiring/rpcs/** | Internal vs external overview | rpc.remote() for cross-deployment calls, DeploymentService integration, exposed function discovery |
| **docs/api/schema-service.md** | Schema service interface | AJV vs CFWorker comparison, when to use each, configuration differences |
| **docs/api/content-service.md** | Content service interface | LocalContent config, S3Content setup, upload/download examples |
| **docs/wiring/http/openapi.md** | Marked "work in progress" | Complete OpenAPI generation: permissions, error codes, parameter types, examples |
| **docs/comparison/index.md** | Stub with TODO | Actual comparison content |
| **docs/wiring/http/server-sent-events.md** | May exist | SSE wiring pattern (`sse: true`), channel API for periodic sends, auto-close patterns |

### Outdated Documentation

| Page | Issue | Evidence |
|---|---|---|
| **docs/wiring/http/openapi.md** | Marked as "work in progress" — may reference old API | Explicitly notes missing features |
| **Various pages** | v0.11 audit was completed but verify no pre-v0.11 patterns remain | Recent commit "docs: comprehensive documentation audit for v0.11 API" suggests most were updated |
| **docs/comparison/index.md** | Stub content with TODO marker | `TODO: "Explain what we are comparing"` |

### Example-Only Features

These features are demonstrated **only in templates** with no documentation:

| Feature | Template(s) | What's Demonstrated |
|---|---|---|
| **Cold start optimization** | aws-lambda, aws-lambda-websocket | Module-scoped singleton caching for Lambda cold starts |
| **Multi-handler Lambda exports** | aws-lambda | Single file exporting httpRoute, myScheduledTask, mySQSWorker |
| **Cloudflare Durable Objects WebSocket** | cloudflare-websocket | CloudflareWebSocketHibernationServer, Durable Object binding, migrations |
| **Multi-provider AI setup** | ai-postgres | Ollama/OpenAI/Anthropic fallback with secret detection |
| **Multi-server spawning** | remote-rpc-pg | Child process spawning for testing multi-instance RPC |
| **DeploymentService heartbeat** | remote-rpc-pg, remote-rpc-redis | heartbeatInterval, heartbeatTtl, deployment registration |
| **SSE streaming pattern** | functions (sse.functions.ts) | Periodic channel.send() with auto-close |
| **Channel message routing** | functions (channel.wiring.ts) | onMessageWiring with action-based routing map |
| **Trigger cleanup function** | functions (trigger.functions.ts) | Return cleanup function from trigger source setup |
| **Workflow+Queue+HTTP combined setup** | workflows-bullmq, workflows-pg-boss | Express + Queue factory + Workflow service + Scheduler + Trigger in one process |
| **External package permissions** | function-external | externalPermission, tagPermission patterns for cross-package auth |
| **Graph workflow wiring** | functions (graph.wiring.ts) | graphStart() with entry node specification |
| **CLI render functions** | functions (cli.wiring.ts) | Custom renderers (todoListRenderer, etc.) with pikkuCLIRender |

---

## Prioritized Documentation Plan

### Critical (Must-Have)

#### 1. AI Agents Documentation Page
- **Page:** `docs/wiring/ai-agents/index.md` (new section)
- **Content needed:**
  - What are AI agents in Pikku
  - Defining an AI agent function (model, tools, memory, maxSteps, outputSchema)
  - AI middleware hooks (PikkuAIMiddlewareHooks)
  - Wiring agents (addAIAgent, wireHTTP patterns)
  - Running agents (runAIAgent, streamAIAgent, resumeAIAgent)
  - Tool approval flow (ToolApprovalRequired, approveAIAgent)
  - Memory and conversation persistence (AIStorageService)
  - Multi-agent coordination (mainRouter pattern from templates)
  - Model configuration in pikku.config.json
  - Channel integration for streaming
- **Source files:** `@pikku/core/src/wirings/ai-agent/`, templates/functions/agent.functions.ts, templates/ai-postgres/
- **Scope:** Large

#### 2. AI Agent Service Integrations
- **Page:** `docs/wiring/ai-agents/services.md` (new)
- **Content needed:**
  - @pikku/ai-vercel setup (VercelAIAgentRunner, provider configuration)
  - Provider configuration (Ollama, OpenAI, Anthropic)
  - PgAIStorageService / Redis alternatives
  - AIRunStateService for run history
  - Model configuration in pikku.config.json (models, agentDefaults, agentOverrides)
- **Source files:** packages/services/ai-vercel/, packages/services/pg/, templates/ai-postgres/
- **Scope:** Medium

#### 3. Storage Service Packages Page
- **Page:** `docs/services/storage-backends.md` (new)
- **Content needed:**
  - @pikku/pg — PgChannelStore, PgEventHubStore, PgWorkflowService, PgDeploymentService, PgAIStorageService
  - @pikku/redis — Equivalent Redis implementations
  - @pikku/kysely — Kysely-based alternative
  - Constructor patterns (connection instance vs config object, schema name)
  - init()/close() lifecycle
  - When to use each (PG for persistence, Redis for speed, Kysely for type-safety)
  - Multi-tenancy with schema names / key prefixes
- **Source files:** packages/services/pg/, packages/services/redis/, packages/services/kysely/
- **Scope:** Large

#### 4. Graph Workflows Documentation
- **Page:** `docs/wiring/workflows/graph-workflows.md` (update existing)
- **Content needed:**
  - pikkuWorkflowGraph() API
  - graphStart() wiring
  - Step types: RpcStepMeta, BranchStepMeta, ParallelGroupStepMeta, FanoutStepMeta, SwitchStepMeta, FilterStepMeta, SleepStepMeta, CancelStepMeta, SetStepMeta, InlineStepMeta, ReturnStepMeta
  - Conditions (SimpleCondition, BranchCase)
  - Input sources and output bindings
  - Template strings (TemplateString type)
  - Context variables (ContextVariable, WorkflowContext)
  - Visual representation in Console
- **Source files:** `@pikku/core/src/wirings/workflow/`, templates/functions/graph.wiring.ts
- **Scope:** Large

### High Priority

#### 5. Deployment & Remote RPC Page
- **Page:** `docs/wiring/rpcs/deployment.md` (new)
- **Content needed:**
  - DeploymentService interface (register, heartbeat, discovery)
  - PgDeploymentService / RedisDeploymentService setup
  - rpc.remote() for cross-instance calls
  - rpc.exposed() for calling exposed functions
  - Heartbeat configuration (heartbeatInterval, heartbeatTtl)
  - Multi-instance coordination patterns
  - Configuration in pikku.config.json (rpc section)
- **Source files:** `@pikku/core/services`, packages/services/pg/, templates/remote-rpc-pg/
- **Scope:** Medium

#### 6. Queue Service Factory Pattern
- **Pages:** Update `docs/runtimes/bullmq.md` and `docs/runtimes/pg-boss.md`
- **Content needed:**
  - BullServiceFactory / PgBossServiceFactory lifecycle (constructor, init, close)
  - getQueueService(), getQueueWorkers(), getSchedulerService()
  - registerQueueWorkers() setup pattern
  - Connection configuration (Redis options vs PostgreSQL connection string)
  - Combined queue + scheduler + workflow setup
  - Graceful shutdown pattern
  - SQS as alternative (fire-and-forget via @pikku/aws-services)
- **Source files:** packages/services/queue-bullmq/, packages/services/queue-pg-boss/, packages/services/aws-services/
- **Scope:** Medium

#### 7. Triggers Documentation Enhancement
- **Page:** Update `docs/wiring/triggers/index.md`
- **Content needed:**
  - wireTrigger() full API
  - wireTriggerSource() with setup function and cleanup return
  - PikkuTriggerService / InMemoryTriggerService
  - trigger.invoke() pattern
  - Event source monitoring pattern
  - Trigger + scheduler integration
- **Source files:** `@pikku/core/src/wirings/trigger/`, templates/functions/trigger.functions.ts
- **Scope:** Medium

#### 8. Authentication Middleware Enhancement
- **Pages:** Update `docs/middleware/auth-jwt.md`, `auth-apikey.md`, `auth-cookie.md`
- **Content needed:**
  - Full configuration options for each middleware
  - JoseJWTService constructor (getSecrets callback, logger)
  - Secret rotation support
  - pikkuRemoteAuthMiddleware for cross-service auth
  - Cookie configuration (domain, path, secure)
  - Custom header name support
  - Integration examples with each runtime
- **Source files:** `@pikku/core/src/middleware/`, packages/services/jose/
- **Scope:** Medium

#### 9. AWS Lambda Runtime Enhancement
- **Page:** Update `docs/runtimes/aws-lambda.md`
- **Content needed:**
  - HTTP handler (runFetch) — already partially covered
  - WebSocket handlers (processWebsocketConnect/Disconnect/Message, LambdaEventHubService)
  - SQS queue worker (runSQSQueueWorker, SQSBatchResponse, batch failure handling)
  - Cold start optimization pattern (module-scoped state)
  - Multi-handler single-file pattern
  - Serverless Framework configuration example
- **Source files:** packages/runtimes/aws-lambda/, templates/aws-lambda/, templates/aws-lambda-websocket/
- **Scope:** Medium

#### 10. Cloudflare Runtime Enhancement
- **Page:** Update `docs/runtimes/cloudflare-functions.md`
- **Content needed:**
  - HTTP handler (runFetch) with environment mapping
  - Scheduled handler (runScheduled) with cron matching
  - WebSocket via Durable Objects (CloudflareWebSocketHibernationServer)
  - Durable Object bindings and migrations (wrangler.toml)
  - WebSocket hibernation pattern
  - Environment variable to service mapping
- **Source files:** packages/runtimes/cloudflare/, templates/cloudflare-workers/, templates/cloudflare-websocket/
- **Scope:** Medium

### Medium Priority

#### 11. Workflow Deployment Guide
- **Page:** `docs/wiring/workflows/deployment.md` (new)
- **Content needed:**
  - Combined Express + Queue + Workflow + Scheduler setup
  - createSchedulerRuntimeHandlers() usage
  - Workflow service initialization with setServices()
  - BullMQ vs PG Boss deployment differences
  - Redis vs PostgreSQL workflow state storage
  - Trigger service integration
  - Graceful shutdown for complex setups
- **Source files:** templates/workflows-bullmq/, templates/workflows-pg-boss/
- **Scope:** Medium

#### 12. Schema Service Comparison Page
- **Page:** `docs/api/schema-service.md` (update)
- **Content needed:**
  - AJV vs CFWorker comparison table
  - When to use each (Node.js vs Cloudflare Workers)
  - Configuration differences (coerceTypes, additionalProperties)
  - AjvSchemaService setup with ajv-formats
  - CFWorkerSchemaService for edge environments
- **Source files:** packages/services/schema-ajv/, packages/services/schema-cfworker/
- **Scope:** Small

#### 13. AWS Services Package Page
- **Page:** `docs/services/aws-services.md` (new)
- **Content needed:**
  - S3Content (upload, download, delete, signURL, getPublicUrl)
  - S3ContentConfig (bucketName, region, endpoint)
  - AWSSecrets (getSecret, getSecretJSON, hasSecret)
  - SQSQueueService (publish, delay limits, fire-and-forget)
  - SQSQueueServiceConfig (region, queueUrlPrefix, endpoint)
- **Source files:** packages/services/aws-services/
- **Scope:** Small

#### 14. CLI Wiring Enhancement
- **Pages:** Update `docs/wiring/cli/index.md`, `local-cli.mdx`, `remote-cli.md`
- **Content needed:**
  - wireCLI() full API with program definition
  - pikkuCLICommand() options (description, positionals, options, render)
  - Custom CLI render functions
  - parseCLIArguments() utility
  - executeCLI() vs executeCLIViaChannel()
  - Option types (short, default, choices, array, required)
- **Source files:** `@pikku/core/src/wirings/cli/`, templates/functions/cli.wiring.ts
- **Scope:** Medium

#### 15. Pino Logger Page
- **Page:** `docs/services/pino.md` (new) or update `docs/api/logger.md`
- **Content needed:**
  - PinoLogger setup
  - setLevel() configuration
  - Access to underlying Pino instance
  - When to use vs ConsoleLogger
- **Source files:** packages/services/pino/
- **Scope:** Small

#### 16. SSE (Server-Sent Events) Enhancement
- **Page:** Update `docs/wiring/http/server-sent-events.md`
- **Content needed:**
  - wireHTTP with `sse: true` option
  - Channel API for periodic sends
  - Auto-close patterns
  - Client-side EventSource usage
- **Source files:** templates/functions/sse.functions.ts, templates/functions/sse.wiring.ts
- **Scope:** Small

### Low Priority

#### 17. OpenAPI Generation Completion
- **Page:** Update `docs/wiring/http/openapi.md`
- **Content:** Complete the "work in progress" page with current capabilities
- **Scope:** Small

#### 18. Framework Comparison Pages
- **Page:** `docs/comparison/index.md` (update stub)
- **Content:** Replace TODO with actual comparison methodology
- **Scope:** Small

#### 19. Console Features Deep-Dive
- **Page:** Update `docs/console/features.md`
- **Content:** Detailed feature walkthrough including workflow visualization, agent playground, function browser
- **Scope:** Medium

#### 20. Node Metadata Documentation
- **Page:** `docs/advanced/node-metadata.md` (new)
- **Content:** CoreNodeConfig, NodeType, NodesMeta for visual graph representation
- **Scope:** Small

#### 21. OAuth2 Dedicated Page
- **Page:** `docs/services/oauth2.md` (new)
- **Content:** OAuth2Client, wireOAuth2Credential, token refresh, credential management
- **Scope:** Small

#### 22. Versioning & Contract Checking
- **Page:** `docs/advanced/versioning.md` (new)
- **Content:** versions-check CLI command, VersionManifest, contract hashes, breaking change detection
- **Scope:** Small

---

## Recommended Documentation Structure Changes

### 1. Add "Services" Top-Level Section
Currently service integrations are scattered between `api/` and `runtimes/`. Create a dedicated section:
```
docs/services/
├── index.md              — Overview of service architecture
├── storage-backends.md   — @pikku/pg, @pikku/redis, @pikku/kysely
├── queue-providers.md    — @pikku/queue-bullmq, @pikku/queue-pg-boss, SQS
├── schema-validation.md  — @pikku/schema-ajv, @pikku/schema-cfworker
├── logging.md            — ConsoleLogger, @pikku/pino
├── jwt.md                — @pikku/jose
├── aws-services.md       — @pikku/aws-services (S3, Secrets, SQS)
├── ai-runner.md          — @pikku/ai-vercel
└── oauth2.md             — OAuth2Client, credential management
```

### 2. Add "AI Agents" Section Under Wiring
```
docs/wiring/ai-agents/
├── index.md              — Overview, first AI agent
├── tools.md              — Tool definition and integration
├── memory.md             — Conversation memory, working memory
├── streaming.md          — streamAIAgent, channel integration
├── approval.md           — Tool approval flows
├── multi-agent.md        — Multi-agent coordination
└── services.md           — AI runner and storage setup
```

### 3. Expand Workflows Section
```
docs/wiring/workflows/
├── index.md              — Overview (existing)
├── getting-started.md    — Setup (existing)
├── dsl-workflows.md      — DSL workflow (do/sleep/suspend steps)
├── graph-workflows.md    — Graph workflow (visual, all step types)
├── configuration.md      — Config (existing)
├── deployment.md         — Queue + scheduler setup (new)
└── steps.md              — Step reference (existing, needs expansion)
```

### 4. Consolidate Runtime Pages
Consider splitting each runtime page into clear subsections:
- Installation & setup
- HTTP handler
- WebSocket handler (if applicable)
- Queue handler (if applicable)
- Scheduler handler (if applicable)
- Configuration reference
- Example deployment

### 5. Rename `api/` to be More Descriptive
The current `api/` section mixes service interfaces with usage guides. Consider renaming to `service-interfaces/` or merging into the proposed `services/` section.

---

## Appendix: Inspector Error Code Coverage

The docs currently document these error codes in `docs/pikku-cli/errors/`:

| Documented | Undocumented (from inspector) |
|---|---|
| PKU111, PKU123, PKU124, PKU220, PKU236, PKU247 | PKU145, PKU146 (model config) |
| PKU300, PKU370, PKU384, PKU400, PKU410, PKU411 | PKU489 (inline schema) |
| PKU426, PKU427, PKU431, PKU456, PKU488 | PKU529 (dynamic step name) |
| PKU559, PKU568, PKU571, PKU572 | PKU600 (workflow orchestrator not configured) |
| PKU672, PKU685, PKU715, PKU736, PKU787 | PKU641 (invalid DSL workflow) |
| PKU835, PKU836, PKU937, PKU975 | PKU850 (duplicate function version) |
| | PKU860-PKU865 (contract versioning errors) |
| | PKU901 (workflow multi-queue not supported) |

Approximately 12 new error codes need documentation pages.
