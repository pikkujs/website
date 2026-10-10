---
title: TriggerService
ai: true
---

The TriggerService manages [Trigger](/docs/wiring/triggers) subscriptions — it starts the registered trigger sources, listens for their events, and dispatches each firing to its wired RPC targets or workflow starts. Nothing fires until one is registered as the `triggerService` singleton and `start()` has been called. `pikku dev` and `pikku serve` register `InMemoryTriggerService` but leave it stopped; start it from your entrypoint — or a `pikkuServerLifecycle` `beforeStart` hook — and stop it again on shutdown.

## Interface

Source: [`trigger-service.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/trigger-service.ts)

## Methods

### `start(): Promise<void>`

Starts all triggers that have both a `wireTrigger` declaration and a matching `wireTriggerSource` registration. Sources without targets are skipped with a log line.

### `stop(): Promise<void>`

Tears down all active trigger subscriptions. Call on graceful shutdown.

## Implementations

### InMemoryTriggerService (built-in)

Single-owner, in-process implementation: one process runs all triggers, with no distributed claiming. On fire, it invokes the target through the RPC service.

Import `InMemoryTriggerService` from `@pikku/core/services`, construct it with no arguments and await `start()`. On shutdown, await `stop()`.

Source: [`in-memory-trigger-service.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/in-memory-trigger-service.ts)

:::info
Like the [GatewayService](./gateway-service), running the in-memory implementation on every instance of a multi-instance deployment duplicates subscriptions — coordinate ownership (leader election) if you scale out.
:::
