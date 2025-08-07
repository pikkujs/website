---
sidebar_position: 50
title: Permission Guards
description: Creating permission guards
---

Permissions in Pikku are evaluated before each function execution, similar to guards in NestJS. These permissions ensure that only authorized users can access certain functionality within the system.

A permission function operates much like a `pikkuFunc`, but it returns a boolean to indicate whether the user has access. If an error is thrown, the process results in an error code other than 403. 

:::info
Since permissions are checked in parallel, only the first error thrown will be used to block access.
:::

## Basic Permission Check

A simple permission check might involve verifying the user’s session to determine their role:

```typescript
const isUser: PikkuPermission<unknown> = (_services, _data, session) => {
  return session.isUser;
}

const isAdmin: PikkuPermission<unknown> = (_services, _data, session) => {
  return session.isAdmin;
}
```

In this case, the `isUser` permission checks if the session belongs to a user, while `isAdmin` checks if the session belongs to an admin.

## Advanced Permission Check

For more complex permissions, asynchronous logic involving external services can be introduced. For example, permission checks may require querying a database:

```typescript
const belowLimit: PikkuPermission<unknown> = async (services, _, session) => {
  const booksTaken = await services.kysely
    .selectFrom('user')
    .join('books')
    // Add query logic
    ...
  return booksTaken < someLimit;
}
```

In this case, the permission is based on the number of books a user has checked out. This check requires interaction with a database, making it more dynamic.

## Permission Runner

```typescript
permissions: {
  isTodoCreator: [isTodoCreator, withinAPILimits],
  isAdmin
}
```

## Summary

Pikku's permission system provides flexibility, allowing permissions to be checked at both the function and route levels. By combining simple and advanced checks, it ensures that only authorized users can access sensitive parts of an application.