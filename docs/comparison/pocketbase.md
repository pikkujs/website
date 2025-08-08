---
sidebar_position: 9
title: Pikku vs PocketBase
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **PocketBase vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **PocketBase** is a **single-file backend** written in Go that provides database, authentication, file storage, and admin UI out of the box. **Pikku**, on the other hand, is a **Node.js backend framework** that provides **transport-agnostic functions** with built-in services and deployment flexibility.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **PocketBase** 🎯                        | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Single-file backend with everything included | Functions-first, transport-agnostic framework |
| **Language**             | Go (single binary)                       | **Node.js/TypeScript** |
| **Primary Use Case**      | Rapid prototyping and small-to-medium apps | Backend APIs with deployment flexibility |
| **Database**             | Built-in SQLite                          | **Any database with service injection** |
| **Setup Complexity**     | Zero setup (single binary)               | **Moderate setup with configuration** |
| **Admin Interface**      | Built-in admin UI                        | **No built-in admin (use external tools)** |
| **Real-time**            | Server-Sent Events                       | **WebSocket channels with pub/sub** |
| **Architecture**         | Monolithic single binary                 | **Function-based with service injection** |
| **Customization**        | Go extensions and hooks                  | **Full TypeScript customization** |
| **Authentication**       | Built-in auth with multiple providers    | **Built-in session management** |
| **File Storage**         | Built-in file storage with S3 support   | **Custom storage solutions** |
| **Deployment**           | Single binary deployment                 | **Multiple deployment targets** |
| **Scaling**              | Vertical scaling only                    | **Horizontal scaling with serverless** |
| **API Style**            | REST API with collections               | **Transport-agnostic functions** |

---

## **Core Philosophies**

### **PocketBase: Everything-Included Single Binary**
PocketBase provides a **complete backend solution** in a single Go binary. It's designed for **rapid development** where you get database, authentication, file storage, and admin UI without any configuration.

- ✅ **Zero configuration - download and run**  
- ✅ **Built-in SQLite database with admin UI**  
- ✅ **Complete auth system with OAuth providers**  
- ✅ **File storage with CDN support**  

### **Pikku: Customizable Function-First Framework**
Pikku focuses on **functions as the core abstraction** with **transport flexibility** and **deployment options**. It provides **built-in services** while maintaining **full customization** and **platform independence**.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Any database and custom business logic**  
- ✅ **TypeScript-first with full customization**  
- ✅ **Deploy anywhere with built-in adapters**  

---

## **Feature Breakdown**

### **🚀 Setup & Development Speed**
Different approaches to getting started and development velocity.

| Aspect                 | **PocketBase** 🚀               | **Pikku** ⚡                      |
|------------------------|---------------------------------|----------------------------------|
| **Initial Setup**      | Download binary, run command    | Project scaffolding with config  |
| **Time to First API**  | Immediate (auto-generated CRUD) | Moderate (write functions)       |
| **Admin Interface**    | Built-in web admin              | **External tools (custom/third-party)** |
| **Database Setup**     | Automatic SQLite                | **Manual database configuration** |

### **🏗️ Architecture & Customization**
Different levels of control and architectural flexibility.

| Aspect                 | **PocketBase** 🏛️              | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Application Structure** | Collection-based data model  | **Function-based architecture** |
| **Business Logic**     | Go hooks and extensions         | **Full TypeScript functions** |
| **Database Control**   | SQLite with schema editor       | **Any database (PostgreSQL, MongoDB, etc.)** |
| **API Customization**  | Limited to collection patterns  | **Fully custom API design** |

### **🔗 API & Communication**
Different approaches to client-server communication.

| Communication Type     | **PocketBase** 🌐               | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **Primary API**        | REST with auto-generated CRUD   | ✅ **Custom HTTP/RPC/WebSocket APIs** |
| **Real-time Updates**  | Server-Sent Events              | ✅ **WebSocket channels with pub/sub** |
| **Background Tasks**   | Cron hooks in Go                | ✅ **Built-in schedulers** |
| **File Upload**        | Built-in with S3 support        | ❌ **Not yet supported** |
| **GraphQL**            | Not supported                   | ❌ **Not yet supported** |

### **🔑 Authentication & Security**
Different approaches to user management and security.

| Feature                | **PocketBase** 🔐               | **Pikku** 🔒                   |
|------------------------|---------------------------------|--------------------------------|
| **User Management**    | Built-in users with admin UI   | **Custom user management** |
| **OAuth Providers**    | Google, Facebook, GitHub, etc.  | **Custom OAuth implementation** |
| **Session Management** | Built-in token management       | **Built-in session service** |
| **Access Control**     | Collection-level rules          | **Function-level permissions** |

---

## **Code Examples**

### **PocketBase Setup and Usage**
```bash
# Download and run PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip
unzip pocketbase_0.20.0_linux_amd64.zip
./pocketbase serve
```

```go
// main.go - Custom Go hooks
package main

import (
    "log"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/core"
    "github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
    app := pocketbase.New()

    // Add migrations
    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{})

    // Custom business logic hooks
    app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
        // Send welcome email
        sendWelcomeEmail(e.Record.GetString("email"))
        
        // Create user profile
        collection, _ := app.Dao().FindCollectionByNameOrId("profiles")
        record := models.NewRecord(collection)
        record.Set("userId", e.Record.Id)
        record.Set("displayName", e.Record.GetString("name"))
        
        return app.Dao().SaveRecord(record)
    })

    // Custom API routes
    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.GET("/api/custom/stats", func(c echo.Context) error {
            // Custom endpoint logic
            stats := calculateUserStats(app.Dao())
            return c.JSON(200, stats)
        })
        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

```typescript
// Client-side JavaScript SDK
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

// Authentication
await pb.collection('users').authWithPassword('user@example.com', 'password');

// CRUD operations (auto-generated API)
const users = await pb.collection('users').getList(1, 10, {
    filter: 'active = true',
    sort: '-created'
});

const newUser = await pb.collection('users').create({
    email: 'new@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    name: 'New User'
});

// Real-time subscriptions
pb.collection('users').subscribe('*', function (e) {
    console.log('User updated:', e.record);
});

// File upload
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);
formData.append('name', 'John Doe');

await pb.collection('users').create(formData);
```

### **Pikku Function-Based Approach**
```typescript
// user.functions.ts
export const getUsers = pikkuFunc<{ page?: number, limit?: number }, UserList>()
.func(async (services, data) => {
  const users = await services.database.getUsers({
    page: data.page || 1,
    limit: data.limit || 10,
    filter: { active: true }
  })
  
  return {
    users,
    total: await services.database.countActiveUsers(),
    page: data.page || 1
  }
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.func(async (services, data) => {
  // Custom validation
  if (!data.email || !data.password) {
    throw new ValidationError('Email and password are required')
  }
  
  const user = await services.database.createUser(data)
  
  // Custom business logic
  await services.email?.sendWelcomeEmail(user.email)
  
  // Create user profile
  await services.database.createProfile({
    userId: user.id,
    displayName: data.name
  })
  
  // Real-time update
  await services.channel?.broadcast('user-created', user)
  
  return user
})

export const getUserStats = pikkuFunc<{}, UserStats>()
.func(async (services) => {
  return await services.database.calculateUserStats()
})

// File upload function (when supported)
export const uploadAvatar = pikkuFunc<{ userId: string, file: Buffer }, User>()
.func(async (services, data) => {
  const avatarUrl = await services.storage?.upload(data.file, `avatars/${data.userId}`)
  
  return await services.database.updateUser(data.userId, {
    avatar: avatarUrl
  })
})

// user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users',
  func: getUsers
})

wireHTTP({
  method: 'post', 
  route: '/users',
  func: createUser
})

wireHTTP({
  method: 'get',
  route: '/api/custom/stats',
  func: getUserStats
})

// Real-time WebSocket
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getUsers,
      createUser
    }
  }
})
```

```typescript
// Client-side with auto-generated client
import { pikkuFetch, pikkuWebSocket } from './api/pikku-client.gen'

// Type-safe API calls
const userList = await pikkuFetch.get('/users', { page: 1, limit: 10 })

const newUser = await pikkuFetch.post('/users', {
  email: 'new@example.com',
  password: 'password123',
  name: 'New User'
})

// Real-time subscriptions
const ws = pikkuWebSocket.connect('user-updates')
ws.on('user-created', (user) => {
  console.log('New user:', user)
})

// Custom endpoints
const stats = await pikkuFetch.get('/api/custom/stats')
```

---

## **When to Use PocketBase vs. Pikku**

### **Choose PocketBase if…**
✔️ You need **rapid prototyping** with zero configuration  
✔️ You want **everything included** (database, auth, admin, files)  
✔️ You prefer **SQLite** and don't need complex database features  
✔️ You want a **built-in admin interface** for content management  
✔️ You need **simple CRUD APIs** without complex business logic  
✔️ You're comfortable with **Go extensions** for customization  
✔️ You want **single binary deployment** for simplicity  
✔️ You're building **small to medium applications**  

### **Choose Pikku if…**
✔️ You need **complex backend logic** and business rules  
✔️ You want **any database** (PostgreSQL, MongoDB, etc.)  
✔️ You prefer **TypeScript/Node.js** over Go  
✔️ You need **transport-agnostic functions** (HTTP, WebSocket, RPC)  
✔️ You want **deployment flexibility** (Express, Lambda, Cloudflare)  
✔️ You need **horizontal scaling** and serverless deployment  
✔️ You require **custom API design** beyond CRUD operations  
✔️ You want **full control** over authentication and authorization  

---

## **Migration Considerations**

### **PocketBase to Pikku Migration**
1. **SQLite Data** → **Any Database** (export and migrate data)
2. **Collections** → **Function Definitions** (convert CRUD to functions)
3. **Go Hooks** → **TypeScript Functions** (rewrite business logic)
4. **Built-in Auth** → **Custom Auth System** (implement authentication)
5. **Admin UI** → **Custom Admin** (build or use third-party tools)

### **Key Migration Benefits**
- **Language Familiarity**: TypeScript vs Go
- **Database Flexibility**: Choose any database
- **Scaling Options**: Horizontal scaling and serverless
- **Transport Flexibility**: Multiple protocols

### **Key Migration Challenges**
- **Admin Interface**: Need to build or integrate external admin
- **File Storage**: Implement custom storage solution
- **Configuration**: More setup required vs zero-config PocketBase
- **Deployment**: More complex than single binary

---

## **Performance & Scaling**

### **PocketBase Characteristics**
- **Single Binary**: Very fast startup and low memory usage
- **SQLite**: Excellent for read-heavy workloads, limited concurrent writes
- **Vertical Scaling**: Scale by upgrading server resources
- **File Storage**: Built-in with CDN support

### **Pikku Characteristics**
- **Node.js**: Good performance with async operations
- **Database Choice**: Optimize with PostgreSQL, MongoDB, etc.
- **Horizontal Scaling**: Multiple instances and serverless
- **Serverless**: Cold start considerations but infinite scale

---

## **Final Thoughts**
PocketBase and Pikku serve **different development scenarios**:

- **PocketBase** is best for **rapid development, simple applications, and when you want everything included without configuration**.  
- **Pikku** is best for **complex business logic, custom requirements, and when you need deployment flexibility and scaling options**.

If **rapid prototyping, zero configuration, and built-in admin** are your priority, go with **PocketBase**. If you want **complex backend logic, database choice, and deployment flexibility**, **Pikku** is the way to go.

**Migration path**: Many teams start with **PocketBase for rapid prototyping**, then **migrate to Pikku as requirements become more complex and scaling becomes important**!