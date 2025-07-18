---
sidebar_position: 3
title: Queue Client
description: Master the type-safe queue client for adding and managing jobs
---

<AIDisclaimer />


# Queue Client

The Pikku queue client provides a type-safe interface for adding jobs to queues, monitoring job status, and managing job lifecycles. It's automatically generated based on your queue function definitions.

## Generated Queue Client

When you run `npx pikku prebuild`, Pikku generates a type-safe queue client:

```typescript
// .pikku/pikku-queue.gen.ts
import { QueueService } from '@pikku/core'

export class PikkuQueue {
  constructor(private queueService: QueueService) {}
  
  // Type-safe methods for each registered queue
  async add<T extends keyof QueueJobMap>(
    queueName: T,
    data: QueueJobMap[T]['input'],
    options?: JobOptions
  ): Promise<string>
  
  async getJob<T extends keyof QueueJobMap>(
    queueName: T,
    jobId: string
  ): Promise<QueueJob<QueueJobMap[T]['output']>>
  
  // ... other methods
}
```

## Basic Usage

### Setting Up the Client

First, create a queue client with your chosen queue provider:

```typescript
// app.ts
import { PikkuQueue } from './.pikku/pikku-queue.gen'
import { createBullMQService } from '@pikku/queue-bullmq'

// Create queue service
const queueService = createBullMQService({
  redis: { host: 'localhost', port: 6379 }
})

// Create type-safe client
const queueClient = new PikkuQueue(queueService)
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
    priority: 'high',        // Job priority
    delay: 5000,            // Wait 5 seconds before processing
    retries: 5,             // Retry up to 5 times
    timeout: 60000,         // Timeout after 1 minute
    jobId: 'unique-job-1'   // Custom job ID
  }
)
```

## Job Monitoring

### Getting Job Status

Retrieve job information and status:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

console.log('Job status:', job.status)
console.log('Job data:', job.data)
console.log('Job result:', job.result)
console.log('Job progress:', job.progress)
```

### Job States

Jobs can be in one of several states:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

switch (job.status) {
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
    console.log('Job failed:', job.error)
    break
  case 'delayed':
    console.log('Job is delayed until:', job.delayedUntil)
    break
}
```

### Waiting for Completion

Wait for a job to complete:

```typescript
const jobId = await queueClient.add('order-processing', orderData)

try {
  const result = await queueClient.waitForCompletion('order-processing', jobId, {
    timeout: 60000  // Wait up to 1 minute
  })
  
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
