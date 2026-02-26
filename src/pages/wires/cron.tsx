import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { CronIcon } from '../../components/WiringIcons';
import {
  ShieldCheck, Layers, Clock, Calendar,
  Copy, Check, SkipForward, Zap,
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
    <div className="wire-hero-cron w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-yellow-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-amber-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-yellow-400 border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 rounded mb-6">
            Wire Type: Scheduled Task
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Cron jobs,</span><br />
            <span className="text-yellow-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-yellow-400 text-lg">wireScheduler</code> turns your Pikku functions into scheduled tasks with standard cron expressions and middleware support.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/scheduled-tasks"
              className="bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
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
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-[40px]" />
              <div className="relative bg-[#0d0d0d] border-2 border-yellow-500/40 rounded-2xl p-6">
                <CronIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Schedule in two lines"
   ───────────────────────────────────────────── */

const basicsFunction = `const dailySummary = pikkuVoidFunc({
  title: 'Daily Summary',
  func: async ({ db, emailService, logger }) => {
    logger.info('Generating daily summary')
    const stats = await db.getDailyStats()
    await emailService.sendSummary(stats)
  }
})`;

const basicsWiring = `wireScheduler({
  name: 'dailySummary',
  schedule: '0 9 * * *',  // Every day at 9:00 AM
  func: dailySummary,
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Schedule in <span className="text-yellow-400">two lines</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Write a void function, add a cron expression. Pikku calls it on schedule.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="dailySummary.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{basicsFunction}</CodeBlock>
          </CodeCard>

          <CodeCard filename="scheduled.wiring.ts" badge="wiring.ts" icon={<CronIcon size={15} />}>
            <CodeBlock language="typescript">{basicsWiring}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Standard cron format', desc: 'Five-field Unix cron expressions — nothing proprietary to learn' },
            { label: 'No input, no output', desc: 'Scheduled functions use pikkuVoidFunc — they run on a timer, not on demand' },
            { label: 'Service injection', desc: 'Access databases, email, logging, and any other service via dependency injection' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. CRON FORMAT — "Standard five-field cron"
   ───────────────────────────────────────────── */

function CronFormatSection() {
  const examples = [
    { expression: '*/5 * * * *', meaning: 'Every 5 minutes' },
    { expression: '0 9 * * *', meaning: 'Daily at 9:00 AM' },
    { expression: '0 9 * * 1', meaning: 'Every Monday at 9:00 AM' },
    { expression: '0 0 1 * *', meaning: 'First of month at midnight' },
    { expression: '0 */6 * * *', meaning: 'Every 6 hours' },
    { expression: '30 2 * * 0', meaning: 'Sundays at 2:30 AM' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Cron Format</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Standard <span className="text-yellow-400">five-field cron</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Nothing proprietary. If you know cron, you know Pikku scheduling.
          </p>
        </div>

        {/* Cron field diagram */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 font-mono text-center">
            <div className="text-sm text-neutral-500 mb-4 whitespace-pre">{`┌─── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─── day of week (0-6)
│ │ │ │ │`}</div>
            <div className="text-2xl text-yellow-400 font-bold tracking-[0.3em]">* * * * *</div>
          </div>
        </div>

        {/* Example table */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-px bg-neutral-800 rounded-xl overflow-hidden">
            {examples.map((ex, i) => (
              <div key={i} className="bg-[#0d0d0d] p-4 flex items-center gap-4">
                <code className="text-sm text-yellow-400 font-mono font-bold min-w-[120px]">{ex.expression}</code>
                <span className="text-sm text-neutral-400">{ex.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. WIRE OBJECT — "Runtime context per execution"
   ───────────────────────────────────────────── */

const wireObjectCode = `const weeklyCleanup = pikkuVoidFunc({
  title: 'Weekly Cleanup',
  func: async ({ db, logger }, _input, wire) => {
    logger.info(\`Running: \${wire.scheduledTask.name}\`)
    logger.info(\`Schedule: \${wire.scheduledTask.schedule}\`)
    logger.info(\`Execution time: \${wire.scheduledTask.executionTime}\`)

    const staleCount = await db.countStaleTodos()
    if (staleCount === 0) {
      // Skip this execution — nothing to clean
      wire.scheduledTask.skip('No stale todos found')
      return
    }

    await db.deleteCompletedTodos({ olderThan: '30d' })
    logger.info(\`Cleaned \${staleCount} stale todos\`)
  }
})`;

function WireObjectSection() {
  const props = [
    {
      icon: <Calendar className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'name & schedule',
      desc: 'Access the task name and cron expression at runtime — useful for logging and metrics.',
    },
    {
      icon: <Clock className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'executionTime',
      desc: 'The timestamp of the current execution. Use it for time-windowed queries and audit trails.',
    },
    {
      icon: <SkipForward className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'skip(reason?)',
      desc: 'Skip the current execution with an optional reason. The task stays scheduled — only this run is skipped.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Wire Object</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Runtime context <span className="text-yellow-400">per execution</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every scheduled function gets a <code className="text-yellow-400">wire.scheduledTask</code> object with metadata and control methods.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            {props.map((prop, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {prop.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white font-mono">{prop.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CodeCard filename="weeklyCleanup.func.ts" icon={<CronIcon size={15} />}>
            <CodeBlock language="typescript">{wireObjectCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. MIDDLEWARE — "Observe every execution"
   ───────────────────────────────────────────── */

const middlewareCode = `const schedulerMetrics = pikkuMiddleware(
  async ({ logger }, { scheduledTask }, next) => {
    const start = Date.now()
    logger.info(\`Task started: \${scheduledTask.name}\`)

    try {
      await next()
      logger.info(\`Task completed: \${scheduledTask.name}\`, {
        duration: Date.now() - start
      })
    } catch (error) {
      logger.error(\`Task failed: \${scheduledTask.name}\`, {
        error: error.message,
        duration: Date.now() - start
      })
      throw error
    }
  }
)

wireScheduler({
  name: 'dailySummary',
  schedule: '0 9 * * *',
  func: dailySummary,
  middleware: [schedulerMetrics],
})`;

function MiddlewareSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Middleware</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Observe <span className="text-yellow-400">every execution</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Wrap scheduled tasks with middleware for logging, metrics, error alerting, or anything else. Per-task or global.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="scheduler-middleware.ts" icon={<CronIcon size={15} />}>
            <CodeBlock language="typescript">{middlewareCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Per-task middleware', desc: 'Attach middleware to individual scheduled tasks via the middleware array' },
            { label: 'Access wire context', desc: 'Middleware receives scheduledTask with name, schedule, and executionTime' },
            { label: 'Same model as HTTP', desc: 'Onion-order execution — the same middleware patterns you already know' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-[11px] font-bold mt-0.5">✓</span>
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
   6. DEPLOY — "Runs anywhere"
   ───────────────────────────────────────────── */

function DeploySection() {
  const runtimes = [
    {
      title: 'In-process',
      desc: 'InMemorySchedulerService — cron jobs run inside your server process.',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/5',
    },
    {
      title: 'Serverless',
      desc: 'AWS Lambda, Azure Timer, Cloudflare — same function, triggered by the platform.',
      border: 'border-neutral-700',
      bg: 'bg-neutral-900/50',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Deploy</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Runs <span className="text-yellow-400">anywhere</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Same wireScheduler code works in-process or serverless. Your functions don't change — only the runtime does.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {runtimes.map((r, i) => (
            <div key={i} className={`${r.bg} border ${r.border} rounded-xl p-6 text-center`}>
              <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-yellow-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring cron jobs in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with scheduled tasks already configured.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-yellow-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-yellow-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-yellow-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/wiring/scheduled-tasks"
            className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            Read the Scheduler Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Works with Lambda, Azure Timer, Cloudflare &amp; in-process
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function CronWirePage() {
  return (
    <Layout
      title="Scheduled Tasks Wire — Pikku"
      description="Wire your Pikku functions to cron schedules with standard five-field expressions, middleware, skip control, and multi-runtime support."
    >
      <Hero />
      <main>
        <BasicsSection />
        <CronFormatSection />
        <WireObjectSection />
        <MiddlewareSection />
        <DeploySection />
        <CTASection />
      </main>
    </Layout>
  );
}
