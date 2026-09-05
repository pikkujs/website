---
title: '#pikku/queue'
sidebar_label: '#pikku/queue'
sidebar_position: 6
description: 'Wires a function as a queue worker, so a job on the queue runs the same handler an HTTP route would.'
---

# `#pikku/queue`

Wires a function as a queue worker, so a job on the queue runs the same handler an HTTP route would.

```typescript
import { wireQueueWorker } from '#pikku/queue'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`wireQueueWorker`](#wirequeueworker) | function | Registers a queue worker with the Pikku framework. Workers process background jobs from queues. |

## Reference

### `wireQueueWorker` {#wirequeueworker}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a queue worker with the Pikku framework.
Workers process background jobs from queues.

```typescript
wireQueueWorker: (queueWorker: QueueWiring<any, any>) => void
```

<details>
<summary>Config keys (6)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `config` | `PikkuWorkerConfig` | Concurrency, retry and backoff, passed through to the queue service backing this worker. Defaults come from the service, not from here. |
| `errors` | `string[]` | Names of error classes that mean the job is bad rather than the run — thrown, they fail the job permanently instead of being retried. |
| `func` <sup>required</sup> | `PikkuFunctionConfig<any, any, "rpc" \| "session">` | The function to run per job. Its `input` schema is the job payload's schema — a job that does not match is rejected before the body runs. |
| `middleware` | `PikkuMiddleware[]` | Wraps every job. There is no request to read from, so this is for tracing, locking and teardown rather than auth. |
| `name` <sup>required</sup> | `string` | The queue this worker consumes. Whoever enqueues a job names the same string, so it is the contract between producer and consumer. |
| `tags` | `string[]` | Filters this worker in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
wireQueueWorker({
  name: 'send-order-confirmation',
  func: sendOrderConfirmation,
})

wireQueueWorker({
  name: 'audit-event',
  func: writeAuditEvent,
})
```

## Inside an addon

This door is application-only — there is no `#pikku/addon/queue`. Everything on it wires a function to the outside world, and that is the installing application's call, not the addon's. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.

---

Run `npx pikku doc queue` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
