---
sidebar_position: 30
title: Types and Schemas
description: A brief overview of Pikku's capabilities
---

Pikku is driven entirely by **Types**. This ensures type safety across the application, reducing errors and improving maintainability.

Define input and output types directly on your function:

```typescript
type Input = { sortBy: 'age' | 'name' }
type Output = { users: Array<{ name: string, age: number }> }
const myFunction = pikkuFunc<Input, Output>(async (services, data) => {
  return await services.users.getUsers(data)
})
```

The Pikku CLI extracts those types to generate all the relevant information needed to run the functions — typed SDKs, documentation, and schemas to validate input — all from the types you've already defined.

## JSON Schema Validation

One of the key benefits of using types is that JSON schemas can be automatically generated to validate incoming data. This means that API endpoints can validate data before processing, ensuring that invalid data doesn't cause unexpected behavior.

The schemas are automatically created when running the default pikku command. However you can also specifically only update the schemas by running:

```bash npm2yarn
npx @pikku/cli schemas
```

## Advanced Approach: Database-Driven Types

While defining schemas manually works for small projects, maintaining them alongside a database can become cumbersome. If a field is removed or modified in the database, types defined manually in TypeScript may not reflect those changes resulting in runtime errors.

To address this, the recommended approach is to generate types directly from the database. This provides a more dynamic and error-proof system by ensuring the types always align with the current state of the database.

Here’s a quick example:

```typescript title="Database Types" 
import DB from 'kysely';

export type Books = DB.Book[];
export type JustBookId = Pick<DB.Book, 'id'>;
export type CreateBook = Omit<DB.Book, 'id'>;
export type UpdateBook = JustBookId & RequireAtLeastOne<CreateBook>;
```

This method reduces manual overhead and ensures that both the database and application types are always in sync.