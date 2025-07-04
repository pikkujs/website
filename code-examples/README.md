# Code Examples

This directory contains reusable code examples for the Pikku framework that are used across the website and documentation.

## Structure

- `transports/` - Contains examples for different transport types (HTTP, WebSocket, SSE, RPC, etc.)
- `index.ts` - Helper utilities for reading code examples

## Transport Examples

### HTTP APIs
- `http-server.ts` - Server-side HTTP API with authentication
- `http-client.ts` - Client-side fetch client with type safety

### WebSocket
- `websocket-server.ts` - Server-side WebSocket channel with authentication
- `websocket-client.ts` - Client-side WebSocket client with type safety

### Server-Sent Events (SSE)
- `sse-server.ts` - Server-side streaming with authentication
- `sse-client.ts` - Client-side SSE client with type safety

### RPC Services
- `rpc-server.ts` - Server-side RPC service with authentication
- `rpc-client.ts` - Client-side RPC client with type safety

### Background Tasks
- `cron.ts` - Scheduled tasks example
- `queue.ts` - Background queue processing example

## Usage

These examples are used in:
- Homepage (`data/homepage-content.json`)
- Documentation (`docs/index.mdx`)
- Any other documentation that needs consistent code examples

All examples demonstrate:
- **Authentication patterns** using `userSession` as the 3rd parameter
- **Server/client patterns** similar to RPC architecture
- **Type safety** throughout the application
- **Real-world usage** without complex SQL examples

## Key Features Shown

- **userSession usage**: All authenticated examples show how to access `session.userId`, `session.username`, etc.
- **Service injection**: Examples use services like `logger`, `emailService`, `imageService`, etc.
- **Type safety**: All functions are properly typed with input/output types
- **Error handling**: Examples include proper error handling and retry logic
- **Authentication**: Most examples require authentication (`auth: true`)