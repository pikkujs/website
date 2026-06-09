import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const sourceCode = `// 1. Define the trigger source — how to subscribe
const redisSubscribe = pikkuTriggerFunc<
  { channels: string[] },
  { channel: string; message: any }
>(async ({ redis }, { channels }, { trigger }) => {
  const subscriber = redis.duplicate()

  subscriber.on('message', (channel, message) => {
    // Fire the trigger with typed data
    trigger.invoke({ channel, message: JSON.parse(message) })
  })

  await subscriber.subscribe(...channels)

  // Return a teardown function for cleanup
  return async () => {
    await subscriber.unsubscribe()
    await subscriber.quit()
  }
})`;

const wiringCode = snippets.lowStockTrigger;

const page: PageData = {
  meta: {
    title: 'Trigger Wire — Pikku',
    description: 'Connect external event sources to your Pikku functions — Redis pub/sub, Postgres changes, polling, and anything with a callback.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: Trigger',
      h1: 'Event-driven,\n_same functions._',
      lead: 'wireTrigger connects external event sources — Redis pub/sub, Postgres changes, polling — to your Pikku functions.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/triggers', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'trigger' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Two-part _pattern_',
      lead: 'Define a trigger source (how to subscribe) and a trigger target (what to call). Pikku connects them and handles lifecycle.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'trigger.functions.ts', badge: 'source', icon: 'trigger', code: sourceCode },
      },
      right: {
        type: 'code',
        code: { filename: 'trigger.wiring.ts', badge: 'target + wiring', icon: 'trigger', code: wiringCode },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Source → Target', body: 'Source subscribes to external events, target is your business logic — fully decoupled.' },
          { title: 'Typed payloads', body: 'The trigger source defines input (config) and output (event data) — both type-checked.' },
          { title: 'Automatic teardown', body: 'Return a cleanup function — Pikku calls it on shutdown for graceful disconnection.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Event Sources',
      h2: 'Subscribe to _anything_',
      lead: 'The trigger source is just a function. If it has a subscribe/callback pattern, you can wire it.',
      variant: 'alt',
      columns: 2,
      cards: [
        { icon: 'database', title: 'Redis Pub/Sub', body: 'Subscribe to Redis channels. Fire triggers on every message.' },
        { icon: 'database', title: 'PostgreSQL LISTEN/NOTIFY', body: 'React to row changes via pg_notify. Trigger on INSERT, UPDATE, DELETE.' },
        { icon: 'radio', title: 'Polling', body: 'setInterval-based polling. Check an API or database on a timer.' },
        { icon: 'zap', title: 'Anything with a callback', body: 'File watchers, webhooks, MQTT, AMQP — if it has a subscribe pattern, it works.' },
      ],
    },

    {
      component: 'step-cards',
      eyebrow: 'Lifecycle',
      h2: 'Setup, fire, _teardown_',
      lead: 'Pikku manages the full trigger lifecycle — from subscription setup to graceful shutdown.',
      variant: 'default',
      steps: [
        { title: 'Setup', desc: 'TriggerService starts. Each source function runs, subscribes to its event source.' },
        { title: 'Fire', desc: 'External event occurs. trigger.invoke(data) dispatches to the target function via RPC.' },
        { title: 'Teardown', desc: "triggerService.stop() calls each source's cleanup function. Connections closed gracefully." },
      ],
      columns: 3,
      below: {
        type: 'note',
        icon: 'power',
        title: 'Targets can be functions or workflows.',
        body: 'A trigger can invoke an RPC function directly, or start a workflow — both are supported via the same wiring.',
      },
    },

    {
      component: 'cta',
      h2: 'Start wiring triggers in 5 minutes',
      lead: 'One command to scaffold a project with trigger wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the Trigger Docs', to: '/docs/wiring/triggers', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Redis, PostgreSQL, polling & more',
    },
  ],
};

export default function TriggerWirePage() {
  return <FeaturePage data={page} />;
}
