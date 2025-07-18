---
sidebar_position: 12
title: Background Queues
description: Process background jobs with reliable message delivery
---

# Background Queues

Background queues allow you to process jobs asynchronously, providing reliable message delivery, retry logic, and concurrency control. This is essential for tasks that don't need immediate responses or require heavy processing.

## Overview

Pikku's queue system provides a unified interface for background job processing across different queue providers. Whether you're using Redis, PostgreSQL, or cloud-based queues, Pikku abstracts the complexity while maintaining type safety and performance.

### Key Features

- **Type-safe job processing** - Full TypeScript support for job data and results
- **Multiple queue providers** - Support for BullMQ, pg-boss, and AWS SQS
- **Automatic retries** - Configurable retry logic with exponential backoff
- **Job scheduling** - Delayed and scheduled job execution
- **Concurrency control** - Control how many jobs run simultaneously
- **Job monitoring** - Track job progress and results
- **Dead letter queues** - Handle failed jobs gracefully

## Quick Start

### 1. Declare a Queue Function

Queue functions are regular Pikku functions that process background jobs:

```typescript
// queue-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

export const processEmail = pikkuSessionlessFunc<
  { to: string; subject: string; body: string },
  { messageId: string }
>(async (context, data) => {
  // Process the email
  const messageId = await sendEmail(data.to, data.subject, data.body)
  return { messageId }
})
```

### 2. Register the Queue Worker

Wire your function to a queue name:

```typescript
// queue-worker.routes.ts
import { addQueueWorker } from '@pikku/core'
import { processEmail } from './queue-worker.functions'

addQueueWorker({
  queueName: 'email-queue',
  func: processEmail,
  config: {
    concurrency: 5,
    retries: 3
  }
})
```

### 3. Use the Queue Client

Add jobs to the queue from your application:

```typescript
// In your application code
import { PikkuQueue } from './.pikku/pikku-queue.gen'

const queueService = new PikkuQueue(queueProvider)

// Add a job to the queue
const jobId = await queueService.add('email-queue', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up!'
})

// Get job status
const job = await queueService.getJob('email-queue', jobId)
const result = await job.waitForCompletion?.()
```

## Core Concepts

### Queue Functions

Queue functions are standard Pikku functions that process individual jobs. They receive:
- **Context**: Standard Pikku context (services, logger, etc.)
- **Data**: Type-safe job payload

### Queue Workers

Workers are the bridge between your functions and the queue system. They:
- Poll for new jobs
- Execute your function for each job
- Handle retries and error recovery
- Report job completion status

### Queue Providers

Pikku supports multiple queue backends:
- **BullMQ** - Redis-based queues with advanced features
- **pg-boss** - PostgreSQL-based queues with ACID guarantees
- **AWS SQS** - Cloud-native queues with serverless scaling
