---
title: BullMQ
description: Using BullMQ with Pikku
hide_title: true
image: /img/logos/bullmq-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

The BullMQ runtime allows you to process background jobs using Redis-backed queues with robust job processing capabilities.

## Live Example

import { Stackblitz } from '@site/src/components/Stackblitz';

<Stackblitz repo="template-bullmq" initialFiles={['src/start.ts']} />

## Overview

BullMQ provides:
- **Redis-backed queues** for reliable job processing
- **Job scheduling** with delays and repeatable jobs
- **Job retries** with exponential backoff
- **Queue monitoring** and job status tracking
- **Concurrency control** for parallel job processing

## Quick Start

### 1. Create a New Project

Create a new Pikku project with BullMQ support:

```bash
npm create pikku@latest
```

Select **BullMQ** as your runtime option during setup.

## Project Structure

After creating your project, you'll have these key files:

### Queue Worker Functions

Define your job processing logic:

```typescript reference title="queue-worker.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/queue-worker.functions.ts
```

### Queue Worker Registration

Register workers with specific queues:

```typescript reference title="queue-worker.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/queue-worker.wiring.ts
```

### BullMQ Runtime Server

The main server that processes jobs:

```typescript reference title="start.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/bullmq/src/start.ts
```

## How It Works

1. **Define Workers**: Create functions that process specific job types
2. **Register Queues**: Associate workers with named queues
3. **Start Runtime**: The BullMQ server connects to Redis and processes jobs
4. **Job Processing**: Jobs are automatically distributed to available workers

## Configuration

### Redis Connection

BullMQ requires a Redis instance. Configure the connection in your environment or directly in the BullQueueService initialization.

### Queue Options

Configure queue behavior:
- **Concurrency**: Number of jobs processed simultaneously
- **Job retries**: Number of retry attempts for failed jobs
- **Job delays**: Schedule jobs for future execution
- **Queue priorities**: Process high-priority jobs first

## Job Processing

Queue workers are standard Pikku functions that:
- Accept typed job data as input
- Return typed results
- Handle errors with automatic retries
- Support long-running operations

## Monitoring

BullMQ provides built-in monitoring capabilities:
- Job status tracking (waiting, active, completed, failed)
- Queue metrics and statistics
- Failed job inspection and retry
- Real-time queue monitoring

## BullServiceFactory API

The `BullServiceFactory` from `@pikku/queue-bullmq` manages the lifecycle of all BullMQ components:

```typescript
import { BullServiceFactory } from '@pikku/queue-bullmq'

const bullFactory = new BullServiceFactory({
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
})
```

### Key Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getQueueService()` | `QueueService` | Publishes jobs to queues |
| `getQueueWorkers()` | `QueueWorkers` | Processes jobs from queues |
| `getSchedulerService()` | `SchedulerService` | Manages scheduled/recurring tasks |

### Worker Registration

Use `registerQueueWorkers()` to set up workers with the factory:

```typescript
import { registerQueueWorkers } from '@pikku/core/queue'

const queueWorkers = bullFactory.getQueueWorkers()
registerQueueWorkers(queueWorkers, singletonServices, createWireServices)
```

### Scheduler Handlers

For scheduled tasks, use `createSchedulerRuntimeHandlers()`:

```typescript
import { createSchedulerRuntimeHandlers } from '@pikku/core/scheduler'

const schedulerHandlers = createSchedulerRuntimeHandlers(
  singletonServices,
  createWireServices
)

const schedulerService = bullFactory.getSchedulerService()
schedulerService.setHandlers(schedulerHandlers)
await schedulerService.start()
```

### Full Setup with Workflows

```typescript
import { BullServiceFactory } from '@pikku/queue-bullmq'
import { registerQueueWorkers } from '@pikku/core/queue'
import { createSchedulerRuntimeHandlers } from '@pikku/core/scheduler'

const bullFactory = new BullServiceFactory({
  redisUrl: process.env.REDIS_URL!,
})

const singletonServices = await createSingletonServices(config, {
  queueService: bullFactory.getQueueService(),
})

// Register queue workers
const queueWorkers = bullFactory.getQueueWorkers()
registerQueueWorkers(queueWorkers, singletonServices, createWireServices)

// Set up scheduler
const schedulerHandlers = createSchedulerRuntimeHandlers(
  singletonServices,
  createWireServices
)
const schedulerService = bullFactory.getSchedulerService()
schedulerService.setHandlers(schedulerHandlers)
await schedulerService.start()
```

### Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  await schedulerService.stop()
  await queueWorkers.close()
  process.exit(0)
})
```

## Error Handling

Failed jobs are automatically retried based on configuration. Use proper error handling in your worker functions to distinguish between retryable and non-retryable errors.