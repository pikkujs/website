---
sidebar_position: 0
title: Introduction
description: Background job processing with queues
---

# Background Queues

Queues let you process work in the background - sending emails, processing payments, generating reports, or any task that doesn't need an immediate response. Your functions work the same whether you're using Redis (BullMQ), PostgreSQL (pg-boss), or cloud queues (AWS SQS).

Your domain functions don't need to know they're being called from a queue. They just receive typed job data, do their work, and optionally return results. Pikku handles all the queue-specific details like retries, concurrency, and error handling.

## Your First Queue Worker

Here's a queue worker from the templates — it processes todo reminder jobs:

Source: [`queue.functions.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/queue.functions.ts)

Source: [`queue.wiring.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/queue.wiring.ts)

## Queue Functions

Queue functions use `pikkuSessionlessFunc` since background jobs don't have user sessions:

A queue function takes the job payload as its input and, depending on the provider, may return a result. The `sendOrderConfirmation` worker in the example at the end of this page is a complete one: it receives `{ orderId, userId }`, loads the order and the user, and sends the email. It declares `auth: false` implicitly by being a sessionless function, and gives itself a `description` so it shows up readable in tooling.

:::warning Auth and Permissions for Queue Workers
Queue workers are **internal background jobs** without user sessions or incoming requests. They should almost always use `pikkuSessionlessFunc` with `auth: false`.

**If a function has `auth: true` or `permissions`, it's likely wrong for queue usage.** Queue jobs can't authenticate or have permissions checked - they run in the background without a user context.
:::

:::info Return Values
Whether your function can return values depends on the queue provider:
- **BullMQ** and **pg-boss** support return values
- **AWS SQS** does not

If you need portability, use `void` as the output type.
:::

## Wiring Configuration

Configure how your queue worker processes jobs:

```typescript @snippet wb-queue-worker-config
```

:::note Configuration Availability
Different queue providers support different options. Pikku logs which options aren't supported during runtime, allowing you to configure optimally for each queue type while keeping your function code portable.

For example:
- **SQS** and **pg-boss** use polling (`pollInterval`)
- **BullMQ** (Redis) uses push notifications
- Not all queues support all timeout/retry options
:::

## Adding Jobs to Queues

Pikku provides a type-safe queue client for adding and monitoring jobs. The client can be used from any codebase (Pikku or non-Pikku) and provides full type safety based on your queue function definitions.

See [Queue Client](./client.md) for details on adding jobs, monitoring progress, and working with job results.

## Error Handling

Queue functions should throw errors for failures - Pikku handles the retry logic:

```typescript @snippet wb-queue-error-handling
```

The queue system will automatically:
1. Retry the job based on your retry configuration
2. Use exponential backoff between retries (if supported)
3. Move to dead letter queue after max retries (if configured)

## Monitoring Job Progress

For long-running jobs, you can report progress using the `queue` object from the wire (the third argument to your function):

```typescript @snippet queueJobControl
```

The `queue` object also provides:
- `fail(reason)` - Mark the job as failed with a reason
- `discard()` - Discard the job (won't retry)
- `queueName` - The name of the queue
- `jobId` - The unique job identifier

## Queue Providers

Pikku supports multiple queue backends:

### BullMQ (Redis)
- Push-based (no polling needed)
- Advanced features (priority, delayed jobs, job events)
- Great for high-throughput systems
- See [BullMQ Runtime](../../runtimes/bullmq.md)

### pg-boss (PostgreSQL)
- Poll-based
- ACID guarantees
- No additional infrastructure if you already use PostgreSQL
- See [PG Boss Runtime](../../runtimes/pg-boss.md)

### AWS SQS
- Cloud-native serverless queues
- Auto-scaling
- Pay per message

## Real-World Example: Order Notifications

From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template) — two queue workers: one sends order confirmation emails after payment, the other writes structured audit events.

**Order confirmation worker:**

```typescript @snippet sendOrderConfirmation
```

**Audit event worker:**

```typescript @snippet writeAuditEvent
```

**Wiring both workers:**

```typescript @snippet queueWirings
```

## Next Steps

- [Queue Client](./client.md) - Adding and monitoring jobs with type safety
- [`#pikku/queue` in the SDK explorer](/api#app/queue) - every export on the queue door
