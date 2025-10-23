---
sidebar_position: 0
title: Getting Started
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

The starter project includes example functions and routes so you can immediately see Pikku in action.

## Run and Verify

After installation completes, navigate to your project directory and start the development server:

```bash npm2yarn
npm start
```

The server will start on `http://localhost:3000`. You can verify it's working by testing the example endpoint:

```bash
curl http://localhost:3000/api/hello-world
```

You should see a response from your first Pikku function!

## Your First Function

Let's look at the Hello World function that came with the starter. Open `functions/hello-world.function.ts`:

```typescript
import { pikkuFunc } from '@pikku/core'

export const helloWorld = pikkuFunc({
  func: async () => {
    return { message: 'Hello from Pikku!' }
  }
})
```

This function is wired to an HTTP route in `http.ts`:

```typescript
import { wireHTTP } from '@pikku/core'
import { helloWorld } from './functions/hello-world.function'

wireHTTP({ route: '/api/hello-world', func: helloWorld })
```

That's it! The same function could also be wired to WebSockets, queues, or scheduled tasks without changing its implementation. This is Pikku's core philosophy: **write once, run anywhere**.

## Understanding the CLI

Pikku includes a CLI tool that generates code as you work. When you modify your functions or wirings, run:

```bash npm2yarn
npm run pikku watch
```

This runs the CLI in watch mode, which:

1. Scans your codebase for `pikkuFunc` definitions and wirings
2. Generates type definitions to provide autocomplete and type safety
3. Creates validation schemas for your functions
4. Indexes routes and channels for fast lookup

The CLI generates two key files you'll import in your code:

- **`#pikku/pikku-types.gen.ts`** – Type definitions for your entire API
- **`#pikku/pikku-bootstrap.gen.ts`** – Bootstrap code that wires up all your functions

These files are regenerated whenever you change your functions or wirings. Don't edit them manually – they're automatically kept in sync with your source code.

## Project Structure

Here's a brief overview of the core files:

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `start.ts`                   | Server entry point that initializes your runtime and imports the bootstrap                                  |
| `services.ts`               | Centralized management of services (database, cache, auth, etc.) available to all functions                 |
| `channels.ts`               | WebSocket channel definitions – where you wire functions to real-time channels                              |
| `http.ts`                   | HTTP endpoint definitions – where you wire functions to HTTP routes                                          |
| `scheduled-tasks.ts`        | Cron job definitions – where you wire functions to run on schedules                                          |
| `types/application-types.d.ts` | TypeScript type extensions for your application's services and session                                   |

When you define wirings in `http.ts`, `channels.ts`, etc., the Pikku CLI automatically includes them in the generated bootstrap file. Your `start.ts` only needs to import the bootstrap – everything else is handled for you.

### The Config File

The `pikku.config.json` file configures the Pikku CLI. It tells the CLI where to find your functions, where to generate output files, and how to process your code.

```json reference
https://raw.githubusercontent.com/pikkujs/yarn-workspace-starter/blob/main/pikku.config.json
```

## Next Steps

Now that you have a working Pikku project, you're ready to dive deeper:

- **[Functions](/docs/core-features/functions)** – Learn how to write Pikku functions and understand their signature
- **[Middleware](/docs/core-features/middleware)** – Add request processing, logging, and other cross-cutting concerns
- **[Services](/docs/core-features/services)** – Set up databases, caches, and other external integrations
- **[HTTP](/docs/http)** – Wire functions to HTTP endpoints with routing, query params, and more
- **[Channels](/docs/channels)** – Add real-time WebSocket communication
- **[Scheduled Tasks](/docs/scheduled-tasks)** – Run functions on a schedule (cron jobs)

Questions or need help? Check out our [GitHub discussions](https://github.com/pikkujs/pikku) – we're happy to help you get going with Pikku!
