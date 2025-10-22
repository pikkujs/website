---
sidebar_position: 1
title: Tutorial - Build a Books API
description: Build your first Pikku application from scratch
---

# Tutorial: Build a Books API

Build a simple books API to learn Pikku fundamentals. You'll create functions, wire HTTP routes, add services, and handle errors.

## Prerequisites

- Node.js 18+
- Basic TypeScript knowledge

## 1. Create a New Project

```bash
npm create pikku@latest my-books-api
cd my-books-api
npm install
```

## 2. Create a Book Service

First, add a simple in-memory database service. Open `services.ts`:

```typescript
import type { CreateSingletonServices } from './types/application-types'

export const createSingletonServices: CreateSingletonServices = async (config) => {
  // In-memory book storage
  const books = new Map([
    ['1', { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }],
    ['2', { id: '2', title: '1984', author: 'George Orwell' }]
  ])

  return {
    config,
    logger: console,
    database: {
      getBook: async (id: string) => books.get(id),
      getAllBooks: async () => Array.from(books.values()),
      createBook: async (book: { title: string; author: string }) => {
        const id = (books.size + 1).toString()
        const newBook = { id, ...book }
        books.set(id, newBook)
        return newBook
      }
    }
  }
}

export const createSessionServices = async () => ({})
```

Update `types/application-types.d.ts` to include the database service:

```typescript
import type { CoreConfig, CoreSingletonServices, CoreServices } from '@pikku/core'

export interface Config extends CoreConfig {}

export interface SingletonServices extends CoreSingletonServices<Config> {
  database: {
    getBook: (id: string) => Promise<{ id: string; title: string; author: string } | undefined>
    getAllBooks: () => Promise<Array<{ id: string; title: string; author: string }>>
    createBook: (book: { title: string; author: string }) => Promise<{ id: string; title: string; author: string }>
  }
}

export interface Services extends CoreServices<SingletonServices> {}

export type CreateSingletonServices = (config: Config) => Promise<SingletonServices>
export type CreateSessionServices = (singletonServices: SingletonServices, interaction: any, session?: any) => Promise<Omit<Services, keyof SingletonServices>>
```

## 3. Create Book Functions

Create `functions/books.function.ts`:

```typescript
import { pikkuFunc } from '@pikku/core'
import { NotFoundError } from '@pikku/core/errors'

type Book = { id: string; title: string; author: string }

export const getAllBooks = pikkuFunc<void, Book[]>({
  func: async ({ database }) => {
    return await database.getAllBooks()
  }
})

export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ database }, data) => {
    const book = await database.getBook(data.bookId)

    if (!book) {
      throw new NotFoundError(`Book not found: ${data.bookId}`)
    }

    return book
  }
})

export const createBook = pikkuFunc<
  { title: string; author: string },
  Book
>({
  func: async ({ database }, data) => {
    return await database.createBook(data)
  }
})
```

## 4. Wire HTTP Routes

Update `http.ts`:

```typescript
import { wireHTTP } from '@pikku/core'
import { getAllBooks, getBook, createBook } from './functions/books.function'

wireHTTP({ method: 'get', route: '/api/books', func: getAllBooks })
wireHTTP({ method: 'get', route: '/api/books/:bookId', func: getBook })
wireHTTP({ method: 'post', route: '/api/books', func: createBook })
```

## 5. Generate Types and Start

```bash
npm run pikku watch
```

In another terminal:

```bash
npm start
```

## 6. Test Your API

```bash
# Get all books
curl http://localhost:3000/api/books

# Get a specific book
curl http://localhost:3000/api/books/1

# Create a new book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Brave New World", "author": "Aldous Huxley"}'
```

## 7. Add Validation

Pikku can validate inputs automatically. Update `createBook`:

```typescript
import { pikkuFunc } from '@pikku/core'
import { BadRequestError } from '@pikku/core/errors'

export const createBook = pikkuFunc<
  { title: string; author: string },
  Book
>({
  func: async ({ database }, data) => {
    if (!data.title?.trim()) {
      throw new BadRequestError('Title is required')
    }
    if (!data.author?.trim()) {
      throw new BadRequestError('Author is required')
    }

    return await database.createBook(data)
  }
})
```

Test validation:

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
# Error: Title is required
```

## 8. Add Middleware for Logging

Create `middleware/logging.middleware.ts`:

```typescript
import { pikkuMiddleware } from '@pikku/core'

export const requestLogger = pikkuMiddleware(async ({ logger }, interaction, next) => {
  if (interaction.http) {
    logger.info('Request:', {
      method: interaction.http.request.method,
      path: interaction.http.request.path
    })
  }

  await next()
})
```

Apply to your functions:

```typescript
import { requestLogger } from './middleware/logging.middleware'

export const getAllBooks = pikkuFunc<void, Book[]>({
  func: async ({ database }) => {
    return await database.getAllBooks()
  },
  middleware: [requestLogger]
})
```

## 9. Write Tests

Create `functions/books.function.test.ts`:

```typescript
import { test } from 'node:test'
import * as assert from 'node:assert'
import { getBook, createBook } from './books.function'
import { NotFoundError } from '@pikku/core/errors'

test('getBook returns book when found', async () => {
  const mockServices = {
    database: {
      getBook: async (id: string) => ({ id, title: 'Test Book', author: 'Test Author' })
    }
  }

  const result = await getBook.func(mockServices as any, { bookId: '1' }, undefined)

  assert.equal(result.title, 'Test Book')
})

test('getBook throws NotFoundError when not found', async () => {
  const mockServices = {
    database: {
      getBook: async () => undefined
    }
  }

  await assert.rejects(
    getBook.func(mockServices as any, { bookId: '999' }, undefined),
    NotFoundError
  )
})

test('createBook creates new book', async () => {
  const mockServices = {
    database: {
      createBook: async (book: any) => ({ id: '3', ...book })
    }
  }

  const result = await createBook.func(
    mockServices as any,
    { title: 'New Book', author: 'New Author' },
    undefined
  )

  assert.equal(result.id, '3')
  assert.equal(result.title, 'New Book')
})
```

Run tests:

```bash
npm test
```

## What You've Learned

- **Functions**: Created `pikkuFunc` with typed inputs and outputs
- **Services**: Built a database service and injected it into functions
- **HTTP Routing**: Wired functions to HTTP routes with different methods
- **Error Handling**: Used built-in errors like `NotFoundError` and `BadRequestError`
- **Middleware**: Added request logging
- **Testing**: Tested functions in isolation with mocked services

## Next Steps

- [Add sessions](/docs/core/user-sessions) for authentication
- [Add WebSocket channels](/docs/channels) for real-time updates
- Deploy to production with different runtimes
- [Generate OpenAPI docs](/docs/guides/pikku-cli#openapi-generation)
