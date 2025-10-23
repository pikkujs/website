import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';
import { protocolDeployments, protocolToDeploymentKey } from '@site/data/deployments';
import { WiringIcon } from '../components/WiringIcons';
import LiveExamples from '../components/LiveExamples';
import { BundleArchitecturesSection } from '../components/BundleArchitecturesSection';
import { testimonials } from '@site/data/testimonials';

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
          Write your backend logic once. Pikku automatically adapts it to work with any protocol—HTTP APIs, WebSockets, queues, scheduled tasks, and even AI tools via MCP. No duplicate code, no vendor lock-in.
        </p>
        <ul className="text-base mb-8 space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Unified backend logic across all protocols</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Deploy to any platform without code changes</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Full TypeScript type safety end-to-end</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Production-ready with sessions, auth, and middleware</span>
          </li>
        </ul>
        <div className="flex flex-row gap-4 mt-6">
          <Link
            to="/docs"
            className="button button--primary button--lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            to="#code-examples"
            className="button button--secondary button--lg hover:scale-105 transition-transform"
          >
            See Examples
          </Link>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          ⚡ 5-minute setup • MIT Licensed
        </p>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** The "Aha!" Moment: One Function, Many Protocols */
function AhaMomentSection() {
  const [activeProtocol, setActiveProtocol] = React.useState<number | null>(0); // Default to HTTP

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

  // Map protocol index to deployment options
  const getDeploymentOptionsForProtocol = (protocolIndex: number) => {
    const protocol = wiringExamples[protocolIndex];
    if (!protocol) return null;

    const deploymentKey = protocolToDeploymentKey[protocol.icon];
    return protocolDeployments[deploymentKey] || null;
  };

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
      code: `// Model Context Protocol
// Expose to AI tools like Claude

wireMCPResource({
  uri: 'card/{cardId}',
  title: 'Card Information',
  description: 'Retrieve card by ID',
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
    }
  ];

  return (
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            One Function. Every Protocol. <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Zero Duplication.</span>
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Write your logic once. Wire it to HTTP, WebSockets, queues, scheduled tasks, CLI, or AI tools (via Model Context Protocol). Same logic. Different protocols.
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
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
              {wiringExamples.map((example, idx) => {
                const isActive = activeProtocol === idx;
                return (
                  <div
                    key={idx}
                    className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-2 md:p-4 shadow-md hover:shadow-xl transition-all cursor-pointer relative"
                    onClick={() => setActiveProtocol(idx)}
                  >
                    {isActive && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 md:w-12 md:h-12">
                        <Image
                          sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }}
                          width={48}
                          height={48}
                          className="drop-shadow-lg"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <div className="hidden md:block">
                        <WiringIcon wiringId={example.icon} size={40} />
                      </div>
                      <div className="md:hidden">
                        <WiringIcon wiringId={example.icon} size={28} />
                      </div>
                      <span className="mt-1 md:mt-2 font-semibold text-center text-gray-900 dark:text-gray-100 text-xs md:text-base">
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
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg border-2 border-primary">
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

          {/* Deploy Anywhere - Third Section */}
          {activeProtocol !== null && (() => {
            const deployments = getDeploymentOptionsForProtocol(activeProtocol);
            return deployments && (
              <div className="mt-12">
                <div className="flex items-center justify-center mb-6">
                  <Heading as="h3" className="text-2xl font-bold">
                    3. Deploy Anywhere
                  </Heading>
                </div>

                {/* Deployment selector with icons */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6 max-w-3xl">
                  {Object.entries(deployments).map(([key, deployment]) => (
                    <div
                      key={key}
                      className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 shadow-md transition-all relative"
                    >
                      <div className="flex flex-col items-center">
                        <Image
                          sources={{
                            light: `img/logos/${deployment.img.light}`,
                            dark: `img/logos/${deployment.img.dark}`
                          }}
                          width={40}
                          height={40}
                          className="mb-2"
                        />
                        <span className="text-xs font-semibold text-center text-gray-900 dark:text-gray-100">
                          {deployment.name}
                        </span>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-primary">
            ✓ Same authentication, permissions, and validation across all protocols
          </p>
        </div>
      </div>
    </section>
  );
}

/** Bundle Only What You Deploy - Condensed Summary */
function ProblemSolutionSection() {
  return (
    <section className="py-12 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-3xl font-bold mb-4">
          Bundle Only What You Deploy
        </Heading>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
          Run as a monolith (~2.8MB), microservices (~180KB), or individual functions (~50KB). Pikku's tree-shaking creates the smallest bundle for your deployment.
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Use CLI flags to filter by routes, tags, or function types—deploy exactly what you need, nothing more.
        </p>
        <Link to="/docs/philosophy/tree-shaking" className="text-primary hover:underline font-medium text-lg">
          Learn about deployment strategies and bundle optimization →
        </Link>
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
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-6">
            Every Way Your Backend Communicates
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Pikku supports all the protocols modern backends need. Same function, different protocol.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {protocols.map((protocol, idx) => (
            <div key={idx} className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg hover:shadow-lg transition-shadow">
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
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-6">
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

/** What Developers Say */
function TestimonialsSection() {
  return (
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            What Developers Say
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Real feedback from teams using Pikku in production
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-neutral-800">
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.author}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonial.role}{testimonial.company ? ` @ ${testimonial.company}` : ''}
                </p>
              </div>
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
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
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
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Ship Faster, Maintain Less
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 md:max-w-2xl md:mx-auto">
          Write your business logic once and deliver features across all protocols instantly. One source of truth means fewer bugs, faster iterations, and the flexibility to pivot without rewrites.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-12 md:max-w-2xl md:mx-auto">
          Tiny runtime with minimal overhead. Bundles as small as 50KB for single-function deployments.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:shadow-md transition-shadow">
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
      description: 'Start optimizing your infrastructure budget by having full freedom to switch deployments at any time'
    },
    {
      icon: '⚡',
      title: 'Speed & Type Safety',
      description: 'Build fast without any runtime lock-in, with TypeScript having your back'
    },
    {
      icon: '🤖',
      title: 'AI-Era Quality',
      description: 'Simplicity means dramatically better generated code quality'
    }
  ];

  return (
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            Why I Built Pikku
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Three core principles that drove Pikku's creation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md">
              <div className="text-5xl mb-4">{pillar.icon}</div>
              <Heading as="h3" className="text-xl font-bold mb-3 text-primary">
                {pillar.title}
              </Heading>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/docs/philosophy/personal" className="text-primary hover:underline font-medium text-base">
            Read the full story →
          </Link>
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
      title: 'Real-Time Dashboard',
      problem: 'Building a monitoring dashboard that shows live metrics',
      solution: 'Write one getMetrics function. Serve initial page load via HTTP, then stream updates via Server-Sent Events. Same data source, same validation, same permissions.',
      benefits: ['No duplicate API logic', 'Progressive enhancement over HTTP', 'Works with existing HTTP clients']
    },
    {
      title: 'Order Processing',
      problem: 'E-commerce orders need HTTP checkout, live status updates, and background payment processing',
      solution: 'Write one processOrder function. Wire it to HTTP (checkout API), WebSocket (live order tracking), and queue (async payment processing). Same business logic everywhere.',
      benefits: ['Write order logic once', 'Real-time updates without duplication', 'Reliable async payment handling']
    },
    {
      title: 'Admin Tools',
      problem: 'Operations team needs both API access and CLI tools',
      solution: 'Write your admin functions once. Expose them via HTTP API for your web dashboard and CLI for ops scripts. Same permissions, same audit logging.',
      benefits: ['No CLI-specific code needed', 'API and CLI stay in sync', 'Shared authentication and logging']
    }
  ];

  return (
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
          <Heading as="h2" className="text-4xl font-bold mb-4">
            How Teams Use Pikku
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-3xl md:mx-auto">
            Real-world scenarios where one function serves multiple use cases
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md">
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
    <section className="py-16 border-t border-gray-200 dark:border-neutral-700">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <Heading as="h2" className="text-4xl font-bold mb-4">
          Get Started in Minutes
        </Heading>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 md:max-w-2xl md:mx-auto">
          Create your first Pikku app with one command. You'll have a function running across HTTP, WebSockets, and more in under 5 minutes.
        </p>
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
    <section className="py-16 bg-neutral-900 dark:bg-neutral-900">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <div className="text-white">
          <Heading as="h2" className="text-4xl font-bold mb-6 text-white">
            Ready to Simplify Your Backend?
          </Heading>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Stop duplicating logic. Write once, deploy anywhere with Pikku.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs"
              className="bg-white text-gray-900 hover:bg-neutral-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="https://github.com/pikkujs/pikku"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
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
        <UsedBySection />
        <AhaMomentSection />
        <TestimonialsSection />
        <ProductionFeaturesSection />
        <HowTeamsUseItSection />
        <WhyIBuiltPikkuSection />
        <ProblemSolutionSection />
        <TryItNowSection />
        <LiveExamples />
        <DeployAnywhereSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
