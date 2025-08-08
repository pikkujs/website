---
sidebar_position: 8
title: Pikku vs Convex
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Convex vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Convex** is a **reactive backend platform** that provides real-time databases, serverless functions, and automatic caching with a TypeScript-first approach. **Pikku**, on the other hand, is a **backend framework** that provides **transport-agnostic functions** with built-in services and deployment flexibility.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Convex** 🎯                            | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Reactive backend with real-time database | Functions-first, transport-agnostic framework |
| **Primary Use Case**      | Real-time applications with reactive data | Backend APIs with deployment flexibility |
| **Database**             | Built-in reactive document database      | **Any database with service injection** |
| **Real-time**            | Reactive queries with automatic subscriptions | **WebSocket channels with pub/sub** |
| **Architecture**         | Query/Mutation functions with reactive data | **Transport-agnostic functions** |
| **Vendor Lock-in**       | High (Convex-specific APIs)             | **Zero (deploy anywhere)** |
| **Learning Curve**      | Moderate (reactive concepts)             | **Moderate (functional approach)** |
| **Type System**          | TypeScript-first with schema validation  | **TypeScript-first with runtime validation** |
| **Authentication**       | Built-in auth with providers             | **Built-in session management** |
| **Caching**              | Automatic reactive caching               | **Client-side caching responsibility** |
| **Deployment**           | Managed Convex cloud                     | **Multiple deployment targets** |
| **Offline Support**      | Built-in optimistic updates             | **Client-side responsibility** |
| **Background Jobs**      | Scheduled functions                      | **Built-in schedulers** |
| **File Storage**         | Built-in file storage                    | **Custom storage solutions** |

---

## **Core Philosophies**

### **Convex: Reactive Backend with Real-time Database**
Convex provides a **reactive backend platform** where data flows automatically between database and clients. It's designed for **real-time applications** with **automatic caching** and **optimistic updates**.

- ✅ **Reactive queries that automatically update clients**  
- ✅ **Built-in document database with schema validation**  
- ✅ **Automatic caching and optimistic updates**  
- ✅ **TypeScript-first with automatic type generation**  

### **Pikku: Functions-First with Transport Flexibility**
Pikku focuses on **functions as the core abstraction** that work across **multiple transports and deployment targets**. It provides **built-in services** while maintaining **platform independence**.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Deploy anywhere (your choice of infrastructure)**  
- ✅ **Any database with service injection pattern**  
- ✅ **Built-in authentication, validation, and services**  

---

## **Feature Breakdown**

### **🏗️ Architecture & Data Flow**
Different approaches to backend architecture and data management.

| Aspect                 | **Convex** 🏛️                  | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Data Flow**          | Reactive queries with auto-updates | Function calls with manual updates |
| **Database**           | Built-in document database      | **Any database (your choice)** |
| **Function Types**     | Queries, Mutations, Actions     | **Transport-agnostic functions** |
| **Client Updates**     | Automatic reactive subscriptions | **Manual WebSocket/polling** |

### **📊 Real-time & Caching**
Different approaches to real-time data and caching strategies.

| Feature                | **Convex** 🔄                  | **Pikku** 📊                     |
|------------------------|---------------------------------|---------------------------------|
| **Real-time Updates**  | Automatic reactive subscriptions | **WebSocket channels with pub/sub** |
| **Caching Strategy**   | Automatic reactive caching      | **Client-side caching** |
| **Optimistic Updates** | Built-in optimistic mutations   | **Client-side responsibility** |
| **Data Consistency**   | Eventual consistency with conflicts | **Custom consistency handling** |

### **🔗 API & Transport**
Different approaches to client-server communication.

| Communication Type     | **Convex** 🌐                  | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **Primary Protocol**   | WebSocket with reactive queries | ✅ **HTTP, WebSocket, RPC, schedulers** |
| **REST APIs**          | Not applicable (reactive only)  | ✅ **Full REST API support** |
| **GraphQL**            | Not supported                   | ❌ **Not yet supported** |
| **Background Tasks**   | Scheduled functions             | ✅ **Built-in schedulers** |
| **File Upload**        | Built-in file storage           | ❌ **Not yet supported** |

### **🔑 Authentication & Security**
Different approaches to user management and security.

| Feature                | **Convex** 🔐                  | **Pikku** 🔒                   |
|------------------------|---------------------------------|--------------------------------|
| **Authentication**     | Built-in auth with OAuth providers | **Built-in session management** |
| **User Management**    | Managed user system             | **Custom user management** |
| **Authorization**      | Function-level permissions      | **Custom permission system** |
| **Data Security**      | Document-level access control   | **Function-level access control** |

---

## **Code Examples**

### **Convex Implementation**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
  }).index("by_email", ["email"]),
  
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    createdAt: v.number(),
  }).index("by_author", ["authorId"])
    .index("by_creation_time", ["createdAt"]),
});

// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Reactive query - automatically updates clients
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// Optimistic mutation
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
    });

    return userId;
  },
});

// Scheduled function
export const dailyDigest = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      // Send daily digest email
      await ctx.scheduler.runAfter(0, "sendEmail", {
        to: user.email,
        subject: "Daily Digest",
        template: "daily-digest"
      });
    }
  },
});
```

```typescript
// Client-side React integration
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function UsersComponent() {
  // Reactive query - automatically updates when data changes
  const users = useQuery(api.users.getUsers, { limit: 10 });
  const createUser = useMutation(api.users.createUser);

  const handleCreateUser = async (userData: { name: string; email: string }) => {
    // Optimistic mutation with automatic rollback on error
    await createUser(userData);
  };

  if (users === undefined) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user._id}>
          {user.name} - {user.email}
        </div>
      ))}
      <button onClick={() => handleCreateUser({ name: "John", email: "john@example.com" })}>
        Add User
      </button>
    </div>
  );
}
```

### **Pikku Function-Based Approach**
```typescript
// user.functions.ts
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const getUsers = pikkuFunc<{ limit?: number }, User[]>()
.func(async (services, data) => {
  return await services.database.getUsers(data.limit || 10)
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.auth(true)
.func(async (services, data, session) => {
  const user = await services.database.createUser(data)
  
  // Manual real-time update
  await services.channel?.broadcast('user-created', user)
  
  return user
})

export const dailyDigest = pikkuFunc<{}, void>()
.func(async (services) => {
  const users = await services.database.getAllUsers()
  
  for (const user of users) {
    await services.email?.send({
      to: user.email,
      subject: 'Daily Digest',
      template: 'daily-digest'
    })
  }
})

// user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users/:id',
  func: getUser
})

wireHTTP({
  method: 'get',
  route: '/users',
  func: getUsers
})

wireHTTP({
  method: 'post',
  route: '/users',
  func: createUser,
  auth: true
})

// Real-time WebSocket channel
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getUsers,
      createUser
    }
  }
})

// Scheduled task
wireScheduler({
  name: 'daily-digest',
  schedule: '0 8 * * *',
  func: dailyDigest
})
```

```typescript
// Client-side integration
import { pikkuFetch, pikkuWebSocket } from './api/pikku-client.gen'
import { useState, useEffect } from 'react'

function UsersComponent() {
  const [users, setUsers] = useState<User[]>([])
  
  // Manual data fetching
  useEffect(() => {
    pikkuFetch.get('/users', { limit: 10 })
      .then(setUsers)
      .catch(console.error)
  }, [])
  
  // Manual real-time updates
  useEffect(() => {
    const ws = pikkuWebSocket.connect('user-updates')
    
    ws.on('user-created', (user: User) => {
      setUsers(prev => [...prev, user])
    })
    
    return () => ws.disconnect()
  }, [])
  
  const handleCreateUser = async (userData: CreateUserInput) => {
    try {
      const newUser = await pikkuFetch.post('/users', userData)
      // Optimistic update
      setUsers(prev => [...prev, newUser])
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }
  
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
      <button onClick={() => handleCreateUser({ name: "John", email: "john@example.com" })}>
        Add User
      </button>
    </div>
  )
}
```

---

## **When to Use Convex vs. Pikku**

### **Choose Convex if…**
✔️ You're building **real-time applications** with frequently changing data  
✔️ You want **automatic reactive updates** without manual subscription management  
✔️ You need **built-in optimistic updates** and conflict resolution  
✔️ You prefer **managed database** without infrastructure concerns  
✔️ You want **automatic caching** and performance optimization  
✔️ You're comfortable with **vendor lock-in** for developer productivity  
✔️ You need **document-based data modeling** with schema validation  
✔️ You want **rapid development** with minimal backend setup  

### **Choose Pikku if…**
✔️ You need **platform independence** and **deployment flexibility**  
✔️ You want **any database** (PostgreSQL, MongoDB, etc.) not just documents  
✔️ You need **transport-agnostic functions** (HTTP, WebSocket, RPC)  
✔️ You prefer **full control** over backend architecture  
✔️ You want **REST APIs** alongside real-time features  
✔️ You need **complex backend logic** beyond reactive queries  
✔️ You want to **avoid vendor lock-in** and maintain portability  
✔️ You need **background processing** and **scheduled tasks**  

---

## **Migration Considerations**

### **Convex to Pikku Migration**
1. **Reactive Queries** → **REST Endpoints** (convert queries to HTTP endpoints)
2. **Mutations** → **Pikku Functions** (extract business logic)
3. **Document Database** → **Any Database** (migrate data and schema)
4. **Automatic Subscriptions** → **WebSocket Channels** (manual subscription setup)
5. **Convex Client** → **Auto-generated Client** (update client integration)

### **Key Migration Benefits**
- **Platform Independence**: Deploy anywhere
- **Database Choice**: Use any database technology
- **Transport Flexibility**: HTTP + WebSocket + RPC
- **No Vendor Lock-in**: Maintain code portability

### **Key Migration Challenges**
- **Reactive Paradigm**: Manual subscription management
- **Optimistic Updates**: Client-side implementation needed
- **Automatic Caching**: Custom caching strategy required
- **Real-time Complexity**: More setup for real-time features

---

## **Performance Comparison**

### **Convex Strengths**
- **Automatic Caching**: Built-in query result caching
- **Optimized Queries**: Automatic query optimization
- **Real-time Performance**: Efficient reactive subscriptions
- **Network Efficiency**: Minimal data transfer with reactive updates

### **Pikku Strengths**  
- **Simple Performance**: Straightforward function execution
- **Database Flexibility**: Optimize with any database
- **Transport Options**: Choose optimal protocol per use case
- **Serverless Optimization**: Optimized for serverless deployment

---

## **Final Thoughts**
Convex and Pikku serve **different development philosophies**:

- **Convex** is best for **real-time applications** that need **reactive data flow, automatic caching, and managed infrastructure**.  
- **Pikku** is best for **flexible backends** that need **platform independence, database choice, and transport flexibility**.

If **reactive real-time apps, automatic caching, and managed services** are your priority, go with **Convex**. If you want **platform independence, database flexibility, and transport-agnostic architecture**, **Pikku** is the way to go.

**They serve different markets**: Convex for real-time reactive apps, Pikku for flexible backend services across multiple deployment targets.