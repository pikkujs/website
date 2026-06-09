import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  HttpIcon, WebSocketIcon, QueueIcon, CLIIcon, MCPIcon,
} from '../../components/WiringIcons';
import {
  ArrowDown, Wrench, Database, Zap, Shield,
  Copy, Check, RefreshCw, Lock,
  GitBranch, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { PaperPage, CodeCard, CheckItem, StepBadge } from '../../components/PaperLayout';
import styles from './function.module.css';

/* ════════════════════════════════════════════════════════
   1. Hero
   ════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Core Concept</span>
          <h1 className={styles.h1}>
            Your logic.<br /><em>Nothing else.</em>
          </h1>
          <p className={styles.lead}>
            A Pikku function receives <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>(services, data, wire)</code> and
            works across every protocol — HTTP, WebSocket, queue, CLI, MCP, and more.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/core-features/functions" className={styles.btnPrimary}>Read the docs</Link>
            <a href="#three-params" className={styles.btnGhost}>See how it works</a>
          </div>
        </div>

        <div className={styles.heroCoded}>
          <span className={styles.hcComment}>{'// Every Pikku function'}</span><br />
          <span className={styles.hcKeyword}>async</span>{' ('}  <br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcService}>db</span>{', '}<span className={styles.hcService}>logger</span>{', '}<span className={styles.hcService}>jwt</span>{' }'}</span>
          <span className={styles.hcLabel}>{'// services'}</span><br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcData}>bookId</span>{', '}<span className={styles.hcData}>title</span>{' }'}</span>
          <span className={styles.hcLabel}>{'// data'}</span><br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcWire}>session</span>{' }'}</span>
          <span className={styles.hcLabel}>{'// wire'}</span><br />
          {') => { ... }'}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   2. Three parameters
   ════════════════════════════════════════════════════════ */
const threeParamsCode = `const getBook = pikkuFunc({
  title: 'Get Book',
  func: async (
    { db, logger },          // services — your toolbox
    { bookId },              // data — typed input
    { session }              // wire — protocol context
  ) => {
    logger.info(\`Fetching book \${bookId}\`)
    const book = await db.getBook(bookId)
    return { book, reader: session.userId }
  }
})`;

function ThreeParamsSection() {
  const params = [
    {
      cls: styles.paramCardServices,
      nameCls: styles.services,
      icon: <Wrench className="w-5 h-5" style={{ color: '#9a6e1a', marginTop: 2, flexShrink: 0 }} />,
      name: 'Services',
      desc: 'Your toolbox — database, logger, JWT, email, anything you register. Destructure only what you need.',
      example: '{ db, logger, jwt }',
    },
    {
      cls: styles.paramCardData,
      nameCls: styles.data,
      icon: <Database className="w-5 h-5" style={{ color: '#1d6070', marginTop: 2, flexShrink: 0 }} />,
      name: 'Data',
      desc: 'Typed, validated input — normalized from any protocol. Path params, body, query, message payload — all merged.',
      example: '{ bookId, title }',
    },
    {
      cls: styles.paramCardWire,
      nameCls: styles.wire,
      icon: <Zap className="w-5 h-5" style={{ color: '#2f6f4e', marginTop: 2, flexShrink: 0 }} />,
      name: 'Wire',
      desc: 'Session and optional protocol helpers. session works everywhere — protocol-specific fields like http or rpc only appear when relevant.',
      example: '{ session, setSession }',
    },
  ];

  return (
    <section id="three-params" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>The Function Signature</div>
          <h2 className={styles.h2}>Three parameters. <em>That's it.</em></h2>
          <p className={styles.lead}>
            Every Pikku function receives the same three arguments — no matter which protocol triggers it.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 820, marginBottom: 36 }}
          className="max-w-2xl md:grid-cols-3 grid-cols-1">
          {params.map((p) => (
            <div key={p.name} className={`${styles.paramCard} ${p.cls}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                {p.icon}
                <span className={`${styles.paramName} ${p.nameCls}`}>{p.name}</span>
              </div>
              <p style={{ fontSize: 14, color: '#6b6559', lineHeight: 1.6, margin: '0 0 10px' }}>{p.desc}</p>
              <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: '#9a9387' }}>{p.example}</code>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 48, marginBottom: 20, maxWidth: 820 }}>
          <ArrowDown className="w-5 h-5" style={{ color: '#d4ccba' }} />
          <ArrowDown className="w-5 h-5" style={{ color: '#d4ccba' }} />
          <ArrowDown className="w-5 h-5" style={{ color: '#d4ccba' }} />
        </div>

        <div style={{ maxWidth: 580 }}>
          <CodeCard filename="getBook.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{threeParamsCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   3. Services
   ════════════════════════════════════════════════════════ */
const singletonServicesCode = `import { PikkuServiceMap } from '.pikku/pikku-types.gen.js'

// Singleton services — created once at startup
const singletonServices: PikkuServiceMap = {
  db: new DatabaseClient(DATABASE_URL),
  logger: createLogger({ level: 'info' }),
  jwt: new JWTService(JWT_SECRET),
  email: new EmailClient(SMTP_CONFIG),
}`;

const wireServicesCode = `// Wire services — created fresh per request
const wireServices = {
  // Each request gets its own session loader
  session: (services, wire) => loadSession(wire),
  // Per-request audit context
  audit: (services, wire) => new AuditLog(wire.requestId),
}`;

function ServicesSection() {
  const features = [
    { icon: <Database className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Singleton services', desc: 'Created once at startup, shared across all requests. Database connections, loggers, third-party clients.' },
    { icon: <RefreshCw className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Wire services', desc: 'Created fresh per request. Session loaders, audit contexts, per-request caches. Lazily instantiated only when destructured.' },
    { icon: <Wrench className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Destructure what you need', desc: 'Only pull the services your function actually uses. Keeps code clean and makes dependencies explicit.' },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Services</div>
          <h2 className={styles.h2}>Your toolbox, <em>injected</em></h2>
          <p className={styles.lead}>Services are dependency-injected into every function. Register once, destructure anywhere.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 900, alignItems: 'start' }}
          className="lg:grid-cols-2 grid-cols-1">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f) => (
              <div key={f.title} className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {f.icon}
                  <div>
                    <div className={styles.cardTitle}>{f.title}</div>
                    <p className={styles.cardBody}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CodeCard filename="services.ts" badge="startup">
              <CodeBlock language="typescript">{singletonServicesCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="wire-services.ts" badge="per-request">
              <CodeBlock language="typescript">{wireServicesCode}</CodeBlock>
            </CodeCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   4. Versioning
   ════════════════════════════════════════════════════════ */
const versionedFuncCode = `// v1 — kept around for old clients
const getBookV1 = pikkuFunc({
  title: 'Get Book',
  version: 1,
  input: z.object({ bookId: z.string() }),
  output: z.object({ title: z.string() }),
  func: async ({ db }, { bookId }) => {
    return await db.getBook(bookId)
  }
})

// v2 — the latest version, called by default
const getBook = pikkuFunc({
  title: 'Get Book',
  version: 2,
  input: z.object({ bookId: z.string(), format: z.enum(['full', 'summary']) }),
  output: z.object({ title: z.string(), author: z.string(), isbn: z.string() }),
  func: async ({ db }, { bookId, format }) => {
    return await db.getBook(bookId, format)
  }
})`;

const ciCheckCode = `# CI catches breaking changes before deploy
$ npx pikku versions check

✗ getBook — contract changed without version bump
  Input schema hash:  a1b2c3d4 → f9e8d7c6
  Output schema hash: i9j0k1l2 → z5y4x3w2

  Run: npx pikku versions update
  after bumping to version 2`;

function VersioningSection() {
  const steps = [
    { icon: <GitBranch className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Contracts are tracked automatically', desc: <>Every function's name + input schema + output schema = a contract hash. The CLI stores these in a <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: '#c2410c' }}>versions.pikku.json</code> manifest.</> },
    { icon: <AlertTriangle className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Breaking changes fail the build', desc: <>If you change a published schema without bumping the version, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: '#c2410c' }}>pikku versions check</code> fails. Add it to CI and breaking changes never ship by accident.</> },
    { icon: <CheckCircle2 className="w-5 h-5" style={{ color: '#c2410c', marginTop: 2, flexShrink: 0 }} />, title: 'Version bumps are explicit', desc: <>Set <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: '#c2410c' }}>version: 2</code> on the function, run <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: '#c2410c' }}>pikku versions update</code>, commit. Old and new versions coexist.</> },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Contracts & Versioning</div>
          <h2 className={styles.h2}>Never accidentally <em>break a client</em></h2>
          <p className={styles.lead}>
            Pikku hashes every function's input and output schema. Change a contract without bumping the
            version and the build fails — before it reaches production.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 900, alignItems: 'start' }}
          className="lg:grid-cols-2 grid-cols-1">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((s) => (
              <div key={s.title} className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {s.icon}
                  <div>
                    <div className={styles.cardTitle}>{s.title}</div>
                    <p className={styles.cardBody}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.ciTerminal}>
              <div className={styles.ciTermBar}>
                <span className={styles.ciTermDot} style={{ background: '#e06c5b' }} />
                <span className={styles.ciTermDot} style={{ background: '#e0b34b' }} />
                <span className={styles.ciTermDot} style={{ background: '#79b06a' }} />
                <span className={styles.ciTermTitle}>CI Pipeline</span>
                <span className={styles.ciTermFailed}>failed</span>
              </div>
              <div className={styles.ciTermBody}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#d8d2c4' }}>{ciCheckCode}</pre>
              </div>
            </div>
          </div>

          <div>
            <CodeCard filename="getBook.func.ts" badge="version: 1 → 2">
              <CodeBlock language="typescript">{versionedFuncCode}</CodeBlock>
            </CodeCard>
            <div className={styles.checkList}>
              <CheckItem>Clients call the latest version by default — old versions stay available</CheckItem>
              <CheckItem>Works across all wires: HTTP, RPC, WebSocket, MCP</CheckItem>
              <CheckItem>Schema hashes are deterministic and diffable in Git</CheckItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   5. Session & Auth
   ════════════════════════════════════════════════════════ */
const loginCode = `const login = pikkuFunc({
  title: 'Login',
  func: async (
    { jwt, db },
    { email, password },
    { setSession }
  ) => {
    const user = await db.verifyCredentials(email, password)
    const token = jwt.sign({ userId: user.id, role: user.role })

    // Works the same whether it's HTTP, WebSocket, or CLI
    setSession({ userId: user.id, role: user.role })

    return { token }
  }
})`;

const getMeCode = `const getMe = pikkuFunc({
  title: 'Get Current User',
  func: async ({ db }, {}, { session }) => {
    // session is loaded by middleware before
    // your function runs — same API everywhere
    return await db.getUser(session.userId)
  },
  permissions: { user: isAuthenticated }
})`;

function SessionSection() {
  const lifecycle = [
    { step: 'Middleware loads', desc: 'Session populated from cookie, token, or connection state' },
    { step: 'Function receives', desc: 'Access session via the wire parameter — read userId, role, etc.' },
    { step: 'Function modifies', desc: 'Call setSession() or clearSession() to update' },
    { step: 'Middleware persists', desc: 'Changes saved back to the transport — cookie, store, etc.' },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Session & Auth</div>
          <h2 className={styles.h2}>One session API, <em>every transport</em></h2>
          <p className={styles.lead}>
            Whether the request arrives over HTTP, WebSocket, or CLI — your function reads and writes
            the session the same way.
          </p>
        </div>

        {/* Lifecycle */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, maxWidth: 860, marginBottom: 40 }}
          className="sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
          {lifecycle.map((item, i) => (
            <div key={i} className={styles.lifecycleCard}>
              <StepBadge n={i + 1} />
              <div className={styles.lifecycleStep}>{item.step}</div>
              <p className={styles.lifecycleDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}
          className="lg:grid-cols-2 grid-cols-1">
          <CodeCard filename="login.func.ts" badge="func.ts" icon={<Lock className="w-4 h-4" style={{ color: '#8a8475' }} />}>
            <CodeBlock language="typescript">{loginCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="getMe.func.ts" badge="func.ts" icon={<Shield className="w-4 h-4" style={{ color: '#8a8475' }} />}>
            <CodeBlock language="typescript">{getMeCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   6. One function, every protocol
   ════════════════════════════════════════════════════════ */
const everyProtocolFunc = `// Define once
const getBook = pikkuFunc({
  title: 'Get Book',
  func: async ({ db }, { bookId }, { session }) => {
    return await db.getBook(bookId)
  },
  permissions: { user: isAuthenticated }
})`;

const everyProtocolWirings = `// Wire to everything
wireHTTP({ method: 'get', route: '/books/:bookId', func: getBook })
wireWebSocket({ channel: 'books', func: getBook })
wireQueue({ queue: 'book-requests', func: getBook })
wireCLI({ command: 'get-book', func: getBook })
wireMCP({ tool: 'get_book', func: getBook })`;

function EveryProtocolSection() {
  const protocols = [
    { icon: <HttpIcon size={24} />, name: 'HTTP' },
    { icon: <WebSocketIcon size={24} />, name: 'WebSocket' },
    { icon: <QueueIcon size={24} />, name: 'Queue' },
    { icon: <CLIIcon size={24} />, name: 'CLI' },
    { icon: <MCPIcon size={24} />, name: 'MCP' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Write Once, Wire Everywhere</div>
          <h2 className={styles.h2}>One function. <em>Every protocol.</em></h2>
          <p className={styles.lead}>
            The same function handles HTTP requests, WebSocket messages, queue jobs, CLI commands,
            and MCP tools — zero duplication.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          {protocols.map((p) => (
            <div key={p.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={styles.protoIcon}>{p.icon}</div>
              <span className={styles.protoLabel}>{p.name}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginBottom: 24 }}>
          <ArrowDown className="w-6 h-6" style={{ color: '#d4ccba' }} />
        </div>

        <div className={styles.protoCenter} style={{ marginLeft: 0, marginBottom: 40 }}>
          <div className={styles.protoCenterLabel}>Same Function</div>
          <code className={styles.protoCenterCode}>getBook(services, data, wire)</code>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}
          className="lg:grid-cols-2 grid-cols-1">
          <CodeCard filename="getBook.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{everyProtocolFunc}</CodeBlock>
          </CodeCard>
          <CodeCard filename="wirings.ts" badge="wiring.ts">
            <CodeBlock language="typescript">{everyProtocolWirings}</CodeBlock>
          </CodeCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 700, marginTop: 36 }}
          className="md:grid-cols-3 grid-cols-1">
          {[
            { label: 'Zero duplication', desc: 'Business logic lives in one place. Each wire adapts the protocol to your function.' },
            { label: 'Same permissions', desc: 'Auth and permission checks apply regardless of which wire triggers the function.' },
            { label: 'Same types', desc: 'Input and output types are shared. Change once, every wire gets the update.' },
          ].map((item) => (
            <CheckItem key={item.label}>
              <span>
                <strong style={{ color: '#1a1814', fontWeight: 600 }}>{item.label}</strong>
                {' — '}{item.desc}
              </span>
            </CheckItem>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   7. CTA
   ════════════════════════════════════════════════════════ */
function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard.writeText('npm create pikku@latest'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={`${styles.sectionDark} ${styles.cta}`}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Start building in <em>5 minutes</em></h2>
        <p className={styles.lead} style={{ marginBottom: 32 }}>
          One command to scaffold a project. Your first function will work across every protocol from day one.
        </p>

        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npm create pikku@latest
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/functions" className={styles.btnPrimary}>Read the function docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className={styles.btnGhost}>View on GitHub</Link>
        </div>

        <p className={styles.ctaMeta}>MIT Licensed · Works with Express, Fastify, Lambda &amp; Cloudflare</p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════ */
export default function FunctionPage() {
  return (
    <Layout
      title="Pikku Functions — Write Once, Wire Everywhere"
      description="A Pikku function receives services, data, and wire context — and works across HTTP, WebSocket, Queue, CLI, MCP, and every other protocol."
    >
      <PaperPage>
        <Hero />
        <main>
          <ThreeParamsSection />
          <ServicesSection />
          <VersioningSection />
          <SessionSection />
          <EveryProtocolSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
