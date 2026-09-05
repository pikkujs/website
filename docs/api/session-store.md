---
title: SessionStore
---

The SessionStore persists user sessions server-side, keyed by `pikkuUserId`. It is registered as the `sessionStore` singleton service. Three methods, no lifecycle, no queries — it is a keyed blob store and nothing more.

You never call it from a function. The function runner reads from it while resolving a request's session, and [`UserSessionService`](./user-session-service) writes to it whenever `setSession()` or `clearSession()` runs on the wire. Leaving it out is a valid choice: sessions then live only for the length of the request or connection that carried them.

## Interface

```typescript reference title="session-store.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/session-store.ts
```

The interface is generic — `SessionStore<UserSession extends CoreUserSession = CoreUserSession>` — so an implementation can be typed against your own session shape.

## Methods

### `get(pikkuUserId: string): Promise<UserSession | undefined>`

Returns the stored session, or `undefined` if there is none. `undefined` is the
normal case, not an error: a request arriving with a `pikkuUserId` that has no
stored session simply proceeds without one.

### `set(pikkuUserId: string, session: UserSession): Promise<void>`

Stores (and replaces) the session for that id.

### `clear(pikkuUserId: string): Promise<void>`

Removes it. This is what a logout ends up calling.

## How it is used

The store is consulted once per invocation, before your function runs:

- The runner resolves a `pikkuUserId` from the wire. With no store or no
  `pikkuUserId`, nothing happens and the session stays whatever the wire carried.
- If the wire carries no session, the runner calls `get(pikkuUserId)` and, when
  something comes back, attaches it as the request's session.
- If the wire already carries one — a WebSocket connection that authenticated at
  upgrade, or a session propagated from a parent workflow — the store is not
  consulted, and that session wins.

Writes go the other way: `UserSessionService.set()` and `.clear()` forward to
the store, but **only when a `pikkuUserId` is known**. A session set on a wire
with no resolved `pikkuUserId` lives for that invocation and is never persisted.

Serverless WebSocket channels rely on it more heavily than anything else: each
message arrives in a fresh invocation, so without a store there is nothing to
recover the connection's session from. Missing one shows up as an explicit error
naming the channel and telling you to configure `sessionStore`.

## Implementations

### InMemorySessionStore (built-in)

A `Map`. Correct for a single process and for tests; useless the moment you run
two instances, since neither sees the other's sessions.

```typescript
import { InMemorySessionStore } from '@pikku/core/services'

const sessionStore = new InMemorySessionStore()
```

```typescript reference title="in-memory-session-store.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/in-memory-session-store.ts
```

### RedisSessionStore

[`@pikku/redis`](/docs/storage/redis). Takes an `ioredis` instance, a
`RedisOptions` object or a connection string, an optional key prefix
(default `pikku`), and an optional TTL in seconds — the only implementation that
expires sessions on its own.

```typescript
import { RedisSessionStore } from '@pikku/redis'

const sessionStore = new RedisSessionStore(process.env.REDIS_URL!)
```

### KyselySessionStore

[`@pikku/kysely`](/docs/storage/kysely). One row per user in
`pikkuUserSessions`. Call `init()` once before use — it *requires* the session
schema rather than creating it, and throws telling you to run `pikku db generate`
and `pikku db migrate` if the tables are missing.

```typescript
import { KyselySessionStore } from '@pikku/kysely'

const sessionStore = new KyselySessionStore(db.kysely)
await sessionStore.init()
```

### MongoDBSessionStore

[`@pikku/mongodb`](/docs/storage/mongodb). A `pikkuUserSessions` collection keyed
by `_id`. Also has an `init()` to call before use.

```typescript
import { MongoDBSessionStore } from '@pikku/mongodb'

const sessionStore = new MongoDBSessionStore(db)
await sessionStore.init()
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  sessionStore: new RedisSessionStore(process.env.REDIS_URL!),
})
```
