---
title: QueueService
---

The QueueService is the producer side of [background queues](/docs/wiring/queue) — it hands a job to whatever queue backend you registered and reads jobs back by id. It is registered as the `queueService` singleton service. The consumer side is separate: a `QueueWorkers` adapter from the same package subscribes to the queues declared with `wireQueueWorker` and runs them.

Two features other than queue workers depend on it. Outgoing webhooks are delivered through the `pikku-outgoing-webhooks` queue, so [`WebhookService`](./webhook-service) needs one. And [workflows](/docs/wiring/workflows) check for a `queueService` to decide whether a step is dispatched or run inline — with none registered, steps run inline and a remote workflow throws `QueueService not configured. Remote workflows require a queue service.`

`pikku dev` and `pikku serve` register `InMemoryQueueService` for you, so queues work in development without a broker.

## Interface

```typescript reference title="queue.types.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/wirings/queue/queue.types.ts
```

## Members

### `readonly supportsResults: boolean`

Whether the backend can hand a job's return value back to the producer. It is a
property rather than a capability check per call because it decides whether
`QueueJob.waitForCompletion` exists at all: a fire-and-forget transport (SQS,
Cloudflare Queues, Azure Storage Queues) reports `false`, and a broker that
keeps completed jobs (BullMQ, pg-boss) reports `true`.

### `add<T>(queueName: string, data: Safe<T>, options?: JobOptions): Promise<string>`

Enqueues a job and returns its id. `queueName` is the same string the worker was
wired with — it is the contract between producer and consumer.

`data` is `Safe<T>`, not `T`. `Safe` collapses to `never` if a `SecretValue`
appears anywhere inside the payload, however deeply nested, so handing a vault
secret to a queue is a type error rather than something you find in a broker's
UI later. The build additionally scans for *revealed* secrets — values that went
through `.reveal()` — reaching `add`. PII is deliberately **not** rejected here,
unlike on the logger or the webhook service: a queue payload stays on the
operator's own infrastructure and is consumed by their own worker, so it is not
a disclosure.

### `getJob<T, R>(queueName: string, jobId: string): Promise<QueueJob<T, R> | null>`

Looks a job up by the id `add` returned. `null` means the backend has no record
of it — which includes jobs the backend has already discarded under its
`removeOnComplete` / `removeOnFail` retention, so absence is not proof the job
never ran.

## QueueJob

What `getJob` returns.

| Member | Description |
|--------|-------------|
| `id: string` | The job id |
| `queueName: string` | The queue it was added to |
| `status: () => Promise<QueueJobStatus> \| QueueJobStatus` | A call, not a field — it is read from the backend. One of `waiting`, `active`, `completed`, `failed`, `delayed` |
| `data: T` | The payload as enqueued |
| `result?: R` | Present only once the job completed on a backend that keeps results |
| `waitForCompletion?: (ttl?: number) => Promise<R>` | *Optional.* Absent when `supportsResults` is `false` — check the flag rather than calling it and catching |
| `metadata?: () => Promise<QueueJobMetadata> \| QueueJobMetadata` | *Optional.* Progress, `attemptsMade`, `maxAttempts`, timestamps and the failure `error`. A backend that tracks none of it omits the call |
| `pikkuUserId?: string` | *Optional.* The producer's identity claim, as it rides on the job |

## JobOptions

| Option | Description |
|--------|-------------|
| `priority?: number` | Higher runs first |
| `delay?: number` | Milliseconds before the job becomes eligible |
| `attempts?: number` | Total attempts, including the first |
| `backoff?: string \| { type: string; delay?: number }` | Backoff strategy, passed through to the backend |
| `removeOnComplete?: number` | How many completed jobs to retain — a count, not an age |
| `removeOnFail?: number` | How many failed jobs to retain — a count, not an age |
| `jobId?: string` | Supply your own id, which is how you get idempotency out of a backend that dedupes on it |
| `pikkuUserId?: string` | The producer's Pikku user id, carried to the worker |
| `group?: JobGroup` | `{ id, tier? }` — counts against the worker's `groupConcurrency` |

## Job identity

`pikkuUserId` is a *claim*: it travels with the job through a broker your
workers may not exclusively own. `runQueueJob` verifies it against a signature
before putting it on the wire, so an unsigned or invalid claim is dropped with
an error log and the job simply runs without a `pikkuUserId` rather than running
as somebody it is not.

Signing is opt-in and lives in a wrapper rather than in each backend:

```typescript
import { SignedQueueService } from '@pikku/core/queue'

const queueService = new SignedQueueService(
  bullFactory.getQueueService(),
  secrets,
  logger
)
```

It signs `JobOptions.pikkuUserId` against the queue name and the payload using
the `PIKKU_QUEUE_IDENTITY_SECRET` secret. With that secret missing it logs a
warning and strips the claim instead of sending it unsigned — every other option
is forwarded untouched, and `supportsResults` and `getJob` pass straight through
to the wrapped service.

```typescript reference title="signed-queue-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/wirings/queue/signed-queue-service.ts
```

## Implementations

### InMemoryQueueService (built-in)

Runs jobs in this process on a timer. `supportsResults` is `false`. It is what
`pikku dev` and `pikku serve` register, and it deliberately copies the timing
and serialization semantics of a real broker — the payload is JSON round-tripped
before the worker sees it, and attempts are retried with backoff — so a job that
works in development is not relying on shared object references.

```typescript
import { InMemoryQueueService } from '@pikku/core/services'

const queueService = new InMemoryQueueService()
```

```typescript reference title="in-memory-queue-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/in-memory-queue-service.ts
```

### Shipping backends

| Class | Package | `supportsResults` |
|-------|---------|-------------------|
| `BullQueueService` | `@pikku/queue-bullmq` | `true` |
| `PgBossQueueService` | `@pikku/queue-pg-boss` | `true` |
| `SQSQueueService` | [`@pikku/aws-services`](/docs/storage/aws-services) | `false` |
| `SQSQueueService` | `@pikku/lambda` | `false` |
| `CloudflareQueueService` | `@pikku/cloudflare` | `false` |
| `AzureQueueService` | `@pikku/azure-functions` | `false` |

`@pikku/aws-services` and `@pikku/lambda` each ship their own `SQSQueueService`
— same name, different constructors — so import from the one your runtime
already depends on.

## Registration

BullMQ and pg-boss expose a factory that shares one connection between the queue
service, the workers and the scheduler:

```typescript
import { BullServiceFactory } from '@pikku/queue-bullmq'

const bullFactory = new BullServiceFactory()
await bullFactory.init()

const singletonServices = await createSingletonServices(config, {
  queueService: bullFactory.getQueueService(),
})
```

Registering the queue service alone gives you the producer side. To *run* the
workers, start the matching `QueueWorkers` adapter (`bullFactory.getQueueWorkers()`)
as well — see the [Queue Client](/docs/wiring/queue/client) for the generated,
type-safe wrapper around `add` and `getJob`.
