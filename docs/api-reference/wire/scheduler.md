---
title: '#pikku/scheduler'
sidebar_label: '#pikku/scheduler'
sidebar_position: 7
description: 'Wires a function to a cron expression to run it on a schedule.'
---

# `#pikku/scheduler`

Wires a function to a cron expression to run it on a schedule.

```typescript
import { wireScheduler } from '#pikku/scheduler'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`wireScheduler`](#wirescheduler) | function | Registers a scheduled task with the Pikku framework. Tasks run based on cron expressions and are sessionless. |

## Reference

### `wireScheduler` {#wirescheduler}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a scheduled task with the Pikku framework.
Tasks run based on cron expressions and are sessionless.

```typescript
wireScheduler: (task: SchedulerWiring) => void
```

<details>
<summary>Config keys (5)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `func` <sup>required</sup> | `PikkuFunctionConfig<void, void, "rpc" \| "session">` | The function to run. It receives no session and no input: a scheduled task has no caller, so it must be sessionless. |
| `middleware` | `PikkuMiddleware[]` | Wraps every execution. There is no request to read from, so this is for tracing, locking and teardown rather than auth. |
| `name` <sup>required</sup> | `string` | Unique across the project. It is how the task is addressed in logs, in `pikku meta`, and by a scheduler service asked to run it now. |
| `schedule` <sup>required</sup> | `string` | A five-field cron expression: minute, hour, day of month, month, day of week. `0 9 * * 1` is 09:00 every Monday. Interpreted in the deployment's timezone, not the author's. |
| `tags` | `string[]` | Filters this task in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
wireScheduler({
  name: 'dailySalesReport',
  schedule: '0 6 * * *', // 06:00 UTC every day
  func: dailySalesReport,
  middleware: [timingMiddleware],
})

wireScheduler({
  name: 'cleanupAbandonedBaskets',
  schedule: '0 3 * * *', // 03:00 UTC every day
  func: cleanupAbandonedBaskets,
})
```

## Inside an addon

This door is application-only — there is no `#pikku/addon/scheduler`. Everything on it wires a function to the outside world, and that is the installing application's call, not the addon's. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.

---

Run `npx pikku doc scheduler` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
