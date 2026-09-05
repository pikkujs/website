---
title: WebhookService
---

The WebhookService sends outgoing webhooks — signed HTTP POSTs to somebody else's server. It is registered as the `webhookService` singleton service. Delivery is never inline: `send()` signs the body and enqueues a job on the `pikku-outgoing-webhooks` queue, and a generated queue worker does the actual request. That means it depends on [`QueueService`](./queue-service), and that a failed delivery is retried by the queue rather than by the caller.

It is an **abstract class**, not a plain interface — the signing scheme is shared code rather than something each implementation reinvents. Subclass it (or, in practice, subclass `QueueWebhookService`) rather than writing the shape from scratch.

The worker itself is generated: set the `scaffold.webhook` feature flag in your [Pikku CLI config](/docs/pikku-cli/configuration) and Pikku writes a `wireQueueWorker` for `pikku-outgoing-webhooks`. Without it nothing consumes the queue and deliveries pile up.

## Interface

```typescript reference title="webhook-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/webhook-service.ts
```

## Members

### `abstract send<T extends SendWebhookInput>(input: Safe<T>): Promise<SendWebhookResult>`

The one member a subclass must implement. Returns `{ jobId }` — the id of the
queued delivery, not a delivery result, because nothing has been sent yet when
it returns.

`input` is `Safe<T>`, so a `SecretValue` anywhere in the payload is a type
error. The build also rejects revealed secrets *and* PII flowing into `send`:
a webhook posts to a third party's server, which is a disclosure in a way a
queue payload is not.

### `protected sign(secret: string, body: string): string`

Produces the header *value* — `sha256=<hex>` — not the bare digest. Protected,
because callers should not be constructing signatures; `send` applies it.

### `public verify(secret: string, signature: string, body: string): boolean`

Public precisely because receivers verify with it: the sender and the receiver
share one signing scheme, so a Pikku app receiving a Pikku-signed webhook uses
the same method rather than a reimplementation. The comparison is timing-safe.

### The three delivery-history methods

`recordAttempt`, `listDeliveries` and `getDelivery` are an **optional
capability** expressed as base implementations that throw `NotImplementedError`
rather than as `?` members. The default queue-only service keeps no history; a
store-backed implementation overrides all three.

Callers must not assume they work. The Console's webhook pages, for instance,
render an empty list when no `webhookService` is wired at all — but a service
that is wired and simply keeps no history throws, so guard for it.

#### `recordAttempt(deliveryId: string, result: WebhookAttemptResult): Promise<void>`

Called by the delivery worker after every try, with
`{ statusCode?, responseBody?, error?, delivered }`. `statusCode` is absent when
the request never completed; `responseBody` is truncated and captured on failure
only. The worker records it best-effort — a store error is logged, not thrown,
so history-keeping cannot fail a delivery.

#### `listDeliveries(opts?: { organizationId?: string; limit?: number }): Promise<WebhookDeliveryRecord[]>`

Most recent first.

#### `getDelivery(deliveryId: string): Promise<WebhookDeliveryWithAttempts | null>`

One delivery plus every attempt against it.

## SendWebhookInput

| Field | Description |
|-------|-------------|
| `url` | Where to POST |
| `data` | The payload; `JSON.stringify`-ed into the body |
| `event?` | Sent as the `X-Pikku-Event` header |
| `headers?` | Extra headers, merged over the defaults |
| `secret?` | A **raw HMAC key**, not a secret name — overrides `config.webhook.secret` |
| `retries?` | Overrides `config.webhook.retries` |
| `retryDelay?` | A concrete delay (`30000` or `'30s'`) selects fixed backoff; omitted means exponential |
| `organizationId?` | Persisted only by store-backed implementations; the queue-only default ignores it |

## Configuration

`config.webhook` is a `WebhookServiceConfig` on your `CoreConfig`:

| Option | Description |
|--------|-------------|
| `secret` | A secret **name**, resolved through the [secret service](./secret-service) — unlike `SendWebhookInput.secret`, which is the key itself |
| `signatureHeader` | Defaults to `X-Pikku-Signature` |
| `retries` | Defaults to `3` |
| `retryDelay` | Omitted means exponential backoff |
| `allowedHosts` | SSRF allowlist. Set: only these hostnames may be delivered to. Omitted: private/internal hosts are blocked and every other public host is allowed |

If `config.webhook.secret` is configured but resolves to nothing, the service
logs an error and sends the webhook **unsigned** rather than failing the send.

## Implementations

### QueueWebhookService (built-in)

The default. Signs the body, resolves the retry policy, and enqueues onto
`pikku-outgoing-webhooks`. It keeps no history, so the three delivery-read
methods throw. Its collaborators are constructor arguments rather than service
lookups:

```typescript
import { QueueWebhookService } from '@pikku/core/services'

const webhookService = new QueueWebhookService(queueService)
```

`prepareDelivery` is `protected` so a store-backed subclass can persist a
delivery row and attach its `deliveryId` without re-implementing signing or the
retry policy.

```typescript reference title="queue-webhook-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/queue-webhook-service.ts
```

### KyselyWebhookService

Extends `QueueWebhookService` with durable history in [`@pikku/kysely`](/docs/storage/kysely):
one `webhook_delivery` row per `send()` and one `webhook_delivery_attempt` row
per try. The `deliveryId` doubles as the queue `jobId`, so it is stable across
retries and gives the delivery idempotency on backends that dedupe on job id.

```typescript
import { KyselyWebhookService } from '@pikku/kysely'

const webhookService = new KyselyWebhookService(queueService, db.kysely)
await webhookService.init()
```

`init()` requires the webhook schema and does not create it — a project that
wires this without generating the tables fails at boot rather than on the first
send.

```typescript reference title="kysely-webhook-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/kysely/src/kysely-webhook-service.ts
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  queueService,
  webhookService: new QueueWebhookService(queueService),
})
```

`pikku dev` and `pikku serve` register a `QueueWebhookService` over their
in-memory queue, so webhooks send in development without any wiring of your own.
