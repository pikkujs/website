---
sidebar_position: 10
title: Server-Sent Events (SSE)
description: Streaming real-time data to clients
---

# Server-Sent Events (SSE)

Server-Sent Events (SSE) let you stream real-time updates from the server to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server → client) and works over standard HTTP connections.

Pikku supports SSE as a progressive enhancement for GET routes - your function returns an initial response immediately, and can optionally stream updates if the client supports SSE.

## Progressive Enhancement Pattern

The recommended approach is to use `pikkuFunc` or `pikkuSessionlessFunc` with an optional channel:

```typescript
import { pikkuSessionlessFunc } from '#pikku'

export const getStatus = pikkuSessionlessFunc<
  void,
  { state: 'initial' | 'pending' | 'done' }
>({
  func: async (services) => {
    // If SSE is enabled and client supports it, send updates
    if (services?.channel) {
      setTimeout(() => services.channel?.send({ state: 'pending' }), 2500)
      setTimeout(() => services.channel?.send({ state: 'done' }), 5000)
    }

    // Always return initial response immediately
    return { state: 'initial' }
  },
  docs: {
    summary: 'Get current status with optional streaming updates',
    tags: ['status']
  }
})
```

Wire it with `sse: true`:

```typescript
import { wireHTTP } from '#pikku/http'

wireHTTP({
  method: 'get',
  route: '/status',
  func: getStatus,
  sse: true,  // Enables SSE support
  auth: false,
  docs: {
    summary: 'Status endpoint with SSE support',
    tags: ['status']
  }
})
```

This pattern works for both SSE and regular HTTP clients:
- **Regular HTTP client**: Gets immediate response `{ state: 'initial' }`
- **SSE client**: Gets initial response plus streaming updates

## Requirements

- Must be a **GET route**
- Set `sse: true` in wireHTTP config
- The function's `Out` type is used for both initial response and SSE messages
- Channel is automatically injected as `services.channel` when SSE is active

## Build Progress Example

Here's a real-world example showing build progress:

```typescript
export const watchBuild = pikkuSessionlessFunc<
  { projectId: string },
  { status: string; progress?: number }
>({
  func: async ({ buildService, channel }, data) => {
    const build = await buildService.start(data.projectId)

    if (channel) {
      // Stream progress updates
      buildService.onProgress(build.id, (progress) => {
        channel.send({
          status: 'building',
          progress: progress.percent
        })
      })

      buildService.onComplete(build.id, () => {
        channel.send({
          status: 'complete',
          progress: 100
        })
        channel.close()
      })
    }

    // Initial response
    return {
      status: 'started',
      progress: 0
    }
  },
  docs: {
    summary: 'Watch build progress with real-time updates',
    tags: ['builds']
  }
})

wireHTTP({
  method: 'get',
  route: '/builds/:projectId/watch',
  func: watchBuild,
  sse: true,
  auth: false,
  docs: {
    summary: 'Watch build progress',
    tags: ['builds']
  }
})
```

## Client-Side Usage

### Using EventSource API

```javascript
const eventSource = new EventSource('/status')

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data)
  console.log('Received:', data)

  if (data.state === 'done') {
    eventSource.close()
  }
}

eventSource.onerror = function(error) {
  console.error('SSE error:', error)
  eventSource.close()
}
```

### Handling Both Modes

```javascript
async function getStatus() {
  // Try SSE first
  if (window.EventSource) {
    const eventSource = new EventSource('/status')

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data)
      updateUI(data)
    }

    eventSource.onerror = function() {
      // Fallback to regular HTTP
      eventSource.close()
      pollStatus()
    }
  } else {
    // Browser doesn't support SSE - use polling
    pollStatus()
  }
}

async function pollStatus() {
  const response = await fetch('/status')
  const data = await response.json()
  updateUI(data)
}
```

## Live Metrics Example

Stream live metrics with automatic updates:

```typescript
export const getLiveMetrics = pikkuSessionlessFunc<
  void,
  { cpu: number; memory: number; requests: number }
>({
  func: async ({ metricsService, channel }) => {
    const current = await metricsService.getCurrent()

    if (channel) {
      // Send updates every second
      const interval = setInterval(async () => {
        const metrics = await metricsService.getCurrent()
        channel.send(metrics)
      }, 1000)

      // Cleanup after 5 minutes
      setTimeout(() => {
        clearInterval(interval)
        channel.close()
      }, 5 * 60 * 1000)
    }

    return current
  },
  docs: {
    summary: 'Get live system metrics',
    tags: ['metrics']
  }
})

wireHTTP({
  method: 'get',
  route: '/metrics/live',
  func: getLiveMetrics,
  sse: true,
  docs: {
    summary: 'Live metrics endpoint',
    tags: ['metrics']
  }
})
```

## When to Use SSE

SSE works well for:
- Live dashboards and metrics
- Progress indicators for long-running operations
- Real-time notifications
- Activity feeds
- Stock tickers or live scores

Consider WebSockets (channels) instead if you need:
- Bidirectional communication
- Client → server messaging
- Lower latency requirements
- Binary data streaming

## Best Practices

**Always provide an initial response** - Don't make clients wait for the first SSE message:

```typescript
// ✅ Good - immediate response
func: async ({ channel }) => {
  const initial = computeInitialState()

  if (channel) {
    // Stream updates
  }

  return initial
}

// ❌ Bad - no initial response
func: async ({ channel }) => {
  if (channel) {
    // Only streams, no return
  }
}
```

**Close the channel when done** - Clean up resources:

```typescript
if (channel) {
  // Send updates...
  channel.send(finalUpdate)
  channel.close()  // Important!
}
```

**Use cleanup for long-running streams**:

```typescript
if (channel) {
  const interval = setInterval(() => {
    channel.send(data)
  }, 1000)

  // Always clean up
  setTimeout(() => {
    clearInterval(interval)
    channel.close()
  }, maxDuration)
}
```

## Next Steps

- [Channels](../channels/index.md) - For bidirectional real-time communication
- [wireHTTP](./index.md) - HTTP route configuration
- [Functions](../../core-features/functions.md) - Understanding Pikku functions
