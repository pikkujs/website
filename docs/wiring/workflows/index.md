# Getting Started

Build reliable, multi-step processes that survive failures and resume automatically. Workflows turn your TypeScript functions into durable operations with built-in state management, retries, and time delays.

## Quick Example

```typescript
import { pikkuWorkflowFunc } from '.pikku/workflow/pikku-workflow-types.gen'

export const onboardingWorkflow = pikkuWorkflowFunc<
  { email: string; userId: string },
  { success: boolean }
>(async ({ workflow }, data) => {
  // Step 1: Call another function via queue
  await workflow.do('Create user profile', 'createUserProfile', data)

  // Step 2: Execute code immediately
  const message = await workflow.do(
    'Generate welcome message',
    async () => `Welcome, ${data.email}!`
  )

  // Step 3: Wait 5 minutes
  await workflow.sleep('Wait before email', '5min')

  // Step 4: Send email
  await workflow.do('Send welcome email', 'sendEmail', {
    to: data.email,
    message
  })

  return { success: true }
})
```

## Try It Live

Get started with a working workflow example:

- **[PostgreSQL (pg-boss)](https://github.com/vramework/pikku/tree/main/pikku/templates/workflows-pg-boss)** - Workflows backed by PostgreSQL
- **[Redis (BullMQ)](https://github.com/vramework/pikku/tree/main/pikku/templates/workflows-bullmq)** - Workflows backed by Redis

Or create a new project:

```bash
npm create pikku@latest -- --template workflows-pg
```

## Three Types of Steps

### 1. RPC Steps - Call Functions via Queue

Execute other Pikku functions as separate queue jobs:

```typescript
const user = await workflow.do(
  'Create user in database',
  'createUserProfile',  // RPC function name
  { email: data.email }
)
```

**Best for**: Database operations, external API calls, CPU-intensive tasks

### 2. Inline Steps - Execute Immediately

Run code inline with automatic caching:

```typescript
const message = await workflow.do(
  'Generate personalized message',
  async () => {
    return `Welcome to our platform, ${user.email}!`
  }
)
```

**Best for**: Fast operations, external API calls, data transformations

### 3. Sleep Steps - Time Delays

Pause workflow execution for minutes, hours, or days:

```typescript
await workflow.sleep('Wait 7 days for trial', '7d')
await workflow.sleep('Wait 5 minutes', '5min')
await workflow.sleep('Wait 30 seconds', '30s')
```

**Best for**: Trial periods, reminder emails, rate limiting

## Retry Configuration

Both RPC and inline steps support automatic retries:

```typescript
// Retry up to 3 times with 5 second delays
const payment = await workflow.do(
  'Process payment',
  'processPayment',
  { amount: 100 },
  {
    retries: 3,       // Number of retry attempts (default: 0)
    retryDelay: '5s'  // Delay between retries (default: 0)
  }
)

// Inline step with retries
const apiData = await workflow.do(
  'Fetch from external API',
  async () => externalApi.getData(),
  {
    retries: 2,
    retryDelay: '3s'
  }
)
```

## Setup

### 1. Install Dependencies

```bash
# For PostgreSQL
npm install @pikku/pg @pikku/queue-pg-boss postgres

# For Redis
npm install @pikku/redis @pikku/queue-bullmq
```

### 2. Configure Workflow Service

**PostgreSQL:**
```typescript
import { PgBossServiceFactory } from '@pikku/queue-pg-boss'
import { PgWorkflowService } from '@pikku/pg'
import postgres from 'postgres'

const pgBossFactory = new PgBossServiceFactory(process.env.DATABASE_URL)
await pgBossFactory.init()

const workflowService = new PgWorkflowService(postgres(process.env.DATABASE_URL))
await workflowService.init()

const singletonServices = await createSingletonServices(config, {
  queueService: pgBossFactory.getQueueService(),
  schedulerService: pgBossFactory.getSchedulerService(),
  workflowService,
})
```

**Redis:**
```typescript
import { BullServiceFactory } from '@pikku/queue-bullmq'
import { RedisWorkflowService } from '@pikku/redis'

const bullFactory = new BullServiceFactory()
await bullFactory.init()

const workflowService = new RedisWorkflowService(undefined)

const singletonServices = await createSingletonServices(config, {
  queueService: bullFactory.getQueueService(),
  schedulerService: bullFactory.getSchedulerService(),
  workflowService,
})
```

### 3. Wire Your Workflow

```typescript
import { wireWorkflow } from '.pikku/workflow/pikku-workflow-types.gen'

wireWorkflow({
  name: 'onboarding',
  description: 'User onboarding workflow',
  func: onboardingWorkflow,
})
```

### 4. Start a Workflow

```typescript
const { runId } = await rpc.startWorkflow('onboarding', {
  email: 'user@example.com',
  userId: 'user-123'
})
```

## Next Steps

- **[How Workflows Work](./overview.md)** - Deep dive into execution models, deterministic replay, and queue interactions
