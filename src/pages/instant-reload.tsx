import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  Zap, Clock, RefreshCw, ArrowRight, Save,
  Database, Route, Layers, Wifi,
  Terminal, Globe, Radio, Timer, MessageSquare,
  Server, Code, FileCode, Cpu,
  Copy, Check,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-instant-reload w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-emerald-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-teal-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 rounded mb-6">
            Developer Experience
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Your backend has never</span><br />
            <span className="text-emerald-400">reloaded this fast.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Frontend devs got instant feedback years ago. Backend devs are still restarting servers. Pikku changes that — edit, save, it's live. Across every protocol.
          </p>
          <div className="flex flex-row gap-4">
            <a href="#the-restart-loop" className="bg-emerald-500 text-black hover:bg-emerald-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 no-underline">See the Problem</a>
            <a href="#how-it-works" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">How It Works</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-[50px]" />
            <div className="relative flex flex-col items-center gap-3">
              {/* Save → Live animation concept */}
              <div className="flex items-center gap-4">
                <div className="bg-[#0d0d0d] border-2 border-neutral-600/40 rounded-2xl p-5">
                  <Save className="w-16 h-16 text-neutral-400" />
                </div>
                <ArrowRight className="w-8 h-8 text-emerald-400" />
                <div className="bg-[#0d0d0d] border-2 border-emerald-500/40 rounded-2xl p-5">
                  <Zap className="w-16 h-16 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-400/60 mt-2">Save → Live</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. THE RESTART LOOP — The pain
   ───────────────────────────────────────────── */

function RestartLoopSection() {
  const steps = [
    { label: 'Edit code', icon: '1', angle: -90 },
    { label: 'Save file', icon: '2', angle: -18 },
    { label: 'Server restarts', icon: '3', angle: 54 },
    { label: 'Wait 2-5 seconds', icon: '4', angle: 126 },
    { label: 'Re-test manually', icon: '5', angle: 198 },
  ];

  return (
    <section id="the-restart-loop" className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Status Quo</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Backend development is <span className="text-emerald-400">restart-driven.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            You know the loop. Every backend developer does. Edit. Save. Wait for the server to restart. Lose your WebSocket connections. Re-authenticate. Test again. Hundreds of times per day.
          </p>
        </div>

        {/* Loop visualization */}
        <div className="max-w-lg mx-auto mb-14">
          <div className="relative aspect-square max-w-[400px] mx-auto">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="1.5" strokeDasharray="6 4" />
              <path d="M 200 50 A 150 150 0 1 1 199.9 50" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="2" strokeDasharray="8 6">
                <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="20s" repeatCount="indefinite" />
              </path>
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <RefreshCw className="w-8 h-8 text-red-400/50 mx-auto mb-2 animate-spin" style={{ animationDuration: '8s' }} />
              <p className="text-xs font-bold tracking-widest uppercase text-red-400/60">Restart loop</p>
              <p className="text-[11px] text-neutral-600 mt-1">100+ times / day</p>
            </div>

            {steps.map((step, i) => {
              const rad = (step.angle * Math.PI) / 180;
              const r = 150;
              const x = 200 + r * Math.cos(rad);
              const y = 200 + r * Math.sin(rad);
              const isSlow = i === 3;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}
                >
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isSlow
                      ? 'bg-red-500/8 border-red-500/25'
                      : 'bg-[#0d0d0d] border-neutral-700/80'
                  }`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSlow ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {step.icon}
                    </span>
                    <span className={`text-xs font-medium whitespace-nowrap ${isSlow ? 'text-red-400' : 'text-neutral-300'}`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <Clock className="w-6 h-6 text-emerald-400" />,
              title: 'Death by a thousand restarts',
              desc: 'Each restart takes 2-5 seconds. At 100+ restarts per day, that\'s 5-10 minutes of pure waiting. But the real cost is the context switch — every restart breaks your flow.',
            },
            {
              icon: <Wifi className="w-6 h-6 text-emerald-400" />,
              title: 'Connections drop',
              desc: 'WebSocket clients disconnect. Queue consumers stop. Cron timers reset. Every restart tears down your entire runtime state. Then you rebuild it manually to test again.',
            },
            {
              icon: <Layers className="w-6 h-6 text-emerald-400" />,
              title: 'Multiple protocols, multiple restarts',
              desc: 'If you\'re running HTTP, WebSocket, and a queue consumer, a single code change means restarting all of them. Different processes, different startup times, different headaches.',
            },
          ].map((pain, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                {pain.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{pain.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. WHY IT NEVER WORKED — The narrative pivot
   ───────────────────────────────────────────── */

function WhyItNeverWorkedSection() {
  const reasons = [
    {
      icon: <Route className="w-5 h-5 text-red-400/70" />,
      title: 'Route tables',
      desc: 'Routes are registered at startup. Swapping a handler means re-registering routes, which means restarting the server.',
    },
    {
      icon: <Layers className="w-5 h-5 text-red-400/70" />,
      title: 'Middleware chains',
      desc: 'Middleware is composed at boot time. Each handler is wrapped in a closure chain that can\'t be unwound without a full restart.',
    },
    {
      icon: <Database className="w-5 h-5 text-red-400/70" />,
      title: 'Connection state',
      desc: 'Database pools, WebSocket connections, in-memory caches — they all live in the process. Swapping code means losing state.',
    },
    {
      icon: <Server className="w-5 h-5 text-red-400/70" />,
      title: 'Framework coupling',
      desc: 'Your handler is tangled with Express req/res, or Fastify\'s schema compiler, or Hono\'s context. The handler and the framework are inseparable.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/6 blur-[100px]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <SectionLabel>Why Frontend Has HMR and Backend Doesn't</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Backend code is <span className="text-red-400/80">stateful.</span><br />
            That's <span className="text-emerald-400">the whole problem.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            React components are pure functions of props and state — that's why React Fast Refresh works. Backend handlers? They're tangled with everything.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  {reason.icon}
                </div>
                <h3 className="text-base font-bold text-white font-jakarta">{reason.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-neutral-300 text-sm leading-relaxed">
            <span className="text-red-400 font-semibold">This is why nodemon exists.</span> It doesn't hot-reload your code. It kills the process and starts a new one. That's the best backend developers have had — until now.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. THE PIKKU DIFFERENCE — Stateless = swappable
   ───────────────────────────────────────────── */

function TheDifferenceSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/8 blur-[100px]" />
      </div>

      <div className="max-w-screen-lg mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Pikku functions are<br />
          <span className="text-emerald-400">stateless.</span>
        </Heading>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
          No route registration. No middleware closures. No framework coupling. Just a pure function: services in, data in, result out. That makes them hot-swappable by nature.
        </p>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div className="bg-[#0d0d0d] border border-red-500/20 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-red-500/10 bg-red-500/5">
              <p className="text-xs font-bold tracking-widest uppercase text-red-400/70 mb-0">Traditional handler</p>
            </div>
            <pre className="text-sm text-neutral-300 p-5 overflow-x-auto mb-0"><code>{`// Coupled to Express
app.post('/api/greet',
  authMiddleware,      // ← framework state
  validate(schema),    // ← framework state
  async (req, res) => {
    const user = req.user  // ← coupled to req
    const { name } = req.body
    res.json({ message: \`Hi \${name}\` })
  }
)`}</code></pre>
          </div>

          <div className="bg-[#0d0d0d] border border-emerald-500/20 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-emerald-500/10 bg-emerald-500/5">
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-400/70 mb-0">Pikku function</p>
            </div>
            <pre className="text-sm text-neutral-300 p-5 overflow-x-auto mb-0"><code>{`// Pure function — no framework, no state
const greet = async (
  services: Services,
  data: { name: string }
) => {
  return { message: \`Hi \${data.name}\` }
}

// Auth, validation, routing — all metadata
// Swapping this file = instant reload`}</code></pre>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-10 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
          <p className="text-neutral-300 text-base leading-relaxed">
            <span className="text-emerald-400 font-semibold">The function is just logic.</span> Auth, validation, permissions, and routing are declared as metadata — not wired into the handler. When the file changes, Pikku swaps the function and reloads the metadata. No restart. No state lost. No connections dropped.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. HOW IT WORKS — pikku watch
   ───────────────────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      icon: <FileCode className="w-6 h-6 text-emerald-400" />,
      step: '1',
      title: 'You save a file',
      desc: 'You edit a function — change the logic, add a field, update a return type. Just save.',
      detail: 'No restart command. No waiting.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      step: '2',
      title: 'Pikku reloads the metadata',
      desc: 'The CLI detects the change, regenerates route metadata, types, and validation schemas. The function module is swapped in-place.',
      detail: 'Sub-second. No process restart.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      step: '3',
      title: 'It\'s live. Everywhere.',
      desc: 'The updated function is immediately available on every protocol — HTTP, WebSocket, queue, cron, RPC, MCP, CLI. All at once. All in the same process.',
      detail: 'One save. Every protocol. Instantly.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-emerald-400">Save.</span> That's it.
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Run <code className="text-emerald-300 text-base">pikku watch</code> once. From then on, every file save is a live reload — across every protocol your function is wired to.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((phase, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-7 relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {phase.icon}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-400/60">Step {phase.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-jakarta">{phase.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">{phase.desc}</p>
              <p className="text-xs text-emerald-400/70 font-medium">{phase.detail}</p>
            </div>
          ))}
        </div>

        {/* Terminal mock */}
        <div className="max-w-2xl mx-auto mt-12 bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/30">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-neutral-600 ml-2 font-mono">terminal</span>
          </div>
          <pre className="text-sm p-5 overflow-x-auto mb-0"><code>
            <span className="text-neutral-500">$</span> <span className="text-emerald-300">npx pikku watch</span>{'\n'}
            <span className="text-neutral-600">[pikku]</span> <span className="text-neutral-400">Watching for changes...</span>{'\n'}
            <span className="text-neutral-600">[pikku]</span> <span className="text-emerald-400">✓</span> <span className="text-neutral-300">greet.ts changed — reloaded in 47ms</span>{'\n'}
            <span className="text-neutral-600">[pikku]</span> <span className="text-emerald-400">✓</span> <span className="text-neutral-300">Types regenerated</span>{'\n'}
            <span className="text-neutral-600">[pikku]</span> <span className="text-emerald-400">✓</span> <span className="text-neutral-300">Live on: HTTP, WebSocket, RPC, Cron</span>
          </code></pre>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. EVERY PROTOCOL — One change, live everywhere
   ───────────────────────────────────────────── */

function EveryProtocolSection() {
  const protocols = [
    { icon: <Globe className="w-5 h-5" />, name: 'HTTP', desc: 'REST endpoints update instantly' },
    { icon: <Radio className="w-5 h-5" />, name: 'WebSocket', desc: 'No disconnection, no reconnection' },
    { icon: <Layers className="w-5 h-5" />, name: 'Queue', desc: 'Consumer keeps running, new logic applies' },
    { icon: <Timer className="w-5 h-5" />, name: 'Cron', desc: 'Next tick uses updated function' },
    { icon: <Terminal className="w-5 h-5" />, name: 'CLI', desc: 'Command reflects changes immediately' },
    { icon: <Code className="w-5 h-5" />, name: 'RPC', desc: 'Type-safe client stays in sync' },
    { icon: <MessageSquare className="w-5 h-5" />, name: 'MCP', desc: 'AI tools update without restart' },
    { icon: <Server className="w-5 h-5" />, name: 'SSE', desc: 'Streams continue uninterrupted' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Every Protocol</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One save. <span className="text-emerald-400">Eight protocols.</span><br />
            Zero restarts.
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Because Pikku functions are protocol-agnostic, a single file save updates the function everywhere it's wired. No per-protocol restart. No process juggling. One save and every consumer sees the new code.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {protocols.map((proto, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 text-center hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                {proto.icon}
              </div>
              <p className="text-sm font-bold text-white font-jakarta mb-1">{proto.name}</p>
              <p className="text-xs text-neutral-500">{proto.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 text-center">
          <p className="text-neutral-300 text-sm leading-relaxed">
            <span className="text-emerald-400 font-semibold">Compare this to traditional setups:</span> HTTP on Express (restart), WebSocket on Socket.io (restart + reconnect), queue consumer on BullMQ (restart + re-subscribe), cron on node-cron (restart + re-schedule). Four processes. Four restarts. Four broken states. Pikku: one save.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. THE COMPARISON — Dev loop side by side
   ───────────────────────────────────────────── */

function ComparisonSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Dev Loop</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Traditional vs. Pikku<br />
            <span className="text-emerald-400">side by side.</span>
          </Heading>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-neutral-600"></th>
                  <th className="py-4 px-6 text-sm font-semibold text-red-400/80">nodemon / ts-node</th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400 font-jakarta">pikku watch</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'What happens', traditional: 'Kill process, restart from scratch', pikku: 'Swap function module, reload metadata' },
                  { label: 'Reload time', traditional: '2-5 seconds (compile + boot)', pikku: '< 50ms' },
                  { label: 'Connections', traditional: 'All dropped — WS, DB, queues', pikku: 'All preserved' },
                  { label: 'Type generation', traditional: 'Manual / separate watcher', pikku: 'Automatic on every save' },
                  { label: 'Multi-protocol', traditional: 'Restart each process separately', pikku: 'One save updates all protocols' },
                  { label: 'Daily cost (100 edits)', traditional: '~8 min waiting + context switches', pikku: '~5 sec total, zero context switches' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-3.5 px-6 text-xs font-bold tracking-wider uppercase text-neutral-500">{row.label}</td>
                    <td className="py-3.5 px-6 text-sm text-red-400/60">{row.traditional}</td>
                    <td className="py-3.5 px-6 text-sm text-emerald-300 font-medium">{row.pikku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {[
            { value: '< 50ms', label: 'Reload time', desc: 'Function swap + metadata reload' },
            { value: '0', label: 'Dropped connections', desc: 'WebSockets, queues, everything stays' },
            { value: '~40 hrs', label: 'Saved per year', desc: 'At 100 edits/day, 250 working days' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-emerald-400 font-jakarta">{item.value}</p>
              <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
              <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. TYPES — Auto-regenerated
   ───────────────────────────────────────────── */

function TypesSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Type Safety</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Types regenerate<br />
            <span className="text-emerald-400">on every save.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            When you change a function's input or output shape, <code className="text-emerald-300 text-base">pikku watch</code> regenerates the TypeScript types, validation schemas, and client types — automatically. Your editor catches errors before you even switch to the browser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <FileCode className="w-6 h-6 text-emerald-400" />,
              title: 'Route metadata',
              desc: 'HTTP paths, methods, permissions, and middleware — all regenerated from your function decorators. No manual route files to keep in sync.',
            },
            {
              icon: <Code className="w-6 h-6 text-emerald-400" />,
              title: 'Validation schemas',
              desc: 'Input/output schemas are derived from your TypeScript types. Change the type, the schema follows. Runtime validation matches compile-time checks.',
            },
            {
              icon: <Zap className="w-6 h-6 text-emerald-400" />,
              title: 'Client types',
              desc: 'Auto-generated type-safe client types stay in sync with your functions. Your frontend knows the exact shape of every API response — always.',
            },
          ].map((point, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{point.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-emerald-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Stop restarting.<br />Start building.
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          The fastest backend feedback loop you've ever had. Edit, save, it's live — across every protocol, with full type safety, in under 50 milliseconds.
        </p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-emerald-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-emerald-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/getting-started" className="bg-emerald-500 text-black hover:bg-emerald-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 no-underline">Get Started</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 no-underline">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &middot; Works with Express, Fastify, uWS, Bun &amp; more</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function InstantReloadPage() {
  return (
    <Layout
      title="Instant Reload — Pikku"
      description="The fastest backend dev loop. Edit a function, save, and it's live across HTTP, WebSocket, queues, cron, and every protocol — in under 50ms. No restarts. No dropped connections. No state lost."
    >
      <Hero />
      <main>
        <RestartLoopSection />
        <WhyItNeverWorkedSection />
        <TheDifferenceSection />
        <HowItWorksSection />
        <EveryProtocolSection />
        <ComparisonSection />
        <TypesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
