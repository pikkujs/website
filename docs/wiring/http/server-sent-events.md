---
sidebar_position: 10
title: Server-Sent Events (SSE)
description: Streaming real-time data to clients
---

# Server-Sent Events (SSE)

Server-Sent Events (SSE) let you stream real-time updates from the server to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server → client) and works over standard HTTP connections.

Pikku supports SSE on `GET` routes: when a route is wired with `sse: true`, every request is served as a stream (`text/event-stream`), and the function pushes messages with `channel.send()`.

## Your First SSE Route

Here are SSE functions and wiring from the templates, showing a progress stream and a periodic update stream:

```typescript reference title="sse.functions.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/sse.functions.ts
```

```typescript reference title="sse.wiring.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/sse.wiring.ts
```

Everything an SSE client receives comes from `channel.send()` calls in your function:
- Each `channel.send(data)` is delivered as one SSE event
- `channel.close()` ends the stream
- The function's return value is **not** written to the stream. It is what the same function returns when it is wired to a non-SSE route (or called over RPC). If SSE clients need a final message, `channel.send()` it yourself.

## Requirements

- Must be a **GET route**
- Set `sse: true` in wireHTTP config
- Every request to that route is streamed — there is no JSON response from the same route. A client that needs one value should call a non-SSE wiring of the function.
- `channel` is injected on the wire for SSE routes
- The function's output type should describe the messages the stream carries

## Two SSE Patterns

### Progress Streaming (`processTodosProgress`)

For operations with discrete steps — report progress as you go, then return the final result:

```typescript
if (channel) {
  channel.send({ status: 'started', processed: 0, total })
  for (let i = 0; i < todos.length; i++) {
    channel.send({ status: 'processing', processed: i + 1, total })
  }
  channel.send({ status: 'complete', processed: total, total })
  channel.close()
}

// Returned to non-SSE callers of the same function
return { status: 'complete', processed: total, total }
```

Send the final message explicitly and call `channel.close()` when the stream is done — the return value is not sent to SSE clients.

### Periodic Updates (`todoStream`)

For ongoing streams — set up an interval, send updates, and return the current snapshot for non-SSE callers:

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

// Returned to non-SSE callers
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

### Typed client (Pikku Fetch)

The generated fetch client can consume the stream directly:

```typescript
import { pikkuFetch } from '#pikku/pikku-fetch.gen.js'

pikkuFetch.setServerUrl('http://localhost:4002')

const stream = pikkuFetch.subscribeToSSE('/todos/progress', (event) => {
  console.log('Received:', event)
})

// Later, to stop listening
stream.close()
```

### Clients that can't stream

A route with `sse: true` is always streamed, so a client that needs a single JSON response should call a non-SSE wiring of the same function instead of the SSE route:

```typescript
// Streamed
wireHTTP({ method: 'get', route: '/todos/progress', func: processTodosProgress, sse: true })

// Single response, same function
wireHTTP({ method: 'get', route: '/todos/progress.json', func: processTodosProgress })
```

```javascript
async function fetchTodosProgress() {
  const response = await fetch('/todos/progress.json')
  const data = await response.json()
  updateUI(data)
}
```

The `if (channel)` guard in the function is what lets it serve both: it streams when a channel is present and just returns its value otherwise.

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

**Send an initial message** — an SSE client has nothing to render until the first event arrives:

```typescript
// ✅ Good - first message arrives immediately
if (channel) {
  channel.send(initialState)
  // ... stream updates
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

**Send the final message before `channel.close()`** — the return value is not part of the stream, so a terminal event that clients wait for has to be sent explicitly.

## Next Steps

- [Channels](../channels/index.md) - For bidirectional real-time communication
- [wireHTTP](./index.md) - HTTP route configuration
- [Functions](../../core-features/functions.md) - Understanding Pikku functions
