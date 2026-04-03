import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { ArrowRight, Check } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="hero-section relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-400/70 mb-5">Pikku Fabric</p>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.1]">
          Deploy your Pikku backend.
          <br />
          <span className="text-emerald-400/80">Free to start.</span>
        </h1>
        <p className="mt-6 text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
          Push your code. Fabric deploys each function as a serverless worker — APIs, queues, cron, agents, all of it. No infrastructure to manage.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="#waitlist"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-white/90 transition no-underline"
          >
            Join the waitlist <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/getting-started"
            className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 transition no-underline"
          >
            Try the framework first
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   How Fabric works
   ════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
          {/* Terminal */}
          <div className="rounded-xl border border-white/[0.08] bg-[#08080d] overflow-hidden shadow-lg shadow-black/20">
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
              <div className="mt-3 text-white/60 font-semibold">  listTodos</div>
              <div className="text-emerald-400/50">    + GET /todos                  api</div>
              <div className="text-cyan-400/50">    + todos.list                  rpc</div>
              <div className="mt-3"><span className="text-emerald-400/80 font-semibold">  ✓ deployed to production</span></div>
              <div className="text-white/25">    mode: serverless</div>
              <div className="text-white/15">    scales to zero</div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              One command. Everything deploys.
            </h2>
            <p className="text-base text-white/40 leading-relaxed mb-6">
              Fabric reads your Pikku project and deploys each function as an independent serverless worker. HTTP routes, queue consumers, cron jobs, AI agents — all deployed and wired automatically.
            </p>
            <div className="space-y-3">
              {[
                'Serverless by default — scales to zero, $0 when idle',
                'Environments, branch previews, rollbacks',
                'Logs, metrics, and error tracking per function',
                'Server mode available: --mode server',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/45">
                  <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0" />
                  {item}
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
   No lock-in
   ════════════════════════════════════════════════════════════════ */

function NoLockIn() {
  return (
    <section className="py-16 lg:py-20 border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Fabric is optional. Your code is yours.
        </h2>
        <p className="text-base text-white/35 max-w-xl mx-auto leading-relaxed">
          Pikku is open-source and runs on any runtime — Fastify, Express, Lambda, Cloudflare Workers, Bun. Fabric is the fastest way to deploy, but you can self-host the same code anytime.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Pricing
   ════════════════════════════════════════════════════════════════ */

const tiers = [
  {
    name: 'Open Source',
    price: 'Free',
    period: 'forever',
    desc: 'The full framework. Self-host on your infrastructure.',
    features: [
      'All 12 wiring types',
      'Any runtime (Fastify, Lambda, Cloudflare, Bun…)',
      'Type-safe clients + OpenAPI generation',
      'Auth, permissions, middleware',
      'Console, CLI, VS Code extension',
      'MIT licensed',
    ],
    cta: { label: 'Get started', to: '/getting-started' },
    accent: false,
  },
  {
    name: 'Fabric Starter',
    price: 'Free',
    period: '100K invocations / month',
    desc: 'Deploy your Pikku project for free.',
    features: [
      'Everything in Open Source',
      'Serverless deployment',
      '100,000 function invocations / month',
      '1 environment',
      'Logs and basic metrics',
      'Community support',
    ],
    cta: { label: 'Join the waitlist', to: '#waitlist' },
    accent: true,
    badge: 'Coming soon',
  },
  {
    name: 'Fabric Pro',
    price: '$29/mo',
    period: '2M invocations included',
    desc: 'For production workloads that need room to grow.',
    features: [
      'Everything in Starter',
      '2,000,000 invocations / month',
      'Overage: $0.50 per million',
      'Unlimited environments + previews',
      'Rollbacks and version draining',
      'Full observability: traces, logs, errors',
      'Priority support',
    ],
    cta: { label: 'Join the waitlist', to: '#waitlist' },
    accent: false,
    badge: 'Coming soon',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    desc: 'Dedicated infrastructure, SLAs, and your own cloud.',
    features: [
      'Everything in Pro',
      'BYOK — deploy to your Cloudflare, AWS, or GCP',
      'Custom invocation limits',
      'SSO / SAML',
      'SLA guarantees',
      'Dedicated support engineer',
    ],
    cta: { label: 'Contact us', to: 'mailto:hello@pikku.dev' },
    accent: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Pricing</h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            The framework is free forever. Fabric adds managed serverless deployment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 flex flex-col relative ${
                tier.accent
                  ? 'border-2 border-emerald-500/30 bg-emerald-500/[0.04]'
                  : 'border border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-2.5 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {tier.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">{tier.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{tier.price}</p>
                <p className="text-xs text-white/25 mt-0.5">{tier.period}</p>
                <p className="text-sm text-white/35 mt-2">{tier.desc}</p>
              </div>
              <div className="space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-white/45">
                    <Check className="w-3.5 h-3.5 text-emerald-400/60 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to={tier.cta.to}
                  className={`block text-center rounded-lg px-5 py-2.5 text-sm font-semibold transition no-underline ${
                    tier.accent
                      ? 'bg-white text-[#0a0a0f] hover:bg-white/90'
                      : 'border border-white/12 bg-white/5 text-white/70 hover:bg-white/10'
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
   FAQ
   ════════════════════════════════════════════════════════════════ */

const faqs = [
  {
    q: 'Can I use Pikku without Fabric?',
    a: 'Yes. Pikku is open-source and runs on any runtime. Fabric is optional managed deployment.',
  },
  {
    q: 'What counts as an invocation?',
    a: 'Each time a function is called — via HTTP request, queue message, cron tick, agent tool call, etc. One invocation = one function execution.',
  },
  {
    q: 'What happens when I hit the Starter limit?',
    a: 'Requests are rejected until the next month. Upgrade to Pro for higher limits and overage billing.',
  },
  {
    q: 'Can I migrate from self-hosted to Fabric?',
    a: 'Yes. Same code, same project. Push to Fabric instead of deploying to your own infra. No rewrites.',
  },
  {
    q: 'When does Fabric launch?',
    a: 'Fabric is in development. Join the waitlist to get early access.',
  },
];

function FAQ() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-sm font-semibold text-white mb-1.5">{faq.q}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Waitlist
   ════════════════════════════════════════════════════════════════ */

function Waitlist() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-lg px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Get early access to Fabric.
        </h2>
        <p className="mt-4 text-base text-white/35">
          One email when it launches. No spam.
        </p>

        {submitted ? (
          <div className="mt-10 py-5">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
              <Check className="w-5 h-5" />
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
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-white/90 transition cursor-pointer flex-shrink-0"
              >
                Join waitlist
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */

export default function FabricPage() {
  return (
    <Layout
      title="Pikku Fabric — Deploy your Pikku backend"
      description="Serverless deployment for Pikku. Push your code, everything deploys. Free to start, scales with you."
    >
      <Hero />
      <main>
        <HowItWorks />
        <NoLockIn />
        <Pricing />
        <FAQ />
        <Waitlist />
      </main>
    </Layout>
  );
}
