---
sidebar_position: 0
title: Scheduled Tasks
description: Run periodic background jobs with cron
---

# Scheduled Tasks

Scheduled tasks (cron jobs) let you run code on a regular schedule - daily reports, weekly cleanups, hourly health checks, or any time-based operation. Your functions work the same whether they're triggered by a runtime scheduler (Azure Timer, AWS EventBridge) or by the `@pikku/schedule` package.

Your domain functions don't need to know they're being called by a scheduler. They just run on schedule and do their work. Pikku handles all the scheduling details.

## Your First Scheduled Task

Here's a scheduled task example from the templates — a daily summary and a weekly cleanup:

Source: [`scheduled.functions.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/functions/scheduled.functions.ts)

Source: [`scheduled.wiring.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/scheduled.wiring.ts)

That's it! Your functions will now run on their configured schedules.

:::note
If triggered by a serverless function like Lambda or Azure Timer, the platform's scheduler overrides this cron setting. The cron in `wireScheduler` is only for in-process scheduling (using `@pikku/schedule`).
:::

## Scheduled Functions

Scheduled functions use `pikkuVoidFunc` (an alias for `pikkuSessionlessFunc<void, void>`) since they:
- Don't receive any input data
- Don't return any output
- Don't have user sessions

```typescript @snippet wb-cron-void-func
```

:::tip Triggering Manually
Since scheduled functions are just regular Pikku functions, you can also wire them to HTTP endpoints for manual triggering during testing or emergencies:

```typescript @snippet wb-cron-manual-trigger
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

```typescript @snippet wb-cron-expressions
```

:::note Timezone
Cron expressions are interpreted as **UTC** by default (unless your runtime specifies otherwise). Make sure to account for timezone differences when scheduling tasks.
:::

## Configuration

### Basic Wiring

```typescript @snippet wb-cron-basic-wiring
```

### Sourcing Schedule from Config

For different schedules across environments:

The `schedule` is just a string, so it can come from config: pass `config.backupSchedule` and use `'0 2 * * *'` in production and `'0 */4 * * *'` in development.

## Middleware

Middleware is important for scheduled tasks since they don't have automatic observability. Add logging, metrics, or error handling:

```typescript @snippet wb-cron-metrics-middleware
```

### Per-Schedule Middleware

```typescript @snippet wb-cron-middleware-wiring
```

### Global Middleware

Apply middleware to all wirings (including scheduled tasks) with `addGlobalMiddleware`, or to a shared tag with `addTagMiddleware`:

The `addGlobalMiddleware([schedulerMetrics, alertMiddleware])` call in the snippet above applies a list of middleware to every wiring. To scope it to a shared tag instead, use `addTagMiddleware`.

## Error Handling

Scheduled tasks should throw errors for failures. How errors are handled depends on your runtime:

```typescript @snippet wb-cron-error-handling
```

Some runtimes automatically retry failed scheduled tasks, while others require middleware or external retry logic.

## Grouping Multiple Schedules

You can wire multiple schedules in a single file:

```typescript @snippet wb-cron-grouped
```

## Orchestrating Complex Tasks

For complex workflows, use `rpc.invoke()` to orchestrate multiple operations:

```typescript @snippet wb-cron-orchestrate
```

## Real-World Example: Shop Maintenance Jobs

From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template) — a daily sales report and a nightly basket cleanup.

**Daily sales report (runs at 06:00 UTC):**

```typescript @snippet dailySalesReport
```

**Abandoned basket cleanup (runs at 03:00 UTC):**

```typescript @snippet cleanupAbandonedBaskets
```

**Wiring both tasks:**

```typescript @snippet cronWirings
```

## Next Steps

- [Middleware](../core-features/middleware.md) - Adding observability to scheduled tasks
- [RPC](./rpcs/index.md) - Orchestrating complex workflows
- [Errors](../core-features/errors.md) - Error handling patterns
- [`#pikku/scheduler` in the SDK explorer](/api#app/scheduler) - every export on the scheduler door
