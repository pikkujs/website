---
sidebar_position: 2
title: Queue Registration
description: Learn how to wire queue functions to workers
---

<AIDisclaimer />

# Queue Registration

Queue registration is the process of connecting your queue functions to specific queue names and configuring how they should be processed. This is done using the `wireQueueWorker` function in your wiring files.

:::info
Different queues allow different configuration options. These are logged on start to inform the user what is/isn't supported. While it's a different approach, the ideal is that the developer/architect can provide different options depending on the system. For example, SQS and Postgres poll, while redis a pull notification system.
:::

## Basic Registration

The simplest way to register a queue worker:

```typescript
// email-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { sendWelcomeEmail } from './email-worker.functions.js'

wireQueueWorker({
  queueName: 'welcome-emails',
  func: sendWelcomeEmail
})
```

## Worker Configuration

You can configure worker behavior using the `config` parameter:

```typescript
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { processOrder } from './order-worker.functions.js'

wireQueueWorker({
  queueName: 'order-processing',
  func: processOrder,
  config: {
    concurrency: 3,           // Process up to 3 jobs simultaneously
    retries: 5,              // Retry failed jobs up to 5 times
    retryDelay: 30000,       // Wait 30 seconds between retries
    timeout: 300000,         // Timeout jobs after 5 minutes
    pollingInterval: 5000    // Poll for new jobs every 5 seconds
  }
})
```

## Configuration Options

### Concurrency

Controls how many jobs can be processed simultaneously:

```typescript
wireQueueWorker({
  queueName: 'high-throughput-queue',
  func: processHighThroughput,
  config: {
    concurrency: 10  // Process 10 jobs at once
  }
})

wireQueueWorker({
  queueName: 'resource-intensive-queue',
  func: processResourceIntensive,
  config: {
    concurrency: 1   // Process one job at a time
  }
})
```

### Retry Configuration

Configure how failed jobs are retried:

```typescript
wireQueueWorker({
  queueName: 'critical-jobs',
  func: processCriticalJob,
  config: {
    retries: 10,              // Retry up to 10 times
    retryDelay: 60000,        // Wait 1 minute between retries
    retryBackoff: 'exponential' // Exponential backoff: 1min, 2min, 4min...
  }
})

wireQueueWorker({
  queueName: 'simple-jobs',
  func: processSimpleJob,
  config: {
    retries: 3,               // Retry up to 3 times
    retryDelay: 5000,         // Wait 5 seconds between retries
    retryBackoff: 'linear'    // Linear backoff: 5s, 10s, 15s...
  }
})
```

### Timeout Configuration

Set job execution timeouts:

```typescript
wireQueueWorker({
  queueName: 'quick-jobs',
  func: processQuickJob,
  config: {
    timeout: 30000  // 30 second timeout
  }
})

wireQueueWorker({
  queueName: 'long-running-jobs',
  func: processLongRunningJob,
  config: {
    timeout: 1800000  // 30 minute timeout
  }
})
```

### Polling Configuration

Control how often the worker polls for new jobs:

```typescript
wireQueueWorker({
  queueName: 'real-time-queue',
  func: processRealTime,
  config: {
    pollingInterval: 1000  // Poll every second
  }
})

wireQueueWorker({
  queueName: 'batch-queue',
  func: processBatch,
  config: {
    pollingInterval: 30000  // Poll every 30 seconds
  }
})
```

## Multiple Workers for Same Queue

You can register multiple workers for the same queue with different configurations:

```typescript
// High-priority worker
wireQueueWorker({
  queueName: 'notifications',
  func: processNotification,
  config: {
    concurrency: 5,
    retries: 3,
    priority: 'high'
  }
})

// Low-priority worker for overflow
wireQueueWorker({
  queueName: 'notifications',
  func: processNotification,
  config: {
    concurrency: 2,
    retries: 1,
    priority: 'low'
  }
})
```

## Dead Letter Queue Configuration

Configure how failed jobs are handled:

```typescript
wireQueueWorker({
  queueName: 'payment-processing',
  func: processPayment,
  config: {
    retries: 3,
    deadLetterQueue: 'failed-payments',
    onFailure: 'move-to-dlq'  // Move failed jobs to dead letter queue
  }
})

// Worker for processing failed payments
wireQueueWorker({
  queueName: 'failed-payments',
  func: handleFailedPayment,
  config: {
    concurrency: 1,
    retries: 0  // Don't retry failed payment handling
  }
})
```

## Job-Level Configuration

You can also configure individual jobs when adding them to the queue:

```typescript
// In your application code
await queueService.add('email-queue', 
  { to: 'user@example.com', subject: 'Important' },
  {
    priority: 'high',
    delay: 5000,      // Wait 5 seconds before processing
    retries: 10,      // Override worker retry config
    timeout: 120000   // Override worker timeout config
  }
)
```

## Priority Queues

Set up priority-based processing:

```typescript
wireQueueWorker({
  queueName: 'mixed-priority-queue',
  func: processJob,
  config: {
    concurrency: 5,
    priorityOrder: 'desc'  // Process high priority jobs first
  }
})
```

## Scheduled Jobs

Register workers for scheduled/delayed jobs:

```typescript
wireQueueWorker({
  queueName: 'scheduled-tasks',
  func: processScheduledTask,
  config: {
    concurrency: 1,
    allowDelayed: true,      // Enable delayed job processing
    maxDelayTime: 86400000   // Max 24 hour delay
  }
})
```
