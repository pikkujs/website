import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { HttpIcon, SSEIcon } from '../../components/WiringIcons';
import {
  ArrowDown, ShieldCheck, Lock, Globe, Layers,
  FolderTree, Link2, Copy, Check,
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
    <div className="wire-hero-http w-full relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-green-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-orange-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        {/* Left: text */}
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-400 border border-green-400/40 bg-green-400/10 px-3 py-1 rounded mb-6">
            Wire Type: HTTP
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Your functions, now</span><br />
            <span className="text-green-400">REST endpoints.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-green-400 text-lg">wireHTTP</code> maps your Pikku functions to type-safe HTTP routes — with automatic input merging, OpenAPI generation, and optional SSE streaming.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/http"
              className="bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-green-500/20"
            >
              Get Started
            </Link>
            <a
              href="#basics"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See the Code
            </a>
          </div>
        </div>

        {/* Right: icons visual */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            {/* HTTP icon with green glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[40px]" />
              <div className="relative bg-[#0d0d0d] border-2 border-green-500/40 rounded-2xl p-6">
                <HttpIcon size={120} />
              </div>
            </div>
            {/* SSE icon orbiting */}
            <div className="absolute -top-4 -right-10">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-[20px]" />
                <div className="relative bg-[#0d0d0d] border border-orange-400/40 rounded-xl p-3">
                  <SSEIcon size={36} />
                  <span className="block text-[10px] text-orange-400 font-semibold mt-1 text-center">SSE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Function to endpoint in two lines"
   ───────────────────────────────────────────── */

const basicsFunction = `const getBook = pikkuFunc({
  title: 'Get Book',
  description: 'Retrieve a book by ID',
  func: async ({ db }, { bookId }) => {
    return await db.getBook(bookId)
  },
  permissions: { user: isAuthenticated }
})`;

const basicsWiring = `wireHTTP({
  method: 'get',
  route: '/books/:bookId',
  func: getBook
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Function to endpoint in <span className="text-green-400">two lines</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Define your function once, wire it to a route. Pikku handles the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {/* Left: function */}
          <CodeCard filename="getBook.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{basicsFunction}</CodeBlock>
          </CodeCard>

          {/* Right: wiring */}
          <CodeCard filename="books.wiring.ts" badge="wiring.ts" icon={<HttpIcon size={15} />}>
            <CodeBlock language="typescript">{basicsWiring}</CodeBlock>
          </CodeCard>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Path params extracted', desc: ':bookId becomes a typed input field automatically' },
            { label: 'Errors mapped to status codes', desc: 'Throw NotFoundError → 404, UnauthorizedError → 401' },
            { label: 'OpenAPI generated', desc: 'Every wired route appears in your OpenAPI spec for free' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. DATA FLOW — "Everything merges into one typed input"
   ───────────────────────────────────────────── */

const dataFlowCode = `wireHTTP({
  method: 'post',
  route: '/books/:bookId',
  func: updateBook
})

// POST /books/42?format=pdf
// Body: { title: "New Title" }
//
// → updateBook receives:
//   { bookId: "42", format: "pdf", title: "New Title" }`;

function DataFlowSection() {
  const sources = [
    { label: 'Path Params', example: ':bookId → "42"', color: 'green' },
    { label: 'Query String', example: '?format=pdf', color: 'cyan' },
    { label: 'Request Body', example: '{ title: "..." }', color: 'purple' },
  ];

  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
    green: { border: 'border-t-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
    cyan: { border: 'border-t-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    purple: { border: 'border-t-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Data Flow</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Everything merges into <span className="text-green-400">one typed input</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Path params, query strings, and request bodies combine into a single object your function receives.
          </p>
        </div>

        {/* Visual: 3 sources → merged */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {sources.map((src, i) => (
              <div key={i} className={`bg-[#0d0d0d] border border-neutral-800 ${colorMap[src.color].border} border-t-2 rounded-lg p-4 text-center`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${colorMap[src.color].text} mb-2`}>{src.label}</p>
                <p className="text-sm text-neutral-400 font-mono">{src.example}</p>
              </div>
            ))}
          </div>

          {/* Arrows converging */}
          <div className="flex justify-center gap-8 mb-6">
            <ArrowDown className="w-5 h-5 text-green-500/60" />
            <ArrowDown className="w-5 h-5 text-cyan-500/60" />
            <ArrowDown className="w-5 h-5 text-purple-500/60" />
          </div>

          {/* Merged input card */}
          <div className="bg-[#0d0d0d] border-2 border-green-500/30 rounded-xl p-5 text-center max-w-sm mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Merged Input</p>
            <code className="text-sm text-neutral-300 font-mono">
              {'{ bookId, format, title }'}
            </code>
          </div>
        </div>

        {/* Code example */}
        <div className="max-w-2xl mx-auto">
          <CodeCard filename="books.wiring.ts" icon={<HttpIcon size={15} />}>
            <CodeBlock language="typescript">{dataFlowCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Callout */}
        <div className="max-w-2xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <span className="text-yellow-400 text-lg mt-0.5">⚠</span>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Same key in multiple sources with different values?</span>{' '}
            Pikku throws a validation error — no silent overwrites.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. AUTH & PERMISSIONS
   ───────────────────────────────────────────── */

const authCode = `// Public route — no auth required
wireHTTP({
  method: 'get',
  route: '/books',
  func: listBooks,
  auth: false
})

// Protected with permissions
wireHTTP({
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,
  permissions: {
    admin: isAdmin
  }
})

// Global route-level permission
addHTTPPermission(
  '/admin/*',
  { admin: isAdmin }
)`;

function AuthSection() {
  const features = [
    {
      icon: <Globe className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Per-route auth control',
      desc: 'Set auth: false on public routes. Everything else requires a valid session by default.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Permission guards',
      desc: 'Attach permission checks to individual routes. Pikku rejects unauthorized requests before your function runs.',
    },
    {
      icon: <Lock className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Global policies',
      desc: 'Use addHTTPPermission to apply rules to entire path prefixes — every route under /admin requires admin access.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Auth & Permissions</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Auth and permissions, <span className="text-green-400">everywhere</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every HTTP route inherits Pikku's auth system. Override per-route or apply globally.
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

          {/* Right: code */}
          <CodeCard filename="books.wiring.ts" icon={<HttpIcon size={15} />}>
            <CodeBlock language="typescript">{authCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. MIDDLEWARE
   ───────────────────────────────────────────── */

const middlewareCode = `import { cors, authBearer } from '@pikku/core/middleware'

// Global: CORS + bearer auth on every route
addHTTPMiddleware('*', [
  cors({ origin: 'https://app.example.com', credentials: true }),
  authBearer()
])

// Prefix: rate limiting on API routes only
addHTTPMiddleware('/api/*', [
  rateLimit({ maxRequests: 100, windowMs: 60_000 })
])

// Per-route: audit logging on a single wire
wireHTTP({
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,
  middleware: [auditLog]
})`;

function MiddlewareSection() {
  const levels = [
    {
      icon: <Globe className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Global',
      desc: 'addHTTPMiddleware(\'*\', [...]) — runs on every HTTP request. CORS, logging, auth.',
      tag: '*',
    },
    {
      icon: <FolderTree className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Prefix-based',
      desc: 'addHTTPMiddleware(\'/api/*\', [...]) — scoped to a path prefix. Rate limiting, admin guards.',
      tag: '/prefix',
    },
    {
      icon: <Layers className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />,
      title: 'Per-route',
      desc: 'middleware: [...] on a single wireHTTP call. Audit trails, special validation.',
      tag: 'route',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Middleware</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Hooks at <span className="text-green-400">every level</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Apply middleware globally, by path prefix, or on individual routes. They run in onion order — outer middleware wraps inner.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Left: level cards */}
          <div className="space-y-5">
            {levels.map((lvl, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {lvl.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-white">{lvl.title}</h3>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{lvl.tag}</span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{lvl.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Built-in middleware callout */}
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4">
              <p className="text-sm text-neutral-400">
                <span className="text-white font-semibold">Built-in middleware:</span>{' '}
                <code className="text-green-400 text-xs">cors</code>,{' '}
                <code className="text-green-400 text-xs">authBearer</code>,{' '}
                <code className="text-green-400 text-xs">authCookie</code>,{' '}
                <code className="text-green-400 text-xs">authAPIKey</code>{' '}
                — all from <code className="text-neutral-500 text-xs">@pikku/core/middleware</code>.
              </p>
            </div>
          </div>

          {/* Right: code */}
          <CodeCard filename="middleware.ts" icon={<HttpIcon size={15} />}>
            <CodeBlock language="typescript">{middlewareCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. ROUTE GROUPS — defineHTTPRoutes / wireHTTPRoutes
   ───────────────────────────────────────────── */

const routeGroupsCode = `import { defineHTTPRoutes, wireHTTPRoutes } from '.pikku/pikku-types.gen.js'

const booksRoutes = defineHTTPRoutes({
  tags: ['books'],
  routes: {
    list:   { method: 'get',    route: '/books',          func: listBooks, auth: false },
    get:    { method: 'get',    route: '/books/:bookId',  func: getBook },
    create: { method: 'post',   route: '/books',          func: createBook },
    delete: { method: 'delete', route: '/books/:bookId',  func: deleteBook },
  },
})

const todosRoutes = defineHTTPRoutes({
  auth: false,
  tags: ['todos'],
  routes: {
    list:   { method: 'get',  route: '/todos',     func: listTodos },
    create: { method: 'post', route: '/todos',     func: createTodo },
    get:    { method: 'get',  route: '/todos/:id', func: getTodo },
  },
})

// Compose everything under /api/v1
wireHTTPRoutes({
  basePath: '/api/v1',
  middleware: [cors()],
  routes: {
    books: booksRoutes,
    todos: todosRoutes,
  },
})`;

function RouteGroupsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Route Groups</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Organize routes with <span className="text-green-400">defineHTTPRoutes</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Group related routes into contracts. Compose them with shared base paths, middleware, and auth settings — then wire them all at once.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="http.wiring.ts" icon={<HttpIcon size={15} />} badge="wiring.ts">
            <CodeBlock language="typescript">{routeGroupsCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Config cascades down', desc: 'basePath, tags, and middleware from the group apply to every route inside it' },
            { label: 'Routes can override', desc: 'Set auth: false on a single route even if the group requires auth' },
            { label: 'Compose contracts', desc: 'Define route groups in separate files, import and compose them in one wireHTTPRoutes call' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[11px] font-bold mt-0.5">✓</span>
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
   7. TYPE-SAFE CLIENT — pikkuFetch
   ───────────────────────────────────────────── */

const fetchClientCode = `import { pikkuFetch } from '.pikku/pikku-fetch.gen.js'

pikkuFetch.setServerUrl('http://localhost:4002')

// Fully typed — route, input, and output are inferred
const books = await pikkuFetch.get('/api/v1/books', {})

const book = await pikkuFetch.get('/api/v1/books/:bookId', {
  bookId: '42'
})

const created = await pikkuFetch.post('/api/v1/books', {
  title: 'The Pikku Guide',
  author: 'You'
})

// Auth: set a JWT and all subsequent requests include it
pikkuFetch.setAuthorizationJWT(token)

const deleted = await pikkuFetch.delete('/api/v1/books/:bookId', {
  bookId: created.bookId
})`;

function FetchClientSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      {/* Subtle divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Type-Safe Client</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Call your API with <span className="text-green-400">full IntelliSense</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates a typed fetch client from your HTTP wirings. Every route, every input, every return type — autocompleted.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          {/* Left: code */}
          <CodeCard filename="client.ts" badge="auto-generated types">
            <CodeBlock language="typescript">{fetchClientCode}</CodeBlock>
          </CodeCard>

          {/* Right: highlights */}
          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Link2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Generated from your wirings</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Run <code className="text-green-400 text-xs">npx @pikku/cli fetch</code> and get a <code className="text-neutral-500 text-xs">PikkuFetch</code> class with typed overloads for every HTTP route you've wired.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Auth built in</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-green-400 text-xs">setAuthorizationJWT()</code>, <code className="text-green-400 text-xs">setAPIKey()</code> — set once, included on every request.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Works everywhere</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Built on the Fetch API — works in the browser, Node, Deno, Next.js server components, or anywhere that has <code className="text-neutral-500 text-xs">fetch</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. SSE — "When you need streaming, just add sse: true"
   ───────────────────────────────────────────── */

const sseWiringCode = `wireHTTP({
  method: 'get',
  route: '/todos',
  func: getTodos,
  sse: true      // ← that's it
})`;

const sseFunctionCode = `const getTodos = pikkuFunc({
  title: 'Get Todos',
  func: async ({ db, channel }, {}) => {
    const todos = await db.getTodos()

    // If client supports SSE, stream them
    if (channel) {
      for (const todo of todos) {
        channel.send({ todo })
        await sleep(100)
      }
      return
    }

    // Otherwise, return the full list
    return { todos }
  }
})`;

function SSESection() {
  const streamLines = [
    { text: 'data: { "todo": { "id": 1, "text": "Buy milk" } }', delay: 0 },
    { text: 'data: { "todo": { "id": 2, "text": "Write docs" } }', delay: 1 },
    { text: 'data: { "todo": { "id": 3, "text": "Ship feature" } }', delay: 2 },
    { text: 'data: { "todo": { "id": 4, "text": "Deploy app" } }', delay: 3 },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      {/* Orange accent gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Server-Sent Events</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            When you need streaming, just add{' '}
            <span className="text-orange-400">sse: true</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            The same route serves both regular HTTP clients and SSE clients. Non-SSE clients get a JSON response, SSE clients get a stream.
          </p>
        </div>

        {/* Dual panel: regular vs SSE response */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {/* Regular HTTP */}
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-2">
              <HttpIcon size={14} />
              <span className="text-sm font-semibold text-neutral-200">Regular HTTP Client</span>
              <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded bg-green-500/15 text-green-400">200 OK</span>
            </div>
            <div className="p-5 font-mono text-sm text-neutral-300 leading-relaxed">
              <span className="text-neutral-600">// Instant JSON response</span>
              <pre className="mt-2 text-xs whitespace-pre-wrap text-neutral-400">{`{
  "todos": [
    { "id": 1, "text": "Buy milk" },
    { "id": 2, "text": "Write docs" },
    { "id": 3, "text": "Ship feature" },
    { "id": 4, "text": "Deploy app" }
  ]
}`}</pre>
            </div>
          </div>

          {/* SSE client */}
          <div className="bg-[#0d0d0d] border border-orange-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-2">
              <SSEIcon size={14} />
              <span className="text-sm font-semibold text-neutral-200">SSE Client</span>
              <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded bg-orange-500/15 text-orange-400">streaming</span>
            </div>
            <div className="p-5 font-mono text-xs leading-relaxed">
              <span className="text-neutral-600">// Progressive streaming</span>
              <div className="mt-2 space-y-1.5">
                {streamLines.map((line, i) => (
                  <div
                    key={i}
                    className="text-orange-300/80 sse-line-appear"
                    style={{ animationDelay: `${line.delay * 0.6}s` }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="todos.wiring.ts" icon={<SSEIcon size={15} />} badge="sse: true">
            <CodeBlock language="typescript">{sseWiringCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="getTodos.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{sseFunctionCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────
   7. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-green-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring HTTP in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with HTTP wiring already configured.
        </p>

        {/* npm command with copy */}
        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-green-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-green-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-green-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/wiring/http"
            className="bg-green-500 text-white hover:bg-green-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/20"
          >
            Read the HTTP Docs
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

export default function HTTPWirePage() {
  return (
    <Layout
      title="HTTP Wire — Pikku"
      description="Turn your Pikku functions into type-safe REST endpoints with automatic input merging, OpenAPI generation, and optional SSE streaming."
    >
      <Hero />
      <main>
        <BasicsSection />
        <DataFlowSection />
        <AuthSection />
        <MiddlewareSection />
        <RouteGroupsSection />
        <FetchClientSection />
        <SSESection />
        <CTASection />
      </main>
    </Layout>
  );
}
