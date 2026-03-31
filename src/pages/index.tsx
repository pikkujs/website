import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, Terminal } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. HERO — name the pain, not the product
   ════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="hero-framework relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-[50%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-12 lg:pt-36 lg:pb-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/50 mb-6">
          TypeScript backend framework
        </p>
        <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-bold tracking-[-0.04em] leading-[1.08] text-white">
          Same logic. Different handler.
          <br />
          <span className="text-white/25">Every time.</span>
        </h1>

        <p className="mt-7 text-[1.1rem] text-white/35 max-w-[540px] mx-auto leading-[1.75]">
          You write a function, then rewrite it as an API route, a queue consumer, a cron handler, an MCP tool. Each with its own validation, auth, and error handling. Pikku stops that.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <Link
            to="/getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[0.875rem] font-semibold text-[#0a0a0f] transition hover:bg-white/90 no-underline"
          >
            <Terminal className="w-3.5 h-3.5" />
            npx create-pikku
          </Link>
          <Link
            to="#before-after"
            className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-[0.875rem] font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white/80 no-underline"
          >
            See the difference
          </Link>
        </div>

        <p className="mt-4 text-[0.75rem] text-white/15">
          Working app in under 5 minutes. TypeScript, open-source, zero lock-in.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. BEFORE / AFTER — the conversion section
   ════════════════════════════════════════════════════════════════ */

const withoutPikku = `// routes/send-reminder.ts
app.post('/send-reminder', authMiddleware, async (req, res) => {
  const { userId, urgency } = validateInput(req.body)
  const user = await db.users.find(userId)
  await email.send({ to: user.email, template: 'reminder', urgency })
  res.json({ sent: true })
})

// workers/billing-reminders.ts
queue.process('billing-reminders', async (job) => {
  const { userId, urgency } = validateInput(job.data)
  const session = await getSystemSession()
  checkPermissions(session, 'sendReminder')
  const user = await db.users.find(userId)
  await email.send({ to: user.email, template: 'reminder', urgency })
})

// cron/daily-reminders.ts
cron.schedule('0 9 * * *', async () => {
  const { userId, urgency } = validateInput(config.dailyReminder)
  const session = await getSystemSession()
  checkPermissions(session, 'sendReminder')
  const user = await db.users.find(userId)
  await email.send({ to: user.email, template: 'reminder', urgency })
})`;

const withPikkuFunction = `export const sendReminder = pikkuFunc({
  title: 'Send a billing reminder',
  description: 'Sends an email reminder to a user based on urgency level',
  tags: ['billing', 'notifications'],
  input: z.object({ userId: z.string(), urgency: z.enum(['low', 'high']) }),
  output: z.object({ sent: z.boolean() }),
  permissions: { user: isAuthenticated },  // enforced on every surface
  mcp: true,                               // expose as MCP tool
  approvalRequired: true,                  // agent must ask before calling
  approvalDescription: async (_s, { userId }) =>  // shown to user for approval
    \`Send billing reminder to user \${userId}\`,
  func: async ({ db, email }, { userId, urgency }) => {
    const user = await db.users.find(userId)
    await email.send({ to: user.email, template: 'reminder', urgency })
    return { sent: true }
  },
})`;

const withPikkuWiring = `wireHTTP({ method: 'post', route: '/send-reminder', func: sendReminder })
wireQueue({ queue: 'billing-reminders', func: sendReminder })
wireScheduler({ schedule: '0 9 * * *', func: sendReminder })
pikkuAIAgent({
  name: 'billing-assistant',
  instruction: 'You help users manage billing reminders and invoices.',
  tools: [sendReminder],
})`;

function BeforeAfter() {
  const [tab, setTab] = React.useState<'without' | 'function' | 'wiring'>('without');

  return (
    <section id="before-after" className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-4">The difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            One function instead of three handlers.
          </h2>
          <p className="mt-4 text-base text-white/35 leading-relaxed">
            Without Pikku, the same business logic gets rewritten for every protocol — with separate validation, auth, and error handling each time. With Pikku, you write it once.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-1 border-b border-white/[0.06] pb-0">
          <button
            onClick={() => setTab('without')}
            className={`px-4 py-2.5 text-[0.8125rem] font-medium transition-colors cursor-pointer bg-transparent border-0 border-b-2 -mb-[1px] ${
              tab === 'without'
                ? 'text-white/70 border-white/30'
                : 'text-white/25 border-transparent hover:text-white/40'
            }`}
          >
            Without Pikku <span className="text-white/15 ml-1.5">3 files</span>
          </button>
          <button
            onClick={() => setTab('function')}
            className={`px-4 py-2.5 text-[0.8125rem] font-medium transition-colors cursor-pointer bg-transparent border-0 border-b-2 -mb-[1px] ${
              tab === 'function'
                ? 'text-emerald-400/80 border-emerald-400/50'
                : 'text-white/25 border-transparent hover:text-white/40'
            }`}
          >
            With Pikku <span className="text-white/15 ml-1.5">1 function</span>
          </button>
          <button
            onClick={() => setTab('wiring')}
            className={`px-4 py-2.5 text-[0.8125rem] font-medium transition-colors cursor-pointer bg-transparent border-0 border-b-2 -mb-[1px] ${
              tab === 'wiring'
                ? 'text-emerald-400/80 border-emerald-400/50'
                : 'text-white/25 border-transparent hover:text-white/40'
            }`}
          >
            Wiring <span className="text-white/15 ml-1.5">4 lines</span>
          </button>
        </div>

        <div className="rounded-b-xl border border-t-0 border-white/[0.06] bg-[#08080d] overflow-hidden [&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
          {tab === 'without' && <CodeBlock language="typescript">{withoutPikku}</CodeBlock>}
          {tab === 'function' && <CodeBlock language="typescript">{withPikkuFunction}</CodeBlock>}
          {tab === 'wiring' && <CodeBlock language="typescript">{withPikkuWiring}</CodeBlock>}
        </div>

        {tab === 'without' && (
          <p className="mt-4 text-[0.8125rem] text-white/20">
            Same validation, same auth checks, same logic — written three times. And this is only three protocols.
          </p>
        )}
        {tab === 'function' && (
          <p className="mt-4 text-[0.8125rem] text-emerald-400/40">
            One function. Typed I/O, permissions, MCP exposure, and approval gates — declared once, enforced everywhere.
          </p>
        )}
        {tab === 'wiring' && (
          <p className="mt-4 text-[0.8125rem] text-emerald-400/40">
            Wire the same function to any combination of surfaces. Add more anytime — the function doesn't change.
          </p>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. ESCAPE HATCH — direct trust statement
   ════════════════════════════════════════════════════════════════ */

function EscapeHatch() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Your functions are just TypeScript.
          </h2>
          <div className="space-y-3 text-[0.9375rem] text-white/40 leading-relaxed">
            <p>
              Pikku is a wiring layer, not a runtime. Your function receives typed input and injected services. Inside it, use any npm package, any database driver, any API client.
            </p>
            <p>
              Need raw request access? Escape hatches exist. Need to self-host? Run on Fastify, Express, Lambda, Cloudflare Workers, or Bun. The framework is open-source and MIT-licensed.
            </p>
            <p className="text-white/25">
              If you stop using Pikku tomorrow, your business logic still works.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. HOW IT WORKS — compressed, scannable
   ════════════════════════════════════════════════════════════════ */

const capabilities = [
  { label: 'HTTP APIs',    detail: 'REST routes with OpenAPI generation', color: '#34d399' },
  { label: 'Queues',       detail: 'Background jobs with retries', color: '#f87171' },
  { label: 'Cron',         detail: 'Managed scheduled execution', color: '#fbbf24' },
  { label: 'WebSocket',    detail: 'Typed realtime channels', color: '#a78bfa' },
  { label: 'AI Agents',    detail: 'LLM tools with approval gates', color: '#f472b6' },
  { label: 'MCP',          detail: 'Model Context Protocol server', color: '#22d3ee' },
  { label: 'CLI',          detail: 'Command-line interfaces', color: '#60a5fa' },
  { label: 'RPC',          detail: 'Direct function calls', color: '#c084fc' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            Write a function. Wire it to anything.
          </h2>
          <p className="mt-4 text-base text-white/35 max-w-lg leading-relaxed">
            Every function gets typed I/O, permissions, and services injected automatically. The function never knows which protocol called it.
          </p>
        </div>

        {/* Capabilities as a compact grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-14">
          {capabilities.map((c) => (
            <div key={c.label} className="rounded-lg border border-white/[0.05] bg-white/[0.015] px-3.5 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color, opacity: 0.6 }} />
                <span className="text-[0.8125rem] font-semibold text-white/70">{c.label}</span>
              </div>
              <p className="text-[0.6875rem] text-white/20 leading-snug">{c.detail}</p>
            </div>
          ))}
        </div>

        {/* Framework features — not a grid, a tight list */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-white mb-2">End-to-end type safety</h3>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed">
              Zod schemas validate at runtime. TypeScript types flow from function definition to auto-generated clients. No drift.
            </p>
          </div>
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-white mb-2">Built-in auth and permissions</h3>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed">
              Session management, JWT, and role-based access — declared once on the function, enforced on every surface.
            </p>
          </div>
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-white mb-2">Auto-generated OpenAPI</h3>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed">
              Your API spec stays in sync with your code. Routes, schemas, and permissions — always accurate.
            </p>
          </div>
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-white mb-2">Any runtime</h3>
            <p className="text-[0.8125rem] text-white/30 leading-relaxed">
              Fastify, Express, Lambda, Cloudflare Workers, Bun, Next.js. Same Pikku project, your infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. FABRIC — optional deployment, earns its place
   ════════════════════════════════════════════════════════════════ */

function Fabric() {
  return (
    <section className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/60 mb-4">Pikku Fabric</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            Deploy the whole backend with one command.
          </h2>
          <p className="mt-4 text-base text-white/35 max-w-lg leading-relaxed">
            Fabric reads your Pikku project and deploys each function as a serverless worker. Optional — you can always self-host.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Terminal */}
          <div className="rounded-xl border border-white/[0.08] bg-[#08080d] overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/12" />
              <span className="h-2 w-2 rounded-full bg-white/12" />
              <span className="ml-3 text-[11px] text-white/20 font-mono">terminal</span>
            </div>
            <div className="p-5 font-mono text-[13px] leading-[1.85]">
              <div><span className="text-white/25">$ </span><span className="text-white/50">pikku deploy</span></div>
              <div className="mt-3 text-white/60 font-semibold">  sendReminder</div>
              <div className="text-emerald-400/50">    + POST /send-reminder         api</div>
              <div className="text-red-400/50">    + billing-reminders           queue</div>
              <div className="text-yellow-400/50">    + 0 9 * * * (daily)           cron</div>
              <div className="text-violet-400/50">    + billing-assistant           agent</div>
              <div className="mt-3"><span className="text-emerald-400/80 font-semibold">  ✓ deployed to production</span></div>
              <div className="text-white/25">    mode: serverless</div>
              <div className="text-white/15">    scales to zero · $0 when idle</div>
            </div>
          </div>

          {/* Fabric features */}
          <div className="space-y-4">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-4">
              <h3 className="text-[0.875rem] font-semibold text-white mb-1">Serverless by default</h3>
              <p className="text-[0.8125rem] text-white/30">Each function becomes an independent worker. Scales to zero. Pay only when functions execute.</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-4">
              <h3 className="text-[0.875rem] font-semibold text-white mb-1">Server mode when you need it</h3>
              <p className="text-[0.8125rem] text-white/30">One flag: <code className="text-white/40 text-xs">--mode server</code>. Runs on Fastify, Express, or any Node/Bun runtime.</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-4">
              <h3 className="text-[0.875rem] font-semibold text-white mb-1">Eject anytime</h3>
              <p className="text-[0.8125rem] text-white/30">Fabric is optional. Self-host on any cloud, any runtime. The framework is yours regardless.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. PRICING + CTA
   ════════════════════════════════════════════════════════════════ */

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">Pricing</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Open Source — visually dominant */}
          <div className="rounded-xl p-6 flex flex-col border-2 border-primary/30 bg-primary/[0.03]">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Open Source</h3>
              <p className="text-2xl font-bold text-white mt-1">Free</p>
              <p className="text-xs text-white/25 mt-0.5">forever</p>
              <p className="text-[0.8125rem] text-white/35 mt-2">The full framework. Self-host anywhere.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {['All protocols (HTTP, WS, Queue, Cron, MCP, Agent)', 'Any runtime (Fastify, Lambda, Cloudflare, Bun)', 'CLI with plan/apply', 'Community support'].map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-[0.8125rem] text-white/45">
                  <span className="text-emerald-400/70 text-xs mt-0.5">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/getting-started" className="block text-center rounded-lg px-5 py-2.5 text-[0.875rem] font-semibold bg-white text-[#0a0a0f] hover:bg-white/90 transition no-underline">
                Get started
              </Link>
            </div>
          </div>

          {/* Fabric */}
          <div className="rounded-xl p-6 flex flex-col border border-white/[0.06] bg-white/[0.015]">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Fabric</h3>
              <p className="text-2xl font-bold text-white mt-1">$20/mo</p>
              <p className="text-xs text-white/25 mt-0.5">scales to zero · $0 when idle</p>
              <p className="text-[0.8125rem] text-white/35 mt-2">Serverless deployment platform.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {['Everything in Open Source', 'Per-function serverless workers', 'Metrics, logs, deployments', 'Environments, previews, rollbacks', 'Eject anytime'].map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-[0.8125rem] text-white/45">
                  <span className="text-emerald-400/70 text-xs mt-0.5">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="#waitlist" className="block text-center rounded-lg px-5 py-2.5 text-[0.875rem] font-semibold border border-white/[0.12] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] transition no-underline">
                Join the waitlist
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div className="rounded-xl p-6 flex flex-col border border-white/[0.06] bg-white/[0.015]">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Enterprise</h3>
              <p className="text-2xl font-bold text-white mt-1">Custom</p>
              <p className="text-xs text-white/25 mt-0.5">annual license</p>
              <p className="text-[0.8125rem] text-white/35 mt-2">Deploy to your own cloud.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {['Everything in Fabric', 'BYOK — your Cloudflare, AWS, or GCP', 'SSO / SAML + SLAs', 'Dedicated support'].map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-[0.8125rem] text-white/45">
                  <span className="text-emerald-400/70 text-xs mt-0.5">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="mailto:hello@pikku.dev" className="block text-center rounded-lg px-5 py-2.5 text-[0.875rem] font-semibold border border-white/[0.12] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] transition no-underline">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   7. WAITLIST — Fabric early access
   ════════════════════════════════════════════════════════════════ */

function Waitlist() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/60 mb-4">Fabric</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
          Get early access.
        </h2>
        <p className="mt-4 text-base text-white/35">
          Serverless deployment for Pikku. One email when it ships.
        </p>

        {submitted ? (
          <div className="mt-10 py-5">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-medium text-[0.9375rem]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              You're on the list.
            </div>
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
                className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-[0.875rem] text-white placeholder-white/20 outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-5 py-3 text-[0.875rem] font-semibold text-[#0a0a0f] transition hover:bg-white/90 cursor-pointer flex-shrink-0"
              >
                Join waitlist
              </button>
            </div>
            <p className="mt-3 text-xs text-white/12">No spam.</p>
          </form>
        )}

        <div className="mt-14 pt-8 border-t border-white/[0.05]">
          <p className="text-[0.8125rem] text-white/25">The framework is available now.</p>
          <div className="mt-4">
            <Link
              to="/getting-started"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] px-4 py-2 text-xs font-medium text-primary/80 transition hover:bg-primary/[0.1] no-underline"
            >
              Get started with Pikku <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
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
      title="Pikku — Same logic. Different handler. Every time."
      description="TypeScript backend framework. Write a function once, wire it to HTTP, queues, cron, WebSocket, MCP, and AI agents. Open-source, any runtime, zero lock-in."
    >
      <Hero />
      <main>
        <BeforeAfter />
        <EscapeHatch />
        <HowItWorks />
        <Fabric />
        <Pricing />
        <Waitlist />
      </main>
    </Layout>
  );
}
