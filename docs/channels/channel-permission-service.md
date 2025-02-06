---
sidebar_position: 30
title: Channel Permission Service
description: Creating a channel permission service
---

## Channel Permission Service

Pikku also offers a **channel Permission Service** for application-wide channel permission checks. These are useful for enforcing higher-order permission rules, similar to route guards in NestJS or Express.

:::note
This will likely be expanded once we have more requirements.
:::

```typescript reference title="Channel Permission Service Interface"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/channel/channel-permission-service.ts
```

### Example Implementation

The following example demonstrates a channel permission service that restricts access to all routes containing `/admin` to users with admin privileges:

```typescript
class AdminPermissionService implements ChannelPermissionService {
  public verifyChannelAccess(channelRoute, session) {
    if (apiRoute.route.includes('/admin')) {
      if (session?.isAdmin !== true) {
        throw new ForbiddenError();
      }
    }
  }
}
```

In this implementation, any route that includes `/admin` requires the session to indicate the user is an admin. If not, an `ForbiddenError` is thrown, preventing access to the channel.
