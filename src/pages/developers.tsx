import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { WiringIcon } from '../components/WiringIcons';
import {
  Hero, PikkuCircularLayout, NavbarPageToggle, DeployAnywhereSection,
  ProductionFeaturesSection, ConsoleSection, TestimonialsSection, CallToActionSection,
} from '../components/HomepageShared';
import {
  Zap, ShieldCheck, Plug, RefreshCw, Timer, Database,
  Bot, Package, Blocks, KeyRound, MessageSquare, Radio, Webhook,
} from 'lucide-react';

/** Before/After — visual contrast showing the problem vs. the Pikku solution */
function BeforeAfterSection() {
  const beforeCode = `// Same logic, copied per protocol
app.get('/cards/:id', auth, validate, async (req, res) => {
  const card = await db.getCard(req.params.id)
  res.json(card)
})
ws.on('getCard', auth, validate, async (msg, socket) => {
  const card = await db.getCard(msg.cardId) // <- again
  socket.send(JSON.stringify(card))
})
// + queue, cron, CLI, RPC, SSE... each drifts.

// --- Workflow? Add Inngest / Temporal ----
inngest.createFunction({ id: 'onboarding' }, ...,
  async ({ step }) => {
    await step.run('create-profile', () => createProfile(id))
    await step.sleep('wait', '5m')
    await step.run('send-welcome', () => sendWelcome(id))
  })
// New SDK, new schema, new deploy pipeline.

// --- AI agent? Add Vercel AI / LangChain -
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
    <section id="how-it-works" className="py-8 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Difference</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            Four handlers that drift apart — or <span className="text-primary">one function that doesn't.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
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

/** Interactive circle selector — pick a protocol, see the wiring code */
function AhaMomentSection() {
  const [activeProtocol, setActiveProtocol] = React.useState<number | null>(0);

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
    { title: 'HTTP API', icon: 'http', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard\n})` },
    { title: 'WebSocket', icon: 'websocket', code: `wireChannel({\n  name: 'cards',\n  onConnect: onCardConnect,\n  onDisconnect: onCardDisconnect,\n  onMessageWiring: {\n    action: { getCard }\n  }\n})` },
    { title: 'Server-Sent Events', icon: 'sse', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard,\n  sse: true\n})` },
    { title: 'Queue Worker', icon: 'queue', code: `// Basic queue\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard\n})\n\n// With options\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard,\n  concurrency: 5,\n  rateLimiter: {\n    max: 10,\n    duration: 1000\n  }\n})` },
    { title: 'Scheduled Task', icon: 'cron', code: `wireScheduler({\n  cron: '0 * * * *',\n  func: getCard\n})` },
    { title: 'RPC Call', icon: 'rpc', code: `// From another function:\nconst card = await rpc.invoke(\n  'getCard',\n  { cardId: '123' }\n)` },
    { title: 'MCP (AI Tools)', icon: 'mcp', code: `wireMCPResource({\n  uri: 'card/{cardId}',\n  func: getCard,\n  tags: ['cards', 'data']\n})` },
    { title: 'CLI', icon: 'cli', code: `wireCLI({\n  program: 'cards',\n  commands: {\n    get: pikkuCLICommand({\n      parameters: '<cardId>',\n      func: getCard\n    }),\n    manage: {\n      subcommands: {\n        get: pikkuCLICommand({\n          parameters: '<cardId>',\n          func: getCard\n        })\n      }\n    }\n  }\n})` },
    { title: 'Trigger', icon: 'trigger', code: `wireTrigger({\n  name: 'cardChanged',\n  func: getCard,\n})\n\n// Register the trigger source\nwireTriggerSource({\n  name: 'cardChanged',\n  func: webhookTrigger,\n  input: { secret: process.env.WEBHOOK_SECRET }\n})` },
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

        <div className="grid md:grid-cols-[5fr_3fr_5fr] gap-8 items-start max-w-6xl mx-auto">
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
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">&#10003;</span>
                  {line}
                </div>
              ))}
            </div>
          </div>

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

/** Agents Section */
function AgentsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
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

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
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

          <div className="space-y-6">
            {[
              { icon: <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Zero glue code', desc: 'Pass any Pikku function as a tool — the agent inherits its type signature, description, and input schema automatically. No adapters, no wrappers, no manual schema definitions.' },
              { icon: <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Auth follows the agent', desc: 'Agents inherit the caller\'s session, permissions, and middleware. The same rules that protect your HTTP endpoints automatically protect every tool the agent can call.' },
              { icon: <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Any LLM, same interface', desc: 'Bring OpenAI, Anthropic, or any provider. Pikku handles tool calling, streaming, and context — you just swap the model name.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/wiring/ai-agents" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
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
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Workflows</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Multi-step processes that<br />survive anything
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Write sequential logic like normal code. Pikku handles persistence, retries, and resumption — even across server restarts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: <RefreshCw className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Deterministic replay', desc: 'Completed steps are cached and never re-executed. A workflow that fails on step 4 resumes from step 4 — not from the beginning.' },
              { icon: <Timer className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Sleep for hours, days, or weeks', desc: 'workflow.sleep(\'5min\') suspends execution without holding a server connection. Perfect for trial expirations, reminders, and follow-ups.' },
              { icon: <Database className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Survives restarts', desc: 'State is persisted to PostgreSQL or Redis between steps. Deploy a new version mid-workflow and execution continues from where it left off.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/wiring/workflows" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the Workflows docs →
              </Link>
            </div>
          </div>

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

/** Addons Section */
function AddonsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Addons</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Install a backend feature<br />in one line
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Stripe billing. SendGrid emails. One <code className="text-primary text-lg">wireAddon()</code> call each. Install, configure secrets, call via namespaced RPC — fully typed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
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

          <div className="space-y-6">
            {[
              { icon: <Package className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Drop-in, not bolt-on', desc: 'Install a package, add one wireAddon() call, and its functions appear as namespaced RPC calls. No glue code, no adapters, no boilerplate.' },
              { icon: <Blocks className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Fully typed across boundaries', desc: 'The CLI generates TypeScript definitions for every addon function. rpc.invoke(\'stripe:checkoutCreate\', ...) is autocompleted with the exact input and output types.' },
              { icon: <KeyRound className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Secrets you control', desc: 'Addons declare what secrets they need. You map them to your own infrastructure with secretOverrides — no env vars leaking across packages.' },
              { icon: <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Shared infrastructure', desc: 'Addons reuse your existing logger, database, and services — no duplicate connections. Each addon gets its own namespace, so nothing collides.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/addon" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the Addons docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Gateway Section */
function GatewaySection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">Gateway</span>
            <span className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
          </div>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            One handler for every<br />messaging platform
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            WhatsApp, Slack, Telegram, WebChat — write one function. The adapter normalizes every platform into the same message format. Three transport types cover every integration pattern.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-4 min-w-0 overflow-hidden">
            <CodeBlock language="typescript" title="src/gateway.wiring.ts">
{`// Webhook — platform POSTs to you
wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})

// WebSocket — real-time web chat
wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage,
})

// Listener — persistent connection (Baileys, Signal)
wireGateway({
  name: 'signal',
  type: 'listener',
  adapter: signalAdapter,
  func: handleMessage,
})`}
            </CodeBlock>
            <CodeBlock language="typescript" title="src/gateway.functions.ts">
{`// One handler for all platforms
const handleMessage = pikkuFunc({
  func: async ({ database, logger }, { senderId, text }) => {
    logger.info(\`\${senderId}: \${text}\`)
    await database.saveMessage(senderId, text)

    // Return value is auto-sent via the adapter
    return { text: \`Got it! You said: \${text}\` }
  }
})`}
            </CodeBlock>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Webhook className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Webhook with auto-verification', desc: 'Registers POST and GET routes automatically. WhatsApp challenges, Slack url_verification, Telegram tokens — handled by the adapter, invisible to your code.' },
              { icon: <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Normalized messages', desc: 'Every platform delivers the same GatewayInboundMessage — senderId, text, attachments, metadata. Your handler never knows which platform sent the message.' },
              { icon: <Radio className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Three transport types', desc: 'Webhook for cloud APIs (WhatsApp, Slack, Telegram). WebSocket for browser chat widgets. Listener for persistent connections (Baileys, Signal CLI, Matrix).' },
              { icon: <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Same middleware, same auth', desc: 'Rate limiting, logging, permissions — your existing middleware works on gateways. wire.gateway gives you platform, senderId, and send() in every handler.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/wiring/gateway" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the Gateway docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Developers() {
  return (
    <Layout
      title="Pikku for Developers - Code Examples & API"
      description="See Pikku in action — code examples for HTTP, WebSocket, queues, cron, CLI, AI agents, workflows, and more. One function, every protocol."
    >
      <NavbarPageToggle isDeveloperPage={true} />
      <Hero />
      <main>
        <BeforeAfterSection />
        <AhaMomentSection />
        <AgentsSection />
        <WorkflowsSection />
        <AddonsSection />
        <GatewaySection />
        <DeployAnywhereSection />
        <ProductionFeaturesSection />
        <ConsoleSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
