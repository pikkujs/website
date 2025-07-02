import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';

/** Renders a heading, tagline, and CTA buttons at the top of the homepage. */
function Hero() {
  return (
    <header className="flex w-full max-w-screen-lg pt-16 pb-12 px-4 self-center">
      <div className="md:w-1/2">
        <Heading as="h1" className="text-5xl font-bold mb-4 text-primary">
          Pikku
        </Heading>
        <Heading as="h2" className="text-5xl font-bold mb-4">
          One Function, Every Protocol
        </Heading>
        <p className="text-2xl font-medium leading-snug mb-4">
          Write TypeScript functions once, handle HTTP, WebSocket, cron jobs, queues, and RPC automatically
        </p>
        <div className="text-lg mb-6 space-y-2">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Same functions handle HTTP, WebSocket, cron jobs, and queues
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Auto-generated TypeScript clients with complete type safety
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Deploy anywhere - Express, Lambda, Cloudflare, Next.js
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="/docs" className="button button--primary">
            Build Your First API
          </Link>
          <Link className="button button--secondary" to="https://github.com/pikkujs/pikku">
            View on GitHub
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** Transport section with code snippet and supported runtimes */
function TransportSection({ 
  title, 
  description, 
  codeSnippet, 
  specialFeatures, 
  supportedRuntimes, 
  bgColor = "bg-white dark:bg-gray-800",
  id 
}: { 
  title: string; 
  description: string; 
  codeSnippet: string; 
  specialFeatures?: string[];
  supportedRuntimes: string[];
  bgColor?: string;
  id: string;
}) {
  const getRuntimeInfo = (name: string) => {
    const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom];
    return allRuntimes.find(r => r.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <section id={id} className={`py-16 ${bgColor}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Heading as="h2" className="text-4xl font-bold mb-6">
              {title}
            </Heading>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {description}
            </p>
            
            {/* Supported Runtimes */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Runs on:</h4>
              <div className="flex flex-wrap gap-4">
                {supportedRuntimes.map(runtime => {
                  const runtimeInfo = getRuntimeInfo(runtime);
                  return runtimeInfo ? (
                    <div key={runtime} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <Image 
                        width={24} 
                        height={24}
                        sources={{ 
                          light: `img/logos/${runtimeInfo.img.light}`, 
                          dark: `img/logos/${runtimeInfo.img.dark}` 
                        }} 
                      />
                      <span className="text-sm font-medium">{runtimeInfo.name}</span>
                    </div>
                  ) : (
                    <div key={runtime} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{runtime}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Features */}
            {specialFeatures && specialFeatures.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Special Features:</h4>
                <ul className="space-y-2">
                  {specialFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <CodeBlock language="typescript" title="example.ts">
              {codeSnippet}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shows TypeScript magic between server and client */
function TypeSafetyDemo() {
  return (
    <section className="py-12 px-4 md:px-0 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-8">
          <Heading as="h2" className="text-3xl font-bold mb-4">
            Full Type Safety from Server to Client
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Write once, get TypeScript autocomplete everywhere
          </p>
        </div>
        
        {/* Placeholder for GIF - Replace with actual recording */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              🎬 <strong>Coming Soon:</strong> Interactive demo showing:
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold mb-2">📝 Server Side</h4>
                <ul className="text-sm space-y-1">
                  <li>• Write pikkuFunc with types</li>
                  <li>• Export function</li>
                  <li>• Run CLI command</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✨ Client Side</h4>
                <ul className="text-sm space-y-1">
                  <li>• Full TypeScript autocomplete</li>
                  <li>• Automatic type checking</li>
                  <li>• Runtime validation</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Demo GIF will show live TypeScript intellisense flowing from server function definitions to client usage
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold">Instant Feedback</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">See type errors as you type</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-semibold">Always in Sync</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client types update automatically</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold">Runtime Safe</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Validation matches your types</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Core features section */
function CoreFeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Built for Developers
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Pikku provides everything you need to build robust, type-safe applications with minimal setup.
        </p>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Fully Typed</h3>
            <p className="text-gray-600 dark:text-gray-300">Complete type safety from server to client with automatic type generation</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-3">Auth & Permissions</h3>
            <p className="text-gray-600 dark:text-gray-300">Built-in authentication, sessions, and granular permission system</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Middleware</h3>
            <p className="text-gray-600 dark:text-gray-300">Powerful middleware system for cross-cutting concerns</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-3">Service Injection</h3>
            <p className="text-gray-600 dark:text-gray-300">Clean dependency injection without decorators or magic</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Final section emphasizing universal deployment */
function RunAnywhereSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Deploy Anywhere, Scale Everywhere
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          From serverless functions to traditional servers, from SQS Lambda queues to serverless WebSockets - 
          your Pikku code runs everywhere without modification.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-semibold mb-3">Serverless First</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              AWS Lambda, Cloudflare Workers, Vercel Functions - deploy with zero configuration
            </p>
            <div className="text-sm text-gray-500">
              ✓ SQS Lambda Queues<br />
              ✓ Serverless WebSockets<br />
              ✓ Scheduled Functions
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🖥️</div>
            <h3 className="text-xl font-semibold mb-3">Traditional Servers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Express, Fastify, Next.js - integrate with existing applications seamlessly
            </p>
            <div className="text-sm text-gray-500">
              ✓ Middleware Integration<br />
              ✓ Docker Deployment<br />
              ✓ Kubernetes Ready
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-3">Custom Runtimes</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Build your own runtime adapter for any environment or platform
            </p>
            <div className="text-sm text-gray-500">
              ✓ Custom HTTP Handlers<br />
              ✓ WebSocket Adapters<br />
              ✓ Scheduler Handlers
            </div>
          </div>
        </div>
        
        <div className='grid grid-cols-3 md:grid-cols-8 gap-4 items-center justify-items-center mb-8'>
          {[...runtimes.cloud, ...runtimes.middleware, runtimes.custom].map(deployment => (
            <Link 
              key={deployment.name}
              className="p-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-110" 
              href={deployment.docs} 
              title={`Deploy to ${deployment.name}`}
            >
              <Image 
                width={60} 
                height={60}
                className='mx-auto' 
                sources={{ 
                  light: `img/logos/${deployment.img.light}`, 
                  dark: `img/logos/${deployment.img.dark}` 
                }} 
              />
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-xl inline-block">
          <div className="flex items-center justify-center mb-2">
            <span className="mr-2">🚀</span>
            <strong>Write once, deploy everywhere</strong>
          </div>
          <p className="text-blue-100">
            The same function code works across all platforms and protocols
          </p>
        </div>
      </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Pikku - One Function, Every Protocol"
      description="Write TypeScript functions once, handle HTTP, WebSocket, cron jobs, queues, and RPC automatically"
    >
      <Hero />
      <main>
        <TypeSafetyDemo />
        
        {/* Transport Sections */}
        <TransportSection
          id="http"
          title="HTTP APIs"
          description="Build REST APIs and handle HTTP requests with full type safety and automatic OpenAPI generation."
          codeSnippet={`export const getTodos = pikkuSessionlessFunc<
  void, 
  Array<Todo & { upvotes: number }>
>(async ({ kysely }) => {
  return await kysely
    .selectFrom('todo')
    .selectAll()
    .execute()
})

addHTTPRoute({
  method: 'get',
  route: '/todos',
  func: getTodos,
  auth: false,
  docs: {
    description: 'Get all todos',
    tags: ['todos'],
  },
})`}
          supportedRuntimes={['AWS', 'Cloudflare', 'Express', 'Fastify', 'nextJS']}
          specialFeatures={[
            'Automatic OpenAPI documentation',
            'Built-in CORS support',
            'Request/response validation',
            'Progressive enhancement support'
          ]}
          bgColor="bg-blue-50 dark:bg-blue-900/10"
        />

        <TransportSection
          id="websocket"
          title="WebSocket & Real-time"
          description="Build real-time applications with typed WebSocket connections and pub/sub messaging."
          codeSnippet={`export const onConnect = pikkuChannelConnectionFunc<'hello!'>(
  async ({ logger, channel }) => {
    logger.info('Client connected to channel')
    channel.send('hello!')
  }
)

export const broadcastMessage = pikkuChannelFunc<
  { message: string },
  { timestamp: string; from: string }
>(async ({ channel, eventHub }, data, session) => {
  await eventHub?.publish('messages', channel.channelId, {
    timestamp: new Date().toISOString(),
    from: session?.userId ?? 'anonymous',
    ...data
  })
})

addChannel({
  name: 'chat',
  route: '/chat',
  onConnect,
  auth: true,
  onMessageRoute: {
    action: {
      broadcast: broadcastMessage,
    },
  },
})`}
          supportedRuntimes={['AWS', 'Cloudflare', 'uWS', 'ws', 'Express']}
          specialFeatures={[
            'Hibernation API support',
            'Auto-reconnection',
            'Pub/sub messaging',
            'Typed message handling'
          ]}
          bgColor="bg-green-50 dark:bg-green-900/10"
        />

        <TransportSection
          id="sse"
          title="Server-Sent Events"
          description="Stream real-time data to clients with automatic reconnection and progressive enhancement."
          codeSnippet={`export const streamUpdates = pikkuSessionlessFunc<
  void,
  AsyncGenerator<{ timestamp: string; data: any }>
>(async function* ({ logger }) {
  let count = 0
  
  while (true) {
    yield {
      timestamp: new Date().toISOString(),
      data: { count: ++count, message: 'Live update' }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
})

addHTTPRoute({
  method: 'get',
  route: '/stream',
  func: streamUpdates,
  auth: false,
  responseType: 'stream',
})`}
          supportedRuntimes={['Express', 'Fastify', 'uWS', 'nextJS']}
          specialFeatures={[
            'Automatic reconnection',
            'Progressive enhancement',
            'Typed streaming data',
            'Backpressure handling'
          ]}
          bgColor="bg-purple-50 dark:bg-purple-900/10"
        />

        <TransportSection
          id="cron"
          title="Scheduled Tasks"
          description="Run cron jobs and scheduled tasks that work across all deployment environments."
          codeSnippet={`export const cleanupExpiredTodos = pikkuVoidFunc(
  async ({ logger, kysely }) => {
    const deleted = await kysely
      .deleteFrom('todo')
      .where('expiresAt', '<', new Date())
      .executeTakeFirst()
    
    logger.info(\`Cleaned up \${deleted.numDeletedRows} expired todos\`)
  }
)

addScheduledTask({
  name: 'cleanupExpiredTodos',
  schedule: '0 2 * * *', // Daily at 2 AM
  func: cleanupExpiredTodos,
  docs: {
    description: 'Clean up expired todos',
    tags: ['maintenance'],
  },
})`}
          supportedRuntimes={['AWS', 'Cloudflare', 'Custom']}
          specialFeatures={[
            'Cron expression support',
            'Timezone handling',
            'Error retry logic',
            'Serverless friendly'
          ]}
          bgColor="bg-orange-50 dark:bg-orange-900/10"
        />

        <TransportSection
          id="mcp"
          title="MCP Server"
          description="Build Model Context Protocol servers for AI applications with full type safety."
          codeSnippet={`export const analyzeCode = pikkuSessionlessFunc<
  { code: string; language: string },
  { complexity: number; suggestions: string[] }
>(async ({ logger }, { code, language }) => {
  logger.info(\`Analyzing \${language} code\`)
  
  // Your analysis logic here
  return {
    complexity: calculateComplexity(code),
    suggestions: generateSuggestions(code, language)
  }
})

addMCPTool({
  name: 'analyze_code',
  description: 'Analyze code complexity and provide suggestions',
  func: analyzeCode,
  inputSchema: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      language: { type: 'string' }
    }
  }
})`}
          supportedRuntimes={['Express', 'Fastify', 'AWS', 'Custom']}
          specialFeatures={[
            'Tool definition support',
            'Resource management',
            'Prompt templates',
            'Streaming responses'
          ]}
          bgColor="bg-teal-50 dark:bg-teal-900/10"
        />

        <TransportSection
          id="queues"
          title="Background Queues"
          description="Process background jobs with reliable message delivery and retry logic."
          codeSnippet={`export const processEmailQueue = pikkuSessionlessFunc<
  { to: string; subject: string; body: string },
  { messageId: string; status: 'sent' | 'failed' }
>(async ({ logger, emailService }, data) => {
  try {
    const messageId = await emailService.send(data)
    logger.info(\`Email sent successfully: \${messageId}\`)
    
    return { messageId, status: 'sent' }
  } catch (error) {
    logger.error('Failed to send email:', error)
    throw error // Will trigger retry logic
  }
})

addQueueProcessor({
  name: 'email-queue',
  func: processEmailQueue,
  concurrency: 5,
  retryOptions: {
    attempts: 3,
    backoff: 'exponential',
  },
})`}
          supportedRuntimes={['AWS', 'Express', 'Fastify', 'Custom']}
          specialFeatures={[
            'Dead letter queues',
            'Retry with backoff',
            'Concurrency control',
            'Priority queues'
          ]}
          bgColor="bg-red-50 dark:bg-red-900/10"
        />

        <TransportSection
          id="cli"
          title="Command Line Tools"
          description="Build powerful CLI applications with the same functions you use for web APIs."
          codeSnippet={`export const generateReport = pikkuSessionlessFunc<
  { format: 'json' | 'csv'; dateRange: string },
  { fileName: string; recordCount: number }
>(async ({ logger, kysely }, { format, dateRange }) => {
  const data = await kysely
    .selectFrom('analytics')
    .selectAll()
    .where('createdAt', '>=', dateRange)
    .execute()
  
  const fileName = \`report-\${Date.now()}.\${format}\`
  await writeReport(fileName, data, format)
  
  return { fileName, recordCount: data.length }
})

addCLICommand({
  name: 'generate-report',
  description: 'Generate analytics report',
  func: generateReport,
  options: {
    format: {
      type: 'string',
      choices: ['json', 'csv'],
      default: 'json'
    },
    dateRange: {
      type: 'string',
      required: true
    }
  }
})`}
          supportedRuntimes={['Custom']}
          specialFeatures={[
            'Argument parsing',
            'Interactive prompts',
            'Progress indicators',
            'Config file support'
          ]}
          bgColor="bg-gray-50 dark:bg-gray-900/10"
        />

        <CoreFeaturesSection />
        <RunAnywhereSection />
      </main>
    </Layout>
  );
}
