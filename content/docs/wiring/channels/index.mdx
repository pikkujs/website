---
sidebar_position: 0
title: Introduction
description: Real-time WebSocket channels
---

# Channels

Channels provide real-time, bidirectional communication between your server and clients. Think WebSockets, but transport-agnostic - your functions work the same whether they're called via traditional WebSocket servers (like `ws` or `uws`) or serverless WebSocket platforms like AWS API Gateway.

Your domain functions don't need to know they're being called through a WebSocket. They just receive messages, process them, and optionally send responses. Pikku handles all the connection lifecycle, message routing, and error handling.

## Your First Channel

Here's a complete channel example from the templates. It handles connection lifecycle events and uses action-based message routing:

Source: [`channel.functions.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/channel.functions.ts)

Source: [`channel.wiring.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/channel.wiring.ts)

Clients send action-based messages like `{ action: 'subscribe', topic: 'todo-created' }` to interact with the channel. Pikku automatically:
- Upgrades HTTP connections to WebSocket
- Routes messages to your function
- Validates message data against your types
- Sends return values back to the client
- Handles errors gracefully

## Authentication

The recommended pattern for channel authentication is to use an explicit authentication action rather than authenticating during connection:

```typescript @snippet wb-channel-authenticate
```

Wire them as actions on the channel:

```typescript @snippet wb-channel-authenticate-wiring
```

Client flow:
1. Connect to the channel (no auth required yet)
2. Send `{ action: 'authenticate', token: '...' }` to establish session
3. Send `{ action: 'sendMessage', message: 'Hello' }` (now authenticated)

This pattern works well because:
- Connections can be established without blocking on authentication
- Authentication errors are clear action responses
- You can re-authenticate if tokens expire
- Works seamlessly with reconnection logic

## Channel Lifecycle

Channels have three lifecycle events you can handle:

### onConnect

Called when a client first connects:

```typescript @snippet wb-channel-lifecycle
```

### onDisconnect

Called when a client disconnects:

`pikkuChannelDisconnectionFunc` (also in the snippet above) takes no output. It's the place to log the disconnect or release anything you held for the connection.

### onMessage

Called when a client sends a message:

`pikkuChannelFunc` (the third function in the snippet above) receives each message and returns the reply, which is sent back to the client automatically.

## Wiring a Channel

Wire your channel functions together with `wireChannel`:

```typescript @snippet wb-channel-lifecycle-wiring
```

## Understanding ChannelData

ChannelData is data extracted when the channel **first opens** - typically from URL params or query parameters, depending on the source:

```typescript @snippet wb-channel-opening-data
```

This data is available in all lifecycle handlers and doesn't change during the connection.

## The Channel Object

Inside channel functions, you have access to the `channel` object:

- `channel.channelId`: unique connection ID
- `channel.openingData`: data from the connection URL
- `channel.send(data)`: send data to this client
- `channel.close()`: close this connection
- `channel.state`: `'initial'`, `'open'` or `'closed'`

There are also `setState`, `getState` and `clearState` for keeping per-connection state, and `channel.remote` for calling the client (see below).

## Sending Messages

There are two ways to send messages to clients:

### Return a Value

When you return a value from your channel function, it's automatically sent to the client. This approach also allows you to wire regular `pikkuFunc` functions to channels, making them reusable across transports:

The `chatMessage` function in the lifecycle snippet above does this: it returns `{ message, timestamp }`, and that object is what the client receives.

### Use channel.send()

For more control, especially when sending multiple messages, use `channel.send()`:

```typescript @snippet wb-channel-send
```

## Middleware on a Channel

A channel has two kinds of middleware. `middleware` wraps the connection (it runs on connect, where the session is established). `channelMiddleware` wraps every message, which is where things like rate limiting or tracing belong. Channel middleware is declared with `pikkuChannelMiddleware` and `pikkuChannelMiddlewareFactory`, and can be attached to every channel with a given tag using `addChannelMiddleware`. See [Channel Middleware](/docs/core-features/middleware#channel-middleware).

## Calling the Client with channel.remote

Usually the client calls the server. Sometimes the server needs to ask the client something, like reading the contents of the user's local working tree. `pikkuRemoteChannelFunc` declares a capability the connected client answers, and any `wireChannel` function can call it as `channel.remote(name, input)`.

There's no `func`: your side owns the contract (the input and output types), the client owns the body.

```typescript @snippet remoteChannelFunc
```

The `description` is what a person is shown when asked to approve the call, so write it for them rather than for the caller.

## Real-time Pub/Sub with EventHub

The `eventHub` service provides transport-agnostic pub/sub, allowing you to broadcast messages to multiple channels, Server-Sent Events, or any other subscriber. This is especially useful in stateless/serverless environments where you need to coordinate between connections.

### Broadcasting Messages

```typescript @snippet wb-channel-broadcast
```

### Subscribing to Topics

Subscribe channels to topics when they connect:

```typescript @snippet wb-channel-room-connect
```

### Unsubscribing

Clean up subscriptions when clients disconnect. The `leaveRoom` function in the snippet above is the disconnect side of the same pair.

:::note
Pikku automatically unsubscribes all topics when a channel disconnects (since a new channel would have a new ID). This means your application needs to resubscribe when connections are reestablished.
:::

### EventHub API

The `eventHub` service provides these methods:

- `subscribe(topic, subscriberId)` - Subscribe to a topic
- `unsubscribe(topic, subscriberId)` - Unsubscribe from a topic
- `publish(topic, excludeId, payload)` - Publish to all subscribers (optionally exclude one)

EventHub works across all transports - WebSocket channels, Server-Sent Events, and even custom implementations. In stateless environments, it offloads subscription management to a shared service, allowing messages to route correctly even when connections are handled by different function instances.

See the [EventHub API documentation](/docs/api/event-hub) for more details.

## Stateful vs Stateless

Channels can be deployed in two ways:

### Stateful (Traditional WebSocket Servers)

Long-lived connections on dedicated servers (Express, Fastify, standalone WS server). Great for:
- Direct user interaction
- Low latency requirements
- Maintaining connection state in memory

### Stateless (Serverless WebSockets)

Event-driven connections via serverless platforms (AWS API Gateway, Azure Functions). Great for:
- Cost efficiency (pay per message)
- Auto-scaling
- Reduced operational overhead

Use `eventHub` to handle pub/sub in stateless environments - it offloads subscription management to a separate service.

## Real-World Example: Order Status Channel

From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template) — a WebSocket channel that streams live order status updates to the browser after checkout.

```typescript @snippet orderStatusChannel
```

Each function takes an `orderId` and uses the `eventHub` to subscribe (or unsubscribe) the connection's `channel.channelId` to the `order:<orderId>` topic. The client tells the server which order to watch by sending that `orderId`, and anything published to the topic is pushed down the connection. Wire both as actions on a channel with `auth: true` so only logged-in users can subscribe.

## Next Steps

- [Wiring Channels](/docs/wiring/channels/channel-route)
- [WebSocket Client](/docs/wiring/channels/websocket-client) - Type-safe client generation
- [`#pikku/channel` in the SDK explorer](/api#app/channel) - every export on the channel door
