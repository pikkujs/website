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
    { icon: 'http',      label: 'HTTP',       color: '#22c55e', hueRotate: 80  },
    { icon: 'websocket', label: 'WebSocket',  color: '#a855f7', hueRotate: 240 },
    { icon: 'sse',       label: 'SSE',        color: '#f97316', hueRotate: -10 },
    { icon: 'queue',     label: 'Queue',      color: '#ef4444', hueRotate: -40 },
    { icon: 'cron',      label: 'Cron',       color: '#eab308', hueRotate: 20  },
    { icon: 'rpc',       label: 'RPC',        color: '#3b82f6', hueRotate: 180 },
    { icon: 'mcp',       label: 'MCP',        color: '#ec4899', hueRotate: 290 },
    { icon: 'cli',       label: 'CLI',        color: '#06b6d4', hueRotate: 145 },
    { icon: 'bot',       label: 'AI Agent',   color: '#8b5cf6', hueRotate: 220 },
    { icon: 'workflow',  label: 'Workflow',   color: '#10b981', hueRotate: 115 },
    { icon: 'trigger',   label: 'Trigger',    color: '#f59e0b', hueRotate: 0   },
  ];

  const hovered = hoveredIndex !== null ? protocols[hoveredIndex] : null;

  return (
    <div className="hero-section w-full relative overflow-hidden">
      {/* Glow orbs behind the chameleon */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute right-[12%] top-[40%] w-52 h-52 rounded-full bg-cyan-400/10 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-10 pb-8 lg:pt-16 lg:pb-12 px-6 gap-12 items-center">
        {/* Left: Text content */}
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded mb-6">
            Stop copying functions across protocols
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">One function.</span><br />
            <span className="text-primary">Every protocol.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-6 lg:mb-14 text-gray-300">
            Define your backend logic once. Pikku adapts it to HTTP, WebSocket, queues, cron, CLI, and AI agents — same auth, same middleware, no rewrites.
          </p>
          <ul className="text-base mb-6 lg:mb-14 space-y-2 text-gray-300">
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
              to="/docs"
              className="button button--primary button--lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Try It in 5 Minutes
            </Link>
            <Link
              to="#code-examples"
              className="button button--secondary button--lg hover:scale-105 transition-transform"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-mono">
            $ npm create pikku@latest &nbsp;·&nbsp; MIT &nbsp;·&nbsp; Open Source
          </p>
        </div>

        {/* Right: Chameleon mascot + protocol orbit */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center flex-col">
          <PikkuCircularLayout
            items={protocols}
            renderItem={(item, index) => (
              <div
                className="flex flex-col items-center gap-1.5 cursor-default"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <WiringIcon wiringId={item.icon} size={40} />
                <span className="text-white/50 text-[11px] font-medium tracking-wide">{item.label}</span>
              </div>
            )}
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
    </div>
  );
}

/** Pain framing — makes the developer nod before we show the solution */
function PainSection() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(true);

  const updateScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement;
    const step = card ? card.offsetWidth + 16 : el.clientWidth / 3;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // driftLines: 1-indexed line numbers to highlight in yellow
  const files = [
    {
      name: 'getUser.http.ts',
      badge: 'HTTP',
      badgeClass: 'text-green-400 bg-green-400/10',
      driftLines: [] as number[],
      code: `\
async function getUser(req, res) {
  if (!req.user) {
    return res.status(401).end()
  }
  const user = await db.getUser(req.params.id)
  await audit.log("getUser", user)
  res.json({ user })
}`,
    },
    {
      name: 'getUser.queue.ts',
      badge: 'Queue',
      badgeClass: 'text-red-400 bg-red-400/10',
      driftLines: [2, 6],
      code: `\
async function getUser(job) {
  // TODO: add auth like http?
  const { userId } = job.data
  const user = await db.getUser(userId)
  return user
  // audit.log removed (too slow?)
}`,
    },
    {
      name: 'getUser.cron.ts',
      badge: 'Cron',
      badgeClass: 'text-yellow-400 bg-yellow-400/10',
      driftLines: [1, 4, 6],
      code: `\
// copied from queue (3 months ago)
async function refreshUsers() {
  const users = await db.getAll()
  // different query, different shape
  for (const u of users) {
    // TODO: sync with http version
  }
}`,
    },
    {
      name: 'getUser.ws.ts',
      badge: 'WebSocket',
      badgeClass: 'text-purple-400 bg-purple-400/10',
      driftLines: [2, 6],
      code: `\
ws.on("getUser", (socket, data) => {
  // TODO: share auth w/ HTTP
  const user = await db.getUser(
    data.userId
  )
  // different response format
  socket.emit("user", { user })
})`,
    },
    {
      name: 'getUser.sse.ts',
      badge: 'SSE',
      badgeClass: 'text-orange-400 bg-orange-400/10',
      driftLines: [1, 4],
      code: `\
// copied from HTTP for SSE
router.get("/:id/stream", async (req, res) => {
  res.type("text/event-stream")
  // TODO: add auth check
  const user = await db.getUser(req.params.id)
  res.write(\`data: \${user.id}\`)
})`,
    },
    {
      name: 'getUser.rpc.ts',
      badge: 'RPC',
      badgeClass: 'text-blue-400 bg-blue-400/10',
      driftLines: [3, 5],
      code: `\
rpc.register("getUser", async ({ userId }) => {
  const user = await db.getUser(userId)
  // internal — skip auth? (probably fine...)
  return { user }
  // audit.log removed — internal only
})`,
    },
    {
      name: 'getUser.mcp.ts',
      badge: 'MCP',
      badgeClass: 'text-pink-400 bg-pink-400/10',
      driftLines: [2, 4],
      code: `\
tools.add({
  name: "get_user", // snake_case?
  handler: async ({ user_id }) => {
    // TODO: figure out auth for MCP
    return await db.getUser(user_id)
  }
})`,
    },
    {
      name: 'getUser.cli.ts',
      badge: 'CLI',
      badgeClass: 'text-cyan-400 bg-cyan-400/10',
      driftLines: [1, 4],
      code: `\
// copied from rpc handler
program.command("get <id>")
  .action(async (id) => {
    // no auth in CLI (admin-only?)
    const user = await db.getUser(id)
    console.log(user)
  })`,
    },
  ];

  return (
    <section className="py-8 lg:py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-6 lg:mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            You've written this function<br className="hidden md:block" /> more than once.
          </h2>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Every new protocol means a new copy. The copies drift. Auth diverges. TODOs accumulate. Bugs multiply.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mb-4">
          <div
            ref={trackRef}
            onScroll={updateScroll}
            className="flex gap-4 overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
          >
            {files.map((file, i) => (
              <div
                key={i}
                data-card
                className="snap-start flex-shrink-0 w-full md:w-[calc(33.333%-10.667px)] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden"
              >
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-800/80 border-b border-neutral-700/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[11px] text-neutral-400 font-mono flex-1 truncate">{file.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${file.badgeClass}`}>{file.badge}</span>
                </div>
                <pre className="p-4 m-0 font-mono text-[11.5px] leading-[1.75] min-h-[180px] overflow-x-auto bg-transparent">
                  <code>
                    {file.code.split('\n').map((line, j) => (
                      <span
                        key={j}
                        className={`block ${file.driftLines.includes(j + 1)
                          ? 'text-yellow-400/80 bg-yellow-400/6 -mx-4 px-4'
                          : 'text-neutral-400'}`}
                      >
                        {line || '\u00A0'}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-neutral-600">Swipe or use arrows to see all 8 protocols</span>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 disabled:opacity-25 hover:border-neutral-500 hover:text-white transition-all text-sm"
            >←</button>
            <button
              onClick={() => scroll(1)}
              disabled={!canRight}
              className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 disabled:opacity-25 hover:border-neutral-500 hover:text-white transition-all text-sm"
            >→</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-8 border-t border-neutral-800/60">
          <div className="text-center">
            <div className="text-2xl font-jakarta font-bold text-white">n protocols</div>
            <div className="text-sm text-neutral-500 mt-1">means n copies of the same logic</div>
          </div>
          <div className="hidden sm:block text-neutral-700 text-lg font-mono">→</div>
          <div className="text-center">
            <div className="text-2xl font-jakarta font-bold text-yellow-400">n TODO comments</div>
            <div className="text-sm text-neutral-500 mt-1">that will never be resolved</div>
          </div>
          <div className="hidden sm:block text-neutral-700 text-lg font-mono">→</div>
          <div className="text-center">
            <div className="text-2xl font-jakarta font-bold text-red-400">n × the bugs</div>
            <div className="text-sm text-neutral-500 mt-1">to find, reproduce, and fix</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact capabilities overview — Workflows, Agents, Console */
function CapabilitiesSection() {
  const capabilities = [
    {
      icon: '⚡',
      badge: null,
      title: 'Long-Running Workflows',
      description: 'Multi-step processes that survive failures, handle delays, and persist state across server restarts.',
      highlights: [
        'Deterministic replay — completed steps never re-execute',
        'Sleep steps for delays, reminders, trial expirations',
        'PostgreSQL and Redis persistence out of the box',
      ],
      link: '/docs/wiring/workflows',
      linkText: 'Workflow docs →',
    },
    {
      icon: '🤖',
      badge: 'Alpha',
      title: 'AI Agents',
      description: 'Your existing functions become agent tools automatically. Same auth, same permissions, any LLM provider.',
      highlights: [
        'No adapters, no glue code — just reference your functions',
        'Agents inherit your full session and permission system',
        'OpenAI, Anthropic, or any provider',
      ],
      link: '/docs/wiring/agents',
      linkText: 'Agent docs →',
    },
    {
      icon: '🖥️',
      badge: 'Alpha',
      title: 'The Pikku Console',
      description: 'A per-environment visual control plane. Explore, test, and manage your entire application from one UI.',
      highlights: [
        'Browse functions, routes, channels, and CLI commands',
        'Run and visualize workflows in real time',
        'Chat with agents in the built-in playground',
      ],
      link: '/docs/console',
      linkText: 'Console docs →',
    },
  ];

  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Beyond Request-Response
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-2xl md:mx-auto">
            The same function composition model extends to workflows, AI agents, and a visual control plane.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-8 flex flex-col card-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{cap.icon}</span>
                {cap.badge && (
                  <span className="text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full">
                    {cap.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{cap.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{cap.description}</p>
              <ul className="space-y-2 mb-6 lg:mb-14 flex-1">
                {cap.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <Link to={cap.link} className="text-primary hover:underline font-medium text-sm">
                {cap.linkText}
              </Link>
            </div>
          ))}
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
    <section id="code-examples" className="py-8 lg:py-20 bg-neutral-900 border-t border-neutral-800 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-6 lg:mb-14">
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One function. <span className="text-primary">Every protocol.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Write your business logic once. Pikku wires it to any protocol — same auth, same permissions, no rewrites.
          </p>
        </div>

        {/* Three-column pipeline: define → pick protocol → see wiring */}
        <div className="grid md:grid-cols-[5fr_3fr_5fr] gap-8 items-start max-w-6xl mx-auto">

          {/* Col 1: function definition */}
          <div className="w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Write once</p>
            <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-neutral-800 border-b border-neutral-700/80">
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
                        : 'border-neutral-700 bg-neutral-800/90 hover:border-neutral-500 hover:scale-110'
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
                <div className="flex items-center gap-3 px-5 py-3 bg-neutral-800 border-b border-neutral-700/80">
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
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Bundle Only What You Deploy
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
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

/** Protocol Support Visual */
function ProtocolSupportSection() {
  const protocols = [
    {
      wiringId: 'http',
      name: 'HTTP',
      desc: 'REST APIs with OpenAPI',
      detail: 'Type-safe endpoints with auto-generated docs'
    },
    {
      wiringId: 'websocket',
      name: 'WebSocket',
      desc: 'Real-time communication',
      detail: 'Bidirectional messaging with channels and pub/sub'
    },
    {
      wiringId: 'sse',
      name: 'Server-Sent Events',
      desc: 'Progressive enhancement',
      detail: 'Stream updates without breaking HTTP clients'
    },
    {
      wiringId: 'queue',
      name: 'Queues',
      desc: 'Background jobs',
      detail: 'BullMQ, SQS, PG Boss, and more'
    },
    {
      wiringId: 'cron',
      name: 'Scheduled Tasks',
      desc: 'Cron jobs',
      detail: 'Time-based automation with middleware'
    },
    {
      wiringId: 'rpc',
      name: 'RPC',
      desc: 'Internal service calls',
      detail: 'Type-safe function invocation'
    },
    {
      wiringId: 'mcp',
      name: 'Model Context Protocol',
      desc: 'AI agent integrations',
      detail: 'Expose functions to Claude, GPT, and other AI tools'
    },
    {
      wiringId: 'cli',
      name: 'CLI',
      desc: 'Command-line tools',
      detail: 'Build terminal apps from your functions'
    }
  ];

  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-6">
            Every Way Your Backend Communicates
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Pikku supports all the protocols modern backends need. Same function, different protocol.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {protocols.map((protocol, idx) => (
            <div key={idx} className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg card-shadow">
              <div className="flex justify-center mb-4">
                <WiringIcon wiringId={protocol.wiringId} size={48} />
              </div>
              <Heading as="h3" className="text-lg font-bold text-center mb-2">
                {protocol.name}
              </Heading>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                {protocol.desc}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                {protocol.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Used By Section */
function UsedBySection() {
  const companies = [
    {
      name: 'AgreeWe',
      logo: { light: 'agreewe-light.png', dark: 'agreewe-dark.png' },
      url: 'https://www.agreewe.com'
    },
    {
      name: 'HeyGermany',
      logo: { light: 'heygermany-light.svg', dark: 'heygermany-dark.svg' },
      url: 'https://hey-germany.com'
    },
    {
      name: 'marta',
      logo: { light: 'marta-light.svg', dark: 'marta-light.svg' },
      url: 'https://marta.de'
    },
    {
      name: 'BambooRose',
      logo: { light: 'bamboorose-light.png', dark: 'bamboorose-dark.png' },
      url: 'https://bamboorose.com'
    },
    {
      name: 'Calligraphy Cut',
      logo: { light: 'calligraphycut-light.svg', dark: 'calligraphycut-dark.svg' },
      url: 'https://calligraphy-cut.com'
    }
  ];

  return (
    <section className="py-8 lg:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-5xl font-bold mb-4">
            Built with Pikku
          </Heading>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Already powering production systems across startups and platforms.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            From open-source frameworks to live platforms, Pikku adapts to diverse real-world projects.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center justify-items-center mt-12">
          {companies.map((company, idx) => (
            <Link
              key={idx}
              href={company.url}
              className="flex items-center justify-center p-6 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-900/50 transition-all hover:scale-105"
              title={company.name}
            >
              <Image
                sources={{
                  light: `img/logos/${company.logo.light}`,
                  dark: `img/logos/${company.logo.dark}`
                }}
                alt={company.name}
                width={160}
                height={80}
                className="object-contain"
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

/** Agents Section */
function AgentsSection() {
  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
            <Heading as="h2" className="text-4xl md:text-5xl font-bold">
              AI Agents with Full Backend Access
            </Heading>
            <span className="inline-block bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Alpha
            </span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Define agents that use your existing functions as tools. Same auth, same permissions, same services — powered by any LLM.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: Features */}
          <div className="space-y-6">
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">1. Functions as Tools</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your existing Pikku functions become agent tools automatically. No adapters, no glue code — just reference the functions you already have.
                  </p>
              </div>
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">2. Auth & Permissions Built In</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Agents inherit the same session, permissions, and middleware as every other protocol. No separate security layer to maintain.
                  </p>
              </div>
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">3. Any LLM Provider</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bring your own model — OpenAI, Anthropic, or any provider. Pikku handles tool calling, context, and execution.
                  </p>
              </div>
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">4. Test in the Console</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Chat with agents directly in the Pikku Console playground. Iterate on prompts and tool configurations without building a frontend.
                  </p>
              </div>
          </div>

          {/* Right: Code Example */}
          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="src/agents/support.agent.ts">
{`export const supportAgent = pikkuAgent({
  name: 'support',
  description: 'Customer support agent',
  instructions: \`You are a helpful support agent.
Look up the customer's account and recent
orders to assist with their questions.\`,
  tools: [
    getCustomer,
    getOrders,
    createTicket,
    sendEmail
  ],
  model: 'claude-sonnet-4-20250514'
})

// Wire to HTTP for chat endpoint
wireHTTP({
  method: 'post',
  route: '/api/agent/support',
  func: supportAgent
})

// Also available via WebSocket
wireChannel({
  name: 'support',
  onMessageWiring: {
    action: { supportAgent }
  }
})`}
            </CodeBlock>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Perfect for customer support, data analysis, admin automation, and any task where AI needs access to your backend.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Workflows Section */
function WorkflowsSection() {
  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
            <Heading as="h2" className="text-4xl md:text-5xl font-bold">
              Long-Running Workflows with Built-in Resilience
            </Heading>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Build complex, multi-step processes that survive failures, handle time delays, and maintain state across server restarts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: Code Example */}
          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="User Onboarding Workflow">
{`export const onboardingWorkflow = pikkuWorkflowFunc(
  async ({ workflow }, { email, userId }) => {
    // Step 1: Create user profile (RPC step)
    const user = await workflow.do(
      'Create user profile',
      'createUserProfile',
      { email, userId }
    )

    // Step 2: Add to CRM (inline step)
    const crmUser = await workflow.do(
      'Create user in CRM',
      async () => crmApi.createUser(user)
    )

    // Step 3: Wait 5 minutes
    await workflow.sleep(
      'Wait before welcome email',
      '5min'
    )

    // Step 4: Send welcome email (RPC step)
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

          {/* Right: Features */}
          <div className="space-y-6">
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">1. Deterministic Replay</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Completed steps are cached and never re-executed. Workflows resume from where they left off after failures or delays.
                  </p>
              </div>
              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">2. Persistent State</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Store state in any database—PostgreSQL and Redis support out of the box. Survives server restarts and you don't pay for the time it isn't running.
                  </p>
              </div>

              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">3. Time-Based Steps</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sleep steps for delays, reminders, trial expirations, and scheduled follow-ups.
                  </p>
                </div>

              <div className="flex flex-col items-start mb-2">
                  <h3 className="text-xl font-bold mb-1">4. RPC & Inline Steps</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mix RPC calls (via queue workers) with inline code. Full type safety across all steps.
                  </p>
              </div>
    
            <div className="mt-6">
              <Link
                to="/docs/wiring/workflows"
                className="text-primary hover:underline font-medium text-lg inline-flex items-center"
              >
                Learn about Workflows →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Perfect for user onboarding, order fulfillment, payment processing, approval workflows, and any multi-step business process.
          </p>
        </div>
      </div>
    </section>
  );
}

/** What Developers Say */
function TestimonialsSection() {
  return (
    <section className="py-8 lg:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            What Developers Say
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Real feedback from teams using Pikku in production
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} variant="testimonial">
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.author}</p>
                <p className="text-gray-600 dark:text-gray-400">
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
  const features = [
    {
      icon: '🔍',
      title: 'Explore Everything',
      desc: 'Browse functions, routes, channels, MCP tools, and CLI commands in a structured tree view'
    },
    {
      icon: '🔄',
      title: 'Run Workflows',
      desc: 'Visualize workflow graphs, start runs with custom input, and stream progress in real time'
    },
    {
      icon: '🤖',
      title: 'Agent Playground',
      desc: 'Chat with any registered agent directly in the browser to test prompts and tool integrations'
    },
    {
      icon: '🔑',
      title: 'Manage Configuration',
      desc: 'View and edit secrets and variables per environment, with built-in OAuth2 flow support'
    }
  ];

  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
            <Heading as="h2" className="text-4xl md:text-5xl font-bold">
              The Pikku Console
            </Heading>
            <span className="inline-block bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Alpha
            </span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            A per-environment visual control plane for your application. Explore, test, and manage everything from one UI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg card-shadow">
              <span className="text-3xl mb-3">{feature.icon}</span>
              <div className="text-left">
                <div className="text-lg font-bold mb-2">{feature.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/docs/console"
            className="text-primary hover:underline font-medium text-lg inline-flex items-center"
          >
            Learn more about the Console →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Deploy Anywhere */
function DeployAnywhereSection() {
  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Deploy Anywhere. Blend In Everywhere.
        </Heading>

        <div className="grid md:grid-cols-2 md:gap-12 md:items-center">
          <div className="text-left">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Pikku works with Node, Bun, Deno, serverless, edge runtimes, and containers.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No vendor lock-in. No framework opinions. Just TypeScript.
            </p>
          </div>

          <PikkuCircularLayout
            items={[...runtimes.cloud, ...runtimes.middleware, runtimes.custom]}
            renderItem={(deployment) => (
              <div className="flex flex-col items-center hover:scale-110 transition-all duration-200">
                <Link
                  href={deployment.docs}
                  title={`Deploy to ${deployment.name}`}
                >
                  <Image
                    width={64}
                    height={64}
                    className='mx-auto'
                    sources={{
                      light: `img/logos/${deployment.img.light}`,
                      dark: `img/logos/${deployment.img.dark}`
                    }}
                  />
                </Link>
              </div>
            )}
            logoSize={160}
            radius={140}
          />
        </div>
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
      icon: '🔗',
      detail: 'HTTP fetch, WebSocket, and RPC clients with full IntelliSense'
    },
    {
      title: 'Auth & Permissions',
      desc: 'Built-in filters, no manual checks',
      icon: '🔐',
      detail: 'Cookie, bearer, API key auth with fine-grained permissions'
    },
    {
      title: 'Services',
      desc: 'Singleton and per-request injection',
      icon: '⚙️',
      detail: 'Database, logger, config—all type-safe and testable'
    },
    {
      title: 'Middleware',
      desc: 'Before/after hooks across all protocols',
      icon: '🪆',
      detail: 'Logging, metrics, tracing—work everywhere'
    },
    {
      title: 'Schema Validation',
      desc: 'Auto-validate against TypeScript input schemas',
      icon: '✅',
      detail: 'Runtime validation catches errors before they hit your functions'
    },
    {
      title: 'Zero Lock-In',
      desc: 'Standard TypeScript, no magic',
      icon: '🪶',
      detail: 'Tiny runtime, bring your own database/logger/tools'
    }
  ];

  return (
    <section className="py-8 lg:py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Ship Faster, Maintain Less
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 md:max-w-2xl md:mx-auto">
          Write your business logic once and deliver features across all protocols instantly. One source of truth means fewer bugs, faster iterations, and the flexibility to pivot without rewrites.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 md:max-w-2xl md:mx-auto">
          Tiny runtime with minimal overhead. Bundles as small as 50KB for single-function deployments.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg card-shadow">
              <span className="text-4xl mb-4">{feature.icon}</span>
              <div className="text-left">
                <div className="text-xl font-bold mb-2">{feature.title}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">{feature.desc}</div>
                <div className="text-gray-500 dark:text-gray-500 text-xs">{feature.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Why I Built Pikku */
function WhyIBuiltPikkuSection() {
  const pillars = [
    {
      icon: '💰',
      title: 'Cost Optimization',
      description: 'Start optimizing your infrastructure budget by having full freedom to switch deployments at any time',
      link: '/why/vendor-lock-in',
      linkText: 'Learn about avoiding costly rewrites →'
    },
    {
      icon: '⚡',
      title: 'Speed & Type Safety',
      description: 'Build fast without any runtime lock-in, with TypeScript having your back',
      link: '/why/typescript-everywhere',
      linkText: 'See how TypeScript powers everything →'
    },
    {
      icon: '🤖',
      title: 'AI-Era Quality',
      description: 'Simplicity means dramatically better generated code quality',
      link: '/why/architecture-flexibility',
      linkText: 'Explore architecture flexibility →'
    }
  ];

  const videos = [
    {
      id: '-MV12EYqJHM',
      title: 'Pikku Overview'
    },
    {
      id: 'dBZf7Bk7ReI',
      title: 'Deep Dive'
    }
  ];

  return (
    <section className="py-8 lg:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Why I Built Pikku
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Three core principles that drove Pikku's creation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {pillars.map((pillar, idx) => (
            <Card
              key={idx}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              link={{ href: pillar.link, text: pillar.linkText }}
            />
          ))}
        </div>

        <div className="mt-12 mb-6 lg:mb-14">
          <Heading as="h3" className="text-2xl font-bold mb-6 text-center">
            Watch the Talks
          </Heading>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden card-shadow">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
          — Yasser Fadl, Creator of Pikku
        </p>
      </div>
    </section>
  );
}

/** How Teams Use Pikku */
function HowTeamsUseItSection() {
  const useCases = [
    {
      title: 'Marta',
      problem: 'Caregivers, patients, and administrators all need different portals with different permissions—but sharing the same backend',
      solution: 'Write matching logic once. One backend serves caregiver portal, patient portal, and admin dashboard. Each portal has its own cookies and permissions, all managed by Pikku\'s session system.',
      benefits: ['Single backend for all user types', 'Different permissions per portal', 'Shared business logic, isolated access']
    },
    {
      title: 'HeyGermany',
      problem: 'Nurses, employers, and admin staff need separate interfaces with different data access—all from one backend',
      solution: 'Write eligibility logic once. One backend serves nurse applications, employer dashboards, and admin verification. Each user type gets different cookies and permission filters automatically.',
      benefits: ['Multiple portals, one codebase', 'Role-based access control', 'Unified credential validation']
    },
    {
      title: 'BambooRose',
      problem: 'Customer admins, end users, and internal ops need different views of the same release data—with strict access boundaries',
      solution: 'Write deployment tracking once. One backend powers customer dashboards, user portals, and ops CLI. Session-based permissions ensure each user type sees only their data.',
      benefits: ['Single source of truth', 'Fine-grained access control', 'Consistent data across all portals']
    }
  ];

  return (
    <section className="py-8 lg:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-4 lg:mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            How Teams Use Pikku
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Real-world scenarios where one function serves multiple use cases
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, idx) => (
            <Card key={idx} variant="white">
              <Heading as="h3" className="text-xl font-bold mb-3 text-primary">
                {useCase.title}
              </Heading>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">The Challenge:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{useCase.problem}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">With Pikku:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{useCase.solution}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Benefits:</p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {useCase.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Try it now */
function TryItNowSection() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
  };

  return (
    <section id="get-started" className="py-8 lg:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-4">
          Get Started in Minutes
        </Heading>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 lg:mb-14 md:max-w-2xl md:mx-auto">
          Create your first Pikku app with one command. You'll have a function running across HTTP, WebSockets, and more in under 5 minutes.
        </p>
        <div className="bg-primary text-white p-6 rounded-lg font-mono text-lg max-w-md mx-auto relative group cursor-pointer hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors" onClick={copyToClipboard}>
          npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/20 hover:bg-white/30 rounded-md p-2 backdrop-blur-sm"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
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
    <section className="py-8 lg:py-20 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Your next backend shouldn't have eight copies of the same function.
        </Heading>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
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
            to="/docs"
            className="bg-primary text-white hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Read the Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-6">MIT Licensed &nbsp;•&nbsp; Open Source &nbsp;•&nbsp; 5-minute setup</p>
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

        {/* 2. Insight — show the solution interactively */}
        <AhaMomentSection />

        {/* 3. Trust — who already uses it + what they say */}
        <UsedBySection />
        <TestimonialsSection />

        {/* 4. Depth — what else you can build */}
        <CapabilitiesSection />

        {/* 5. Confidence — production-grade, serious */}
        <ProductionFeaturesSection />
        <ProblemSolutionSection />

        {/* 6. Action — single strong CTA */}
        <CallToActionSection />

        {/* 7. For the curious — dive deeper */}
        <LiveExamples />
        <WhyIBuiltPikkuSection />
      </main>
    </Layout>
  );
}
