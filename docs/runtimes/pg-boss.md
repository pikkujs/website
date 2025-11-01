---
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

```typescript reference title="queue-worker.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/queue-worker.functions.ts
```

### Queue Worker Registration

Register workers with specific queues:

```typescript reference title="queue-worker.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/queue-worker.wiring.ts
```

### pg-boss Runtime Server

The main server that processes jobs using PostgreSQL:

```typescript reference title="start.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/pg-boss/src/start.ts
```

### Setup Guide

Complete setup instructions:

```markdown reference title="README.md"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/pg-boss/README.md
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

## Advantages

- **ACID Compliance**: Full transaction support
- **No External Dependencies**: Uses existing PostgreSQL infrastructure
- **Reliability**: Database-backed persistence
- **Monitoring**: Standard SQL queries for job inspection
- **Scalability**: Horizontal scaling with multiple workers