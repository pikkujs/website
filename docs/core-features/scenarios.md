---
title: Scenarios
sidebar_position: 61
description: Drive your app the way users do — workflows with actors that double as e2e tests and production health checks
ai: true
---

# Scenarios

A scenario is a workflow that drives your app the way users do. Its steps run as **actors** — synthetic users with real accounts — over the **real transport**: sign-in, auth middleware, permissions, serialization, everything. That makes one scenario definition useful three ways: an end-to-end test locally, a smoke test against staging, and a health check against production.

## Your First Scenario

Define a scenario with `pikkuScenario` — it has the same shape as a workflow function, but every `workflow.do` step names an exposed RPC **and who performs it**. From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template):

```typescript @snippet scenarioBasics
```

Because scenarios are workflows, steps are recorded durably — a replayed run returns cached step results instead of re-invoking them. `workflow.expectEventually` is the scenario-only polling step: it re-invokes the RPC as the actor until the predicate passes or the timeout fails the scenario (using it in a plain workflow raises [PKU675](/docs/pikku-cli/errors/pku675)). Tune the polling with `within` (total time budget, e.g. `'30s'`) and `interval` (milliseconds between attempts) — both optional.

:::info Actor steps never dispatch internally
Every `workflow.do` in a scenario must carry `{ actor }`. Steps without an actor are refused when running against an environment — a scenario run against staging or production can never accidentally touch local services or queues.
:::

:::warning No state reset
Scenarios run against live environments — including production. Nothing resets state afterwards, so scope what you create (unique titles, dedicated actor accounts) and clean up inside the scenario if it matters.
:::

## Conversing with AI Agents

For agent-powered apps, deterministic RPC calls only test half the product. `actor.converse()` lets an actor hold a free-form conversation with one of your [AI agents](../wiring/ai-agents/index.md) — in persona. An LLM plays the actor (using the `personality` and `jobTitle` from the registry), drives the agent over the real transport as the signed-in actor, answers the agent's tool-approval requests in character, and returns a verdict:

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

## Actors and Environments

An actor is a normal user row in your system, flagged as an actor. Declare the registry and target environments in `pikku.config.json`:

```json title="pikku.config.json"
{
  "scenarios": {
    "actors": {
      "shopper": {
        "email": "shopper@actors.example.com",
        "name": "Sam Shopper",
        "jobTitle": "Retail customer",
        "personality": "Impatient, skims instructions, expects things to just work"
      },
      "admin": {
        "email": "admin@actors.example.com",
        "jobTitle": "Operations admin"
      }
    },
    "environments": {
      "staging": { "apiUrl": "https://staging.example.com/api" },
      "production": {
        "apiUrl": "https://app.example.com/api",
        "signInPath": "/auth/actor-sign-in",
        "rpcPath": "/rpc"
      }
    }
  }
}
```

The CLI generates a typed actor registry from this config, and scenarios receive it as `actors` on the workflow wire. Actor login is **lazy**: the first `invoke` signs the actor in (via the Better Auth actor plugin) and the session is cached for the actor's lifetime. `personality` and `jobTitle` power the console's scenario screen and the persona in `converse`.

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

Scenarios run sequentially (they're stories; parallel actors would share cookie jars) and report `PASS`/`FAIL` per scenario with durations. A non-zero exit code on any failure makes them CI-friendly.

:::warning SCENARIO_ACTOR_SECRET
Actors sign in with a shared secret that must come from the environment running the command — never put it in `pikku.config.json`. Without it, `scenario run` refuses to start.
:::

## Related

- [Workflows](../wiring/workflows/index.md) — scenarios are workflows; steps, durability, and replay work the same way
- [AI Agents](../wiring/ai-agents/index.md) — the agents actors converse with
- [Testing](./testing.md) — unit-level testing of individual functions
