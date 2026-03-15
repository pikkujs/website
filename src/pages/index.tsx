import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { WiringIcon } from '../components/WiringIcons';
import {
  Hero, NavbarPageToggle, DeployAnywhereSection, ProductionFeaturesSection,
  ConsoleSection, TestimonialsSection, CallToActionSection,
} from '../components/HomepageShared';
import {
  Zap, Plug, Terminal, Bot, Workflow, Package, Copy, AlertTriangle, Lock, MessageSquare,
} from 'lucide-react';

/** The Problem — name the pain before showing the solution */
function ProblemSection() {
  const pains = [
    {
      icon: <Copy className="w-6 h-6" />,
      title: 'Same logic, five handlers',
      desc: 'Your getCard function lives in your HTTP handler, your WebSocket handler, your queue worker, and your CLI. They started as copies. Now they\'ve drifted apart.',
      color: 'text-red-400',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'New protocol, new framework',
      desc: 'Want AI agents? That\'s Vercel AI SDK. Workflows? Inngest or Temporal. MCP? Another adapter. Each one brings its own auth layer, schema format, and deploy pipeline.',
      color: 'text-amber-400',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Switching runtimes means rewriting',
      desc: 'Moving from Express to Lambda touches every handler. Your business logic is tangled with framework APIs you never wanted to think about.',
      color: 'text-orange-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Sound Familiar?</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            You've written this function<br className="hidden md:block" /> more times than you'd admit.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Every time you add a protocol, you copy-paste, re-wire auth, and pray the handlers don't drift. It's not lazy engineering — it's a missing abstraction.
          </p>
          <p className="text-sm text-neutral-500 italic max-w-xl mx-auto mt-4">
            "So many places in my code base have like three entry points: CLI, public HTTP API and internally from within the API. Would be so nice having everything just an invoke away."
            <span className="not-italic block mt-1 text-neutral-600">— Alex Harley, CTO @ Bamboo Rose</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-7">
              <div className={`${pain.color} mb-5`}>{pain.icon}</div>
              <h3 className="text-lg font-bold mb-3 text-white">{pain.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The Solution — before/after with compact code showing the fix */
function SolutionSection() {
  const beforeCode = `// HTTP
app.get('/cards/:id', auth, validate, async (req, res) => {
  const card = await db.getCard(req.params.id)
  res.json(card)
})
// WebSocket
ws.on('getCard', auth, validate, async (msg, socket) => {
  const card = await db.getCard(msg.cardId)
  socket.send(JSON.stringify(card))
})
// Queue worker — same logic, third copy
// CLI command — same logic, fourth copy
// AI agent tool — new SDK, new auth, fifth copy`;

  const afterCode = `// Write it once
const getCard = pikkuFunc({
  func: async ({ db }, { cardId }) => db.getCard(cardId),
  permissions: { user: isAuthenticated }
})

// Wire it to everything — same auth, same validation
wireHTTP({ method: 'get', route: '/cards/:cardId', func: getCard })
wireChannel({ name: 'cards', onMessage: { getCard } })
wireQueueWorker({ queue: 'fetch-card', func: getCard })
wireCLI({ program: 'cards', commands: { get: getCard } })`;

  return (
    <section className="py-8 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Fix</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            One function that doesn't drift.<br />
            <span className="text-primary">Fix a bug once, it's fixed everywhere.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-400">Without Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">5 copies that drift</span>
            </div>
            <div className="rounded-xl border border-red-500/20 overflow-hidden opacity-70">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px] sm:text-sm [&_pre]:!overflow-x-auto [&_pre]:max-w-[calc(100vw-4rem)]">
                <CodeBlock language="typescript">{beforeCode}</CodeBlock>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">With Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">1 function + wirings</span>
            </div>
            <div className="rounded-xl border border-green-500/20 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px] sm:text-sm [&_pre]:!overflow-x-auto [&_pre]:max-w-[calc(100vw-4rem)]">
                <CodeBlock language="typescript">{afterCode}</CodeBlock>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['+ SSE', '+ RPC', '+ MCP', '+ AI Agent', '+ Workflow', '+ Trigger', '+ Gateway'].map((label) => (
            <span key={label} className="px-3 py-1.5 bg-primary/8 border border-primary/20 rounded-full text-xs font-medium text-primary/70">
              {label}
            </span>
          ))}
        </div>
        <p className="text-center text-sm text-neutral-500 mt-4">
          12 protocols total — all with the same pattern.{' '}
          <Link to="/developers" className="text-primary hover:underline">
            See every wiring in action
          </Link>
        </p>
      </div>
    </section>
  );
}

/** What You Get — outcome-focused, not feature-list */
function WhatYouGetSection() {
  const outcomes = [
    { icon: 'http', title: 'REST APIs with auto-generated OpenAPI', outcome: 'Ship an HTTP endpoint and get typed docs for free.', link: '/wires/http' },
    { icon: 'websocket', title: 'Real-time without the boilerplate', outcome: 'Add WebSocket support to any function. Same auth, typed channels.', link: '/wires/websocket' },
    { icon: 'queue', title: 'Background jobs that share your logic', outcome: 'Run any function as a queue worker. BullMQ, PG Boss, or SQS.', link: '/wires/queue' },
    { icon: 'cron', title: 'Scheduled tasks on any runtime', outcome: 'Same function runs on a cron schedule — serverless or server.', link: '/wires/cron' },
    { icon: 'rpc', title: 'Call server functions like local ones', outcome: 'Full type safety between client and server. No manual typing.', link: '/wires/rpc' },
    { icon: 'cli', title: 'Turn any function into a CLI', outcome: 'Argument parsing, help text, and validation — from your existing types.', link: '/wires/cli' },
    { icon: 'mcp', title: 'Expose functions to AI tools', outcome: 'MCP-compatible tools for Claude, Cursor, and other AI assistants.', link: '/wires/mcp' },
    { icon: 'trigger', title: 'React to external events', outcome: 'Webhooks, database changes — trigger any function automatically.', link: '/wires/trigger' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">What You Get</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            Every protocol your backend needs.<br className="hidden md:block" />
            <span className="text-primary">None of the copy-paste.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Add a new transport with one line. Auth, validation, and middleware carry over automatically — because the function is the same.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outcomes.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="group flex items-start gap-4 p-5 bg-[#0d0d0d] border border-neutral-800 rounded-xl hover:border-neutral-600 transition-colors no-underline"
            >
              <div className="flex-shrink-0 mt-0.5">
                <WiringIcon wiringId={item.icon} size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                  {item.badge && (
                    <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{item.outcome}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Only need HTTP right now? Start there. Add protocols later without touching your functions — zero upfront cost.
        </p>
      </div>
    </section>
  );
}

/** Differentiators — Agents, Workflows, Addons with code previews */
function DifferentiatorsSection() {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-violet-400" />,
      tag: 'AI Agents',
      tagColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
      badge: 'Alpha',
      title: 'Agents that build their own workflows',
      desc: 'Other frameworks let AI call tools in a loop — burning tokens every run. Pikku agents design actual workflow graphs that run natively after the first pass. No AI in the loop. No token cost. And when you\'re ready, promote runtime workflows to version-controlled code.',
      code: `const ops = pikkuAgent({
  tools: [getMetrics, scaleService, notify],
  model: 'claude-sonnet-4-5',
  // Agent creates workflows from your functions
  dynamicWorkflows: 'write',
})
// First run: AI designs the workflow
// Every run after: native execution, zero tokens`,
      benefits: [
        'Saved workflows — zero tokens on repeat tasks',
        'Native execution — no AI in the loop',
        'graph-to-dsl — promote to version-controlled code',
      ],
      link: '/wires/bot',
      linkText: 'Learn about AI Agents',
    },
    {
      icon: <Workflow className="w-6 h-6 text-emerald-400" />,
      tag: 'Workflows',
      tagColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      title: 'Multi-step processes that survive restarts',
      desc: 'No separate workflow engine. Write sequential steps like normal code. Pikku persists each step, retries on failure, and resumes exactly where it left off — even after deploys.',
      code: `await workflow.do('Create profile', 'createProfile', { userId })
await workflow.sleep('Wait', '5min')
await workflow.do('Send welcome', 'sendEmail', { to: email })`,
      benefits: [
        'Deterministic replay from the exact failure point',
        'Sleep for minutes, hours, or weeks',
        'State persists to PostgreSQL or Redis',
      ],
      link: '/wires/workflow',
      linkText: 'Learn about Workflows',
    },
    {
      icon: <Package className="w-6 h-6 text-orange-400" />,
      tag: 'Addons',
      tagColor: 'text-orange-400',
      borderColor: 'border-orange-500/20',
      title: 'Install Stripe billing in one line',
      desc: 'Addons are drop-in backend features. One wireAddon() call adds Stripe, SendGrid, or any package — fully typed, namespaced, sharing your existing database and services.',
      code: `wireAddon({ name: 'stripe', package: '@pikku/addon-stripe' })
// Then call it from anywhere:
await rpc.invoke('stripe:checkoutCreate', { plan: 'pro' })`,
      benefits: [
        'Drop-in packages, not bolt-on frameworks',
        'Fully typed across package boundaries',
        'Secrets you control via secretOverrides',
      ],
      link: '/features#addons',
      linkText: 'Learn about Addons',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-rose-400" />,
      tag: 'Gateway',
      tagColor: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      badge: 'New',
      title: 'One handler for WhatsApp, Slack, and Telegram',
      desc: 'Most messaging integrations mean a new SDK, a new webhook handler, and a new auth layer per platform. With Pikku, write one handler — the adapter normalizes every platform into the same message format.',
      code: `wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})`,
      benefits: [
        'Normalized messages — same interface across all platforms',
        'Auto webhook verification for WhatsApp, Slack, Telegram',
        'Webhook, WebSocket, or listener — same handler function',
      ],
      link: '/wires/gateway',
      linkText: 'Learn about Gateways',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">More Than a Router</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            AI agents, durable workflows,<br className="hidden md:block" />
            and drop-in billing — <span className="text-primary">built in.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            tRPC stops at HTTP. Hono gives you a fast router. NestJS buries you in decorators. Pikku gives you agents, workflows, and installable backend features — all using the same functions you've already written.
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feat, i) => (
            <div key={i} className={`bg-[#0d0d0d] border ${feat.borderColor || 'border-neutral-800'} rounded-2xl p-8 md:p-10`}>
              <div className="flex items-center gap-3 mb-4">
                {feat.icon}
                <span className={`text-xs font-bold tracking-widest uppercase ${feat.tagColor}`}>{feat.tag}</span>
                {feat.badge && (
                  <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    {feat.badge}
                  </span>
                )}
              </div>

              <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-neutral-400 leading-relaxed mb-6">{feat.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {feat.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold mt-0.5">&#10003;</span>
                        <span className="text-sm text-neutral-400">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={feat.link} className="text-primary hover:underline font-medium text-sm">
                    {feat.linkText} →
                  </Link>
                </div>

                <div className="rounded-xl border border-neutral-700/80 overflow-hidden self-start max-w-full">
                  <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px] sm:text-sm [&_pre]:!overflow-x-auto [&_pre]:max-w-[calc(100vw-4rem)]">
                    <CodeBlock language="typescript">{feat.code}</CodeBlock>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Pikku - One Function, Every Wiring"
      description="Write backend logic once and wire it to HTTP, WebSockets, queues, cron jobs, AI agents, and more. Deploy anywhere — Express, Lambda, Cloudflare Workers, and beyond."
    >
      <NavbarPageToggle isDeveloperPage={false} />
      <Hero />
      <main>
        <ProblemSection />
        <SolutionSection />
        <DifferentiatorsSection />
        <TestimonialsSection />
        <WhatYouGetSection />
        <DeployAnywhereSection />
        <ProductionFeaturesSection />
        <ConsoleSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
