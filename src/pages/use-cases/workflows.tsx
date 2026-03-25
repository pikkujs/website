import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  ArrowRight, RefreshCw, Clock, Shield, Eye,
  Zap, Database, AlertTriangle,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. HERO
   ════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-emerald-500/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          Workflows that
          <br />
          <span className="text-emerald-400">survive anything.</span>
        </h1>

        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Write multi-step processes as sequential code. Pikku persists each step,
          retries on failure, and resumes exactly where it left off.
          No external workflow engine.
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

/* ════════════════════════════════════════════════════════════════
   2. PROBLEM
   ════════════════════════════════════════════════════════════════ */

function Problem() {
  return (
    <section className="py-16 lg:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-lg text-white/50 leading-relaxed">
          You need to onboard a user: create their profile, wait 5 minutes,
          send a welcome email, provision their workspace. If the email
          service is down, the whole thing fails.
          <span className="text-white/70"> You end up building retry logic, state machines,
          and dead-letter queues. For what should be 10 lines of code.</span>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. THE CODE — before/after
   ════════════════════════════════════════════════════════════════ */

function TheCode() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Sequential code. Durable execution.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            Write it like normal async code. Pikku handles persistence,
            retries, and resumption.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* The workflow */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400/60">You write this</p>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`export const onboardUser = pikkuWorkflow({
  input: z.object({
    email: z.string(),
    userId: z.string(),
  }),
  func: async ({ workflow, rpc }, data) => {
    // Step 1 — persisted, retried on failure
    await workflow.do('Create profile', 'createProfile', data)

    // Step 2 — sleeps for real (minutes, hours, days)
    await workflow.sleep('Wait before welcome', '5m')

    // Step 3 — resumes here if the server restarted
    await workflow.do('Send welcome email', 'sendEmail', {
      to: data.email,
      template: 'welcome',
    })

    // Step 4
    await workflow.do('Provision workspace', 'createWorkspace', {
      userId: data.userId,
    })

    return { success: true }
  },
})`}</CodeBlock>
              </div>
            </div>
          </div>

          {/* What Pikku does */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">Pikku handles</p>
            <div className="space-y-3">
              {[
                { icon: <Database className="w-4 h-4" />, title: 'Each step is persisted', desc: 'State saved to PostgreSQL or Redis after every step. Nothing lost.' },
                { icon: <RefreshCw className="w-4 h-4" />, title: 'Automatic retries', desc: 'If sendEmail fails, Pikku retries that step. Previous steps are not re-run.' },
                { icon: <Clock className="w-4 h-4" />, title: 'Real sleep', desc: 'workflow.sleep pauses for real time — 5 minutes, 2 hours, 7 days. Server can restart.' },
                { icon: <Zap className="w-4 h-4" />, title: 'Deterministic replay', desc: 'On restart, Pikku replays from the exact step that failed. No duplicate side effects.' },
                { icon: <Eye className="w-4 h-4" />, title: 'Full observability', desc: 'Every step is traced. See which step is running, which completed, which failed.' },
                { icon: <Shield className="w-4 h-4" />, title: 'Same auth model', desc: 'Workflows use the same permissions as your functions. No separate auth layer.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <div className="flex-shrink-0 mt-0.5 text-emerald-400/60">{item.icon}</div>
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

/* ════════════════════════════════════════════════════════════════
   4. HOW WORKFLOWS RUN — trigger + observe
   ════════════════════════════════════════════════════════════════ */

function HowTheyRun() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Trigger from anywhere. Watch it run.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            Workflows are functions. Wire them to any surface.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Triggering */}
          <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/[0.06] text-xs text-white/25 font-mono">Trigger a workflow</div>
            <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
              <CodeBlock language="typescript">{`// Via HTTP
wireHTTP({ method: 'post', route: '/onboard', func: onboardUser })

// Via queue (on user signup event)
wireQueueWorker({ queue: 'signups', func: onboardUser })

// Via cron (batch onboarding)
wireScheduler({ schedule: '0 9 * * *', func: batchOnboard })

// Via AI agent
wireBotTool({ func: onboardUser })`}</CodeBlock>
            </div>
          </div>

          {/* Trace */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-white/20 font-mono">workflow trace</span>
            </div>
            <div className="p-5 font-mono text-[12px] leading-6">
              <div className="text-white/30">onboardUser — <span className="text-emerald-400">completed</span></div>
              <div className="mt-2" />
              <div className="text-emerald-400">  ✓ Create profile       <span className="text-white/20">12ms</span></div>
              <div className="text-amber-400">  ◷ Wait before welcome  <span className="text-white/20">5m sleep</span></div>
              <div className="text-emerald-400">  ✓ Send welcome email   <span className="text-white/20">340ms</span></div>
              <div className="text-emerald-400">  ✓ Provision workspace  <span className="text-white/20">1.2s</span></div>
              <div className="mt-2" />
              <div className="text-white/30">  Total: 5m 1.6s — <span className="text-emerald-400">success</span></div>
              <div className="text-white/15">  Retries: 1 (sendEmail, attempt 2 succeeded)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. VS ALTERNATIVES
   ════════════════════════════════════════════════════════════════ */

function VsAlternatives() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
          No YAML. No state machines. No separate engine.
        </h2>
        <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
          Temporal requires a separate server and custom workers.
          Inngest needs event schemas and a webhook endpoint.
          Step Functions need JSON definitions and an AWS account.
          Pikku workflows are TypeScript functions — same as everything else in your codebase.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-xl mx-auto text-left">
          {[
            { label: 'Temporal', issue: 'Separate server + workers' },
            { label: 'Inngest', issue: 'Event schemas + webhooks' },
            { label: 'Step Functions', issue: 'JSON + AWS lock-in' },
          ].map((alt, i) => (
            <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
              <p className="text-sm font-semibold text-white/60">{alt.label}</p>
              <p className="text-xs text-white/25 mt-0.5">{alt.issue}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-white/50">
          Pikku: <span className="text-emerald-400">just a function.</span> Same auth, same types, same deploy.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. CTA
   ════════════════════════════════════════════════════════════════ */

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Ship your first workflow in 5 minutes.
        </h2>
        <p className="mt-4 text-base text-white/40 max-w-md mx-auto">
          Write a workflow. Deploy to Fabric. Watch it run with full traces.
        </p>

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

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */

export default function WorkflowsPage() {
  return (
    <Layout
      title="Durable Workflows — Pikku Fabric"
      description="Write multi-step workflows as sequential TypeScript code. Pikku persists each step, retries failures, and resumes on restart. No external workflow engine required."
    >
      <Hero />
      <main>
        <Problem />
        <TheCode />
        <HowTheyRun />
        <VsAlternatives />
        <CTA />
      </main>
    </Layout>
  );
}
