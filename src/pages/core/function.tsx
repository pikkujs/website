import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  HttpIcon, WebSocketIcon, QueueIcon, CLIIcon, MCPIcon,
} from '../../components/WiringIcons';
import {
  ArrowDown, Wrench, Database, Zap, Shield,
  Copy, Check, RefreshCw, Lock,
  GitBranch, AlertTriangle, CheckCircle2,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function CodeCard({ filename, badge, icon, children }: {
  filename: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
        {icon}
        <span className="text-sm font-semibold text-neutral-200">{filename}</span>
        {badge && <span className="ml-auto text-xs text-neutral-600 font-mono">{badge}</span>}
      </div>
      <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-function w-full relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-purple-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-fuchsia-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        {/* Left: text */}
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-400/40 bg-purple-400/10 px-3 py-1 rounded mb-6">
            Core Concept
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Your logic.</span><br />
            <span className="text-purple-400">Nothing else.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            A Pikku function receives <code className="text-purple-400 text-lg">(services, data, wire)</code> and works across every protocol — HTTP, WebSocket, queue, CLI, MCP, and more.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/core-features/functions"
              className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              Read the Docs
            </Link>
            <a
              href="#three-params"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: visual — function signature */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-purple-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Every Pikku function</span><br />
            <span className="text-purple-400">async</span>{' '}
            <span className="text-white">(</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-yellow-300">db</span>{', '}<span className="text-yellow-300">logger</span>{', '}<span className="text-yellow-300">jwt</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// services</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-cyan-300">bookId</span>{', '}<span className="text-cyan-300">title</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// data</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-green-300">session</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// wire</span><br />
            <span className="text-white">{') => { ... }'}</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. THE THREE PARAMETERS
   ───────────────────────────────────────────── */

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
      name: 'Services',
      color: 'yellow',
      icon: <Wrench className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      desc: 'Your toolbox — database, logger, JWT, email, anything you register. Destructure only what you need.',
      example: '{ db, logger, jwt }',
    },
    {
      name: 'Data',
      color: 'cyan',
      icon: <Database className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />,
      desc: 'Typed, validated input — normalized from any protocol. Path params, body, query, message payload — all merged.',
      example: '{ bookId, title }',
    },
    {
      name: 'Wire',
      color: 'green',
      icon: <Zap className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      desc: 'Session and optional protocol helpers. session works everywhere — protocol-specific fields like http or rpc only appear when relevant, and you never have to use them.',
      example: '{ session, setSession }',
    },
  ];

  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
    yellow: { border: 'border-t-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    cyan: { border: 'border-t-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    green: { border: 'border-t-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
  };

  return (
    <section id="three-params" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Function Signature</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three parameters. <span className="text-purple-400">That's it.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every Pikku function receives the same three arguments — no matter which protocol triggers it.
          </p>
        </div>

        {/* Three param cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {params.map((param, i) => (
            <div key={i} className={`bg-[#0d0d0d] border border-neutral-800 ${colorMap[param.color].border} border-t-2 rounded-lg p-5`}>
              <div className="flex items-start gap-3 mb-3">
                {param.icon}
                <h3 className={`text-base font-bold ${colorMap[param.color].text}`}>{param.name}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-3">{param.desc}</p>
              <code className={`text-xs font-mono ${colorMap[param.color].text}`}>{param.example}</code>
            </div>
          ))}
        </div>

        {/* Arrows converging */}
        <div className="flex justify-center gap-12 mb-6">
          <ArrowDown className="w-5 h-5 text-yellow-500/60" />
          <ArrowDown className="w-5 h-5 text-cyan-500/60" />
          <ArrowDown className="w-5 h-5 text-green-500/60" />
        </div>

        {/* Code example */}
        <div className="max-w-2xl mx-auto">
          <CodeCard filename="getBook.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{threeParamsCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. SERVICES — singleton vs wire
   ───────────────────────────────────────────── */

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
    {
      icon: <Database className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Singleton services',
      desc: 'Created once at startup, shared across all requests. Database connections, loggers, third-party clients.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Wire services',
      desc: 'Created fresh per request. Session loaders, audit contexts, per-request caches. Lazily instantiated only when destructured.',
    },
    {
      icon: <Wrench className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Destructure what you need',
      desc: 'Only pull the services your function actually uses. Keeps code clean and makes dependencies explicit.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Services</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Your toolbox, <span className="text-purple-400">injected</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Services are dependency-injected into every function. Register once, destructure anywhere.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Left: feature cards */}
          <div className="space-y-5">
            {features.map((feat, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {feat.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">{feat.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: code examples stacked */}
          <div className="space-y-6">
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

/* ─────────────────────────────────────────────
   4. VERSIONING — Ship without breaking clients
   ───────────────────────────────────────────── */

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
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Contracts & Versioning</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Never accidentally <span className="text-purple-400">break a client</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku hashes every function's input and output schema. Change a contract without bumping the version and the build fails — before it reaches production.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Left: how it works + CI terminal */}
          <div className="space-y-5">
            {/* Step cards */}
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <GitBranch className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Contracts are tracked automatically</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Every function's name + input schema + output schema = a contract hash. The CLI stores these in a <code className="text-purple-400 text-xs">versions.pikku.json</code> manifest.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Breaking changes fail the build</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    If you change a published schema without bumping the version, <code className="text-purple-400 text-xs">pikku versions check</code> fails. Add it to CI and breaking changes never ship by accident.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Version bumps are explicit</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Set <code className="text-purple-400 text-xs">version: 2</code> on the function, run <code className="text-purple-400 text-xs">pikku versions update</code>, commit. Old and new versions coexist — no migration needed.
                  </p>
                </div>
              </div>
            </div>

            {/* CI terminal output */}
            <div className="rounded-xl border border-red-500/30 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-sm font-semibold text-neutral-200">CI Pipeline</span>
                <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400">failed</span>
              </div>
              <div className="p-5 bg-[#0a0a0f] font-mono text-xs leading-relaxed">
                <pre className="text-neutral-400 whitespace-pre-wrap">{ciCheckCode}</pre>
              </div>
            </div>
          </div>

          {/* Right: code example */}
          <div>
            <CodeCard filename="getBook.func.ts" badge="version: 1 → 2">
              <CodeBlock language="typescript">{versionedFuncCode}</CodeBlock>
            </CodeCard>

            {/* Highlights */}
            <div className="mt-6 space-y-3">
              {[
                'Clients call the latest version by default — old versions stay available',
                'Works across all wires: HTTP, RPC, WebSocket, MCP',
                'Schema hashes are deterministic and diffable in Git',
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] font-bold">&#10003;</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. SESSION & AUTH
   ───────────────────────────────────────────── */

const loginCode = `const login = pikkuFunc({
  title: 'Login',
  func: async (
    { jwt, db },
    { email, password },
    { setSession }
  ) => {
    const user = await db.verifyCredentials(email, password)
    const token = jwt.sign({ userId: user.id, role: user.role })

    // Works the same whether it's an HTTP cookie,
    // WebSocket connection, or CLI token
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
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Session & Auth</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One session API, <span className="text-purple-400">every transport</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Whether the request arrives over HTTP, WebSocket, or CLI — your function reads and writes the session the same way.
          </p>
        </div>

        {/* Session lifecycle */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {lifecycle.map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 text-center relative">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold mb-3">{i + 1}</span>
              <p className="text-sm font-semibold text-white mb-1">{item.step}</p>
              <p className="text-xs text-neutral-500">{item.desc}</p>
              {i < lifecycle.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-neutral-700 text-lg">&rarr;</div>
              )}
            </div>
          ))}
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="login.func.ts" badge="func.ts" icon={<Lock className="w-4 h-4 text-purple-400" />}>
            <CodeBlock language="typescript">{loginCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="getMe.func.ts" badge="func.ts" icon={<Shield className="w-4 h-4 text-purple-400" />}>
            <CodeBlock language="typescript">{getMeCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. ONE FUNCTION, EVERY PROTOCOL
   ───────────────────────────────────────────── */

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
    { icon: <HttpIcon size={24} />, name: 'HTTP', color: 'text-green-400' },
    { icon: <WebSocketIcon size={24} />, name: 'WebSocket', color: 'text-purple-400' },
    { icon: <QueueIcon size={24} />, name: 'Queue', color: 'text-red-400' },
    { icon: <CLIIcon size={24} />, name: 'CLI', color: 'text-cyan-400' },
    { icon: <MCPIcon size={24} />, name: 'MCP', color: 'text-pink-400' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Write Once, Wire Everywhere</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One function. <span className="text-purple-400">Every protocol.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            The same function handles HTTP requests, WebSocket messages, queue jobs, CLI commands, and MCP tools — zero duplication.
          </p>
        </div>

        {/* Protocol icons row */}
        <div className="flex justify-center gap-6 md:gap-8 mb-12">
          {protocols.map((proto, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                {proto.icon}
              </div>
              <span className={`text-xs font-semibold ${proto.color}`}>{proto.name}</span>
            </div>
          ))}
        </div>

        {/* Arrows converging to center */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="w-6 h-6 text-purple-500/50" />
        </div>

        {/* Central "same function" badge */}
        <div className="bg-[#0d0d0d] border-2 border-purple-500/30 rounded-xl p-4 text-center max-w-xs mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Same Function</p>
          <code className="text-sm text-neutral-300 font-mono">getBook(services, data, wire)</code>
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="getBook.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{everyProtocolFunc}</CodeBlock>
          </CodeCard>
          <CodeCard filename="wirings.ts" badge="wiring.ts">
            <CodeBlock language="typescript">{everyProtocolWirings}</CodeBlock>
          </CodeCard>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Zero duplication', desc: 'Business logic lives in one place. Each wire adapts the protocol to your function.' },
            { label: 'Same permissions', desc: 'Auth and permission checks apply regardless of which wire triggers the function.' },
            { label: 'Same types', desc: 'Input and output types are shared. Change once, every wire gets the update.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[11px] font-bold mt-0.5">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Purple glow orb */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-purple-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start building in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project. Your first function will work across every protocol from day one.
        </p>

        {/* npm command with copy */}
        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-purple-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-purple-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-purple-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/core-features/functions"
            className="bg-purple-500 text-white hover:bg-purple-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            Read the Function Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Works with Express, Fastify, Lambda &amp; Cloudflare
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function FunctionPage() {
  return (
    <Layout
      title="Pikku Functions — Write Once, Wire Everywhere"
      description="A Pikku function receives services, data, and wire context — and works across HTTP, WebSocket, Queue, CLI, MCP, and every other protocol."
    >
      <Hero />
      <main>
        <ThreeParamsSection />
        <ServicesSection />
        <VersioningSection />
        <SessionSection />
        <EveryProtocolSection />
        <CTASection />
      </main>
    </Layout>
  );
}
