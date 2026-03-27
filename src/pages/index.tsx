import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { WiringIcon } from '../components/WiringIcons';
import { testimonials } from '@site/data/testimonials';
import { ArrowRight } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   Shared: useInView hook
   ════════════════════════════════════════════════════════════════ */

function useInView(threshold = 0.3) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ════════════════════════════════════════════════════════════════
   1. HERO — OS-first: "One function. Every protocol."
   One code block replicates outward into 8 surface cards.
   ════════════════════════════════════════════════════════════════ */

const surfaces = [
  { icon: 'http',      label: 'REST API',     color: '#34d399' },
  { icon: 'cron',      label: 'Cron job',      color: '#fbbf24' },
  { icon: 'queue',     label: 'Queue worker',  color: '#f87171' },
  { icon: 'workflow',  label: 'Workflow',       color: '#2dd4bf' },
  { icon: 'cli',       label: 'CLI command',   color: '#22d3ee' },
  { icon: 'websocket', label: 'WebSocket',     color: '#a78bfa' },
  { icon: 'mcp',       label: 'MCP tool',      color: '#f472b6' },
  { icon: 'bot',       label: 'AI agent',      color: '#a78bfa' },
];

// Positions for the 8 surface cards around the center (in %)
const cardPositions = [
  { x: -52, y: -38 },  // top-left
  { x: 0,   y: -48 },  // top
  { x: 52,  y: -38 },  // top-right
  { x: 64,  y: 0 },    // right
  { x: 52,  y: 38 },   // bottom-right
  { x: 0,   y: 48 },   // bottom
  { x: -52, y: 38 },   // bottom-left
  { x: -64, y: 0 },    // left
];

function Hero() {
  // SSR: show final state. Client: animate.
  const [phase, setPhase] = React.useState<'final' | 'code' | 'burst' | 'done'>('final');

  React.useEffect(() => {
    setPhase('code');
    const t1 = setTimeout(() => setPhase('burst'), 800);
    const t2 = setTimeout(() => setPhase('done'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const isBurst = phase === 'burst' || phase === 'done' || phase === 'final';
  const isDone = phase === 'done' || phase === 'final';

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-8 lg:pt-28 lg:pb-12">
        {/* Headline + CTAs — always visible */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/60 mb-4">Open-source TypeScript framework</p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.04em] leading-[1.08] text-white">
              One function.
              <br />
              <span className="text-primary">Every protocol.</span>
            </h1>

            <p className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed">
              Write a typed function once. Pikku wires it to REST APIs, cron, queues,
              workflows, WebSockets, CLI, MCP, and AI agents.
              Deploy anywhere.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/getting-started" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="#how-it-works" className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
                See how it works
              </Link>
            </div>
          </div>

          {/* The Multiplication visual */}
          <div className="relative hidden md:block" style={{ minHeight: 400 }}>
            {/* Center: the function code block */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 ${
                phase === 'code' ? 'scale-100 opacity-100' : isBurst ? 'scale-90 opacity-100' : 'scale-100 opacity-100'
              }`}
              style={{ width: 220 }}
            >
              <div className="rounded-xl border border-primary/30 bg-[#0c0c14] p-4 shadow-lg shadow-primary/10">
                <div className="text-[10px] font-mono text-primary/50 mb-2">createInvoice.ts</div>
                <div className="font-mono text-[10px] leading-5 text-white/50">
                  <div><span className="text-primary/60">export const</span> createInvoice</div>
                  <div>= <span className="text-emerald-400/60">pikkuFunc</span>({'{'}</div>
                  <div>  input: <span className="text-white/30">z.object({'{'}...{'}'})</span>,</div>
                  <div>  func: <span className="text-primary/40">async</span> (...) {'=> {'}...{'}'},</div>
                  <div>  permissions: {'{'}<span className="text-white/30">...</span>{'}'},</div>
                  <div>{'}'})</div>
                </div>
              </div>
            </div>

            {/* Dashed connector lines (visible after burst) */}
            <svg className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isBurst ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: 5 }}>
              {cardPositions.map((pos, i) => (
                <line
                  key={i}
                  x1="50%" y1="50%"
                  x2={`${50 + pos.x * 0.45}%`} y2={`${50 + pos.y * 0.45}%`}
                  stroke={surfaces[i].color}
                  strokeOpacity={0.15}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  className="hero-connector"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </svg>

            {/* 8 surface cards that burst outward */}
            {surfaces.map((s, i) => {
              const pos = cardPositions[i];
              return (
                <div
                  key={i}
                  className={`absolute z-20 transition-all ${isBurst ? 'hero-card-burst' : ''}`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: isBurst
                      ? `translate(calc(-50% + ${pos.x * 1.8}px), calc(-50% + ${pos.y * 1.8}px))`
                      : 'translate(-50%, -50%) scale(0.3)',
                    opacity: isBurst ? 1 : 0,
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-[#0c0c14] whitespace-nowrap"
                    style={{ borderColor: `${s.color}30`, boxShadow: isDone ? `0 0 16px -4px ${s.color}25` : 'none' }}
                  >
                    <WiringIcon wiringId={s.icon} size={14} />
                    <span className="text-xs font-semibold text-white/80">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile fallback: simple list */}
          <div className="md:hidden grid grid-cols-2 gap-2 mt-4">
            {surfaces.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                <WiringIcon wiringId={s.icon} size={14} />
                <span className="text-xs font-semibold text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. HOW IT WORKS — write, wire, run
   ════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Write. Wire. Run.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto leading-relaxed">
            Define your logic once. Wire it to any protocol. Run it on any runtime.
          </p>
        </div>

        <div className="space-y-10">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">1</span>
              <div>
                <span className="text-sm font-bold text-white">Write a function</span>
                <span className="text-xs text-white/30 ml-3">Typed inputs, outputs, and permissions.</span>
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
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">2</span>
              <div>
                <span className="text-sm font-bold text-white">Wire it to surfaces</span>
                <span className="text-xs text-white/30 ml-3">Same function. Any combination.</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`wireHTTP({ method: 'post', route: '/invoices', func: createInvoice })
wireScheduler({ schedule: '0 9 * * 1', func: createInvoice })
wireQueueWorker({ queue: 'billing', func: createInvoice })
wireCLI({ program: 'billing', commands: { invoice: createInvoice } })
pikkuAIAgent({
  name: 'billing-assistant',
  tools: [createInvoice],
  model: 'anthropic/claude-sonnet-4-5',
})`}</CodeBlock>
              </div>
            </div>
          </div>

          {/* Step 3 — run anywhere */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">3</span>
              <div>
                <span className="text-sm font-bold text-white">Run on any runtime</span>
                <span className="text-xs text-white/30 ml-3">Fastify, Express, Lambda, Cloudflare, Bun — your call.</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`// Fastify
import { pikkuFastify } from '@pikku/fastify'
const app = await pikkuFastify(pikku)
await app.listen({ port: 3000 })

// Or Lambda, Cloudflare Workers, Express, Next.js...
// Same Pikku project. Any runtime.`}</CodeBlock>
              </div>
            </div>
          </div>
        </div>

        {testimonials[0] && (
          <div className="mt-14 border-l-2 border-white/10 pl-4 max-w-lg mx-auto">
            <p className="text-sm text-white/30 italic">"{testimonials[0].quote}"</p>
            <p className="mt-1 text-xs text-white/20 not-italic">
              — {testimonials[0].author}, {testimonials[0].role} @ {testimonials[0].company}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. WHY PIKKU — framework benefits
   ════════════════════════════════════════════════════════════════ */

const frameworkBenefits = [
  { title: 'Write once, wire anywhere', desc: 'One function serves REST, WebSocket, cron, queues, CLI, MCP, and AI agents. No adapter code.' },
  { title: 'End-to-end type safety', desc: 'Zod schemas, typed services, auto-generated clients. Compile-time guarantees across the stack.' },
  { title: 'Any runtime', desc: 'Deploy to Fastify, Express, Lambda, Cloudflare Workers, Bun, or Next.js. Same project, zero lock-in.' },
  { title: 'Built-in auth & permissions', desc: 'Session management, JWT, and role-based access — baked into every function invocation.' },
  { title: 'Auto-generated OpenAPI', desc: 'Your API spec stays in sync with your code. Always accurate, never stale.' },
  { title: 'Typed clients', desc: 'Generated HTTP, WebSocket, and RPC clients. No manual typing, no drift.' },
];

function WhyPikku() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/50 mb-4">Why Pikku</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The framework that multiplies your code.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            Stop writing glue. Every function you write can serve every protocol your app needs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frameworkBenefits.map((b, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-5">
              <h3 className="text-sm font-bold text-white mb-1.5">{b.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. CONSOLE — visual control plane
   ════════════════════════════════════════════════════════════════ */

const consoleFeatures = [
  { title: 'Functions explorer', desc: 'Browse every function, its types, permissions, and which protocols reference it.' },
  { title: 'Workflow runner', desc: 'Visualize workflow graphs, run them with custom input, and stream progress in real time.' },
  { title: 'Agent playground', desc: 'Chat with your AI agents, test tool approvals, and inspect conversation history.' },
  { title: 'API overview', desc: 'HTTP routes, WebSocket channels, MCP tools, and CLI commands — all in one view.' },
  { title: 'Secrets & config', desc: 'Manage secrets, variables, and OAuth2 credentials per environment with validation.' },
  { title: 'Spotlight search', desc: 'Cmd+K to find any function, route, workflow, or config item instantly.' },
];

function Console() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-400/60 mb-4">Built-in</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            A control plane for your entire app.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            The Pikku Console gives you a visual overview of every function, workflow, agent, route, and config — per environment. No extra server needed.
          </p>
        </div>

        {/* Screenshot */}
        <div className="mb-14 rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40">
          <img
            src="/img/console-screenshot.webp"
            alt="Pikku Console — visual control plane showing functions, workflows, agents, and configuration"
            className="w-full"
            loading="lazy"
          />
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {consoleFeatures.map((f, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-5">
              <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/core/console" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
            Learn more about the Console <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. USE CASES
   ════════════════════════════════════════════════════════════════ */

function UseCases() {
  const cases = [
    { to: '/use-cases/api-agents', label: 'API Agents', color: 'text-primary/50', border: 'hover:border-primary/20', title: 'Give your API a brain.', desc: 'Turn any OpenAPI spec into a chat assistant, CLI tools, and MCP server.' },
    { to: '/use-cases/workflows', label: 'Workflows', color: 'text-emerald-400/50', border: 'hover:border-emerald-500/20', title: 'Workflows that survive anything.', desc: 'Multi-step processes with persistence, retries, and real sleep.' },
    { to: '/use-cases/scheduled-jobs', label: 'Scheduled Jobs', color: 'text-amber-400/50', border: 'hover:border-amber-500/20', title: 'Cron that actually works.', desc: 'Managed scheduling with retries and execution history.' },
    { to: '/use-cases/background-jobs', label: 'Background Jobs', color: 'text-red-400/50', border: 'hover:border-red-500/20', title: 'Queues without the infra.', desc: 'Job processing with retries, dead-letter queues, and traces.' },
    { to: '/use-cases/internal-tools', label: 'Internal Tools', color: 'text-cyan-400/50', border: 'hover:border-cyan-500/20', title: 'CLI + API from one function.', desc: 'API, CLI, and RPC from the same codebase.' },
    { to: '/use-cases/realtime', label: 'Realtime', color: 'text-violet-400/50', border: 'hover:border-violet-500/20', title: 'WebSockets + SSE with types and auth.', desc: 'Typed messages, session context, no separate server.' },
  ];

  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/50 mb-4">Use cases</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What people build with Pikku.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((uc, i) => (
            <Link key={i} to={uc.to} className={`group rounded-xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all hover:bg-white/[0.04] ${uc.border} no-underline`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${uc.color} mb-2`}>{uc.label}</p>
              <h3 className="text-base font-bold text-white">{uc.title}</h3>
              <p className="mt-1.5 text-sm text-white/35 leading-relaxed">{uc.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. FABRIC — "Serverless everything. Zero lock-in."
   Deploy terminal + comparison
   ════════════════════════════════════════════════════════════════ */

const deployCmd = '$ pikku deploy';
const deployLines = [
  { text: '  Analyzing 23 functions...', color: 'text-white/25' },
  { text: '  + create  Worker   getUser            (HTTP)', color: 'text-emerald-400' },
  { text: '  + create  Worker   createInvoice      (Queue)', color: 'text-emerald-400' },
  { text: '  + create  Worker   dailyReport        (Cron)', color: 'text-emerald-400' },
  { text: '  + create  Worker   billing-agent      (Agent)', color: 'text-emerald-400' },
  { text: '  + create  Worker   mcp-server         (MCP, 6 tools)', color: 'text-emerald-400' },
  { text: '  + create  Queue    billing-queue', color: 'text-emerald-400' },
  { text: '  + create  Cron     Mon 09:00', color: 'text-emerald-400' },
  { text: '  = 23 functions deployed as serverless workers', color: 'text-emerald-400' },
];

function DeployTerminal() {
  const { ref, inView } = useInView(0.3);

  const [typedChars, setTypedChars] = React.useState(deployCmd.length);
  const [showDeploying, setShowDeploying] = React.useState(true);
  const [visibleLines, setVisibleLines] = React.useState(deployLines.length);
  const [showDone, setShowDone] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setTypedChars(0);
    setShowDeploying(false);
    setVisibleLines(0);
    setShowDone(false);
  }, []);

  React.useEffect(() => {
    if (inView && isClient && !started) setStarted(true);
  }, [inView, isClient, started]);

  React.useEffect(() => {
    if (!started) return;
    if (typedChars < deployCmd.length) {
      const t = setTimeout(() => setTypedChars(c => c + 1), 40);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowDeploying(true), 300);
    return () => clearTimeout(t);
  }, [started, typedChars]);

  React.useEffect(() => {
    if (!showDeploying) return;
    if (visibleLines < deployLines.length) {
      const delay = visibleLines === 0 ? 500 : 250;
      const t = setTimeout(() => setVisibleLines(n => n + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowDone(true), 300);
    return () => clearTimeout(t);
  }, [showDeploying, visibleLines]);

  return (
    <div ref={ref} className={`rounded-xl border bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20 transition-all duration-700 ${showDone ? 'terminal-done border-white/[0.08]' : 'border-white/[0.08]'}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="ml-3 text-xs text-white/20 font-mono">terminal</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-7 min-h-[280px]">
        <div className="text-white">
          {deployCmd.slice(0, typedChars)}
          {isClient && typedChars < deployCmd.length && <span className="animate-blink">▌</span>}
        </div>

        {showDeploying && (
          <div className="mt-2 text-white/25 deploy-line-enter">  Deploying to production...</div>
        )}

        {visibleLines > 0 && <div className="mt-2" />}
        {deployLines.slice(1).map((line, i) => (
          i < visibleLines - 1 ? (
            <div key={i} className={`${line.color} deploy-line-enter`}>
              {line.text.split('  ').map((part, j) => (
                j === 0 ? <span key={j}>{part}</span> : <span key={j} className="text-white/25">  {part}</span>
              ))}
            </div>
          ) : null
        ))}

        {showDone && (
          <div className="mt-2 text-white font-semibold deploy-line-enter">  Deployed. Scales to zero. $0 when idle.</div>
        )}
      </div>
    </div>
  );
}

const selfHostItems = [
  'Provision infrastructure per function type',
  'Configure Workers, Queues, Cron manually',
  'Wire up WebSockets and SSE yourself',
  'Set up CI/CD and deploy scripts',
  'Build monitoring and alerting',
  'Manage secrets across environments',
  'Handle version draining manually',
  'Locked to one cloud provider',
];

const fabricItems = [
  'pikku deploy — every function becomes a serverless worker',
  'HTTP, WebSocket, queues, cron, agents, MCP — all deployed',
  'Per-function metrics, logs, and error tracking',
  'Smart versioning — drains old functions before removing',
  'Terraform-like plan/apply — see exactly what changes',
  'Environments, previews, rollbacks built in',
  'Scales to zero — $0 when idle',
  'Eject anytime — run on any cloud or your own servers',
];

function FabricSection() {
  return (
    <section id="fabric" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/60 mb-4">Fabric</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Serverless everything. Zero lock-in.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            Fabric reads your code, deploys each function as its own serverless worker — HTTP, WebSocket, queues, cron, agents, MCP. Eject and run anywhere, anytime.
          </p>
        </div>

        {/* Deploy terminal */}
        <div className="max-w-2xl mx-auto mb-14">
          <DeployTerminal />
          <p className="mt-4 text-xs text-white/25 text-center">
            Fabric reads your Pikku metadata, generates a deployment plan, and deploys each function
            as an independent serverless worker. No config files. No infrastructure decisions.
          </p>
        </div>

        {/* Self-host vs Fabric comparison */}
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">Self-host (free)</p>
            <div className="space-y-3">
              {selfHostItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/40">
                  <span className="text-white/20 text-xs">—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70 mb-5">Fabric ($20/mo)</p>
            <div className="space-y-3">
              {fabricItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="text-emerald-400 text-xs">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-white/25 mt-8">
          Same Pikku project either way. Fabric deploys it serverless. You can eject and self-host anytime.
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
   7. PRICING
   ════════════════════════════════════════════════════════════════ */

function Pricing() {
  const tiers = [
    { name: 'Open Source', price: 'Free', sub: 'forever', desc: 'The full framework. Self-host or deploy anywhere.', features: ['All wiring types (HTTP, WS, Queue, Cron, MCP, Agent)', 'Any runtime (Express, Lambda, Cloudflare, etc.)', 'pikku deploy CLI with plan/apply', 'Community support'], cta: { label: 'Get started', to: '/getting-started' }, accent: true },
    { name: 'Fabric', price: '$20/mo', sub: 'scales to zero, $0 when idle', desc: 'Serverless deployment platform. Push code, everything deploys.', features: ['Everything in Open Source', 'Per-function serverless workers', 'Dashboard with metrics, logs, deployments', 'Smart versioning with auto-drain', 'Environments, previews, rollbacks', 'Eject anytime — zero lock-in'], cta: { label: 'Join the waitlist', to: '#waitlist' }, accent: false },
    { name: 'Enterprise', price: 'Custom', sub: 'annual license', desc: 'Deploy to your own cloud. Full control.', features: ['Everything in Fabric', 'BYOK — deploy to your Cloudflare, AWS, or GCP', 'SSO / SAML + SLAs', 'Dedicated support engineer'], cta: { label: 'Contact us', to: 'mailto:hello@pikku.dev' }, accent: false },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Pricing</h2>
          <p className="mt-4 text-base text-white/40">Start free with the open-source framework. Upgrade to Fabric for managed serverless deployment.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <div key={i} className={`rounded-xl p-6 flex flex-col ${tier.accent ? 'border-2 border-primary/40 bg-primary/[0.04]' : 'border border-white/[0.06] bg-white/[0.025]'}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{tier.price}</p>
                {tier.sub && <p className="text-xs text-white/30 mt-0.5">{tier.sub}</p>}
                <p className="text-sm text-white/40 mt-2">{tier.desc}</p>
              </div>
              <div className="space-y-2.5 flex-1">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-sm text-white/55">
                    <span className="text-emerald-400 text-xs mt-0.5">✓</span>{f}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to={tier.cta.to} className={`block text-center rounded-lg px-5 py-2.5 text-sm font-semibold transition no-underline ${tier.accent ? 'bg-white text-black hover:bg-white/90' : 'border border-white/15 bg-white/5 text-white/80 hover:bg-white/10'}`}>{tier.cta.label}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   8. WAITLIST (Fabric)
   ════════════════════════════════════════════════════════════════ */

function Waitlist() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true); };

  return (
    <section id="waitlist" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute left-[40%] top-[60%] w-[400px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/60 mb-4">Fabric — coming soon</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Get early access to Fabric.</h2>
        <p className="mt-4 text-base text-white/40">Serverless deployment for Pikku. We'll notify you when it's ready.</p>
        {submitted ? (
          <div className="mt-10 py-5">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              You're on the list.
            </div>
            <p className="mt-2 text-sm text-white/30">We'll be in touch when Fabric launches.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.dev" className="flex-1 rounded-lg border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition" />
              <button type="submit" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 cursor-pointer flex-shrink-0">Join waitlist</button>
            </div>
            <p className="mt-3 text-xs text-white/15">No spam. One email when we launch.</p>
          </form>
        )}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-sm text-white/30">Meanwhile, the full framework is available now.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/getting-started" className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary/15 no-underline">
              Get started with Pikku <ArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/docs" className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white/70 no-underline">Read the docs</Link>
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
      title="Pikku — One Function. Every Protocol."
      description="Open-source TypeScript framework. Write typed functions once, wire them to REST APIs, cron, queues, workflows, WebSockets, CLI, MCP, and AI agents. Deploy on any runtime."
    >
      <Hero />
      <main>
        <HowItWorks />
        <WhyPikku />
        <Console />
        <UseCases />
        <FabricSection />
        <Pricing />
        <Waitlist />
      </main>
    </Layout>
  );
}
