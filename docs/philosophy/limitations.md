---
sidebar_position: 90
title: Limitations
description: Current limitations and constraints
---

# Limitations

Pikku is designed to be pragmatic and focused. Here are the current limitations you should be aware of.

## JSON-Only Input/Output

Pikku functions primarily work with JSON-serializable data:

- **Primitives**: strings, numbers, booleans, null
- **Objects and arrays**: Plain objects and arrays of JSON values
- **Binary data**: Early support for ArrayBuffers and WebSocket data blobs (not fully tested yet)

### File Uploads

Functions don't accept multipart file uploads directly. Instead, files are handled through the [content service](/docs/api/content-service) — clients get signed upload/download URLs (local disk, S3, or Backblaze B2 backends) and the file bytes never flow through your functions.

## Bring a Runtime (or Use Ours)

Pikku functions don't bind to a port by themselves — they run inside a runtime adapter. That can be:

- **A full Pikku server** — `@pikku/express-server`, `@pikku/fastify-server`, `@pikku/bun-server`, `@pikku/node-http-server`, `@pikku/uws-server` — or simply `pikku dev` during development
- **Middleware in an existing app** — Express middleware, Fastify plugin, Next.js, TanStack Start
- **Serverless** — AWS Lambda, Cloudflare Workers, Azure Functions

The constraint is that the transport layer is always pluggable: Pikku owns routing, validation, and your business logic, while connection handling belongs to the adapter you pick. In practice this is what lets the same code move between servers and serverless without changes.

## Runtime Support

Current runtime support:

- **Supported**: Node.js 18+, Bun
- **Planned**: Deno support
- **Planned**: Browser support for sharing logic between client/server (with serverless dependencies)

Pikku currently generates type-safe client wrappers for browsers, but running Pikku functions directly in the browser is planned for future releases.

## Early Stage (v0.x)

Pikku is in active development. While stable for production use:

- **Breaking changes possible** - Follow semver within 0.x (0.1 → 0.2 may break)
- **API may evolve** - Feedback shapes the framework
- **Documentation gaps** - Some advanced features not fully documented yet

We take stability seriously, but version 0.x means we're still refining the API based on real-world usage.

## TypeScript-First

Pikku is built around TypeScript. The core features — automatic schema generation, type-safe clients, and tree-shaking — all rely on static analysis of your types. JavaScript projects can use Pikku, but without TypeScript you lose most of what makes it useful.

## Next Steps

Despite these limitations, Pikku handles most backend use cases effectively. Ready to get started?

- [Getting Started](/docs) - Build your first function
- [Architecture](/docs/philosophy/architecture) - Understanding how Pikku works
- [GitHub](https://github.com/pikkujs/pikku) - Request features or report issues
