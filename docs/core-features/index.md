---
sidebar_position: 0
title: Overview
description: How does it work?
---

## What is Pikku?

Pikku is a TypeScript backend that adapts – write your logic once and run it anywhere. Like a chameleon, Pikku keeps your core logic intact while adapting to HTTP, WebSockets, queues, scheduled tasks, and more. Whether you deploy to Express, AWS Lambda, Cloudflare Workers, or any other runtime, your business logic stays the same. This means you can start simple and evolve your architecture without refactoring.

This guide covers the **core fundamentals** of Pikku through a practical setup walkthrough.

## Prerequisites

Ensure that [Node.js](https://nodejs.org) (version >= 18) is installed on your operating system.

## Installation

Begin by creating a new Pikku project using **npm create**:

```bash npm2yarn
npm create pikku@latest
```

This will guide you through setting up a project:

<AsciinemaPlayer type="installing" autoPlay />

The starter project is a small **todos app** with functions already wired to the transports you picked during setup, so you can immediately see Pikku in action.

## Run and Verify

After installation completes, navigate to your project directory and start the development server:

```bash npm2yarn
npm run dev
```

You can verify it's working by testing one of the example endpoints:

```bash
curl http://localhost:4002/todos
```

You should see a JSON list of todos coming back from your first Pikku function!

## Your First Function

Let's look at the functions that came with the starter. Open `src/functions/todos.functions.ts`:

```typescript
import { pikkuSessionlessFunc } from '#pikku/function'
import { ListTodosWithUserInputSchema, TodoListResponseSchema } from '../schemas.js'

/**
 * List todos for a user with optional filters.
 */
export const listTodos = pikkuSessionlessFunc({
  input: ListTodosWithUserInputSchema,
  output: TodoListResponseSchema,
  func: async ({ logger, todoStore }, { userId, completed, priority, tag }) => {
    const uid = userId || 'user1'
    const todos = todoStore.getTodosByUser(uid, { completed, priority, tag })
    logger.info(`Listed ${todos.length} todos for user ${uid}`)
    return { todos, total: todos.length }
  },
})
```

The function receives your **services** (like `logger` and `todoStore`) as its first argument and validated **input data** as its second. It knows nothing about HTTP.

The wiring lives separately, in `src/wirings/todos.http.ts`:

```typescript
import { defineHTTPRoutes, wireHTTPRoutes } from '#pikku/http'
import { listTodos, getTodo, createTodo, updateTodo, deleteTodo, completeTodo } from '../functions/todos.functions.js'

const todosRoutes = defineHTTPRoutes({
  auth: false,
  tags: ['todos'],
  routes: {
    list: { method: 'get', route: '/todos', func: listTodos },
    get: { method: 'get', route: '/todos/:id', func: getTodo },
    create: { method: 'post', route: '/todos', func: createTodo },
    update: { method: 'put', route: '/todos/:id', func: updateTodo },
    delete: { method: 'delete', route: '/todos/:id', func: deleteTodo },
    complete: { method: 'post', route: '/todos/:id/complete', func: completeTodo },
  },
})

wireHTTPRoutes({ routes: { todos: todosRoutes } })
```

You can also wire a single route with `wireHTTP({ method: 'get', route: '/todos', func: listTodos })` — route groups just make shared config (like `auth` and `tags`) easier.

That's it! The same functions are also wired to MCP, CLI, and WebSocket in the starter (depending on the features you selected) without changing their implementation. That's Pikku's core philosophy: **write once, run anywhere**.

## Understanding the CLI

Pikku includes a CLI that generates code as you work. It runs automatically after install (`postinstall: pikku all`), and you can rerun it any time:

```bash
npx pikku all
```

Or keep it running alongside your server during development:

```bash
npx pikku dev
```

The CLI:

1. Scans your codebase for function definitions and wirings
2. Generates type definitions to provide autocomplete and type safety
3. Creates validation schemas for your functions
4. Indexes routes, channels, queues, and commands for fast lookup

Everything it produces lands in the `.pikku/` directory, one barrel per concern. There is no single `#pikku` import — you import from the door for the concern you're using:

```typescript
import { pikkuFunc } from '#pikku/function'
import { wireHTTP } from '#pikku/http'
import { wireScheduler } from '#pikku/scheduler'
```

Function definers live behind [`#pikku/function`](/docs/api-reference/create/function), each transport behind its own wiring door (`#pikku/http`, `#pikku/queue`, `#pikku/scheduler`, …), and the rest — errors, middleware, secrets, variables, permissions — behind theirs. The [API reference](/docs/api-reference) lists every door and what it exports. These files are regenerated whenever you change your functions or wirings — don't edit them manually.

For more details, see [Import Patterns](/docs/advanced/import-patterns) and [Generated Files](/docs/pikku-cli/generated-files).

## Project Structure

Here's a brief overview of the core files in a scaffolded project:

| **File**                        | **Description**                                                                                    |
|---------------------------------|----------------------------------------------------------------------------------------------------|
| `src/start.ts`                  | Server entry point that initializes your runtime and imports the generated bootstrap               |
| `src/services.ts`               | Centralized management of services (database, cache, auth, etc.) available to all functions        |
| `src/schemas.ts`                | Zod schemas shared between functions for input/output validation                                    |
| `src/functions/`                | Your business logic — `todos.functions.ts` and friends                                              |
| `src/wirings/`                  | Where functions meet transports — `todos.http.ts`, `scheduled.wiring.ts`, `mcp.wiring.ts`, etc.     |
| `types/application-types.d.ts`  | TypeScript type extensions for your application's services and session                              |

When you add wirings under `src/wirings/`, the Pikku CLI automatically includes them in the generated bootstrap file. Your `start.ts` only needs to import the bootstrap – everything else is handled for you.

### The Config File

The `pikku.config.json` file configures the Pikku CLI. It tells the CLI where to find your functions (`srcDirectories`), where to generate output files, and which clients to produce.

```json reference
https://github.com/pikkujs/pikku/blob/main/templates/functions/pikku.config.json
```

## Next Steps

Now that you have a working Pikku project, you're ready to dive deeper:

- **[Functions](/docs/core-features/functions)** – Learn how to write Pikku functions and understand their signature
- **[Middleware](/docs/core-features/middleware)** – Add request processing, logging, and other cross-cutting concerns
- **[Services](/docs/core-features/services)** – Set up databases, caches, and other external integrations
- **[HTTP](/docs/wiring/http)** – Wire functions to HTTP endpoints with routing, query params, and more
- **[Channels](/docs/wiring/channels)** – Add real-time WebSocket communication
- **[Scheduled Tasks](/docs/wiring/scheduled-tasks)** – Run functions on a schedule (cron jobs)
- **[The Console](/docs/console)** – Explore your app visually with the Pikku Console

Questions or need help? Check out our [GitHub discussions](https://github.com/pikkujs/pikku) – we're happy to help you get going with Pikku!
