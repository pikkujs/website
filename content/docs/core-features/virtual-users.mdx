---
title: Virtual Users
sidebar_position: 62
description: A persona that uses your real app on its own — with goals, a temperament and a budget — and reports what came back that shouldn't have
ai: true
---

# Virtual Users

A [scenario](/docs/core-features/scenarios) is a script: you decide the steps, and the run checks they work. A **virtual user** is the opposite. It's a [persona](/docs/core-features/scenarios#actors-and-environments) — Sam the shopper, Ops Admin — that signs in to a running stage as a real user and works your API in character, deciding what to do next as it goes. Nothing asserts an expected outcome. The point is to find the outcomes nobody thought to expect: a 500, a response that doesn't match its own schema, a call that succeeded when it shouldn't have.

Two things drive it. An LLM chooses what to do *within* a goal, and the engine decides *which* goal is live and when to get distracted. Because the second part is seeded, a run replays: the same seed schedules the same run.

You write almost nothing for this. The function meta becomes the catalogue of things it can call, the scenarios become the things it wants to do, and the declared personas become who it is.

## The persona is the identity

A virtual user *is* a persona while it runs — there's no second declaration. Everything about who it is lives in `definePersonas` (see [Scenarios](/docs/core-features/scenarios#actors-and-environments)). The fields that matter here:

```typescript @snippet definePersonas
```

| Field | What it does for a virtual user |
|-------|----------------------------------|
| `roles` | System roles only. They're granted by the generated seed and verified at sign-in, and they decide which scopes the persona holds, which decides which RPCs it is offered |
| `personality` | How they talk and behave, in prose. Temperament, not permissions |
| `goals` | What they durably want. A run can add goals; it never replaces these |
| `disposition` | The default mechanical behaviour (below). A run can override it |
| `tuning` | Per-persona overrides for that disposition's dials |
| `fixtures` | Files (relative to the project root) the user may upload |
| `environments` | Which configured environments it may run against. Omitted means all of them except those flagged `production: true` |
| `runnable` | `false` for a person who is only ever acted *upon* (the account an admin bans). Declared and seeded, never run |

A persona that signs in with a provider account (`account.provider`) is declarable but not runnable, since driving a consent screen needs a human.

## Dispositions

A disposition is how a virtual user behaves *mechanically*. Anything that only changes how it *talks* is persona prose, not a disposition. If the default is `realistic`, here's the full set:

| Disposition | Behaviour |
|-------------|-----------|
| `realistic` | Schema-first, goal-directed, plausible values. The default |
| `careless` | Repeats calls (the double-click), gets distracted and abandons things, uses odd-but-legal values like huge page sizes and emoji |
| `newcomer` | Starts with empty memory and has to find everything from lists and lookups |
| `stale` | Works from ids remembered from an earlier run, some of which no longer resolve |
| `auditor` | Pursues no goal. Reads one fact from every endpoint that claims to know it and compares. Read-only: the engine refuses non-read calls |
| `adversarial` | Probes authorization and tenancy. A 2xx from something it shouldn't reach is the finding |
| `accountable` | Does the job for real. No oracle, no rollback, every call attributed to the persona in the audit log |

`DISPOSITIONS` and `dispositionProfile(disposition, tuning)` from `@pikku/core` give you the underlying profile if you want to see the numbers. A profile has `moves` (relative weights for `continue`, `suspend`, `resume`, `abandon`), `temperature`, `repeatRate`, `reReadRate`, `emptyMemory`, `readOnly`, `invertedOracle` and `instructions`.

### Tuning

The built-in profiles are starting points, and your product is allowed to know better. `tuning` overrides the dials: `moves` (merged over the profile's), `temperature`, `repeatRate`, `reReadRate`, `emptyMemory`, `readOnly`, `invertedOracle`, and `instructions`.

`instructions` is the one field that *appends*. Everything else replaces a number. That's deliberate: letting a declaration replace the instructions wholesale is how you end up with a `careless` user that isn't careless.

### The production disposition

`accountable` is the only disposition a production environment accepts (`PRODUCTION_DISPOSITION`). Every other one exists to find out what your product does wrong, which isn't something to do to real customers' data. It's enforced in three places:

- The inspector rejects a persona that lists a `production: true` environment in `environments` unless its `disposition` is `accountable`.
- Sign-in re-checks the same rule before a persona gets a session against a production environment.
- Starting a run checks the *effective* disposition (so a per-run override can't smuggle another one in). Which environment counts as production comes from `PIKKU_ENV` against your configured `environments`. An unresolved environment is treated as production. A project that configures no environments falls back to `config.nodeEnv === 'production'`.

`accountable` also differs in intent: it's good faith where `adversarial` is bad faith. Its instructions tell it to hand work to a specialist agent where one exists, to stop and say what it would do when unsure, and never to guess an identifier, amount or recipient.

## What it can see and do

Each run derives its inputs from what the project already generates (`prepareVirtualUserRun`):

- **Catalogue**: every RPC with `expose: true`, rendered compactly (name, input keys, output keys, description) and put whole into the prompt, not retrieved against. Scenario functions and the generated `virtualUser:*` RPCs themselves are left out, so a persona can't start runs, read other runs' findings or schedule itself. It's narrowed to what the persona's scopes entitle it to reach. Approval-gated functions are dropped unless the run opts in (`--allow-approval`), and mutations are dropped for a read-only disposition.
- **Read or write?** An explicit `readonly` annotation wins. If nobody annotated it, the engine falls back to a name heuristic (`get`, `list`, `find`, `search`, `check`, `count`...) and reports how much of the catalogue rests on that guess (`catalogueClassification`). Annotate your read-only functions and the guess goes away.
- **Intents**: the things it wants to do, derived from your scenarios (`deriveIntents`). Only the *prose* survives: titles, descriptions and step sentences. The user never sees rpc names or the step graph, because finding the API is the behaviour under test. Steps with no sentence are dropped rather than described by function name.
- **Agents**: AI agents it can talk to. A persona doesn't declare an agent; it *reaches* one, by the same scope rule as an RPC. An agent with no scopes is offered to everyone.
- **Memory**: ids and slugs it has seen, which a later `stale` run can be seeded with.

### Intents and the stack

A real person doesn't run a flow end to end. They start something, get pulled away, come back to a world that moved, and sometimes never come back. The engine models that with an `IntentStack`: each turn it rolls one of `start`, `continue`, `suspend`, `resume`, `abandon`, weighted by the disposition's `moves`. The model only decides what to do inside the active intent. That split is why the run is reproducible from a seed while the work inside it stays free.

Each turn the model picks one action: `describe` (read an endpoint's schemas before calling it), `call`, `talkTo` (converse with an agent), `upload` (a fixture), `complete` or `stuck`. Each intent ends up `completed`, `abandoned`, `stuck`, `suspended` or still `open`.

### What counts as a finding

Findings have a `kind`: `server-error`, `transport-error`, `schema-violation` (the response doesn't match the RPC's output schema), `unexpected-success` (a call succeeded for a persona that doesn't hold the scopes the RPC declares) and `custom`. You can add your own checks, such as ownership or invariants core can't know, with the `classify` hook when you call `runVirtualUser` yourself.

## Running one

### From the CLI

```bash
SCENARIO_ACTOR_SECRET=… npx pikku persona run staging sam
npx pikku persona run staging sam --disposition adversarial --steps 80
npx pikku persona run staging sam --goals "find a cheaper plan" --seed 1337 --out run.json
```

`pikku persona run <environment> <persona>` signs in as the persona and runs it against an environment from `pikku.config.json`. Options: `--disposition` (`-d`), `--goals` (comma-separated), `--steps` (default 40), `--mutations`, `--duration` (e.g. `30m`), `--seed`, `--model` (defaults to `scenarios.model` in `pikku.config.json`), `--allow-approval`, `--skip-role-check`, `--api-url` and `--out` (the whole run, step by step, as JSON). See [`pikku persona`](/docs/pikku-cli#pikku-persona) for the rest of the command family: `list`, `sync` and `secret`.

### From inside the app

Turn on the generated surface in `pikku.config.json`. It needs at least one declared persona:

```json title="pikku.config.json"
{ "scaffold": { "virtualUser": true } }
```

(See the generated-file options in [configuration](/docs/pikku-cli/configuration); the surface lands in `virtual-user.gen.ts` under `pikkuDir` by default.) That generates these RPCs, each behind its own scope, declared as the `virtualUser` scope group:

| RPC | Scope | What it does |
|-----|-------|--------------|
| `runVirtualUser` | `virtualUser:run` | Records a run and returns `{ runId }` immediately |
| `getVirtualUserRun` | `virtualUser:read` | One run: findings, intents, tally, status |
| `listVirtualUserRuns` | `virtualUser:read` | Runs, newest first, optionally for one persona |
| `getVirtualUserRunSteps` | `virtualUser:read` | The turns of one run |
| `setVirtualUserSchedule` | `virtualUser:schedule` | Create or update a persona's cadence |
| `listVirtualUserSchedules` | `virtualUser:read` | All cadences |

`runVirtualUser` takes `persona`, and optionally `goals` (up to 20), `memory`, `disposition`, `seed`, `operatorToken` and a `budget` of `steps` (1 to 500), `mutations` (0 to 500) and `durationMs` (1 second to 1 hour). Reading is a separate, smaller permission than starting, on purpose: an `adversarial` run's findings are working exploits with live ids, so treat anything that can read them as privileged.

The run executes asynchronously. If you have a `queueService`, it's added to the `pikku-virtual-user-runs` queue with a single attempt (a redelivery would be a second, different outing writing into a record that already has an outcome). Without one, it runs in the background of the process. Either way it needs these variables (through [`VariablesService`](/docs/core-features/variables)):

| Variable | Used for |
|----------|----------|
| `VIRTUAL_USER_API_URL` | Where the virtual user signs in. Required |
| `VIRTUAL_USER_MODEL` | The model it thinks with. Required |
| `SCENARIO_ACTOR_SECRET` | Sign-in secret for a local `pikku dev` target |
| `FABRIC_OPERATOR_TOKEN` | Fallback operator token for a deployed stage. A token handed in as `operatorToken` wins, and is never written to the run record |
| `SCENARIO_SIGN_IN_PATH`, `SCENARIO_RPC_PATH` | Same as a scenario run, for apps that mount auth or RPC somewhere other than the root |

It also needs `metaService` (to derive the catalogue) and `agentRunner` (the same runner your agents use, so the virtual user thinks through it too).

## Where run state lives

A run isn't a workflow and isn't replayed from a queue: it explores, so no two attempts take the same steps. The **run record is its only trace**. It's created as `running` *before* the work starts, and the returned `runId` addresses it.

Wire a `VirtualUserRunStore` for that (`@pikku/kysely` ships `KyselyVirtualUserRunStore`, or implement the interface yourself). With none wired, starting a run throws an error naming the store to wire. The methods are `start`, `complete`, `fail`, `get`, `list` and `steps`. Steps are stored apart from the run so listing runs doesn't drag a budget's worth of turns along. See [`virtualUserRunStore`](/docs/api) and [Storage](/docs/storage).

A `VirtualUserRunRecord` carries `runId`, `persona`, `disposition`, `seed`, `status` (`running`, `completed` or `failed`), `goals`, `memory`, `findings`, `intents`, `tally`, `stoppedBy`, `error`, `startedBy`, `createdAt` and `finishedAt`. The `tally` counts steps, calls, mutations, tokens in and out, model, elapsed time and findings.

A run ends for one of these reasons (`stoppedBy`): `budget-steps`, `budget-mutations`, `budget-duration`, `stop-hook`, `no-intents` or `exhausted`.

One gotcha: a restart mid-run leaves a record at `running` with nothing to finish it. A run older than its budget window and still `running` is dead, not working.

## Keeping a persona going: schedules

One run tells you about one afternoon. What you often want is what a persona hits over a fortnight, and that's a cadence rather than a longer run.

A `VirtualUserScheduleStore` (`@pikku/kysely` ships `KyselyVirtualUserScheduleStore`) holds one row per persona: `enabled`, `disposition`, `goals`, `budget`, `minIntervalMs`, `maxIntervalMs`, `nextRunAt`, `lastRunId` and `lastRunAt`. Some deliberate choices:

- It's **off by default**. A schedule that ran the moment it was written would spend your model budget as a side effect of a migration.
- The gap to the next run is **drawn between** the min and max intervals, not fixed, because a real user doesn't keep an appointment. Defaults are 6 to 24 hours (`DEFAULT_MIN_INTERVAL_MS`, `DEFAULT_MAX_INTERVAL_MS`). Via `setVirtualUserSchedule` the minimum is 1 minute.
- There's **no timer** in Pikku. The row is the schedule: something outside asks which rows are due. The scaffold also generates `tickVirtualUserSchedules` but wires it to nothing, since a scaffolded cron would start spending money the moment you ran `pikku all`. You wire it when you mean it:

Wire the tick as a scheduler task named `virtualUsers` on the schedule `0 * * * *` (hourly), running `tickVirtualUserSchedules` with the `virtualUserPlatformSession` middleware.

`virtualUserPlatformSession` gives the tick a session carrying `virtualUser:run`, because it starts runs through `runVirtualUser`, the same gated front door a person uses. Each tick, for every due persona: skip it if its previous run is still going (`in-flight`), mark a run stranded for more than two hours as failed (`STALE_RUN_AFTER_MS`), then **claim** the persona (a compare-and-set on `nextRunAt`) *before* dispatching, so two overlapping ticks can't both start the same user. If dispatch throws, the persona waits a full interval rather than being retried every minute.

## How it relates to scenarios and environments

|  | Scenario | Virtual user |
|--|----------|--------------|
| Steps | Fixed, written by you | Chosen by an LLM within the active intent |
| Asserts | Yes, it's a test | Nothing; it reports what looks wrong |
| Repeatable | Deterministic | Seeded, so a seed replays |
| Identity | A persona acting as an actor | The same persona |

They share the persona declaration, the sign-in path (the persona signs in over your app's real auth and calls through the real transport) and the `environments` in `pikku.config.json`. Your scenarios also feed a virtual user its intents, in prose. A virtual user acts through a `VirtualUserTarget` with `call`, optional `talkTo` and optional `upload`. In practice that's `personaVirtualUserTarget(persona, { model, agents })` over a signed-in persona, which reports a 403 as data rather than throwing, since to a virtual user a "no" is information to act on.

To run the engine yourself, `runVirtualUser` from `@pikku/core` takes `persona`, `personaId`, `disposition`, `tuning`, `catalogue`, `intents`, `goals`, `target`, `llm`, `model`, `budget`, `stop`, `seed`, `validateOutput`, `classify`, `fixtures`, `agents`, `memory`, `scopes` and `allowApprovalRequired`. `stop(tally)` is your own stopping rule: Pikku counts steps, calls and tokens, but what they cost is yours to decide, so no price appears in core. The default budget is 40 steps.
