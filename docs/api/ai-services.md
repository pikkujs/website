---
title: AI Services
ai: true
---

Four singleton services power [AI Agents](/docs/wiring/ai-agents): a runner that talks to the model, two persistence services for conversation and run state, and a read-only query service used by the [Console](/docs/console).

| Service key | Interface | Responsibility |
|-------------|-----------|----------------|
| `aiAgentRunner` | `AIAgentRunnerService` | Model calls and the tool loop |
| `aiStorage` | `AIStorageService` | Threads, messages, working memory |
| `aiRunState` | `AIRunStateService` | Run lifecycle and tool-approval persistence |
| `agentRunService` | `AgentRunService` | Read-only run/thread queries |

## AIAgentRunnerService

Executes model calls: streaming and non-streaming agent steps, plus optional modality methods.

```typescript reference title="ai-agent-runner-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/ai-agent-runner-service.ts
```

### `run(params: AIAgentRunnerParams): Promise<AIAgentStepResult>`

Executes one agent step — a model call with the current messages and tool definitions.

- **Parameters:**
  - `params`: `{ model, instructions, messages, tools, maxSteps, toolChoice, temperature?, outputSchema?, agentId? }`
- **Returns:** Promise resolving to `{ text, object?, toolCalls, toolResults, usage, finishReason }`

### `stream(params: AIAgentRunnerParams, channel: AIStreamChannel): Promise<AIAgentStepResult>`

Same as `run`, but streams tokens and tool events to the given channel as they arrive.

### Optional modality methods

Implementations can additionally expose `transcribe` (speech-to-text), `generateSpeech`, `generateImage`, `embed` / `embedMany`, and `rerank`. Each takes a `model` plus modality-specific parameters.

### VercelAIAgentRunner

The official implementation, built on the [Vercel AI SDK](https://sdk.vercel.ai). Model strings are `provider/model` (e.g. `openai/gpt-4o`) resolved against the providers you pass in.

```bash npm2yarn
npm install @pikku/ai-vercel
```

```typescript
import { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

const aiAgentRunner = new VercelAIAgentRunner({
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  anthropic: createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }),
})
```

## AIStorageService

Persists conversation threads, messages, and working memory (scoped per thread or per resource).

```typescript reference title="ai-storage-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/ai-storage-service.ts
```

| Method | Description |
|--------|-------------|
| `createThread(resourceId, options?)` | Create a thread (`threadId`, `title`, `metadata` optional) |
| `getThread(threadId)` / `getThreads(resourceId)` | Fetch one thread or all for a resource |
| `deleteThread(threadId)` | Delete a thread and its messages |
| `getMessages(threadId, options?)` | Fetch messages (`lastN`, `cursor` pagination) |
| `saveMessages(threadId, messages)` | Persist messages |
| `getWorkingMemory(id, scope)` / `saveWorkingMemory(id, scope, data)` | Read/write working memory, `scope` is `'resource'` or `'thread'` |

## AIRunStateService

Tracks agent run lifecycle and pending tool approvals (used for human-in-the-loop tools).

```typescript reference title="ai-run-state-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/ai-run-state-service.ts
```

| Method | Description |
|--------|-------------|
| `createRun(run)` / `updateRun(runId, updates)` / `getRun(runId)` | Run lifecycle |
| `getRunsByThread(threadId)` | List runs for a thread |
| `findRunByToolCallId(toolCallId)` | Find a suspended run and its pending approval |
| `resolveApproval(toolCallId, status)` | Approve or deny a pending tool call |

`InMemoryAIRunStateService` is built into `@pikku/core/services` for development.

## AgentRunService

Read-only queries over agent runs and threads — powers the Console's agent views.

| Method | Description |
|--------|-------------|
| `listThreads(options?)` | List threads, filterable by `agentName` / `resourceId`, with `limit`/`offset` |
| `getThread(threadId)` / `getThreadMessages(threadId)` / `getThreadRuns(threadId)` | Thread details |
| `deleteThread(threadId)` | Delete with cascade |
| `getDistinctAgentNames()` | All agent names that have runs |

## Persistence backends

The storage docs cover concrete implementations for each database — [PostgreSQL](/docs/storage/postgresql), [Kysely (MySQL/SQLite)](/docs/storage/kysely), [Redis](/docs/storage/redis), and [MongoDB](/docs/storage/mongodb). The Kysely-based `AIStorageService` implementations also implement `AIRunStateService`, so one instance serves both keys.

## Registration

```typescript
import { PgKyselyAIStorageService, PgKyselyAgentRunService } from '@pikku/kysely-postgres'
import { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { createOpenAI } from '@ai-sdk/openai'

const aiStorage = new PgKyselyAIStorageService(pikkuKysely.kysely)
await aiStorage.init()

const singletonServices = await createSingletonServices(config, {
  aiStorage,
  aiRunState: aiStorage, // same instance implements both
  agentRunService: new PgKyselyAgentRunService(pikkuKysely.kysely),
  aiAgentRunner: new VercelAIAgentRunner({
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  }),
})
```
