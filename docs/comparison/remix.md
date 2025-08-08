---
sidebar_position: 4
title: Pikku vs Remix
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Remix vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Remix** is a **full-stack React framework** focused on web fundamentals, server-side rendering, and progressive enhancement. **Pikku**, on the other hand, is an **event-driven backend framework** that supports **multiple transports** and can work with any frontend framework, including React.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Remix** 🎯                             | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Full-stack React with web fundamentals   | Backend-focused, multi-transport framework |
| **Primary Use Case**      | React web applications with SSR          | Backend APIs with any frontend framework |
| **Architecture**         | Monolithic full-stack React              | Backend services with frontend flexibility |
| **Frontend Coupling**    | Tightly coupled to React                 | Framework-agnostic (works with React, Vue, etc.) |
| **Data Loading**         | loader/action pattern with forms         | API-first with auto-generated clients |
| **Real-time**            | Server-sent events, WebSockets via plugins | **Native WebSocket channels with pub/sub** |
| **API Design**           | Form-based actions and loaders           | **Transport-agnostic functions** |
| **Deployment**           | Full-stack deployment required           | **Backend-only, multiple deployment targets** |
| **Type Safety**          | TypeScript with manual API types         | **Auto-generated TypeScript clients** |
| **Authentication**       | Manual session management                | Built-in session management + middleware |
| **Database**             | Manual ORM/database setup                | Service injection pattern |
| **Testing**              | Full integration testing                  | **Per-function testing, independent of transport** |
| **Background Jobs**      | External solutions needed                | First class citizen with schedulers |
| **Progressive Enhancement** | Built-in with form handling           | Frontend framework responsibility |

---

## **Core Philosophies**

### **Remix: Full-Stack React with Web Fundamentals**
Remix is built on **web fundamentals** - leveraging HTTP, HTML forms, and browser APIs to create fast, resilient web applications. It's **React-focused** and provides server-side rendering with progressive enhancement.

- ✅ **Server-side rendering and streaming**  
- ✅ **Progressive enhancement with HTML forms**  
- ✅ **Optimistic UI and error boundaries**  
- ✅ **Built on web standards (HTTP, HTML, CSS)**  

### **Pikku: Backend-First, Frontend-Agnostic**
Pikku focuses on **backend architecture** - creating **transport-agnostic functions** that can serve any frontend framework. It provides **built-in services** for authentication, validation, and real-time communication.

- ✅ **Functions work across HTTP, WebSockets, RPC**  
- ✅ **Works with React, Vue, Angular, or any frontend**  
- ✅ **Built-in authentication, validation, and real-time**  
- ✅ **Auto-generated API clients and documentation**  

---

## **Feature Breakdown**

### **🏗️ Architecture Approach**
Fundamentally different architectural approaches.

| Aspect                 | **Remix** 🏛️                   | **Pikku** 🏗️                     |
|------------------------|--------------------------------|----------------------------------|
| **Application Type**   | Full-stack React application  | Backend API service |
| **Frontend Coupling**  | Tightly coupled to React      | Framework-agnostic |
| **Data Flow**          | Server → React components     | API → Any frontend framework |
| **Deployment Model**   | Full-stack deployment         | Backend service deployment |

### **📊 Data Management**
Different approaches to handling data loading and mutations.

| Feature                | **Remix** 🔄                    | **Pikku** 📊                     |
|------------------------|--------------------------------|----------------------------------|
| **Data Loading**       | loader functions per route     | API endpoints with auto-generated clients |
| **Mutations**          | action functions with forms    | API functions callable via HTTP/WS/RPC |
| **Caching**            | HTTP caching + React state     | Client-side caching (frontend responsibility) |
| **Optimistic Updates** | Built-in optimistic UI         | Frontend framework responsibility |
| **Real-time Updates**  | Server-sent events             | **Native WebSocket channels** |

### **🔗 API & Communication**
Different patterns for client-server communication.

| Communication Type     | **Remix** 🌐                    | **Pikku** 🔥                      |
|------------------------|----------------------------------|-----------------------------------|
| **HTTP API**          | Form actions + loaders          | ✅ **REST API with auto-generated client** |
| **Real-time**         | External WebSocket solutions    | ✅ **Native WebSocket channels** |
| **RPC**               | Not applicable (monolith)       | ✅ **Auto-generated RPC client** |
| **Background Tasks**  | External solutions needed        | ✅ **Built-in schedulers** |

### **🔑 Authentication & Security**
Different approaches to user authentication and authorization.

| Feature                | **Remix** 🔐                   | **Pikku** 🔒                   |
|------------------------|--------------------------------|--------------------------------|
| **Session Management** | Manual cookie/session handling | Built-in session service |
| **Authentication**     | Custom auth implementation     | Built-in auth middleware |
| **Authorization**      | Manual permission checks       | First-class permission system |
| **CSRF Protection**    | Built-in form CSRF tokens     | API-focused security |

### **🧪 Testing & Development**
Different testing and development experiences.

| Feature                | **Remix** 🧪                   | **Pikku** ⚗️                   |
|------------------------|--------------------------------|--------------------------------|
| **Testing Approach**   | Full integration testing       | **Direct function testing** |
| **Unit Testing**       | Component + integration tests  | **Transport-independent function tests** |
| **API Testing**        | Not applicable (integrated)   | **Direct API function testing** |
| **Mocking**            | Complex full-stack mocking     | Simple service mocking |

---

## **Code Examples**

### **Remix Route with Loader/Action**
```typescript
// app/routes/users.$userId.tsx
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, useLoaderData, useActionData } from "@remix-run/react"

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await db.user.findUnique({
    where: { id: params.userId }
  })
  if (!user) throw new Response("Not Found", { status: 404 })
  return json({ user })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const updates = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  }
  
  const user = await db.user.update({
    where: { id: params.userId },
    data: updates
  })
  
  return json({ user })
}

export default function UserProfile() {
  const { user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div>
      <h1>{user.name}</h1>
      <Form method="post">
        <input name="name" defaultValue={user.name} />
        <input name="email" defaultValue={user.email} />
        <button type="submit">Update</button>
      </Form>
      {actionData?.user && <p>Updated successfully!</p>}
    </div>
  )
}
```

### **Pikku Backend Functions + React Frontend**
```typescript
// Backend: user.functions.ts
export const getUser = pikkuFunc<{ userId: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.userId)
})

export const updateUser = pikkuFunc<UpdateUserInput, User>()
.func(async (services, data) => {
  return await services.database.updateUser(data.userId, data)
})

// Backend: user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users/:userId',
  func: getUser
})

wireHTTP({
  method: 'patch',
  route: '/users/:userId',
  func: updateUser
})
```

```typescript
// Frontend: React component (could also be Vue, Angular, etc.)
import { pikkuFetch } from './api/pikku-fetch.gen'
import { useState, useEffect } from 'react'

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    pikkuFetch.get(`/users/${userId}`)
      .then(setUser)
      .catch(console.error)
  }, [userId])

  const handleUpdate = async (formData: FormData) => {
    const updates = {
      userId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }
    
    const updatedUser = await pikkuFetch.patch(`/users/${userId}`, updates)
    setUser(updatedUser)
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <form action={handleUpdate}>
        <input name="name" defaultValue={user.name} />
        <input name="email" defaultValue={user.email} />
        <button type="submit">Update</button>
      </form>
    </div>
  )
}
```

---

## **Use Case Comparison**

### **Remix Strengths**
| Use Case | Why Remix |
|----------|-----------|
| **React Web Apps** | Built specifically for React with SSR |
| **SEO-Critical Sites** | Server-side rendering out of the box |
| **Progressive Enhancement** | Forms work without JavaScript |
| **Content-Heavy Sites** | Excellent for blogs, marketing sites |
| **Rapid Prototyping** | Full-stack React in one codebase |

### **Pikku Strengths**
| Use Case | Why Pikku |
|----------|-----------|
| **API-First Architecture** | Backend services for multiple frontends |
| **Real-time Applications** | Native WebSocket support |
| **Microservices** | Backend functions deployable anywhere |
| **Mobile + Web** | One backend serving multiple clients |
| **Team Separation** | Backend and frontend teams work independently |

---

## **When to Use Remix vs. Pikku**

### **Choose Remix if…**
✔️ You're building a **React web application** with server-side rendering  
✔️ You want **full-stack React** in a single deployment  
✔️ You need **progressive enhancement** and **SEO optimization**  
✔️ You prefer **form-based data mutations** over API calls  
✔️ You want **built-in optimistic UI** and error boundaries  
✔️ You're building **content-heavy websites** or **marketing sites**  
✔️ You have a **single frontend** (React web app)  

### **Choose Pikku if…**
✔️ You need **backend services** that can serve **multiple frontends**  
✔️ You're building **API-first applications** (web + mobile + desktop)  
✔️ You need **real-time features** with WebSocket channels  
✔️ You want **backend and frontend teams** to work independently  
✔️ You need **multiple deployment targets** (Express, Lambda, Cloudflare)  
✔️ You're building **microservices** or **distributed architectures**  
✔️ You want **framework-agnostic backends** (React, Vue, Angular, mobile)  

---

## **Architectural Decisions**

### **Remix: Monolithic Full-Stack**
```
┌─────────────────────────────────────┐
│           Remix App                 │
├─────────────────────────────────────┤
│  Routes (loaders + actions)         │
│  React Components                   │
│  Server-Side Rendering              │
│  Database Integration               │
└─────────────────────────────────────┘
         │
         ▼
    Single Deployment
```

### **Pikku: Distributed Backend + Frontend**
```
┌─────────────────┐    ┌─────────────────┐
│   Pikku API     │    │  React/Vue/etc  │
├─────────────────┤    ├─────────────────┤
│  Functions      │◄───┤  Auto-generated │
│  WebSockets     │    │  API Client     │
│  Schedulers     │    │  Components     │
│  Services       │    │  State Mgmt     │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
  Backend Deployment      Frontend Deployment
```

---

## **Final Thoughts**
Remix and Pikku serve **fundamentally different architectural approaches**:

- **Remix** is best for **React-focused web applications** that need **server-side rendering, progressive enhancement, and full-stack integration**.  
- **Pikku** is best for **API-first backends** that serve **multiple frontends, need real-time features, and require deployment flexibility**.

If **full-stack React web applications with SSR** are your priority, go with **Remix**. If you need **backend services that can power multiple frontends with real-time features and deployment flexibility**, **Pikku** is the way to go.

**They can also work together**: Use Pikku as your backend API service and consume it from a Remix frontend application!