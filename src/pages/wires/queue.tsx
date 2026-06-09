import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const basicsFunc = `const processReminder = pikkuSessionlessFunc({
  title: 'Process Reminder',
  func: async ({ db, emailService }, { todoId, userId }) => {
    const todo = await db.getTodo(todoId)
    await emailService.sendReminder(userId, todo)
    return { sent: true }
  }
})`;

const basicsWiring = `wireQueueWorker({
  name: 'todo-reminders',
  func: processReminder,
})`;

const jobControlCode = `const processReminder = pikkuSessionlessFunc({
  title: 'Process Reminder',
  func: async ({ db }, { todoId }, wire) => {
    await wire.queue.updateProgress(25)

    const todo = await db.getTodo(todoId)
    if (!todo) {
      // Permanently remove — no retry
      await wire.queue.discard('Todo not found')
      return
    }

    if (todo.completed) {
      // Fail with reason — will retry
      await wire.queue.fail('Todo already completed')
      return
    }

    await wire.queue.updateProgress(100)
    return { sent: true }
  }
})`;

const retryCode = `wireQueueWorker({
  name: 'todo-reminders',
  func: processReminder,
  config: {
    batchSize: 5,            // Process 5 jobs in parallel
    removeOnComplete: 100,   // Keep last 100 completed jobs
  }
})

// Publishing with job-level options
const jobId = await queue.add('todo-reminders', {
  todoId: 'abc-123',
  userId: 'user-456'
}, {
  priority: 10,              // Higher = processed first
  delay: 5000,               // Wait 5s before processing
  attempts: 3,               // Retry up to 3 times
  backoff: { type: 'exponential', delay: 1000 },
})`;

const publishCode = `import { PikkuQueue } from '.pikku/pikku-queue.gen.js'

const queue = new PikkuQueue(queueService)

// Fully typed — queue name and payload are inferred
const jobId = await queue.add('todo-reminders', {
  todoId: 'abc-123',
  userId: 'user-456'
})

// Get job status and result
const job = await queue.getJob('todo-reminders', jobId)
const status = await job.status()  // 'waiting' | 'active' | 'completed' | 'failed'
const result = await job.waitForCompletion(30_000)`;

const page: PageData = {
  meta: {
    title: 'Queue Wire — Pikku',
    description: 'Wire your Pikku functions to queue workers with retries, progress tracking, dead-letter routing, and multi-backend support.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: Queue',
      h1: 'Background jobs,\n_same functions._',
      lead: 'wireQueueWorker turns your Pikku functions into queue workers with retries, progress tracking, and dead-letter routing.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/queue', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'queue' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Define a worker in _two lines_',
      lead: 'Write your function, wire it to a queue name. Pikku handles deserialization, retries, and error routing.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'processReminder.func.ts', badge: 'func.ts', code: basicsFunc },
      },
      right: {
        type: 'code',
        code: { filename: 'reminders.queue.ts', badge: 'queue.ts', icon: 'queue', code: basicsWiring },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Type-safe payloads', body: 'Job data is validated and typed — your function receives exactly what you expect.' },
          { title: 'Multi-backend', body: 'Same wireQueueWorker works with BullMQ, PG Boss, or AWS SQS — swap the service, not the code.' },
          { title: 'Middleware support', body: 'Apply logging, metrics, or auth middleware per-worker or globally.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Job Control',
      h2: 'Progress, fail, _discard_',
      lead: 'Every queue function gets a wire.queue object to control the current job.',
      variant: 'alt',
      columns: '1fr 1fr',
      left: {
        type: 'cards',
        cards: [
          { icon: 'bar-chart-3', title: 'updateProgress()', body: 'Report progress (0–100 or custom). Consumers can poll job status and show progress bars.', mono: true },
          { icon: 'refresh-cw',  title: 'fail(reason)',     body: 'Fail the current job. If retries are configured, the job goes back in the queue with backoff.', mono: true },
          { icon: 'zap',         title: 'discard(reason)',  body: 'Permanently remove the job — no retry, no dead-letter queue. For invalid or irrelevant work.', mono: true },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'processReminder.func.ts', icon: 'queue', code: jobControlCode },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Retries & Config',
      h2: 'Retry strategies _built in_',
      lead: 'Configure worker-level concurrency and job-level retry, backoff, priority, and delay — based on the underlying queue system.',
      variant: 'default',
      code: { filename: 'reminders.queue.ts', icon: 'queue', badge: 'config + publish', code: retryCode },
      below: {
        type: 'cards',
        columns: 4,
        cards: [
          { title: 'Priority',    body: 'Higher-priority jobs get processed first.' },
          { title: 'Delay',       body: 'Schedule jobs to run after a delay.' },
          { title: 'Backoff',     body: 'Linear, exponential, or fixed retry delay.' },
          { title: 'Dead letter', body: 'Route failed jobs to a dead-letter queue.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Type-Safe Publishing',
      h2: 'Typed _queue.add()_',
      lead: 'Pikku generates a typed queue client. Queue names, payloads, and results — all autocompleted.',
      variant: 'alt',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'publish.ts', badge: 'auto-generated types', code: publishCode },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'shield-check', title: 'Generated from wirings', body: 'PikkuQueue is auto-generated with typed overloads for every queue worker you\'ve wired.' },
          { icon: 'clock',        title: 'Job lifecycle',           body: 'Poll status, wait for completion with timeout, and retrieve typed results — all from the same job handle.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Backends',
      h2: 'One wiring, _many backends_',
      lead: 'Same wireQueueWorker code works across all backends. Swap the queue service, not your functions.',
      variant: 'default',
      columns: 3,
      cards: [
        { title: 'BullMQ / Redis',      body: 'High-performance, push-based. Job results, progress, priority, delays.' },
        { title: 'PG Boss / PostgreSQL', body: 'Database-backed, persistent. No extra infra if you already use Postgres.' },
        { title: 'AWS SQS',             body: 'Serverless, fire-and-forget. Scales to zero, no servers to manage.' },
      ],
      below: {
        type: 'note',
        icon: 'database',
        title: 'Config validation built in.',
        body: 'Pikku warns you at startup if you use a config option your backend doesn\'t support — no silent failures.',
      },
    },

    {
      component: 'cta',
      h2: 'Start wiring queues in 5 minutes',
      lead: 'One command to scaffold a project with queue wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the Queue Docs', to: '/docs/wiring/queue', primary: true },
        { label: 'View on GitHub',      to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Works with BullMQ, PG Boss & AWS SQS',
    },
  ],
};

export default function QueueWirePage() {
  return <FeaturePage data={page} />;
}
