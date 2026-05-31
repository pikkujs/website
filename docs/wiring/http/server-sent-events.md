---
sidebar_position: 10
title: Server-Sent Events (SSE)
description: Streaming real-time data to clients
---

# Server-Sent Events (SSE)

Server-Sent Events (SSE) let you stream real-time updates from the server to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server → client) and works over standard HTTP connections.

Pikku supports SSE as a progressive enhancement for GET routes — your function returns an initial response immediately, and can optionally stream updates if the client supports SSE.

## Your First SSE Route

Here are SSE functions and wiring from the templates, showing a progress stream and a periodic update stream:

```typescript reference title="sse.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/sse.functions.ts
```

```typescript reference title="sse.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/sse.wiring.ts
```

This pattern works for both SSE and regular HTTP clients:
- **Regular HTTP client**: Gets the return value as a normal JSON response
- **SSE client**: Gets the return value as the final message, plus any `channel.send()` calls as intermediate messages

## Requirements

- Must be a **GET route**
- Set `sse: true` in wireHTTP config
- The function's output type is used for both intermediate SSE messages and the final return value
- `channel` is automatically injected when the client connects via SSE

## Two SSE Patterns

### Progress Streaming (`processTodosProgress`)

For operations with discrete steps — report progress as you go, then return the final result:

```typescript
if (channel) {
  channel.send({ status: 'started', processed: 0, total })
  for (let i = 0; i < todos.length; i++) {
    channel.send({ status: 'processing', processed: i + 1, total })
  }
}

return { status: 'complete', processed: total, total }
```

The return value is automatically sent as the final SSE message — no need to call `channel.close()`.

### Periodic Updates (`todoStream`)

For ongoing streams — set up an interval, send updates, then return an initial snapshot:

```typescript
if (channel) {
  let count = 0
  const interval = setInterval(async () => {
    channel.send({ todos, timestamp, count: todos.length })
    if (++count >= 6) {
      clearInterval(interval)
      channel.close()  // Close explicitly when the stream is finished
    }
  }, 5000)
}

// Return immediate snapshot
return { todos, timestamp, count: todos.length }
```

Use `channel.close()` when the stream has a defined end (like a fixed number of updates). For open-ended streams, omit it and let the client disconnect.

## Client-Side Usage

### Using EventSource API

```javascript
const eventSource = new EventSource('/todos/progress', { withCredentials: true })

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data)
  console.log('Received:', data)

  if (data.status === 'complete') {
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
async function getTodosProgress() {
  // Try SSE first
  if (window.EventSource) {
    const eventSource = new EventSource('/todos/progress', { withCredentials: true })

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data)
      updateUI(data)
      if (data.status === 'complete') eventSource.close()
    }

    eventSource.onerror = function() {
      // Fallback to regular HTTP
      eventSource.close()
      fetchTodosProgress()
    }
  } else {
    // Browser doesn't support SSE - use regular fetch
    fetchTodosProgress()
  }
}

async function fetchTodosProgress() {
  const response = await fetch('/todos/progress')
  const data = await response.json()
  updateUI(data)
}
```

## When to Use SSE

SSE works well for:
- Progress indicators for long-running operations
- Live dashboards and activity feeds
- Periodic data refresh (todos, notifications, scores)
- Real-time status updates

Consider WebSockets ([channels](../channels/index.md)) instead if you need:
- Bidirectional communication
- Client → server messaging
- Binary data streaming

## Best Practices

**Always provide an initial response** — don't make regular HTTP clients wait:

```typescript
// ✅ Good - immediate response for HTTP clients too
if (channel) {
  // stream updates...
}
return initialState
```

**Use `channel.close()` only when the stream is finished** — for open-ended streams, let the client disconnect:

```typescript
// ✅ Finite stream - close when done
if (count >= maxUpdates) {
  clearInterval(interval)
  channel.close()
}

// ✅ Open-ended stream - omit channel.close(), client disconnects when done
```

**Don't call `channel.close()` and return a value** — the return value is automatically sent as the last SSE message. Closing before returning will cut off that final message.

## Next Steps

- [Channels](../channels/index.md) - For bidirectional real-time communication
- [wireHTTP](./index.md) - HTTP route configuration
- [Functions](../../core-features/functions.md) - Understanding Pikku functions
