---
sidebar_position: 3
title: Queue Client
description: Discover the type-safe queue client for adding and managing jobs
ai: true
---

# Queue Client

Adding jobs and watching them is done through the `queueService` singleton service. It works from any function (and from any code that has your services), and it is the same whichever queue provider sits behind it.

## The Queue Service

`queueService` has two methods:

| Method | What it does |
|--------|--------------|
| `add(queueName, data, options?)` | Adds a job to the named queue and resolves to the job id |
| `getJob(queueName, jobId)` | Resolves to the job, or `null` if it doesn't exist |

It also has a `supportsResults` flag, which tells you whether the provider keeps job results (BullMQ and pg-boss do, SQS does not). The queue name is the `name` you gave to `wireQueueWorker`, and `data` is the payload your worker function takes as input.

Which implementation you get depends on the runtime: BullMQ, pg-boss, SQS, or the in-memory service that `pikku dev` uses locally. Your calling code stays the same.

## Adding Jobs

Call `add` with the queue name and the payload. It returns the job id:

```typescript @snippet queuePublish
```

### Job Options

The third argument customizes a single job:

```typescript @snippet wb-queue-add-job
```

| Option | Effect |
|--------|--------|
| `priority` | Job priority (lower number = higher priority) |
| `delay` | Milliseconds to wait before the job becomes available |
| `attempts` | How many times to try the job before giving up |
| `removeOnComplete` | Keep the last N completed jobs |
| `removeOnFail` | Keep the last N failed jobs |
| `jobId` | A custom job id |
| `backoff` | Retry backoff, as a type name or `{ type, delay }` |

Not every provider honors every option. Each queue service reports which it supports, and logs the ones it drops.

## Job Monitoring

### Getting Job Status

`getJob` returns a job with its `data`, its `result` (once finished), and two functions: `status()` and `metadata()`. `status()` resolves to one of `waiting`, `active`, `completed`, `failed` or `delayed`. `metadata()` carries the progress, attempt counts, timestamps and, for failed jobs, the error.

```typescript @snippet wb-queue-job-status
```

The progress value is whatever the worker passed to `queue.updateProgress()`, as shown on the [introduction](./index.md) page.

### Waiting for Completion

Jobs expose `waitForCompletion` when the provider supports results (BullMQ, pg-boss, not SQS). Pass a timeout in milliseconds:

```typescript @snippet wb-queue-wait-for-completion
```

It rejects if the job fails or the timeout passes, so wrap it in `try`/`catch` when you need to handle either.

## Advanced Features

### Job Cancellation

:::info
Not yet implemented
:::

There is no `remove` method on the queue service yet, so a job that has been added can't be cancelled from the client. Use `delay` to keep a job from starting straight away, or have the worker call `queue.discard()` to drop a job it no longer needs.

### Job Retry

:::info
Not yet implemented
:::

There is no `retry` method either. A failed job is retried by the provider according to its `attempts` and `backoff` settings. To run it again by hand, add a new job with the same payload.
