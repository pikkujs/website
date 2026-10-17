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

Wrap the app in a React Query `QueryClientProvider` (with a `QueryClient`) and, inside it, a `PikkuProvider`. Build the `pikku` object you hand to `PikkuProvider` with `createPikku(PikkuFetch, PikkuRPC, { serverUrl })`, importing `PikkuFetch` from `#pikku/pikku-fetch.gen.js` and `PikkuRPC` from `#pikku/pikku-rpc.gen.js`. `createPikku`, `PikkuProvider` come from `@pikku/react`.

## Hooks

### `usePikkuQuery`

For reading data. Wraps `useQuery` with type-safe RPC name and input:

Call `usePikkuQuery(name, input)` with an RPC name and its input, for example `usePikkuQuery('getUser', { userId })`. It returns the usual React Query result (`data`, `isLoading`, `error`, and the rest), and `data` is fully typed to match your function's output type.

The query key is automatically set to `[name, data]`, so queries with different inputs cache separately.

You can pass any standard `useQuery` options as the third argument:

Options go in the third argument: `usePikkuQuery('getUser', { userId }, { staleTime: 5000, refetchInterval: 10000 })`.

### `usePikkuMutation`

For writes. Wraps `useMutation`:

Call `usePikkuMutation(name)` with an RPC name, for example `usePikkuMutation('createTodo')`. It returns the usual mutation result (`mutate`, `isPending`, and the rest), and you run it with `mutate({ title: 'Buy milk' })`.

The `mutate` callback is typed — it only accepts your function's input type and the result matches the output type.

### `usePikkuInfiniteQuery`

For paginated data. Only available for functions whose output includes `nextCursor` — the codegen detects this structurally, so any function shaped that way qualifies, not just ones built with a specific factory.

The recommended way to build one is `pikkuListFunc` (from `#pikku/function`), which bakes in the standard `ListInput`/`ListOutput` cursor contract (`cursor`/`limit`/`sort`/`filter`/`search` in, `{ rows, nextCursor, totalCount }` out) so every paginated RPC in your app shares one shape:

A `pikkuListFunc<Filter, Row>({ func, expose: true })` takes the typed list input and returns `{ rows, nextCursor, totalCount }`. The `func` receives `cursor`, `limit`, `filter`, `sort` and `search` already typed.

A plain `pikkuFunc`/`pikkuSessionlessFunc` with an ad-hoc output containing `nextCursor` also works — `pikkuListFunc` just gives you the shared shape for free instead of hand-rolling it each time.

Call `usePikkuInfiniteQuery('listItems', { limit: 20 })`. It returns `data.pages` (each page has `rows`), plus `fetchNextPage` and `hasNextPage`. Flatten `data.pages` to render every row, and render a "Load more" button that calls `fetchNextPage()` while `hasNextPage` is true.

The cursor handling is wired up automatically — `getNextPageParam` and `initialPageParam` are set for you. You just pass the input data without `nextCursor` (it's managed by the infinite query).

If a function's output doesn't have `nextCursor`, TypeScript won't let you use it with `usePikkuInfiniteQuery`. That's intentional.

## Workflow Hooks

If your project uses [Workflows](/docs/wiring/workflows), the generated file also includes:

- **`useRunWorkflow(name)`** — mutation that runs a workflow to completion
- **`useStartWorkflow(name)`** — mutation that starts a workflow and returns `{ runId }`
- **`useWorkflowStatus(name, runId)`** — query that polls workflow status by `runId`

## Type Safety

The generated hooks are type-checked at compile time. Invalid RPC names, wrong input shapes, and incorrect usage all produce TypeScript errors:

- A correct name and input compiles: `usePikkuQuery('getUser', { userId: '123' })`.
- An unknown RPC name is a TypeScript error.
- A wrong input type is a TypeScript error.
- Using `usePikkuInfiniteQuery` on a function whose output has no `nextCursor` is a TypeScript error.

## Dates come back mixed, and the type system won't tell you

The generated clients run `transformDates` over every response. It revives **fully-zoned
ISO-8601 instants** — `2026-03-14T08:12:00Z`, `2026-03-14T08:12:00.000+01:00` — into `Date`
objects, and leaves everything else exactly as the server sent it. A bare `2026-03-14`, a
zoneless `2026-03-14T08:12:00` and an impossible `2026-02-31T00:00:00Z` all stay strings.

So a field's runtime type follows the **value**, not the schema: the same column can arrive
as a `Date` from one row and a string from the next. Both ways of getting this wrong
compile, and both fail at runtime:

- Calling a string method on it, like `split('T')` to peel off the date part. There is no string to slice.
- Rendering it directly as a React child. React throws "Objects are not valid as a React child (found: [object Date])" and drops the route into its error boundary.

Format before rendering, with a date library that accepts either a `Date` or a string.

Coercing a revived `Date` instead of formatting it (`` `${d}` ``, `String(d)`) does not crash,
but prints `Date.prototype.toString()` in the runtime's own time zone and locale format —
something like `Mon Jun 15 2026 02:00:00 GMT+0200`, and not the same on every device.

## Next Steps

- [Exposed RPCs](/docs/wiring/rpcs/external) — How functions get exposed to clients
- [Fetch Client](/docs/wiring/http/fetch-client) — Lower-level type-safe HTTP client
- [Workflows](/docs/wiring/workflows) — Multi-step processes with React Query hooks
