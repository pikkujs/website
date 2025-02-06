---
sidebar_position: 2
title: HTTP Permission Service
description: Creating a HTTP permission Service
---

Pikku also offers a **enforceHTTPAccess** method application-wide HTTP permission checks. These are useful for enforcing higher-order permission rules, similar to route guards in NestJS or Express.

## HTTP Permission Service

```typescript reference title="HTTP Permission Service Interface"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/http/http-permission-service.ts
```

### Example Implementation

The following example demonstrates a permission service that restricts access to all routes containing `/admin` to users with admin privileges:

```typescript
class AdminPermissionService implements HTTPPermissionService {
  public verifyRouteAccess(apiRoute, session) {
    if (apiRoute.route.includes('/admin')) {
      if (session.isAdmin !== true) {
        throw new ForbiddenError();
      }
    }
  }
}
```

In this implementation, any route that includes `/admin` requires the session to indicate the user is an admin. If not, an `ForbiddenError` is thrown, preventing access to the route.
