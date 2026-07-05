---
title: TriggerService
ai: true
---

The TriggerService manages [Trigger](/docs/wiring/triggers) subscriptions — it starts the registered trigger sources, listens for their events, and dispatches each firing to its wired RPC targets or workflow starts. Full-server runtimes and `pikku dev` start it for you; you provide one when running triggers in your own server process.

## Interface

```typescript reference title="trigger-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/trigger-service.ts
```

## Methods

### `start(): Promise<void>`

Starts all triggers that have both a `wireTrigger` declaration and a matching `wireTriggerSource` registration. Sources without targets are skipped with a log line.

### `stop(): Promise<void>`

Tears down all active trigger subscriptions. Call on graceful shutdown.

## Implementations

### InMemoryTriggerService (built-in)

Single-owner, in-process implementation: one process runs all triggers, with no distributed claiming. On fire, it invokes the target through the RPC service.

```typescript
import { InMemoryTriggerService } from '@pikku/core/services'

const triggerService = new InMemoryTriggerService()
await triggerService.start()

// On shutdown
await triggerService.stop()
```

```typescript reference title="in-memory-trigger-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/in-memory-trigger-service.ts
```

:::info
Like the [GatewayService](./gateway-service), running the in-memory implementation on every instance of a multi-instance deployment duplicates subscriptions — coordinate ownership (leader election) if you scale out.
:::
