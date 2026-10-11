---
title: React
description: PikkuProvider, direct client hooks, realtime, agents and workflows on the client
---

# React

`@pikku/react` is the client layer between your generated client and React. The
generated React Query hooks (`usePikkuQuery`, `usePikkuMutation`,
`usePikkuInfiniteQuery`) cover data fetching and are documented in
[React Query](/docs/wiring/rpcs/react-query); this page covers the provider and
the hooks the package itself exports.

```bash
npm install @pikku/react
```

## Provider

`createPikku` builds one instance from your generated client classes, and
`PikkuProvider` puts it on React context. Do both once at the app root — hooks
outside the provider throw.

```tsx @snippet co-react-provider
```

The realtime class is optional: pass it when the app subscribes to channels or
events, and omit it otherwise. `createPikku` accepts the same options as the
generated fetch client (`serverUrl`, auth hooks, and so on).

## Hooks

| Hook | Use it for |
| --- | --- |
| `usePikkuRPC()` | A one-off RPC call from an event handler |
| `usePikkuFetch()` | Hitting a REST route rather than an RPC |
| `usePikkuRealtime()` | Subscribing to events, SSE or a channel (needs the realtime instance above) |
| `usePikkuAgent(name)` | Talking to one named AI agent — `.run` / `.stream` / `.approve` |
| `usePikkuWorkflow(name)` | Running one named workflow — `.start` / `.run` / `.status` |
| `usePikkuFeatureFlags()` / `useFeatureFlag(key)` | Reading the caller's feature flags |
| `usePikkuAnalytics()` | Sending product-analytics events |
| `useDevActors()` | The "Sign in as …" scenario-actor switcher in dev |

For rendering, mutating or paginating data, use the generated React Query hooks
instead — they add caching, deduplication and unmount handling that a manual
effect does not.

## Dev actors

`useDevActors()` implements the logic half of the dev actor switcher:
`parseDevActors`, `parseDevActorSecrets` and `signInAsActor` back it, and
`@pikku/mantine/dev` renders the control on top. It lets a local app sign in as a
declared persona so you can drive the same scenarios the CLI runs, from the UI.

## i18n

The package exports the i18n gate types (`I18nString`, `I18nNode`, `asI18n`) and
the locale store (`createLocaleStore`) that `@pikku/mantine` uses to render only
translated strings. See [Internationalization](/docs/frontend/i18n) for the full workflow.

## Next Steps

- **[React Query](/docs/wiring/rpcs/react-query)** — the generated data hooks
- **[Realtime](/docs/wiring/channels/websocket-client)** — channel and event subscriptions
- **[AI Agents](/docs/wiring/ai-agents)** — backend-side agents the hooks call
