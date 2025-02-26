---
sidebar_position: 10  
title: Vision
---

Pikku is a combination of multiple different visions combined, which together lead the way to how it works.

## The Function-First Vision

At the heart of Pikku is the idea that all your logic is defined as **typed functions**. These functions can handle a variety of use cases, such as:

- HTTP routes
- WebSockets
- Cron jobs and scheduled tasks
- Queues
- Other event-driven interactions

This approach delivers complete flexibility, allowing your codebase to support both traditional servers and serverless platforms without the typical pain points that arise when trying to mix paradigms. 

*Current limitations (for now):*

- File uploads
- Handling content types other than `application/json`

---

## The Deploy Anywhere Vision

Pikku empowers you to deploy your functionality on any platform:

- **Traditional Servers:** Use with frameworks like [Express](https://expressjs.com), [Fastify](https://www.fastify.io), or [uWS (µWebSockets)](https://github.com/uNetworking/uWebSockets.js).
- **Serverless Platforms:** Deploy on [AWS Lambda](https://aws.amazon.com/lambda), [Azure Functions](https://azure.microsoft.com/en-us/products/functions/), or [Cloudflare Workers](https://workers.cloudflare.com).
- **Full-Stack Frameworks:** Integrate directly with frameworks like [Next.js](https://nextjs.org).

This versatility lets you choose the best runtime for your project without being tied to a single framework.

---

## The Happy Developer Experience Vision

Pikku was created for developers who desire to avoid boilerplate and believe in keeping complexity under control. In Pikku:

- **Function Input:** Your functions receive services (both singleton and session-based), data, and user sessions.
- **Function Output:** They return data (or stream updates) or throw errors—nothing more.

This simplicity is achieved through an automated process driven almost entirely by **types**, which allows Pikku to:

- **Provide Runtime Validation:** Automatically convert function inputs into JSON schemas for runtime validation—no extra libraries needed.
- **Smart Service Management:** Inspect used services and dynamically tree-shake dependencies (a future enhancement on our roadmap).
- **Generate Fetch APIs:** Extract function inputs and outputs into types for a lightweight, type-safe fetch client.
- **Generate WebSocket APIs:** Offer fully typed WebSocket clients by extracting your real-time interactions.
- **Generate OpenAPI Docs:** Automatically produce API documentation for all your HTTP routes.
- **Additional Features:** Include typed Next.js wrappers, error handling, session management, granular permissions, and more.

---

## The Greener Future Vision

As the variety of infrastructure options grows, understanding their environmental impact becomes crucial. Pikku’s flexibility lets you experiment with different runtimes—whether on VMs, containers, or serverless—while monitoring how these choices affect **CPU cycles** and **memory consumption**. 

Imagine a future where Pikku not only optimizes performance but also helps companies make environmentally informed decisions by comparing resource usage and carbon emissions across different configurations. Although this vision is still in the concept stage, we’re excited about aligning performance optimization with environmental responsibility.