import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { WiringIcon } from '../components/WiringIcons';
import { testimonials } from '@site/data/testimonials';
import { ArrowRight } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. HERO — aspirational headline + aha visual
   ════════════════════════════════════════════════════════════════ */

const ahaOutputs = [
  { icon: 'http',      label: 'REST API',    detail: 'https://api.acme.dev/v1' },
  { icon: 'cron',      label: 'Cron job',     detail: 'Every Monday at 9am' },
  { icon: 'queue',     label: 'Queue worker', detail: 'billing.createInvoice' },
  { icon: 'workflow',  label: 'Workflow',      detail: 'Durable multi-step process' },
  { icon: 'cli',       label: 'CLI tool',     detail: 'pikku billing invoice' },
  { icon: 'mcp',       label: 'MCP tool',     detail: 'Available in Claude, Cursor' },
  { icon: 'bot',       label: 'AI agent',     detail: 'Same auth, same permissions' },
];

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.08] text-white">
            The backend you'd build
            <br />
            <span className="text-primary">if you had infinite time.</span>
          </h1>

          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Every backend needs APIs, queues, cron jobs, workflows, WebSockets, auth,
            monitoring, CLI tools, AI agents. You either spend months wiring them
            together — or you deploy typed functions and let Fabric do it.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="#waitlist" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
              Join the waitlist <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="#how-it-works" className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
              See how it works
            </Link>
          </div>
        </div>

        {/* Aha visual: function → live surfaces */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
            {/* Left: the function */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
              <div className="px-4 py-2 border-b border-white/[0.06] text-xs text-white/25 font-mono">createInvoice.ts</div>
              <pre className="p-4 font-mono text-[12px] leading-6 text-white/60 overflow-x-auto m-0">{
`export const createInvoice = pikkuFunc({
  input: z.object({
    orderId: z.string(),
    amount: z.number(),
  }),
  output: InvoiceSchema,
  func: async ({ db, email }, data) => {
    // your business logic
  },
  permissions: { user: isAuth },
})`
              }</pre>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center gap-1">
              <div className="w-16 h-[2px] bg-gradient-to-r from-primary/40 to-emerald-400/40 rounded" />
              <span className="text-[9px] font-mono text-white/20 tracking-wider">DEPLOY</span>
              <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-400/40 to-primary/40 rounded" />
            </div>
            <div className="lg:hidden flex justify-center">
              <div className="flex flex-col items-center gap-1 py-2">
                <div className="w-[2px] h-6 bg-gradient-to-b from-primary/40 to-emerald-400/40 rounded" />
                <span className="text-[9px] font-mono text-white/20 tracking-wider">DEPLOY</span>
                <div className="w-[2px] h-6 bg-gradient-to-b from-emerald-400/40 to-primary/40 rounded" />
              </div>
            </div>

            {/* Right: live surfaces */}
            <div className="space-y-2">
              {ahaOutputs.map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3.5 py-2">
                  <WiringIcon wiringId={s.icon} size={16} />
                  <span className="text-xs font-semibold text-white/70 w-20 flex-shrink-0">{s.label}</span>
                  <span className="text-xs text-white/30 font-mono truncate">{s.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-white/25 mt-6">
            Same auth. Same validation. Same types. One codebase.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. THE MIRROR — describe their current painful world
   ════════════════════════════════════════════════════════════════ */

function TheMirror() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-6">Your backend today</p>

        <p className="text-lg text-white/50 leading-relaxed">
          You set up Express for your API. Bull for your queues. A cron library
          for scheduled jobs. A separate CLI entry point. You write OpenAPI specs
          by hand. Auth is different for every surface — bearer tokens on the API,
          nothing on the CLI. When someone asks for observability, you add three
          more libraries. When the AI team wants tool access, you build another wrapper.
        </p>

        <p className="mt-6 text-lg text-white/50 leading-relaxed">
          Every piece works on its own. But nothing is connected.
          Permissions don't carry over. Types don't flow through.
          <span className="text-white/70"> You spend more time on plumbing than on the thing your code actually does.</span>
        </p>

        {testimonials[0] && (
          <div className="mt-10 border-l-2 border-primary/20 pl-4">
            <p className="text-sm text-white/40 italic leading-relaxed">
              "{testimonials[0].quote}"
            </p>
            <p className="mt-2 text-xs text-white/25 not-italic">
              — {testimonials[0].author}, {testimonials[0].role} @ {testimonials[0].company}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. HOW IT WORKS — write, wire, push
   ════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Write. Wire. Push.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto leading-relaxed">
            A typed function. A few wiring lines. A git push. That's the entire workflow.
          </p>
        </div>

        <div className="space-y-10">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">1</span>
              <div>
                <span className="text-sm font-bold text-white">Write a function</span>
                <span className="text-xs text-white/30 ml-3">Your logic. Typed inputs, outputs, permissions.</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`export const createInvoice = pikkuFunc({
  input: z.object({ orderId: z.string(), amount: z.number() }),
  output: InvoiceSchema,
  func: async ({ db, email }, { orderId, amount }) => {
    const invoice = await db.invoices.create({ orderId, amount })
    await email.send({ to: invoice.customer, template: 'invoice-created' })
    return invoice
  },
  permissions: { user: isAuthenticated },
})`}</CodeBlock>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/25">
              This function doesn't know if it's called from an API, a queue, a cron job, or an AI agent. It just does one thing.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">2</span>
              <div>
                <span className="text-sm font-bold text-white">Wire it to surfaces</span>
                <span className="text-xs text-white/30 ml-3">One line per surface. Pick any combination.</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`wireHTTP({ method: 'post', route: '/invoices', func: createInvoice })
wireScheduler({ schedule: '0 9 * * 1', func: createInvoice })
wireQueueWorker({ queue: 'billing', func: createInvoice })
wireCLI({ program: 'billing', commands: { invoice: createInvoice } })
wireBotTool({ func: createInvoice })`}</CodeBlock>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/25">
              Same function. Five surfaces. Same auth rules apply everywhere.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">3</span>
              <div>
                <span className="text-sm font-bold text-white">Push to Fabric</span>
                <span className="text-xs text-white/30 ml-3">Everything is live.</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-3 text-xs text-white/20 font-mono">terminal</span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-7">
                <div className="text-white">$ git push fabric main</div>
                <div className="mt-2 text-white/25">  Deploying to production...</div>
                <div className="mt-2" />
                <div className="text-emerald-400">  ✓ API live        <span className="text-white/25">https://api.acme.dev/v1</span></div>
                <div className="text-emerald-400">  ✓ Cron active     <span className="text-white/25">Mon 09:00</span></div>
                <div className="text-emerald-400">  ✓ Queue running   <span className="text-white/25">billing.createInvoice</span></div>
                <div className="text-emerald-400">  ✓ CLI published   <span className="text-white/25">pikku billing invoice</span></div>
                <div className="text-emerald-400">  ✓ AI tool live    <span className="text-white/25">createInvoice</span></div>
                <div className="mt-2 text-emerald-400">  ✓ Dashboard       <span className="text-white/25">https://fabric.pikku.dev/acme</span></div>
                <div className="mt-1 text-white font-semibold">  Deployed in 4.2s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. YOU VS FABRIC — what am I paying for?
   ════════════════════════════════════════════════════════════════ */

function YouVsFabric() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            You own the logic. We run everything else.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-5">You write</p>
            <div className="space-y-3">
              {[
                'Business logic as typed functions',
                'Permission rules (who can call what)',
                'Which surfaces each function runs on',
                'Service dependencies (DB, email, etc.)',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70 mb-5">Fabric handles</p>
            <div className="space-y-3">
              {[
                'Hosting and running your functions',
                'HTTP routing, WebSocket channels, queue consumers',
                'Cron scheduling and execution',
                'Durable workflows that survive restarts',
                'Auth enforcement across every surface',
                'OpenAPI spec and type-safe client generation',
                'Logs, traces, and error tracking',
                'Environments, branch previews, rollbacks',
                'MCP server — your functions as IDE tools',
                'Scaling',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="text-emerald-400 text-xs">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-white/30 mt-8">
          You maintain a folder of TypeScript functions. Fabric maintains everything else.
        </p>

        {testimonials[1] && (
          <div className="mt-10 border-l-2 border-white/10 pl-4 max-w-lg mx-auto">
            <p className="text-sm text-white/30 italic">"{testimonials[1].quote}"</p>
            <p className="mt-1 text-xs text-white/20 not-italic">
              — {testimonials[1].author}, {testimonials[1].role} @ {testimonials[1].company}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. PRICING
   ════════════════════════════════════════════════════════════════ */

function UseCases() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/50 mb-4">Use cases</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What people build with Fabric.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: '/use-cases/api-agents', label: 'API Agents', color: 'text-primary/50 hover:text-primary', border: 'hover:border-primary/20', title: 'Give your API a brain.', desc: 'Turn any OpenAPI spec into a chat assistant, CLI tools, and MCP server.' },
            { to: '/use-cases/workflows', label: 'Workflows', color: 'text-emerald-400/50 hover:text-emerald-400', border: 'hover:border-emerald-500/20', title: 'Workflows that survive anything.', desc: 'Multi-step processes with persistence, retries, and real sleep.' },
            { to: '/use-cases/scheduled-jobs', label: 'Scheduled Jobs', color: 'text-amber-400/50 hover:text-amber-400', border: 'hover:border-amber-500/20', title: 'Cron that actually works.', desc: 'Managed scheduling with retries, execution history, and alerts.' },
            { to: '/use-cases/background-jobs', label: 'Background Jobs', color: 'text-red-400/50 hover:text-red-400', border: 'hover:border-red-500/20', title: 'Queues without the infra.', desc: 'Job processing with retries, dead-letter queues, and full traces.' },
            { to: '/use-cases/internal-tools', label: 'Internal Tools', color: 'text-cyan-400/50 hover:text-cyan-400', border: 'hover:border-cyan-500/20', title: 'CLI + API from one function.', desc: 'One codebase for your API, CLI, and RPC. Same auth everywhere.' },
            { to: '/use-cases/realtime', label: 'Realtime', color: 'text-violet-400/50 hover:text-violet-400', border: 'hover:border-violet-500/20', title: 'WebSockets + SSE with types and auth.', desc: 'Typed messages, session context. No separate realtime server.' },
          ].map((uc, i) => (
            <Link
              key={i}
              to={uc.to}
              className={`group rounded-xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all hover:bg-white/[0.04] ${uc.border} no-underline`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest ${uc.color.split(' ')[0]} mb-2`}>{uc.label}</p>
              <h3 className={`text-base font-bold text-white group-${uc.color.split(' ').pop()} transition-colors`}>
                {uc.title}
              </h3>
              <p className="mt-1.5 text-sm text-white/35 leading-relaxed">{uc.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Open Source',
      price: 'Free',
      sub: 'forever',
      desc: 'Self-host on your own infra.',
      features: [
        'All 12 surfaces',
        'Any runtime (Express, Lambda, Cloudflare, etc.)',
        'Auth, clients, OpenAPI generation',
        'Community support',
      ],
      cta: { label: 'Get started', to: '/getting-started' },
      accent: false,
    },
    {
      name: 'Fabric',
      price: '$20/mo',
      sub: '1 machine included, +$10/mo per extra',
      desc: 'We host and run everything.',
      features: [
        'Everything in Open Source',
        'Managed hosting + deploys',
        'Environments, previews, rollbacks',
        'Observability + MCP server',
        'Priority support',
      ],
      cta: { label: 'Join the waitlist', to: '#waitlist' },
      accent: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      sub: 'annual contract',
      desc: 'Dedicated infra and support.',
      features: [
        'Everything in Fabric',
        'SSO / SAML + SLAs',
        'Custom integrations',
        'Dedicated support engineer',
      ],
      cta: { label: 'Contact us', to: 'mailto:hello@pikku.dev' },
      accent: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Pricing
          </h2>
          <p className="mt-4 text-base text-white/40">
            Start with the open-source framework. Upgrade to Fabric when you want managed infrastructure.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 flex flex-col ${
                tier.accent
                  ? 'border-2 border-primary/40 bg-primary/[0.04]'
                  : 'border border-white/[0.06] bg-white/[0.025]'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{tier.price}</p>
                {tier.sub && <p className="text-xs text-white/30 mt-0.5">{tier.sub}</p>}
                <p className="text-sm text-white/40 mt-2">{tier.desc}</p>
              </div>

              <div className="space-y-2.5 flex-1">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-sm text-white/55">
                    <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={tier.cta.to}
                  className={`block text-center rounded-lg px-5 py-2.5 text-sm font-semibold transition no-underline ${
                    tier.accent
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'border border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {tier.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. WAITLIST CTA
   ════════════════════════════════════════════════════════════════ */

function Waitlist() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to actual waitlist endpoint
    if (email) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute left-[40%] top-[60%] w-[400px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/50 mb-4">Coming soon</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Get early access to Fabric.
        </h2>
        <p className="mt-4 text-base text-white/40">
          We'll notify you when it's ready to deploy to.
        </p>

        {submitted ? (
          <div className="mt-10 py-5">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              You're on the list.
            </div>
            <p className="mt-2 text-sm text-white/30">We'll be in touch when Fabric launches.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.dev"
                className="flex-1 rounded-lg border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 cursor-pointer flex-shrink-0"
              >
                Join waitlist
              </button>
            </div>
            <p className="mt-3 text-xs text-white/15">
              No spam. One email when we launch.
            </p>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap justify-center gap-3">
          <Link to="/getting-started" className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white/70 no-underline">
            Try the open-source framework now
          </Link>
          <Link to="/docs" className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white/70 no-underline">
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <Layout
      title="Pikku Fabric — The Backend You'd Build If You Had Infinite Time"
      description="Deploy typed TypeScript functions and get live APIs, WebSockets, cron jobs, queues, workflows, CLI tools, MCP tools, and AI agents. Fully observable. Auth built in. Free to start."
    >
      <Hero />
      <main>
        <TheMirror />
        <HowItWorks />
        <YouVsFabric />
        <UseCases />
        <Pricing />
        <Waitlist />
      </main>
    </Layout>
  );
}
