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

SSE functions are created using `pikkuSessionlessFunc` or `pikkuFunc` with an `AsyncGenerator` return type:

```typescript
export const streamUpdates = pikkuSessionlessFunc<
  void,
  AsyncGenerator<{ timestamp: string; data: any }>
>(async function* ({ logger }) {
  let count = 0
  
  while (true) {
    yield {
      timestamp: new Date().toISOString(),
      data: { count: ++count, message: 'Live update' }
    }
    
    // Wait 1 second before next update
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
})
```

## Registering SSE Routes

Register SSE endpoints using `addHTTPRoute` with `responseType: 'stream'`:

```typescript
import { addHTTPRoute } from '@pikku/core/http'

addHTTPRoute({
  method: 'get',
  route: '/stream/updates',
  func: streamUpdates,
  auth: false,
  responseType: 'stream',
  docs: {
    description: 'Stream live updates',
    tags: ['streaming'],
  },
})
```

## Client-Side Usage

### Native EventSource

```javascript
const eventSource = new EventSource('/api/stream/updates')

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}

eventSource.onerror = function(event) {
  console.error('SSE error:', event)
}
```

### With Pikku Fetch Client

```typescript
import { streamUpdates } from './pikku-fetch.gen'

// The generated client handles SSE automatically
for await (const update of streamUpdates()) {
  console.log('Update:', update)
}
```

## Advanced Features

### Conditional Streaming

```typescript
export const streamUserNotifications = pikkuFunc<
  { userId: string },
  AsyncGenerator<{ type: string; message: string }>
>(async function* ({ logger, eventHub }, { userId }, session) {
  // Subscribe to user-specific events
  const subscription = await eventHub.subscribe(`user:${userId}:notifications`)
  
  try {
    while (true) {
      const notification = await subscription.next()
      if (notification.done) break
      
      yield {
        type: notification.value.type,
        message: notification.value.message
      }
    }
  } finally {
    await subscription.unsubscribe()
  }
})
```

### Error Handling

```typescript
export const streamWithErrorHandling = pikkuSessionlessFunc<
  void,
  AsyncGenerator<{ status: string; data?: any; error?: string }>
>(async function* ({ logger }) {
  try {
    while (true) {
      try {
        const data = await fetchDataFromExternalAPI()
        yield { status: 'success', data }
      } catch (error) {
        logger.error('Stream error:', error)
        yield { status: 'error', error: error.message }
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  } catch (error) {
    logger.error('Fatal stream error:', error)
    yield { status: 'fatal', error: error.message }
  }
})
```

## Runtime Support

SSE is supported on the following runtimes:

| Runtime | Support | Notes |
|---------|---------|-------|
| Express | ✅ | Full support with automatic headers |
| Fastify | ✅ | Built-in streaming support |
| uWS | ✅ | High-performance streaming |
| Next.js | ✅ | Works with App Router |
| AWS Lambda | ❌ | Limited by Lambda execution model |
| Cloudflare Workers | ❌ | Limited by Workers execution model |

## Progressive Enhancement

SSE works well with progressive enhancement patterns:

```typescript
export const getDataWithSSE = pikkuSessionlessFunc<
  { realtime?: boolean },
  any
>(async ({ logger }, { realtime }) => {
  if (realtime) {
    // Return SSE stream
    return streamLiveData()
  } else {
    // Return static data
    return await fetchStaticData()
  }
})
```

## Best Practices

1. **Backpressure Handling**: Implement proper flow control to prevent memory issues
2. **Reconnection Logic**: Handle client reconnections gracefully
3. **Resource Cleanup**: Always clean up subscriptions and resources
4. **Error Recovery**: Implement robust error handling and recovery
5. **Rate Limiting**: Consider implementing rate limiting for high-frequency streams

## Configuration

Configure SSE behavior through runtime-specific settings:

```typescript
// Express configuration
app.use(pikkuExpressMiddleware(singletonServices, createSessionServices, {
  sse: {
    headers: {
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
    heartbeat: 30000, // Send heartbeat every 30 seconds
  }
}))
```

SSE provides a powerful way to implement real-time features in web applications while maintaining simplicity and broad compatibility.