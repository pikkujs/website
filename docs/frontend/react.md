---
title: React
description: PikkuProvider, direct client hooks, realtime, agents and workflows on the client
---

# React

`@pikku/react` is the client layer between your generated client and React. The
generated React Query hooks (`usePikkuQuery`, `usePikkuMutation`,
`usePikkuInfiniteQuery`) cover data fetching and are documented in
[React Query](../wiring/rpcs/react-query.md); this page covers the provider and
the hooks the package itself exports.

```bash
npm install @pikku/react
```

## Provider

`createPikku` builds one instance from your generated client classes, and
`PikkuProvider` puts it on React context. Do both once at the app root — hooks
outside the provider throw.

```tsx
import { PikkuProvider, createPikku } from '@pikku/react'
import { PikkuFetch } from '#pikku/pikku-fetch.gen.js'
import { PikkuRPC } from '#pikku/pikku-rpc.gen.js'
import { PikkuRealtime } from '#pikku/pikku-realtime.gen.js'

const pikku = createPikku(PikkuFetch, PikkuRPC, PikkuRealtime, {
  serverUrl: 'https://api.example.com',
})

export function App() {
  return <PikkuProvider pikku={pikku}>{/* your app */}</PikkuProvider>
}
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
translated strings. See [Internationalization](./i18n.md) for the full workflow.

## Next Steps

- **[React Query](../wiring/rpcs/react-query.md)** — the generated data hooks
- **[Realtime](../wiring/channels/websocket-client.md)** — channel and event subscriptions
- **[AI Agents](../wiring/ai-agents/index.md)** — backend-side agents the hooks call
