---
title: AuditService
ai: true
---

The AuditService is the durable sink for audit events — who did what, when, through which wire. It is registered as the `audit` singleton service. Functions don't call it directly: they write through the per-invocation `auditLog` wire service, which buffers or forwards events depending on the function's audit configuration.

## Enabling auditing on a function

Auditing is opt-in per function. Set `audit` on the function definition:

```typescript
export const deleteAccount = pikkuFunc<{ accountId: string }, void>({
  audit: true, // or { durability: 'transactional' }
  func: async (services, data, session) => {
    await services.db.deleteAccount(data.accountId)

    await services.auditLog.write({
      type: 'account.deleted',
      source: 'explicit',
      metadata: { accountId: data.accountId },
    })
  },
})
```

- `audit: true` — **best-effort** durability: events are buffered during the invocation and flushed when it ends. A failed flush logs a warning but doesn't fail the request.
- `audit: { durability: 'transactional' }` — each event is written to the sink immediately, inside the invocation.

Actor information (`userId`, `orgId`, `pikkuUserId`), the function ID, wire type/ID, and trace ID are filled in automatically from the wire — you only supply the event `type` and any `metadata`.

If a function without audit config calls `auditLog.write()`, the event is dropped and a one-time warning is logged telling you to set `audit: true`.

## Interface

```typescript reference title="audit-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/audit-service.ts
```

## Methods

### `audit(event: AuditEvent): Promise<void>`

Persists a single audit event.

### `write?(batch: AuditEventBatch): Promise<void>`

Optional batch write. When implemented, best-effort flushes deliver the whole invocation's buffer in one call; otherwise events are written one by one.

## AuditEvent

| Field | Description |
|-------|-------------|
| `type` | Event name, e.g. `'account.deleted'` |
| `source` | `'auto'` (emitted by the runtime) or `'explicit'` (your code) |
| `outcome` | `'success'`, `'failed'`, or `'denied'` |
| `occurredAt` | ISO timestamp (set automatically) |
| `functionId`, `wireType`, `wireId`, `traceId` | Where the event came from (set automatically) |
| `actor` | `{ userId?, orgId?, pikkuUserId? }` (resolved from the session) |
| `input`, `metadata` | Event payload |

## Implementations

### NoopAuditService (built-in)

Discards all events — the default when auditing isn't configured.

```typescript
import { NoopAuditService } from '@pikku/core/services'
const audit = new NoopAuditService()
```

### KyselyAuditService

Durable SQL storage via [`@pikku/kysely`](/docs/storage/kysely):

```typescript
import { KyselyAuditService } from '@pikku/kysely'
const audit = new KyselyAuditService(db.kysely)
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  audit: new KyselyAuditService(db.kysely),
})
```

The per-invocation `auditLog` is created by the runtime for each wire from this sink — you don't register it yourself.
