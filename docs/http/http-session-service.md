---
sidebar_position: 1
title: HTTP Session Service
description: Validating sessions
---

The session service in Pikku follows a simple structure. It may evolve to handle more data from requests, like the origin, but currently, the session creation responsibility remains inside of the userland login/session related functions.

```typescript reference title="Session Service Interface"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/packages/core/src/services/user-session-service.ts
```

If a http session service is registered within the singleton services, Pikku will automatically use it to validate the user session.

### Default Session Service

The default implementation provided by Pikku is called `PikkuHTTPSessionService`.

## Retrieving a Session

The `PikkuHTTPSessionService` attempts to retrieve a session using the following mechanisms, in this order:

### 1. API Key in Header (`x-api-key`)

An API key can be passed via the `x-api-key` header. Pikku will call the provided `getSessionForAPIKey` function to retrieve the user session. If the API key is present but not handled, an error will be thrown.

### 2. JWT Token in Authorization Header

This follows the standard JWT workflow. The JWT token is retrieved from the `Authorization` header and decoded using the `JWTService`.

### 3. Cookie

Pikku can retrieve a session via cookies. The cookie name can be set via the `cookieNames` option. In cases where the cookie name is determined by the host, use the `cookieNameIsOrigin` option.

Once the cookie is located, Pikku calls `getSessionForCookieValue` to retrieve the user session.

## Transforming Sessions

Sometimes, additional data needs to be included in the session beyond what is stored in a JWT. For example, sensitive information that shouldn't be stored in the token itself. Pikku allows this transformation using `transformSession`, which can add or modify session data.

## Example Initialization

Here's an example of initializing a session service with JWT support and session transformation:

```typescript
const jwtService = new JWTService<UserSession>(async () => [
  {
    keyid: 'my-first-key',
    secret: 'the-yellow-puppet'
  },
  {
    keyid: 'my-new-key',
    secret: 'the-purple-banana'
  }
]);

const pikkuSessionService = new PikkuHTTPSessionService<UserSession>(
  jwtService,
  {
    getSessionForAPIKey: async (apiKey: string) => {
      if (apiKey === 'top-secret') {
        return topSecretUserSession;
      }
    },
    transformSession: async (session: any) => {
      // Presudo code to demonstrate how you can 
      // augment the session if needed
      const dateOfBirth = await database
        .select('dateOfBirth')
        .from('user')
        .where('userId', '=', session.userId)

      return {
        ...session,
        privateSessionData: {
          dateOfBirth: '20230401'
        }
      };
    }
  }
);
```

This configuration allows Pikku to validate and transform sessions, ensuring flexibility and security in handling user data.