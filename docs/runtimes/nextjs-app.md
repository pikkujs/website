---
title: Next.js
description: Using Pikku with Next.js App Router
hide_title: true
image: /img/logos/nextjs-light.png
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku integrates with Next.js App Router, letting you call Pikku functions from server components, server actions, and API routes — without running a separate server.

## Setup

Install the runtime package:

```bash
npm install @pikku/next
```

Configure the CLI to generate the Next.js integration files in `pikku.config.json`:

```json
{
  "clientFiles": {
    "nextBackendFile": "./pikku-next.gen.ts",
    "nextHTTPFile": "./pikku-next-http.gen.ts"
  }
}
```

Then run the CLI:

```bash
npx pikku nextjs
```

This generates:
- **`pikku-next.gen.ts`** — a `pikku()` helper for calling functions from server components and server actions
- **`pikku-next-http.gen.ts`** — an HTTP route handler for API routes (requires `fetchFile` to also be configured)

## Server-Side Usage

The generated `pikku()` function gives you typed access to your Pikku functions from server components and actions:

### Server Actions

```typescript
async function addTodo(text: string) {
  'use server'
  await pikku().post('/todo', { text })
}
```

### SSR Data Loading

Load data directly in server components:

```typescript
export default async function TodoPage() {
  const todos: Todos = await pikku().get('/todos', null)
  return <TodosCard todos={todos} />
}
```

### Static SSR (No Session)

For data loading that doesn't depend on the user session (e.g., build-time rendering), use `staticGet` to skip reading headers:

```typescript
export default async function PublicPage() {
  const posts = await pikku().staticGet('/posts', null)
  return <PostList posts={posts} />
}
```

## API Route Handler

Mount Pikku as a Next.js API route handler for external HTTP access:

```typescript
// app/api/[...pikku]/route.ts
import { pikkuNextHTTPHandler } from './pikku-next-http.gen'

export const GET = pikkuNextHTTPHandler
export const POST = pikkuNextHTTPHandler
export const PUT = pikkuNextHTTPHandler
export const DELETE = pikkuNextHTTPHandler
```

## Sub-path Exports

| Import | Description |
|--------|-------------|
| `@pikku/next` | `PikkuNextJS` class — core integration |
| `@pikku/next/pikku-next-request` | Next.js request adapters (action, SSR, static) |
| `@pikku/next/pikku-session` | `getSession()` — extract user session from a Next.js request via middleware |

### Session Extraction

Use `getSession` to read the user session from a Next.js request (e.g., in middleware or API routes):

```typescript
import { getSession } from '@pikku/next/pikku-session'

const session = await getSession(request, singletonServices, [
  authBearerMiddleware(),
])
```

## How It Works

The `PikkuNextJS` class:

1. Creates singleton services on first call (cached for subsequent requests)
2. Converts Next.js requests to Pikku's internal request format
3. Runs your function through the standard Pikku pipeline (middleware, validation, execution)
4. Returns the typed result

Server actions use `PikkuActionNextRequest` which reads headers from Next.js's `headers()` API. Static calls skip header reading entirely.
