---
sidebar_position: 10
title: Vision
---

Pikku is built on three core visions that shape how you build backends. Like a chameleon adapting to its environment, Pikku keeps your logic intact while flexing to fit wherever you need to run.

## Function-First: Write Once, Call Anywhere

Your business logic shouldn't care how it's invoked. Write it once as a **typed function**. Call it from anywhere:

- **HTTP** - REST APIs with OpenAPI
- **WebSocket** - Real-time bidirectional communication
- **Server-Sent Events** - Progressive enhancement, stream updates
- **Queue** - Background jobs and async processing
- **Cron** - Scheduled tasks
- **RPC** - Internal function-to-function calls
- **MCP** - AI agent tools (Claude, GPT, and more)
- **CLI** - Command-line interfaces

No code duplication. No logic fragmentation. **Just functions.**

This flexibility means you can build for traditional servers and serverless platforms using the same codebase - without the headaches of mixing paradigms.

**Current limitations:** File uploads and non-JSON content types aren't supported yet.

---

## Deploy Anywhere: Zero Lock-In

Pick your runtime. Change it tomorrow. Your code stays the same.

- **Traditional Servers** - [Express](https://expressjs.com), [Fastify](https://www.fastify.io), [uWS](https://github.com/uNetworking/uWebSockets.js)
- **Serverless** - [AWS Lambda](https://aws.amazon.com/lambda), [Azure Functions](https://azure.microsoft.com/en-us/products/functions/), [Cloudflare Workers](https://workers.cloudflare.com)
- **AI Agents** - [MCP](https://modelcontextprotocol.io/docs/philosophy/resources) for Claude, GPT, and other models
- **Full-Stack Frameworks** - [Next.js](https://nextjs.org) with App or Pages Router

**Start with a monolith. Scale to microservices. Optimize individual functions.** All without rewriting a single line of business logic.

No framework lock-in. No vendor lock-in. **Just adaptability.**

---

## Developer Experience: Less Boilerplate, More Building

Pikku is for developers who hate boilerplate and love simplicity.

**Your functions receive:**
- Services (database, cache, logger)
- Data (validated automatically)
- User sessions

**They return:**
- Data (or streaming updates)
- Errors

**That's it.** No HTTP headers. No status codes. No protocol details. No decorators. **Just pure TypeScript.**

### TypeScript Does the Heavy Lifting

Pikku uses your types to automate everything:

- **Runtime Validation** - JSON schemas generated from TypeScript types (no extra libraries)
- **Type-Safe Clients** - Auto-generated HTTP fetch, WebSocket, and RPC clients
- **OpenAPI Docs** - Complete API documentation from your functions
- **Smart Tree-Shaking** - Bundle only what you deploy (coming soon: service-level tree-shaking)
- **Next.js Integration** - Typed wrappers for seamless full-stack development
- **Session Management** - Built-in auth and permissions across all protocols

**You write functions. Pikku handles the rest.** No decorators, no runtime reflection, no magic—just static analysis of plain TypeScript.

---

## The Greener Future: Optimize for the Planet

Infrastructure choices have environmental consequences. Pikku's flexibility lets you experiment with different runtimes and measure their impact.

**VMs? Containers? Serverless?** Test them all with the same codebase. Compare:
- CPU cycles
- Memory consumption
- Carbon footprint

Imagine a future where Pikku helps you optimize not just for performance and cost, but for **environmental impact** too. Choose the runtime that's best for your users *and* the planet.

This vision is still in the concept stage, but we're committed to making performance optimization and environmental responsibility go hand in hand.