---
sidebar_position: 3
title: Queue Client
description: Discover the type-safe queue client for adding and managing jobs
ai: true
---

# Queue Client

The Pikku queue client provides a type-safe interface for adding jobs to queues, monitoring job status, and managing job lifecycles. It's automatically generated based on your queue function definitions.

## Generated Queue Client

When you run `npx pikku`, Pikku generates a type-safe queue client:

```typescript
// .pikku/pikku-queue.gen.ts
import type { QueueService, QueueJob } from '@pikku/core/queue'

export class PikkuQueue {
  constructor(private queueService: QueueService) {}

  // Type-safe methods for each registered queue
  async add<Name extends keyof QueueMap>(
    queueName: Name,
    data: QueueMap[Name]['input'],
    options?: JobOptions
  ): Promise<string>

  async getJob<Name extends keyof QueueMap>(
    queueName: Name,
    jobId: string
  ): Promise<QueueJob<QueueMap[Name]['input'], QueueMap[Name]['output']> | null>
}
```

## Basic Usage

### Setting Up the Client

First, create a queue client with your chosen queue provider:

```typescript
// app.ts
import { PikkuQueue } from '#pikku/pikku-queue.gen.js'
import { BullServiceFactory } from '@pikku/queue-bullmq'

// Create queue service (connects to Redis via REDIS_URL by default)
const bullFactory = new BullServiceFactory()
await bullFactory.init()

// Create type-safe client
const queueClient = new PikkuQueue(bullFactory.getQueueService())
```

### Adding Jobs

Add jobs to queues with full type safety:

```typescript
// Add a simple job
const jobId = await queueClient.add('email-queue', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up!'
})

console.log('Job added with ID:', jobId)
```

### Job Options

Customize job behavior with options:

```typescript
const jobId = await queueClient.add('email-queue', 
  {
    to: 'user@example.com',
    subject: 'Important Update',
    body: 'Please read this immediately.'
  },
  {
    priority: 1,             // Job priority (lower = higher priority)
    delay: 5000,             // Wait 5 seconds before processing
    attempts: 5,             // Retry up to 5 times
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,   // Keep last 100 completed jobs
    jobId: 'unique-job-1'    // Custom job ID
  }
)
```

## Job Monitoring

### Getting Job Status

Retrieve job information and status:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

if (job) {
  console.log('Job status:', await job.status())
  console.log('Job data:', job.data)
  console.log('Job result:', job.result)
  console.log('Job progress:', (await job.metadata?.())?.progress)
}
```

### Job States

`job.status()` resolves to one of several states:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

switch (await job.status()) {
  case 'waiting':
    console.log('Job is waiting to be processed')
    break
  case 'active':
    console.log('Job is currently being processed')
    break
  case 'completed':
    console.log('Job completed successfully:', job.result)
    break
  case 'failed':
    console.log('Job failed')
    break
  case 'delayed':
    console.log('Job is delayed')
    break
}
```

### Waiting for Completion

Jobs expose `waitForCompletion` when the queue provider supports results (BullMQ, pg-boss — not SQS):

```typescript
const jobId = await queueClient.add('order-processing', orderData)
const job = await queueClient.getJob('order-processing', jobId)

try {
  const result = await job.waitForCompletion?.(60000)  // Wait up to 1 minute

  console.log('Order processed:', result)
} catch (error) {
  console.error('Job failed or timed out:', error)
}
```

## Advanced Features

### Job Cancellation

:::info
Not yet implemented
:::

Cancel jobs that haven't started processing:

```typescript
const jobId = await queueClient.add('long-task', taskData)
// Remove if needed
await queueClient.remove('long-task', jobId)
```

### Job Retry

:::info
Not yet implemented
:::

Manually retry failed jobs:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

if (job.status === 'failed') {
  const newJobId = await queueClient.retry('email-queue', jobId)
  console.log('Job retried with new ID:', newJobId)
}
```
