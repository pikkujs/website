---
sidebar_position: 10
title: Server-Sent Events (SSE)
description: Streaming real-time data to clients
---

# Server-Sent Events (SSE)

Server-Sent Events (SSE) provide a way to stream real-time data from the server to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server to client) and works over standard HTTP, making it simpler to implement and more firewall-friendly.

## Overview

SSE in Pikku allows you to:
- Stream real-time data to web browsers
- Implement progressive enhancement fallbacks
- Handle automatic reconnection
- Send typed streaming data

## Creating SSE Functions

SSE functions are created using `pikkuSessionlessFunc` or `pikkuChannelFunc`:

```typescript
import { pikkuChannelFunc } from '../.pikku/pikku-types.gen.js'

export const timeSinceOpened = pikkuChannelFunc<
  void,
  { count: number } | void
>(async ({ channel }) => {
  const startedAt = Date.now()
  let count = 0
  const interval = setInterval(() => {
    channel.send({ count: count++ })
    if (Date.now() - startedAt > 5000) {
      clearInterval(interval)
      channel.close()
    }
  }, 1000)

  return { count }
})

```

## Registering SSE Routes

Register SSE endpoints using `wireHTTP` with `responseType: 'stream'`:

```typescript
import { wireHTTP } from '../.pikku/pikku-types.gen.js'

wireHTTP({
  method: 'get',
  route: '/stream/updates',
  func: streamUpdates,
  auth: false,
  sse: true,
  docs: {
    description: 'Stream live updates',
    tags: ['streaming'],
  },
})
```

## Client-Side Usage


```javascript
const eventSource = new EventSource('/stream/updates')

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}

eventSource.onerror = function(event) {
  console.error('SSE error:', event)
}
```
