---
title: GatewayService
ai: true
---

The GatewayService manages the lifecycle of listener gateways — the adapters that connect [Gateway wirings](/docs/wiring/gateway) (Slack, Discord, Telegram, etc.) to your functions. It initializes each registered listener adapter and delivers incoming platform messages to handler functions. Full-server runtimes and `pikku dev` start it for you; you provide one when running gateways in your own server process.

## Interface

```typescript reference title="gateway-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/gateway-service.ts
```

## Methods

### `start(): Promise<void>`

Starts all registered listener gateways — initializes each adapter with a message handler that routes incoming messages to the wired functions.

### `stop(): Promise<void>`

Closes all active adapters. Call on graceful shutdown.

## Implementations

### LocalGatewayService (built-in)

Starts every registered listener gateway unconditionally — the right choice for a single process.

```typescript
import { LocalGatewayService } from '@pikku/core/services'

const gatewayService = new LocalGatewayService()
await gatewayService.start()

// On shutdown
await gatewayService.stop()
```

```typescript reference title="local-gateway-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-gateway-service.ts
```

:::info
In a multi-instance deployment, running `LocalGatewayService` on every instance means every instance opens its own platform connection. Implement `GatewayService` with leader election (or similar coordination) so exactly one instance holds the listeners.
:::
