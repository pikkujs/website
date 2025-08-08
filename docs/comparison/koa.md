---
sidebar_position: 8
title: Pikku vs Koa
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Koa vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Koa** is a **next-generation web framework** for Node.js created by the Express team, designed to be smaller, more expressive, and more robust using async/await. **Pikku**, on the other hand, is a **backend framework** that provides **transport-agnostic functions** with built-in services and deployment flexibility.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Koa** 🎯                               | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Minimalist, expressive HTTP framework    | Functions-first, transport-agnostic framework |
| **Primary Use Case**      | Lightweight HTTP APIs and middleware     | Full backend framework with built-in services |
| **Architecture**         | Middleware-centric with context objects  | Function-based with service injection |
| **Learning Curve**      | Gentle (familiar HTTP concepts)          | **Moderate (new transport-agnostic concepts)** |
| **Transport Support**     | HTTP only                                | **HTTP, WebSockets, RPC, schedulers** |
| **Function Architecture** | Route handlers with context              | **Transport-agnostic functions** |
| **Middleware System**    | Onion-skin middleware model              | **Built-in middleware + function middleware** |
| **Error Handling**       | try/catch with centralized handling      | **Built-in error handling with HTTP codes** |
| **Authentication**       | Manual implementation or middleware       | **Built-in session management + middleware** |
| **Validation**           | External libraries needed                | **Automatic from TypeScript types** |
| **Testing**              | HTTP request/response testing            | **Direct function testing** |
| **Background Jobs**      | External libraries needed                | **Built-in schedulers** |
| **Type Safety**          | Optional TypeScript support             | **TypeScript-first with runtime validation** |
| **Bundle Size**          | Very small (~550 lines)                 | **Larger (comprehensive framework)** |
| **Deployment**           | Manual configuration per platform        | **Built-in adapters for multiple platforms** |

---

## **Core Philosophies**

### **Koa: Expressive Minimalism with Async/Await**
Koa is designed to be a **smaller, more expressive foundation** for web applications and APIs. It leverages **async functions** to eliminate callbacks and greatly increase error-handling capabilities.

- ✅ **Async/await by design (no callback hell)**  
- ✅ **Minimalist core with powerful middleware system**  
- ✅ **Better error handling than Express**  
- ✅ **Context object containing request/response**  

### **Pikku: Functions-First with Service Injection**
Pikku focuses on **functions as the core abstraction**, making them **transport-agnostic** while providing **comprehensive backend services** out of the box.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Built-in authentication, validation, and services**  
- ✅ **Auto-generated clients and documentation**  
- ✅ **Multiple deployment targets with built-in adapters**  

---

## **Feature Breakdown**

### **🏗️ Architecture & Design**
Different approaches to application structure and middleware.

| Aspect                 | **Koa** 🏛️                     | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Core Size**          | Very small (~550 lines)        | Comprehensive framework |
| **Middleware Model**   | Onion-skin cascading middleware | Function middleware + built-in services |
| **Context Handling**   | Single context object (ctx)    | Service injection pattern |
| **Request/Response**   | ctx.request / ctx.response      | **Function parameters with type safety** |

### **📊 API Development**
Different approaches to building APIs and handling requests.

| Feature                | **Koa** 🔄                     | **Pikku** 📊                     |
|------------------------|---------------------------------|---------------------------------|
| **Route Definition**   | Manual routing (koa-router)     | **Wiring configuration** |
| **Parameter Handling** | ctx.params, ctx.request.body    | **Automatic type-safe parameters** |
| **Validation**         | External libraries (joi, etc.)  | **Automatic from TypeScript types** |
| **Error Handling**     | try/catch with app.onerror      | **Built-in error handling** |
| **Response Handling**  | Manual ctx.body assignment      | **Function return values** |

### **🔗 Transport & Protocols**
Koa focuses on HTTP, while Pikku supports multiple transports.

| Protocol Type          | **Koa** 🌐                     | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **HTTP REST**         | ✅ Core strength               | ✅ **Function wiring** |
| **WebSockets**        | ❌ External libraries needed   | ✅ **Native channels with pub/sub** |
| **RPC**               | ❌ Manual implementation        | ✅ **Auto-generated RPC interface** |
| **Scheduled Tasks**   | ❌ External cron solutions      | ✅ **Built-in schedulers** |
| **Background Jobs**   | ❌ External libraries needed    | ✅ **First-class support** |

### **🛠️ Developer Experience**
Different levels of built-in tooling and conventions.

| Feature                | **Koa** 🔧                     | **Pikku** ⚙️                     |
|------------------------|---------------------------------|---------------------------------|
| **TypeScript Support** | Good with @types/koa           | **TypeScript-first architecture** |
| **API Documentation**  | Manual setup needed            | **Auto-generated OpenAPI** |
| **Client Generation**  | Manual implementation          | **Auto-generated clients** |
| **Testing**            | supertest or similar           | **Direct function testing** |
| **Hot Reload**         | External tools (nodemon)       | **Built-in development features** |
| **Debugging**          | Standard Node.js debugging     | **Enhanced debugging with services** |

---

## **Code Examples**

### **Koa Application with Middleware**
```typescript
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { validate } from 'joi'

const app = new Koa()
const router = new Router()

// Global error handling
app.on('error', (err, ctx) => {
  console.error('Server error:', err, ctx)
})

// Middleware stack
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(bodyParser())

// Manual validation middleware
const validateUser = async (ctx, next) => {
  try {
    const { error } = userSchema.validate(ctx.request.body)
    if (error) {
      ctx.status = 400
      ctx.body = { error: error.details[0].message }
      return
    }
    await next()
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Validation error' }
  }
}

// Route handlers
router.get('/users/:id', async (ctx) => {
  try {
    const user = await db.getUser(ctx.params.id)
    if (!user) {
      ctx.status = 404
      ctx.body = { error: 'User not found' }
      return
    }
    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal server error' }
  }
})

router.post('/users', validateUser, async (ctx) => {
  try {
    const user = await db.createUser(ctx.request.body)
    ctx.status = 201
    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal server error' }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

### **Pikku Function-Based Approach**
```typescript
// user.functions.ts
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.func(async (services, data) => {
  return await services.database.createUser(data)
})

// user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users/:id',
  func: getUser
})

wireHTTP({
  method: 'post',
  route: '/users',
  func: createUser
})

// Same functions work via WebSocket automatically
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getUser,
      createUser
    }
  }
})

// Background processing with same functions
wireScheduler({
  name: 'user-maintenance',
  schedule: '0 1 * * *',
  func: cleanupInactiveUsers
})
```

---

## **Middleware Comparison**

### **Koa Onion-Skin Middleware**
```typescript
// Middleware flows downstream, then upstream
app.use(async (ctx, next) => {
  console.log('1 - Start')
  await next() // Control passes downstream
  console.log('1 - End')   // Control flows back upstream
})

app.use(async (ctx, next) => {
  console.log('2 - Start')
  await next()
  console.log('2 - End')
})

app.use(async (ctx, next) => {
  console.log('3 - Handler')
  ctx.body = 'Hello World'
})

// Output: 1-Start, 2-Start, 3-Handler, 2-End, 1-End
```

### **Pikku Function Middleware**
```typescript
// Middleware per function
const authMiddleware = pikkuMiddleware(async (services, interaction, next) => {
  const token = services.http.request?.header('authorization')
  if (!token) throw new UnauthorizedError()
  
  const session = await services.jwt.decode(token)
  services.userSession.setInitial(session)
  
  await next()
})

export const protectedFunction = pikkuFunc<{}, User>()
.middleware([authMiddleware])
.func(async (services, data, session) => {
  return { userId: session.userId }
})
```

---

## **Performance Comparison**

### **Koa Performance Characteristics**
- **HTTP Throughput**: ~45,000 req/s (faster than Express due to async/await)
- **Memory Usage**: Very low (minimalist design)
- **Cold Start**: Very fast startup time
- **Bundle Size**: Extremely small (~550 lines of code)

### **Pikku Performance Characteristics**
- **HTTP Throughput**: ~35,000 req/s (with built-in validation and services)
- **Memory Usage**: Higher due to built-in services
- **Cold Start**: Slightly slower due to service initialization
- **Bundle Size**: Larger (comprehensive framework)

---

## **When to Use Koa vs. Pikku**

### **Choose Koa if…**
✔️ You want **minimalist, lightweight HTTP framework**  
✔️ You prefer **maximum control** over application architecture  
✔️ You need **extremely fast startup times** and **small bundle size**  
✔️ You're building **simple HTTP APIs** without complex requirements  
✔️ You want to **choose your own middleware** and libraries  
✔️ You value **async/await first-class support** over Express  
✔️ You're **migrating from Express** and want better async handling  
✔️ You need **fine-grained middleware control** with onion-skin model  

### **Choose Pikku if…**
✔️ You need **multiple transport protocols** (HTTP, WebSockets, RPC)  
✔️ You want **built-in authentication, validation, and services**  
✔️ You prefer **function-based architecture** over middleware chains  
✔️ You need **automatic API documentation and client generation**  
✔️ You want **transport-agnostic business logic**  
✔️ You need **deployment flexibility** (Express, Lambda, Cloudflare)  
✔️ You want **TypeScript-first development** with runtime validation  
✔️ You need **built-in background job processing**  

---

## **Migration Considerations**

### **Koa to Pikku Migration**
1. **Middleware Chain** → **Function Definitions** (extract business logic)
2. **Context Object** → **Function Parameters** (type-safe data)
3. **Manual Routing** → **Wiring Configuration**
4. **ctx.body assignments** → **Function Return Values**
5. **External Validation** → **Automatic TypeScript Validation**

### **Gradual Migration Path**
1. **Phase 1**: Use Pikku's Express adapter alongside existing Koa
2. **Phase 2**: Extract route handlers into Pikku functions
3. **Phase 3**: Replace manual middleware with Pikku built-ins
4. **Phase 4**: Add WebSocket/RPC endpoints using same functions
5. **Phase 5**: Full migration to Pikku architecture

---

## **Ecosystem Comparison**

### **Koa Ecosystem**
| Category | Popular Libraries |
|----------|------------------|
| **Routing** | koa-router, @koa/router |
| **Body Parsing** | koa-bodyparser, koa-body |
| **Authentication** | koa-passport, koa-jwt |
| **Validation** | joi, yup, koa-validate |
| **CORS** | @koa/cors |
| **Static Files** | koa-static |
| **Sessions** | koa-session |
| **WebSockets** | koa-websocket |

### **Pikku Built-in Features**
| Category | Built-in Solution |
|----------|------------------|
| **Routing** | Wiring configuration |
| **Body Parsing** | Automatic from function types |
| **Authentication** | Built-in session management |
| **Validation** | Automatic from TypeScript types |
| **CORS** | Built-in CORS handling |
| **Static Files** | ❌ Not yet supported |
| **Sessions** | Built-in user session service |
| **WebSockets** | Native channel system |

---

## **Final Thoughts**
Koa and Pikku serve **different development philosophies**:

- **Koa** is best for developers who want a **minimal, fast HTTP framework** with **maximum control and flexibility**.  
- **Pikku** is best for developers who want a **comprehensive backend framework** with **built-in services and transport-agnostic architecture**.

If **minimalism, speed, and full control** are your priority, go with **Koa**. If you want **comprehensive features, transport-agnostic functions, and built-in services**, **Pikku** is the way to go.

**Migration path**: Many teams start with **Koa for HTTP APIs**, then **add Pikku when they need WebSockets, background jobs, and multi-platform deployment**!