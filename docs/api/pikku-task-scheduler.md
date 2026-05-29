---
title: PikkuTaskScheduler
description: Run recurring scheduled tasks and one-off delayed RPCs at runtime
---

`PikkuTaskScheduler` is the in-memory scheduler service (exported as both
`PikkuTaskScheduler` and `InMemorySchedulerService` from `@pikku/schedule`). It
runs your wired scheduled tasks in-process and can schedule one-off delayed RPC
calls. Call `start()` to begin running recurring tasks and `stop()` to halt them
— useful for graceful shutdown.

:::note
For distributed/persistent scheduling backed by a queue (pg-boss, BullMQ), use
the scheduler service from `@pikku/queue-pg-boss` or `@pikku/queue-bullmq`
instead. They implement the same `SchedulerService` interface.
:::

## Methods

### `start()`

Starts all registered recurring scheduled tasks (those wired with
`wireScheduledTask`).

```typescript
const scheduler = new PikkuTaskScheduler()
await scheduler.start()
```

### `stop()`

Stops all running recurring scheduled tasks.

```typescript
await scheduler.stop()
```

### `scheduleRPC(delay, rpcName, data?, session?)`

Schedules a one-off RPC call after a delay. `delay` is either milliseconds or a
duration string like `'5h'` or `'30m'`. Returns the task ID.

```typescript
const taskId = await scheduler.scheduleRPC('30m', 'sendReminder', { userId })
```

### `unschedule(taskId)`

Cancels a scheduled one-off task by ID. Returns `true` if a task was removed.

```typescript
await scheduler.unschedule(taskId)
```

### `getTask(taskId)` / `getAllTasks()`

Inspect scheduled one-off tasks. `getTask` returns the full `ScheduledTaskInfo`
(or `null`); `getAllTasks` returns an array of `ScheduledTaskSummary`
(`{ taskId, rpcName, scheduledFor }`).

```typescript
const task = await scheduler.getTask(taskId)
const all = await scheduler.getAllTasks()
```

## Usage Example

```typescript
import { InMemorySchedulerService } from '@pikku/schedule'
import { PikkuExpressServer } from '@pikku/express'
import { createConfig, createSingletonServices } from './services.js'
import './.pikku/pikku-bootstrap.gen.js'

async function main() {
  const config = await createConfig()
  const singletonServices = await createSingletonServices(config)

  const server = new PikkuExpressServer(config, singletonServices.logger)
  await server.init()
  await server.start()

  const scheduler = new InMemorySchedulerService()
  await scheduler.start()

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await scheduler.stop()
    await server.stop()
    process.exit(0)
  })
}
```

## Source

```typescript reference title="in-memory-scheduler-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/schedule/src/in-memory-scheduler-service.ts
```
