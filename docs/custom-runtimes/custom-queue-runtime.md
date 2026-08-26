---
title: Custom Queue Runtime
image: /img/logos/custom-light.svg
hide_title: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Creating a custom queue runtime in Pikku involves implementing two classes: `QueueService` for job publishing and `QueueWorkers` for job processing. Here's how to build one using pg-boss as an example.

## Implementation Pattern

### 1. Create Your QueueService Implementation

Handle job publishing and retrieval:

```typescript reference title="PgBossQueueService"
https://github.com/pikkujs/pikku/blob/main/packages/services/queue-pg-boss/src/pg-boss-queue-service.ts
```

### 2. Create Your QueueWorkers Implementation

Handle job processing and worker lifecycle:

```typescript reference title="PgBossQueueWorkers"
https://github.com/pikkujs/pikku/blob/main/packages/services/queue-pg-boss/src/pg-boss-queue-worker.ts
```

### 3. Create Mapping Utilities

Convert between Pikku types and your queue library:

```typescript reference title="pg-boss Utils"
https://github.com/pikkujs/pikku/blob/main/packages/services/queue-pg-boss/src/utils.ts
```

## Key Implementation Requirements

### Job Execution

All queue implementations must call `runQueueJob()` to execute jobs:

```typescript
import { runQueueJob } from '@pikku/core/queue'

// In your worker processor — singleton services are resolved
// from Pikku's global state (set up by the bootstrap import)
await runQueueJob({
  job,            // QueueJob: { id, queueName, data, ... }
  updateProgress, // optional: report progress back to the queue
})
```

### Worker Registration

Use the registration helper to validate and register workers:

```typescript reference title="Queue Registration Helper"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/wirings/queue/register-queue-helper.ts
```

### Configuration Mapping

Define supported and unsupported configurations:

```typescript
import type { QueueConfigMapping } from '@pikku/core/queue'

const configMappings: QueueConfigMapping = {
  supported: {
    batchSize: {
      queueProperty: 'batchSize',
      description: 'Number of jobs to fetch and process concurrently',
    },
    pollInterval: {
      queueProperty: 'pollingIntervalSeconds',
      transform: (value: number) => Math.round(value / 1000),
      description: 'How often to poll for new jobs (converted from ms to seconds)',
    },
  },
  unsupported: {
    lockDuration: {
      reason: 'Lock duration is managed differently in pg-boss',
      explanation: 'pg-boss uses job-level expiration instead of worker-level locks',
    },
  },
  fallbacks: {},
}
```