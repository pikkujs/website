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

```typescript @snippet wa-sse-functions
```

```typescript @snippet wa-sse-wiring
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

```typescript @snippet wa-sse-progress
```

Send the final message explicitly and call `channel.close()` when the stream is done — the return value is not sent to SSE clients.

### Periodic Updates (`todoStream`)

For ongoing streams — set up an interval, send updates, and return the current snapshot for non-SSE callers:

```typescript @snippet wa-sse-periodic
```

Use `channel.close()` when the stream has a defined end (like a fixed number of updates). For open-ended streams, omit it and let the client disconnect.

## When a stream fails

Once a response is committed to streaming, an error can no longer be an HTTP status — the status and headers are already sent. Pikku instead announces the failure as frames on the open stream and closes it:

```json
{"type":"error","errorText":"Internal server error"}
{"type":"done"}
```

Only a registered Pikku error's message reaches the client; anything else is reported as `Internal server error`, with the real message logged server-side.

A stream whose client parses a different event protocol needs the failure in that protocol, or the error arrives as a parser crash with the message nowhere in sight. `streamProtocol` says which one the route speaks:

```typescript @snippet wa-sse-stream-protocol
```

With `'agui'` the same failure arrives as a single AG-UI event, and nothing follows it:

```json
{"type":"RUN_ERROR","message":"Internal server error"}
```

The default is `'pikku'`. The generated agent stream routes set `'agui'` for you, so an AG-UI client (`HttpAgent`, `usePikkuAgentRuntime`) renders a failed run rather than throwing on the frame.

## Client-Side Usage

### Using EventSource API

In the browser, open a native `EventSource` on the route with `withCredentials: true`, parse each `event.data` as JSON in `onmessage`, and call `eventSource.close()` once you see the terminal status (or when `onerror` fires) so the browser stops reconnecting.

### Typed client (Pikku Fetch)

The generated fetch client can consume the stream directly:

```typescript @snippet wa-fetch-subscribe-sse
```

### Clients that can't stream

A route with `sse: true` is always streamed, so a client that needs a single JSON response should call a non-SSE wiring of the same function instead of the SSE route:

```typescript @snippet wa-sse-dual-wiring
```

A plain `fetch('/todos/progress.json')` followed by `response.json()` then gets the single response.

The `if (channel)` guard in the function is what lets it serve both: it streams when a channel is present and just returns its value otherwise.

## When to Use SSE

SSE works well for:
- Progress indicators for long-running operations
- Live dashboards and activity feeds
- Periodic data refresh (todos, notifications, scores)
- Real-time status updates

Consider WebSockets ([channels](/docs/wiring/channels)) instead if you need:
- Bidirectional communication
- Client → server messaging
- Binary data streaming

## Best Practices

**Send an initial message** — an SSE client has nothing to render until the first event arrives:

```typescript @snippet wa-sse-initial-message
```

**Use `channel.close()` only when the stream is finished** — for open-ended streams, let the client disconnect:

```typescript @snippet wa-sse-finite-close
```

**Send the final message before `channel.close()`** — the return value is not part of the stream, so a terminal event that clients wait for has to be sent explicitly.

## Next Steps

- [Channels](/docs/wiring/channels) - For bidirectional real-time communication
- [wireHTTP](/docs/wiring/http) - HTTP route configuration
- [Functions](/docs/core-features/functions) - Understanding Pikku functions
