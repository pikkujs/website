---
sidebar_position: 0
title: Pikku
description: Introducting Pikku
---

Pikku - meaning tiny 🔎 in Finnish - is a minimalistic batteries included framework built around simple functions. It works with any event driven design (currently http, websockets and scheduled tasks) and can be run on any Javascript runtime, currently Cloudflare Workers, Fastify, Bun, AWS Lambda, Express, uWS, WS and others.

And by minimal we really mean minimal!

```typescript
const helloWorld: APIFunction<{ language: 'en' | 'es' }, string> = async (
  services, data, session
) => {
  services.logger.info(`${session.username} said hello!`)
  return `${language === 'en' ? 'Hey' : 'Ola' } ${session.username}!`
}

addRoute({ method: 'get', route: '/', func: helloWorld })
```

---

## Quick Start

```bash npm2yarn
npm create pikku
```

---

## Features

* **Tiny** 🔎 - The Pikku runtime is xKB. It relies on two small dependencies [cookie](...) and [path-to-regex](...).
* **Deploy Anywhere** 🌍 - Run your functions anywhere, as long as it's event based. Currently supporting HTTP, WebSockets and Scheduled Tasks with more coming soon.
* **Batteries Included** 🔋 - Services, session management, auth, docs, it's all here..
* **Zero Boilerplate** 🪶 - Only write business logic in Typescript, Pikku automatically optimizes, validates and generates everything needed in a powerful framework.

---

## Quick Intro

// TODO: Add a getting started video

---

## The Function-First Vision

At the heart of Pikku is the concept of defining all your logic as **typed functions**. These functions can be mapped to various use cases, including:

- HTTP routes
- WebSockets
- Cron jobs and scheduled tasks
- Queues
- Other event based interactions

This design ensures your codebase is completely flexible, allowing it to seamlessly support both traditional servers and serverless platforms. It eliminates the pain points typically encountered when switching between these paradigms or attempting to use them simultaneously within a single codebase.

What it can't do (at least yet) is:

- Upload files
- Deal with content types other than `application/json`

--- 

## The Deploy anywhere vision

With Pikku, you can deploy your functionality using:

- Traditional servers like **[Express](https://expressjs.com)**, **[Fastify](https://www.fastify.io)**, and **[uWS (µWebSockets)](https://github.com/uNetworking/uWebSockets.js)**
- Serverless platforms like **[AWS Lambda](https://aws.amazon.com/lambda)**, **[Azure Functions](https://azure.microsoft.com/en-us/products/functions/)**, and **[Cloudflare Workers](https://workers.cloudflare.com)**
- Use it directly in Full-Stack frameworks like **[Next.js](https://nextjs.org)**

Its flexibility allows you to choose the best runtime for your project without being locked into a specific framework.

---

## The happy developer experience vision

Pikku was born out of the mind of someone you can almost say is allergic to boilerplate code, whilst also a devout believer that a framework is needed to keep complexity at bay.

Your function(s) are given services (both singleton and session based), data and the user session. They return data (send updates if using a stream) or throw an Error. There's not much else to it.

What this resulted in was an automated process that depended almost entirely on **types** that:

- **Provide Runtime Validation** - turn your function inputs to json schemas to validate against during runtime. No need to any external library.
- **Smart service management** - inspect which services are used to dynamically tree-shake your dependencies (this is next on the road map).
- **Generate Fetch APIs** - extracts all your function inputs and outputs to types that can be fed into a *tiny* fetch client.
- **Generate WebSocket APIs** - extracts all your websockets interactions to give you a fully typed WebSocket client out of the box.
- **Generate OpenAPI Docs** - automatically generates OpenAPI documentation out of all your HTTP routes
- **more** - typed nextJS wrappers, error handling, session management, granual permissions

---

## The Greener Future vision

As infrastructure choices multiply, understanding their environmental impact becomes more important. Pikku’s flexibility makes it easier to experiment with different runtimes, servers, and deployment options—be it on VMs, containers, or serverless. By observing how these choices affect **CPU cycles and memory consumption**, you can get a clearer picture of the carbon footprint associated with your application’s workload.

We’re excited about the idea of using Pikku as a platform to help companies make environmentally informed decisions. Imagine comparing resource usage and emissions across runtimes and automatically suggesting lower-impact configurations. While this is still in the concept stage, it’s a direction we’re exploring to align performance optimization with environmental responsibility.
