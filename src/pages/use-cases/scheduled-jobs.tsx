import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, Clock, Eye, Shield, RefreshCw } from 'lucide-react';

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          Cron that
          <br />
          <span className="text-amber-400">actually works.</span>
        </h1>
        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Scheduled functions running on Fabric's infrastructure. No cron daemon
          to manage, no missed executions to debug, no separate monitoring.
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
          You need a report generated every Monday. A cache warmed every hour.
          Stale data cleaned up nightly. So you set up node-cron, or a Lambda
          with EventBridge, or a GitHub Action on a schedule.
          <span className="text-white/70"> Then it silently fails and nobody notices for a week.</span>
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
            A function. A schedule. That's it.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400/60">You write this</p>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`const generateReport = pikkuFunc({
  input: z.object({}),
  output: ReportSchema,
  func: async ({ db, email }) => {
    const data = await db.analytics.aggregate('weekly')
    const report = buildReport(data)
    await email.send({ to: 'team@acme.dev', report })
    return report
  },
})

// Run every Monday at 9am
wireScheduler({ schedule: '0 9 * * 1', func: generateReport })`}</CodeBlock>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/25">Same function you'd call from your API. Same auth, same types.</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">What Fabric gives you</p>
            <div className="space-y-3">
              {[
                { icon: <Clock className="w-4 h-4" />, title: 'Managed scheduling', desc: 'Runs on our infra. No cron daemon, no Lambda triggers to configure.' },
                { icon: <RefreshCw className="w-4 h-4" />, title: 'Automatic retries', desc: 'If a scheduled run fails, Fabric retries with backoff.' },
                { icon: <Eye className="w-4 h-4" />, title: 'Execution history', desc: 'See every run — when it started, how long it took, whether it succeeded.' },
                { icon: <Shield className="w-4 h-4" />, title: 'Same permissions', desc: 'Cron jobs run with the same auth model as your API. No backdoor execution.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <div className="flex-shrink-0 mt-0.5 text-amber-400/60">{item.icon}</div>
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
            Every run is traced.
          </h2>
          <p className="mt-3 text-sm text-white/40">No more "did the cron job run last night?"</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="ml-3 text-xs text-white/20 font-mono">cron history</span>
          </div>
          <div className="p-5 font-mono text-[12px] leading-6">
            <div className="text-white/30">generateReport — <span className="text-amber-400">0 9 * * 1</span></div>
            <div className="mt-2" />
            <div className="text-emerald-400">  ✓ Mon Mar 24  09:00:01  <span className="text-white/20">1.4s  success</span></div>
            <div className="text-emerald-400">  ✓ Mon Mar 17  09:00:00  <span className="text-white/20">1.2s  success</span></div>
            <div className="text-amber-400">  ⟳ Mon Mar 10  09:00:01  <span className="text-white/20">retry 1 → 1.8s  success</span></div>
            <div className="text-emerald-400">  ✓ Mon Mar 03  09:00:00  <span className="text-white/20">1.1s  success</span></div>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/4 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Stop babysitting cron jobs.
        </h2>
        <p className="mt-4 text-base text-white/40">Write the function. Set the schedule. Fabric runs it.</p>
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

export default function ScheduledJobsPage() {
  return (
    <Layout
      title="Scheduled Jobs — Pikku Fabric"
      description="Managed cron jobs on Pikku Fabric. Write a function, set a schedule, deploy. Automatic retries, execution history, and full observability."
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
