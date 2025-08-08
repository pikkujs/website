---
sidebar_position: 5
title: Pikku vs Supabase
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Supabase vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right backend solution depends on your project's needs. **Supabase** is a **Backend-as-a-Service (BaaS)** platform that provides a complete backend infrastructure with PostgreSQL, authentication, storage, and real-time features. **Pikku**, on the other hand, is a **backend framework** that lets you build custom backend services with **transport-agnostic functions** and **deployment flexibility**.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Supabase** 🎯                          | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Backend-as-a-Service platform            | Custom backend framework |
| **Primary Use Case**      | Rapid app development with managed backend| Custom backend services and APIs |
| **Hosting Model**        | Managed cloud service                     | **Self-hosted or cloud deployment** |
| **Database**             | Managed PostgreSQL with auto-APIs        | **Bring your own database/ORM** |
| **Function Architecture** | Serverless Edge Functions (Deno)         | **Transport-agnostic functions** |
| **API Generation**       | Auto-generated REST/GraphQL from schema  | **Custom API endpoints with type safety** |
| **Authentication**       | Built-in auth with multiple providers    | **Built-in session management + custom auth** |
| **Real-time**            | PostgreSQL row-level subscriptions       | **WebSocket channels with pub/sub** |
| **Storage**              | Built-in file storage with CDN           | **Custom storage solutions** |
| **Pricing Model**        | Usage-based SaaS pricing                 | **Infrastructure costs only** |
| **Customization**        | Limited to platform capabilities         | **Full control over backend logic** |
| **Vendor Lock-in**       | High (platform-specific APIs)            | **Zero (deploy anywhere)** |
| **Development Speed**    | Very fast initial setup                  | **Moderate setup, high flexibility** |
| **Data Control**         | Data on Supabase infrastructure          | **Full data ownership and control** |

---

## **Core Philosophies**

### **Supabase: Complete Backend Platform**
Supabase provides a **complete backend infrastructure** out of the box. It's designed for **rapid development** where you get database, authentication, storage, and APIs without writing backend code.

- ✅ **Instant backend with PostgreSQL database**  
- ✅ **Auto-generated APIs from database schema**  
- ✅ **Built-in authentication and user management**  
- ✅ **Real-time subscriptions and file storage**  

### **Pikku: Custom Backend Framework**
Pikku is a **framework for building custom backends**. It gives you **full control** over your backend logic while providing **transport-agnostic functions** and **deployment flexibility**.

- ✅ **Build custom backend logic and APIs**  
- ✅ **Functions work across HTTP, WebSockets, RPC**  
- ✅ **Deploy anywhere (your infrastructure)**  
- ✅ **Full control over data and business logic**  

---

## **Feature Breakdown**

### **🚀 Development Speed**
Different approaches to getting started and building features.

| Aspect                 | **Supabase** 🚀                | **Pikku** ⚡                      |
|------------------------|--------------------------------|----------------------------------|
| **Initial Setup**      | Minutes (create project)      | Moderate (project scaffolding) |
| **Database Setup**     | Automatic PostgreSQL           | Manual database configuration |
| **API Creation**       | Auto-generated from schema     | Custom function definitions |
| **Auth Setup**         | Built-in with UI components    | Custom implementation or built-ins |

### **🏗️ Architecture & Control**
Different levels of control and customization.

| Aspect                 | **Supabase** 🏛️                | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Backend Logic**      | Limited to Edge Functions       | **Full custom backend logic** |
| **Database Control**   | PostgreSQL with some limits     | **Any database/ORM** |
| **API Design**         | REST/GraphQL from schema        | **Custom API design** |
| **Business Rules**     | Row Level Security policies     | **Custom validation and permissions** |

### **🔗 Data & APIs**
Different approaches to data access and API design.

| Feature                | **Supabase** 📊                | **Pikku** 🔥                      |
|------------------------|--------------------------------|-----------------------------------|
| **Database**           | Managed PostgreSQL            | **Any database (PostgreSQL, MySQL, etc.)** |
| **API Generation**     | Auto REST/GraphQL             | **Custom HTTP/RPC/WebSocket APIs** |
| **Schema Changes**     | Direct database migrations     | **Custom migration handling** |
| **Complex Queries**    | SQL or generated queries       | **Custom query logic** |
| **Data Validation**    | Database constraints + RLS     | **Custom validation with TypeScript** |

### **🔑 Authentication & Security**
Different auth systems and security approaches.

| Feature                | **Supabase** 🔐                | **Pikku** 🔒                   |
|------------------------|--------------------------------|--------------------------------|
| **User Management**    | Built-in user system          | **Custom user management** |
| **Auth Providers**     | Google, GitHub, etc.           | **Custom OAuth implementation** |
| **Session Management** | JWT tokens                     | **Built-in session service** |
| **Authorization**      | Row Level Security (RLS)       | **Custom permission system** |
| **Multi-tenant**       | RLS-based                      | **Custom tenant isolation** |

### **🌐 Real-time & Communication**
Different real-time capabilities and communication patterns.

| Feature                | **Supabase** 🔄                | **Pikku** 📡                     |
|------------------------|--------------------------------|-----------------------------------|
| **Real-time Updates**  | PostgreSQL subscriptions       | **WebSocket channels** |
| **Pub/Sub**            | Database-driven                | **Built-in channel system** |
| **WebSocket Support**  | Via Realtime API              | **Native WebSocket support** |
| **Custom Events**      | Limited to database changes    | **Custom event system** |

---

## **Code Examples**

### **Supabase Client Usage**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseKey)

// Auto-generated API from database schema
const { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('active', true)

// Real-time subscription to database changes
supabase
  .channel('users')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, 
    (payload) => {
      console.log('New user:', payload.new)
    })
  .subscribe()

// Built-in authentication
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// File upload to built-in storage
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.jpg', file)
```

### **Pikku Custom Backend**
```typescript
// Custom business logic functions
export const getActiveUsers = pikkuFunc<{}, User[]>()
.func(async (services) => {
  return await services.database.getActiveUsers()
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.auth(true)
.permissions({ create: canCreateUser })
.func(async (services, data, session) => {
  const user = await services.database.createUser({
    ...data,
    createdBy: session.userId
  })
  
  // Send real-time update
  await services.channel?.broadcast('user-created', user)
  
  return user
})

// Custom API endpoints
wireHTTP({
  method: 'get',
  route: '/users/active',
  func: getActiveUsers
})

wireHTTP({
  method: 'post',
  route: '/users',
  func: createUser,
  auth: true
})

// WebSocket channel for real-time updates
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getActiveUsers,
      createUser
    }
  }
})

// Custom authentication middleware
const customAuth = pikkuMiddleware(async (services, interaction, next) => {
  const token = services.http.request?.header('authorization')
  if (!token) throw new UnauthorizedError()
  
  const session = await services.jwt.decode(token)
  services.userSession.setInitial(session)
  
  await next()
})
```

---

## **Deployment & Infrastructure**

### **Supabase Deployment**
```
┌─────────────────────────────────────┐
│         Supabase Cloud              │
├─────────────────────────────────────┤
│  PostgreSQL Database                │
│  Edge Functions (Deno)              │
│  Authentication Service             │
│  Storage & CDN                      │
│  Real-time Engine                   │
└─────────────────────────────────────┘
         │
         ▼
    Managed by Supabase
    (Usage-based pricing)
```

### **Pikku Deployment Options**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Express Server │    │   AWS Lambda    │    │Cloudflare Worker│
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│  Your Functions │    │  Your Functions │    │  Your Functions │
│  Your Database  │    │  Your Database  │    │  Your Database  │
│  Your Storage   │    │  Your Storage   │    │  Your Storage   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   Your Infrastructure     Your AWS Account      Your Cloudflare
   (Infrastructure costs)  (Infrastructure costs) (Infrastructure costs)
```

---

## **When to Use Supabase vs. Pikku**

### **Choose Supabase if…**
✔️ You want to **build and launch quickly** without backend complexity  
✔️ You're comfortable with **PostgreSQL as your primary database**  
✔️ You need **built-in authentication, storage, and real-time** out of the box  
✔️ You prefer **auto-generated APIs** over custom endpoint design  
✔️ You don't mind **vendor lock-in** for faster development  
✔️ You're building **standard CRUD applications** or **content management**  
✔️ You want **managed infrastructure** and don't want to handle DevOps  

### **Choose Pikku if…**
✔️ You need **custom backend logic** and **complex business rules**  
✔️ You want **full control over your data** and infrastructure  
✔️ You need **multiple transport protocols** (HTTP, WebSockets, RPC)  
✔️ You want **deployment flexibility** (any cloud, on-premises)  
✔️ You need **zero vendor lock-in** and **data portability**  
✔️ You're building **complex applications** with **custom requirements**  
✔️ You want **type-safe APIs** with **custom validation logic**  
✔️ You need **integration with existing systems** and databases  

---

## **Cost Comparison**

### **Supabase Pricing Model**
- **Free Tier**: Limited database, auth, storage, and bandwidth
- **Pro Tier**: ~$25/month + usage-based pricing
- **Scaling Costs**: Database compute, storage, bandwidth, function invocations
- **Predictability**: Can become expensive with high usage

### **Pikku Infrastructure Costs**
- **Development**: Free (open-source framework)
- **Deployment**: Only infrastructure costs (server, database, CDN)
- **Scaling**: Pay only for compute and storage you use
- **Predictability**: More predictable, infrastructure-only costs

---

## **Migration Considerations**

### **Supabase to Pikku Migration**
1. **Database**: Export PostgreSQL data, set up custom database
2. **Auth**: Implement custom authentication with Pikku auth services
3. **APIs**: Replace auto-generated APIs with custom Pikku functions
4. **Real-time**: Replace PostgreSQL subscriptions with WebSocket channels
5. **Storage**: Implement custom storage solution

### **Pikku to Supabase Migration**
1. **Schema**: Create PostgreSQL schema matching your data model
2. **Functions**: Convert custom functions to Supabase Edge Functions
3. **Auth**: Migrate to Supabase Auth system
4. **Real-time**: Use PostgreSQL subscriptions instead of WebSocket channels

---

## **Final Thoughts**
Supabase and Pikku serve **different development philosophies**:

- **Supabase** is best for **rapid development** where you want a **complete backend platform** without writing backend code.  
- **Pikku** is best for **custom backend development** where you need **full control, flexibility, and deployment options**.

If **speed to market, managed infrastructure, and standard backend features** are your priority, go with **Supabase**. If you need **custom backend logic, deployment flexibility, vendor independence, and complex business requirements**, **Pikku** is the way to go.

**They can complement each other**: You could use Supabase for rapid prototyping and then migrate to Pikku as your requirements become more complex!