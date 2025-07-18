---
sidebar_position: 3
title: Queue Client
description: Master the type-safe queue client for adding and managing jobs
---

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

Cancel jobs that haven't started processing:

```typescript
const jobId = await queueClient.add('long-task', taskData)

// Cancel if needed
const cancelled = await queueClient.cancel('long-task', jobId)
if (cancelled) {
  console.log('Job cancelled successfully')
}
```

### Job Retry

Manually retry failed jobs:

```typescript
const job = await queueClient.getJob('email-queue', jobId)

if (job.status === 'failed') {
  const newJobId = await queueClient.retry('email-queue', jobId)
  console.log('Job retried with new ID:', newJobId)
}
```

### Job Removal

Remove completed or failed jobs:

```typescript
// Remove a specific job
await queueClient.remove('email-queue', jobId)

// Remove all completed jobs
await queueClient.clean('email-queue', 'completed', {
  olderThan: 24 * 60 * 60 * 1000  // Older than 24 hours
})
```

## Batch Operations

### Adding Multiple Jobs

Add multiple jobs at once:

```typescript
const jobs = [
  { to: 'user1@example.com', subject: 'Hello 1', body: 'Message 1' },
  { to: 'user2@example.com', subject: 'Hello 2', body: 'Message 2' },
  { to: 'user3@example.com', subject: 'Hello 3', body: 'Message 3' }
]

const jobIds = await queueClient.addBatch('email-queue', jobs)
console.log('Added jobs:', jobIds)
```

### Batch with Options

Add batch jobs with individual options:

```typescript
const batchJobs = [
  {
    data: { to: 'vip@example.com', subject: 'VIP Message', body: 'Priority message' },
    options: { priority: 'high' }
  },
  {
    data: { to: 'user@example.com', subject: 'Regular Message', body: 'Normal message' },
    options: { priority: 'normal' }
  }
]

const jobIds = await queueClient.addBatch('email-queue', batchJobs)
```

## Scheduled Jobs

### Delayed Jobs

Schedule jobs to run at a specific time:

```typescript
// Run in 1 hour
const oneHourLater = new Date(Date.now() + 60 * 60 * 1000)
const jobId = await queueClient.add('reminder-email', reminderData, {
  delay: oneHourLater
})

// Run every day at 9 AM
const jobId = await queueClient.add('daily-report', reportData, {
  repeat: {
    cron: '0 9 * * *'  // Daily at 9 AM
  }
})
```

### Recurring Jobs

Set up recurring jobs:

```typescript
// Send weekly newsletter
const jobId = await queueClient.add('newsletter', newsletterData, {
  repeat: {
    cron: '0 9 * * 1',  // Every Monday at 9 AM
    timezone: 'America/New_York'
  }
})

// Process reports every 15 minutes
const jobId = await queueClient.add('process-reports', {}, {
  repeat: {
    every: 15 * 60 * 1000  // Every 15 minutes
  }
})
```

## Queue Statistics

### Queue Information

Get queue statistics:

```typescript
const stats = await queueClient.getQueueStats('email-queue')

console.log('Queue stats:', {
  waiting: stats.waiting,
  active: stats.active,
  completed: stats.completed,
  failed: stats.failed,
  delayed: stats.delayed
})
```

### Job Counts

Get detailed job counts:

```typescript
const counts = await queueClient.getJobCounts('email-queue')

console.log('Job counts:', counts)
// { waiting: 5, active: 2, completed: 100, failed: 3, delayed: 1 }
```

## Error Handling

### Job Errors

Handle job failures gracefully:

```typescript
try {
  const jobId = await queueClient.add('risky-operation', riskData)
  const result = await queueClient.waitForCompletion('risky-operation', jobId)
  console.log('Success:', result)
} catch (error) {
  if (error.type === 'JobFailed') {
    console.error('Job failed:', error.message)
    console.error('Job error details:', error.jobError)
  } else if (error.type === 'JobTimeout') {
    console.error('Job timed out after:', error.timeout)
  }
}
```

### Connection Errors

Handle queue service connection issues:

```typescript
try {
  await queueClient.add('email-queue', emailData)
} catch (error) {
  if (error.type === 'ConnectionError') {
    console.error('Queue service unavailable:', error.message)
    // Implement fallback logic
  }
}
```

## Testing

### Mocking the Queue Client

Mock the queue client for testing:

```typescript
// email-service.test.ts
import { test } from 'node:test'
import { EmailService } from './email-service'

test('email service sends welcome email', async () => {
  const mockQueueClient = {
    add: async (queueName, data) => {
      assert.strictEqual(queueName, 'email-queue')
      assert.strictEqual(data.to, 'test@example.com')
      return 'job-123'
    }
  }
  
  const emailService = new EmailService(mockQueueClient)
  const jobId = await emailService.sendWelcomeEmail('test@example.com')
  
  assert.strictEqual(jobId, 'job-123')
})
```

### Integration Testing

Test with real queue services:

```typescript
// integration.test.ts
import { test, before, after } from 'node:test'
import { PikkuQueue } from './.pikku/pikku-queue.gen'
import { createBullMQService } from '@pikku/queue-bullmq'

let queueClient: PikkuQueue

before(async () => {
  const queueService = createBullMQService({
    redis: { host: 'localhost', port: 6379 }
  })
  queueClient = new PikkuQueue(queueService)
})

after(async () => {
  await queueClient.close()
})

test('can add and process job', async () => {
  const jobId = await queueClient.add('test-queue', { message: 'test' })
  
  const job = await queueClient.getJob('test-queue', jobId)
  assert.strictEqual(job.data.message, 'test')
})
```

## Best Practices

### 1. Use Job IDs for Deduplication

```typescript
// Prevent duplicate jobs
const jobId = await queueClient.add('user-sync', userData, {
  jobId: `user-sync-${userId}`  // Unique job ID
})
```

### 2. Handle Job Failures Gracefully

```typescript
const jobId = await queueClient.add('critical-task', taskData)

try {
  const result = await queueClient.waitForCompletion('critical-task', jobId)
  return result
} catch (error) {
  // Log error and potentially retry or alert
  logger.error('Critical task failed', { jobId, error })
  throw error
}
```

### 3. Clean Up Old Jobs

```typescript
// Clean up old jobs regularly
setInterval(async () => {
  await queueClient.clean('email-queue', 'completed', {
    olderThan: 7 * 24 * 60 * 60 * 1000  // 7 days
  })
}, 24 * 60 * 60 * 1000)  // Run daily
```

### 4. Monitor Queue Health

```typescript
async function monitorQueues() {
  const queues = ['email-queue', 'order-processing', 'notifications']
  
  for (const queueName of queues) {
    const stats = await queueClient.getQueueStats(queueName)
    
    if (stats.failed > 10) {
      console.warn(`High failure rate in ${queueName}:`, stats.failed)
    }
    
    if (stats.waiting > 1000) {
      console.warn(`High queue backlog in ${queueName}:`, stats.waiting)
    }
  }
}
```

## Next Steps

- [Examples](./examples) - See real-world queue usage patterns