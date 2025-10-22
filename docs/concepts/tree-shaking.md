---
sidebar_position: 6
---

# Tree-Shaking and Filtering

Pikku analyzes your wirings at build time to generate optimized entry points. This allows you to deploy the same codebase as a monolith, microservices, or individual functions without code changes.

## How It Works

When you run `pikku`, the CLI:

1. **Scans your codebase** for `pikkuFunc` definitions and wirings (`wireHTTP`, `wireChannel`, `wireQueueWorker`, etc.)
2. **Applies filters** based on CLI arguments (`--http-routes`, `--tags`, `--types`)
3. **Determines required services** by analyzing which services each filtered function uses
4. **Generates an entry point** that imports only the needed functions and services

```typescript
// Your code - write once
export const getUser = pikkuFunc({
  func: async ({ database }) => { /* ... */ }
})

export const deleteUser = pikkuFunc({
  func: async ({ database, audit }) => { /* ... */ }
})

export const getStatus = pikkuFunc({
  func: async ({ cache }) => { /* ... */ }
})

wireHTTP({ route: '/users/:id', func: getUser })
wireHTTP({ route: '/admin/users/:id', func: deleteUser })
wireHTTP({ route: '/status', func: getStatus })
```

### Deploy Everything

```bash
pikku
```

Generates an entry point that imports all three functions and instantiates all services: `database`, `audit`, `cache`.

### Deploy Filtered Subset

```bash
pikku --http-routes=/status
```

Generates an entry point that:
- ✅ Imports only `getStatus`
- ✅ Instantiates only `cache` service
- ❌ Does NOT import `getUser` or `deleteUser`
- ❌ Does NOT instantiate `database` or `audit` services

This means your health check endpoint has zero database connection overhead.

## Filter Types

### By Route

```bash
pikku --http-routes=/admin
```

Include only functions wired to routes matching `/admin`.

### By Tags

Tag your functions:

```typescript
export const generateReport = pikkuFunc({
  func: async ({ database }) => { /* ... */ },
  docs: {
    tags: ['reports', 'background']
  }
})
```

Then filter:

```bash
pikku --tags=reports
```

### By Protocol Type

```bash
pikku --types=http        # Only HTTP handlers
pikku --types=queue       # Only queue workers
pikku --types=http,queue  # Multiple types
```

### Combining Filters

```bash
pikku --http-routes=/admin --tags=payments
```

Filters use AND logic - functions must match all criteria.

## Service Loading

Pikku generates a `services.ts` file that dynamically loads only the services your filtered functions need:

```typescript
// Generated services.ts
import { createDatabase } from '../services/database'
import { createCache } from '../services/cache'

export async function createServices() {
  return {
    cache: await createCache(),
    // database and audit are NOT loaded
  }
}
```

### Why This Isn't More Magical

Unlike dependency injection frameworks like NestJS, Pikku:

- **Doesn't use decorators or reflection** - Just static analysis of your code
- **Doesn't automatically wire dependencies** - You explicitly declare what each function needs
- **Doesn't have a runtime DI container** - Services are created once at startup, passed to functions

This is intentional. It means:

1. **Faster cold starts** - No reflection or decorator processing at runtime
2. **Explicit dependencies** - Clear what each function needs
3. **Better tree-shaking** - Bundlers can eliminate unused code
4. **Simpler mental model** - No magic, just functions and imports

## Architecture Evolution

The same codebase can be deployed differently as your needs change:

### Phase 1: Monolith

```bash
pikku
```

Simple deployment, everything in one process.

### Phase 2: Split Services

```bash
# Public API
pikku --tags=public

# Admin service
pikku --tags=admin

# Background workers
pikku --types=queue
```

Independent deployment and scaling per service.

### Phase 3: Individual Functions

```bash
# One Lambda per critical endpoint
pikku --http-routes=/users/:id --types=http
```

Maximum isolation and optimization.

**No code changes required.**

## What Pikku Generates

Pikku generates entry points with filtered imports. You then use your bundler of choice (esbuild, webpack, etc.) to create the final bundle.

```typescript
// .pikku/entry.ts (generated)
import { getStatus } from '../src/functions/status'
import { createServices } from './services'
import { createHTTPHandler } from '@pikku/runtime-express'

const services = await createServices()
const handler = createHTTPHandler([
  { route: '/status', func: getStatus }
], services)

export default handler
```

The generated code is readable and straightforward - no magic.
