import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Image from '@theme/ThemedImage';
import { NavbarPageToggle, PikkuCircularLayout } from '../components/HomepageShared';
import {
  PaperPage, Section, Wrap, Eyebrow, H1, H2, Lead,
  BtnPrimary, BtnGhost, CodeCard, CheckItem, Card, CardTitle, CardBody,
} from '../components/PaperLayout';
import { WiringIcon } from '../components/WiringIcons';
import { runtimes } from '@site/data/homepage';
import { testimonials } from '@site/data/testimonials';
import styles from './developers.module.css';

/* ════════════════════════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════════════════════════ */
const ORBIT = [
  { icon: 'http', label: 'HTTP' },
  { icon: 'websocket', label: 'WebSocket' },
  { icon: 'sse', label: 'SSE' },
  { icon: 'queue', label: 'Queue' },
  { icon: 'cron', label: 'Cron' },
  { icon: 'rpc', label: 'RPC' },
  { icon: 'mcp', label: 'MCP' },
  { icon: 'cli', label: 'CLI' },
  { icon: 'bot', label: 'AI Agent' },
  { icon: 'workflow', label: 'Workflow' },
  { icon: 'trigger', label: 'Trigger' },
  { icon: 'gateway', label: 'Gateway' },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <Wrap>
        <div className={styles.heroGrid}>
          <div>
            <Eyebrow>For developers · the technical deep-dive</Eyebrow>
            <H1>One function. <em>Every wiring.</em></H1>
            <Lead>
              Write your backend once. Pikku wires it to HTTP, WebSocket, queues, cron,
              AI agents, workflows and more — same auth, same validation, zero rewrites.
            </Lead>
            <div className={styles.heroActions}>
              <BtnPrimary to="/getting-started">Get started</BtnPrimary>
              <BtnGhost to="/docs">Read the docs</BtnGhost>
            </div>
          </div>
          <div className={styles.heroOrbit}>
            <PikkuCircularLayout
              items={ORBIT}
              renderItem={(item) => (
                <div className={styles.orbitItem}>
                  <WiringIcon wiringId={item.icon} size={34} />
                  <span>{item.label}</span>
                </div>
              )}
              logoSize={170}
              radius={165}
              minHeight={420}
            />
          </div>
        </div>
      </Wrap>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   Before / after
   ════════════════════════════════════════════════════════════════ */
const BEFORE_CODE = `// Same logic, copied per protocol
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

const AFTER_CODE = `// With Pikku — write it once
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

function BeforeAfterSection() {
  return (
    <Section id="how-it-works" variant="alt">
      <Wrap wide>
        <Eyebrow>The difference</Eyebrow>
        <H2>Four handlers that drift apart — <em>or one function that doesn't.</em></H2>
        <div className={styles.compareGrid}>
          <div>
            <div className={styles.compareLabel}>
              <span className={`${styles.compareDot} ${styles.dotBad}`} />
              Without Pikku
              <span className={styles.compareTag}>repeated + fragile</span>
            </div>
            <div className={styles.compareBefore}>
              <CodeCard filename="everything.ts">
                <CodeBlock language="typescript">{BEFORE_CODE}</CodeBlock>
              </CodeCard>
            </div>
          </div>
          <div>
            <div className={styles.compareLabel}>
              <span className={`${styles.compareDot} ${styles.dotGood}`} />
              With Pikku
              <span className={styles.compareTag}>1 function + wirings</span>
            </div>
            <CodeCard filename="cards.ts">
              <CodeBlock language="typescript">{AFTER_CODE}</CodeBlock>
            </CodeCard>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Same function, any transport — interactive picker
   ════════════════════════════════════════════════════════════════ */
const FUNCTION_CODE = `const getCard = pikkuFunc({
  title: 'Get Card',
  description: 'Retrieve a card by ID',
  func: async ({ db, audit }, { cardId }) => {
    const card = await db.getCard(cardId)
    await audit.log('getCard', { cardId })
    return card
  },
  permissions: { user: isAuthenticated }
})`;

const WIRING_EXAMPLES = [
  { title: 'HTTP API', icon: 'http', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard\n})` },
  { title: 'WebSocket', icon: 'websocket', code: `wireChannel({\n  name: 'cards',\n  onConnect: onCardConnect,\n  onDisconnect: onCardDisconnect,\n  onMessageWiring: {\n    action: { getCard }\n  }\n})` },
  { title: 'Server-Sent Events', icon: 'sse', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard,\n  sse: true\n})` },
  { title: 'Queue Worker', icon: 'queue', code: `// Basic queue\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard\n})\n\n// With options\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard,\n  concurrency: 5,\n  rateLimiter: {\n    max: 10,\n    duration: 1000\n  }\n})` },
  { title: 'Scheduled Task', icon: 'cron', code: `wireScheduler({\n  cron: '0 * * * *',\n  func: getCard\n})` },
  { title: 'RPC Call', icon: 'rpc', code: `// From another function:\nconst card = await rpc.invoke(\n  'getCard',\n  { cardId: '123' }\n)` },
  { title: 'MCP (AI Tools)', icon: 'mcp', code: `wireMCPResource({\n  uri: 'card/{cardId}',\n  func: getCard,\n  tags: ['cards', 'data']\n})` },
  { title: 'CLI', icon: 'cli', code: `wireCLI({\n  program: 'cards',\n  commands: {\n    get: pikkuCLICommand({\n      parameters: '<cardId>',\n      func: getCard\n    })\n  }\n})` },
  { title: 'Trigger', icon: 'trigger', code: `wireTrigger({\n  name: 'cardChanged',\n  func: getCard,\n})\n\n// Register the trigger source\nwireTriggerSource({\n  name: 'cardChanged',\n  func: webhookTrigger,\n  input: { secret: process.env.WEBHOOK_SECRET }\n})` },
];

function SameFunctionSection() {
  const [active, setActive] = React.useState(0);
  return (
    <Section id="code-examples">
      <Wrap wide>
        <Eyebrow>Same function, any transport</Eyebrow>
        <H2>Pick a protocol. <em>The function never changes.</em></H2>
        <div className={styles.ahaGrid}>
          <div>
            <div className={styles.ahaColLabel}>Write once</div>
            <CodeCard filename="getCard.ts">
              <CodeBlock language="typescript">{FUNCTION_CODE}</CodeBlock>
            </CodeCard>
            <div className={styles.ahaChecks}>
              <CheckItem>Same auth &amp; permissions across all protocols</CheckItem>
              <CheckItem>One place to fix bugs and add features</CheckItem>
              <CheckItem>Type-safe inputs and outputs everywhere</CheckItem>
            </div>
          </div>
          <div className={styles.ahaPicker}>
            <div className={styles.ahaColLabel}>Pick a protocol</div>
            <PikkuCircularLayout
              items={WIRING_EXAMPLES}
              renderItem={(example, idx) => (
                <button
                  onClick={() => setActive(idx)}
                  className={`${styles.orbitBtn} ${active === idx ? styles.orbitBtnActive : ''}`}
                  title={example.title}
                >
                  <WiringIcon wiringId={example.icon} size={18} />
                </button>
              )}
              logoSize={90}
              radius={110}
              minHeight={290}
              centerOverlay={<span className={styles.orbitCaption}>{WIRING_EXAMPLES[active].title}</span>}
            />
          </div>
          <div>
            <div className={styles.ahaColLabel}>Wiring code</div>
            <CodeCard
              filename="wiring.ts"
              icon={<WiringIcon wiringId={WIRING_EXAMPLES[active].icon} size={15} />}
              badge={WIRING_EXAMPLES[active].title}
            >
              <CodeBlock language="typescript">{WIRING_EXAMPLES[active].code}</CodeBlock>
            </CodeCard>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Feature deep-dives (agents, workflows, addons, gateway)
   ════════════════════════════════════════════════════════════════ */
type Feature = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  code: { filename: string; source: string }[];
  points: { title: string; body: string }[];
  docs: { label: string; to: string };
  codeFirst?: boolean;
};

const FEATURES: Feature[] = [
  {
    id: 'agents',
    eyebrow: 'AI agents',
    title: <>Your functions are <em>already agent tools.</em></>,
    lede: 'No adapters. No schema writing. No separate auth layer. Pass your existing Pikku functions directly — the agent gets your full backend.',
    code: [{
      filename: 'src/agents/support.agent.ts',
      source: `// These already exist in your backend — no changes needed
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
})`,
    }],
    points: [
      { title: 'Zero glue code', body: 'Pass any Pikku function as a tool — the agent inherits its type signature, description, and input schema automatically.' },
      { title: 'Auth follows the agent', body: "Agents inherit the caller's session, permissions, and middleware. The rules that protect your HTTP endpoints protect every tool the agent can call." },
      { title: 'Any LLM, same interface', body: 'Bring OpenAI, Anthropic, or any provider. Pikku handles tool calling, streaming, and context — you just swap the model name.' },
    ],
    docs: { label: 'Read the AI Agents docs', to: '/docs/wiring/ai-agents' },
    codeFirst: true,
  },
  {
    id: 'workflows',
    eyebrow: 'Workflows',
    title: <>Multi-step processes that <em>survive anything.</em></>,
    lede: 'Write sequential logic like normal code. Pikku handles persistence, retries, and resumption — even across server restarts.',
    code: [{
      filename: 'src/workflows/onboarding.workflow.ts',
      source: `export const onboardingWorkflow = pikkuWorkflowFunc(
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
)`,
    }],
    points: [
      { title: 'Deterministic replay', body: 'Completed steps are cached and never re-executed. A workflow that fails on step 4 resumes from step 4 — not from the beginning.' },
      { title: 'Sleep for hours, days, or weeks', body: "workflow.sleep('5min') suspends execution without holding a server connection. Perfect for trial expirations, reminders, and follow-ups." },
      { title: 'Survives restarts', body: 'State is persisted between steps. Deploy a new version mid-workflow and execution continues from where it left off.' },
    ],
    docs: { label: 'Read the Workflows docs', to: '/docs/wiring/workflows' },
  },
  {
    id: 'addons',
    eyebrow: 'Addons',
    title: <>Install a backend feature <em>in one line.</em></>,
    lede: 'Stripe billing. SendGrid emails. One wireAddon() call each. Install, configure secrets, call via namespaced RPC — fully typed.',
    code: [
      {
        filename: 'src/wiring.ts',
        source: `// One line per addon
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
})`,
      },
      {
        filename: 'src/functions/checkout.func.ts',
        source: `// Call addon functions via namespaced RPC
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
})`,
      },
    ],
    points: [
      { title: 'Drop-in, not bolt-on', body: 'Install a package, add one wireAddon() call, and its functions appear as namespaced RPC calls. No glue code, no adapters.' },
      { title: 'Fully typed across boundaries', body: "The CLI generates TypeScript definitions for every addon function — rpc.invoke('stripe:checkoutCreate', …) autocompletes with exact input and output types." },
      { title: 'Secrets you control', body: 'Addons declare what secrets they need. You map them to your own infrastructure with secretOverrides.' },
      { title: 'Shared infrastructure', body: 'Addons reuse your existing logger, database, and services. Each addon gets its own namespace, so nothing collides.' },
    ],
    docs: { label: 'Read the Addons docs', to: '/docs/addon' },
    codeFirst: true,
  },
  {
    id: 'gateway',
    eyebrow: 'Gateway',
    title: <>One handler for <em>every messaging platform.</em></>,
    lede: 'WhatsApp, Slack, Telegram, WebChat — write one function. The adapter normalizes every platform into the same message format.',
    code: [
      {
        filename: 'src/gateway.wiring.ts',
        source: `// Webhook — platform POSTs to you
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
})`,
      },
      {
        filename: 'src/gateway.functions.ts',
        source: `// One handler for all platforms
const handleMessage = pikkuFunc({
  func: async ({ database, logger }, { senderId, text }) => {
    logger.info(\`\${senderId}: \${text}\`)
    await database.saveMessage(senderId, text)

    // Return value is auto-sent via the adapter
    return { text: \`Got it! You said: \${text}\` }
  }
})`,
      },
    ],
    points: [
      { title: 'Webhook auto-verification', body: 'WhatsApp challenges, Slack url_verification, Telegram tokens — handled by the adapter, invisible to your code.' },
      { title: 'Normalized messages', body: 'Every platform delivers the same message shape — senderId, text, attachments, metadata. Your handler never knows which platform sent it.' },
      { title: 'Three transport types', body: 'Webhook for cloud APIs, WebSocket for browser chat widgets, listener for persistent connections (Baileys, Signal CLI, Matrix).' },
      { title: 'Same middleware, same auth', body: 'Rate limiting, logging, permissions — your existing middleware works on gateways too.' },
    ],
    docs: { label: 'Read the Gateway docs', to: '/docs/wiring/gateway' },
  },
];

function FeatureSection({ f, index }: { f: Feature; index: number }) {
  const codeCol = (
    <div className={styles.featureCode}>
      {f.code.map((c) => (
        <CodeCard key={c.filename} filename={c.filename}>
          <CodeBlock language="typescript">{c.source}</CodeBlock>
        </CodeCard>
      ))}
    </div>
  );
  const pointsCol = (
    <div className={styles.featurePoints}>
      {f.points.map((p) => (
        <Card key={p.title}>
          <CardTitle>{p.title}</CardTitle>
          <CardBody>{p.body}</CardBody>
        </Card>
      ))}
      <Link to={f.docs.to} className={styles.docsLink}>{f.docs.label} →</Link>
    </div>
  );
  return (
    <Section id={f.id} variant={index % 2 === 0 ? 'default' : 'alt'}>
      <Wrap wide>
        <Eyebrow>{f.eyebrow}</Eyebrow>
        <H2>{f.title}</H2>
        <Lead>{f.lede}</Lead>
        <div className={styles.featureGrid}>
          {f.codeFirst ? <>{codeCol}{pointsCol}</> : <>{pointsCol}{codeCol}</>}
        </div>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Runtimes
   ════════════════════════════════════════════════════════════════ */
function RuntimesSection() {
  const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom];
  return (
    <Section>
      <Wrap wide>
        <Eyebrow>Deploy anywhere</Eyebrow>
        <H2>Change your runtime. <em>Keep your functions.</em></H2>
        <Lead>
          The same code runs on Express, Fastify, AWS Lambda, Cloudflare Workers, Next.js and more.
          Switching runtimes never touches your functions.
        </Lead>
        <div className={styles.runtimeChips}>
          {allRuntimes.map((runtime, idx) => (
            <Link key={idx} to={runtime.docs} className={styles.runtimeChip} title={`Deploy to ${runtime.name}`}>
              <Image
                width={20}
                height={20}
                sources={{
                  light: `img/logos/${runtime.img.light}`,
                  dark: `img/logos/${runtime.img.dark}`,
                }}
              />
              {runtime.name}
            </Link>
          ))}
        </div>
        <p className={styles.runtimeNote}>
          Plus any custom runtime via the adapter interface.{' '}
          <Link to="/docs/custom-runtimes/custom-http-runtime">Build your own →</Link>
        </p>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Production features
   ════════════════════════════════════════════════════════════════ */
const PROD_FEATURES = [
  { title: 'Type-safe clients', body: 'Auto-generated HTTP, WebSocket, and RPC clients with full IntelliSense.' },
  { title: 'Auth & permissions', body: 'Cookie, bearer, API key auth with fine-grained permissions — built in.' },
  { title: 'Services', body: 'Singleton and per-request dependency injection, type-safe and testable.' },
  { title: 'Middleware', body: 'Before/after hooks for logging, metrics, tracing — across all protocols.' },
  { title: 'Schema validation', body: 'Runtime validation against TypeScript input schemas. Supports Zod.' },
  { title: 'Zero lock-in', body: 'Standard TypeScript, tiny runtime, MIT licensed. Bring your own everything.' },
];

function ProductionSection() {
  return (
    <Section variant="alt">
      <Wrap wide>
        <Eyebrow>Built for production</Eyebrow>
        <H2>Production-grade <em>out of the box.</em></H2>
        <div className={styles.prodGrid}>
          {PROD_FEATURES.map((p) => (
            <Card key={p.title}>
              <CardTitle>{p.title}</CardTitle>
              <CardBody>{p.body}</CardBody>
            </Card>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Console + testimonials + CTA
   ════════════════════════════════════════════════════════════════ */
function ConsoleSection() {
  return (
    <Section>
      <Wrap wide>
        <Eyebrow>The console</Eyebrow>
        <H2>Every function, every wire, <em>one screen.</em></H2>
        <Lead>
          Browse functions, run agents, manage secrets, and trigger workflows —
          without writing tooling code.
        </Lead>
        <div className={styles.consoleShot}>
          <img
            src="/img/console-screenshot.webp"
            loading="lazy"
            alt="Pikku Console — browse and inspect all functions, wirings, and services"
          />
        </div>
        <Link to="/docs/console" className={styles.docsLink}>Learn about the Console →</Link>
      </Wrap>
    </Section>
  );
}

function TestimonialsSection() {
  return (
    <Section variant="alt">
      <Wrap>
        <Eyebrow>From the teams who switched</Eyebrow>
        <H2>Built for the problems <em>developers actually have.</em></H2>
        <div className={styles.quoteGrid}>
          {testimonials.map((t, idx) => (
            <figure key={idx} className={styles.quote}>
              <blockquote>"{t.quote}"</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                <span>{t.role}{t.company ? ` @ ${t.company}` : ''}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <Section>
      <Wrap>
        <div className={styles.cta}>
          <H2 style={{ textAlign: 'center', margin: '0 auto 18px' }}>
            Stop rewriting <em>the same function.</em>
          </H2>
          <p className={styles.ctaLede}>Write it once. Pikku wires it everywhere.</p>
          <button type="button" className={styles.ctaCmd} onClick={copy} title="Copy to clipboard">
            {copied ? '✓ copied' : 'npm create pikku@latest'}
          </button>
          <div className={styles.ctaActions}>
            <BtnPrimary to="/getting-started">Build your first API in 5 minutes</BtnPrimary>
            <BtnGhost href="https://github.com/pikkujs/pikku">View on GitHub</BtnGhost>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page assembly
   ════════════════════════════════════════════════════════════════ */
export default function Developers() {
  return (
    <Layout
      title="Pikku for Developers — Code Examples & API"
      description="See Pikku in action — code examples for HTTP, WebSocket, queues, cron, CLI, AI agents, workflows, and more. One function, every wiring."
    >
      <NavbarPageToggle isDeveloperPage={true} />
      <PaperPage>
        <Hero />
        <BeforeAfterSection />
        <SameFunctionSection />
        {FEATURES.map((f, i) => <FeatureSection key={f.id} f={f} index={i} />)}
        <RuntimesSection />
        <ProductionSection />
        <ConsoleSection />
        <TestimonialsSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
