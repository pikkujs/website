---
sidebar_position: 10
title: Functions  
description: How functions work
---

Functions in Pikku serve as a core interface for the application. They manage logic, interact with services, and handle data processing. Functions are highly flexible and can:

- **Accept arguments**
- **Return objects**
- **Interact with services**
- **Throw errors**

## Function-Centric Approach

In Pikku, functions often act as a service layer, interacting with databases or caches. Since they are independent of HTTP, the core logic is typically placed directly within the functions.

Here’s an example of a simple function that retrieves a book using [kysely](https://kysely.dev/):

```typescript
const getBook = pikkuFunc<JustBookId, Book>(async (services, data) => {
  return await services.database
    .selectFrom('book')
    .selectAll()
    .where('bookId', '=', data.bookId)
    .executeTakeFirstOrThrow(() => new NotFoundError());
});
```

## Service-Oriented Approach

You can also use a service-driven approach, similar to frameworks like NestJS. In this case, functions interact directly with services to perform specific actions.

```typescript
const getBook = pikkuFunc<JustBookId, Book>(async (services, data) => {
  return await services.books.getBook(data.id);
});
```

:::info
If you follow this approach, it could make sense to embed the function directly in the binding to reduce functions.
:::


```typescript
const getBook = pikkuFunc<JustBookId, Book>(async (services, data) => {
  return await services.books.getBook(data.id);
});
```

## Error Handling

A more detailed explanation of error handling will be covered [here](./errors). It's worth noting that errors are thrown as they are in a normal javascript project. Pikku then maps it to the correct response depending on the protocol.

## HTTP Access in Functions

To access HTTP-related elements (such as request or response objects), a HTTP service is created. This service abstracts HTTP details, allowing for:

- Easier testing through stubbing
- Flexibility across different deployment frameworks and servers
- Clearer and more manageable API interfaces

## Summary

Functions in Pikku provide a consistent and flexible way to manage services, data, and HTTP requests. The next section will explain how these functions are connected to actual HTTP routes, offering developers a seamless experience.