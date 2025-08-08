---
sidebar_position: 6
title: Pikku vs Next.js
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Next.js vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Next.js** is a **full-stack React framework** with server-side rendering, API routes, and deployment optimization. **Pikku**, on the other hand, is a **backend-focused framework** that provides **transport-agnostic functions** and can integrate seamlessly with Next.js frontends.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Next.js** 🎯                           | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Full-stack React with optimized deployment | Backend-focused, transport-agnostic framework |
| **Primary Use Case**      | React web applications with SSR/SSG      | Backend APIs that can serve any frontend |
| **Frontend Coupling**    | Tightly coupled to React                 | Framework-agnostic (works with Next.js, Vue, etc.) |
| **API Architecture**     | API Routes in pages/app directory        | **Transport-agnostic functions** |
| **Real-time**            | Manual WebSocket setup                   | **Native WebSocket channels with pub/sub** |
| **Background Jobs**      | External solutions (Vercel Cron, etc.)  | **Built-in schedulers and task management** |
| **Authentication**       | NextAuth.js or custom implementation     | **Built-in session management + middleware** |
| **Database Integration** | Manual ORM/database setup                | **Service injection pattern** |
| **Deployment**           | Vercel-optimized, supports other platforms | **Multiple deployment targets (Express, Lambda, etc.)** |
| **Type Safety**          | TypeScript with manual API types         | **Auto-generated TypeScript clients** |
| **Testing**              | Component + API route testing            | **Per-function testing, transport-independent** |
| **File Uploads**         | Built-in support                         | ❌ Not yet supported |
| **Edge Functions**       | Vercel Edge Functions                    | **Functions deploy to edge platforms** |
| **Static Generation**    | ISR, SSG, SSR                           | N/A (backend-only) |

---

## **Core Philosophies**

### **Next.js: Full-Stack React Framework**
Next.js is designed as a **complete React framework** that handles both frontend rendering and backend API routes. It's optimized for **web performance, SEO, and developer experience** within the React ecosystem.

- ✅ **Server-side rendering and static generation**  
- ✅ **Built-in API routes for backend functionality**  
- ✅ **Optimized bundling and performance**  
- ✅ **Vercel deployment optimization**  

### **Pikku: Backend Framework with Next.js Integration**
Pikku focuses on **backend architecture** with **transport-agnostic functions** that can power any frontend, including Next.js applications. It provides a **Next.js integration** for seamless full-stack development.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Built-in Next.js integration and adapter**  
- ✅ **Backend services (auth, validation, permissions)**  
- ✅ **Auto-generated API clients for Next.js consumption**  

---

## **Feature Breakdown**

### **🏗️ Architecture Approach**
Different approaches to full-stack application architecture.

| Aspect                 | **Next.js** 🏛️                 | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Application Model**  | Monolithic full-stack           | Backend service + frontend integration |
| **API Design**         | File-based API routes           | **Function-based, transport-agnostic** |
| **Code Organization**  | Pages/App router with API routes | **Separate backend functions + wiring** |
| **Deployment Model**   | Single full-stack deployment    | **Backend + frontend can deploy separately** |

### **📊 Data Fetching & APIs**
Different patterns for data loading and API design.

| Feature                | **Next.js** 🔄                  | **Pikku** 📊                     |
|------------------------|----------------------------------|-----------------------------------|
| **Data Fetching**      | getServerSideProps, app router  | **Auto-generated API clients** |
| **API Routes**         | File-based in pages/api         | **Function definitions with wiring** |
| **Type Safety**        | Manual type definitions          | **Auto-generated TypeScript types** |
| **Caching**            | ISR, React cache                | **Client-side caching (your choice)** |
| **Real-time Data**     | Manual WebSocket implementation  | **Built-in WebSocket channels** |

### **🔗 Backend Capabilities**
Different approaches to backend functionality.

| Backend Feature        | **Next.js** 🌐                  | **Pikku** 🔥                      |
|------------------------|----------------------------------|-----------------------------------|
| **API Endpoints**      | API Routes (HTTP only)          | ✅ **HTTP, WebSocket, RPC endpoints** |
| **Background Jobs**    | External services needed         | ✅ **Built-in schedulers** |
| **Authentication**     | NextAuth.js integration          | ✅ **Built-in auth services** |
| **Database**           | Manual setup (Prisma, etc.)     | ✅ **Service injection pattern** |
| **Middleware**         | Next.js middleware               | ✅ **Function + transport middleware** |
| **Validation**         | Manual validation libraries      | ✅ **Automatic from TypeScript types** |

### **🚀 Deployment & Performance**
Different deployment strategies and performance characteristics.

| Aspect                 | **Next.js** 🚀                  | **Pikku** ⚡                      |
|------------------------|----------------------------------|-----------------------------------|
| **Primary Platform**   | Vercel (optimized)               | **Multiple platforms (Express, Lambda, etc.)** |
| **Edge Functions**     | Vercel Edge Runtime              | **Cloudflare Workers, AWS Lambda@Edge** |
| **Cold Starts**        | Optimized for Vercel             | **Optimized for serverless platforms** |
| **Static Assets**      | Built-in optimization            | **Frontend framework responsibility** |
| **Database Connection** | Connection pooling needed        | **Service-based connection management** |

### **🧪 Testing & Development**
Different testing approaches and developer experience.

| Feature                | **Next.js** 🧪                  | **Pikku** ⚗️                     |
|------------------------|----------------------------------|-----------------------------------|
| **API Testing**        | HTTP request testing             | **Direct function testing** |
| **Component Testing**  | React Testing Library            | **N/A (backend-focused)** |
| **Integration Testing** | Full-stack testing required     | **Transport-independent testing** |
| **Mocking**            | API route mocking                | **Simple service mocking** |
| **Hot Reload**         | Built-in for pages and API      | **Development server with reload** |

---

## **Code Examples**

### **Next.js API Routes + Frontend**
```typescript
// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  
  if (req.method === 'GET') {
    try {
      const user = await db.user.findUnique({
        where: { id: id as string }
      })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PATCH') {
    const user = await db.user.update({
      where: { id: id as string },
      data: req.body
    })
    res.json(user)
  }
}
```

```typescript
// pages/users/[id].tsx
import { GetServerSideProps } from 'next'
import { useState } from 'react'

export default function UserPage({ user: initialUser }: { user: User }) {
  const [user, setUser] = useState(initialUser)

  const updateUser = async (updates: Partial<User>) => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updatedUser = await response.json()
    setUser(updatedUser)
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {/* Component implementation */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${params?.id}`)
  const user = await response.json()
  return { props: { user } }
}
```

### **Pikku Backend + Next.js Integration**
```typescript
// Backend: user.functions.ts
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const updateUser = pikkuFunc<UpdateUserInput, User>()
.auth(true)
.func(async (services, data, session) => {
  return await services.database.updateUser(data.id, data, session.userId)
})

// Backend: user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users/:id',
  func: getUser
})

wireHTTP({
  method: 'patch',
  route: '/users/:id',
  func: updateUser,
  auth: true
})

// Real-time updates via WebSocket
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      updateUser
    }
  }
})
```

```typescript
// Next.js Frontend: pages/users/[id].tsx
import { pikku } from '@/lib/pikku-nextjs.gen'
import { useState } from 'react'
import { GetServerSideProps } from 'next'

export default function UserPage({ user: initialUser }: { user: User }) {
  const [user, setUser] = useState(initialUser)

  const updateUser = async (updates: Partial<User>) => {
    // Type-safe API call with auto-generated client
    const updatedUser = await pikku.dynamicActionRequest(
      '/users/:id', 
      'patch', 
      { ...updates, id: user.id }
    )
    setUser(updatedUser)
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {/* Component implementation with type-safe updates */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Server-side API call using Pikku Next.js integration
  const user = await pikku.staticActionRequest(
    '/users/:id',
    'get',
    { id: params?.id as string }
  )
  return { props: { user } }
}
```

---

## **Integration Patterns**

### **Next.js Monolithic Approach**
```
┌─────────────────────────────────────┐
│           Next.js App               │
├─────────────────────────────────────┤
│  Pages/App Router                   │
│  API Routes (/api/*)                │
│  React Components                   │
│  Server-Side Rendering              │
└─────────────────────────────────────┘
         │
         ▼
    Vercel Deployment
```

### **Pikku + Next.js Integration**
```
┌─────────────────┐    ┌─────────────────┐
│   Pikku API     │    │   Next.js App   │
├─────────────────┤    ├─────────────────┤
│  Functions      │◄───┤  pikku.gen.ts   │
│  WebSockets     │    │  Pages/App      │
│  Schedulers     │    │  Components     │
│  Services       │    │  SSR/SSG        │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
  Backend Deployment       Vercel/Other
  (Express/Lambda/etc)     Frontend Deploy
```

---

## **Use Case Scenarios**

### **Next.js Excels At**
| Use Case | Why Next.js |
|----------|-------------|
| **React Web Apps** | Built specifically for React with SSR/SSG |
| **Marketing Sites** | Excellent SEO and static generation |
| **E-commerce** | ISR for product pages, built-in optimization |
| **Content Sites** | Static generation with dynamic updates |
| **MVP Development** | Rapid full-stack development |

### **Pikku + Next.js Excels At**
| Use Case | Why Pikku + Next.js |
|----------|---------------------|
| **Complex Backends** | Custom business logic with Next.js frontend |
| **Real-time Apps** | WebSocket support + React frontend |
| **Multi-Platform** | Same backend serves web + mobile |
| **Microservices** | Backend services + Next.js as one client |
| **Team Separation** | Backend and frontend teams work independently |

---

## **When to Use Next.js vs. Pikku**

### **Choose Next.js (standalone) if…**
✔️ You're building a **React-focused web application**  
✔️ You need **server-side rendering and static generation**  
✔️ You want **rapid full-stack development** in one framework  
✔️ You prefer **file-based routing** for both pages and APIs  
✔️ You're deploying primarily to **Vercel** for optimization  
✔️ You have **simple backend requirements** (CRUD operations)  
✔️ You want **built-in performance optimizations**  

### **Choose Pikku + Next.js if…**
✔️ You need **complex backend business logic** with React frontend  
✔️ You want **real-time features** with WebSocket support  
✔️ You need **multiple deployment targets** for the backend  
✔️ You're building **multi-platform applications** (web + mobile)  
✔️ You want **backend and frontend teams** to work independently  
✔️ You need **advanced authentication and permission systems**  
✔️ You require **background job processing** and **scheduled tasks**  
✔️ You want **transport-agnostic backend functions**  

### **Choose Pure Pikku (no Next.js) if…**
✔️ You're building **API-first applications** for multiple frontends  
✔️ You don't need **React** or **server-side rendering**  
✔️ You're building **backend services** or **microservices**  
✔️ You need **real-time APIs** for mobile or desktop applications  

---

## **Migration and Coexistence**

### **Next.js to Pikku + Next.js Migration**
1. **Phase 1**: Extract API routes to Pikku functions
2. **Phase 2**: Set up Pikku Next.js integration
3. **Phase 3**: Replace manual API calls with auto-generated clients
4. **Phase 4**: Add WebSocket and real-time features
5. **Phase 5**: Separate backend and frontend deployments

### **Gradual Integration Path**
```typescript
// Start: Next.js API route
// pages/api/users.ts

// Migrate to: Pikku function
// backend/users.functions.ts + backend/users.wiring.ts

// Next.js consumes via: Auto-generated client
// lib/pikku-nextjs.gen.ts
```

---

## **Performance Comparison**

### **Next.js Strengths**
- **Static generation** for marketing/content sites
- **Vercel edge network** optimization
- **Built-in image and font optimization**
- **Automatic code splitting**

### **Pikku Strengths**
- **Serverless-optimized** backend functions
- **Multiple deployment targets** for cost optimization
- **Real-time WebSocket** performance
- **Transport-agnostic** function reuse

---

## **Final Thoughts**
Next.js and Pikku can work **beautifully together** or serve different needs:

- **Next.js alone** is best for **React web applications** that need **SSR/SSG, rapid development, and Vercel optimization**.  
- **Pikku + Next.js** is best for **complex full-stack applications** that need **advanced backend features, real-time capabilities, and deployment flexibility**.  
- **Pure Pikku** is best for **backend APIs** serving **multiple frontend frameworks** or **mobile applications**.

**Recommended approach**: Start with **Next.js for simple backends**, then **add Pikku when you need advanced backend features, real-time capabilities, or multi-platform support**. The integration is seamless and allows gradual migration!