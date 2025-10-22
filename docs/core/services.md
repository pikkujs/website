---
sidebar_position: 20
title: Services
description: How services work
---

# Services

Services in Pikku are how your functions interact with external state – databases, caches, email providers, logging, and more. They're just plain TypeScript classes or objects, with no framework magic required.

Think of services as your application's **toolbox**. Each function can pick which tools it needs by destructuring them from the first parameter.

## A Simple Service

Here's a minimal example – a service that manages a book collection:

```typescript
interface BookService {
  getBook(id: string): Book | undefined
  createBook(book: Book): void
}

class LocalBookService implements BookService {
  private books = new Map<string, Book>()

  getBook(id: string) {
    return this.books.get(id)
  }

  createBook(book: Book) {
    this.books.set(book.id, book)
  }
}
```

That's it! No decorators, no base classes, no framework coupling. Just a regular TypeScript class.

## Using Services in Functions

Services are available to your functions via the first parameter. **Always destructure only the services you need**:

```typescript
export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ books }, data) => {
    // Only books service is included in the bundle for this function
    const book = books.getBook(data.bookId)
    if (!book) {
      throw new NotFoundError('Book not found')
    }
    return book
  },
  docs: {
    summary: 'Get a book by ID',
    tags: ['books']
  }
})
```

:::tip Tree-Shaking
Destructuring services directly in the parameter list is critical. This tells Pikku which services each function actually uses, enabling proper tree-shaking when you deploy filtered subsets of your application.
:::

## Types of Services

Pikku supports two types of services:

### Singleton Services

Created once when the server starts and shared across all function calls. Use these for:

- **Database connections** – Connection pools
- **Cache clients** – Redis, Memcached
- **External APIs** – Third-party service clients
- **Logger** – Application-wide logging
- **Configuration** – App config loaded at startup
- **JWT** – Token signing and verification

```typescript
// This database pool is created once and shared
const database = new DatabasePool({ ... })
```

:::warning Don't Store Request State
Since singleton services are shared across all function calls, **never** store request-specific data in them (like user IDs or session data). That's what session services are for.
:::

### Session Services

Created fresh for each function call and exist only for that call's duration. Use these for:

- **Request/Response** – HTTP headers, cookies, response modification
- **Database transactions** – Per-request transaction scope
- **User sessions** – Current user's session data
- **Temporary resources** – Auto-cleanup after the request

Session services can depend on singleton services and have access to the current `interaction` and `session`.

## Creating Services

Services are defined in two files: type definitions and implementations.

### 1. Define Your Service Types

First, extend Pikku's type system with your services:

```typescript
// types/application-types.d.ts
import type { CoreConfig, CoreSingletonServices, CoreServices } from '@pikku/core'

// Define your app configuration
export interface Config extends CoreConfig {
  logLevel: string
  database: {
    host: string
    port: number
  }
}

// Add your singleton services
export interface SingletonServices extends CoreSingletonServices<Config> {
  jwt: JWTService
  books: BookService
  database: DatabasePool
}

// Main services type (combines singleton and session services)
export interface Services extends CoreServices<SingletonServices> {
  // Session-specific services are added here
  userSession: UserSessionService
  dbTransaction: DatabaseTransaction
}
```

:::info Why a .d.ts file?
Using a declaration file enforces that you only define types here, not implementations. This keeps your type definitions clean and separate from business logic.
:::

### 2. Implement Service Factories

Then implement the factories that create your services:

```typescript
// services.ts
import type { CreateSingletonServices, CreateSessionServices } from '@pikku/core'

export const createSingletonServices: CreateSingletonServices<
  Config,
  SingletonServices
> = async (config: Config): Promise<SingletonServices> => {
  const logger = new ConsoleLogger()

  if (config.logLevel) {
    logger.setLevel(config.logLevel)
  }

  const jwt = new JoseJWTService(
    async () => [
      {
        id: 'my-key',
        value: process.env.JWT_SECRET || 'dev-secret',
      },
    ],
    logger
  )

  const database = new DatabasePool(config.database)
  await database.connect()

  const books = new BookService()

  return {
    config,
    logger,
    jwt,
    database,
    books,
  }
}

export const createSessionServices: CreateSessionServices<
  SingletonServices,
  Services,
  UserSession
> = async (singletonServices, interaction, session) => {
  // Return only the session-specific services
  // Pikku automatically merges these with singletonServices
  return {
    userSession: createUserSessionService(interaction),
    dbTransaction: new DatabaseTransaction(singletonServices.database),
  }
}
```

Key points:

- **`createSingletonServices`** receives `config` as the first parameter and returns singleton services
- **`createSessionServices`** receives `(singletonServices, interaction, session)` and returns **only** the session-specific services
- Pikku automatically merges session services with singleton services, so your functions have access to both
- Don't spread `...singletonServices` – Pikku handles that for you

:::tip
See the [full services.ts example on GitHub](https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/services.ts) for a complete reference implementation.
:::

## Service Management Philosophy

Pikku uses **dependency lookup** rather than dependency injection. This means:

- ✅ **Single source of truth** – Service factories manage all service creation
- ✅ **Explicit dependencies** – Functions declare exactly what they need
- ✅ **Simple mental model** – No decorators, no reflection, no magic
- ✅ **Runtime flexibility** – Easy to swap implementations based on environment
- ✅ **Better tree-shaking** – Pikku analyzes which services each function uses

Unlike frameworks like NestJS that use decorators and automatic dependency injection:

```typescript
// NestJS approach (NOT Pikku)
@Injectable()
class MyService {
  constructor(
    @Inject('DATABASE') private db: Database,
    @Inject('LOGGER') private logger: Logger
  ) {}
}
```

Pikku keeps it simple:

```typescript
// Pikku approach
export const myFunction = pikkuFunc({
  func: async ({ database, logger }, data) => {
    // Just destructure what you need
  }
})
```

| **Aspect** | **Pikku (Dependency Lookup)** | **NestJS (Dependency Injection)** |
|------------|-------------------------------|-----------------------------------|
| **Setup** | Define in factory functions | Decorators on every service |
| **Runtime** | No reflection overhead | Reflection at startup |
| **Tree-shaking** | Excellent (Pikku analyzes usage) | Limited (all services bundled) |
| **Mental model** | Explicit and simple | "Magical" but familiar to some |
| **Testing** | Mock the factories | Mock via DI container |

The trade-off: Pikku requires you to explicitly create your services in factory functions, but in exchange you get better tree-shaking, faster cold starts, and a simpler mental model.

## Error Handling in Services

Services can throw Pikku errors that are automatically mapped to HTTP status codes:

```typescript
import { PikkuError, addError } from '@pikku/core'

export class NotEnoughPointsError extends PikkuError {}
addError(NotEnoughPointsError, { status: 400, message: 'Not enough points!' })

class GameScoreService {
  private score = 100

  deductPoints(points: number) {
    if (points > this.score) {
      throw new NotEnoughPointsError()
    }
    this.score -= points
    return this.score
  }
}
```

When this error is thrown from a function called via HTTP, Pikku automatically sends a 400 response. See [Errors](/docs/core/errors) for more details.

## Environment-Based Service Switching

Services make it easy to swap implementations based on environment:

```typescript
export const createSingletonServices: CreateSingletonServices<
  Config,
  SingletonServices
> = async (config: Config): Promise<SingletonServices> => {
  const isProduction = process.env.NODE_ENV === 'production'

  let storage: Storage
  if (isProduction) {
    // Use S3 in production
    storage = new S3Storage(config.aws)
  } else {
    // Use local filesystem in development
    storage = new LocalStorage('./tmp')
  }

  return {
    config,
    storage,
    // ... other services
  }
}
```

For tests, create a separate factory that returns mocked services:

```typescript
// services.test.ts
export const createTestServices = async (
  config: Config
): Promise<SingletonServices> => {
  return {
    config,
    logger: new NoOpLogger(),
    database: new MockDatabase(),
    storage: new InMemoryStorage(),
    // ... other mocks
  }
}
```

## Summary

Pikku services are:

- **Plain TypeScript** – No decorators or framework coupling
- **Explicitly managed** – Factory functions control creation
- **Tree-shakeable** – Only bundled when actually used by functions
- **Flexible** – Easy to swap based on environment or testing needs
- **Two types** – Singletons for global resources, session services for per-request state
- **Automatically merged** – Pikku combines singleton and session services for you

The key insight: **your services don't know about Pikku**. They're just classes that your functions happen to use via the services parameter. This keeps your business logic portable and easy to test.

## Next Steps

- [Middleware](/docs/core/middleware) – Add cross-cutting concerns like logging and authentication
- [Errors](/docs/core/errors) – Map custom errors to HTTP status codes
- [Functions](/docs/core/functions) – Understand how functions use services
