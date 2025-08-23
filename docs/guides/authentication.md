---
title: Authentication Guide
sidebar_position: 2
---

# Authentication Guide

Pikku provides flexible authentication mechanisms that work across HTTP and WebSocket connections. You can authenticate users through middleware (automatic) or function-based approaches (manual), both integrating with the `UserSessionService`.

## Authentication Approaches

### 1. Middleware-Based Authentication (Automatic)

Middleware authentication runs automatically before your functions execute, extracting and validating user sessions from requests.

#### API Key Authentication

```typescript
import { authAPIKey, wireMiddleware } from "@pikku/core"

export const apiKeyMiddleware = () => {
  return authAPIKey<any, any>({
    source: 'all', // Check both headers and query params
    getSessionForAPIKey: async (services, apiKey) => {
      return services.kysely
        .selectFrom('user')
        .select(['userId', 'apiKey'])
        .where('apiKey', '=', apiKey)
        .executeTakeFirstOrThrow(() => new UnauthorizedError('Invalid API key'))
    }
  })
}

// Apply middleware globally
wireMiddleware([apiKeyMiddleware()])
```

#### Cookie Authentication with JWT

```typescript
import { authCookie, wireMiddleware } from "@pikku/core"

export const cookieMiddleware = () => {
  return authCookie({
    name: 'pikku:session',
    jwt: true,
    expiresIn: { value: 4, unit: 'week' },
    options: { sameSite: 'lax', path: '/' },
  })
}

wireMiddleware([cookieMiddleware()])
```

#### Bearer Token Authentication

```typescript
import { authBearer, wireMiddleware } from "@pikku/core"

export const bearerMiddleware = () => {
  return authBearer({
    jwt: true, // Decode JWT tokens
    getSession: async (services, token) => {
      // Custom token validation
      return await services.jwt.decode(token)
    }
  })
}

wireMiddleware([bearerMiddleware()])
```

### 2. Function-Based Authentication (Manual)

Function-based authentication gives you full control over the authentication process within your functions.

#### Login Function

```typescript
export const loginUser = pikkuSessionlessFunc<
  Pick<DB.User, 'name'>,
  UserSession
>(async (services, { name }) => {
  let session: UserSession | undefined
  
  try {
    // Try to find existing user
    session = await services.kysely
      .selectFrom('user')
      .select(['userId', 'apiKey'])
      .where('name', '=', name.toLowerCase())
      .executeTakeFirstOrThrow()
  } catch {
    // Create new user if not found
    session = await services.kysely
      .insertInto('user')
      .values({ name: name.toLowerCase() })
      .returning(['userId', 'apiKey'])
      .executeTakeFirstOrThrow()
  }
  
  // Set session using UserSessionService
  services.userSession?.set(session)
  
  return session
})
```

#### Logout Function

```typescript
export const logoutUser = pikkuSessionlessFunc<void, void>(async (
  services,
  _data,
  _session
) => {
  // Clear session using UserSessionService
  services.userSession?.clear()
})
```

## HTTP Authentication

### Route Configuration

```typescript
import { wireHTTP } from '../.pikku/pikku-types.gen.js'

// Public route (no authentication)
wireHTTP({
  method: 'post',
  route: '/login',
  func: loginUser,
  auth: false,
})

// Protected route (requires authentication)
wireHTTP({
  method: 'post',
  route: '/logout',
  func: logoutUser,
  auth: true, // Middleware authentication required
})

// Route with permissions
wireHTTP({
  method: 'patch',
  route: '/user/:userId',
  func: updateUser,
  auth: true,
  permissions: {
    isUserUpdatingSelf, // Custom permission check
  },
})
```

### Permission System

```typescript
import { pikkuPermission } from '@pikku/core'

export const isUserUpdatingSelf = pikkuPermission<Pick<DB.User, 'userId'>>(async (
  _services,
  data,
  session
) => {
  return session?.userId === data.userId
})

export const isTodoCreator = pikkuPermission<Pick<DB.Todo, 'todoId'>>(async (
  services,
  { todoId },
  session
) => {
  const { createdBy } = await services.kysely
    .selectFrom('todo')
    .select('createdBy')
    .where('todoId', '=', todoId)
    .executeTakeFirstOrThrow()

  return session?.userId === createdBy
})
```

## WebSocket Authentication

### Channel Configuration

```typescript
import { wireChannel } from '../.pikku/pikku-types.gen.js'

wireChannel({
  name: 'events',
  route: '/',
  onConnect,
  onDisconnect,
  auth: true, // Global auth requirement for the channel
  onMessage,
  onMessageWiring: {
    action: {
      // Authentication function (overrides global auth)
      auth: {
        func: authenticate,
        auth: false, // This specific route doesn't require pre-auth
      },
      // Route with permissions
      subscribe: {
        func: subscribe,
        permissions: {}, // Custom permissions
      },
      unsubscribe,
      emit: emitMessage,
    },
  },
})
```

### WebSocket Authentication Functions

```typescript
// Manual authentication within WebSocket
export const authenticate = pikkuChannelFunc<
  { token: string; userId: string },
  { authResult: boolean; action: 'auth' }
>(async ({ userSession }, data) => {
  const authResult = data.token === 'valid'
  
  if (authResult) {
    // Set session for this WebSocket connection
    await userSession?.set({ userId: data.userId })
  }
  
  return { authResult, action: 'auth' }
})

// Authenticated WebSocket function
export const emitMessage = pikkuChannelFunc<
  { name: string },
  { timestamp: string; from: string } | { message: string }
>(async ({ channel, eventHub }, data, session) => {
  // Session is automatically available from middleware or previous auth
  await eventHub?.publish(data.name, channel.channelId, {
    timestamp: new Date().toISOString(),
    from: session?.userId ?? 'anonymous',
  })
})
```

## UserSessionService Integration

The `UserSessionService` is the core component that manages user sessions across both HTTP and WebSocket contexts.

### Setting Sessions

```typescript
// In middleware or functions
services.userSession?.set(session)        // Set new session
services.userSession?.setInitial(session) // Set initial session (middleware)
services.userSession?.clear()             // Clear session
```

### Getting Sessions

```typescript
// In functions - session is automatically passed as third parameter
export const myFunction = pikkuFunc<InputType, OutputType>(
  async (services, data, session) => {
    // session is automatically available
    console.log('User ID:', session?.userId)
  }
)

// Or access directly from service
const currentSession = await services.userSession?.get()
```

## JWT Service Configuration

```typescript
import { JoseJWTService } from '@pikku/jose'

const jwt = new JoseJWTService(
  async () => [
    {
      id: 'my-key',
      value: 'your-secret-key', // Use environment variable in production
    },
  ],
  logger
)
```

## Client-Side Authentication

### HTTP Client

```typescript
import { PikkuFetch } from './pikku-fetch.gen.js'

const pikkuFetch = new PikkuFetch({
  serverUrl: process.env.API_BASE_URL
})

// Set authentication
pikkuFetch.setAPIKey(userApiKey)

// Make authenticated requests
const todos = await pikkuFetch.get('/todos')
```

### WebSocket Client

```typescript
import { PikkuWebSocket } from './pikku-websocket.gen.js'

const websocket = new PikkuWebSocket<'events'>(serverUrl, apiKey)

websocket.ws.onopen = async () => {
  // Authenticate if needed
  websocket.send({
    action: 'auth',
    token: 'valid-token',
    userId: 'user123'
  })
}
```

## Best Practices

1. **Use middleware for global authentication** - Apply authentication middleware globally for consistent security
2. **Combine approaches** - Use middleware for automatic auth and functions for login/logout operations
3. **Leverage permissions** - Use the permission system for fine-grained access control
4. **Secure JWT secrets** - Store JWT secrets in environment variables, not in code
5. **Handle WebSocket auth early** - Authenticate WebSocket connections as soon as they connect
6. **Session management** - Use `UserSessionService` consistently across HTTP and WebSocket contexts

This comprehensive authentication system provides the flexibility to handle various authentication scenarios while maintaining type safety and consistency across your application.