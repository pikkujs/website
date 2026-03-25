import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, Terminal, Globe, Zap, FileCode } from 'lucide-react';

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          CLI + API from
          <br />
          <span className="text-cyan-400">the same function.</span>
        </h1>
        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Write your business logic once. Get a REST API for your app, a CLI
          for your team, and an RPC client for internal services — all with
          the same auth and validation.
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
          Your team needs a CLI to manage users. Your app needs an API for the
          same operations. Your internal service needs an RPC client. So you
          write the logic three times — once per entry point.
          <span className="text-white/70"> Then someone fixes a bug in the CLI and forgets the API.</span>
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
            One function. Three entry points.
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/[0.06] text-xs text-white/25 font-mono">functions + wiring</div>
            <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
              <CodeBlock language="typescript">{`// The function — written once
const resetPassword = pikkuFunc({
  input: z.object({ userId: z.string(), notify: z.boolean().default(true) }),
  output: z.object({ success: z.boolean() }),
  func: async ({ db, email }, { userId, notify }) => {
    const token = await db.resetTokens.create({ userId })
    if (notify) await email.send({ to: userId, template: 'reset', token })
    return { success: true }
  },
  permissions: { admin: isAdmin },
})

// Wire to API (for the app)
wireHTTP({ method: 'post', route: '/admin/reset-password', func: resetPassword })

// Wire to CLI (for the team)
wireCLI({ program: 'admin', commands: {
  'reset-password': pikkuCLICommand({
    parameters: '<userId>',
    options: { notify: { flag: '--no-notify', default: true } },
    func: resetPassword,
  }),
}})

// Wire to RPC (for internal services)
wireRPC({ func: resetPassword })`}</CodeBlock>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-white/20 font-mono">all three work</span>
            </div>
            <div className="p-5 font-mono text-[12px] leading-7">
              <div className="text-white/30"># API</div>
              <div className="text-cyan-400">  curl -X POST /admin/reset-password <span className="text-white/20">-d '{"{"}"userId":"usr_1"{"}"}'</span></div>
              <div className="mt-3 text-white/30"># CLI</div>
              <div className="text-cyan-400">  pikku admin reset-password usr_1 <span className="text-white/20">--no-notify</span></div>
              <div className="mt-3 text-white/30"># RPC (from another service)</div>
              <div className="text-cyan-400">  await client.resetPassword(<span className="text-white/20">{"{"} userId: 'usr_1' {"}"}</span>)</div>
              <div className="mt-3 text-white/15">  Same function. Same auth check. Same result.</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Terminal className="w-4 h-4" />, label: 'Auto-generated CLI', desc: 'Help text, arg parsing, autocomplete.' },
            { icon: <Globe className="w-4 h-4" />, label: 'REST API', desc: 'Typed endpoints + OpenAPI docs.' },
            { icon: <Zap className="w-4 h-4" />, label: 'RPC client', desc: 'Type-safe, zero-config.' },
            { icon: <FileCode className="w-4 h-4" />, label: 'Generated types', desc: 'One source of truth.' },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
              <div className="flex items-center gap-2 text-cyan-400/60 mb-1">{item.icon}<span className="text-sm font-semibold text-white/70">{item.label}</span></div>
              <p className="text-xs text-white/30">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/4 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Stop writing the same logic three times.
        </h2>
        <p className="mt-4 text-base text-white/40">One function. API, CLI, and RPC. Deploy.</p>
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

export default function InternalToolsPage() {
  return (
    <Layout
      title="Internal Tools — Pikku Fabric"
      description="Build a CLI, REST API, and RPC client from the same function. One codebase, one auth model, one deploy. No duplicate logic."
    >
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <CTA />
      </main>
    </Layout>
  );
}
