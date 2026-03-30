import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, RotateCcw } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. HERO
   ════════════════════════════════════════════════════════════════ */

const planLines = [
  { text: '+ POST /send-reminder',   surface: 'api',     color: '#34d399' },
  { text: '+ billing-reminders',     surface: 'queue',   color: '#f87171' },
  { text: '+ 0 9 * * * (daily)',     surface: 'cron',    color: '#fbbf24' },
  { text: '+ reminder.sent',         surface: 'realtime', color: '#a78bfa' },
  { text: '+ billing-assistant',     surface: 'agent',   color: '#f472b6' },
];

function SystemCard() {
  const [key, setKey] = React.useState(0);
  const [phase, setPhase] = React.useState<'idle' | 'plan' | 'deploy' | 'output' | 'done'>('done');

  React.useEffect(() => {
    setPhase('idle');
    const t1 = setTimeout(() => setPhase('plan'), 300);
    const t2 = setTimeout(() => setPhase('deploy'), 2200);
    const t3 = setTimeout(() => setPhase('output'), 3000);
    const t4 = setTimeout(() => setPhase('done'), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [key]);

  const replay = () => setKey((k) => k + 1);

  const showPlan = phase !== 'idle';
  const showDeploy = phase === 'deploy' || phase === 'output' || phase === 'done';
  const showOutput = phase === 'output' || phase === 'done';
  const isDone = phase === 'done';

  return (
    <div className={`system-card rounded-xl border overflow-hidden transition-all duration-700 ${isDone ? 'system-card-done border-white/[0.1]' : 'border-white/[0.08]'}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 bg-white/[0.02]">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="ml-3 text-[11px] text-white/20 font-mono tracking-wide flex-1">terminal</span>
        {isDone && (
          <button
            onClick={replay}
            className="text-white/15 hover:text-white/40 transition-colors cursor-pointer bg-transparent border-0 p-0"
            aria-label="Replay animation"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="p-5 font-mono text-[13px] leading-[1.85] bg-[#08080d]">
        {/* pikku plan command */}
        <div className={`transition-opacity duration-300 ${showPlan ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white/25">$ </span><span className="text-white/50">pikku plan</span>
        </div>

        {/* Plan output — function + surfaces */}
        {showPlan && (
          <div className="mt-3">
            <div className="deploy-line-enter text-white/70 font-semibold">  sendReminder</div>
            {planLines.map((line, i) => (
              <div
                key={line.text}
                className="deploy-line-enter flex justify-between gap-4"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span style={{ color: line.color }} className="opacity-50">    {line.text}</span>
                <span className="text-white/20">{line.surface}</span>
              </div>
            ))}
          </div>
        )}

        {/* pikku deploy command */}
        {showDeploy && (
          <div className="mt-5 pt-4 border-t border-white/[0.05]">
            <div className="deploy-line-enter">
              <span className="text-white/25">$ </span><span className="text-white/50">pikku deploy</span>
            </div>
          </div>
        )}

        {/* Deploy output */}
        {showOutput && (
          <div className="mt-3">
            <div className="deploy-line-enter" style={{ animationDelay: '0ms' }}>
              <span className="text-emerald-400/80 font-semibold">  ✓ deployed to production</span>
            </div>
            <div className="deploy-line-enter" style={{ animationDelay: '120ms' }}>
              <span className="text-white/25">    mode: serverless</span>
            </div>
            <div className="deploy-line-enter" style={{ animationDelay: '240ms' }}>
              <span className="text-white/15">    scales to zero · $0 when idle</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-fabric relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-[55%] top-[35%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="absolute left-[35%] top-[65%] w-[400px] h-[300px] rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/70 mb-5">
              Pikku Fabric
            </p>
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.4rem] font-bold tracking-[-0.035em] leading-[1.1] text-white">
              Deploy a complete backend from one codebase.
            </h1>

            <p className="mt-6 text-[1.05rem] text-white/40 max-w-[520px] leading-[1.7]">
              Write your functions once. Fabric deploys them as APIs, queues, cron jobs, realtime channels, and agents — serverless, scales to zero.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/getting-started"
                className="inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3 text-[0.875rem] font-semibold text-[#0a0a0f] transition hover:bg-white/90 no-underline"
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="#how-it-works"
                className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-[0.875rem] font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white/90 no-underline"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-5 text-[0.8rem] text-white/20">
              <Link to="/framework" className="text-white/30 underline decoration-white/10 underline-offset-2 hover:text-white/50 transition-colors">
                Pikku
              </Link>{' '}
              is the open-source framework. Fabric is how you deploy it.
            </p>
          </div>

          {/* Right: system card */}
          <div className="hidden lg:block">
            <SystemCard />
          </div>

          {/* Mobile: compact system card */}
          <div className="lg:hidden">
            <SystemCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. HOW IT WORKS — write → wire → deploy
   ════════════════════════════════════════════════════════════════ */

const steps = [
  {
    num: '01',
    title: 'Write functions',
    desc: 'Typed I/O, permissions, MCP exposure, approval gates — one declaration.',
    lang: 'typescript',
    code: `export const sendReminder = pikkuFunc({
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
})`,
  },
  {
    num: '02',
    title: 'Wire to surfaces',
    desc: 'Same function. API, queue, cron, realtime, agent, MCP — any combination.',
    lang: 'typescript',
    code: `wireHTTP({ method: 'post', route: '/send-reminder', func: sendReminder })
wireQueue({ queue: 'billing-reminders', func: sendReminder })
wireScheduler({ schedule: '0 9 * * *', func: sendReminder })
pikkuAIAgent({
  name: 'billing-assistant',
  instruction: 'You help users manage billing reminders and invoices.',
  tools: [sendReminder],
})`,
  },
  {
    num: '03',
    title: 'Deploy with Fabric',
    desc: 'One command. Every surface becomes a serverless worker. Or switch to server mode.',
    lang: 'bash',
    code: `$ pikku deploy

Deploying 12 functions...
+ API      /send-reminder         → worker
+ Queue    billing-reminders      → worker
+ Cron     daily 09:00            → worker
+ MCP      sendReminder           → tool
+ Agent    billing-assistant      → worker

✓ deployed · serverless · production`,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            Write. Wire. Deploy.
          </h2>
          <p className="mt-4 text-base text-white/35 max-w-lg leading-relaxed">
            Define backend logic once. Wire it to any protocol. Deploy everything with one command.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.num}>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-[0.7rem] font-mono font-bold text-white/15 tracking-widest">{step.num}</span>
                <div>
                  <span className="text-[0.9375rem] font-semibold text-white">{step.title}</span>
                  <span className="text-[0.8125rem] text-white/30 ml-3">{step.desc}</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#08080d] overflow-hidden [&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language={step.lang}>{step.code}</CodeBlock>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. SERVERLESS + SERVERS — deployment flexibility
   ════════════════════════════════════════════════════════════════ */

function DeployModes() {
  return (
    <section className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-4">Deployment</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            Serverless by default. Servers when you need them.
          </h2>
          <p className="mt-4 text-base text-white/35 max-w-lg leading-relaxed">
            Fabric deploys each function as a serverless worker. Switch to server mode with one flag — same codebase, same deploy command.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Serverless */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-[0.8125rem] font-semibold uppercase tracking-widest text-emerald-400/80">Serverless</p>
            </div>
            <p className="text-[0.875rem] text-white/40 leading-relaxed mb-4">
              Default mode. Each function becomes an independent worker. Scales to zero. Pay only when functions execute.
            </p>
            <div className="rounded-lg bg-black/30 p-4 font-mono text-[12px] leading-[1.8] text-white/35">
              <div>$ pikku deploy</div>
              <div className="text-emerald-400/60 mt-1">✓ 12 functions → serverless workers</div>
              <div className="text-white/20">scales to zero · $0 when idle</div>
            </div>
          </div>

          {/* Server */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <p className="text-[0.8125rem] font-semibold uppercase tracking-widest text-white/40">Server mode</p>
            </div>
            <p className="text-[0.875rem] text-white/40 leading-relaxed mb-4">
              Same project. One flag. Runs on Fastify, Express, or any Node/Bun runtime. Full control when you need it.
            </p>
            <div className="rounded-lg bg-black/30 p-4 font-mono text-[12px] leading-[1.8] text-white/35">
              <div>$ pikku deploy --mode server</div>
              <div className="text-white/40 mt-1">✓ 12 functions → fastify server</div>
              <div className="text-white/20">port 3000 · your infrastructure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. BUILT ON PIKKU — framework + zero lock-in
   ════════════════════════════════════════════════════════════════ */

const frameworkPoints = [
  { title: 'End-to-end type safety', desc: 'Zod schemas, typed services, auto-generated clients. Compile-time guarantees across the stack.' },
  { title: 'Built-in auth and permissions', desc: 'Session management, JWT, and role-based access baked into every function invocation.' },
  { title: 'Auto-generated OpenAPI', desc: 'API spec stays in sync with your code. Always accurate, never stale.' },
  { title: 'Any runtime', desc: 'Fastify, Express, Lambda, Cloudflare Workers, Bun. Same project, your choice.' },
  { title: 'Zero lock-in', desc: 'Eject from Fabric anytime. Self-host on any cloud or your own servers. The framework is yours.' },
  { title: 'Typed clients', desc: 'Generated HTTP, WebSocket, and RPC clients. No manual typing, no drift.' },
];

function BuiltOnPikku() {
  return (
    <section className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/50 mb-4">Open-source framework</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
            Built on Pikku.
          </h2>
          <p className="mt-4 text-base text-white/35 max-w-lg leading-relaxed">
            Fabric deploys what Pikku defines. The framework is open-source, runtime-agnostic, and yours to keep — regardless of how you deploy.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {frameworkPoints.map((p) => (
            <div key={p.title} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-5">
              <h3 className="text-[0.875rem] font-semibold text-white mb-1.5">{p.title}</h3>
              <p className="text-[0.8125rem] text-white/30 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/framework"
            className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-white/30 hover:text-white/60 transition-colors no-underline"
          >
            Explore the framework <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. PRICING
   ════════════════════════════════════════════════════════════════ */

function Pricing() {
  const tiers = [
    {
      name: 'Open Source',
      price: 'Free',
      sub: 'forever',
      desc: 'The full framework. Self-host anywhere.',
      features: [
        'All wiring types (HTTP, WS, Queue, Cron, MCP, Agent)',
        'Any runtime (Fastify, Lambda, Cloudflare, Bun)',
        'CLI with plan/apply',
        'Community support',
      ],
      cta: { label: 'Get started', to: '/getting-started' },
      accent: true,
    },
    {
      name: 'Fabric',
      price: '$20/mo',
      sub: 'scales to zero · $0 when idle',
      desc: 'Serverless deployment platform.',
      features: [
        'Everything in Open Source',
        'Per-function serverless workers',
        'Metrics, logs, deployments dashboard',
        'Smart versioning with auto-drain',
        'Environments, previews, rollbacks',
        'Eject anytime — zero lock-in',
      ],
      cta: { label: 'Join the waitlist', to: '#waitlist' },
      accent: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      sub: 'annual license',
      desc: 'Deploy to your own cloud.',
      features: [
        'Everything in Fabric',
        'BYOK — deploy to your Cloudflare, AWS, or GCP',
        'SSO / SAML + SLAs',
        'Dedicated support',
      ],
      cta: { label: 'Contact us', to: 'mailto:hello@pikku.dev' },
      accent: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">Pricing</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 flex flex-col ${
                tier.accent
                  ? 'border-2 border-primary/30 bg-primary/[0.03]'
                  : 'border border-white/[0.06] bg-white/[0.015]'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">{tier.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{tier.price}</p>
                {tier.sub && <p className="text-xs text-white/25 mt-0.5">{tier.sub}</p>}
                <p className="text-[0.8125rem] text-white/35 mt-2">{tier.desc}</p>
              </div>
              <div className="space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-[0.8125rem] text-white/45">
                    <span className="text-emerald-400/70 text-xs mt-0.5">✓</span>{f}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to={tier.cta.to}
                  className={`block text-center rounded-lg px-5 py-2.5 text-[0.875rem] font-semibold transition no-underline ${
                    tier.accent
                      ? 'bg-white text-[#0a0a0f] hover:bg-white/90'
                      : 'border border-white/[0.12] bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
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
   6. WAITLIST
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
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
            <p className="mt-2 text-[0.8125rem] text-white/25">We'll be in touch when Fabric launches.</p>
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
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/getting-started"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] px-4 py-2 text-xs font-medium text-primary/80 transition hover:bg-primary/[0.1] no-underline"
            >
              Get started with Pikku <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/docs"
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/40 transition hover:bg-white/[0.05] hover:text-white/60 no-underline"
            >
              Read the docs
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
      title="Pikku Fabric — Deploy a complete backend from one codebase"
      description="Write your functions once. Fabric deploys them as APIs, queues, cron jobs, realtime channels, and agents — serverless, scales to zero."
    >
      <Hero />
      <main>
        <HowItWorks />
        <DeployModes />
        <BuiltOnPikku />
        <Pricing />
        <Waitlist />
      </main>
    </Layout>
  );
}
