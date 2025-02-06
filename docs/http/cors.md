---
sidebar_position: 3
title: Cross Origin Requests
description: Cross Origin Requests
---

Cross-Origin Resource Sharing (CORS) is a security feature that allows your application to request resources from different domains securely. It plays a crucial role in enabling web applications to interact with APIs and services hosted on other origins.

### Recommendation

We recommend managing CORS through your chosen runtime environment. Each platform offers robust, battle-hardened libraries and built-in support for handling CORS, ensuring reliable and efficient configuration. By leveraging your runtime's native CORS capabilities, you can simplify your setup and maintain consistency across your deployment environments, whilst also keeping Pikku focused on its core goals.

### Why Use Runtime-Provided CORS Solutions?

- **Stability and Security:** Established runtimes provide well-tested and secure implementations of CORS policies.
- **Ease of Configuration:** Simplified configuration options tailored to the specific needs of the platform.
- **Performance Optimization:** Optimized handling of CORS requests to ensure minimal latency and resource usage.
- **Seamless Integration:** Better integration with other middleware and services within the runtime ecosystem.

### Getting Started

Depending on your deployment platform, enabling CORS can vary:

- **Next.js:** Utilize the built-in [CORS middleware](https://nextjs.org/docs/api-routes/api-middlewares) to configure your policies.
- **Express:** Use the [cors](https://expressjs.com/en/resources/middleware/cors.html) middleware package for flexible CORS settings.
- **Fastify:** Implement CORS with the [@fastify/cors](https://www.fastify.io/docs/latest/Plugins/#cors) plugin for streamlined integration.
- **AWS Lambda:** Configure CORS directly in the API Gateway settings or use middleware libraries compatible with Lambda functions.
- **Cloudflare Workers:** Manage CORS headers within your worker scripts to control access policies.

By handling CORS at the runtime level, you ensure that your application remains secure and performant while taking full advantage of Pikku's function-first architecture.