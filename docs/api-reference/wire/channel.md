---
title: '#pikku/channel'
sidebar_label: '#pikku/channel'
sidebar_position: 1
description: 'Wires a function to a websocket channel, its message routes and its pub/sub topics.'
---

# `#pikku/channel`

Wires a function to a websocket channel, its message routes and its pub/sub topics.

```typescript
import { defineChannelRoutes, pikkuChannelConnectionFunc, pikkuChannelDisconnectionFunc } from '#pikku/channel'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`defineChannelRoutes`](#definechannelroutes) | function | Type-safe helper for defining channel message routes that can be composed. Returns the routes record as-is for use with wireChannel's onMessageWiring. |
| [`pikkuChannelConnectionFunc`](#pikkuchannelconnectionfunc) | function | Creates a function that handles WebSocket channel connections. Called when a client connects to a channel. |
| [`pikkuChannelDisconnectionFunc`](#pikkuchanneldisconnectionfunc) | function | Creates a function that handles WebSocket channel disconnections. Called when a client disconnects from a channel. |
| [`pikkuChannelFunc`](#pikkuchannelfunc) | function | Creates a function that handles WebSocket channel messages. Called when a message is received on a channel. |
| [`wireChannel`](#wirechannel) | function | Registers a WebSocket channel with the Pikku framework. |

## Reference

### `defineChannelRoutes` {#definechannelroutes}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Type-safe helper for defining channel message routes that can be composed.
Returns the routes record as-is for use with `wireChannel`'s onMessageWiring.

```typescript
defineChannelRoutes: <T extends Record<string, any>>(routes: T) => T
```

```typescript
type: defineChannelRoutes({
  subscribe: subscribeToOrder,
  unsubscribe: unsubscribeFromOrder,
}),
```

### `pikkuChannelConnectionFunc` {#pikkuchannelconnectionfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function that handles WebSocket channel connections.
Called when a client connects to a channel.

```typescript
pikkuChannelConnectionFunc: <Out = unknown>(func: PikkuFunctionSessionless<void, Out, "channel" | "session" | "rpc"> | PikkuFunctionConfig<void, Out, "channel" | "session" | "rpc">) => PikkuFunctionConfig<void, Out, "channel" | "rpc" | "session">
```

```typescript
export const onConnect = pikkuChannelConnectionFunc(
  async ({ logger }, _, { channel }) => {
    logger.info({ event: 'ws_connected', channelId: channel.channelId })
  }
)

export const onDisconnect = pikkuChannelDisconnectionFunc(
  async ({ logger }, _, { channel }) => {
    logger.info({ event: 'ws_disconnected', channelId: channel.channelId })
  }
)
```

### `pikkuChannelDisconnectionFunc` {#pikkuchanneldisconnectionfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function that handles WebSocket channel disconnections.
Called when a client disconnects from a channel.

```typescript
pikkuChannelDisconnectionFunc: (func: PikkuFunctionSessionless<void, void, "channel"> | PikkuFunctionConfig<void, void, "channel" | "session" | "rpc">) => PikkuFunctionConfig<void, void, "channel" | "rpc" | "session">
```

```typescript
export const onConnect = pikkuChannelConnectionFunc(
  async ({ logger }, _, { channel }) => {
    logger.info({ event: 'ws_connected', channelId: channel.channelId })
  }
)

export const onDisconnect = pikkuChannelDisconnectionFunc(
  async ({ logger }, _, { channel }) => {
    logger.info({ event: 'ws_disconnected', channelId: channel.channelId })
  }
)
```

### `pikkuChannelFunc` {#pikkuchannelfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function that handles WebSocket channel messages.
Called when a message is received on a channel.

Supports two patterns:
1. Generic types: `pikkuChannelFunc&lt;Input, Output&gt;(&#123; func: ... &#125;)`
2. Zod schemas: `pikkuChannelFunc(&#123; input: z.object(...), func: ... &#125;)`

```typescript
pikkuChannelFunc: { <InputSchema extends StandardSchemaV1, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuChannelFuncConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InferSchemaOutput<InputSchema>, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "channel" | "session" | "rpc">; <In, Out = unknown>(func: PikkuFunctionSessionless<In, Out, "channel" | "session" | "rpc"> | PikkuFunctionConfig<In, Out, "channel" | "session" | "rpc">): PikkuFunctionConfig<In, Out, "channel" | "session" | "rpc">; }
```

```typescript
export const subscribeToOrder = pikkuChannelFunc<{ orderId: string }, void>(
  async ({ eventHub }, { orderId }, { channel }) => {
    await eventHub?.subscribe(`order:${orderId}`, channel.channelId)
  }
)

export const unsubscribeFromOrder = pikkuChannelFunc<{ orderId: string }, void>(
  async ({ eventHub }, { orderId }, { channel }) => {
    await eventHub?.unsubscribe(`order:${orderId}`, channel.channelId)
  }
)
```

### `wireChannel` {#wirechannel}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a WebSocket channel with the Pikku framework.

```typescript
wireChannel: <ChannelData, Channel extends string>(channel: ChannelWiring<ChannelData, Channel> & AssertHTTPWiringParams<ChannelData, Channel>) => void
```

<details>
<summary>Config keys (12)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `boolean` | Whether opening the channel requires a session. Defaults to true — a channel is closed unless it says otherwise. |
| `binary` | `boolean \| undefined \| null` | Whether this channel carries binary frames. Text frames are still parsed as JSON. |
| `channelMiddleware` | `(CorePikkuChannelMiddleware<any, unknown> \| CorePikkuChannelMiddlewareFactory<any, any, u…` | Wraps every message, which is where per-message concerns like rate limiting belong. |
| `middleware` | `PikkuMiddleware[]` | Wraps the connection: it runs on connect, where the session is established, not on every message. |
| `name` <sup>required</sup> | `string` | Unique across the project. It is how the channel is addressed in `pikku meta` and by the generated client. |
| `onBinaryMessage` | `((services: any, data: BinaryData, channel: PikkuChannel<ChannelData, any, ChannelRemote>…` | Handles binary frames, which never reach `onMessage` because they are not JSON. Return a value to reply in kind. |
| `onConnect` | `PikkuFunctionConfig<void, any, "channel" \| "rpc" \| "session"> \| { func?: PikkuFunctionCon…` | Runs once when a client connects, before any message. Its return value is sent as the first message. |
| `onDisconnect` | `PikkuFunctionConfig<void, void, "channel" \| "rpc" \| "session"> \| { func?: PikkuFunctionCo…` |  |
| `onMessage` | `PikkuFunctionConfig<any, any, "channel" \| "rpc" \| "session">` | Handles any message that no `onMessageWiring` entry claimed. Without one, an unrouted message is dropped. |
| `onMessageWiring` | `Record<string, Record<string, PikkuFunctionConfig<any, any, "channel" \| "rpc" \| "session"…` | Routes messages by a key in their payload: the outer key is the field to switch on, the inner key its value. This is how one socket carries many operations. |
| `route` <sup>required</sup> | `string` | The path a client opens the socket on. |
| `tags` | `string[]` | Filters this channel in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
wireChannel({
  name: 'order-status',
  route: '/orders/status',
  auth: true,
  onConnect,
  onDisconnect,
  onMessageWiring: {
    type: defineChannelRoutes({
      subscribe: subscribeToOrder,
      unsubscribe: unsubscribeFromOrder,
    }),
  },
})
```

## Inside an addon

Addon authors import this door as `#pikku/addon/channel`, with one difference:

- Not available: `wireChannel` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc channel` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
