---
sidebar_position: 1
title: Pikku vs tRPC
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **tRPC vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **tRPC** is a **type-safe RPC framework** that focuses on seamless client-server communication with TypeScript. **Pikku**, on the other hand, is an **event-driven backend framework** that supports **multiple transports beyond RPC**, with **built-in HTTP, WebSocket, and scheduled task support**, and **automatic schema validation**.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **tRPC** 🎯                               | **Pikku** ⚡                          |
|--------------------------|-----------------------------------------|--------------------------------------|
| **Core Philosophy**       | Type-safe RPC with end-to-end TypeScript | Event-driven, multi-transport framework |
| **Primary Use Case**      | Full-stack TypeScript apps with type safety | Full backend framework with built-in services |
| **Transport Support**     | HTTP (RPC-style) + WebSockets via subscriptions | HTTP, WebSockets, RPC, and scheduled tasks |
| **Function Architecture** | Procedures are RPC-focused              | Functions are **transport-agnostic** (can be HTTP, WebSockets, RPC, etc.) |
| **Type Safety**           | End-to-end TypeScript type inference    | TypeScript with automatic schema validation |
| **Authentication**        | Context-based auth with middleware      | Built-in session management + middleware |
| **Permissions**           | Context-based with custom logic        | First-class permission system |
| **Schema Validation**     | Zod integration for runtime validation | **Automatic schema validation from TypeScript types** |
| **Testing**               | Requires full client-server setup      | **Per-function testing, independent of transport** |
| **Scaffolding**           | `create-t3-app` for Next.js stack      | `npm run pikku@latest` for full project |
| **WebSockets**            | Subscriptions via WebSocket transport  | **Native WebSocket channels with pub/sub** |
| **API Client**            | Auto-generated TypeScript client       | **Built-in fetch, WebSocket, and RPC clients** |
| **Framework Agnostic**    | Works with Next.js, Express, Fastify   | **Deploys to Express, Lambda, Cloudflare, Next.js** |
| **Background Jobs**       | Not supported                          | First class citizen with schedulers |
| **Real-time**             | Subscriptions with WebSocket transport | **Built-in channel system with pub/sub** |

---

## **Core Philosophies**

### **tRPC: End-to-End Type Safety**
tRPC is a **TypeScript-first RPC framework** that provides seamless type safety from server to client. It focuses on **eliminating the gap between backend and frontend** by sharing types and providing automatic client generation.

- ✅ **Full TypeScript type inference across client-server boundary**  
- ✅ **No code generation - types are shared at build time**  
- ✅ **Works with existing HTTP infrastructure**  
- ✅ **Excellent DX with autocomplete and type checking**  

### **Pikku: Transport-Agnostic Event-Driven Framework**
Pikku takes a **different approach**—it's an **event-driven framework** that **removes transport concerns from functions**. You define business logic **without worrying about whether it's an RPC call, HTTP request, WebSocket event, or scheduled task**.

- ✅ **Functions as endpoints (transport-agnostic architecture)**  
- ✅ **Supports HTTP, WebSockets, RPC, and scheduled tasks**  
- ✅ **Batteries-included: auth, permissions, validation, testing**  
- ✅ **Auto-generated clients for multiple protocols**  

---

## **Feature Breakdown**

### **🚀 Developer Experience**
Both frameworks prioritize developer experience but take different approaches.

| Aspect                 | **tRPC** 🎯                    | **Pikku** ⚡                      |
|------------------------|--------------------------------|----------------------------------|
| **Type Safety**        | End-to-end TypeScript inference | TypeScript + runtime validation |
| **Code Generation**    | No codegen needed - shared types | Auto-generates clients and schemas |
| **Autocomplete**       | Full autocomplete in client   | Full autocomplete for all clients |
| **Error Handling**     | Type-safe errors              | Type-safe errors with HTTP codes |

### **📦 Project Setup & Architecture**
Different approaches to project structure and organization.

| Aspect                 | **tRPC** 🛠️                     | **Pikku** 🛠️                     |
|------------------------|---------------------------------|---------------------------------|
| **Project Setup**      | `create-t3-app` or manual setup | `npm run pikku@latest` |
| **Router Definition**  | Nested router objects          | File-based function definitions |
| **Procedure Types**    | Query, Mutation, Subscription  | Functions work across all transports |
| **Middleware**         | tRPC middleware system         | Transport + function middleware |

### **🔗 Transport & Protocols**
tRPC focuses on RPC over HTTP, while Pikku supports multiple transports natively.

| Transport Type         | **tRPC** 🚀                      | **Pikku** 🔥                      |
|------------------------|--------------------------------|----------------------------------|
| **RPC**               | ✅ Core focus                  | ✅ Built-in with auto-generated client |
| **HTTP REST**         | ❌ Not the primary pattern    | ✅ Full HTTP support |
| **WebSockets**        | ✅ Subscriptions only          | ✅ **Full WebSocket channels with pub/sub** |
| **Scheduled Tasks**   | ❌ Not supported               | ✅ Built-in task scheduling |
| **Background Jobs**   | ❌ External solutions needed   | ✅ First-class support |

### **🔑 Authentication & Permissions**
Both provide auth solutions but with different approaches.

| Feature                | **tRPC** 🔓                    | **Pikku** 🔐                   |
|------------------------|--------------------------------|--------------------------------|
| **Authentication**     | Context-based with middleware  | Built-in session management |
| **Authorization**      | Custom logic in procedures     | First-class permission system |
| **Session Management** | Manual implementation          | Built-in user session service |
| **Middleware Auth**    | ✅ Flexible context system    | ✅ Built-in auth middleware |

### **🛠️ Client Generation & Integration**
Different approaches to client-server communication.

| Feature                | **tRPC** 🔧                      | **Pikku** ⚙️                      |
|------------------------|--------------------------------|----------------------------------|
| **Client Generation**  | ✅ Automatic TypeScript client | ✅ **Auto-generated for HTTP, WS, RPC** |
| **Type Inference**     | ✅ Full end-to-end types      | ✅ Full TypeScript support |
| **React Integration**  | ✅ `@trpc/react-query`        | ✅ Works with any React setup |
| **Next.js Integration**| ✅ Official Next.js adapter   | ✅ **Built-in Next.js wrapper** |
| **Framework Support**  | Express, Fastify, Next.js     | **Express, Lambda, Cloudflare, Next.js** |

---

## **Code Examples**

### **tRPC Procedure Definition**
```typescript
const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.user.findUnique({ where: { id: input.id } })
    }),
  
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string() }))
    .mutation(async ({ input }) => {
      return await db.user.create({ data: input })
    })
})

// Client usage
const user = await trpc.getUser.query({ id: '1' })
```

### **Pikku Function Definition**
```typescript
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.func(async (services, data) => {
  return await services.database.createUser(data)
})

// Available via HTTP, RPC, and WebSockets automatically
// HTTP: GET /users/:id
// RPC: pikkuRPC.invoke('getUser', { id: '1' })
// WebSocket: channel.send('getUser', { id: '1' })
```

---

## **When to Use tRPC vs. Pikku**

### **Choose tRPC if…**
✔️ You have a **TypeScript full-stack application** (especially Next.js)  
✔️ You want **end-to-end type safety** without code generation  
✔️ You prefer **RPC-style APIs** over REST  
✔️ You need **real-time features via subscriptions**  
✔️ You want to **work with existing HTTP infrastructure**  
✔️ You're building a **React + Next.js application**  

### **Choose Pikku if…**
✔️ You need **multiple transport protocols** (HTTP, WebSockets, RPC, scheduled tasks)  
✔️ You want **built-in authentication, permissions, and validation**  
✔️ You prefer **function-based architecture** over router-based  
✔️ You need **deployment flexibility** (Express, Lambda, Cloudflare Workers)  
✔️ You want **transport-agnostic business logic**  
✔️ You need **built-in background job processing**  
✔️ You want **automatic API documentation and client generation**  

---

## **Final Thoughts**
Both tRPC and Pikku are excellent frameworks, but they serve **different architectural needs**:

- **tRPC** is best for **TypeScript full-stack applications** that prioritize **end-to-end type safety** and **RPC-style communication**.  
- **Pikku** is best for **multi-transport backends** that need **HTTP, WebSockets, scheduled tasks** and **deployment flexibility**.

If **end-to-end TypeScript type safety** and **RPC communication** are your priority, go with **tRPC**. If you need a **transport-agnostic backend framework with multiple protocols, built-in services, and deployment flexibility**, **Pikku** is the way to go.