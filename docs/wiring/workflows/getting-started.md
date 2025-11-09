# Getting Started with Workflows

This guide will walk you through setting up workflows in your Pikku project.

## Prerequisites

- A Pikku project with RPC and queue functionality set up
- An external state store (PostgreSQL or Redis)
- A queue service configured (see [Queue documentation](/docs/wiring/queue))

## Installation

```bash
# For PostgreSQL state storage
npm install @pikku/pg

# For Redis state storage
npm install @pikku/redis

# Queue service (if not already installed)
npm install @pikku/bullmq
# or
npm install @pikku/pg-boss
```

## Configuration

### 1. Add workflows to pikku.config.json

```json
{
  "workflows": {
    "singleQueue": true,
    "path": "src/workflows/pikku.workflows.gen.ts"
  }
}
```

### 2. Set up workflow state service

Add a `workflowService` service to your singleton services:

**PostgreSQL:**
```typescript
import { PgWorkflowService } from '@pikku/pg'

const workflowService = new PgWorkflowService(
  'workflow_schema', // schema name
  queueService
)
```

**Redis:**
```typescript
import { RedisWorkflowService } from '@pikku/redis'

const workflowService = new RedisWorkflowService(
  '.workflows', // key prefix
  queueService
)
```

### 3. Generate workflow types

```bash
npx pikku
```

## Example: User Onboarding Workflow

Here's the workflow from the templates showing all three step types:

```typescript
// From pikku-workflows/templates/functions/src/workflow.functions.ts
export const onboardingWorkflow = pikkuWorkflowFunc<
  { email: string; userId: string },
  { userId: string; email: string }
>(async ({ workflow }, data) => {
  // Step 1: RPC step - calls another Pikku function via queue worker
  const user = await workflow.do(
    `Create user profile in database for ${data.email}`,
    'createUserProfile',
    data
  )

  // Step 2: Inline step - executes immediately with caching
  const welcomeMessage = await workflow.do(
    'Generate personalized welcome message',
    async () => generateWelcomeMessage(user.email)
  )

  // Step 3: Sleep step - time-based delay
  await workflow.sleep('Sleeping for 5 minutes', '5min')

  // Step 4: RPC step - sends email via queue worker
  await workflow.do('Send welcome email to user', 'sendEmail', {
    to: data.email,
    subject: 'Welcome!',
    body: welcomeMessage,
  })

  return {
    userId: data.userId,
    email: data.email,
  }
})
```

Wire it:

```typescript
// From pikku-workflows/templates/functions/src/workflow.wiring.ts
wireWorkflow({
  name: 'onboarding',
  description: 'User onboarding workflow with email and profile setup',
  func: onboardingWorkflow,
  tags: ['onboarding', 'users'],
})
```

The execution mode (inline vs remote) is determined automatically based on whether a queue service is configured in your singleton services.

## Running Workflows

### Start workflow workers

```bash
npm run workers
```

The CLI generates queue workers for:
- `pikku-workflow-orchestrator` - Executes workflow functions
- `pikku-workflow-step-worker` - Executes RPC steps

### Trigger a workflow

```typescript
const runId = await rpc.startWorkflow('onboarding', {
  email: 'user@example.com',
  userId: 'user-123'
})
```

## Testing with Inline Mode

For testing, simply don't configure a queue service. When no queue service is available, workflows automatically run in inline mode:

```typescript
// In your services setup - don't include queueService for inline mode
export const createSingletonServices = async () => {
  const sql = postgres('postgresql://localhost:5432/myapp')

  const workflowService = new PgWorkflowService(
    sql,
    undefined, // No queue service = inline mode
    'workflows'
  )

  return {
    workflowService,
    // queueService: ... (omit for inline mode)
  }
}

// Wire workflow (same for both modes)
wireWorkflow({
  name: 'onboarding',
  func: onboardingWorkflow,
})
```

## Next Steps

- **[Step Types](./steps.md)**: Learn about RPC, inline, and sleep steps in detail
- **[Configuration](./configuration.md)**: Advanced configuration options
