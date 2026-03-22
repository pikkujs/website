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

File uploads are not yet fully supported. See the [content service documentation](/docs/api/content-service) for our planned approach to file handling.

## Not a Standalone Server

Pikku is not a standalone HTTP server or runtime. It requires an adapter:

- Express, Fastify, Bun, Next.js
- AWS Lambda, Cloudflare Workers
- And more...

This is by design - Pikku focuses on business logic and routing, not server concerns like connection handling or request parsing.

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
