---
title: Service Interfaces
description: Every service Pikku looks up by name, what it is for, and what happens when you leave it out
sidebar_position: 0
---

# Service Interfaces

Most services in a Pikku app are yours: you return them from `pikkuServices`, you
name them, and they show up in every function under that name. Pikku neither
knows nor cares what they are.

A smaller set is different. `CoreSingletonServices` declares a fixed list of keys
the runtime itself looks up — `logger`, `queueService`, `sessionStore` and so on.
Register one under its key and the feature that needs it works; leave it out and
that feature is unavailable, usually with a clear error rather than a crash. The
pages in this section document the contract behind each key, so you can bring
your own implementation instead of the one that ships.

## The registry

Four are required. Everything else is optional, and the last column says what you
give up by leaving it out.

| Key | Interface | Without it |
|-----|-----------|------------|
| `config` | your `CoreConfig` | Required |
| `logger` | [`Logger`](/docs/api/logger) | Required |
| `variables` | [`VariablesService`](/docs/api/variables-service) | Required |
| `secrets` | [`SecretService`](/docs/api/secret-service) | Required |
| `schema` | [`SchemaService`](/docs/api/schema-service) | No input/output validation |
| `jwt` | [`JWTService`](/docs/api/jwt-service) | No JWT signing or verification |
| `content` | [`ContentService`](/docs/api/content-service) | No file upload or signed URLs |
| `emailService` | [`EmailService`](/docs/api/email-service) | No outbound email |
| `credentialService` | [`CredentialService`](/docs/api/credential-service) | No per-user credentials or OAuth2 |
| `sessionStore` | [`SessionStore`](/docs/api/session-store) | No server-side session persistence |
| `scopeService` | [`ScopeService`](/docs/api/scope-service) | No scope resolution when building a session |
| `featureFlags` | `FeatureFlagSource` | Declared feature flags resolve as open |
| `audit` | [`AuditService`](/docs/api/audit-service) | Audit events are dropped |
| `auditLog` | `AuditLog` | The request-scoped buffer that writes into `audit` — see below |
| `analyticsService` | `AnalyticsService` | Analytics events are logged instead of stored |
| `analyticsIdentity` | `AnalyticsIdentityResolver` | Analytics events carry only what the session holds |
| `analytics` | `AnalyticsLog` | The request-scoped buffer that writes into `analyticsService` — see below |
| `queueService` | [`QueueService`](/docs/api/queue-service) | No queue workers |
| `schedulerService` | [`SchedulerService`](/docs/api/scheduler-service) | No cron or delayed RPCs |
| `eventHub` | [`EventHubService`](/docs/api/event-hub) | No cross-process channel broadcast |
| `webhookService` | [`WebhookService`](/docs/api/webhook-service) | No outgoing webhook delivery |
| `deploymentService` | [`DeploymentService`](/docs/api/deployment-service) | No deploy introspection |
| `metaService` | [`MetaService`](/docs/api/meta-service) | Nothing can read the generated `.pikku` metadata at runtime |
| `workflowService` | [`WorkflowService`](/docs/api/workflow-service) | No workflows |
| `workflowRunService` | `WorkflowRunService` | Read-only workflow queries — see below |
| `agentRunner` | [`AgentRunnerService`](/docs/api/ai-services) | No agents |
| `agentStorage` | [`AgentStorageService`](/docs/api/ai-services) | No conversation persistence |
| `agentRunState` | [`AgentRunStateService`](/docs/api/ai-services) | No run state or tool approvals |
| `agentRunService` | [`AgentRunService`](/docs/api/ai-services) | No agent run queries |
| `aiEmbedding` | `AIEmbeddingService` | No embeddings — see below |
| `virtualUserRunStore` | `VirtualUserRunStore` | Virtual-user runs leave no trace — see below |
| `virtualUserScheduleStore` | `VirtualUserScheduleStore` | Virtual users run only when asked — see below |
| `coverageService` | `CoverageService` | No `pikku dev --coverage` |
| `auth` | `() => Promise<AuthInstance>` | No auth. Built by the factory an auth package registers and injected by the generated `pikkuServices` wrapper — a service factory must never return it itself |

## The keys without their own page

These are small enough, or narrow enough, that the interface is the whole story.

### `aiEmbedding` — `AIEmbeddingService`

`readonly model: string`, `readonly dimensions?: number`, plus two methods:
`embedDocuments(values: string[])` at index time, which preserves input order,
and `embedQuery(value: string)` at query time. The split is deliberate — several
embedding models encode a document and a query differently, and the model is
pinned per service rather than passed per call so an index cannot end up holding
vectors from two models.

### `workflowRunService` — `WorkflowRunService`

Read-only queries over workflow runs, powering workflow run views:
`listRuns(options?)` (filterable by `workflowName` / `status`, with
`limit`/`offset`), `getRun(id)`, `getRunSteps(runId)`, `getRunHistory(runId)`,
`getDistinctWorkflowNames()`, `getWorkflowVersion(name, graphHash)` and
`deleteRun(id)`. It never executes anything — that is
[`WorkflowService`](/docs/api/workflow-service).

### `auditLog` — `AuditLog`

The request-scoped buffer that writes into `audit`, the durable sink. Exposes
`readonly config`, `write(event)`, `flush()` and `close()`. It is returned as a
wire service so the function runner flushes it via `close()` when the invocation
ends. Like [`Logger`](/docs/api/logger), `write` is `Safe<>`-guarded: an unrevealed
`SecretValue` in an event fails the build rather than serializing as `[secret]`
by accident.

### `analytics` — `AnalyticsLog`

The request-scoped buffer that writes into `analyticsService`, installed by the
function runner for every invocation whether or not a sink is registered.
Exposes `record(event, client?)`, `flush()` and `close()`. When
`analyticsService` is unset the runner falls back to a logger-backed sink, so a
validated event with nowhere to go is still visible at `debug` rather than
silently dropped. `analyticsIdentity` is the optional resolver for the
browser-originated half of an event's identity (`vendorIds`, `consent`,
`anonymousId`); without it a sink sees only what the session carries.

### `virtualUserRunStore` / `VirtualUserScheduleStore`

A virtual-user run is dispatched and answered for later, so the run store is the
only trace it leaves: `start(run)`, `complete(runId, outcome)`,
`fail(runId, error)`, `get(runId)`, `list(options?)` (newest first) and
`steps(runId, options?)` for one run's turns — separate because a run at a
500-step budget carries more transcript than every other column put together,
and `list` would pay for it on every row.

The schedule store is each persona's cadence, for apps that want their virtual
users to keep going without being asked: `set(schedule)`, `get(persona)`,
`list()`, `due(now)`, `claim(persona, …)` — which pushes the next run out — and
`remove(persona)`. The claim runs *before* the run is dispatched, so a tick that
dies halfway does not leave a row due for the next tick to re-dispatch. The cost
is that a dispatch which throws waits a full interval instead of retrying — the
right way round, since a persona failing to start should not be retried every
minute for a week.

The two are separate on purpose: wiring nothing is how an app says it only wants
the runs it starts itself.

### `coverageService` — `CoverageService`

The V8 precise-coverage collector behind `pikku dev --coverage`. Development
only; nothing in a deployed app looks for it.

## Services that are not on this list

[`TriggerService`](/docs/api/trigger-service), [`GatewayService`](/docs/api/gateway-service)
and [`SessionService`](/docs/api/user-session-service) have pages here because they are
contracts you implement, but they are not `CoreSingletonServices` keys. You
register them like any other service of your own and reach them by whatever name
you gave them.
