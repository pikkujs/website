---
title: PikkuTaskScheduler
description: Start and stop scheduled tasks at runtime
---

`PikkuTaskScheduler` manages the lifecycle of your scheduled tasks at runtime. It lets you start and stop tasks individually or all at once — useful for graceful shutdown, staged startup, or running specific tasks in isolated deployments.

:::note
`PikkuTaskScheduler` works with task names as strings. Task names are determined by the export name of the function you wired with `wireScheduledTask`.
:::

## Methods

### `startAll()`

Starts all registered scheduled tasks.

```typescript
const scheduler = new PikkuTaskScheduler(singletonServices)
scheduler.startAll()
```

### `stopAll()`

Stops all running scheduled tasks.

```typescript
scheduler.stopAll()
```

### `start(names: string[])`

Starts specific tasks by name.

```typescript
scheduler.start(['sendDailyDigest', 'cleanupExpiredSessions'])
```

### `stop(names: string[])`

Stops specific tasks by name.

```typescript
scheduler.stop(['sendDailyDigest'])
```

## Usage Example

```typescript
import { PikkuTaskScheduler } from '@pikku/schedule'

async function main() {
  const config = await createConfig()
  const singletonServices = await createSingletonServices(config)

  const server = new PikkuExpressServer(config, singletonServices, createSessionServices)
  await server.init()
  await server.start()

  const scheduler = new PikkuTaskScheduler(singletonServices)
  scheduler.startAll()

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    scheduler.stopAll()
    await server.stop()
    process.exit(0)
  })
}
```

## Source

```typescript reference title="pikku-task-scheduler.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/schedule/src/pikku-task-scheduler.ts
```
