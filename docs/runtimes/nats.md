---
title: NATS
description: Queue and scheduler services backed by NATS JetStream
hide_title: true
image: /img/logos/custom-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

`@pikku/queue-nats` provides `QueueService`, queue workers and the scheduler on
top of [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream). It mirrors
the pg-boss and BullMQ factories — same `getQueueService()` /
`getQueueWorkers()` / `getSchedulerService()` shape — so only the bootstrap
changes.

:::warning NATS 2.14+ required
Delayed publishes and cron schedules ride JetStream's message-schedules feature,
added in NATS 2.14. The factory refuses a connection to an older server at boot
rather than failing later on the one code path that would have used it.
:::

```bash
npm install @pikku/queue-nats
```

## Setup

```typescript title="src/start.ts"
import { NatsServiceFactory } from '@pikku/queue-nats'
import './.pikku/pikku-bootstrap.gen.js'

const natsFactory = new NatsServiceFactory({
  servers: process.env.NATS_URL ?? 'nats://localhost:4222',
  streamName: 'pikku-jobs',
  subjectPrefix: 'pikku',
})
await natsFactory.init()

const singletonServices = await createSingletonServices(config, {
  queueService: natsFactory.getQueueService(),
  schedulerService: natsFactory.getSchedulerService(),
})

const queueWorkers = natsFactory.getQueueWorkers()
await queueWorkers.registerQueues()
await natsFactory.getSchedulerService().start()
```

`init()` connects, creates (or converges) the JetStream stream, and constructs
the queue, worker and scheduler services. As with every queue backend, the job
runner is wired by the generated bootstrap import, so registering queues is all
the process needs.

## Factory Options

| Option | Type | Description |
| --- | --- | --- |
| `servers` | `string \| string[]` | NATS server(s), e.g. `nats://services.internal:4222` |
| `streamName` | `string` | Stream holding this prefix's jobs; created if absent |
| `subjectPrefix` | `string` | Subject prefix for every queue. The stream is bound to `<prefix>.>`, and each queue gets one consumer filtered to `<prefix>.<queue>` |
| `defaultConsumerConfig` | `Partial<ConsumerConfig>` | Applied to every consumer; per-worker config from Pikku overrides these |
| `replicas` | `number` | Stream replicas — `1` for a single node, `3` for a quorum cluster (default `1`) |
| `duplicateWindowMs` | `number` | JetStream publish-dedupe window applied to the stream |
| `schedulerTimezone` | `string` | Zone for recurring tasks that don't name one with a `TZ=` prefix |
| `user` / `pass` / `token` / `name` | `string` | Credentials and client name passthrough |
| `onConnectionLost` | `(err?: Error) => void` | Escalation hook for a connection that closed without `close()` being asked for |

### Dedupe is a window, not a row

`JobOptions.jobId` is backed by JetStream's `duplicate_window`, so it dedupes
publishes for as long as that window says — not for as long as the job exists.
pg-boss keeps the job row (days) and rejects duplicates against it; NATS forgets
message ids when the window closes, and the server default is two minutes. If you
rely on `jobId` to collapse a retrying producer, set `duplicateWindowMs`
deliberately.

### Retention has no history

The stream uses WorkQueue retention, so a message is removed the instant it is
acked. That is what makes it a queue instead of a log: a completed job leaves no
trace in NATS, so success/failure rates come from telemetry rather than from
inspecting the stream.

### Reconnects are forever; a dead connection is an escalation

The client reconnects indefinitely with jitter, and `init()` waits for a first
connection — a backend starting while NATS is still coming up waits instead of
failing. If the connection does close for good (for example, authorization
fails after a rotated password), nothing reopens it and every service captured
the old client. `onConnectionLost` is the chosen response: warn by default, or
have it fail a readiness probe or exit for a supervisor to restart.

## Shutdown

```typescript
process.on('SIGTERM', async () => {
  await natsFactory.close()
  process.exit(0)
})
```

`close()` stops the scheduler and workers, then drains the connection — flushing
pending acks and letting in-flight publishes land rather than dropping them.
`drainWorkers(timeoutMs)` returns the queues that still had jobs in flight and is
safe before `init()`.

## Next Steps

- **[Queue](../wiring/queue/index.md)** — job wiring and worker config
- **[Scheduled Tasks](../wiring/scheduled-tasks.md)** — cron wirings the scheduler runs
- **[PG Boss](./pg-boss.md)** and **[BullMQ](./bullmq.md)** — the other queue backends
