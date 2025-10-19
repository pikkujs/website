---
sidebar_position: 1
title: EventHub API
description: Pub/sub service for real-time messaging
---

# EventHub API

The EventHub service provides topic-based pub/sub messaging for real-time communication across channels, Server-Sent Events, and custom transports.

## Overview

EventHub enables:
- Topic-based message routing
- Broadcasting to multiple subscribers
- Selective exclusion (send to all except one)
- Stateless and stateful operation modes
- Cross-transport compatibility (WebSockets, SSE, etc.)

## Methods

### subscribe()

Subscribe a channel/connection to a topic.

```typescript
await eventHub.subscribe(topic: string, subscriberId: string)
```

**Parameters:**
- `topic` - Topic name (e.g., `'room:lobby'`, `'user:123'`)
- `subscriberId` - Unique identifier for the subscriber (typically `channel.channelId`)

**Example:**
```typescript
// Subscribe channel to a room topic
await eventHub.subscribe(`room:${roomId}`, channel.channelId)
```

### unsubscribe()

Unsubscribe a channel/connection from a topic.

```typescript
await eventHub.unsubscribe(topic: string, subscriberId: string)
```

**Parameters:**
- `topic` - Topic name to unsubscribe from
- `subscriberId` - Subscriber identifier to remove

**Example:**
```typescript
// Unsubscribe when leaving a room
await eventHub.unsubscribe(`room:${roomId}`, channel.channelId)
```

:::note Automatic Cleanup
Pikku automatically unsubscribes all topics when a channel disconnects. You only need to manually unsubscribe when changing subscriptions during an active connection.
:::

### publish()

Publish a message to all subscribers of a topic.

```typescript
await eventHub.publish(
  topic: string,
  excludeId: string | null,
  payload: any
)
```

**Parameters:**
- `topic` - Topic to publish to
- `excludeId` - Subscriber ID to exclude (set to `null` to broadcast to all)
- `payload` - Message payload (must be JSON-serializable)

**Examples:**

Broadcast to all subscribers:
```typescript
await eventHub.publish(
  `room:${roomId}`,
  null,  // Send to all
  {
    type: 'message',
    text: 'Hello everyone!',
    userId: currentUserId
  }
)
```

Broadcast to all except sender:
```typescript
await eventHub.publish(
  `room:${roomId}`,
  channel.channelId,  // Exclude sender
  {
    type: 'user_joined',
    userId: newUserId,
    username: newUserName
  }
)
```

## Usage Patterns

### Chat Room Example

```typescript
// Connection - subscribe to room
export const joinRoom = pikkuChannelConnectionFunc<
  { welcome: string },
  { room: string }
>({
  func: async ({ eventHub, channel }) => {
    const room = channel.openingData.room
    await eventHub.subscribe(`room:${room}`, channel.channelId)
    return { welcome: `Welcome to ${room}!` }
  }
})

// Message - broadcast to room (excluding sender)
export const sendMessage = pikkuChannelFunc<
  { message: string },
  void,
  { room: string }
>({
  func: async ({ eventHub, channel, userSession }, data) => {
    const room = channel.openingData.room

    await eventHub.publish(
      `room:${room}`,
      channel.channelId,  // Don't echo back to sender
      {
        message: data.message,
        userId: userSession.userId,
        timestamp: Date.now()
      }
    )
  }
})

// Disconnect - cleanup (optional, happens automatically)
export const leaveRoom = pikkuChannelDisconnectionFunc<{ room: string }>({
  func: async ({ eventHub }, data) => {
    await eventHub.unsubscribe(`room:${data.room}`, data.channelId)
  }
})
```

### Presence System

```typescript
// Publish presence updates
export const updatePresence = pikkuFunc<
  { status: 'online' | 'away' | 'offline' },
  void
>({
  func: async ({ eventHub, userSession }, data) => {
    await eventHub.publish(
      `presence:updates`,
      null,
      {
        userId: userSession.userId,
        status: data.status,
        timestamp: Date.now()
      }
    )
  }
})

// Subscribe to presence on connect
export const watchPresence = pikkuChannelConnectionFunc({
  func: async ({ eventHub, channel }) => {
    await eventHub.subscribe('presence:updates', channel.channelId)
  }
})
```

### Notification System

```typescript
// Subscribe user to their personal notification channel
export const connectNotifications = pikkuChannelConnectionFunc<
  void,
  { userId: string }
>({
  func: async ({ eventHub, channel }) => {
    const userId = channel.openingData.userId
    await eventHub.subscribe(`notifications:${userId}`, channel.channelId)
  }
})

// Trigger notification from any function
export const sendNotification = pikkuFunc<
  { userId: string; title: string; message: string },
  void
>({
  func: async ({ eventHub }, data) => {
    await eventHub.publish(
      `notifications:${data.userId}`,
      null,
      {
        title: data.title,
        message: data.message,
        timestamp: Date.now()
      }
    )
  }
})
```
