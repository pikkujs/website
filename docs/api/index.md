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
| `logger` | [`Logger`](./logger.md) | Required |
| `variables` | [`VariablesService`](./variables-service.md) | Required |
| `secrets` | [`SecretService`](./secret-service.md) | Required |
| `schema` | [`SchemaService`](./schema-service.md) | No input/output validation |
| `jwt` | [`JWTService`](./jwt-service.md) | No JWT signing or verification |
| `content` | [`ContentService`](./content-service.md) | No file upload or signed URLs |
| `emailService` | [`EmailService`](./email-service.md) | No outbound email |
| `credentialService` | [`CredentialService`](./credential-service.md) | No per-user credentials or OAuth2 |
| `sessionStore` | [`SessionStore`](./session-store.md) | No server-side session persistence |
| `scopeService` | [`ScopeService`](./scope-service.md) | No scope resolution when building a session |
| `audit` | [`AuditService`](./audit-service.md) | Audit events are dropped |
| `auditLog` | `AuditLog` | The request-scoped buffer that writes into `audit` — see below |
| `queueService` | [`QueueService`](./queue-service.md) | No queue workers |
| `schedulerService` | [`SchedulerService`](./scheduler-service.md) | No cron or delayed RPCs |
| `eventHub` | [`EventHubService`](./event-hub.md) | No cross-process channel broadcast |
| `webhookService` | [`WebhookService`](./webhook-service.md) | No outgoing webhook delivery |
| `deploymentService` | [`DeploymentService`](./deployment-service.md) | No deploy introspection |
| `metaService` | [`MetaService`](./meta-service.md) | Nothing can read the generated `.pikku` metadata at runtime |
| `workflowService` | [`WorkflowService`](./workflow-service.md) | No workflows |
| `workflowRunService` | `WorkflowRunService` | Read-only workflow queries — see below |
| `agentRunner` | [`AgentRunnerService`](./ai-services.md) | No agents |
| `agentStorage` | [`AgentStorageService`](./ai-services.md) | No conversation persistence |
| `agentRunState` | [`AgentRunStateService`](./ai-services.md) | No run state or tool approvals |
| `agentRunService` | [`AgentRunService`](./ai-services.md) | No agent views in the Console |
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

Read-only queries over workflow runs, powering the Console's workflow views:
`listRuns(options?)` (filterable by `workflowName` / `status`, with
`limit`/`offset`), `getRun(id)`, `getRunSteps(runId)`, `getRunHistory(runId)`,
`getDistinctWorkflowNames()`, `getWorkflowVersion(name, graphHash)` and
`deleteRun(id)`. It never executes anything — that is
[`WorkflowService`](./workflow-service.md).

### `auditLog` — `AuditLog`

The request-scoped buffer that writes into `audit`, the durable sink. Exposes
`readonly config`, `write(event)`, `flush()` and `close()`. It is returned as a
wire service so the function runner flushes it via `close()` when the invocation
ends. Like [`Logger`](./logger.md), `write` is `Safe<>`-guarded: an unrevealed
`SecretValue` in an event fails the build rather than serializing as `[secret]`
by accident.

### `virtualUserRunStore` / `VirtualUserScheduleStore`

A virtual-user run is dispatched and answered for later, so the run store is the
only trace it leaves: `start(run)`, `complete(runId, outcome)`,
`fail(runId, error)`, `get(runId)`, `list(options?)` (newest first) and a
separate call for one run's turns — separate because a run at a 500-step budget
carries more transcript than every other column put together, and `list` would
pay for it on every row.

The schedule store is each persona's cadence, for apps that want their virtual
users to keep going without being asked: `set(schedule)`, `get(persona)`,
`list()`, `due(now)` and a call that pushes the next run out. That last one runs
*before* the run is dispatched, so a tick that dies halfway does not leave a row
due for the next tick to re-dispatch. The cost is that a dispatch which throws
waits a full interval instead of retrying — the right way round, since a persona
failing to start should not be retried every minute for a week.

The two are separate on purpose: wiring nothing is how an app says it only wants
the runs it starts itself.

### `coverageService` — `CoverageService`

The V8 precise-coverage collector behind `pikku dev --coverage`. Development
only; nothing in a deployed app looks for it.

## Services that are not on this list

[`TriggerService`](./trigger-service.md), [`GatewayService`](./gateway-service.md)
and [`SessionService`](./user-session-service.md) have pages here because they are
contracts you implement, but they are not `CoreSingletonServices` keys. You
register them like any other service of your own and reach them by whatever name
you gave them.
