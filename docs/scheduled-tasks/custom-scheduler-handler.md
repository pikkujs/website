---
sidebar_position: 20
title: Writing your own Scheduler handler
---

The easiest way to write your own scheduler is by referencing the one already created.

The core of it is the following:

```typescript
import { getScheduledTasks, runScheduledTask } from '@pikku/core/scheduler'

const run = async (singletonServices: SingletonServices, name: string) => {
    const { scheduledTasks } = getScheduleTasks()
    await runScheduledTask({
        singletonServices: this.singletonServices,
        name,
    })
}
```

The rest of it is code to get it work on a cron timer:

```typescript reference title="PikkuTaskScheduler"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/packages/schedule/src/pikku-task-scheduler.ts
```