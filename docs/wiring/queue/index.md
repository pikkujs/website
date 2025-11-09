---
sidebar_position: 0
title: Introduction
description: Background job processing with queues
---

# Background Queues

Queues let you process work in the background - sending emails, processing payments, generating reports, or any task that doesn't need an immediate response. Your functions work the same whether you're using Redis (BullMQ), PostgreSQL (pg-boss), or cloud queues (AWS SQS).

Your domain functions don't need to know they're being called from a queue. They just receive typed job data, do their work, and optionally return results. Pikku handles all the queue-specific details like retries, concurrency, and error handling.

## Your First Queue Worker

Let's process welcome emails in the background:

```typescript
// email.function.ts
import { pikkuSessionlessFunc } from '#pikku'

export const sendWelcomeEmail = pikkuSessionlessFunc<
  { userId: string; email: string; name: string },
  void
>({
  func: async ({ emailService, logger }, data) => {
    logger.info('Sending welcome email', { userId: data.userId })

    await emailService.send({
      to: data.email,
      subject: `Welcome ${data.name}!`,
      template: 'welcome',
      data: { name: data.name }
    })

    logger.info('Welcome email sent', { userId: data.userId })
  },
  auth: false,  // Queue jobs don't have user sessions
  docs: {
    summary: 'Send welcome email to new users',
    tags: ['email']
  }
})
```

```typescript
// email.queue.ts
import { wireQueueWorker } from '#pikku/queue'
import { sendWelcomeEmail } from './functions/email.function.js'

wireQueueWorker({
  queue: 'email',
  func: sendWelcomeEmail
})
```

## Queue Functions

Queue functions use `pikkuSessionlessFunc` since background jobs don't have user sessions:

```typescript
export const processPayment = pikkuSessionlessFunc<
  { orderId: string; amount: number; currency: string },
  { transactionId: string }
>({
  func: async ({ database, paymentService }, data) => {
    const transaction = await paymentService.charge({
      amount: data.amount,
      currency: data.currency
    })

    await database.update('orders', {
      where: { orderId: data.orderId },
      set: { transactionId: transaction.id, status: 'paid' }
    })

    return { transactionId: transaction.id }
  },
  auth: false,
  docs: {
    summary: 'Process payment for an order',
    tags: ['payments'],
    errors: ['PaymentFailedError']
  }
})
```

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

```typescript
import { wireQueueWorker } from '#pikku/queue'
import { processPayment } from './functions/payment.function.js'

wireQueueWorker({
  // Required
  queue: 'payments',
  func: processPayment,

  // Optional configuration
  config: {
    // Processing
    batchSize: 3,              // Messages to process in batch/parallel
    prefetch: 10,              // Messages to prefetch for efficiency
    pollInterval: 5000,        // Polling interval for pull-based queues (ms)

    // Timeouts
    visibilityTimeout: 300,    // Message visibility timeout (seconds)
    lockDuration: 30000,       // Job lock duration (ms)
    drainDelay: 5,             // Wait time when queue is empty (seconds)

    // Job Management
    removeOnComplete: 100,     // Keep N completed jobs
    removeOnFail: 50,          // Keep N failed jobs
    maxStalledCount: 3,        // Max job recovery attempts

    // Other
    name: 'payment-worker',    // Worker name for monitoring
    autorun: true,             // Auto-start processor
  },

  // Optional middleware
  middleware: [auditMiddleware],

  // Optional tags
  tags: ['payments', 'critical']
})
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

```typescript
export const processPayment = pikkuSessionlessFunc<PaymentInput, void>({
  func: async ({ paymentService, logger }, data) => {
    try {
      await paymentService.charge(data)
      logger.info('Payment processed', { orderId: data.orderId })
    } catch (error) {
      logger.error('Payment failed', {
        orderId: data.orderId,
        error: error.message
      })

      // Throw to trigger retry
      throw new PaymentFailedError(error.message)
    }
  },
  auth: false,
  docs: {
    summary: 'Process payment',
    tags: ['payments'],
    errors: ['PaymentFailedError']
  }
})
```

The queue system will automatically:
1. Retry the job based on your retry configuration
2. Use exponential backoff between retries (if supported)
3. Move to dead letter queue after max retries (if configured)

## Monitoring Job Progress

For long-running jobs, you can report progress using the `interaction.queue` object:

```typescript
export const generateReport = pikkuSessionlessFunc<
  { reportId: string },
  void
>({
  func: async ({ database, interaction }, data) => {
    // Update progress if queue supports it
    if (interaction.queue?.updateProgress) {
      await interaction.queue.updateProgress(0)
    }

    const data1 = await database.query('...')
    await interaction.queue?.updateProgress(33)

    const data2 = await database.query('...')
    await interaction.queue?.updateProgress(66)

    await generateReportFile(data1, data2)
    await interaction.queue?.updateProgress(100)
  },
  auth: false
})
```

The `interaction.queue` object also provides:
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

## Next Steps

- [Queue Client](./client.md) - Adding and monitoring jobs with type safety
