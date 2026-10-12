---
sidebar_position: 55
title: Feature Flags
description: Switch features on and off without a deploy, and let the frontend ask what to show
ai: true
---

# Feature Flags

A feature flag is a named switch for a piece of your product. You declare it in code, gate functions on it, and flip it at runtime without redeploying. That makes it good for three things: shipping something dark and turning it on later, rolling a feature out to a percentage of organizations, and having a kill switch you can pull when something goes wrong.

Flags are about **availability**, not authorization. Who is allowed to do something is still a job for [`scopes` and permission guards](/docs/core-features/permission-guards). A flag answers a different question: is this feature switched on right now?

## Declaring flags

Declare flags with `defineFeatureFlags`. It's a no-op at runtime; the CLI reads it from your source.

```typescript @snippet co-feature-flags-define
```

Each flag takes two optional fields:

| Field | What it does |
|-------|--------------|
| `description` | What the switch does, shown to whoever operates it |
| `anyOf` | Scope ids. The caller is *capable* of the flag if their session holds **any** of them |

A few rules, all enforced when the CLI runs:

- A flag name can't be empty and can't contain `:` (that belongs to scope ids).
- Every id in `anyOf` must be declared with `defineScope`. An empty `anyOf: []` is an error. Leave it out for a pure switch.
- You can declare the same flag more than once (an addon and your app, say), but the declarations must agree on `anyOf` and `description`.

### A typo is a compile error

The CLI generates a `FeatureFlagName` union from your declarations (see [generated files](/docs/pikku-cli/generated-files)), and functions and clients are typed against it. So `featureFlag: 'calList'` doesn't compile.

That matters more than it sounds. Flags **fail closed** on the client: an unknown flag reads `false`, which hides the feature and keeps every test and screenshot green. An untyped key would make a missing product look exactly like a working one.

## Gating a function

Put `featureFlag` on the function config:

Gate a function by setting `featureFlag` to the flag name in its `pikkuFunc` config, for example `featureFlag: 'sandboxes'`. The name is typed against the flags you have declared.

When the flag is off, the call throws `FeatureUnavailableError`, a [503](/docs/core-features/errors). The check runs after `scopes`, so an unauthorized caller still gets a 403 and never learns whether the feature exists.

It works on sessionless functions too, which is where a kill switch matters most. A cron task or queue worker has nobody watching a UI, so the flag is the only thing that can stop it.

The runner only enforces **availability**. It deliberately ignores `anyOf`, because otherwise a flag would turn into a second authorization path that disagrees with `scopes` the first time someone widens it. If no flag source is registered, the check is a no-op rather than a closed door.

If you need to check a flag inside a function body, `assertFeatureAvailable` does what the runner does:

```typescript @snippet co-feature-flag-assert
```

## How a flag resolves

Behind a flag there's a bit of runtime state that an operator controls, separate from what you declared:

| State | Meaning |
|-------|---------|
| `enabled` | The master switch |
| `rolloutPercent` | `0` to `100`, or `null` for no rollout constraint |
| `overrides` | Per-subject pins, keyed by organization or user id. An override beats both the switch and the rollout, in either direction |

Rollouts are bucketed by a hash of the flag name and the subject, so two flags at 50% don't pick the same half. The subject is the **organization** when there is one, otherwise the user, so colleagues in one account see the same UI.

`resolveFlag` combines that state with the session into two booleans:

A `FlagState` has two booleans: `available` (the flag is switched on at all, global and caller-blind) and `capable` (the session holds a satisfying scope from `anyOf`).

Two booleans, not one, because "you may not" (the caller's situation) and "nobody may right now" (ours) are different failures. Only `available` is enforced by the runner. `capable` is advisory and exists to hide UI. A client renders on `show`, which is `available && capable`.

```typescript @snippet co-feature-flag-resolve
```

Pass the `subject` explicitly when the session doesn't carry one. A queue worker or cron task knows its organization from its input, and resolving against no subject would skip that organization's overrides. With no subject at all, the rollout percentage is skipped rather than failed: a percentage is a statement about users, and background work is either on or off.

A flag that isn't in the snapshot at all resolves as **available**. That's the opposite of the client's fail-closed default, and it's on purpose: an unreadable config shouldn't turn a store blip into a total outage. It's safe because `capable` comes from the session and `scopes` is untouched, so failing open can't expose anything the caller wasn't already authorized for.

## Sources and stores

Flags are backed by the `featureFlags` [service](/docs/core-features/services), and there are two interfaces, split on purpose.

**`FeatureFlagSource`** is the read half and the only half on the request path:

`FeatureFlagSource` has a required `snapshot(): Promise<FlagConfigSnapshot>` and an optional `declaredFlags(): readonly DeclaredFlag[]`.

Implement this to back flags with a third-party provider such as PostHog, Unleash or LaunchDarkly. Their UI stays the place you operate flags, and Pikku doesn't pretend to own an administration surface it doesn't have.

**`FeatureFlagStore`** extends the source with administration: `syncFlags`, `listFlags`, `listOverrides`, `setEnabled`, `setRollout`, `setOverride`, `clearOverride`, `findStaleFlags` and `pruneFlags`. It's for a store Pikku owns. `@pikku/kysely` ships one, `KyselyFeatureFlagStore`:

Import `KyselyFeatureFlagStore` from `@pikku/kysely` and construct it with your Kysely instance and `{ ttlMs: 30000 }`. That is your `featureFlags` service.

### Caching and fallback

You don't write the caching yourself. Extend `CachedFlagSource`, implement `fetchSnapshot()`, and it handles the rest:

- **TTL.** A snapshot is served for `ttlMs` (default 30 seconds) before it's refreshed. That's the latency of a kill switch, so keep it short.
- **Refresh on demand.** The request that finds the cache stale does the fetch. There's no background timer, because serverless isolates can't hold one. Concurrent callers share one in-flight read.
- **Three layers when a read fails.** The last good snapshot first, and only on a cold start with nothing cached, the **compiled declaration**: every declared flag on, no rollout, no overrides. Dropping straight to the declaration on a blip would switch on flags an operator deliberately left off.
- **`invalidate()`.** Drops the cache so the next read goes to the store. Call it from a provider's webhook to cut kill-switch latency from the TTL down to delivery time. It doesn't fetch eagerly; the next request pays for the read.

Pass `declared` in the options if you want the cold-start fallback to cover your flags.

## Reading flags from the frontend

The CLI can generate a read wire for you. Turn it on with the `featureFlags` scaffold option (see [CLI configuration](/docs/pikku-cli/configuration)) and you get `GET /feature-flags`, written to `feature-flags.gen.ts`.

It returns one boolean per declared flag, resolved for the calling session:

```json
{ "sandboxes": true, "calendar": false }
```

The booleans are the collapsed `show` value, not the two halves. Sending `available` and `capable` separately would tell every visitor which features exist but are dark. The endpoint is unauthenticated because a signed-out visitor still renders a page, and a flag they can't hold just resolves `false`. The session is always the server's, so nobody can ask what someone else would see.

With React, build a client with `createFeatureFlags` and read it through the hooks in [`@pikku/react`](/docs/frontend/react):

```tsx @snippet co-react-feature-flags
```

The client fetches once per session and then answers from memory, so checking a flag in a component never puts the network in front of a paint. A few options worth knowing:

| Option | What it does |
|--------|--------------|
| `bootstrap` | A map your server-rendered page already computed, so the first paint is right |
| `fallback` | What an unknown flag resolves to before the first response, or if the request fails. Defaults to `false` |
| `refresh()` | Re-read the map. Call it when the session changes, since `capable` depends on the session's scopes |

`usePikkuFeatureFlags()` gives you the whole client (`has`, `all`, `ready`, `refresh`, `subscribe`).

Treat all of this as advisory. The map decides what to show, never what's allowed. A client that renders the button anyway gets a 503 from the runner, not the feature.

## Removing a flag

Delete a `defineFeatureFlags` entry and nothing is destroyed on deploy. The store keeps the row, marked as undeclared: still switchable, no longer offered. This is the same additive contract `defineScope` and `defineSystemRole` have, because a code edit shouldn't be able to cause a revocation mid-deploy.

Once you're sure it's gone for good, call `pruneFlags` on the store to remove undeclared flags and their overrides. `findStaleFlags` lists what's pending.

Editing a flag's `description` or `anyOf` *is* synced on deploy, since that's the declaration's whole content. `enabled`, the rollout and the overrides belong to the operator and are never touched by a deploy.
