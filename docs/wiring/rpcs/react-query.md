---
sidebar_position: 3
title: React Query Hooks
description: Auto-generated typed React Query hooks for your Pikku functions
ai: true
---

# React Query Hooks

Pikku generates fully typed [TanStack React Query](https://tanstack.com/query) hooks from your function definitions. You get `useQuery`, `useMutation`, and `useInfiniteQuery` — with input/output types inferred from your functions. No manual type maintenance.

## Setup

### 1. Enable generation

Add `reactQueryFile` to your `pikku.config.json`:

```json
{
  "clientFiles": {
    "reactQueryFile": ".pikku/pikku-react-query.gen.ts"
  }
}
```

### 2. Generate hooks

```bash
npx pikku all
# or just the hooks:
npx pikku react-query
```

This generates a file with typed hooks that import from your generated RPC map.

The examples below import it as `#pikku/pikku-react-query.gen.js`, which is what the `reactQueryFile` path above resolves to. If your React app is a separate package from the one Pikku generates into, point `reactQueryFile` at that package instead and import by its own path — the `#pikku/*` alias only reaches inside the package that declares it.

### 3. Install dependencies

The generated hooks need `@tanstack/react-query` and `@pikku/react`:

```bash
npm install @tanstack/react-query @pikku/react
```

### 4. Wire up the provider

Wrap your app with both the React Query and Pikku providers:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PikkuProvider, createPikku } from '@pikku/react'
import { PikkuFetch } from '#pikku/pikku-fetch.gen.js'
import { PikkuRPC } from '#pikku/pikku-rpc.gen.js'

const queryClient = new QueryClient()

const pikku = createPikku(PikkuFetch, PikkuRPC, {
  serverUrl: 'https://api.example.com'
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PikkuProvider pikku={pikku}>
        {/* your app */}
      </PikkuProvider>
    </QueryClientProvider>
  )
}
```

## Hooks

### `usePikkuQuery`

For reading data. Wraps `useQuery` with type-safe RPC name and input:

```tsx
import { usePikkuQuery } from '#pikku/pikku-react-query.gen.js'

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = usePikkuQuery('getUser', { userId })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  // data is fully typed — matches your function's output type
  return <h1>{data.name}</h1>
}
```

The query key is automatically set to `[name, data]`, so queries with different inputs cache separately.

You can pass any standard `useQuery` options as the third argument:

```tsx
usePikkuQuery('getUser', { userId }, { staleTime: 5000, refetchInterval: 10000 })
```

### `usePikkuMutation`

For writes. Wraps `useMutation`:

```tsx
import { usePikkuMutation } from '#pikku/pikku-react-query.gen.js'

function CreateTodo() {
  const { mutate, isPending } = usePikkuMutation('createTodo')

  return (
    <button
      disabled={isPending}
      onClick={() => mutate({ title: 'Buy milk' })}
    >
      Add Todo
    </button>
  )
}
```

The `mutate` callback is typed — it only accepts your function's input type and the result matches the output type.

### `usePikkuInfiniteQuery`

For paginated data. Only available for functions whose output includes `nextCursor` — the codegen detects this structurally, so any function shaped that way qualifies, not just ones built with a specific factory.

The recommended way to build one is `pikkuListFunc` (from `#pikku/function`), which bakes in the standard `ListInput`/`ListOutput` cursor contract (`cursor`/`limit`/`sort`/`filter`/`search` in, `{ rows, nextCursor, totalCount }` out) so every paginated RPC in your app shares one shape:

```typescript
import { pikkuListFunc } from '#pikku/function'

// Qualifies for infinite query because ListOutput always includes nextCursor
export const listItems = pikkuListFunc<{ status?: string }, { id: string; label: string }>({
  func: async ({ kysely }, input) => {
    // input.cursor / input.limit / input.filter / input.sort / input.search are typed
    return { rows: [...], nextCursor: '...', totalCount: 42 }
  },
  expose: true,
})
```

A plain `pikkuFunc`/`pikkuSessionlessFunc` with an ad-hoc output containing `nextCursor` also works — `pikkuListFunc` just gives you the shared shape for free instead of hand-rolling it each time.

```tsx
import { usePikkuInfiniteQuery } from '#pikku/pikku-react-query.gen.js'

function ItemList() {
  const { data, fetchNextPage, hasNextPage } = usePikkuInfiniteQuery(
    'listItems',
    { limit: 20 }
  )

  return (
    <>
      {data?.pages.flatMap(page => page.rows).map(item => (
        <div key={item.id}>{item.label}</div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}
    </>
  )
}
```

The cursor handling is wired up automatically — `getNextPageParam` and `initialPageParam` are set for you. You just pass the input data without `nextCursor` (it's managed by the infinite query).

If a function's output doesn't have `nextCursor`, TypeScript won't let you use it with `usePikkuInfiniteQuery`. That's intentional.

## Workflow Hooks

If your project uses [Workflows](../workflows/index.md), the generated file also includes:

- **`useRunWorkflow(name)`** — mutation that runs a workflow to completion
- **`useStartWorkflow(name)`** — mutation that starts a workflow and returns `{ runId }`
- **`useWorkflowStatus(name, runId)`** — query that polls workflow status by `runId`

## Type Safety

The generated hooks are type-checked at compile time. Invalid RPC names, wrong input shapes, and incorrect usage all produce TypeScript errors:

```tsx
// ✅ Compiles — correct name and input
usePikkuQuery('getUser', { userId: '123' })

// ❌ TypeScript error — unknown RPC name
usePikkuQuery('doesNotExist', {})

// ❌ TypeScript error — wrong input type
usePikkuQuery('getUser', { wrong: 'field' })

// ❌ TypeScript error — output has no nextCursor
usePikkuInfiniteQuery('getUser', { userId: '123' })
```

## Next Steps

- [Exposed RPCs](./external.md) — How functions get exposed to clients
- [Fetch Client](../http/fetch-client.md) — Lower-level type-safe HTTP client
- [Workflows](../workflows/index.md) — Multi-step processes with React Query hooks
