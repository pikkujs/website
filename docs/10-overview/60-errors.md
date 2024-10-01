---
sidebar_position: 60
title: Errors
description: Associating errors with HTTP codes
---

## Introduction to Error Handling

In Vramework, errors are associated with specific HTTP status codes and messages. This ensures that errors are handled gracefully and the correct response is sent back to the client. Errors are registered using the `addError` or `addErrors` functions, which map them to HTTP status codes.

## Registering Errors

To map custom errors to HTTP codes, use the `addErrors` function:

```typescript
import { addErrors, EError } from '@vramework/core';

export class NotFoundError extends EError { }
export class BookLimitExceeded extends EError { }

addErrors([
  [NotFoundError, { status: 404, message: 'Resource not found' }],
  [BookLimitExceeded, { status: 400, message: 'Book limit exceeded' }],
]);
```

In this example:

- `NotFoundError` is associated with the 404 status code.
- `BookLimitExceeded` is linked to the 400 status code.

## EError: Avoiding JavaScript Constructor Issues

Vramework uses the `EError` class to handle JavaScript inheritance issues with the native `Error` class across workspaces. This ensures that custom errors behave as expected across the application.

## Example Usage

Here’s an example of how these custom errors might be used in a function:

```typescript
const getBook: APIFunction<JustBookId, Book> = async (services, data) => {
  const book = await services.database.selectFrom('books')
    .selectAll()
    .where('id', '=', data.id)
    .executeTakeFirst();
  
  if (!book) {
    throw new NotFoundError();
  }

  return book;
};
```

In this example, if the book is not found, a `NotFoundError` is thrown, which will result in a 404 response.

## Conclusion

The `EError` class ensures proper error handling, and by associating custom errors with HTTP codes using `addErrors`, you can provide clear and consistent responses to the client when issues arise.
