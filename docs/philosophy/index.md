---
sidebar_position: 0
title: Introduction
---

# Introduction to Pikku

**Pikku is a TypeScript backend that adapts.** Write your business logic once as plain functions. Wire them to any protocol — HTTP, WebSockets, queues, scheduled tasks, CLI, or AI agent tools — without changing a line of that logic.

Define once. Run anywhere. No lock-in. Just TypeScript.

## The Problem

Traditional backend frameworks lock you into choices before you've written a line of business logic:

- **Express/Fastify** — Great for servers, but bundling the whole framework into a serverless function is wasteful
- **AWS Lambda** — Great for isolated functions, but fragments your logic across services
- **NestJS** — Heavy runtime with decorator-based patterns that make tree-shaking and portability hard

The result: you're forced to choose your architecture upfront. Want to move a hot path to serverless? Extract a microservice? Add a background queue? That's a rewrite, not a config change.

Types drift. Logic fragments. Vendor lock-in creeps in.

## The Pikku Answer

**Architecture becomes a deployment decision, not a coding decision.**

Write your function once:

```typescript
export const sendWelcomeEmail = pikkuFunc<SendWelcomeEmailInput>(
  async ({ email }, data) => {
    await email.send({ to: data.userEmail, subject: 'Welcome!', body: `Hello ${data.userName}!` })
    return { sent: true }
  }
)
```

Wire it to whatever you need:

```typescript
// Process from a background queue
wireQueueWorker({ queue: 'emails', func: sendWelcomeEmail })

// Or trigger on a schedule
wireScheduler({ schedule: '0 9 * * *', func: sendDailyDigest })
```

Same business logic. Different entry points. Zero duplication.

## What's in This Section

- **[Vision](/docs/philosophy/vision)** — The three principles that shape how Pikku is built
- **[Architecture](/docs/philosophy/architecture)** — How functions, wiring, and the CLI fit together
- **[Types & Schemas](/docs/philosophy/types-and-schemas)** — How TypeScript types drive validation, clients, and docs automatically
- **[Typed Clients](/docs/philosophy/typed-clients)** — The generated clients that make end-to-end type safety real
- **[Limitations](/docs/philosophy/limitations)** — Where Pikku is deliberately scoped, and what it doesn't do

---

Ready to build? Start with [Getting Started](/docs).
