import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { QueueIcon } from '../../components/WiringIcons';
import {
  ShieldCheck, Layers, RefreshCw, Clock,
  Copy, Check, BarChart3, Zap, Database,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function CodeCard({ filename, badge, icon, children }: {
  filename: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
        {icon}
        <span className="text-sm font-semibold text-neutral-200">{filename}</span>
        {badge && <span className="ml-auto text-xs text-neutral-600 font-mono">{badge}</span>}
      </div>
      <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-queue w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-red-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-orange-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-red-400 border border-red-400/40 bg-red-400/10 px-3 py-1 rounded mb-6">
            Wire Type: Queue
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Background jobs,</span><br />
            <span className="text-red-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-red-400 text-lg">wireQueueWorker</code> turns your Pikku functions into queue workers with retries, progress tracking, and dead-letter routing.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/queue"
              className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-red-500/20"
            >
              Get Started
            </Link>
            <a
              href="#basics"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See the Code
            </a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-[40px]" />
              <div className="relative bg-[#0d0d0d] border-2 border-red-500/40 rounded-2xl p-6">
                <QueueIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Define a worker in two lines"
   ───────────────────────────────────────────── */

const basicsFunction = `const processReminder = pikkuSessionlessFunc({
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

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Define a worker in <span className="text-red-400">two lines</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Write your function, wire it to a queue name. Pikku handles deserialization, retries, and error routing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="processReminder.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{basicsFunction}</CodeBlock>
          </CodeCard>

          <CodeCard filename="reminders.queue.ts" badge="queue.ts" icon={<QueueIcon size={15} />}>
            <CodeBlock language="typescript">{basicsWiring}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Type-safe payloads', desc: 'Job data is validated and typed — your function receives exactly what you expect' },
            { label: 'Multi-backend', desc: 'Same wireQueueWorker works with BullMQ, PG Boss, or AWS SQS — swap the service, not the code' },
            { label: 'Middleware support', desc: 'Apply logging, metrics, or auth middleware per-worker or globally' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[11px] font-bold mt-0.5">✓</span>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. JOB CONTROL — "Progress, fail, discard"
   ───────────────────────────────────────────── */

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

function JobControlSection() {
  const controls = [
    {
      icon: <BarChart3 className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />,
      title: 'updateProgress()',
      desc: 'Report progress (0–100 or custom). Consumers can poll job status and show progress bars.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />,
      title: 'fail(reason)',
      desc: 'Fail the current job. If retries are configured, the job goes back in the queue with backoff.',
    },
    {
      icon: <Zap className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />,
      title: 'discard(reason)',
      desc: 'Permanently remove the job — no retry, no dead-letter queue. For invalid or irrelevant work.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Job Control</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Progress, fail, <span className="text-red-400">discard</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every queue function gets a <code className="text-red-400">wire.queue</code> object to control the current job.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            {controls.map((ctrl, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {ctrl.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white font-mono">{ctrl.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{ctrl.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CodeCard filename="processReminder.func.ts" icon={<QueueIcon size={15} />}>
            <CodeBlock language="typescript">{jobControlCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. RETRIES & DLQ — "Retry strategies built in"
   ───────────────────────────────────────────── */

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

function RetrySection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Retries & Config</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Retry strategies <span className="text-red-400">built in</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Configure worker-level concurrency and job-level retry, backoff, priority, and delay — based on the underlying queue system.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="reminders.queue.ts" icon={<QueueIcon size={15} />} badge="config + publish">
            <CodeBlock language="typescript">{retryCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Priority', desc: 'Higher-priority jobs get processed first' },
            { label: 'Delay', desc: 'Schedule jobs to run after a delay' },
            { label: 'Backoff', desc: 'Linear, exponential, or fixed retry delay' },
            { label: 'Dead letter', desc: 'Route failed jobs to a dead-letter queue' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 text-center">
              <p className="text-sm font-bold text-white mb-1">{item.label}</p>
              <p className="text-xs text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. TYPE-SAFE PUBLISHING — "Typed queue.add()"
   ───────────────────────────────────────────── */

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

function TypeSafePublishSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Type-Safe Publishing</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Typed <span className="text-red-400">queue.add()</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates a typed queue client. Queue names, payloads, and results — all autocompleted.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          <CodeCard filename="publish.ts" badge="auto-generated types">
            <CodeBlock language="typescript">{publishCode}</CodeBlock>
          </CodeCard>

          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Generated from wirings</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-red-400 text-xs">PikkuQueue</code> is auto-generated with typed overloads for every queue worker you've wired.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Job lifecycle</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Poll status, wait for completion with timeout, and retrieve typed results — all from the same job handle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. BACKENDS — "One wiring, many backends"
   ───────────────────────────────────────────── */

function BackendsSection() {
  const backends = [
    {
      title: 'BullMQ / Redis',
      desc: 'High-performance, push-based. Job results, progress, priority, delays.',
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
    },
    {
      title: 'PG Boss / PostgreSQL',
      desc: 'Database-backed, persistent. No extra infra if you already use Postgres.',
      border: 'border-neutral-700',
      bg: 'bg-neutral-900/50',
    },
    {
      title: 'AWS SQS',
      desc: 'Serverless, fire-and-forget. Scales to zero, no servers to manage.',
      border: 'border-neutral-700',
      bg: 'bg-neutral-900/50',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Backends</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One wiring, <span className="text-red-400">many backends</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Same wireQueueWorker code works across all backends. Swap the queue service, not your functions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {backends.map((b, i) => (
            <div key={i} className={`${b.bg} border ${b.border} rounded-xl p-6 text-center`}>
              <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <Database className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Config validation built in.</span>{' '}
            Pikku warns you at startup if you use a config option your backend doesn't support — no silent failures.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-red-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring queues in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with queue wiring already configured.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-red-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-red-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-red-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/wiring/queue"
            className="bg-red-500 text-white hover:bg-red-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/20"
          >
            Read the Queue Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Works with BullMQ, PG Boss &amp; AWS SQS
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function QueueWirePage() {
  return (
    <Layout
      title="Queue Wire — Pikku"
      description="Wire your Pikku functions to queue workers with retries, progress tracking, dead-letter routing, and multi-backend support."
    >
      <Hero />
      <main>
        <BasicsSection />
        <JobControlSection />
        <RetrySection />
        <TypeSafePublishSection />
        <BackendsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
