---
sidebar_position: 12
title: Background Queues
description: Process background jobs with reliable message delivery
---

# Background Queues

Background queues allow you to process jobs asynchronously, providing reliable message delivery, retry logic, and concurrency control. This is essential for tasks that don't need immediate responses or require heavy processing.

## Overview

Pikku's queue system provides:
- Reliable job processing with retry mechanisms
- Dead letter queue support
- Concurrency control
- Priority queues
- Type-safe job definitions
- Cross-runtime compatibility

## Creating Queue Processors

Queue processors are functions that handle background jobs:

```typescript
import { pikkuSessionlessFunc } from '@pikku/core'
import { addQueueProcessor } from '@pikku/queue'

export const processEmailQueue = pikkuSessionlessFunc<
  { to: string; subject: string; body: string },
  { messageId: string; status: 'sent' | 'failed' }
>(async ({ logger, emailService }, data) => {
  try {
    const messageId = await emailService.send({
      to: data.to,
      subject: data.subject,
      body: data.body
    })
    
    logger.info(`Email sent successfully: ${messageId}`)
    
    return { messageId, status: 'sent' }
  } catch (error) {
    logger.error('Failed to send email:', error)
    throw error // Will trigger retry logic
  }
})

addQueueProcessor({
  name: 'email-queue',
  func: processEmailQueue,
  concurrency: 5,
  retryOptions: {
    attempts: 3,
    backoff: 'exponential',
    delay: 1000,
  },
  deadLetterQueue: 'email-dlq'
})
```

## Enqueuing Jobs

Add jobs to queues from your application:

```typescript
import { queueJob } from '@pikku/queue'

// From an HTTP endpoint
export const sendWelcomeEmail = pikkuFunc<
  { userId: string },
  { queued: boolean }
>(async ({ logger, userService }, { userId }) => {
  const user = await userService.findById(userId)
  
  await queueJob('email-queue', {
    to: user.email,
    subject: 'Welcome to our platform!',
    body: `Hello ${user.name}, welcome aboard!`
  })
  
  return { queued: true }
})
```

## Queue Configuration

Configure queue behavior with detailed options:

```typescript
addQueueProcessor({
  name: 'image-processing',
  func: processImageQueue,
  
  // Concurrency settings
  concurrency: 3,
  maxConcurrency: 10,
  
  // Retry configuration
  retryOptions: {
    attempts: 5,
    backoff: 'exponential',
    delay: 2000,
    maxDelay: 60000,
    factor: 2
  },
  
  // Queue settings
  priority: 10,
  delay: 0,
  timeout: 300000, // 5 minutes
  
  // Error handling
  deadLetterQueue: 'image-processing-dlq',
  maxStalledCount: 3,
  
  // Monitoring
  metrics: true,
  events: ['completed', 'failed', 'stalled']
})
```

## Advanced Job Processing

### Job with Progress Tracking

```typescript
export const processLargeDataset = pikkuSessionlessFunc<
  { datasetId: string; options: ProcessingOptions },
  { processed: number; total: number; result?: any }
>(async ({ logger, dataService, progress }, { datasetId, options }) => {
  const dataset = await dataService.load(datasetId)
  const total = dataset.length
  
  let processed = 0
  const results = []
  
  for (const item of dataset) {
    const result = await processItem(item, options)
    results.push(result)
    processed++
    
    // Update progress
    await progress.update({
      processed,
      total,
      percentage: Math.round((processed / total) * 100)
    })
    
    logger.info(`Processed ${processed}/${total} items`)
  }
  
  return {
    processed,
    total,
    result: results
  }
})
```

### Batch Processing

```typescript
export const processBatch = pikkuSessionlessFunc<
  Array<{ id: string; data: any }>,
  Array<{ id: string; status: 'success' | 'failed'; result?: any; error?: string }>
>(async ({ logger }, items) => {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        const result = await processItem(item.data)
        return { id: item.id, status: 'success', result }
      } catch (error) {
        return { id: item.id, status: 'failed', error: error.message }
      }
    })
  )
  
  return results.map((result, index) => 
    result.status === 'fulfilled' 
      ? result.value 
      : { id: items[index].id, status: 'failed', error: 'Processing failed' }
  )
})

addQueueProcessor({
  name: 'batch-processor',
  func: processBatch,
  batch: {
    size: 10,
    timeout: 30000
  }
})
```

## Runtime Support

Background queues work across different runtime environments:

| Runtime | Support | Implementation |
|---------|---------|---------------|
| AWS Lambda | ✅ | SQS integration |
| Express | ✅ | Bull/BullMQ queues |
| Fastify | ✅ | Bull/BullMQ queues |
| Cloudflare Workers | ✅ | Queue API |
| Custom | ✅ | Pluggable adapters |

### AWS SQS Configuration

```typescript
import { SQSQueueAdapter } from '@pikku/aws-queue'

const queueAdapter = new SQSQueueAdapter({
  queueUrl: process.env.SQS_QUEUE_URL,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})
```

### Bull/Redis Configuration

```typescript
import { BullQueueAdapter } from '@pikku/bull-queue'

const queueAdapter = new BullQueueAdapter({
  redis: {
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50
  }
})
```

## Queue Monitoring

Monitor queue performance and health:

```typescript
import { QueueMonitor } from '@pikku/queue-monitor'

const monitor = new QueueMonitor({
  queues: ['email-queue', 'image-processing'],
  metrics: {
    throughput: true,
    latency: true,
    errorRate: true,
    queueSize: true
  }
})

// Get queue statistics
const stats = await monitor.getStats('email-queue')
console.log({
  waiting: stats.waiting,
  active: stats.active,
  completed: stats.completed,
  failed: stats.failed,
  throughputPerMinute: stats.throughput
})
```

## Error Handling and Retries

Implement robust error handling:

```typescript
export const resilientProcessor = pikkuSessionlessFunc<
  { task: string; payload: any },
  { success: boolean; attempts: number; error?: string }
>(async ({ logger, attempt }, { task, payload }) => {
  const maxAttempts = 3
  
  try {
    // Attempt processing
    const result = await processTask(task, payload)
    
    logger.info(`Task ${task} completed on attempt ${attempt}`)
    return { success: true, attempts: attempt }
    
  } catch (error) {
    logger.error(`Task ${task} failed on attempt ${attempt}:`, error)
    
    if (attempt >= maxAttempts) {
      // Final failure - send to dead letter queue
      throw new Error(`Task failed after ${maxAttempts} attempts: ${error.message}`)
    }
    
    // Temporary failure - will retry
    throw error
  }
})
```

## Job Scheduling

Schedule jobs for future execution:

```typescript
// Schedule a job for specific time
await queueJob('email-queue', emailData, {
  delay: 60000, // 1 minute delay
  priority: 10
})

// Schedule recurring jobs
await queueJob('cleanup-task', {}, {
  repeat: {
    cron: '0 2 * * *' // Daily at 2 AM
  }
})
```

## Best Practices

1. **Idempotency**: Make jobs idempotent to handle retries safely
2. **Timeouts**: Set appropriate timeouts for different job types
3. **Dead Letter Queues**: Always configure DLQs for failed jobs
4. **Monitoring**: Monitor queue health and performance metrics
5. **Resource Management**: Properly manage database connections and external resources
6. **Error Classification**: Distinguish between retryable and non-retryable errors

## Testing Queue Processors

```typescript
import { testQueueProcessor } from '@pikku/testing'

describe('Email Queue Processor', () => {
  it('should process email successfully', async () => {
    const result = await testQueueProcessor(processEmailQueue, {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test message'
    })
    
    expect(result.status).toBe('sent')
    expect(result.messageId).toBeDefined()
  })
  
  it('should handle failures with retry', async () => {
    const result = await testQueueProcessor(processEmailQueue, {
      to: 'invalid-email',
      subject: 'Test',
      body: 'Test message'
    }, {
      expectFailure: true,
      maxRetries: 2
    })
    
    expect(result.attempts).toBe(3) // Initial + 2 retries
  })
})
```

Background queues provide a robust foundation for building scalable, resilient applications that can handle high volumes of background processing efficiently.