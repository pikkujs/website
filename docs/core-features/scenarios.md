---
title: Scenarios
sidebar_position: 61
description: Drive your app the way users do — workflows with actors that double as e2e tests and production health checks
ai: true
---

# Scenarios

A scenario is a workflow that drives your app the way users do. Its steps run as **actors** — synthetic users with real accounts — over the **real transport**: sign-in, auth middleware, permissions, serialization, everything. That makes one scenario definition useful three ways: an end-to-end test locally, a smoke test against staging, and a health check against production.

## Your First Scenario

Define a scenario with `pikkuScenario` — it has the same shape as a workflow function, but every `scenario.do` step names an exposed RPC **and who performs it**. `pikkuScenario` is generated into `#pikku/scenarios`, alongside `pikkuScenarioStep` and `pikkuFeature`. From the [online shop example](https://github.com/pikkujs/pikku/tree/main/examples/online-shop):

```typescript @snippet scenarioBasics
```

Because scenarios are workflows, steps are recorded durably — a replayed run returns cached step results instead of re-invoking them. `scenario.expectEventually` is the scenario-only polling step: it re-invokes the RPC as the actor until the predicate passes or the timeout fails the scenario (using it in a plain workflow raises [PKU675](/docs/pikku-cli/errors/pku675)). Tune the polling with `within` (total time budget, default `'30s'`) and `interval` (poll interval, default `'1s'`; a number is milliseconds) — both optional.

:::info Actor steps never dispatch internally
Every `scenario.do` in a scenario must carry `{ actor }`. Steps without an actor are refused when running against an environment — a scenario run against staging or production can never accidentally touch local services or queues.
:::

:::warning What a scenario body may do
A scenario body runs against a live target, so it may only destructure `logger` and `config` from its services — anything else is a [PKU673](/docs/pikku-cli/errors/pku673) codegen error. Reach the app through actors instead. Every scenario must also assert: a flow of only `given`/`when` steps that never reaches a `then` (or an `expectEventually`/`expectError`/`expectService`/`expectScore` helper) is a [PKU680](/docs/pikku-cli/errors/pku680) error.
:::

:::warning No state reset
Scenarios run against live environments — including production. Nothing resets state afterwards, so scope what you create (unique titles, dedicated actor accounts) and clean up inside the scenario if it matters.
:::

## Conversing with AI Agents

For agent-powered apps, deterministic RPC calls only test half the product. `actor.converse()` lets an actor hold a free-form conversation with one of your [AI agents](../wiring/ai-agents/index.md) — in persona. An LLM plays the actor (using the `personality` and `jobTitle` from the persona declaration), drives the agent over the real transport as the signed-in actor, answers the agent's tool-approval requests in character, and returns a verdict:

```typescript @snippet scenarioConverse
```

The verdict contains `passed`, the persona's `reasoning`, and the full `transcript` for debugging. The verdict is the persona's judgement — always follow up with a deterministic check through the same actor, as above.

`converse` also accepts:

| Option | Default | Description |
|--------|---------|-------------|
| `approvals` | `'in-persona'` | How the persona answers tool-approval requests: `'in-persona'` (decide as the persona would), `'always'` (stress the happy path), `'never'` (exercise refusal handling) |
| `maxTurns` | `12` | Hard cap on conversation turns before forcing evaluation |
| `model` | actor service default | Model the persona uses for its own turns |

In a typed project, `agent` is constrained to the generated union of your agent names.

## Declared Steps and Features

When one intent spans several RPCs, or you want the same behaviour driven through a browser or the websocket, declare it as a `pikkuScenarioStep` instead of an inline `scenario.do`. A step declares one binding per surface (`default`, `browser`, `cli`), names itself with a `template` for the report, and is referenced from a scenario by name through `scenario.given`/`when`/`then`:

```typescript
import { pikkuScenarioStep } from '#pikku/scenarios'

export const buysTheItem = pikkuScenarioStep<{ name: string }, { name: string }>({
  name: 'buysTheItem',
  description: 'puts one item in the basket',
  template: 'buys the {name}',
  actor: true,
  default: async (_services, { name }, { actor }) => {
    const item = await actor.invoke('findItemByName', { name })
    await actor.invoke('addToBasket', { itemId: item.id })
    return { name }
  },
})
```

`pikkuFeature({ name, scenarios: [...] })` groups scenarios the way Gherkin's `Feature:` groups `Scenario:`. Browser bindings need `@pikku/playwright` installed; running with `--run default` (the default) skips scenarios containing browser steps rather than failing them.

## Actors and Environments

An actor is a declared **persona** — a normal user row in your system, materialised and signed in by the run. Declare the people once in code with `definePersonas`:

```typescript
// src/personas.virtual-user.ts
import { definePersonas } from '#pikku/scopes/pikku-personas.gen.js'

definePersonas({
  shopper: {
    name: 'Sam Shopper',
    jobTitle: 'Retail customer',
    personality: 'Impatient, skims instructions, expects things to just work',
    account: {}, // email + password
  },
  admin: {
    name: 'Ops Admin',
    jobTitle: 'Operations admin',
    account: {},
  },
})
```

Target environments are top-level in `pikku.config.json`, and the actor addresses are derived from the persona name and `scenarios.emailDomain`:

```json title="pikku.config.json"
{
  "environments": {
    "staging": { "apiUrl": "https://staging.example.com/api" },
    "production": {
      "apiUrl": "https://app.example.com/api",
      "appUrl": "https://app.example.com",
      "signInPath": "/auth/actor-sign-in",
      "rpcPath": "/rpc",
      "production": true
    }
  },
  "scenarios": {
    "emailDomain": "actors.example.com"
  }
}
```

The CLI generates a typed persona registry from `definePersonas`, and scenarios receive it as `actors` on the scenario wire. `signInPath` defaults to `/auth/sign-in/actor` and `rpcPath` to `/rpc`; `SCENARIO_ACTOR_SECRET` never appears here. Actor login is **lazy**: the first `invoke` signs the actor in (via the Better Auth actor plugin) and the session is cached for the actor's lifetime. `personality` and `jobTitle` power the console's scenario screen and the persona in `converse`.

## Running Scenarios

```bash
# List all pikkuScenario exports with names and descriptions
npx pikku scenario list

# Run all scenarios against an environment from pikku.config.json
SCENARIO_ACTOR_SECRET=… npx pikku scenario run staging

# Filter by name or tag
npx pikku scenario run staging --flows shopperBuysAnItem
npx pikku scenario run production --tags checkout
```

| Option | Short | Description |
|--------|-------|-------------|
| `--flows` | `-f` | Comma-separated scenario names to run (default: all) |
| `--tags` | `-t` | Comma-separated tags — run scenarios matching any |
| `--features` | | Comma-separated feature names (`pikkuFeature` exports) — the feature is the run unit, so its hooks run once around the group |
| `--exclude-tags` | | Comma-separated tags to hold back — scenarios matching any are skipped, unless named directly with `--flows` |
| `--coverage` | | Reset/snapshot server coverage per scenario (the target must run with `--coverage`); writes `coverage/scenario-coverage.json` |
| `--run` | | Which surface every actor drives the system through: `browser`, `cli`, or `default` (server-side, the fast path). Defaults to `default` |
| `--strict` | | Fail rather than pass a `then` that has no witness for `--run` |
| `--spawn` | | Start `pikku dev` on the environment's `apiUrl` for the run and stop it afterwards |
| `--keep-alive` | | With `--spawn`, leave the server running after the run (dev loop) |
| `--trace` | | Keep every stack frame on a failure. Without it, only the project's own frames are shown |
| `--screenshots` | | Write the screenshots scenarios ask for to disk, under `.pikku/scenario-runs/<run>/<scenario>` |
| `--video` | | Which scenarios keep their recording: `failed` (the default), `all`, or `off` |
| `--api-url` | | Override the environment's `apiUrl` for this run |
| `--app-url` | | Override the environment's `appUrl` for this run — one url, or `<app>=<url>` pairs, comma-separated |

Scenarios run sequentially (they're stories; parallel actors would share cookie jars) and report `PASS`/`FAIL` per scenario with durations. A non-zero exit code on any failure makes them CI-friendly.

:::warning SCENARIO_ACTOR_SECRET
Actors sign in with a shared secret that must come from the environment running the command — never put it in `pikku.config.json`. Without it, `scenario run` refuses to start.
:::

## Related

- [Workflows](../wiring/workflows/index.md) — scenarios are workflows; steps, durability, and replay work the same way
- [AI Agents](../wiring/ai-agents/index.md) — the agents actors converse with
- [Testing](./testing.md) — unit-level testing of individual functions
