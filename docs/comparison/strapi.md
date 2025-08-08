---
sidebar_position: 10
title: Pikku vs Strapi
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Strapi vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Strapi** is a **headless CMS** built with Node.js that provides content management, REST/GraphQL APIs, and an admin interface. **Pikku**, on the other hand, is a **backend framework** that provides **transport-agnostic functions** with built-in services and deployment flexibility.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Strapi** 🎯                            | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Headless CMS with content management     | Functions-first, transport-agnostic framework |
| **Primary Use Case**      | Content-driven websites and applications | Backend APIs with deployment flexibility |
| **Content Management**   | Built-in admin panel for content         | **No built-in CMS (custom implementation)** |
| **API Generation**       | Auto-generated REST/GraphQL from models  | **Custom functions with wiring** |
| **Database**             | Multiple databases (PostgreSQL, MySQL, etc.) | **Any database with service injection** |
| **Admin Interface**      | Rich admin panel out of the box         | **No built-in admin (external tools)** |
| **Authentication**       | Built-in auth with roles and permissions | **Built-in session management** |
| **Real-time**            | WebSocket support via plugins            | **Native WebSocket channels with pub/sub** |
| **Customization**        | Plugins and custom controllers           | **Full TypeScript customization** |
| **Content Types**        | Visual content type builder              | **TypeScript type definitions** |
| **File Upload**          | Built-in media library                   | ❌ **Not yet supported** |
| **Deployment**           | Traditional server deployment            | **Multiple deployment targets** |
| **GraphQL**              | Built-in GraphQL support                | ❌ **Not yet supported** |
| **Background Jobs**      | Limited (cron jobs via plugins)         | **Built-in schedulers** |

---

## **Core Philosophies**

### **Strapi: Content-First Headless CMS**
Strapi provides a **complete content management system** with visual admin interface, auto-generated APIs, and content modeling. It's designed for **content-driven applications** where editors need to manage content.

- ✅ **Visual content type builder and admin panel**  
- ✅ **Auto-generated REST and GraphQL APIs**  
- ✅ **Built-in user roles and permissions**  
- ✅ **Media library with file management**  

### **Pikku: Code-First Backend Framework**
Pikku focuses on **functions as the core abstraction** for building **custom backend logic**. It provides **transport flexibility** and **deployment options** while maintaining **full programmatic control**.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Code-first approach with TypeScript**  
- ✅ **Any database and custom business logic**  
- ✅ **Deploy anywhere with built-in adapters**  

---

## **Feature Breakdown**

### **🎨 Content Management**
Different approaches to content creation and management.

| Aspect                 | **Strapi** 🎨                  | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Content Modeling**   | Visual content type builder     | **TypeScript type definitions** |
| **Admin Interface**    | Rich web-based admin panel      | **Custom admin or external tools** |
| **Content Creation**   | WYSIWYG editor and form builder | **Programmatic content creation** |
| **Media Management**   | Built-in media library          | **Custom storage implementation** |

### **📊 API Generation**
Different approaches to creating and managing APIs.

| Feature                | **Strapi** 🔄                  | **Pikku** 📊                     |
|------------------------|---------------------------------|---------------------------------|
| **API Style**          | Auto-generated REST/GraphQL     | **Custom function-based APIs** |
| **Schema Definition**  | Visual model builder            | **TypeScript types** |
| **Customization**      | Custom controllers and services | **Full function customization** |
| **Documentation**      | Auto-generated API docs         | **Auto-generated OpenAPI** |

### **🔗 Backend Capabilities**
Different approaches to backend functionality.

| Backend Feature        | **Strapi** 🌐                  | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **Business Logic**     | Controllers and services        | **Transport-agnostic functions** |
| **Database Access**    | ORM with query builder          | **Service injection pattern** |
| **Real-time**          | WebSocket plugins               | **Native WebSocket channels** |
| **Background Jobs**    | Cron job plugins                | **Built-in schedulers** |
| **Custom APIs**        | Custom routes and controllers   | **Wiring configuration** |

### **🔑 Authentication & Permissions**
Different approaches to user management and authorization.

| Feature                | **Strapi** 🔐                  | **Pikku** 🔒                   |
|------------------------|---------------------------------|--------------------------------|
| **User Management**    | Built-in users with admin UI   | **Custom user management** |
| **Role System**        | Built-in roles and permissions | **Custom permission system** |
| **Content Permissions** | Field-level permissions        | **Function-level permissions** |
| **API Security**       | Route-level access control     | **Middleware-based security** |

---

## **Code Examples**

### **Strapi Content Model and API**
```javascript
// Content Type: Article (created via admin interface)
// Automatically generates REST and GraphQL endpoints

// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
    },
  },
});

// api/article/models/article.settings.json (auto-generated)
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "name": "Article"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "richtext"
    },
    "author": {
      "via": "articles",
      "model": "user",
      "plugin": "users-permissions"
    },
    "categories": {
      "via": "articles",
      "collection": "category"
    },
    "featured_image": {
      "model": "file",
      "via": "related",
      "allowedTypes": ["images"]
    }
  }
}

// api/article/controllers/article.js (custom logic)
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Override default find method
  async find(ctx) {
    let entities;
    
    if (ctx.query._q) {
      entities = await strapi.services.article.search(ctx.query);
    } else {
      entities = await strapi.services.article.find(ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, {
      model: strapi.models.article,
    }));
  },

  // Custom endpoint
  async featured(ctx) {
    const articles = await strapi.services.article.find({
      featured: true,
      _sort: 'published_at:desc',
      _limit: 5
    });

    return articles.map(entity => sanitizeEntity(entity, {
      model: strapi.models.article,
    }));
  }
};

// api/article/services/article.js (business logic)
module.exports = {
  async sendNotification(article) {
    // Send notification to subscribers
    const subscribers = await strapi.services.user.find({
      subscribed: true
    });

    for (const subscriber of subscribers) {
      await strapi.plugins['email'].services.email.send({
        to: subscriber.email,
        subject: `New article: ${article.title}`,
        template: 'new-article',
        data: { article, subscriber }
      });
    }
  }
};
```

```typescript
// Client-side usage
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337',
});

// Auto-generated REST API
const articles = await api.get('/articles?_sort=published_at:desc&_limit=10');
const article = await api.get('/articles/1');

// Custom endpoint
const featuredArticles = await api.get('/articles/featured');

// Create new article (requires authentication)
const newArticle = await api.post('/articles', {
  title: 'New Article',
  content: 'Article content...',
  author: 1,
  categories: [1, 2]
}, {
  headers: {
    Authorization: `Bearer ${userToken}`
  }
});
```

### **Pikku Function-Based Approach**
```typescript
// article.functions.ts
export const getArticles = pikkuFunc<{ sort?: string, limit?: number }, ArticleList>()
.func(async (services, data) => {
  return await services.database.getArticles({
    sort: data.sort || 'publishedAt:desc',
    limit: data.limit || 10
  })
})

export const getArticle = pikkuFunc<{ id: string }, Article>()
.func(async (services, data) => {
  return await services.database.getArticle(data.id)
})

export const getFeaturedArticles = pikkuFunc<{}, Article[]>()
.func(async (services) => {
  return await services.database.getArticles({
    filter: { featured: true },
    sort: 'publishedAt:desc',
    limit: 5
  })
})

export const createArticle = pikkuFunc<CreateArticleInput, Article>()
.auth(true)
.permissions({ create: canCreateArticle })
.func(async (services, data, session) => {
  const article = await services.database.createArticle({
    ...data,
    authorId: session.userId
  })
  
  // Send notifications
  await sendNotificationToSubscribers(services, article)
  
  // Real-time update
  await services.channel?.broadcast('article-created', article)
  
  return article
})

// Custom business logic function
async function sendNotificationToSubscribers(services: Services, article: Article) {
  const subscribers = await services.database.getSubscribers()
  
  for (const subscriber of subscribers) {
    await services.email?.send({
      to: subscriber.email,
      subject: `New article: ${article.title}`,
      template: 'new-article',
      data: { article, subscriber }
    })
  }
}

// article.wiring.ts
wireHTTP({
  method: 'get',
  route: '/articles',
  func: getArticles
})

wireHTTP({
  method: 'get',
  route: '/articles/featured',
  func: getFeaturedArticles
})

wireHTTP({
  method: 'get',
  route: '/articles/:id',
  func: getArticle
})

wireHTTP({
  method: 'post',
  route: '/articles',
  func: createArticle,
  auth: true
})

// Real-time updates
wireChannel({
  name: 'article-updates',
  onMessageWiring: {
    action: {
      getArticles,
      createArticle
    }
  }
})

// Background job for article processing
wireScheduler({
  name: 'article-cleanup',
  schedule: '0 2 * * *',
  func: cleanupDraftArticles
})
```

```typescript
// Client-side with auto-generated client
import { pikkuFetch, pikkuWebSocket } from './api/pikku-client.gen'

// Type-safe API calls
const articles = await pikkuFetch.get('/articles', { sort: 'publishedAt:desc', limit: 10 })
const article = await pikkuFetch.get('/articles/1')
const featured = await pikkuFetch.get('/articles/featured')

// Create article with authentication
const newArticle = await pikkuFetch.post('/articles', {
  title: 'New Article',
  content: 'Article content...',
  categories: ['tech', 'programming']
})

// Real-time updates
const ws = pikkuWebSocket.connect('article-updates')
ws.on('article-created', (article) => {
  console.log('New article published:', article)
})
```

---

## **When to Use Strapi vs. Pikku**

### **Choose Strapi if…**
✔️ You're building **content-driven websites** or applications  
✔️ You need **non-technical users** to manage content easily  
✔️ You want **auto-generated REST/GraphQL APIs** from content models  
✔️ You need a **built-in admin interface** for content management  
✔️ You want **visual content type builder** without coding  
✔️ You need **built-in media library** and file management  
✔️ You're building **blogs, portfolios, or marketing sites**  
✔️ You prefer **configuration over code** for content modeling  

### **Choose Pikku if…**
✔️ You need **complex backend logic** beyond content management  
✔️ You want **transport-agnostic functions** (HTTP, WebSocket, RPC)  
✔️ You prefer **code-first approach** with TypeScript  
✔️ You need **deployment flexibility** (Express, Lambda, Cloudflare)  
✔️ You want **full control** over API design and business logic  
✔️ You need **real-time features** with native WebSocket support  
✔️ You're building **API-first applications** for multiple frontends  
✔️ You want **custom authentication and authorization** systems  

---

## **Migration Considerations**

### **Strapi to Pikku Migration**
1. **Content Models** → **TypeScript Types** (define data structures in code)
2. **Auto-generated APIs** → **Custom Functions** (implement CRUD operations)
3. **Admin Panel** → **Custom Admin** (build or use external tools)
4. **Controllers** → **Pikku Functions** (migrate business logic)
5. **Database Schema** → **Migration Scripts** (preserve data structure)

### **Key Migration Benefits**
- **Code Control**: Full programmatic control over logic
- **Transport Flexibility**: HTTP + WebSocket + RPC
- **Deployment Options**: Multiple platforms and serverless
- **Real-time Features**: Native WebSocket support

### **Key Migration Challenges**
- **Admin Interface**: Need to build content management UI
- **Content Modeling**: Move from visual to code-based approach
- **GraphQL**: Strapi's GraphQL vs Pikku's REST focus
- **Media Library**: Implement file storage and management

---

## **Use Case Comparison**

### **Strapi Excels At**
| Use Case | Why Strapi |
|----------|------------|
| **Content Websites** | Built-in CMS with admin interface |
| **Blogs & Portfolios** | Rich text editor and media management |
| **Multi-channel Publishing** | REST/GraphQL APIs for multiple frontends |
| **Team Collaboration** | Non-technical users can manage content |
| **Rapid Prototyping** | Quick setup with auto-generated APIs |

### **Pikku Excels At**
| Use Case | Why Pikku |
|----------|-----------|
| **API-First Apps** | Custom backend logic with transport flexibility |
| **Real-time Features** | Native WebSocket channels and pub/sub |
| **Complex Business Logic** | Full TypeScript control over all operations |
| **Multi-Platform Deployment** | Deploy to serverless, containers, or traditional servers |
| **Custom Integrations** | Build exactly what you need without CMS constraints |

---

## **Final Thoughts**
Strapi and Pikku serve **fundamentally different use cases**:

- **Strapi** is best for **content-driven applications** that need **visual content management, auto-generated APIs, and admin interfaces**.  
- **Pikku** is best for **custom backend applications** that need **complex business logic, transport flexibility, and deployment options**.

If **content management, admin interfaces, and rapid CMS setup** are your priority, go with **Strapi**. If you want **custom backend logic, transport-agnostic functions, and deployment flexibility**, **Pikku** is the way to go.

**They can complement each other**: Use Strapi for content management and Pikku for custom business logic, or migrate from Strapi to Pikku as requirements become more complex!