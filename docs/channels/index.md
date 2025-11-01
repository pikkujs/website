---
sidebar_position: 0
title: Introduction
description: Real-time WebSocket channels
---

# Channels

Channels provide real-time, bidirectional communication between your server and clients. Think WebSockets, but transport-agnostic - your functions work the same whether they're called via traditional WebSocket servers (like `ws` or `uws`) or serverless WebSocket platforms like AWS API Gateway.

Your domain functions don't need to know they're being called through a WebSocket. They just receive messages, process them, and optionally send responses. Pikku handles all the connection lifecycle, message routing, and error handling.

## Your First Channel

Let's create a simple chat channel:

```typescript
// chat.function.ts
import { pikkuChannelFunc } from '#pikku'

export const onMessage = pikkuChannelFunc<
  { message: string },      // Input - what clients send
  { message: string },      // Output - what we send back
  { room: string }          // ChannelData - from URL params/query params/depends on source
>({
  func: async ({ logger, channel }, data) => {
    logger.info('Message received', {
      room: channel.openingData.room,
      message: data.message
    })

    // Return value is automatically sent to the client
    return { message: `Echo: ${data.message}` }
  },
  docs: {
    summary: 'Handle chat messages',
    tags: ['chat']
  }
})
```

```typescript
// chat.channel.ts
import { wireChannel } from '#pikku/channel'
import { onMessage } from './functions/chat.function.js'

wireChannel({
  name: 'chat',
  route: '/chat',
  onMessage,
  auth: false
})
```

That's it! Clients can now connect to your chat channel and send messages. Pikku automatically:
- Upgrades HTTP connections to WebSocket
- Routes messages to your function
- Validates message data against your types
- Sends return values back to the client
- Handles errors gracefully

## Authentication

The recommended pattern for channel authentication is to use an explicit authentication action rather than authenticating during connection:

```typescript
// auth.function.ts
export const authenticate = pikkuChannelFunc<
  { token: string },
  { authenticated: boolean },
  { room: string }
>({
  func: async ({ jwt, userSession }, data) => {
    try {
      const payload = await jwt.verify(data.token)

      // Set the user session for this connection
      await userSession.set({
        userId: payload.userId,
        role: payload.role
      })

      return { authenticated: true }
    } catch (e) {
      throw new UnauthorizedError('Invalid token')
    }
  },
  auth: false,  // Don't require auth for the authenticate action itself
  docs: {
    summary: 'Authenticate a WebSocket connection',
    tags: ['auth']
  }
})

export const sendMessage = pikkuChannelFunc<
  { message: string },
  { message: string; timestamp: number },
  { room: string }
>({
  func: async ({ database, channel }, data, session) => {
    // session is guaranteed to exist because auth: true
    const timestamp = Date.now()

    await database.insert('messages', {
      room: channel.openingData.room,
      message: data.message,
      userId: session.userId,
      timestamp
    })

    return { message: data.message, timestamp }
  },
  auth: true,  // Require authentication
  docs: {
    summary: 'Send a message',
    tags: ['chat']
  }
})
```

Wire them as actions on the channel:

```typescript
wireChannel({
  name: 'chat',
  route: '/chat',
  auth: true,  // Channel requires auth by default
  onMessageWiring: {
    action: {
      authenticate: { func: authenticate },  // auth: false on the function
      sendMessage: { func: sendMessage }     // auth: true on the function
    }
  }
})
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

```typescript
export const onConnect = pikkuChannelConnectionFunc<
  { welcome: string },      // Output - sent to client
  { room: string }          // ChannelData - from URL params/query params/depends on source
>({
  func: async ({ logger, channel }) => {
    logger.info('User connected to room', { room: channel.openingData.room })

    // Return value is automatically sent
    return { welcome: `Welcome to ${channel.openingData.room}!` }
  },
  docs: {
    summary: 'Handle new connections',
    tags: ['chat']
  }
})
```

### onDisconnect

Called when a client disconnects:

```typescript
export const onDisconnect = pikkuChannelDisconnectionFunc<{ room: string }>({
  func: async ({ logger }, data) => {
    logger.info('User disconnected from room', { room: data.room })
    // No return value - connection is closing
  },
  docs: {
    summary: 'Handle disconnections',
    tags: ['chat']
  }
})
```

### onMessage

Called when a client sends a message:

```typescript
export const onMessage = pikkuChannelFunc<
  { message: string },
  { message: string; timestamp: number },
  { room: string }
>({
  func: async ({ database, channel }, data) => {
    const timestamp = Date.now()

    await database.insert('messages', {
      room: channel.openingData.room,
      message: data.message,
      timestamp
    })

    return { message: data.message, timestamp }
  },
  docs: {
    summary: 'Handle incoming messages',
    tags: ['chat']
  }
})
```

## Wiring a Channel

Wire your channel functions together with `wireChannel`:

```typescript
import { wireChannel } from '#pikku/channel'
import { onConnect, onDisconnect, onMessage } from './functions/chat.function.js'

wireChannel({
  // Required
  name: 'chat',              // Unique channel name
  route: '/chat',            // WebSocket route

  // Lifecycle handlers
  onConnect,
  onDisconnect,
  onMessage,

  // Optional
  auth: true,                // Require authentication (default: true)
  middleware: [auditMiddleware],
  tags: ['realtime']
})
```

## Understanding ChannelData

ChannelData is data extracted when the channel **first opens** - typically from URL params or query parameters, depending on the source:

```typescript
// Client connects to: ws://localhost:3000/chat?room=general
// ChannelData = { room: 'general' }

export const onMessage = pikkuChannelFunc<
  { message: string },
  { message: string; timestamp: number },
  { room: string }  // ChannelData type
>({
  func: async ({ channel }, data) => {
    // Access opening data throughout the connection
    const room = channel.openingData.room

    // ... handle message
  }
})
```

This data is available in all lifecycle handlers and doesn't change during the connection.

## The Channel Object

Inside channel functions, you have access to the `channel` object:

```typescript
func: async ({ channel }, data) => {
  channel.channelId          // Unique connection ID
  channel.openingData        // Data from connection URL
  channel.send(data)         // Send data to this client
  channel.close()            // Close this connection
  channel.state              // 'initial' | 'open' | 'closed'
}
```

## Sending Messages

There are two ways to send messages to clients:

### Return a Value

When you return a value from your channel function, it's automatically sent to the client. This approach also allows you to wire regular `pikkuFunc` functions to channels, making them reusable across transports:

```typescript
export const onMessage = pikkuChannelFunc<
  { message: string },
  { message: string; timestamp: number }
>({
  func: async ({ database }, data) => {
    const timestamp = Date.now()
    await database.query('...')

    // Automatically sent to the client
    return { message: data.message, timestamp }
  }
})
```

### Use channel.send()

For more control, especially when sending multiple messages, use `channel.send()`:

```typescript
type StatusUpdate =
  | { type: 'processing'; step: string }
  | { type: 'complete'; result: ProcessResult }

export const onMessage = pikkuChannelFunc<
  { jobId: string },
  StatusUpdate
>({
  func: async ({ channel, database }, data) => {
    // Send progress updates
    channel.send({ type: 'processing', step: 'Loading data' })

    const result = await database.query('...')

    channel.send({ type: 'processing', step: 'Processing' })

    // Process the job...

    // Note: channel.send type is checked against Output
    channel.send({ type: 'complete', result })
  }
})
```

## Real-time Pub/Sub with EventHub

The `eventHub` service provides transport-agnostic pub/sub, allowing you to broadcast messages to multiple channels, Server-Sent Events, or any other subscriber. This is especially useful in stateless/serverless environments where you need to coordinate between connections.

### Broadcasting Messages

```typescript
export const broadcastToRoom = pikkuFunc<
  { room: string; message: string; userId: string },
  void
>({
  func: async ({ eventHub }, data) => {
    // Broadcast to all subscribers of this room's topic
    await eventHub.publish(
      `room:${data.room}`,
      null,  // null = broadcast to all subscribers
      {
        type: 'message',
        message: data.message,
        userId: data.userId,
        timestamp: Date.now()
      }
    )
  },
  docs: {
    summary: 'Broadcast message to all users in a room',
    tags: ['chat']
  }
})
```

### Subscribing to Topics

Subscribe channels to topics when they connect:

```typescript
export const onConnect = pikkuChannelConnectionFunc<
  { welcome: string },
  { room: string }
>({
  func: async ({ eventHub, channel }) => {
    const room = channel.openingData.room

    // Subscribe this channel to the room's topic
    await eventHub.subscribe(`room:${room}`, channel.channelId)

    return { welcome: `Joined ${room}` }
  }
})
```

### Unsubscribing

Clean up subscriptions when clients disconnect:

```typescript
export const onDisconnect = pikkuChannelDisconnectionFunc<{ room: string }>({
  func: async ({ eventHub }, data) => {
    await eventHub.unsubscribe(`room:${data.room}`, data.channelId)
  }
})
```

:::note
Pikku automatically unsubscribes all topics when a channel disconnects (since a new channel would have a new ID). This means your application needs to resubscribe when connections are reestablished.
:::

### EventHub API

The `eventHub` service provides these methods:

- `subscribe(topic, subscriberId)` - Subscribe to a topic
- `unsubscribe(topic, subscriberId)` - Unsubscribe from a topic
- `publish(topic, excludeId, payload)` - Publish to all subscribers (optionally exclude one)

EventHub works across all transports - WebSocket channels, Server-Sent Events, and even custom implementations. In stateless environments, it offloads subscription management to a shared service, allowing messages to route correctly even when connections are handled by different function instances.

See the [EventHub API documentation](../api/event-hub.md) for more details.

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

## Next Steps

- [Wiring Channels](./channel-route.md)
- [WebSocket Client](./websocket-client.md) - Type-safe client generation
