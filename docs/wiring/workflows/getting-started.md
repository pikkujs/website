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

```typescript reference title="workflow.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/workflow.functions.ts
```

Wire it via HTTP:

```typescript reference title="workflow.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/workflow.wiring.ts
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
