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
import { pikkuPermission } from '@pikku/core'

const isUser = pikkuPermission((_services, _data, session) => {
  return session.isUser;
})

const isAdmin = pikkuPermission((_services, _data, session) => {
  return session.isAdmin;
})
```

In this case, the `isUser` permission checks if the session belongs to a user, while `isAdmin` checks if the session belongs to an admin.

## Advanced Permission Check

For more complex permissions, asynchronous logic involving external services can be introduced. For example, permission checks may require querying a database:

```typescript
const belowLimit = pikkuPermission(async ({ kysely }, _data, session) => {
  const booksTaken = await kysely
    .selectFrom('user')
    .join('books', 'books.userId', 'user.userId')
    .select('books.id')
    .where('user.userId', '=', session.userId)
    .where('books.returnedAt', 'is', null)
    .execute()
  
  return booksTaken.length < 5; // User can have max 5 books
})
```

In this case, the permission is based on the number of books a user has checked out. This check requires interaction with a database, making it more dynamic.

## Permission Runner

```typescript
permissions: {
  isTodoCreator: [isTodoCreator, withinAPILimits],
  isAdmin
}
```

## addPermission API

Adds global permissions for a specific tag that applies to any wiring type (HTTP, Channel, Queue, Scheduler, MCP) that includes the matching tag.

### Syntax

```typescript
import { addPermission, type PikkuPermission, type CorePermissionGroup } from '@pikku/core'

addPermission(
  tag: string,
  permissions: CorePermissionGroup | PikkuPermission[]
)
```

### Parameters

- **tag** (`string`) - The tag that the permissions should apply to
- **permissions** (`CorePermissionGroup | PikkuPermission[]`) - Permission group or array of permission functions to apply for the specified tag

### Usage

#### Basic Tag-Based Permissions

```typescript
import { addPermission, pikkuPermission } from '@pikku/core'

const adminPermission = pikkuPermission((_services, _data, session) => {
  return session?.role === 'admin'
})

const authenticatedPermission = pikkuPermission((_services, _data, session) => {
  return !!session?.userId
})

const premiumUserPermission = pikkuPermission(async ({ kysely }, _data, session) => {
  if (!session?.userId) return false
  
  const user = await kysely
    .selectFrom('user')
    .select('subscriptionType')
    .where('userId', '=', session.userId)
    .executeTakeFirst()
  
  return user?.subscriptionType === 'premium'
})

// Add admin permission for admin endpoints
addPermission('admin', [adminPermission])

// Add authentication requirement for protected endpoints
addPermission('protected', [authenticatedPermission])

// Add premium user check for premium features
addPermission('premium', [premiumUserPermission])
```

#### Permission Groups

You can define more complex permission logic using permission groups:

```typescript
import { type CorePermissionGroup } from '@pikku/core'

const moderatorPermission: PikkuPermission = async (services, data, session) => {
  return session?.role === 'moderator'
}

const contentOwnerPermission: PikkuPermission = async (services, data, session) => {
  const content = await services.kysely
    .selectFrom('content')
    .select('ownerId')
    .where('contentId', '=', data.contentId)
    .executeTakeFirst()
  
  return content?.ownerId === session?.userId
}

// Either admin OR (moderator AND content owner) can edit content
const contentEditPermissions: CorePermissionGroup = {
  adminAccess: adminPermission,
  moderatorAccess: [moderatorPermission, contentOwnerPermission]
}

addPermission('content-edit', contentEditPermissions)
```

#### Cross-Wiring Type Permissions

The same tag-based permissions apply across all wiring types:

```typescript
// This permission will apply to HTTP routes, WebSocket channels, 
// queue workers, scheduled tasks, and MCP tools that have the 'premium' tag
const premiumPermission: PikkuPermission = async (services, data, session) => {
  if (!session?.userId) return false
  
  const user = await services.kysely
    .selectFrom('user')
    .select('subscriptionType')
    .where('userId', '=', session.userId)
    .executeTakeFirst()
  
  return user?.subscriptionType === 'premium'
}

addPermission('premium', [premiumPermission])
```

### Using Tags in Wirings

#### HTTP Routes

```typescript
import { wireHTTP } from '@pikku/core'

// This route will require both 'api' and 'admin' permissions
wireHTTP({
  method: 'DELETE',
  route: '/admin/users/:userId',
  func: deleteUser,
  tags: ['api', 'admin'] // Permissions for both tags will be checked
})
```

#### WebSocket Channels

```typescript
import { wireChannel } from '@pikku/core'

// This channel will require 'premium' permissions
wireChannel({
  name: 'premium-notifications',
  func: handlePremiumNotification,
  tags: ['premium'] // Only 'premium' permissions will be checked
})
```

#### Queue Workers

```typescript
import { wireQueueWorker } from '@pikku/core'

// This queue worker will require 'api' and 'background' permissions
wireQueueWorker({
  queue: 'user-data-processing',
  func: processUserData,
  tags: ['api', 'background']
})
```

#### Scheduled Tasks

```typescript
import { wireScheduler } from '@pikku/core'

// This scheduled task will require 'admin' permissions
wireScheduler({
  cron: '0 2 * * *',
  func: cleanupExpiredData,
  tags: ['admin']
})
```

### Permission Execution Order

Tag-based permissions are checked as part of the overall permission validation in this order:

1. **Wiring-level tag permissions** (from wiring's `tags` property) - at least one must pass if any exist
2. **Wiring-level permissions** (from wiring's `permissions` property) - must pass if defined
3. **Function-level tag permissions** (from function config's `tags` property) - at least one must pass if any exist
4. **Function-level permissions** (from function config's `permissions` property) - must pass if defined

### Advanced Examples

#### Resource-Based Permissions

```typescript
const resourceOwnerPermission: PikkuPermission = async (services, data, session) => {
  if (!session?.userId) return false
  
  const resource = await services.kysely
    .selectFrom('resource')
    .select('ownerId')
    .where('resourceId', '=', data.resourceId)
    .executeTakeFirst()
  
  return resource?.ownerId === session.userId
}

const resourceCollaboratorPermission: PikkuPermission = async (services, data, session) => {
  if (!session?.userId) return false
  
  const collaboration = await services.kysely
    .selectFrom('resourceCollaborator')
    .select('userId')
    .where('resourceId', '=', data.resourceId)
    .where('userId', '=', session.userId)
    .executeTakeFirst()
  
  return !!collaboration
}

// Either owner OR collaborator can access resource
const resourceAccessPermissions: CorePermissionGroup = {
  ownerAccess: resourceOwnerPermission,
  collaboratorAccess: resourceCollaboratorPermission
}

addPermission('resource-access', resourceAccessPermissions)
```

#### Time-Based Permissions

```typescript
const businessHoursPermission: PikkuPermission = async (services, data, session) => {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay()
  
  // Monday-Friday, 9 AM - 5 PM
  return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 17
}

addPermission('business-hours', [businessHoursPermission])
```

### Error Handling

If permissions for a tag already exist, an error will be thrown:

```typescript
addPermission('api', [permission1])

// This will throw an error
addPermission('api', [permission2]) 
// Error: Permissions for tag 'api' already exist. Use a different tag or remove the existing permissions first.
```

When permissions fail, a `ForbiddenError` is thrown with a descriptive message indicating which level failed:
- "Permission denied - wiring tag permissions"
- "Permission denied - wiring permissions"  
- "Permission denied - function tag permissions"
- "Permission denied - function permissions"

## Summary

Pikku's permission system provides flexibility, allowing permissions to be checked at both the function and route levels. By combining simple and advanced checks, and supporting tag-based global permissions, it ensures that only authorized users can access sensitive parts of an application.