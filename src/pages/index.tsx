import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';
import { WiringIcon } from '../components/WiringIcons';
import LiveExamples from '../components/LiveExamples';

/** Reusable component for Pikku logo surrounded by icons */
function PikkuCircularLayout({
  items,
  renderItem,
  logoSize = 180,
  radius = 180
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  logoSize?: number;
  radius?: number;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-[400px]">
      <div className="relative z-10">
        <Image
          sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }}
          width={logoSize}
          height={logoSize}
          className="mx-auto"
        />
      </div>

      {/* Items arranged in a circle around Pikku */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '100%', height: '100%' }}>
          {items.map((item, index) => {
            const total = items.length;
            const angle = (index * 360) / total;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px - 32px)`,
                  top: `calc(50% + ${y}px - 32px)`,
                }}
              >
                {renderItem(item, index)}
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
  return (
    <header className="flex w-full max-w-screen-lg pt-16 pb-12 px-4 self-center">
      <div className="md:w-1/2">
        <Heading as="h1" className="text-5xl font-bold mb-4 text-primary">
          Write Backend Logic Once. Run It Everywhere.
        </Heading>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
          Pikku adapts your TypeScript functions to any protocol and runtime—HTTP, WebSockets, queues, cron jobs, AI agents, and more.
        </p>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="#code-examples" className="button button--primary">
            See Examples
          </Link>
          <Link to="/docs" className="button button--secondary">
            Try Pikku
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** The "Aha!" Moment: One Function, Many Protocols */
function AhaMomentSection() {
  const [activeProtocol, setActiveProtocol] = React.useState<number | null>(null);

  const functionCode = `export const getCard = pikkuFunc<
  { cardId: string },
  { id: string; title: string; status: string }
>({
  func: async ({ database, channel }, { cardId }) => {
    const card = await database.query('cards', {
      where: { id: cardId }
    })

    // Works with WebSocket channels too!
    if (channel) {
      await channel.send({ type: 'card-fetched', card })
    }

    return card
  },
  permissions: { owner: requireOwner },
  docs: {
    summary: 'Fetch a card by ID',
    tags: ['cards']
  }
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
      title: 'MCP',
      icon: 'mcp',
      code: `// Resource
wireMCPResource({
  name: 'getCard',
  func: getCard
})

// Tool
wireMCPTool({
  name: 'getCard',
  func: getCard
})

// Prompt
wireMCPPrompt({
  name: 'getCard',
  func: getCard
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
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            One Function. Every Protocol. Zero Duplication.
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Define your domain logic once. Wire it to HTTP, WebSockets, queues, scheduled tasks, CLI, or AI agents. Same logic. Different protocols.
          </p>
        </div>

        {/* Function Definition - Top Row */}
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heading as="h3" className="text-2xl font-bold">
                1. Define Your Function
              </Heading>
            </div>
            <div className="relative">
              <CodeBlock language="typescript" title="src/functions/cards.function.ts">
                {functionCode}
              </CodeBlock>
            </div>
          </div>

          {/* Wiring Examples - Bottom Row */}
          <div>
            <div className="flex items-center justify-center mb-6">
              <Heading as="h3" className="text-2xl font-bold">
                2. Wire to Any Protocol
              </Heading>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {wiringExamples.map((example, idx) => {
                const isActive = activeProtocol === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-xl transition-all cursor-pointer ${
                      isActive ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveProtocol(idx)}
                    onMouseEnter={() => setActiveProtocol(idx)}
                  >
                    <div className="flex flex-col items-center">
                      <WiringIcon wiringId={example.icon} size={40} />
                      <span className="mt-2 font-semibold text-center text-gray-900 dark:text-gray-100">
                        {example.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Code display section below */}
            {activeProtocol !== null && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-primary">
                  <div className="flex items-center mb-4">
                    <WiringIcon wiringId={wiringExamples[activeProtocol].icon} size={24} />
                    <span className="ml-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                      {wiringExamples[activeProtocol].title}
                    </span>
                  </div>
                  <CodeBlock language="typescript">
                    {wiringExamples[activeProtocol].code}
                  </CodeBlock>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-primary">
            Same authentication, permissions, and validation across all protocols
          </p>
        </div>
      </div>
    </section>
  );
}

/** Before/After Problem-Solution */
function ProblemSolutionSection() {
  const beforeCode = `// ❌ Before: Duplicate logic everywhere
app.get('/cards/:id', async (req, res) => {
  const card = await db.cards.find(req.params.id)
  if (!isOwner(req.user, card)) return res.status(403)
  res.json(card)
})

wss.on('connection', (ws) => {
  ws.on('message', async (msg) => {
    if (msg.action === 'getCard') {
      const card = await db.cards.find(msg.cardId)
      if (!isOwner(ws.user, card)) return ws.close()
      ws.send(JSON.stringify(card))
    }
  })
})

queue.process('fetch-card', async (job) => {
  const card = await db.cards.find(job.data.cardId)
  // Wait, do we need auth here?
  return card
})`;

  const afterCode = `// ✅ With Pikku: Define once
export const getCard = pikkuFunc<CardInput, Card>({
  func: async ({ database }, { cardId }) => {
    return await database.query('cards', {
      where: { id: cardId }
    })
  },
  permissions: { owner: requireOwner },
  docs: { summary: 'Fetch a card by ID' }
})

// Wire to protocols:
wireHTTP({ method: 'get', route: '/cards/:cardId', func: getCard })
wireChannel({ name: 'cards', onMessageWiring: { action: { getCard } } })
wireQueueWorker({ queue: 'fetch-card', func: getCard })`;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Stop Duplicating Logic Across Protocols
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Most backends reimplement the same logic for each protocol. Pikku eliminates the duplication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4 flex items-center">
              <span className="text-3xl mr-3">❌</span>
              <Heading as="h3" className="text-2xl font-bold">
                Without Pikku
              </Heading>
            </div>
            <CodeBlock language="typescript" title="Traditional approach">
              {beforeCode}
            </CodeBlock>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
              <li>✗ Logic duplicated 3+ times</li>
              <li>✗ Auth/validation inconsistent</li>
              <li>✗ Hard to maintain and test</li>
            </ul>
          </div>

          <div>
            <div className="mb-4 flex items-center">
              <span className="text-3xl mr-3">✅</span>
              <Heading as="h3" className="text-2xl font-bold">
                With Pikku
              </Heading>
            </div>
            <CodeBlock language="typescript" title="Pikku approach">
              {afterCode}
            </CodeBlock>
            <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 font-medium">
              <li>✓ Write logic once</li>
              <li>✓ Consistent auth everywhere</li>
              <li>✓ Easy to test and maintain</li>
            </ul>
          </div>
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
      desc: 'Real-time channels',
      detail: 'Bidirectional communication with pub/sub'
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
      name: 'MCP',
      desc: 'AI agent integrations',
      detail: 'Expose functions to Claude, GPT, and more'
    },
    {
      wiringId: 'cli',
      name: 'CLI',
      desc: 'Command-line tools',
      detail: 'Build terminal apps from your functions'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-6">
            Every Way Your Backend Communicates
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pikku supports all the protocols modern backends need. Same function, different transport.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {protocols.map((protocol, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-lg transition-shadow">
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

/** Deploy Anywhere */
function DeployAnywhereSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Deploy Anywhere. Blend In Everywhere.
        </Heading>

        <div className="grid md:grid-cols-2 md:gap-12 md:items-center">
          <div className="text-left">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Pikku works with Node, Bun, Deno, serverless, edge runtimes, and containers.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No lock-in. No framework rules. Just TypeScript.
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
      desc: 'Before/after hooks across transports',
      icon: '🪆',
      detail: 'Logging, metrics, tracing—work everywhere'
    },
    {
      title: 'Schema Validation',
      desc: 'Optional runtime validation',
      icon: '✅',
      detail: 'TypeScript or Zod—catch errors before they hit your functions'
    },
    {
      title: 'Zero Lock-In',
      desc: 'Standard TypeScript, no magic',
      icon: '🪶',
      detail: 'Tiny runtime, bring your own database/logger/tools'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Built for Production
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Pikku includes everything you need for production backends
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
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

/** Real Use Cases */
function UseCasesSection() {
  const useCases = [
    {
      title: 'Chat Application',
      desc: 'One function for sending messages, wired to HTTP (REST API) and WebSocket (real-time)',
      protocols: ['http', 'websocket']
    },
    {
      title: 'Scheduled Reports',
      desc: 'Generate reports on a schedule or manually trigger via API',
      protocols: ['cron', 'http']
    },
    {
      title: 'Email Queue',
      desc: 'Send emails via background queue with automatic retries',
      protocols: ['queue', 'http']
    },
    {
      title: 'AI Agent Tools',
      desc: 'Expose functions to Claude/GPT via MCP with HTTP fallback',
      protocols: ['mcp', 'http']
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            What You Can Build
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-world examples of Pikku in action
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <Heading as="h3" className="text-xl font-bold mb-3">
                {useCase.title}
              </Heading>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {useCase.desc}
              </p>
              <div className="flex gap-3">
                {useCase.protocols.map(protocol => (
                  <div key={protocol} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded">
                    <WiringIcon wiringId={protocol} size={16} />
                    <span className="text-sm font-medium capitalize">{protocol}</span>
                  </div>
                ))}
              </div>
            </div>
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
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Try it now
        </Heading>
        <div className="bg-primary text-white p-6 rounded-lg font-mono text-lg max-w-md mx-auto relative group cursor-pointer hover:bg-primary-dark transition-colors" onClick={copyToClipboard}>
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
  return (
    <section className="py-16 bg-gray-900 dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <div className="text-white">
          <Heading as="h2" className="text-4xl font-bold mb-6 text-white">
            Ready to Simplify Your Backend?
          </Heading>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Stop duplicating logic. Start using Pikku's transport-agnostic approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Get Started
            </Link>
            <Link to="https://github.com/pikkujs/pikku" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Pikku - Write Once, Run Everywhere"
      description="Write backend logic once and wire it to HTTP, WebSockets, queues, cron jobs, AI agents, and more. Deploy anywhere—Express, Lambda, Cloudflare Workers, and beyond."
    >
      <Hero />
      <main>
        <AhaMomentSection />
        <ProblemSolutionSection />
        <ProtocolSupportSection />
        <DeployAnywhereSection />
        <ProductionFeaturesSection />
        <UseCasesSection />
        <TryItNowSection />
        <LiveExamples />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
