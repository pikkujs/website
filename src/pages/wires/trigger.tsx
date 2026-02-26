import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { TriggerIcon } from '../../components/WiringIcons';
import {
  Radio, Zap, Power,
  Copy, Check, Database,
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
    <div className="wire-hero-trigger w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-amber-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-orange-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded mb-6">
            Wire Type: Trigger
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Event-driven,</span><br />
            <span className="text-amber-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-amber-400 text-lg">wireTrigger</code> connects external event sources — Redis pub/sub, Postgres changes, polling — to your Pikku functions.
          </p>
          <div className="flex flex-row gap-4">
            <Link to="/docs/wiring/triggers" className="bg-amber-500 text-black hover:bg-amber-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/20">Get Started</Link>
            <a href="#basics" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">See the Code</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-amber-500/40 rounded-2xl p-6">
              <TriggerIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Two-part pattern"
   ───────────────────────────────────────────── */

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

const wiringCode = `// 2. Wire source to target
wireTrigger({
  name: 'order-events',
  func: onOrderEvent,   // Target: your Pikku function
})

wireTriggerSource({
  name: 'order-events',
  func: redisSubscribe,  // Source: the subscription
  input: { channels: ['orders:created', 'orders:updated'] },
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Two-part <span className="text-amber-400">pattern</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Define a trigger source (how to subscribe) and a trigger target (what to call). Pikku connects them and handles lifecycle.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="trigger.functions.ts" badge="source" icon={<TriggerIcon size={15} />}>
            <CodeBlock language="typescript">{sourceCode}</CodeBlock>
          </CodeCard>

          <CodeCard filename="trigger.wiring.ts" badge="wiring" icon={<TriggerIcon size={15} />}>
            <CodeBlock language="typescript">{wiringCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Source → Target', desc: 'Source subscribes to external events, target is your business logic — fully decoupled' },
            { label: 'Typed payloads', desc: 'The trigger source defines input (config) and output (event data) — both type-checked' },
            { label: 'Automatic teardown', desc: 'Return a cleanup function — Pikku calls it on shutdown for graceful disconnection' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. EVENT SOURCES — "Subscribe to anything"
   ───────────────────────────────────────────── */

function EventSourcesSection() {
  const sources = [
    {
      icon: <Database className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'Redis Pub/Sub',
      desc: 'Subscribe to Redis channels. Fire triggers on every message.',
    },
    {
      icon: <Database className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'PostgreSQL LISTEN/NOTIFY',
      desc: 'React to row changes via pg_notify. Trigger on INSERT, UPDATE, DELETE.',
    },
    {
      icon: <Radio className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'Polling',
      desc: 'setInterval-based polling. Check an API or database on a timer.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'Anything with a callback',
      desc: 'File watchers, webhooks, MQTT, AMQP — if it has a subscribe pattern, it works.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Event Sources</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Subscribe to <span className="text-amber-400">anything</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            The trigger source is just a function. If it has a subscribe/callback pattern, you can wire it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {sources.map((s, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                {s.icon}
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">{s.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. LIFECYCLE — "Setup, fire, teardown"
   ───────────────────────────────────────────── */

function LifecycleSection() {
  const steps = [
    { phase: 'Setup', desc: 'TriggerService starts. Each source function runs, subscribes to its event source.', color: 'text-amber-400' },
    { phase: 'Fire', desc: 'External event occurs. trigger.invoke(data) dispatches to the target function via RPC.', color: 'text-white' },
    { phase: 'Teardown', desc: 'triggerService.stop() calls each source\'s cleanup function. Connections closed gracefully.', color: 'text-amber-400' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Lifecycle</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Setup, fire, <span className="text-amber-400">teardown</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Pikku manages the full trigger lifecycle — from subscription setup to graceful shutdown.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <span className="text-amber-400 text-sm font-bold">{i + 1}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex-1">
                  <h3 className={`text-base font-bold mb-1 ${step.color}`}>{step.phase}</h3>
                  <p className="text-sm text-neutral-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <Power className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Targets can be functions or workflows.</span>{' '}
            A trigger can invoke an RPC function directly, or start a workflow — both are supported via the same wiring.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-amber-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Start wiring triggers in 5 minutes</Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">One command to scaffold a project with trigger wiring already configured.</p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-amber-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-amber-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/triggers" className="bg-amber-500 text-black hover:bg-amber-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20">Read the Trigger Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; Redis, PostgreSQL, polling &amp; more</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function TriggerWirePage() {
  return (
    <Layout title="Trigger Wire — Pikku" description="Connect external event sources to your Pikku functions — Redis pub/sub, Postgres changes, polling, and anything with a callback.">
      <Hero />
      <main>
        <BasicsSection />
        <EventSourcesSection />
        <LifecycleSection />
        <CTASection />
      </main>
    </Layout>
  );
}
