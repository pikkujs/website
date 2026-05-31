import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Image from '@theme/ThemedImage';
import { WiringIcon } from '../components/WiringIcons';
import { runtimes } from '@site/data/homepage';
import { testimonials } from '@site/data/testimonials';
import {
  Hero, NavbarPageToggle, CallToActionSection,
} from '../components/HomepageShared';
import {
  Copy, AlertTriangle, Lock, Bot, Workflow, Zap, ShieldCheck,
  Link2, Settings, Layers, CheckCircle2, Feather, RefreshCw, Timer, Database,
  Plug, GitBranch, FileCode, ArrowRight,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   Section 1 — Hero (imported from HomepageShared)
   ════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   Section 2 — Problem
   ════════════════════════════════════════════════════════════════ */
function ProblemSection() {
  const pains = [
    {
      icon: <Copy className="w-6 h-6" />,
      title: 'Same logic, five handlers',
      desc: 'getCard exists in your HTTP handler, your WebSocket handler, your queue worker, and your CLI. They started as copies. Now they\'ve drifted — and only one of them has the bug fix.',
      color: 'text-white/55',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Every protocol brings its own world',
      desc: 'AI agents mean Vercel AI SDK. Workflows mean Inngest or Temporal. MCP means yet another adapter. Each brings its own auth model, schema format, and deploy pipeline. None of them talk to each other.',
      color: 'text-white/55',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Runtime change = full rewrite',
      desc: 'Moving from Express to Lambda touches every handler. Your business logic is fused to framework APIs you never wanted to own. There\'s no clean seam to cut along.',
      color: 'text-white/55',
    },
  ];

  return (
    <section id="how-it-works" className="py-10 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Sound Familiar?</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            You've written this function<br className="hidden md:block" /> more times than you'd admit.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
            Every new protocol means another copy-paste, another auth re-wire, another handler that drifts from the last. That's not technical debt — that's a missing abstraction.
          </p>
          <p className="text-sm text-neutral-500 italic max-w-xl mt-4">
            "So many places in my code base have like three entry points: CLI, public HTTP API and internally from within the API. Would be so nice having everything just an invoke away."
            <span className="not-italic block mt-1 text-neutral-600">— Alex Harley, Co-founder @ Superbridge</span>
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

/* ════════════════════════════════════════════════════════════════
   Section 3 — Solution (Before/After)
   ════════════════════════════════════════════════════════════════ */
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
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Fix</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            One function. Every protocol.<br />
            <span className="text-primary">Fix it once, it's fixed everywhere.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-400">Without Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">5 copies that drift</span>
            </div>
            <div className="rounded-xl border border-white/12 overflow-hidden opacity-70">
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
            <div className="rounded-xl border border-white/12 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px] sm:text-sm [&_pre]:!overflow-x-auto [&_pre]:max-w-[calc(100vw-4rem)]">
                <CodeBlock language="typescript">{afterCode}</CodeBlock>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['+ SSE', '+ RPC', '+ MCP', '+ AI Agent', '+ Workflow', '+ Trigger', '+ Gateway'].map((label) => (
            <span key={label} className="px-3 py-1.5 bg-white/5 border border-white/12 rounded-full text-xs font-medium text-white/55">
              {label}
            </span>
          ))}
        </div>
        <p className="text-sm text-neutral-500 mt-4">
          12 protocols total — all with the same pattern.{' '}
          <Link to="/developers" className="text-primary hover:underline">
            See every wiring in action
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Section 4 — System Model (Five Primitives)
   ════════════════════════════════════════════════════════════════ */
function SystemModelSection() {
  const [active, setActive] = React.useState(0);

  const primitives = [
    {
      id: 'functions',
      label: 'Functions',
      icon: <FileCode className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/15',
      bgColor: 'bg-white/5',
      summary: 'Typed, testable units of business logic. No framework coupling, no handler boilerplate.',
      code: `import { pikkuFunc } from '#pikku'

export const getBook = pikkuFunc<{ bookId: string }, Book>({
  func: async ({ database }, data) => {
    return await database.query('book', { bookId: data.bookId })
  },
  title: 'Fetch a book by ID',
  description: 'Returns a book from the database',
  tags: ['books']
})`,
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Settings className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/15',
      bgColor: 'bg-white/5',
      summary: 'Singleton and per-session dependency injection. Type-safe, testable, zero decorators.',
      code: `// Singleton services — created once, shared across requests
export const createSingletonServices = pikkuServices(
  async (config) => {
    const logger = new ConsoleLogger()
    const jwt = new JoseJWTService(async () => [
      { id: 'my-key', value: process.env.JWT_SECRET! }
    ], logger)
    const database = new DatabasePool(config.database)
    return { config, logger, jwt, database }
  }
)

// Per-wire services — created per request
export const createWireServices = pikkuWireServices(
  async (singletonServices, wire) => ({
    userSession: createUserSessionService(wire),
  })
)`,
    },
    {
      id: 'security',
      label: 'Auth & Middleware',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/12',
      bgColor: 'bg-white/8',
      summary: 'Permissions, session auth, and before/after hooks — defined once, enforced across every protocol automatically.',
      code: `// Permission guards — session-only or data-aware
export const requireAdmin = pikkuPermission(
  async (_services, _data, { session }) => session?.role === 'admin'
)
export const requireOwnership = pikkuPermission<{ bookId: string }>(
  async ({ database }, data, { session }) => {
    const book = await database.query('books', { id: data.bookId })
    return book?.ownerId === session?.userId
  }
)

// Compose — OR between keys, AND within arrays
const deleteBook = pikkuFunc({
  func: async ({ database }, { bookId }) => database.delete('books', bookId),
  permissions: { admin: requireAdmin, owner: requireOwnership }
})

// Global middleware — bearer auth, CORS, scoped routes
addHTTPMiddleware([authBearer(), cors()])
addHTTPMiddleware('/admin', [auditMiddleware])`,
    },
    {
      id: 'wires',
      label: 'Wires',
      icon: <Plug className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/12',
      bgColor: 'bg-white/8',
      summary: 'Map functions to transports: HTTP, WebSocket, queues, cron, CLI, and more. One line of config, not a rewrite.',
      code: `wireHTTP({ method: 'get', route: '/books/:bookId', func: getBook })
wireChannel({ name: 'books', route: '/books', onMessage: getBook })
wireQueueWorker({ queue: 'fetch-book', func: getBook })
wireScheduler({ schedule: '0 3 * * *', func: generateReport })
wireCLI({ program: 'books', commands: {
  get: pikkuCLICommand({ parameters: '<bookId>', func: getBook })
}})`,
    },
    {
      id: 'workflows',
      label: 'Workflows',

      icon: <Workflow className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/12',
      bgColor: 'bg-white/8',
      summary: 'Multi-step processes that survive restarts. Deterministic replay, durable sleep, no separate engine.',
      code: `export const onboardingWorkflow = pikkuWorkflowFunc<
  { email: string; userId: string },
  { success: boolean }
>(async ({ workflow, rpc }, data) => {
  await workflow.do('Create profile', 'createUserProfile', data)
  await workflow.sleep('Wait before welcome email', '5min')
  await workflow.do('Send welcome', 'sendEmail', {
    to: data.email, template: 'welcome'
  })
  return { success: true }
})`,
    },
    {
      id: 'agents',
      label: 'Agents',

      icon: <Bot className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/15',
      bgColor: 'bg-white/5',
      summary: 'AI agents that use your existing functions as tools. Auth, types, and middleware carry over. No adapters.',
      code: `export const retreatAssistant = pikkuAIAgent({
  name: 'retreat-assistant',
  description: 'Manages retreat operations',
  instructions: 'You help manage retreat stays, tasks, and meals.',
  model: 'anthropic/claude-sonnet-4-5',
  tools: [
    // Stays
    requestStay, approveStayRequest, createStayFromRequest,
    // Tasks
    createTaskInstance, assignTask, completeTask, listTasks,
    // Kitchen
    createMealService, listRetreatMeals, upsertDietaryProfile,
  ],
  memory: { storage: 'aiStorage', lastMessages: 10 },
  maxSteps: 5,
})`,
    },
    {
      id: 'gateways',
      label: 'Gateways',

      icon: <Zap className="w-5 h-5" />,
      color: 'text-white/55',
      borderColor: 'border-white/12',
      bgColor: 'bg-white/8',
      summary: 'One handler for WhatsApp, Slack, Telegram, and any messaging platform. Adapters normalize the differences.',
      code: `wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})

wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage, // same handler, different platform
})`,
    },
  ];

  const p = primitives[active];

  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Mental Model</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            A lot of moving parts.<br className="hidden md:block" />
            <span className="text-primary">One coherent system.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl">
            Functions, services, auth, transports, workflows, agents, gateways — all speaking the same language.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {primitives.map((prim, i) => (
            <button
              key={prim.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                active === i
                  ? `${prim.bgColor} ${prim.borderColor} ${prim.color}`
                  : 'border-neutral-800 bg-[#0d0d0d] text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
              }`}
            >
              {prim.icon}
              {prim.label}
            </button>
          ))}
        </div>

        {/* Active primitive content */}
        <div className={`rounded-2xl border ${p.borderColor} bg-[#0d0d0d] p-6 md:p-8 transition-all`}>
          <div className="grid lg:grid-cols-[2fr_3fr] gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${p.color} flex-shrink-0`}>{p.icon}</div>
                <h3 className="text-xl font-bold text-white leading-none">{p.label}</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed mb-6">{p.summary}</p>
              <Link to={`/docs`} className="text-primary hover:underline font-medium text-sm">
                Learn more about {p.label.toLowerCase()} →
              </Link>
            </div>
            <div className="rounded-xl border border-neutral-700/60 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px] sm:text-sm [&_pre]:!overflow-x-auto [&_pre]:max-w-[calc(100vw-4rem)]">
                <CodeBlock language="typescript">{p.code}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Section 5 — Differentiators (AI Agents + Workflows + Console)
   ════════════════════════════════════════════════════════════════ */
function DifferentiatorsSection() {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-primary" />,
      tag: 'AI Agents',
      tagColor: 'text-primary',
      borderColor: 'border-white/12',

      title: 'Your functions are already agent tools',
      desc: 'Other frameworks need adapters, re-defined schemas, and a separate auth layer before your functions can talk to an AI agent. With Pikku, they\'re already there — types, permissions, and middleware included.',
      code: `const support = pikkuAgent({
  instructions: 'You are a support agent...',
  tools: [getCustomer, getOrders, createTicket],
  model: 'claude-sonnet-4-5'
})`,
      benefits: [
        'Zero-cost tool registration',
        'Auth and filters apply to the agent automatically',
        'One CLI handler becomes one MCP tool',
      ],
      link: '/wires/bot',
      linkText: 'Learn about AI Agents',
    },
    {
      icon: <Workflow className="w-6 h-6 text-emerald-400" />,
      tag: 'Workflows',
      tagColor: 'text-emerald-400',
      borderColor: 'border-white/12',

      title: 'Multi-step processes that survive restarts',
      desc: 'No separate workflow engine to run or operate. Write sequential steps like normal code — Pikku persists each step, retries on failure, and resumes exactly where it left off.',
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
  ];

  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">More Than a Router</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            AI agents and durable workflows —<br className="hidden md:block" />
            <span className="text-primary">no extra engine required.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl">
            tRPC stops at HTTP. Hono is a fast router and nothing more. NestJS buries you in decorators. Pikku gives you agents and workflows built on the same functions you've already written.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {features.map((feat, i) => (
            <div key={i} className={`bg-[#0d0d0d] border ${feat.borderColor || 'border-neutral-800'} rounded-2xl p-8 md:p-10`}>
              <div className="flex items-center gap-3 mb-4">
                {feat.icon}
                <span className={`text-xs font-bold tracking-widest uppercase ${feat.tagColor}`}>{feat.tag}</span>
              </div>

              <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-neutral-400 leading-relaxed mb-6">{feat.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {feat.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white/55 text-[10px] font-bold mt-0.5">&#10003;</span>
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

        {/* Console preview — visual proof */}
        <div className="relative max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/65">Pikku Console</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Browse functions, run agents, manage secrets, and trigger workflows — no custom tooling code required.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="/img/console-screenshot.webp" loading="lazy"
              alt="Pikku Console — browse and inspect all functions, wirings, and services"
              className="w-full block"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-xl pointer-events-none" />
          <div className="mt-4">
            <Link to="/features#console" className="text-primary hover:underline font-medium text-sm">
              Learn about the Console →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Section 6 — Production + Trust
   (Deploy Anywhere + Production Features + Testimonials merged)
   ════════════════════════════════════════════════════════════════ */
function ProductionTrustSection() {
  const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom];

  const features = [
    { title: 'Type-Safe Clients', desc: 'Auto-generated HTTP, WebSocket, and RPC clients with full IntelliSense. No schema drift between server and client.', icon: <Link2 className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
    { title: 'Auth & Permissions', desc: 'Cookie, bearer, and API key auth with fine-grained permissions — wired across every protocol from day one.', icon: <ShieldCheck className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
    { title: 'Services', desc: "Singleton and per-request dependency injection that's type-safe, testable, and decorator-free.", icon: <Settings className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
    { title: 'Middleware', desc: 'Before/after hooks for logging, metrics, and tracing. Write once, works across all transports.', icon: <Layers className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
    { title: 'Schema Validation', desc: 'Runtime validation against TypeScript input schemas. Zod supported out of the box.', icon: <CheckCircle2 className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
    { title: 'Zero Lock-In', desc: 'Standard TypeScript, minimal runtime, MIT licensed. Bring your own everything — swap any piece at any time.', icon: <Feather className="w-5 h-5" />, iconBg: 'bg-white/[0.06] text-white/55 border-white/12' },
  ];

  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Deploy Anywhere strip */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/65 block mb-4">Deploy Anywhere</span>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white mb-4">
            Change your runtime. Keep your functions.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mb-8">
            The same code runs on Express, Fastify, AWS Lambda, Cloudflare Workers, Next.js, and more. Swap the adapter, not the logic.
          </p>

          <div className="flex flex-wrap gap-3 max-w-3xl mb-4">
            {allRuntimes.map((runtime, idx) => (
              <Link
                key={idx}
                to={runtime.docs}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0d0d0d] border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors duration-200 no-underline"
                title={`Deploy to ${runtime.name}`}
              >
                <Image
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  sources={{
                    light: `img/logos/${runtime.img.light}`,
                    dark: `img/logos/${runtime.img.dark}`
                  }}
                />
                <span className="text-sm font-medium text-neutral-300">{runtime.name}</span>
              </Link>
            ))}
          </div>
          <p className="text-sm text-neutral-500">
            Any custom runtime supported via the adapter interface.{' '}
            <Link to="/docs/custom-runtimes/custom-http-runtime" className="text-primary hover:underline">
              Build your own →
            </Link>
          </p>
        </div>

        {/* Production Features grid */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-6">Built For Production</p>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-[#0d0d0d] p-6 text-left transition-colors hover:border-neutral-700">
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${feature.iconBg} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            MIT licensed. Standard TypeScript. No VC-backed lock-in.
          </p>
        </div>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-6">What Developers Say</p>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
                  <p className="text-neutral-300 mb-4 italic leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold text-neutral-100">{testimonial.author}</p>
                    <p className="text-neutral-500">
                      {testimonial.role}{testimonial.company ? ` @ ${testimonial.company}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Fabric Callout
   ════════════════════════════════════════════════════════════════ */
function FabricCallout() {
  return (
    <section className="py-10 lg:py-16 border-t border-neutral-800/50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <img src="/img/fabric-logo.svg" width={48} height={48} alt="Fabric logo" />
            <span className="text-2xl font-bold text-white tracking-tight">Fabric</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Rather not manage the infra?
          </h2>
          <p className="text-base text-neutral-400 max-w-lg mb-8 leading-relaxed">
            Fabric is our deployment platform — push your code and every function deploys as a serverless worker. Getting its own home at <strong className="text-white/65">pikkufabric.com</strong> soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="https://pikkufabric.com"
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0f] hover:bg-white/90 px-6 py-3 rounded-lg font-semibold text-sm transition no-underline w-fit"
            >
              Learn about Fabric <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page Assembly
   ════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <Layout
      title="Pikku - One Function, Every Protocol"
      description="Write backend logic once and wire it to HTTP, WebSockets, queues, cron jobs, AI agents, and more. Deploy anywhere — Express, Lambda, Cloudflare Workers, and beyond."
    >
      <NavbarPageToggle isDeveloperPage={false} />
      <Hero />
      <main>
        <ProblemSection />
        <SolutionSection />
        <SystemModelSection />
        <DifferentiatorsSection />
        <ProductionTrustSection />
        <FabricCallout />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
