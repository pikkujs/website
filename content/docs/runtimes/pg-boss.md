---
icon: queue
title: PG Boss
description: Using PG Boss with Pikku
hide_title: true
image: /img/logos/pg-boss-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

The pg-boss runtime provides PostgreSQL-based job queue processing with robust persistence, transactions, and reliability features.

## Live Example

import { Stackblitz } from '@site/src/components/Stackblitz';

<Stackblitz repo="template-pg-boss" initialFiles={['src/start.ts']} />

## Overview

pg-boss provides:
- **PostgreSQL-backed queues** for ACID-compliant job processing
- **Built-in persistence** with automatic table creation
- **Job retries** with configurable limits
- **Batch processing** for high-throughput scenarios
- **Graceful shutdown** with proper cleanup
- **Job results tracking** with full status monitoring

## Quick Start

### 1. Create a New Project

Create a new Pikku project with pg-boss support:

```bash
npm create pikku@latest
```

Select **pg-boss** as your runtime option during setup.

## Project Structure

After creating your project, you'll have these key files:

### Queue Worker Functions

Define your job processing logic (same as other queue systems):

Source: [`queue.functions.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/queue.functions.ts)

### Queue Worker Registration

Register workers with specific queues:

Source: [`queue.wiring.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/queue.wiring.ts)

### pg-boss Runtime Server

The main server that processes jobs using PostgreSQL:

Source: [`start.ts`](https://github.com/pikkujs/pikku/blob/main/templates/pg-boss/src/start.ts)

### Setup Guide

Complete setup instructions:

```markdown reference title="README.md"
https://github.com/pikkujs/pikku/blob/main/templates/pg-boss/README.md
```

## How It Works

1. **Database Connection**: Connects to PostgreSQL using `DATABASE_URL`
2. **Auto Schema**: Creates necessary tables automatically on startup
3. **Job Processing**: Polls PostgreSQL for new jobs and distributes to workers
4. **ACID Compliance**: All job operations are transactional

## Configuration

### Database Connection

Set your PostgreSQL connection string:

```bash
export DATABASE_URL="postgres://user:password@localhost:5432/your_database"
```

### Worker Configuration

Configure job processing behavior:
- **batchSize**: Number of jobs to process in parallel
- **pollInterval**: How often to poll for new jobs (milliseconds)

### Unsupported Options

Some configurations are managed by pg-boss internally:
- Worker names (uses queue names instead)
- Lock duration (handled by PostgreSQL)
- Visibility timeout (uses PostgreSQL locks)

## Database Requirements

- **PostgreSQL 9.5+** required
- **Automatic setup**: pg-boss creates tables on first run
- **No migrations needed**: Schema is managed automatically

## Job Processing

Queue workers are standard Pikku functions that:
- Accept typed job data from PostgreSQL
- Return typed results stored in the database
- Handle errors with automatic retries
- Support long-running operations with transaction safety

## Monitoring

pg-boss provides comprehensive monitoring:
- Job status in PostgreSQL tables
- Built-in job completion tracking
- Failed job inspection and retry
- Database-level monitoring with SQL queries

## Error Handling

Failed jobs are automatically retried with PostgreSQL-backed persistence:
- Configurable retry limits
- Exponential backoff support
- Dead letter queue functionality
- Full error logging and tracking

## PgBossServiceFactory API

The `PgBossServiceFactory` from `@pikku/queue-pg-boss` manages the lifecycle of all pg-boss components:

Import `PgBossServiceFactory` from `@pikku/queue-pg-boss`, construct it with your connection (`{ connectionString: process.env.DATABASE_URL }`), and `await pgBossFactory.init()`.

### Key Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getQueueService()` | `QueueService` | Publishes jobs to queues |
| `getQueueWorkers()` | `QueueWorkers` | Processes jobs from queues |
| `getSchedulerService()` | `SchedulerService` | Manages scheduled/recurring tasks |
| `init()` | `Promise<void>` | Initializes pg-boss and creates tables |
| `close()` | `Promise<void>` | Shuts down pg-boss gracefully |

### Worker Registration

Get the workers from the factory and call `registerQueues()`. The job runner is
wired automatically when you import the generated bootstrap, so no extra setup is
needed (build singleton services before registering so the logger is available):

Import the generated bootstrap, then call `registerQueues()` on `pgBossFactory.getQueueWorkers()`.

### Full Setup with Workflows

The full setup, in order:

1. Import the generated bootstrap, create a `PgBossServiceFactory` with `process.env.DATABASE_URL`, and `await pgBossFactory.init()`.
2. Create a `PikkuKysely` (from `@pikku/kysely-postgres`) with the logger and the same URL, and `await init()` on it.
3. Create a `PgKyselyLeaseService` over `pikkuKysely.kysely` and `init()` it. Then create a `PgKyselyWorkflowService` over the same Kysely instance with `{ leaseService }` and `init()` that too.
4. Get `schedulerService` from `pgBossFactory.getSchedulerService()`.
5. Call `createSingletonServices(config, ...)` with `queueService` (from `pgBossFactory.getQueueService()`), `schedulerService`, `leaseService` and `workflowService`.
6. Call `registerQueues()` on `pgBossFactory.getQueueWorkers()`. This includes the workflow queues.
7. Call `schedulerService.start()`.

### Graceful Shutdown

On `SIGTERM`, await `schedulerService.stop()`, then `pgBossFactory.close()`, then exit the process.

## Advantages

- **ACID Compliance**: Full transaction support
- **No External Dependencies**: Uses existing PostgreSQL infrastructure
- **Reliability**: Database-backed persistence
- **Monitoring**: Standard SQL queries for job inspection
- **Scalability**: Horizontal scaling with multiple workers