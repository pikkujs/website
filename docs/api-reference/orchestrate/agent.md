---
title: '#pikku/agent'
sidebar_label: '#pikku/agent'
sidebar_position: 1
description: 'Defines an AI agent, the tools it may call and the scorers that judge what it did.'
---

# `#pikku/agent`

Defines an AI agent, the tools it may call and the scorers that judge what it did.

```typescript
import { agent, agentApprove, agentResume } from '#pikku/agent'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`agent`](#agent) | function | A ready-made function that runs the named agent once and returns its result — wire it straight to a route when you need no logic around the run. |
| [`agentApprove`](#agentapprove) | function | A ready-made function that answers every pending approval for a run at once. |
| [`agentResume`](#agentresume) | function | A ready-made function that answers one pending tool approval, letting a run that paused for a human carry on. |
| [`agentStream`](#agentstream) | function | The streaming counterpart of `agent`: wire it to a channel to send tokens and tool calls as they happen instead of waiting for the run to finish. |
| [`pikkuAgent`](#pikkuagent) | function | Declares an agent: the model, the prompt, the tools it may call and the shape of what it returns. Wire it like any other function. |
| [`pikkuAgentJudge`](#pikkuagentjudge) | function | Declares a scorer that grades an agent run with another model, for the qualities a programmatic check cannot express. |
| [`pikkuAgentScorer`](#pikkuagentscorer) | function | Declares a scorer that grades an agent run programmatically — a function over the run's input and output returning a score. |

## Reference

### `agent` {#agent}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A ready-made function that runs the named agent once and returns its result —
wire it straight to a route when you need no logic around the run.

```typescript
agent: <Name extends keyof AgentMap>(agentName: Name) => PikkuFunctionConfig<AgentInput, { runId: string; result: AgentMap[Name]["output"]; usage: { inputTokens: number; outputTokens: number; }; }, "session" | "rpc">
```

```typescript
// Wire the agent as a standard HTTP endpoint — non-streaming, returns the full response.
wireHTTP({
  method: 'post',
  route: '/agents/shop',
  func: agent('shopAssistant'),
  auth: true,
})
```

### `agentApprove` {#agentapprove}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A ready-made function that answers every pending approval for a run at once.

```typescript
agentApprove: <Name extends keyof AgentMap>(agentName: Name) => PikkuFunctionConfig<{ runId: string; approvals: { toolCallId: string; approved: boolean; }[]; }, unknown, "session" | "rpc">
```

```typescript
// The ops agent can cancel an order, so its tool calls wait for a human. These
// two routes are the human's side of that pause.
wireHTTP({
  method: 'post',
  route: '/agents/ops/approve',
  func: agentApprove('opsAgent'),
  auth: true,
})

wireHTTP({
  method: 'post',
  route: '/agents/ops/resume',
  func: agentResume(),
  auth: true,
})
```

### `agentResume` {#agentresume}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A ready-made function that answers one pending tool approval, letting a run
that paused for a human carry on.

```typescript
agentResume: () => PikkuFunctionConfig<{ runId: string; toolCallId: string; approved: boolean; }, void, "session" | "rpc">
```

```typescript
// The ops agent can cancel an order, so its tool calls wait for a human. These
// two routes are the human's side of that pause.
wireHTTP({
  method: 'post',
  route: '/agents/ops/approve',
  func: agentApprove('opsAgent'),
  auth: true,
})

wireHTTP({
  method: 'post',
  route: '/agents/ops/resume',
  func: agentResume(),
  auth: true,
})
```

### `agentStream` {#agentstream}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

The streaming counterpart of `agent`: wire it to a channel to send tokens and
tool calls as they happen instead of waiting for the run to finish.

```typescript
agentStream: <Name extends keyof AgentMap>(agentName?: Name) => PikkuFunctionConfig<{ agentName?: string; message: string; threadId: string; resourceId: string; }, void, "session" | "rpc">
```

```typescript
// Streaming endpoint — sends text-delta, tool-call, and usage events as they arrive.
wireHTTP({
  method: 'post',
  route: '/agents/shop/stream',
  func: agentStream('shopAssistant'),
  auth: true,
})
```

### `pikkuAgent` {#pikkuagent}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares an agent: the model, the prompt, the tools it may call and the shape
of what it returns. Wire it like any other function.

```typescript
pikkuAgent: <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(agent: AgentConfig<InputSchema, OutputSchema>) => AgentConfig<InputSchema, OutputSchema>
```

<details>
<summary>Config keys (23)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `agentMiddleware` | `PikkuAgentMiddlewareHooks<any, any>[]` | Hooks around each step and each tool call — the place to inspect, rewrite or veto what the model is about to do. |
| `agentMode` | `"delegate" \| "supervise"` | `delegate` hands a sub-agent the task and takes its answer; `supervise` keeps this agent in the loop over each step. |
| `auth` | `boolean` | Whether a session is required to run this agent. Defaults to `false`, since agents are commonly invoked from an already-authenticated `pikkuFunc` or from genuinely sessionless contexts (crons, queue workers). Set `true` to require a session at the agent itself. `scopes` and `permissions` are enforced either way. |
| `channelMiddleware` | `CorePikkuChannelMiddleware<any, any>[]` | Wraps each message when the agent is driven over a channel. |
| `description` <sup>required</sup> | `string` | What the agent is for. Another agent choosing whether to delegate to this one reads it, so write it for that reader. |
| `errors` | `string[]` | Names of error classes this may throw, so each one's registered status is used instead of a 500. |
| `goal` <sup>required</sup> | `string` | What it is for — the only one of the three that is required. |
| `maxSteps` | `number` | How many model turns a single run may take before it is stopped. The guard against a tool loop that never converges. |
| `middleware` | `PikkuMiddleware[]` | Wraps the whole run: auth, tracing, spend limits. |
| `model` <sup>required</sup> | `string` | Which model to run on, as the provider names it. |
| `name` <sup>required</sup> | `string` | Unique across the project. It is how the agent is invoked and how its runs are grouped. |
| `permissions` | `CorePermissionGroup<PikkuPermission>` | Checks that run before the agent starts. Grouped names OR together, so any one passing admits the caller. |
| `personality` | `string` | How it should sound: tone, vocabulary, how much it says at a time. |
| `prepareStep` | `((ctx: { stepNumber: number; messages: AgentMessage[]; tools: AgentToolDef[]; toolChoice:…` | Runs before each model turn, to change what that turn sees or to stop the run. This is where a step budget or a tool narrowing goes. |
| `providerOptions` | `AIProviderOptions` | Per-provider settings passed through untouched, for what only one vendor offers. |
| `role` | `string` | Who the agent is. Joined with `personality` and `goal`, in that order, to form the system prompt. |
| `scopes` | `import("#pikku/scopes/pikku-scopes.gen.js").ScopeId[]` | Scopes the session must hold to run this agent. All of them are required (AND), and they are checked before `permissions` — unlike permissions, which OR together, a scope can only narrow access. Narrowed to the generated `ScopeId` union in a project's own `#pikku/scopes`, so an undeclared scope is a compile error. |
| `scorers` | `never[]` | Grades finished runs on live traffic. A reference-based judge is never sampled here — live traffic has no answer key. |
| `sessionScope` | `"user" \| "org"` | Ownership/partitioning of this agent's threads and runs. Defaults to `'user'`. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this agent in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `temperature` | `number` | How much the model is allowed to vary its answer. Lower is more repeatable, which is what a tool-driving agent usually wants. |
| `toolChoice` | `"auto" \| "required" \| "none"` | Whether the model may answer without calling a tool (`auto`), must call one (`required`), or may not (`none`). |

</details>

```typescript
export const shopAssistant = pikkuAgent({
  name: 'shop-assistant',
  description: 'Helps customers browse the catalogue and manage their basket.',
  goal: 'Help users find products, manage their basket, and answer questions about shop items.',
  model: 'openai/gpt-4o-mini',
  tools: [
    listCategories,
    listItems,
    getItem,
    getBasket,
    addToBasket,
    removeFromBasket,
  ],
  memory: { storage: 'aiStorage', lastMessages: 20 },
  maxSteps: 10,
  channelMiddleware: [traceAgentStream],
  agentMiddleware: [countAgentCharacters],
})
```

### `pikkuAgentJudge` {#pikkuagentjudge}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a scorer that grades an agent run with another model, for the
qualities a programmatic check cannot express.

```typescript
pikkuAgentJudge: (config: Parameters<typeof corePikkuAgentJudge<Services>>[0]) => PikkuAgentScorer<Services>
```

<details>
<summary>Config keys (8)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` <sup>required</sup> | `string` | What this judge grades, in one line, for whoever reads the score later. |
| `goal` <sup>required</sup> | `string` | The rubric: what a good answer looks like, phrased as the goal it should meet. |
| `model` <sup>required</sup> | `string` | The model that grades, e.g. `'claude-sonnet-4-5'`. Not the model under test. |
| `name` <sup>required</sup> | `string` | Identifies the judge in results and in the Console. Unique per project. |
| `prompt` | `((input: ScorerInput) => string)` | Replaces the generated rubric prompt outright, for framing `goal` cannot express. The `&#123; score, reason &#125;` response is still forced. |
| `requiresReference` | `boolean` | Grades against a known-correct answer. Such a judge is test-only — live traffic has no answer key, so the runtime never samples it. |
| `sampleRate` | `number` | 0..1 fraction of live runs to grade. Defaults to all of them. |
| `toolCalls` | `"off" \| "names" \| "full"` | How much of the run's trajectory to disclose to the judge. Defaults to `names`: enough to tell a tool-backed answer from an invented one, without sending a third-party model the rows the tools returned. |

</details>

```typescript
export const answersTheShopper = pikkuAgentJudge({
  name: 'answersTheShopper',
  description: 'Does the answer help someone trying to buy something',
  model: 'openai/o4-mini',
  goal: [
    'Grade how well the answer addresses what the shopper asked.',
    'Score 1 when it names the item, price or availability they asked about.',
    'Score 0 when it talks about the catalogue in general instead.',
  ].join(' '),
  sampleRate: 0,
})
```

### `pikkuAgentScorer` {#pikkuagentscorer}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a scorer that grades an agent run programmatically — a function over
the run's input and output returning a score.

```typescript
pikkuAgentScorer: (config: Parameters<typeof corePikkuAgentScorer<Services>>[0]) => PikkuAgentScorer<Services>
```

<details>
<summary>Config keys (5)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` <sup>required</sup> | `string` | What this scorer grades, in one line, for whoever reads the score later. |
| `name` <sup>required</sup> | `string` | Identifies the scorer in results and in the Console. Unique per project. |
| `requiresReference` | `boolean` | Grades against a known-correct answer. Such a scorer is test-only — live traffic has no answer key, so the runtime never samples it. |
| `sampleRate` | `number` | 0..1 fraction of live runs to grade. Defaults to all of them. |
| `score` <sup>required</sup> | `(input: ScorerInput, services: Services) => ScorerOutput \| Promise<ScorerOutput>` | The grade itself: read the finished run and return `&#123; score, reason &#125;`. Runs in-process, so it may use your own services. |

</details>

```typescript
export const namesAProduct = pikkuAgentScorer({
  name: 'namesAProduct',
  description: 'An answer that names an actual item beats one that hedges',
  sampleRate: 0.25,
  score: ({ toolCalls }) => ({
    score: toolCalls.some((call) => call.name.startsWith('listItems')) ? 1 : 0,
    reason: `The run made ${toolCalls.length} tool call(s).`,
  }),
})
```

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/agent` — same 7 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc agent` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
