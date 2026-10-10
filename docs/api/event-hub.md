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

Signature: `subscribe(topic: string, channelId: string): Promise<void>`.

**Parameters:**
- `topic` - Topic name (e.g., `'room:lobby'`, `'user:123'`)
- `channelId` - Unique identifier for the subscriber (typically `channel.channelId`)

**Example:**
Subscribe to a topic made from a prefix and an id (such as `room:` plus the room id), passing `channel.channelId` as the subscriber.

### unsubscribe()

Unsubscribe a channel/connection from a topic.

Signature: `unsubscribe(topic: string, channelId: string): Promise<void>`.

**Parameters:**
- `topic` - Topic name to unsubscribe from
- `channelId` - Subscriber identifier to remove

**Example:**
Call it with the same topic and `channel.channelId` when the user leaves a room.

:::note Automatic Cleanup
Pikku automatically unsubscribes all topics when a channel disconnects. You only need to manually unsubscribe when changing subscriptions during an active connection.
:::

### publish()

Publish a message to all subscribers of a topic.

Signature: `publish(topic: string, channelId: string | null, data: any, isBinary?: boolean): Promise<void>`.

**Parameters:**
- `topic` - Topic to publish to
- `channelId` - Subscriber ID to exclude (set to `null` to broadcast to all)
- `data` - Message payload (must be JSON-serializable)
- `isBinary` - Optional flag for binary payloads

**Examples:**

Broadcast to all subscribers:
```typescript @snippet co-eventhub-broadcast-all
```

Broadcast to all except sender:
```typescript @snippet co-eventhub-exclude-sender
```

## Usage Patterns

### Chat Room Example

```typescript @snippet co-eventhub-room
```

### Presence System

```typescript @snippet co-eventhub-presence
```

### Notification System

```typescript @snippet co-eventhub-notifications
```
