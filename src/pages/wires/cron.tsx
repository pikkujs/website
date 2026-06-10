import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsFunction = snippets.dailySalesReport;

const basicsWiring = snippets.cronWirings;

const cronDiagram = `┌─── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─── day of week (0-6)
│ │ │ │ │
* * * * *`;

const wireObjectCode = snippets.cronSkip;

const middlewareCode = snippets.cronMiddleware;

const page: PageData = {
  meta: {
    title: 'Scheduled Tasks Wire — Pikku',
    description: 'Wire your Pikku functions to cron schedules with standard five-field expressions, middleware, skip control, and multi-runtime support.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: Scheduled Task',
      h1: 'Cron jobs,\n_same functions._',
      lead: 'wireScheduler turns your Pikku functions into scheduled tasks with standard cron expressions and middleware support.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/scheduled-tasks', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'cron' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Schedule in _two lines_',
      lead: 'Write a void function, add a cron expression. Pikku calls it on schedule.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'scheduled.functions.ts', badge: 'func.ts', code: basicsFunction, snippetKey: 'dailySalesReport' },
      },
      right: {
        type: 'code',
        code: { filename: 'scheduled.wiring.ts', badge: 'wiring.ts', icon: 'cron', code: basicsWiring, snippetKey: 'cronWirings' },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Standard cron format', body: 'Five-field Unix cron expressions — nothing proprietary to learn.' },
          { title: 'No input, no output', body: 'Scheduled functions use pikkuVoidFunc — they run on a timer, not on demand.' },
          { title: 'Service injection', body: 'Access databases, email, logging, and any other service via dependency injection.' },
        ],
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Cron Format',
      h2: 'Standard _five-field cron_',
      lead: 'Nothing proprietary. If you know cron, you know Pikku scheduling.',
      variant: 'alt',
      code: { filename: 'cron format', language: 'text', code: cronDiagram },
      below: {
        type: 'cards',
        columns: 3,
        cards: [
          { title: '*/5 * * * *', body: 'Every 5 minutes', mono: true },
          { title: '0 9 * * *', body: 'Daily at 9:00 AM', mono: true },
          { title: '0 9 * * 1', body: 'Every Monday at 9:00 AM', mono: true },
          { title: '0 0 1 * *', body: 'First of month at midnight', mono: true },
          { title: '0 */6 * * *', body: 'Every 6 hours', mono: true },
          { title: '30 2 * * 0', body: 'Sundays at 2:30 AM', mono: true },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Wire Object',
      h2: 'Runtime context _per execution_',
      lead: 'Every scheduled function gets a wire.scheduledTask object with metadata and control methods.',
      variant: 'default',
      left: {
        type: 'cards',
        cards: [
          { icon: 'calendar', title: 'name & schedule', body: 'Access the task name and cron expression at runtime — useful for logging and metrics.', mono: true },
          { icon: 'clock', title: 'executionTime', body: 'The timestamp of the current execution. Use it for time-windowed queries and audit trails.', mono: true },
          { icon: 'skip-forward', title: 'skip(reason?)', body: 'Skip the current execution with an optional reason. The task stays scheduled — only this run is skipped.', mono: true },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'weeklyCleanup.func.ts', icon: 'cron', code: wireObjectCode, snippetKey: 'cronSkip' },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Middleware',
      h2: 'Observe _every execution_',
      lead: 'Wrap scheduled tasks with middleware for logging, metrics, error alerting, or anything else. Per-task or global.',
      variant: 'alt',
      code: { filename: 'scheduler-middleware.ts', icon: 'cron', code: middlewareCode, snippetKey: 'cronMiddleware' },
      below: {
        type: 'check-list',
        items: [
          { title: 'Per-task middleware', body: 'Attach middleware to individual scheduled tasks via the middleware array.' },
          { title: 'Access wire context', body: 'Middleware receives scheduledTask with name, schedule, and executionTime.' },
          { title: 'Same model as HTTP', body: 'Onion-order execution — the same middleware patterns you already know.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Deploy',
      h2: 'Runs _anywhere_',
      lead: 'Same wireScheduler code works in-process or serverless. Your functions don\'t change — only the runtime does.',
      variant: 'default',
      columns: 2,
      cards: [
        { title: 'In-process', body: 'InMemorySchedulerService — cron jobs run inside your server process.' },
        { title: 'Serverless', body: 'AWS Lambda, Azure Timer, Cloudflare — same function, triggered by the platform.' },
      ],
    },

    {
      component: 'cta',
      h2: 'Start wiring cron jobs in 5 minutes',
      lead: 'One command to scaffold a project with scheduled tasks already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the Scheduler Docs', to: '/docs/wiring/scheduled-tasks', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Works with Lambda, Azure Timer, Cloudflare & in-process',
    },
  ],
};

export default function CronWirePage() {
  return <FeaturePage data={page} />;
}
