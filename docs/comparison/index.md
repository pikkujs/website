---
sidebar_position: 0
title: How Pikku Compares
---

# How Pikku Compares

Pikku takes a different approach from traditional backend frameworks. Rather than coupling your business logic to a specific transport (HTTP, WebSocket, CLI), Pikku separates **what your code does** from **how it's delivered**.

This page explains the key architectural differences.

## Transport-Agnostic Functions

Most frameworks tightly bind functions to a transport layer:

```typescript
// Express — function is an HTTP handler
app.post('/users', async (req, res) => {
  const user = await createUser(req.body)
  res.json(user)
})

// Pikku — function is transport-agnostic
export const createUser = pikkuFunc<CreateUserInput, User>({
  func: async (services, data) => {
    return await services.database.insert('users', data)
  }
})

// Then wire it to any transport
wireHTTP({ method: 'post', route: '/users', func: createUser })
wireQueueWorker({ queue: 'user-creation', func: createUser })
wireCLI({ commands: { create: pikkuCLICommand({ func: createUser }) } })
```

The same function works across HTTP, WebSockets, queues, CLI, MCP, and scheduled tasks — without any modification.

## Compared to Express / Fastify / Hono

| | Express / Fastify / Hono | Pikku |
|---|---|---|
| **Function signature** | `(req, res)` — tied to HTTP | `(services, data)` — transport-agnostic |
| **Validation** | Manual or plugin-based | Automatic from Standard Schema |
| **Multi-transport** | One transport per framework | Wire to HTTP, WS, CLI, MCP, queues |
| **Type generation** | Manual OpenAPI → types | Types generated from your code |
| **Runtime portability** | Framework-specific deployment | Same code runs on Lambda, Cloudflare, Express, etc. |
| **Middleware** | Request/response middleware | Function-level middleware (transport-independent) |

Pikku **uses** Express, Fastify, and similar frameworks as runtime adapters. You can use `@pikku/express` or `@pikku/fastify` to serve your Pikku functions — they aren't competitors but complementary layers.

## Compared to tRPC

| | tRPC | Pikku |
|---|---|---|
| **Type sharing** | Client ↔ server type inference | Generated types + fetch client |
| **Transport** | HTTP (with WebSocket adapter) | HTTP, WebSocket, CLI, MCP, queues, scheduled |
| **Validation** | Zod (primarily) | Any Standard Schema (Zod, ArkType, Valibot) |
| **Runtime portability** | Node.js adapters | Lambda, Cloudflare, Express, Fastify, uWS, etc. |
| **Workflows** | Not included | Built-in multi-step workflows with state |
| **AI agents** | Not included | Built-in AI agent framework |
| **Client** | Type-safe proxy client | Generated fetch + WebSocket clients |

tRPC excels at end-to-end type safety for TypeScript-only stacks. Pikku provides similar type safety but extends to more transports and includes higher-level features like workflows and AI agents.

## Compared to Serverless Framework / SST

| | Serverless Framework / SST | Pikku |
|---|---|---|
| **Focus** | Infrastructure & deployment | Application logic & wiring |
| **Function definition** | Cloud-native handler signature | Transport-agnostic signature |
| **Local development** | Emulated cloud services | Native local execution |
| **Multi-cloud** | Cloud-specific bindings | Same code, swap runtime adapter |
| **Testing** | Requires cloud emulation | Test functions directly as plain TypeScript |

Pikku and infrastructure tools are complementary. Use Pikku to write your functions, then deploy with Serverless Framework, CDK, or Terraform.

## Key Differentiators

### Write Once, Wire Anywhere

A single function definition can serve as an HTTP endpoint, a queue worker, a CLI command, an MCP tool, a WebSocket handler, and a scheduled task — simultaneously.

### Runtime Portability

Switch from Express to AWS Lambda to Cloudflare Workers by changing the runtime adapter, not your business logic.

### Built-in Orchestration

Workflows, queue workers, scheduled tasks, triggers, and AI agents are first-class features — not external libraries to integrate.

### Generated Code

The Pikku CLI inspects your code and generates type-safe wiring, OpenAPI specs, fetch clients, and CLI executables.
