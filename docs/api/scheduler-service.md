---
title: SchedulerService
ai: true
---

The SchedulerService manages persistent scheduled tasks — recurring cron-wired tasks and one-off delayed RPC calls. It is registered as the `schedulerService` singleton service and backs the [Scheduled Tasks wiring](/docs/wiring/scheduled-tasks).

## Interface

```typescript reference title="scheduler-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/scheduler-service.ts
```

## Methods

### `scheduleRPC(delay: number | string, rpcName: string, data?: any, session?: CoreUserSession): Promise<string>`

Schedules a one-off delayed RPC call.

- **Parameters:**
  - `delay`: Delay before execution — milliseconds as a number, or a duration string like `'5h'` or `'30m'`
  - `rpcName`: RPC function name to invoke
  - `data` *(optional)*: Data to pass to the RPC function
  - `session` *(optional)*: User session to run the call under
- **Returns:** Promise resolving to the task ID

### `unschedule(taskId: string): Promise<boolean>`

Cancels a scheduled task by ID.

- **Returns:** Promise resolving to `true` if a task was removed

### `getTask(taskId: string): Promise<ScheduledTaskInfo | null>`

Retrieves a scheduled task with full details (`data`, `session`, `status`).

### `getAllTasks(): Promise<ScheduledTaskSummary[]>`

Lists all scheduled tasks as `{ taskId, rpcName, scheduledFor }` summaries.

### `start(): Promise<void>` / `stop(): Promise<void>`

Starts and stops the recurring tasks wired with `wireScheduler`. Implementations that don't run recurring tasks in-process leave these as no-ops.

### `init(): Promise<void>` / `close(): Promise<void>`

Lifecycle hooks — initialize the backend connection and close it on shutdown.

## Usage Example

```typescript
export const requestPasswordReset = pikkuFunc<{ email: string }, void>(
  async (services, data) => {
    await services.db.createResetToken(data.email)

    // Expire the token in 30 minutes
    await services.schedulerService.scheduleRPC('30m', 'expireResetToken', {
      email: data.email,
    })
  }
)
```

## Implementations

### InMemorySchedulerService (in-process)

Runs recurring tasks and delayed RPCs in-process — no persistence, tasks are lost on restart. See [InMemorySchedulerService](./pikku-task-scheduler) for full documentation.

```bash npm2yarn
npm install @pikku/schedule
```

```typescript
import { InMemorySchedulerService } from '@pikku/schedule'
const schedulerService = new InMemorySchedulerService()
```

### PgBossSchedulerService

Distributed, persistent scheduling backed by [pg-boss](https://github.com/timgit/pg-boss) (PostgreSQL).

```bash npm2yarn
npm install @pikku/queue-pg-boss
```

```typescript reference title="pg-boss-scheduler-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/queue-pg-boss/src/pg-boss-scheduler-service.ts
```

### BullSchedulerService

Distributed, persistent scheduling backed by [BullMQ](https://bullmq.io) (Redis).

```bash npm2yarn
npm install @pikku/queue-bullmq
```

```typescript reference title="bull-scheduler-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/queue-bullmq/src/bull-scheduler-service.ts
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  schedulerService: new InMemorySchedulerService(),
})
```
