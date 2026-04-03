import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { ArrowRight, Check } from 'lucide-react';
import { WiringIcon } from '../components/WiringIcons';

/* ════════════════════════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════════════════════════ */

const iconDefs = [
  { icon: 'http',      color: '#34d399' },
  { icon: 'queue',     color: '#f87171' },
  { icon: 'cron',      color: '#fbbf24' },
  { icon: 'bot',       color: '#f472b6' },
  { icon: 'rpc',       color: '#c084fc' },
  { icon: 'mcp',       color: '#22d3ee' },
  { icon: 'cli',       color: '#60a5fa' },
  { icon: 'websocket', color: '#a78bfa' },
  { icon: 'trigger',   color: '#f59e0b' },
  { icon: 'workflow',  color: '#2dd4bf' },
];

// Function nodes that connect to nearby wiring icons (by index in iconDefs)
// Each function node connects to 2-3 surfaces
const funcNodes = [
  { connects: [0, 1] },     // ƒ → http, queue
  { connects: [2, 3] },     // ƒ → cron, bot
  { connects: [4, 5, 6] },  // ƒ → rpc, mcp, cli
  { connects: [7, 8] },     // ƒ → websocket, trigger
];

type Pos = { col: number; row: number };

function useRandomLayout(cols: number, rows: number) {
  const [iconPositions, setIconPositions] = React.useState<Pos[]>([]);
  const [funcPositions, setFuncPositions] = React.useState<Pos[]>([]);

  React.useEffect(() => {
    const centerColMin = Math.floor(cols * 0.3);
    const centerColMax = Math.ceil(cols * 0.7);
    const centerRowMin = Math.floor(rows * 0.2);
    const centerRowMax = Math.ceil(rows * 0.75);

    const isCenter = (c: number, r: number) =>
      c >= centerColMin && c <= centerColMax && r >= centerRowMin && r <= centerRowMax;

    const candidates: Pos[] = [];
    for (let c = 1; c < cols; c++) {
      for (let r = 1; r < rows; r++) {
        if (!isCenter(c, r)) candidates.push({ col: c, row: r });
      }
    }

    // Shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    // Pick icon positions with spacing
    const allPicked: Pos[] = [];
    const icons: Pos[] = [];
    for (const c of candidates) {
      if (icons.length >= iconDefs.length) break;
      const tooClose = allPicked.some(
        (p) => Math.abs(p.col - c.col) < 2 && Math.abs(p.row - c.row) < 2
      );
      if (!tooClose) { icons.push(c); allPicked.push(c); }
    }

    // For each funcNode, find a grid intersection near its connected icons
    const funcs: Pos[] = [];
    for (const fn of funcNodes) {
      const connected = fn.connects.map((idx) => icons[idx]).filter(Boolean);
      if (connected.length === 0) continue;

      // Average position of connected icons
      const avgCol = Math.round(connected.reduce((s, p) => s + p.col, 0) / connected.length);
      const avgRow = Math.round(connected.reduce((s, p) => s + p.row, 0) / connected.length);

      // Search nearby for a free spot
      let best: Pos | null = null;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dc === 0 && dr === 0) continue;
          const c = avgCol + dc;
          const r = avgRow + dr;
          if (c < 1 || c >= cols || r < 1 || r >= rows) continue;
          if (isCenter(c, r)) continue;
          const taken = allPicked.some((p) => p.col === c && p.row === r);
          if (!taken) { best = { col: c, row: r }; break; }
        }
        if (best) break;
      }

      if (best) { funcs.push(best); allPicked.push(best); }
      else funcs.push({ col: avgCol, row: avgRow }); // fallback
    }

    setIconPositions(icons);
    setFuncPositions(funcs);
  }, [cols, rows]);

  return { iconPositions, funcPositions };
}

function FabricMesh() {
  const cols = 16;
  const rows = 8;
  const { iconPositions, funcPositions } = useRandomLayout(cols, rows);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* CSS grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / cols}% ${100 / rows}%`,
        }}
      />

      {/* Intersection dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: `${100 / cols}% ${100 / rows}%`,
        }}
      />

      {/* SVG layer for connecting lines (traces) */}
      <svg className="absolute inset-0 w-full h-full">
        {funcPositions.map((fPos, fi) => {
          const fn = funcNodes[fi];
          if (!fn) return null;
          const fx = (fPos.col / cols) * 100;
          const fy = (fPos.row / rows) * 100;
          return fn.connects.map((iconIdx) => {
            const iPos = iconPositions[iconIdx];
            if (!iPos) return null;
            const ix = (iPos.col / cols) * 100;
            const iy = (iPos.row / rows) * 100;
            const def = iconDefs[iconIdx];
            return (
              <line
                key={`trace-${fi}-${iconIdx}`}
                x1={`${fx}%`} y1={`${fy}%`}
                x2={`${ix}%`} y2={`${iy}%`}
                stroke={def?.color || '#fff'}
                strokeOpacity={0.12}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            );
          });
        })}
      </svg>

      {/* Wiring icon nodes */}
      {iconPositions.map((pos, i) => {
        const def = iconDefs[i];
        if (!def) return null;
        const xPct = (pos.col / cols) * 100;
        const yPct = (pos.row / rows) * 100;
        return (
          <div
            key={def.icon}
            className="absolute fabric-node-pulse"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
              style={{ width: 60, height: 60, backgroundColor: def.color, opacity: 0.1 }}
            />
            <div
              className="relative flex items-center justify-center rounded-lg border bg-[#0c0c14] p-1.5"
              style={{
                borderColor: `${def.color}35`,
                boxShadow: `0 0 16px -4px ${def.color}25`,
              }}
            >
              <WiringIcon wiringId={def.icon} size={18} />
            </div>
          </div>
        );
      })}

      {/* Function (ƒ) nodes */}
      {funcPositions.map((pos, i) => {
        const xPct = (pos.col / cols) * 100;
        const yPct = (pos.row / rows) * 100;
        return (
          <div
            key={`func-${i}`}
            className="absolute fabric-node-pulse"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${(i + iconDefs.length) * 0.4}s`,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
              style={{ width: 50, height: 50, backgroundColor: '#a78bfa', opacity: 0.08 }}
            />
            <div
              className="relative flex items-center justify-center rounded-lg border bg-[#0c0c14] w-7 h-7 text-[13px] font-bold"
              style={{
                borderColor: 'rgba(168, 99, 238, 0.3)',
                color: 'rgba(168, 99, 238, 0.7)',
                boxShadow: '0 0 16px -4px rgba(168, 99, 238, 0.2)',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
              }}
            >
              ƒ
            </div>
          </div>
        );
      })}

      {/* Fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]/40" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Fabric mesh background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <FabricMesh />
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
