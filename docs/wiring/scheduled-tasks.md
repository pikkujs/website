---
sidebar_position: 0
title: Scheduled Tasks
description: Run periodic background jobs with cron
---

# Scheduled Tasks

Scheduled tasks (cron jobs) let you run code on a regular schedule - daily reports, weekly cleanups, hourly health checks, or any time-based operation. Your functions work the same whether they're triggered by a runtime scheduler (Azure Timer, AWS EventBridge) or by the `@pikku/scheduler` package.

Your domain functions don't need to know they're being called by a scheduler. They just run on schedule and do their work. Pikku handles all the scheduling details.

## Your First Scheduled Task

Here's a scheduled task example from the templates — a daily summary and a weekly cleanup:

```typescript reference title="scheduled.functions.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/functions/scheduled.functions.ts
```

```typescript reference title="scheduled.wiring.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/scheduled.wiring.ts
```

That's it! Your functions will now run on their configured schedules.

:::note
If triggered by a serverless function like Lambda or Azure Timer, the platform's scheduler overrides this cron setting. The cron in `wireScheduler` is only for in-process scheduling (using `@pikku/scheduler`).
:::

## Scheduled Functions

Scheduled functions use `pikkuVoidFunc` (an alias for `pikkuSessionlessFunc<void, void>`) since they:
- Don't receive any input data
- Don't return any output
- Don't have user sessions

```typescript
import { pikkuVoidFunc } from '#pikku'

export const generateWeeklyReport = pikkuVoidFunc({
  func: async ({ database, emailService, logger }) => {
    logger.info('Generating weekly report')

    const stats = await database.query('SELECT * FROM weekly_stats')

    await emailService.send({
      to: 'admin@example.com',
      subject: 'Weekly Report',
      template: 'weekly-report',
      data: stats
    })

    logger.info('Weekly report sent')
  },
  auth: false,
  title: 'Generate and send weekly report',
  tags: ['reports']
})
```

:::tip Triggering Manually
Since scheduled functions are just regular Pikku functions, you can also wire them to HTTP endpoints for manual triggering during testing or emergencies:

```typescript
wireHTTP({
  method: 'post',
  route: '/admin/trigger-maintenance',
  func: runDailyMaintenance,
  permissions: { admin: requireAdmin }
})
```
:::

## Cron Expressions

Cron expressions use the standard 5-field format:

```
┌────────────── minute (0-59)
│ ┌──────────── hour (0-23)
│ │ ┌────────── day of month (1-31)
│ │ │ ┌──────── month (1-12)
│ │ │ │ ┌────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

Common examples:

```typescript
// Every 5 minutes
wireScheduler({
  schedule:'*/5 * * * *',
  func: healthCheck
})

// Every hour at minute 30
wireScheduler({
  schedule:'30 * * * *',
  func: hourlyUpdate
})

// Every day at 2:30 AM
wireScheduler({
  schedule:'30 2 * * *',
  func: dailyBackup
})

// Every Monday at 9:00 AM
wireScheduler({
  schedule:'0 9 * * 1',
  func: weeklyReport
})

// First day of every month at midnight
wireScheduler({
  schedule:'0 0 1 * *',
  func: monthlyBilling
})
```

:::note Timezone
Cron expressions are interpreted as **UTC** by default (unless your runtime specifies otherwise). Make sure to account for timezone differences when scheduling tasks.
:::

## Configuration

### Basic Wiring

```typescript
import { wireScheduler } from '#pikku/scheduler'
import { runMaintenance } from './functions/maintenance.function.js'

wireScheduler({
  // Required
  schedule:'0 3 * * *',
  func: runMaintenance,

  // Optional
  middleware: [loggingMiddleware],
  tags: ['maintenance', 'critical']
})
```

### Sourcing Schedule from Config

For different schedules across environments:

```typescript
import { wireScheduler } from '#pikku/scheduler'
import { config } from './config.js'
import { runBackup } from './functions/backup.function.js'

wireScheduler({
  schedule: config.backupSchedule,  // '0 2 * * *' in prod, '0 */4 * * *' in dev
  func: runBackup
})
```

## Middleware

Middleware is important for scheduled tasks since they don't have automatic observability. Add logging, metrics, or error handling:

```typescript
import { pikkuMiddleware } from '#pikku'

export const schedulerMetrics = pikkuMiddleware(
  async ({ logger }, { scheduledTask }, next) => {
    // Guard for scheduled task interaction
    if (!scheduledTask) {
      throw new InvalidMiddlewareInteractionError(
        'schedulerMetrics middleware can only be used with scheduled tasks'
      )
    }

    const start = Date.now()
    const taskName = scheduledTask.name

    logger.info('Scheduled task started', { task: taskName })

    try {
      await next()
      logger.info('Scheduled task completed', {
        task: taskName,
        duration: Date.now() - start
      })
    } catch (error) {
      logger.error('Scheduled task failed', {
        task: taskName,
        error: error.message,
        duration: Date.now() - start
      })
      throw error
    }
  }
)
```

### Per-Schedule Middleware

```typescript
wireScheduler({
  schedule:'0 3 * * *',
  func: runMaintenance,
  middleware: [schedulerMetrics, retryMiddleware]
})
```

### Global Middleware

Apply middleware to all scheduled tasks:

```typescript
import { addSchedulerMiddleware } from '#pikku/scheduler'

addSchedulerMiddleware([schedulerMetrics, alertMiddleware])
```

## Error Handling

Scheduled tasks should throw errors for failures. How errors are handled depends on your runtime:

```typescript
export const syncData = pikkuVoidFunc({
  func: async ({ database, externalAPI, logger }) => {
    try {
      const data = await externalAPI.fetch()
      await database.insert('synced_data', data)
      logger.info('Data synced successfully')
    } catch (error) {
      logger.error('Data sync failed', { error: error.message })

      // Throw to indicate failure
      throw new DataSyncError(error.message)
    }
  },
  auth: false,
  title: 'Sync external data',
  tags: ['sync']
})
```

Some runtimes automatically retry failed scheduled tasks, while others require middleware or external retry logic.

## Grouping Multiple Schedules

You can wire multiple schedules in a single file:

```typescript
// housekeeping.schedule.ts
import { wireScheduler } from '#pikku/scheduler'
import {
  cleanupOldLogs,
  updateStatistics,
  archiveOldData,
  refreshCache
} from './functions/housekeeping.function.js'

// Every hour - cleanup logs
wireScheduler({
  schedule:'0 * * * *',
  func: cleanupOldLogs
})

// Every 6 hours - update stats
wireScheduler({
  schedule:'0 */6 * * *',
  func: updateStatistics
})

// Daily at 2 AM - archive old data
wireScheduler({
  schedule:'0 2 * * *',
  func: archiveOldData
})

// Every 15 minutes - refresh cache
wireScheduler({
  schedule:'*/15 * * * *',
  func: refreshCache
})
```

## Orchestrating Complex Tasks

For complex workflows, use `rpc.invoke()` to orchestrate multiple operations:

```typescript
export const monthlyProcessing = pikkuVoidFunc({
  func: async ({ rpc, logger }) => {
    logger.info('Starting monthly processing')

    // Run multiple tasks in sequence
    await rpc.invoke('generateMonthlyReports', {})
    await rpc.invoke('processMonthlyBilling', {})
    await rpc.invoke('archiveMonthlyData', {})
    await rpc.invoke('sendMonthlyNotifications', {})

    logger.info('Monthly processing completed')
  },
  auth: false,
  title: 'Run all monthly processing tasks',
  tags: ['monthly', 'batch']
})
```

## Next Steps

- [Middleware](../core-features/middleware.md) - Adding observability to scheduled tasks
- [RPC](./rpcs/index.md) - Orchestrating complex workflows
- [Errors](../core-features/errors.md) - Error handling patterns
