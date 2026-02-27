import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';
import { WiringIcon } from '../components/WiringIcons';
import LiveExamples from '../components/LiveExamples';
import { BundleArchitecturesSection } from '../components/BundleArchitecturesSection';
import { testimonials } from '@site/data/testimonials';
import Card from '../components/Card';
import {
  Zap, ShieldCheck, Plug, RefreshCw, Timer, Database,
  Search, Bot, Key, LayoutDashboard, Link2, Settings,
  Layers, CheckCircle2, Feather, GitBranch, Puzzle, Lock,
  Package, Blocks, KeyRound,
} from 'lucide-react';

/** Reusable component for Pikku logo surrounded by icons */
function PikkuCircularLayout({
  items,
  renderItem,
  logoSize = 180,
  radius = 180,
  animate = false,
  orbitRotate = false,
  className = '',
  minHeight = 400,
  centerOverlay,
  centerNode,
  showTrack = false,
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  logoSize?: number;
  radius?: number;
  animate?: boolean;
  orbitRotate?: boolean;
  className?: string;
  minHeight?: number;
  centerOverlay?: React.ReactNode;
  centerNode?: React.ReactNode;
  showTrack?: boolean;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight }}>
      {/* Orbit track ring */}
      {showTrack && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-neutral-700/30"
            style={{ width: radius * 2 + 64, height: radius * 2 + 64 }}
          />
        </div>
      )}

      <div className={`relative z-10 flex flex-col items-center ${animate ? 'animate-chameleon-enter' : ''}`}>
        {centerNode ?? (
          <Image
            sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }}
            width={logoSize}
            height={logoSize}
            className="mx-auto"
            style={{ objectFit: 'contain' }}
          />
        )}
        {centerOverlay && (
          <div className="mt-2 text-center">{centerOverlay}</div>
        )}
      </div>

      {/* Items arranged in a circle around Pikku */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative ${orbitRotate ? 'animate-orbit-rotate' : ''}`} style={{ width: '100%', height: '100%' }}>
          {items.map((item, index) => {
            const total = items.length;
            const angle = (index * 360) / total;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

            return (
              <div
                key={index}
                className={`absolute ${animate ? 'animate-icon-fan-out' : ''}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  ...(animate ? { animationDelay: `${index * 0.08 + 0.3}s` } : {}),
                }}
              >
                <div className={orbitRotate ? 'animate-orbit-counter-rotate' : ''}>
                  {renderItem(item, index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Hero Section */
function Hero() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const protocols = [
    { icon: 'http',      label: 'HTTP',       color: '#22c55e', hueRotate: 80,  link: '/wires/http' },
    { icon: 'websocket', label: 'WebSocket',  color: '#a855f7', hueRotate: 240, link: '/wires/websocket' },
    { icon: 'sse',       label: 'SSE',        color: '#f97316', hueRotate: -10, link: null },
    { icon: 'queue',     label: 'Queue',      color: '#ef4444', hueRotate: -40, link: '/wires/queue' },
    { icon: 'cron',      label: 'Cron',       color: '#eab308', hueRotate: 20,  link: '/wires/cron' },
    { icon: 'rpc',       label: 'RPC',        color: '#3b82f6', hueRotate: 180, link: '/wires/rpc' },
    { icon: 'mcp',       label: 'MCP',        color: '#ec4899', hueRotate: 290, link: '/wires/mcp' },
    { icon: 'cli',       label: 'CLI',        color: '#06b6d4', hueRotate: 145, link: '/wires/cli' },
    { icon: 'bot',       label: 'AI Agent',   color: '#8b5cf6', hueRotate: 220, link: '/wires/bot' },
    { icon: 'workflow',  label: 'Workflow',   color: '#10b981', hueRotate: 115, link: '/wires/workflow' },
    { icon: 'trigger',   label: 'Trigger',    color: '#f59e0b', hueRotate: 0,   link: '/wires/trigger' },
  ];

  const hovered = hoveredIndex !== null ? protocols[hoveredIndex] : null;

  return (
    <div className="hero-section w-full relative overflow-hidden">
      {/* Glow orbs behind the chameleon */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute right-[12%] top-[40%] w-52 h-52 rounded-full bg-cyan-400/10 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-10 pb-8 lg:pt-12 lg:pb-8 px-6 gap-12 items-center">
        {/* Left: Text content */}
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded mb-6">
            The TypeScript Function Framework
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">One function.</span><br />
            <span className="text-primary">Every protocol.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-4 text-neutral-300">
            Write your TypeScript backend once. Pikku wires it to HTTP, WebSocket, queues, cron, CLI, and AI agents — same function, same auth, same middleware.
          </p>
          <p className="text-sm text-neutral-500 mb-6 lg:mb-14">
            Like tRPC's type safety, Hono's speed, and NestJS's structure — without choosing between them.
          </p>
          <ul className="text-base mb-6 lg:mb-14 space-y-2 text-neutral-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">✓</span>
              <span>Unified backend logic across all protocols</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">✓</span>
              <span>Serverless or server — deploy anywhere without code changes</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">✓</span>
              <span>Full TypeScript type safety end-to-end</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">✓</span>
              <span>Production-ready with sessions, auth, and middleware</span>
            </li>
          </ul>
          <div className="flex flex-row gap-4 mt-6">
            <Link
              to="/getting-started"
              className="button button--primary button--lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Try It in 5 Minutes
            </Link>
            <Link
              to="/features"
              className="button button--secondary button--lg hover:scale-105 transition-transform"
            >
              Explore Features
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-400 font-mono">
            $ npm create pikku@latest &nbsp;·&nbsp; <span className="text-primary/70">MIT Licensed</span> &nbsp;·&nbsp; <span className="text-primary/70">Open Source</span>
          </p>
        </div>

        {/* Right: Chameleon mascot + protocol orbit */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center flex-col">
          <PikkuCircularLayout
            items={protocols}
            renderItem={(item, index) => {
              const content = (
                <div
                  className="flex flex-col items-center gap-1.5 transition-transform duration-200 hover:scale-110"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <WiringIcon wiringId={item.icon} size={40} />
                  <span className="text-white/50 text-[11px] font-medium tracking-wide">{item.label}</span>
                </div>
              );
              return item.link ? (
                <Link to={item.link} className="no-underline cursor-pointer">{content}</Link>
              ) : (
                <div className="cursor-default">{content}</div>
              );
            }}
            centerNode={
              <div style={{ width: 210, height: 210, position: 'relative' }}>
                <img
                  src="/img/pikku.png"
                  width={210}
                  height={210}
                  alt="Pikku"
                  style={{
                    objectFit: 'contain',
                    position: 'absolute', top: 0, left: 0,
                    opacity: hovered ? 0 : 1,
                    transition: 'opacity 0.35s ease',
                  }}
                />
                <img
                  src="/img/pikku-outline.svg"
                  width={210}
                  height={210}
                  alt=""
                  style={{
                    objectFit: 'contain',
                    position: 'absolute', top: 0, left: 0,
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.35s ease, filter 0.35s ease',
                    filter: hovered
                      ? `brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(${hovered.hueRotate}deg) drop-shadow(0 0 18px ${hovered.color})`
                      : 'none',
                  }}
                />
              </div>
            }
            logoSize={210}
            radius={175}
            animate
            orbitRotate
          />
          <p className="text-white/30 text-xs font-medium tracking-widest uppercase text-center mt-6">
            Like a chameleon adapts — your functions adapt
          </p>
        </div>
      </header>

      {/* Built with Pikku — logo bar anchored to bottom of hero */}
      <div className="max-w-screen-xl mx-auto w-full px-6 pb-8 pt-6">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-white/20 mb-0">
          Built with Pikku
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6">
          {[
            { name: 'AgreeWe',          logo: 'agreewe-dark.png',         url: 'https://www.agreewe.com' },
            { name: 'HeyGermany',       logo: 'heygermany-dark.svg',      url: 'https://hey-germany.com' },
            { name: 'marta',            logo: 'marta-light.svg',          url: 'https://marta.de' },
            { name: 'BambooRose',       logo: 'bamboorose-dark.png',      url: 'https://bamboorose.com' },
            { name: 'Calligraphy Cut',  logo: 'calligraphycut-dark.svg',  url: 'https://calligraphy-cut.com' },
          ].map((company) => (
            <Link
              key={company.name}
              href={company.url}
              className="flex items-center justify-center px-4 py-3 rounded-lg opacity-55 hover:opacity-80 transition-opacity"
              title={company.name}
            >
              <img
                src={`img/logos/${company.logo}`}
                alt={company.name}
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Pain framing — three root causes developers recognise immediately */
function PainSection() {
  const pains = [
    {
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      title: 'Every protocol is another copy',
      desc: 'HTTP, WebSocket, queues, CLI, SSE — five protocols, five handlers. They start as copies but drift apart. Auth gets fixed in one place, not the others. Bugs multiply in silence.',
    },
    {
      icon: <Puzzle className="w-6 h-6 text-primary" />,
      title: 'Workflows, agents, and MCP are always extra work',
      desc: "Wiring a function to a workflow engine, an AI agent, or an MCP server means adapters, schema re-definitions, and another auth layer to maintain — even for logic you've already shipped.",
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Switching infrastructure means rewriting",
      desc: 'Going from Express to Lambda, or Cloudflare Workers to a container, touches every handler. Your business logic ends up tangled with framework APIs you never wanted to care about.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            You've written this function<br className="hidden md:block" /> more than once.
          </h2>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            And you'll write it again. Here's why.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-7">
              <div className="mb-5">{pain.icon}</div>
              <h3 className="text-base font-bold mb-3 text-white">{pain.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Before/After — visual contrast showing the problem vs. the Pikku solution */
function BeforeAfterSection() {
  const beforeCode = `// Same logic, copied per protocol
app.get('/cards/:id', auth, validate, async (req, res) => {
  const card = await db.getCard(req.params.id)
  res.json(card)
})
ws.on('getCard', auth, validate, async (msg, socket) => {
  const card = await db.getCard(msg.cardId) // ← again
  socket.send(JSON.stringify(card))
})
// + queue, cron, CLI, RPC, SSE... each drifts.

// ─── Workflow? Add Inngest / Temporal ────
inngest.createFunction({ id: 'onboarding' }, ...,
  async ({ step }) => {
    await step.run('create-profile', () => createProfile(id))
    await step.sleep('wait', '5m')
    await step.run('send-welcome', () => sendWelcome(id))
  })
// New SDK, new schema, new deploy pipeline.

// ─── AI agent? Add Vercel AI / LangChain ─
const tools = { getCard: tool({
  parameters: z.object({ cardId: z.string() }),
  execute: async ({ cardId }) => db.getCard(cardId),
})} // Auth? Permissions? You're on your own.
// Three frameworks. Three auth layers. One backend.`;

  const afterCode = `// With Pikku — write it once
const getCard = pikkuFunc({
  func: async ({ db, audit }, { cardId }) => {
    const card = await db.getCard(cardId)
    await audit.log('getCard', { cardId })
    return card
  },
  permissions: { user: isAuthenticated }
})

// Wire it to anything — same auth, same logic
wireHTTP({ method: 'get', route: '/cards/:cardId', func: getCard })
wireChannel({ name: 'cards', onMessage: { getCard } })
wireQueueWorker({ queue: 'fetch-card', func: getCard })
wireCLI({ program: 'cards', commands: { get: getCard } })

// Workflows just reference your functions
const onboarding = pikkuWorkflowFunc(
  async ({}, { userId }, { workflow }) => {
    await workflow.do('Create profile', 'createProfile', { userId })
    await workflow.sleep('Wait 5 min', '5m')
    await workflow.do('Send welcome', 'sendWelcome', { userId })
  }
)

// AI agents too — same functions, same auth
const support = pikkuAgent({
  tools: [getCard, getOrders, createTicket],
  model: 'claude-sonnet-4-5'
})
// Auth, permissions, and validation carry over. Done.`;

  return (
    <section className="py-8 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Difference</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            Four handlers that drift apart — or <span className="text-primary">one function that doesn't.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Before */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-400">Without Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">repeated + fragile</span>
            </div>
            <div className="rounded-xl border border-red-500/20 overflow-hidden opacity-70">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-sm">
                <CodeBlock language="typescript">{beforeCode}</CodeBlock>
              </div>
            </div>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">With Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">1 function + wirings</span>
            </div>
            <div className="rounded-xl border border-green-500/20 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-sm">
                <CodeBlock language="typescript">{afterCode}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The "Aha!" Moment: One Function, Many Protocols */
function AhaMomentSection() {
  const [activeProtocol, setActiveProtocol] = React.useState<number | null>(0); // Default to HTTP

  const functionCode = `const getCard = pikkuFunc({
  title: 'Get Card',
  description: 'Retrieve a card by ID',
  func: async ({ db, audit }, { cardId }) => {
    const card = await db.getCard(cardId)
    await audit.log('getCard', { cardId })
    return card
  },
  permissions: { user: isAuthenticated }
})`;

  const wiringExamples = [
    {
      title: 'HTTP API',
      icon: 'http',
      code: `wireHTTP({
  method: 'get',
  route: '/cards/:cardId',
  func: getCard
})`
    },
    {
      title: 'WebSocket',
      icon: 'websocket',
      code: `wireChannel({
  name: 'cards',
  onConnect: onCardConnect,
  onDisconnect: onCardDisconnect,
  onMessageWiring: {
    action: { getCard }
  }
})`
    },
    {
      title: 'Server-Sent Events',
      icon: 'sse',
      code: `wireHTTP({
  method: 'get',
  route: '/cards/:cardId',
  func: getCard,
  sse: true
})`
    },
    {
      title: 'Queue Worker',
      icon: 'queue',
      code: `// Basic queue
wireQueueWorker({
  queue: 'fetch-card',
  func: getCard
})

// With options
wireQueueWorker({
  queue: 'fetch-card',
  func: getCard,
  concurrency: 5,
  rateLimiter: {
    max: 10,
    duration: 1000
  }
})`
    },
    {
      title: 'Scheduled Task',
      icon: 'cron',
      code: `wireScheduler({
  cron: '0 * * * *',
  func: getCard
})`
    },
    {
      title: 'RPC Call',
      icon: 'rpc',
      code: `// From another function:
const card = await rpc.invoke(
  'getCard',
  { cardId: '123' }
)`
    },
    {
      title: 'MCP (AI Tools)',
      icon: 'mcp',
      code: `wireMCPResource({
  uri: 'card/{cardId}',
  func: getCard,
  tags: ['cards', 'data']
})`
    },
    {
      title: 'CLI',
      icon: 'cli',
      code: `wireCLI({
  program: 'cards',
  commands: {
    // Command
    get: pikkuCLICommand({
      parameters: '<cardId>',
      func: getCard
    }),
    // Subcommands
    manage: {
      subcommands: {
        get: pikkuCLICommand({
          parameters: '<cardId>',
          func: getCard
        })
      }
    }
  }
})`
    },
    {
      title: 'AI Agent',
      icon: 'bot',
      code: `addAIAgent('cardAgent', {
  name: 'Card Assistant',
  description: 'Helps users look up cards',
  instructions: \`You help users manage
their cards. Use the tools
provided to look up card info.\`,
  model: 'claude-3-5-sonnet-20241022',
  tools: [getCard],
  maxSteps: 5,
})`
    },
    {
      title: 'Workflow',
      icon: 'workflow',
      code: `// Steps never re-execute on replay
export const processCardWorkflow = pikkuWorkflowFunc<
  { cardId: string },
  { card: Card }
>(async ({}, { cardId }, { workflow }) => {
  const card = await workflow.do(
    'Fetch card',
    'getCard',
    { cardId }
  )
  await workflow.sleep('Wait', '5s')
  await workflow.do(
    'Notify owner',
    'sendNotification',
    { cardId: card.id }
  )
  return { card }
})`
    },
    {
      title: 'Trigger',
      icon: 'trigger',
      code: `wireTrigger({
  name: 'cardChanged',
  func: getCard,
})

// Register the trigger source
wireTriggerSource({
  name: 'cardChanged',
  func: webhookTrigger,
  input: { secret: process.env.WEBHOOK_SECRET }
})`
    },
  ];

  return (
    <section id="code-examples" className="py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-6 lg:mb-14">
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Same function. <span className="text-primary">Any transport.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            The function on the left works with every protocol on the right. Same auth, same validation, zero rewrites.
          </p>
        </div>

        {/* Three-column pipeline: define → pick protocol → see wiring */}
        <div className="grid md:grid-cols-[5fr_3fr_5fr] gap-8 items-start max-w-6xl mx-auto">

          {/* Col 1: function definition */}
          <div className="w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Write once</p>
            <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
                <span className="text-sm font-semibold text-neutral-200">getCard.ts</span>
                <span className="ml-auto text-xs text-neutral-600 font-mono">func.ts</span>
              </div>
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
                <CodeBlock language="typescript">{functionCode}</CodeBlock>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Same auth & permissions across all protocols',
                'One place to fix bugs and add features',
                'Type-safe inputs and outputs everywhere',
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">✓</span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: circular protocol selector */}
          <div className="flex flex-col items-center w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-1 self-start">Pick a protocol</p>
            <PikkuCircularLayout
              items={wiringExamples}
              renderItem={(example, idx) => {
                const isActive = activeProtocol === idx;
                return (
                  <button
                    onClick={() => setActiveProtocol(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-2 ${
                      isActive
                        ? 'border-primary bg-primary/15 scale-125 shadow-lg shadow-primary/20'
                        : 'border-neutral-800 bg-[#0d0d0d] hover:border-neutral-600 hover:scale-110'
                    }`}
                    title={example.title}
                  >
                    <WiringIcon wiringId={example.icon} size={18} />
                  </button>
                );
              }}
              logoSize={90}
              radius={110}
              minHeight={280}
              centerOverlay={
                activeProtocol !== null ? (
                  <span className="text-xs font-semibold text-neutral-400 tracking-wide">
                    {wiringExamples[activeProtocol].title}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-600">click one</span>
                )
              }
            />
          </div>

          {/* Col 3: wiring code for selected protocol */}
          <div className="w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Wiring code</p>
            {activeProtocol !== null && (
              <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
                  <WiringIcon wiringId={wiringExamples[activeProtocol].icon} size={15} />
                  <span className="text-sm font-semibold text-neutral-200">{wiringExamples[activeProtocol].title}</span>
                  <span className="ml-auto text-xs text-neutral-600 font-mono">wiring.ts</span>
                </div>
                <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
                  <CodeBlock language="typescript">{wiringExamples[activeProtocol].code}</CodeBlock>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-10 text-center">
          <Link to="/docs" className="text-primary hover:underline font-medium text-sm">
            Read the full docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Bundle Only What You Deploy - Condensed Summary */
function ProblemSolutionSection() {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Bundle Only What You Deploy
          </Heading>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 md:max-w-3xl md:mx-auto">
            Run your codebase as a monolith, as microservices, or as functions. Pikku creates the smallest bundle for your use case.
          </p>
        </div>

        <BundleArchitecturesSection />

        <div className="mt-8 text-center">
          <Link to="/docs/pikku-cli/tree-shaking" className="text-primary hover:underline font-medium text-lg">
            Learn more about filtering and tree-shaking →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Agents Section */
function AgentsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">AI Agents</span>
            <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">Alpha</span>
          </div>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Your functions are already agent tools
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            No adapters. No schema writing. No separate auth layer. Pass your existing Pikku functions directly — the agent gets your full backend.
          </p>
        </div>

        {/* Two-column: code left, differentiators right */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

          {/* Left: Code Example */}
          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="src/agents/support.agent.ts">
{`// These already exist in your backend — no changes needed
import { getCustomer, getOrders, createTicket } from './functions'

export const supportAgent = pikkuAgent({
  name: 'support',
  instructions: \`You are a helpful support agent.
Look up the customer's account and recent orders.\`,
  tools: [getCustomer, getOrders, createTicket],
  model: 'claude-sonnet-4-5'
})

// Wire it just like any HTTP endpoint
wireHTTP({
  method: 'post',
  route: '/api/chat',
  func: supportAgent
})`}
            </CodeBlock>
          </div>

          {/* Right: Two differentiators + CTA */}
          <div className="space-y-6">
            {/* Differentiator 1 */}
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Zero glue code</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Pass any Pikku function as a tool — the agent inherits its type signature, description, and input schema automatically. No adapters, no wrappers, no manual schema definitions.
                  </p>
                </div>
              </div>
            </div>

            {/* Differentiator 2 */}
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Auth follows the agent</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Agents inherit the caller's session, permissions, and middleware. The same rules that protect your HTTP endpoints automatically protect every tool the agent can call — no separate security layer to build or maintain.
                  </p>
                </div>
              </div>
            </div>

            {/* Differentiator 3 */}
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Any LLM, same interface</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Bring OpenAI, Anthropic, or any provider. Pikku handles tool calling, streaming, and context — you just swap the model name.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/docs/wiring/ai-agents"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
              >
                Read the AI Agents docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Workflows Section */
function WorkflowsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Workflows</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Multi-step processes that<br />survive anything
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Write sequential logic like normal code. Pikku handles persistence, retries, and resumption — even across server restarts.
          </p>
        </div>

        {/* Two-column: code right, differentiators left */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

          {/* Left: differentiators */}
          <div className="space-y-6">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <RefreshCw className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Deterministic replay</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Completed steps are cached and never re-executed. A workflow that fails on step 4 resumes from step 4 — not from the beginning.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Timer className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Sleep for hours, days, or weeks</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    <code className="text-primary text-xs">workflow.sleep('5min')</code> suspends execution without holding a server connection. Perfect for trial expirations, reminders, and follow-ups.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Database className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Survives restarts</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    State is persisted to PostgreSQL or Redis between steps. Deploy a new version mid-workflow and execution continues from where it left off.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/docs/wiring/workflows"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
              >
                Read the Workflows docs →
              </Link>
            </div>
          </div>

          {/* Right: Code Example */}
          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="src/workflows/onboarding.workflow.ts">
{`export const onboardingWorkflow = pikkuWorkflowFunc(
  async ({ workflow }, { email, userId }) => {
    // Each step is persisted — safe to retry
    const user = await workflow.do(
      'Create user profile',
      'createUserProfile',
      { email, userId }
    )

    await workflow.do(
      'Add to CRM',
      async () => crm.createUser(user)
    )

    // Suspend for 5 minutes — no server held
    await workflow.sleep('Wait before welcome email', '5min')

    await workflow.do(
      'Send welcome email',
      'sendEmail',
      { to: email, template: 'welcome' }
    )

    return { success: true }
  }
)`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

/** What Developers Say */
function TestimonialsSection() {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Built for the problems developers actually have
          </Heading>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 md:max-w-3xl md:mx-auto">
            From the teams already shipping with it
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} variant="testimonial">
              <p className="text-neutral-700 dark:text-neutral-300 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{testimonial.author}</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {testimonial.role}{testimonial.company ? ` @ ${testimonial.company}` : ''}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The Console */
function ConsoleSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">Visual Control Plane</span>
            <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">Alpha</span>
          </div>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Every function, every wire,<br />every secret — one screen
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            The Pikku Console gives every environment its own control plane — browse functions, run agents, manage secrets, and trigger workflows without writing a line of tooling code.
          </p>
        </div>

        {/* Screenshot */}
        <div className="relative max-w-5xl mx-auto mb-12">
          <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="/img/console-screenshot.png"
              alt="Pikku Console — browse and inspect all functions, wirings, and services"
              className="w-full block"
            />
          </div>
          {/* Fade out bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-xl pointer-events-none" />
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-10">
          {[
            { icon: <Search className="w-3.5 h-3.5" />, label: 'Browse all functions & wirings' },
            { icon: <Bot className="w-3.5 h-3.5" />, label: 'Agent playground' },
            { icon: <Zap className="w-3.5 h-3.5" />, label: 'Run & visualize workflows' },
            { icon: <Key className="w-3.5 h-3.5" />, label: 'Manage secrets & variables' },
            { icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Per-environment control' },
          ].map((pill, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d0d] border border-neutral-800 rounded-full text-sm text-neutral-300">
              {pill.icon}
              {pill.label}
            </span>
          ))}
        </div>

        <div className="text-center">
          <Link to="/docs/console" className="text-primary hover:underline font-medium text-sm">
            Console docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Addons — Drop-in backend modules */
function AddonsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Addons</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Install a backend feature<br />in one line
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Stripe billing. SendGrid emails. One <code className="text-primary text-lg">wireAddon()</code> call each. Install, configure secrets, call via namespaced RPC — fully typed.
          </p>
        </div>

        {/* Two-column: code left, differentiators right */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

          {/* Left: Code Example */}
          <div className="space-y-4 min-w-0 overflow-hidden">
            <CodeBlock language="typescript" title="src/wiring.ts">
{`// One line per addon
wireAddon({
  name: 'stripe',
  package: '@pikku/addon-stripe'
})
wireAddon({
  name: 'email',
  package: '@pikku/addon-sendgrid',
  secretOverrides: {
    SENDGRID_API_KEY: 'MY_EMAIL_KEY'
  }
})`}
            </CodeBlock>
            <CodeBlock language="typescript" title="src/functions/checkout.func.ts">
{`// Call addon functions via namespaced RPC
const checkout = pikkuFunc({
  func: async ({}, { plan }, { rpc }) => {
    const session = await rpc.invoke(
      'stripe:checkoutCreate',
      { plan, currency: 'usd' }
    )
    await rpc.invoke(
      'email:mailSend',
      { to: session.email, template: 'receipt' }
    )
    return { url: session.url }
  }
})`}
            </CodeBlock>
          </div>

          {/* Right: Differentiators + CTA */}
          <div className="space-y-6">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Package className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Drop-in, not bolt-on</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Install a package, add one <code className="text-primary text-xs">wireAddon()</code> call, and its functions appear as namespaced RPC calls. No glue code, no adapters, no boilerplate.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Blocks className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Fully typed across boundaries</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    The CLI generates TypeScript definitions for every addon function. <code className="text-primary text-xs">rpc.invoke('stripe:checkoutCreate', ...)</code> is autocompleted with the exact input and output types.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <KeyRound className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Secrets you control</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Addons declare what secrets they need. You map them to your own infrastructure with <code className="text-primary text-xs">secretOverrides</code> — no env vars leaking across packages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Shared infrastructure</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Addons reuse your existing logger, database, and services — no duplicate connections. Each addon gets its own namespace, so nothing collides.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/docs/addon"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
              >
                Read the Addons docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Deploy Anywhere */
function DeployAnywhereSection() {
  const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom];
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Deploy Anywhere</span>
        <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
          Change your runtime.<br />Keep your functions.
        </Heading>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          Same code runs on Express, Fastify, AWS Lambda, Cloudflare Workers, Next.js, and more. Switching runtimes never requires touching your functions.
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
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

        <p className="mt-8 text-sm text-neutral-500">
          Plus any custom runtime via the adapter interface.{' '}
          <Link to="/docs/custom-runtimes/custom-http-runtime" className="text-primary hover:underline">
            Build your own →
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Built for Production */
function ProductionFeaturesSection() {
  const features = [
    {
      title: 'Type-Safe Clients',
      desc: 'Auto-generated from your function definitions',
      icon: <Link2 className="w-6 h-6 text-primary" />,
      detail: 'HTTP fetch, WebSocket, and RPC clients with full IntelliSense'
    },
    {
      title: 'Auth & Permissions',
      desc: 'Built-in filters, no manual checks',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      detail: 'Cookie, bearer, API key auth with fine-grained permissions'
    },
    {
      title: 'Services',
      desc: 'Singleton and per-request injection',
      icon: <Settings className="w-6 h-6 text-primary" />,
      detail: 'Database, logger, config—all type-safe and testable'
    },
    {
      title: 'Middleware',
      desc: 'Before/after hooks across all protocols',
      icon: <Layers className="w-6 h-6 text-primary" />,
      detail: 'Logging, metrics, tracing—work everywhere'
    },
    {
      title: 'Schema Validation',
      desc: 'Auto-validate against TypeScript input schemas',
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      detail: 'Runtime validation catches errors before they hit your functions — supports Zod'
    },
    {
      title: 'Zero Lock-In',
      desc: 'Standard TypeScript, no magic',
      icon: <Feather className="w-6 h-6 text-primary" />,
      detail: 'Tiny runtime, bring your own database/logger/tools'
    }
  ];

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Production-grade out of the box
        </Heading>
        <p className="text-xl text-neutral-400 mb-10 md:max-w-2xl md:mx-auto">
          Auth, validation, type-safe clients, middleware — all built in. No bolting on third-party packages or writing boilerplate for every new protocol.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-[#0d0d0d] rounded-lg border border-neutral-800 card-shadow">
              <div className="mb-4">{feature.icon}</div>
              <div className="text-left">
                <div className="text-xl font-bold mb-2">{feature.title}</div>
                <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">{feature.desc}</div>
                <div className="text-neutral-500 dark:text-neutral-500 text-xs">{feature.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Call to Action */
function CallToActionSection() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
  };

  return (
    <section className="py-8 lg:py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Your next backend shouldn't have eight copies of the same function.
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Write it once. Pikku wires it everywhere.
        </p>

        {/* npm command */}
        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-primary/40 transition-all mb-6 lg:mb-14"
          onClick={copyToClipboard}
        >
          <span className="text-primary/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/getting-started"
            className="bg-primary text-white hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Start Building
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>
        <p className="text-neutral-400 text-sm mt-6 font-medium">5-minute setup &nbsp;•&nbsp; MIT Licensed &nbsp;•&nbsp; Open Source</p>
      </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Pikku - One Function, Every Protocol"
      description="Write backend logic once and wire it to HTTP, WebSockets, queues, cron jobs, AI agents, and more. Deploy anywhere—Express, Lambda, Cloudflare Workers, and beyond."
    >
      <Hero />
      <main>
        {/* 1. Pain — make the developer nod */}
        <PainSection />

        {/* 2. Before/After — visual contrast */}
        <BeforeAfterSection />

        {/* 3. Insight — show the solution interactively */}
        <AhaMomentSection />

        {/* 3. Differentiators — Agents, Workflows, Console */}
        <AgentsSection />
        <WorkflowsSection />
        <ConsoleSection />
        <AddonsSection />

        {/* 4. Confidence — production-grade primitives, deploy anywhere, bundle options */}
        <ProductionFeaturesSection />
        <DeployAnywhereSection />
        <ProblemSolutionSection />

        {/* 5. Social proof — just before the CTA */}
        <TestimonialsSection />

        {/* 6. Action — single strong CTA */}
        <CallToActionSection />

        {/* <LiveExamples /> */}
      </main>
    </Layout>
  );
}
