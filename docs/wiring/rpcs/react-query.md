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
import { PikkuFetch } from '.pikku/pikku-fetch.gen'
import { PikkuRPC } from '.pikku/pikku-rpc.gen'

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
import { usePikkuQuery } from '.pikku/pikku-react-query.gen'

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
import { usePikkuMutation } from '.pikku/pikku-react-query.gen'

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

For paginated data. Only available for functions whose output includes `nextCursor`:

```typescript
// This function qualifies for infinite query because its output has nextCursor
export const listItems = pikkuSessionlessFunc<
  { limit: number; nextCursor?: string },
  { items: string[]; nextCursor?: string }
>({
  func: async (_services, data) => ({ items: [...], nextCursor: '...' }),
  expose: true,
})
```

```tsx
import { usePikkuInfiniteQuery } from '.pikku/pikku-react-query.gen'

function ItemList() {
  const { data, fetchNextPage, hasNextPage } = usePikkuInfiniteQuery(
    'listItems',
    { limit: 20 }
  )

  return (
    <>
      {data?.pages.flatMap(page => page.items).map(item => (
        <div key={item}>{item}</div>
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

If your project uses [Workflows](/docs/wiring/workflows), the generated file also includes:

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
- [Workflows](../workflows) — Multi-step processes with React Query hooks
