import snippets from '@/data/snippets.json';
import { collapseFunc } from '@/components/FeaturePage';
import React from 'react';
import Layout from '@/components/site/Layout';
import Link from '@/components/site/Link';
import CodeBlock from '@/components/site/CodeBlock';
import Image from '@/components/site/ThemedImage';
import { NavbarPageToggle, PikkuCircularLayout } from '@/components/HomepageShared';
import {
  PaperPage, Section, Wrap, Eyebrow, H1, H2, Lead,
  BtnPrimary, BtnGhost, CodeCard, CheckItem, Card, CardTitle, CardBody,
} from '@/components/PaperLayout';
import { ArrowRight } from 'lucide-react';
import { WiringIcon } from '@/components/WiringIcons';
import { runtimes } from '@/data/homepage';
import { testimonials } from '@/data/testimonials';
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
const WITHOUT_POINTS = [
  'The same handler written again for HTTP, WebSocket, queue, cron and CLI, each one drifting from the others.',
  'A separate workflow engine, with its own SDK, its own schema and its own deploy pipeline.',
  'A separate AI framework for agents, with auth and permissions left for you to rebuild.',
  'Three auth layers, three validation layers, one backend.',
];

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
            <ul className={styles.compareBefore} style={{ listStyle: 'none', margin: 0, padding: '22px 24px', border: '1px solid var(--paper-border)', borderRadius: 14, background: 'var(--paper-bg-alt)', display: 'grid', gap: 14 }}>
              {WITHOUT_POINTS.map((t) => (
                <li key={t} style={{ color: 'var(--paper-text-muted)', lineHeight: 1.6 }}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className={styles.compareLabel}>
              <span className={`${styles.compareDot} ${styles.dotGood}`} />
              With Pikku
              <span className={styles.compareTag}>1 function, then wire it</span>
            </div>
            <CodeCard filename="items.functions.ts" badge="the function">
              <CodeBlock language="typescript">{collapseFunc(snippets.getItem)}</CodeBlock>
            </CodeCard>
            <div style={{ height: 16 }} />
            <CodeCard filename="items.wiring.ts" badge="the wiring">
              <CodeBlock language="typescript">{snippets.funcMultiWire}</CodeBlock>
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
const WIRING_EXAMPLES = [
  { title: 'HTTP API', icon: 'http', body: 'A REST route that points at the function. Method, path, auth and middleware live on the wiring.', to: '/docs/wiring/http' },
  { title: 'WebSocket', icon: 'websocket', body: 'A channel with connect and disconnect handlers and message routing. The function is called per message.', to: '/docs/wiring/channels' },
  { title: 'Server-Sent Events', icon: 'sse', body: 'The same HTTP route with sse switched on, so results stream to the browser as they are produced.', to: '/docs/wiring/http/server-sent-events' },
  { title: 'Queue Worker', icon: 'queue', body: 'A named queue worker with concurrency and rate limits, backed by BullMQ, pg-boss or SQS.', to: '/docs/wiring/queue' },
  { title: 'Scheduled Task', icon: 'cron', body: 'A cron schedule that runs the function, with middleware and manual triggering.', to: '/docs/wiring/scheduled-tasks' },
  { title: 'RPC Call', icon: 'rpc', body: 'Nothing to wire: expose the function and call it by name, fully typed, from any other function or client.', to: '/docs/wiring/rpcs' },
  { title: 'MCP (AI Tools)', icon: 'mcp', body: 'Offer the function to AI clients as a tool, a resource or a prompt, with the same auth as everything else.', to: '/docs/wiring/mcp' },
  { title: 'CLI', icon: 'cli', body: 'A command in your own command line program, with typed parameters and a renderer for the output.', to: '/docs/wiring/cli' },
  { title: 'Trigger', icon: 'trigger', body: 'Run the function when something happens elsewhere: a webhook, a database change, a message.', to: '/docs/wiring/triggers' },
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
            <CodeCard filename="items.functions.ts" badge="the function">
              <CodeBlock language="typescript">{collapseFunc(snippets.getItem)}</CodeBlock>
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
            <div className={styles.ahaColLabel}>How it is wired</div>
            <div className={styles.compareBefore} style={{ filter: 'none', padding: '22px 24px', border: '1px solid var(--paper-border)', borderRadius: 14, background: 'var(--paper-bg-alt)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 20 }}>
                <WiringIcon wiringId={WIRING_EXAMPLES[active].icon} size={20} />
                {WIRING_EXAMPLES[active].title}
              </div>
              <p style={{ color: 'var(--paper-text-muted)', lineHeight: 1.65, margin: '12px 0 14px' }}>{WIRING_EXAMPLES[active].body}</p>
              <Link to={WIRING_EXAMPLES[active].to} style={{ color: 'var(--paper-accent-dark)', textDecoration: 'underline', textUnderlineOffset: 3, display: 'inline-flex', alignItems: 'center', gap: 6 }}>Read the {WIRING_EXAMPLES[active].title} docs <ArrowRight size={14} /></Link>
            </div>
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
      filename: 'src/agents/shop.agent.ts',
      source: snippets['aiAgent'],
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
      filename: 'src/workflows/order-follow-up.workflow.ts',
      source: snippets['wa-wf-quick-example'],
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
        source: snippets['rt-wire-addon-multiple'],
      },
      {
        filename: 'src/functions/stripe-customer.func.ts',
        source: snippets['rt-addon-typed-invoke'],
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
        source: snippets['wb-gateway-multiple'],
      },
      {
        filename: 'src/gateway.functions.ts',
        source: snippets['wb-gateway-handler'],
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
                  light: `/img/logos/${runtime.img.light}`,
                  dark: `/img/logos/${runtime.img.dark}`,
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
   The API surface — the doors you import from, generated per project
   ════════════════════════════════════════════════════════════════ */
const SURFACE_GROUPS: {
  name: string;
  blurb: string;
  doors: { door: string; to: string }[];
}[] = [
  {
    name: 'Create a function',
    blurb: 'The definers every wiring eventually points at, and the config and services they run against.',
    doors: [
      { door: 'function', to: '/api#app/function' },
      { door: 'setup', to: '/api#app/setup' },
    ],
  },
  {
    name: 'Enhance it',
    blurb: 'Errors, middleware, secrets, variables and addons — what wraps a function without changing it.',
    doors: [
      { door: 'error', to: '/api#app/error' },
      { door: 'middleware', to: '/api#app/middleware' },
      { door: 'secrets', to: '/api#app/secrets' },
      { door: 'variables', to: '/api#app/variables' },
      { door: 'addon', to: '/api#app/addon' },
    ],
  },
  {
    name: 'Wire it up',
    blurb: 'One wire* call per protocol. The function does not change; only how the world reaches it does.',
    doors: [
      { door: 'http', to: '/api#app/http' },
      { door: 'channel', to: '/api#app/channel' },
      { door: 'queue', to: '/api#app/queue' },
      { door: 'scheduler', to: '/api#app/scheduler' },
      { door: 'cli', to: '/api#app/cli' },
      { door: 'mcp', to: '/api#app/mcp' },
      { door: 'trigger', to: '/api#app/trigger' },
      { door: 'gateway', to: '/api#app/gateway' },
    ],
  },
  {
    name: 'Guard it',
    blurb: 'Who may call a function, and under which scope or role.',
    doors: [
      { door: 'auth', to: '/api#app/auth' },
      { door: 'scopes', to: '/api#app/scopes' },
    ],
  },
  {
    name: 'Orchestrate it',
    blurb: 'Workflows and agents — composing functions into something longer-lived than one call.',
    doors: [
      { door: 'agent', to: '/api#app/agent' },
      { door: 'workflow', to: '/api#app/workflow' },
    ],
  },
  {
    name: 'Test it',
    blurb: 'Features, scenarios and steps that drive the whole system the way a user would.',
    doors: [{ door: 'scenarios', to: '/api#app/scenarios' }],
  },
];

function ApiSurfaceSection() {
  return (
    <Section id="api-surface" variant="dark">
      <Wrap wide>
        <Eyebrow>The API surface</Eyebrow>
        <H2>Every import, <em>generated for your project.</em></H2>
        <div className={styles.surfaceLead}>
        <Lead>
          You import from <code>#pikku</code>, not <code>@pikku</code>. The CLI generates a barrel per
          concern into <code>.pikku</code>, so <code>#pikku/http</code> is <em>your</em> project's HTTP
          door — carrying your session type, your services and your function names, which is how{' '}
          <code>wireHTTP</code> knows what you may pass it.
        </Lead>
        </div>
        <div className={styles.surfaceGrid}>
          {SURFACE_GROUPS.map((g) => (
            <div key={g.name} className={styles.surfaceGroup}>
              <h3>{g.name}</h3>
              <p>{g.blurb}</p>
              <div className={styles.surfaceDoors}>
                {g.doors.map((d) => (
                  <Link key={d.door} to={d.to} className={styles.surfaceDoor}>
                    #pikku/{d.door}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className={styles.surfaceNote}>
          The same surface prints in your terminal — <code>npx pikku doc</code> for the index,{' '}
          <code>npx pikku doc http</code> for one door, <code>npx pikku doc --ai</code> for the version
          a coding agent should read. Writing an addon instead? The parallel doors live under{' '}
          <code>#pikku/addon/*</code>. <Link to="/api">Browse the SDK →</Link>
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
   Testimonials + CTA
   ════════════════════════════════════════════════════════════════ */
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
        <ApiSurfaceSection />
        <ProductionSection />
        <TestimonialsSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
