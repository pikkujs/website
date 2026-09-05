---
title: AI Services
ai: true
---

Four singleton services power [AI Agents](/docs/wiring/ai-agents): a runner that talks to the model, two persistence services for conversation and run state, and a read-only query service used by the [Console](/docs/console).

| Service key | Interface | Responsibility |
|-------------|-----------|----------------|
| `agentRunner` | `AgentRunnerService` | Model calls and the tool loop |
| `agentStorage` | `AgentStorageService` | Threads, messages, working memory |
| `agentRunState` | `AgentRunStateService` | Run lifecycle and tool-approval persistence |
| `agentRunService` | `AgentRunService` | Read-only run/thread queries |

## AgentRunnerService

Executes model calls: streaming and non-streaming agent steps, plus optional modality methods.

```typescript reference title="agent-runner-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/agent-runner-service.ts
```

### `run(params: AgentRunnerParams): Promise<AgentStepResult>`

Executes one agent step — a model call with the current messages and tool definitions.

- **Parameters:**
  - `params`: `{ model, instructions, messages, tools, maxSteps, toolChoice, temperature?, outputSchema?, agentId? }`
- **Returns:** Promise resolving to `{ text, object?, toolCalls, toolResults, usage, finishReason }`

### `stream(params: AgentRunnerParams, channel: AgentStreamChannel): Promise<AgentStepResult>`

Same as `run`, but streams tokens and tool events to the given channel as they arrive.

### Optional modality methods

Implementations can additionally expose `transcribe` (speech-to-text), `generateSpeech`, `generateImage`, `embed` / `embedMany`, and `rerank`. Each takes a `model` plus modality-specific parameters.

The voice middlewares in [AI Agents](/docs/wiring/ai-agents) read `transcribe` and `generateSpeech` off the runner rather than taking services of their own, so a runner without them makes them no-ops. `@pikku/ai-deepinfra` supplies DeepInfra speech and transcription models you can hand to the Vercel AI SDK runner for exactly that.

### `withApiKey?(apiKey): AgentRunnerService`

Optional. Returns a new runner that uses the given API key for every model call — the hook for per-tenant or per-user billing. Runners that don't support per-key scoping leave it undefined, so check before calling.

### VercelAgentRunner

The official implementation, built on the [Vercel AI SDK](https://sdk.vercel.ai). Model strings are `provider/model` (e.g. `openai/gpt-4o`) resolved against the providers you pass in.

```bash npm2yarn
npm install @pikku/ai-vercel
```

```typescript
import { VercelAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

const agentRunner = new VercelAgentRunner({
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  anthropic: createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }),
})
```

## AgentStorageService

Persists conversation threads, messages, and working memory (scoped per thread or per resource).

```typescript reference title="agent-storage-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/agent-storage-service.ts
```

| Method | Description |
|--------|-------------|
| `createThread(resourceId, options?)` | Create a thread (`threadId`, `title`, `metadata` optional) |
| `getThread(threadId)` / `getThreads(resourceId)` | Fetch one thread or all for a resource |
| `deleteThread(threadId)` | Delete a thread and its messages |
| `getMessages(threadId, options?)` | Fetch messages (`lastN`, `cursor` pagination) |
| `saveMessages(threadId, messages)` | Persist messages |
| `getWorkingMemory(id, scope)` / `saveWorkingMemory(id, scope, data)` | Read/write working memory, `scope` is `'resource'` or `'thread'` |

## AgentRunStateService

Tracks agent run lifecycle and pending tool approvals (used for human-in-the-loop tools).

```typescript reference title="agent-run-state-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/agent-run-state-service.ts
```

| Method | Description |
|--------|-------------|
| `createRun(run)` / `updateRun(runId, updates)` / `getRun(runId)` | Run lifecycle |
| `getRunsByThread(threadId)` | List runs for a thread |
| `findRunByToolCallId(toolCallId)` | Find a suspended run and its pending approval |
| `resolveApproval(toolCallId, status)` | Approve or deny a pending tool call |
| `saveScore(score)` | Record one scorer's grade of a finished run |
| `getScores(runId)` | Every grade recorded against a run |

A run accumulates one row per scorer, and a scorer may grade the same run more than once — a retried job appends rather than replaces, so a re-grade never silently overwrites the grade that was acted on.

`InMemoryAgentRunStateService` is built into `@pikku/core/services` for development.

## AgentRunService

Read-only queries over agent runs and threads — powers the Console's agent views.

| Method | Description |
|--------|-------------|
| `listThreads(options?)` | List threads, filterable by `agentName` / `resourceId` / `owners`, with `limit`/`offset` |
| `getThread(threadId)` / `getThreadMessages(threadId)` / `getThreadRuns(threadId)` | Thread details |
| `deleteThread(threadId)` | Delete with cascade |
| `getDistinctAgentNames()` | All agent names that have runs |

:::caution `owners` is an authorization constraint, not a filter
`resourceId` is an optional exact match — leave it off and you get everything.
`owners` is the opposite: it restricts results to threads owned by one of the
given session principals, and an **empty array matches nothing**. A thread
matches when its `resourceId` is the principal itself or one of its
`principal:` sub-partitions. Anything exposing threads over the wire must
derive `owners` from the session, never from input.
:::

## Persistence backends

The storage docs cover concrete implementations for each database — [PostgreSQL](/docs/storage/postgresql), [Kysely (MySQL/SQLite)](/docs/storage/kysely), [Redis](/docs/storage/redis), and [MongoDB](/docs/storage/mongodb). The Kysely-based `AgentStorageService` implementations also implement `AgentRunStateService`, so one instance serves both keys.

## Registration

```typescript
import { PgKyselyAgentStorageService, PgKyselyAgentRunService } from '@pikku/kysely-postgres'
import { VercelAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'

const agentStorage = new PgKyselyAgentStorageService(pikkuKysely.kysely)
await agentStorage.init()

const singletonServices = await createSingletonServices(config, {
  agentStorage,
  agentRunState: agentStorage, // same instance implements both
  agentRunService: new PgKyselyAgentRunService(pikkuKysely.kysely),
  agentRunner: new VercelAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```
