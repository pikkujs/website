import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, Layers, RefreshCw, Eye, Shield } from 'lucide-react';

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-red-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          Queues without
          <br />
          <span className="text-red-400">the infrastructure.</span>
        </h1>
        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Background job processing on Fabric. Write a function, wire it to a
          queue, deploy. Retries, dead-letter queues, and delivery guarantees
          included.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/#waitlist" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
            Get early access <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="#how-it-works" className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="py-16 lg:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-lg text-white/50 leading-relaxed">
          You need to send a welcome email after signup. Process a payment in the
          background. Generate a PDF and notify the user. So you set up Redis,
          install BullMQ, write a worker process, configure a separate deploy target,
          and build monitoring around it.
          <span className="text-white/70"> All for a function you already wrote.</span>
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Same function. Runs in the background.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400/60">You write this</p>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`const sendWelcomeEmail = pikkuFunc({
  input: z.object({ userId: z.string() }),
  func: async ({ db, email }, { userId }) => {
    const user = await db.users.find(userId)
    await email.send({
      to: user.email,
      template: 'welcome',
    })
  },
  permissions: { service: isInternalService },
})

// Process in the background
wireQueueWorker({ queue: 'emails', func: sendWelcomeEmail })

// Also callable via HTTP for testing
wireHTTP({ method: 'post', route: '/admin/send-welcome', func: sendWelcomeEmail })`}</CodeBlock>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/25">
              One function. Runs as a queue worker and an API endpoint. Same code.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">Fabric handles</p>
            <div className="space-y-3">
              {[
                { icon: <Layers className="w-4 h-4" />, title: 'Managed queue infra', desc: 'No Redis to run. No worker processes to deploy. Fabric manages the queue.' },
                { icon: <RefreshCw className="w-4 h-4" />, title: 'Retries + dead-letter', desc: 'Failed jobs retry with backoff. Permanently failed jobs go to dead-letter for inspection.' },
                { icon: <Eye className="w-4 h-4" />, title: 'Job visibility', desc: 'See pending, active, completed, and failed jobs. Full traces per job.' },
                { icon: <Shield className="w-4 h-4" />, title: 'Same auth model', desc: 'Queue workers enforce the same permissions as your API. No backdoor execution.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <div className="flex-shrink-0 mt-0.5 text-red-400/60">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{item.title}</p>
                    <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trace() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Every job is tracked.
          </h2>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="ml-3 text-xs text-white/20 font-mono">queue: emails</span>
          </div>
          <div className="p-5 font-mono text-[12px] leading-6">
            <div className="text-white/30">sendWelcomeEmail — <span className="text-red-400">emails</span></div>
            <div className="mt-2" />
            <div className="text-emerald-400">  ✓ job-a3f1  <span className="text-white/20">userId: usr_281  340ms  success</span></div>
            <div className="text-emerald-400">  ✓ job-b7e2  <span className="text-white/20">userId: usr_282  290ms  success</span></div>
            <div className="text-amber-400">  ⟳ job-c9d3  <span className="text-white/20">userId: usr_283  retry 2 → 310ms  success</span></div>
            <div className="text-emerald-400">  ✓ job-d1f4  <span className="text-white/20">userId: usr_284  280ms  success</span></div>
            <div className="text-white/15">  ◷ job-e5a5  <span className="text-white/10">userId: usr_285  pending</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-red-500/4 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Stop managing queue infrastructure.
        </h2>
        <p className="mt-4 text-base text-white/40">Write the function. Wire it to a queue. Deploy.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/#waitlist" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
            Get early access <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/" className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
            Learn about Fabric
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function BackgroundJobsPage() {
  return (
    <Layout
      title="Background Jobs — Pikku Fabric"
      description="Managed job queues on Pikku Fabric. Write a function, wire it to a queue, deploy. Retries, dead-letter queues, and full observability included."
    >
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <Trace />
        <CTA />
      </main>
    </Layout>
  );
}
