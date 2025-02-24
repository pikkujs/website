---
sidebar_position: 30
title: Types and Schemas
description: A brief overview of Pikku's capabilities
---

Pikku is almost driven entirely by **Types**. This ensures type safety across the application, reducing errors and improving maintainability.

In this example project, without a database connection, all types are defined from scratch. Here's an example:

```typescript reference title="Book Types"
https://raw.githubusercontent.com/pikku/express-middleware-starter/blob/master/types/books.types.d.ts
```

By referencing these types in the APIs, it’s clear what data to expect. This ensures consistency and reduces the risk of runtime errors.

## JSON Schema Validation

One of the key benefits of using types is that JSON schemas can be automatically generated to validate incoming data. This means that API endpoints can validate data before processing, ensuring that invalid data doesn't cause unexpected behavior.

The schemas are automatically created when running the default pikku command. However you can also specifically only update the schemas by running:

```bash npm2yarn
npx @pikku/cli schema
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

For more details, refer to the advanced [workspace guide](/docs/guides/yarn-workspaces.md) documentation.