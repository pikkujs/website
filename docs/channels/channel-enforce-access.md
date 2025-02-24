---
sidebar_position: 30
title: Channel AccessControl
description: Using channel enforcement
---

## Channel Enforce Access

Pikku also offers a **channel access enforcer** for application-wide channel permission checks. These are useful for enforcing higher-order permission rules, similar to route guards in NestJS or Express.

:::note
This will likely be expanded once we have more requirements.
:::

```typescript
export type enforceChannelAccess = (
  channel: CoreAPIChannel<unknown, any>,
  session?: CoreUserSession
) => Promise<void> | void
```

### Example Implementation

The following example demonstrates a channel permission service that restricts access to all routes containing `/admin` to users with admin privileges:

```typescript
const enforceChannelAccess = (channelRoute, session) {
  if (channelRoute.route.includes('/admin')) {
    if (session?.isAdmin !== true) {
      throw new ForbiddenError();
    }
  }
}
```

In this implementation, any route that includes `/admin` requires the session to indicate the user is an admin. If not, an `ForbiddenError` is thrown, preventing access to the channel.
