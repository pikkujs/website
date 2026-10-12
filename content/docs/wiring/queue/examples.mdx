---
sidebar_position: 5
title: Examples
description: Real-world queue usage patterns and examples
---

# Queue Examples

This page covers the queue patterns that come up most often: what to put in the worker, how to tune it, and how to feed it. Every function and wiring is a plain Pikku function and a `wireQueueWorker` call, so the shapes below carry over to any of them.

For complete, running code, see the order-confirmation and audit workers in the [introduction](/docs/wiring/queue#real-world-example-order-notifications).

## Email Processing

The worker takes the message as its input, sends it, and returns nothing. The template's confirmation worker is exactly this:

```typescript @snippet sendOrderConfirmation
```

Tuning is a matter of the worker's `config`. Email is I/O bound, so a larger `batchSize` is cheap, and keeping the last 100 completed jobs makes debugging easier:

```typescript @snippet queueConfig
```

From a function, add the job with `queueService.add`. Security-related mail is worth a higher priority and more retries:

```typescript @snippet wb-queue-add-job
```

## Image Processing and Other Heavy Work

CPU-bound jobs want the opposite settings: a low `batchSize` so a worker doesn't take on more than it can run at once, and a long `lockDuration` (or `visibilityTimeout` on polling providers) so a slow job isn't picked up by a second worker while the first is still on it.

```typescript @snippet wb-queue-lock-duration
```

When the caller needs the outcome, wait for it:

```typescript @snippet wb-queue-wait-for-completion
```

## Data Export

Exports are long, so they combine a long lock with progress reporting. The worker reports progress as it pages through the data, and can discard the job if there is nothing to do:

```typescript @snippet queueJobControl
```

Anyone holding the job id can read that progress back, together with the status and, once finished, the result:

```typescript @snippet wb-queue-job-status
```

## Notification System

When some messages matter more than others, run the same function on several queues and tune each one:

```typescript @snippet wb-queue-priority-workers
```

Then pick the queue when you enqueue:

```typescript @snippet wb-queue-enqueue-by-priority
```

| Queue | `batchSize` | `pollInterval` | Why |
|-------|-------------|----------------|-----|
| `notifications-urgent` | 10 | 1 s | Latency matters, so poll fast and process in bulk |
| `notifications-normal` | 5 | 5 s | The default balance |
| `notifications-low` | 2 | 30 s | Stays out of the way of everything else |

## Background Cleanup

Cleanup work is housekeeping nobody is waiting on, so it usually runs on a clock rather than on demand. The function below is a plain void function, which `wireScheduler` can run on a schedule (see [Scheduled Tasks](/docs/wiring/scheduled-tasks)). If you'd rather run it as a queue job, wire the same function with `wireQueueWorker` and use a `batchSize` of 1 so it never runs in parallel with itself.

```typescript @snippet cleanupAbandonedBaskets
```

## Best Practices from Examples

### 1. Error Handling

Throw, don't swallow. A thrown error is what tells the provider to retry, so log what you need and then rethrow:

```typescript @snippet wb-queue-error-handling
```

### 2. Progress Reporting

For long-running tasks, report progress with `queue.updateProgress()` rather than only logging it. The value is readable from the job's `metadata()`, so a UI or another function can show it. See the `queueJobControl` snippet above.

### 3. Resource Management

Close what you open. If your worker opens a connection or a file handle, release it in a `finally` block so a failed job doesn't leak it.

### 4. Timeout Handling

There is no per-job `timeout` option. How long a worker may hold a job is a worker-side setting: `lockDuration` (milliseconds) for push-based backends like BullMQ, `visibilityTimeout` (seconds) for poll-based ones. Set it on the worker's `config` and enqueue jobs without it, as in the lock-duration snippet above.

Each queue service reports which keys it supports; unsupported ones are dropped with a warning rather than silently ignored.

These patterns are enough to build robust, scalable background processing with Pikku queues. Each can be adapted to your specific needs.
