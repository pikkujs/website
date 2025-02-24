---
sidebar_position: 2
title: HTTP Enforce Access
description: Creating an access guard
---

Pikku also offers a **enforceHTTPAccess** method application-wide HTTP permission checks. These are useful for enforcing higher-order permission rules, similar to route guards in NestJS or Express.

## HTTP Permission Service

```typescript title="HTTP Permission Guard Interface"
export type enforceHTTPAccess = (
  route: CoreHTTPFunctionRoute<unknown, unknown, any>,
  session?: CoreUserSession
) => Promise<void> | void
```

### Example Implementation

The following example demonstrates a permission service that restricts access to all routes containing `/admin` to users with admin privileges:

```typescript
const enforceHTTPAccess = (apiRoute, session) => {
  if (apiRoute.route.includes('/admin')) {
    if (session.isAdmin !== true) {
      throw new ForbiddenError();
    }
  }
}
```

In this implementation, any route that includes `/admin` requires the session to indicate the user is an admin. If not, an `ForbiddenError` is thrown, preventing access to the route.
