---
sidebar_position: 30
title: Errors
description: Associating errors with HTTP codes
---

In Pikku, errors are associated with specific HTTP status codes and messages. This ensures that errors are handled gracefully and the correct response is sent back to the client. Errors are registered using the `addError` function, which maps them to HTTP status codes.

## Registering Errors

To map custom errors to HTTP codes, use the `addError` function:

```typescript
import { PikkuError } from '@pikku/core/errors'
import { addError } from '#pikku/pikku-types.gen.js'

export class NotFoundError extends PikkuError {}
export class BookLimitExceeded extends PikkuError {}

addError(NotFoundError, {
  status: 404,
  message: 'Resource not found'
})

addError(BookLimitExceeded, {
  status: 400,
  message: 'Book limit exceeded'
})
```

In this example:

- `NotFoundError` is associated with the 404 status code.
- `BookLimitExceeded` is linked to the 400 status code.

## PikkuError: Avoiding JavaScript Constructor Issues

Pikku uses the `PikkuError` class to handle JavaScript inheritance issues with the native `Error` class across workspaces. This ensures that custom errors behave as expected across the application.

## Example Usage

Here’s an example of how these custom errors might be used in a function:

```typescript
const getBook = pikkuFunc<JustBookId, Book>(async (services, data) => {
  return await services.database.selectFrom('books')
    .selectAll()
    .where('id', '=', data.id)
    .executeTakeFirst(() => throw NotFoundError());
});
```

In this example, if the book is not found, a `NotFoundError` is thrown, which will result in a 404 response.

## Summary

The `PikkuError` class ensures proper error handling, and by associating custom errors with HTTP codes using `addErrors`, you can provide clear and consistent responses to the client when issues arise.
