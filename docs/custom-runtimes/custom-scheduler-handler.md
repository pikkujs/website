---
sidebar_position: 20
title: Custom Scheduler Runtime
image: /img/logos/custom-light.svg
hide_title: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

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

:::info
In the case of serverless, this is all that's actually needed, since the runtime is responsible for invoking the method.
:::

## Writing a Task Scheduler for servers

The rest of it is integrating it with your prefered cron library. The following is the implementation of the `PikkuTaskScheduler` provided for non-serverless invocation.

```typescript reference title="PikkuTaskScheduler"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/schedule/src/pikku-task-scheduler.ts
```