# BullMQ Runtime

The BullMQ runtime allows you to process background jobs using Redis-backed queues with robust job processing capabilities.

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
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/templates/functions/src/queue-worker.functions.ts
```

### Queue Worker Registration

Register workers with specific queues:

```typescript reference title="queue-worker.routes.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/templates/functions/src/queue-worker.routes.ts
```

### BullMQ Runtime Server

The main server that processes jobs:

```typescript reference title="start.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/templates/bullmq/src/start.ts
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

## Error Handling

Failed jobs are automatically retried based on configuration. Use proper error handling in your worker functions to distinguish between retryable and non-retryable errors.