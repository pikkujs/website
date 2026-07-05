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

const run = async (name: string) => {
    const scheduledTasks = getScheduledTasks()
    await runScheduledTask({ name })
}
```

:::info
In the case of serverless, this is all that's actually needed, since the runtime is responsible for invoking the method.
:::

## Writing a Task Scheduler for servers

The rest of it is integrating it with your prefered cron library. The following is the implementation of the `InMemorySchedulerService` provided for non-serverless invocation.

```typescript reference title="InMemorySchedulerService"
https://github.com/pikkujs/pikku/blob/main/packages/schedule/src/in-memory-scheduler-service.ts
```