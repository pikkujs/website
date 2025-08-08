---
sidebar_position: 9
title: Pikku vs Apollo Server
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Apollo Server vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Apollo Server** is a **GraphQL server** that provides a complete solution for GraphQL APIs with schema stitching, caching, and subscriptions. **Pikku**, on the other hand, is a **backend framework** that provides **transport-agnostic functions** with built-in services, focusing primarily on REST APIs, WebSockets, and RPC.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Apollo Server** 🎯                     | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | GraphQL-first server framework           | Functions-first, transport-agnostic framework |
| **Primary Use Case**      | GraphQL APIs with complex data relationships | REST/RPC/WebSocket APIs with built-in services |
| **Query Language**       | GraphQL schema and resolvers             | **REST endpoints with type-safe functions** |
| **Architecture**         | Schema-first with resolver functions     | Function-first with wiring configuration |
| **Learning Curve**      | Steep (GraphQL concepts required)        | **Moderate (functional approach)** |
| **Transport Support**     | HTTP (GraphQL), WebSocket (subscriptions) | **HTTP, WebSockets, RPC, schedulers** |
| **Data Fetching**        | Single endpoint with complex queries     | **Multiple endpoints with simple functions** |
| **Type System**          | GraphQL Schema Definition Language        | **TypeScript types with runtime validation** |
| **Real-time**            | GraphQL subscriptions                    | **WebSocket channels with pub/sub** |
| **Caching**              | Built-in query caching and data sources  | **Client-side caching responsibility** |
| **Authentication**       | Context-based auth in resolvers          | **Built-in session management + middleware** |
| **Validation**           | GraphQL schema validation                | **Automatic from TypeScript types** |
| **Testing**              | GraphQL query testing                    | **Direct function testing** |
| **API Discoverability** | GraphQL Playground/Studio               | **Auto-generated OpenAPI docs** |
| **Background Jobs**      | External solutions needed                | **Built-in schedulers** |

---

## **Core Philosophies**

### **Apollo Server: GraphQL-First API Development**
Apollo Server provides a **complete GraphQL server solution** with schema-first development, powerful caching, and real-time subscriptions. It's designed for **complex data relationships** and **flexible client queries**.

- ✅ **Single endpoint for all data fetching**  
- ✅ **Powerful query language with nested relationships**  
- ✅ **Built-in caching and performance optimization**  
- ✅ **Real-time subscriptions for live data**  

### **Pikku: Functions-First with Multiple Transports**
Pikku focuses on **functions as the core abstraction**, making them work across **multiple transport protocols** while providing **comprehensive backend services**.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Built-in authentication, validation, and services**  
- ✅ **Auto-generated clients and documentation**  
- ✅ **Multiple deployment targets with built-in adapters**  

---

## **Feature Breakdown**

### **🏗️ API Design Philosophy**
Fundamentally different approaches to API design.

| Aspect                 | **Apollo Server** 🏛️           | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Endpoint Structure** | Single GraphQL endpoint        | Multiple REST/RPC endpoints |
| **Data Fetching**      | Complex queries with relations  | **Simple function calls** |
| **Schema Definition**  | GraphQL SDL (Schema Definition Language) | **TypeScript type definitions** |
| **Query Flexibility**  | Client specifies exact data needs | **Pre-defined function signatures** |

### **📊 Data Management**
Different approaches to handling data and queries.

| Feature                | **Apollo Server** 🔄           | **Pikku** 📊                     |
|------------------------|---------------------------------|---------------------------------|
| **Query Language**     | GraphQL with complex syntax    | **Simple HTTP/RPC calls** |
| **Data Relations**     | Built-in relationship handling  | **Manual relationship management** |
| **Caching**            | Automatic query caching         | **Client-side caching** |
| **N+1 Problem**        | DataLoader pattern              | **Function-level optimization** |
| **Pagination**         | Built-in pagination support    | **Custom pagination logic** |

### **🔗 Transport & Communication**
Different approaches to client-server communication.

| Communication Type     | **Apollo Server** 🌐           | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **Primary Protocol**   | GraphQL over HTTP              | ✅ **REST/HTTP with auto-routing** |
| **Real-time Updates**  | GraphQL subscriptions          | ✅ **WebSocket channels with pub/sub** |
| **RPC**               | ❌ Not applicable (GraphQL only) | ✅ **Auto-generated RPC interface** |
| **Background Tasks**  | ❌ External solutions needed    | ✅ **Built-in schedulers** |
| **File Uploads**      | GraphQL Upload specification   | ❌ **Not yet supported** |

### **🔑 Authentication & Security**
Different approaches to security and authorization.

| Feature                | **Apollo Server** 🔐           | **Pikku** 🔒                   |
|------------------------|---------------------------------|--------------------------------|
| **Authentication**     | Context-based in resolvers     | **Built-in session management** |
| **Authorization**      | Field-level permissions        | **Function-level permissions** |
| **Data Filtering**     | Resolver-level filtering       | **Custom filtering logic** |
| **Rate Limiting**      | External middleware needed     | **Built-in middleware options** |

### **🧪 Testing & Development**
Different testing approaches and developer experience.

| Feature                | **Apollo Server** 🧪           | **Pikku** ⚗️                   |
|------------------------|---------------------------------|--------------------------------|
| **Testing Strategy**   | GraphQL query integration tests | **Direct function unit tests** |
| **Mocking**            | GraphQL schema mocking         | **Simple service mocking** |
| **API Exploration**    | GraphQL Playground/Studio     | **OpenAPI documentation** |
| **Type Safety**        | GraphQL Code Generator         | **Built-in TypeScript types** |

---

## **Code Examples**

### **Apollo Server GraphQL Implementation**
```typescript
import { ApolloServer } from 'apollo-server-express'
import { buildFederatedSchema } from '@apollo/federation'
import { gql } from 'apollo-server-core'

// GraphQL Schema Definition
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users(limit: Int, offset: Int): [User!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createPost(input: CreatePostInput!): Post!
  }

  type Subscription {
    userCreated: User!
    postCreated: Post!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }
`

// Resolvers with complex data fetching
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.dataSources.userAPI.getUser(id)
    },
    users: async (parent, { limit = 10, offset = 0 }, context) => {
      return await context.dataSources.userAPI.getUsers(limit, offset)
    },
    post: async (parent, { id }, context) => {
      return await context.dataSources.postAPI.getPost(id)
    }
  },

  Mutation: {
    createUser: async (parent, { input }, context) => {
      if (!context.user) throw new Error('Unauthorized')
      return await context.dataSources.userAPI.createUser(input)
    },
    createPost: async (parent, { input }, context) => {
      if (!context.user) throw new Error('Unauthorized')
      const post = await context.dataSources.postAPI.createPost(input)
      // Real-time subscription
      context.pubsub.publish('POST_CREATED', { postCreated: post })
      return post
    }
  },

  Subscription: {
    userCreated: {
      subscribe: (parent, args, context) => 
        context.pubsub.asyncIterator(['USER_CREATED'])
    },
    postCreated: {
      subscribe: (parent, args, context) => 
        context.pubsub.asyncIterator(['POST_CREATED'])
    }
  },

  // Nested field resolvers
  User: {
    posts: async (user, args, context) => {
      return await context.dataSources.postAPI.getPostsByAuthor(user.id)
    }
  },

  Post: {
    author: async (post, args, context) => {
      return await context.dataSources.userAPI.getUser(post.authorId)
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs, resolvers }),
  context: ({ req }) => ({
    user: req.user,
    dataSources: {
      userAPI: new UserAPI(),
      postAPI: new PostAPI()
    }
  })
})
```

### **Pikku Function-Based Approach**
```typescript
// user.functions.ts
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const getUsers = pikkuFunc<{ limit?: number, offset?: number }, User[]>()
.func(async (services, data) => {
  return await services.database.getUsers(data.limit || 10, data.offset || 0)
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.auth(true)
.func(async (services, data, session) => {
  const user = await services.database.createUser(data)
  
  // Real-time notification
  await services.channel?.broadcast('user-created', user)
  
  return user
})

// post.functions.ts
export const getPost = pikkuFunc<{ id: string }, Post>()
.func(async (services, data) => {
  return await services.database.getPost(data.id)
})

export const createPost = pikkuFunc<CreatePostInput, Post>()
.auth(true)
.func(async (services, data, session) => {
  const post = await services.database.createPost({
    ...data,
    authorId: session.userId
  })
  
  // Real-time notification
  await services.channel?.broadcast('post-created', post)
  
  return post
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

// Real-time WebSocket channels
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getUser,
      createUser
    }
  }
})
```

---

## **Client Integration Comparison**

### **Apollo Client GraphQL Queries**
```typescript
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      name
      email
      posts {
        id
        title
        createdAt
      }
    }
  }
`

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`

const USER_CREATED_SUBSCRIPTION = gql`
  subscription UserCreated {
    userCreated {
      id
      name
      email
    }
  }
`

function UsersComponent() {
  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { limit: 10, offset: 0 }
  })
  
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [GET_USERS]
  })
  
  const { data: newUser } = useSubscription(USER_CREATED_SUBSCRIPTION)
  
  // Component implementation...
}
```

### **Pikku Auto-Generated Client**
```typescript
import { pikkuFetch, pikkuWebSocket } from './api/pikku-client.gen'

function UsersComponent() {
  const [users, setUsers] = useState<User[]>([])
  
  // Type-safe REST API calls
  useEffect(() => {
    pikkuFetch.get('/users', { limit: 10, offset: 0 })
      .then(setUsers)
      .catch(console.error)
  }, [])
  
  const createUser = async (userData: CreateUserInput) => {
    const newUser = await pikkuFetch.post('/users', userData)
    setUsers(prev => [...prev, newUser])
  }
  
  // Real-time WebSocket updates
  useEffect(() => {
    const ws = pikkuWebSocket.connect('user-updates')
    
    ws.on('user-created', (user: User) => {
      setUsers(prev => [...prev, user])
    })
    
    return () => ws.disconnect()
  }, [])
  
  // Component implementation...
}
```

---

## **When to Use Apollo Server vs. Pikku**

### **Choose Apollo Server if…**
✔️ You need **complex data relationships** and **nested queries**  
✔️ You want **single endpoint** for all client data needs  
✔️ You're building **data-rich applications** with complex queries  
✔️ You need **powerful caching** and **query optimization**  
✔️ You want **GraphQL ecosystem** benefits (tooling, introspection)  
✔️ You have **multiple client types** that need different data  
✔️ You need **real-time subscriptions** with complex data  
✔️ You want **schema federation** for microservices  

### **Choose Pikku if…**
✔️ You prefer **simple REST/RPC APIs** over GraphQL complexity  
✔️ You need **multiple transport protocols** (HTTP, WebSockets, RPC)  
✔️ You want **function-based architecture** with clear endpoints  
✔️ You need **built-in authentication, validation, and services**  
✔️ You prefer **TypeScript-first development** over schema languages  
✔️ You need **deployment flexibility** (Express, Lambda, Cloudflare)  
✔️ You want **simpler testing** with direct function calls  
✔️ You need **background job processing** and **scheduled tasks**  

---

## **Migration Considerations**

### **Apollo Server to Pikku Migration**
1. **GraphQL Schema** → **TypeScript Types** (define data structures)
2. **Resolvers** → **Pikku Functions** (extract business logic)
3. **GraphQL Queries** → **REST Endpoints** (API endpoints)
4. **Subscriptions** → **WebSocket Channels** (real-time updates)
5. **DataLoader** → **Function-level Optimization** (performance tuning)

### **Key Migration Challenges**
- **Complex Queries**: GraphQL nested queries → Multiple REST calls
- **Client Changes**: Apollo Client → REST client or auto-generated client
- **Caching Strategy**: GraphQL caching → Client-side caching
- **Real-time**: GraphQL subscriptions → WebSocket channels

---

## **Performance Comparison**

### **Apollo Server Strengths**
- **Query Optimization**: Built-in query caching and DataLoader
- **Network Efficiency**: Single request for complex data
- **Caching**: Sophisticated query-level caching
- **Real-time**: Efficient GraphQL subscriptions

### **Pikku Strengths**
- **Simple Performance**: Straightforward function execution
- **Transport Flexibility**: Multiple protocols for optimization
- **Serverless**: Optimized for serverless deployment
- **Function Isolation**: Independent function performance

---

## **Final Thoughts**
Apollo Server and Pikku serve **fundamentally different API philosophies**:

- **Apollo Server** is best for **complex data relationships, flexible client queries, and GraphQL ecosystem benefits**.  
- **Pikku** is best for **simple REST/RPC APIs, multiple transports, and function-based backend architecture**.

If **GraphQL, complex queries, and data relationships** are your priority, go with **Apollo Server**. If you want **simple APIs, transport-agnostic functions, and built-in backend services**, **Pikku** is the way to go.

**They can complement each other**: Use Apollo Server for complex client-facing GraphQL APIs and Pikku for internal services and real-time features!