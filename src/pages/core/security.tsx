import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Shield, Lock, KeyRound, UserCheck, Layers,
  Copy, Check, ShieldCheck, Cookie, Key, Scan,
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
    <div className="wire-hero-security w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-green-500/10 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-emerald-400/6 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-400 border border-green-400/40 bg-green-400/10 px-3 py-1 rounded mb-6">
            Core Concept
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">One session API.</span><br />
            <span className="text-green-400">Every transport.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Sessions, permissions, and auth middleware work the same across HTTP, WebSocket, CLI, MCP, and every other wire. Write your security logic once.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/core-features/user-sessions"
              className="bg-green-500 text-black hover:bg-green-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-green-500/20"
            >
              Read the Docs
            </Link>
            <a
              href="#sessions"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: visual — session lifecycle */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-green-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Same API everywhere</span><br />
            <span className="text-purple-400">async</span>{' '}
            <span className="text-white">(</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-yellow-300">db</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// services</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-cyan-300">bookId</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// data</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-green-300">session</span>{', '}<span className="text-green-300">setSession</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// wire</span><br />
            <span className="text-white">{') => { ... }'}</span><br /><br />
            <span className="text-neutral-500">// HTTP cookie, WebSocket token,</span><br />
            <span className="text-neutral-500">// CLI auth, MCP — doesn't matter</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. SESSION LIFECYCLE
   ───────────────────────────────────────────── */

const loginCode = `export const login = pikkuFunc({
  auth: false,
  func: async (
    { jwt, db },
    { email, password },
    { setSession }
  ) => {
    const user = await db.verifyCredentials(email, password)

    // Works the same whether it's an HTTP cookie,
    // WebSocket connection, or CLI token
    setSession({ userId: user.id, role: user.role })

    return { token: jwt.sign({ userId: user.id }) }
  }
})`;

const getProfileCode = `export const getProfile = pikkuFunc({
  func: async ({ db }, _data, { session }) => {
    // session is loaded by middleware before
    // your function runs — same API everywhere
    return await db.getUser(session.userId)
  }
})`;

const logoutCode = `export const logout = pikkuFunc({
  func: async ({}, _data, { clearSession }) => {
    clearSession()
  }
})`;

function SessionSection() {
  const lifecycle = [
    { step: 'Middleware loads', desc: 'Session populated from cookie, bearer token, or connection state' },
    { step: 'Function reads', desc: 'Access session via the wire parameter — userId, role, etc.' },
    { step: 'Function modifies', desc: 'Call setSession() or clearSession() to update' },
    { step: 'Middleware persists', desc: 'Changes saved back to the transport — cookie, store, etc.' },
  ];

  return (
    <section id="sessions" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Sessions</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Read, write, clear. <span className="text-green-400">That's the API.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Whether the request arrives over HTTP, WebSocket, or CLI — your function reads and writes the session the same way.
          </p>
        </div>

        {/* Lifecycle steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {lifecycle.map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 text-center relative">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold mb-3">{i + 1}</span>
              <p className="text-sm font-semibold text-white mb-1">{item.step}</p>
              <p className="text-xs text-neutral-500">{item.desc}</p>
              {i < lifecycle.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-neutral-700 text-lg">&rarr;</div>
              )}
            </div>
          ))}
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="login.func.ts" badge="setSession" icon={<Lock className="w-4 h-4 text-green-400" />}>
            <CodeBlock language="typescript">{loginCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="getProfile.func.ts" badge="session" icon={<UserCheck className="w-4 h-4 text-green-400" />}>
            <CodeBlock language="typescript">{getProfileCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="logout.func.ts" badge="clearSession" icon={<KeyRound className="w-4 h-4 text-green-400" />}>
            <CodeBlock language="typescript">{logoutCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. PERMISSIONS
   ───────────────────────────────────────────── */

const authCode = `import { pikkuAuth } from '#pikku'

// Session-only checks — receives (services, session)
// Use for authentication gates, role checks, MCP tools, AI agents
export const isAuthenticated = pikkuAuth(
  async (_services, session) => !!session
)

export const isAdmin = pikkuAuth(
  async (_services, session) => session?.role === 'admin'
)`;

const permissionCode = `import { pikkuPermission } from '#pikku'

// Data-aware checks — receives (services, data, wire)
// Use when authorization depends on the actual request data
export const isOwner = pikkuPermission(
  async ({ db }, { bookId }, { session }) => {
    const book = await db.getBook(bookId)
    return book?.authorId === session?.userId
  }
)

export const hasBookAccess = pikkuPermission(
  async ({ db }, { bookId }, { session }) => {
    return await db.hasAccess(session?.userId, bookId)
  }
)`;

const usageCode = `export const deleteBook = pikkuFunc({
  func: async ({ db }, { bookId }) => {
    await db.deleteBook(bookId)
  },
  // OR logic across keys, AND within arrays
  permissions: {
    admin: isAdmin,                // OR: admins can delete
    owner: isOwner,                // OR: book author can delete
    reviewer: [isAuthenticated, hasBookAccess]  // AND: both must pass
  }
})`;

function PermissionsSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Permissions</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Boolean checks. <span className="text-green-400">Composable logic.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Permissions run before your function. Return <code className="text-green-400 text-base">true</code> to allow,{' '}
            <code className="text-green-400 text-base">false</code> to reject. Group them with OR/AND logic.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Left: auth first, then permissions */}
          <div className="space-y-6">
            <CodeCard filename="auth.ts" badge="pikkuAuth" icon={<ShieldCheck className="w-4 h-4 text-green-400" />}>
              <CodeBlock language="typescript">{authCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="permissions.ts" badge="pikkuPermission" icon={<Shield className="w-4 h-4 text-green-400" />}>
              <CodeBlock language="typescript">{permissionCode}</CodeBlock>
            </CodeCard>
          </div>

          {/* Right: usage + explanation */}
          <div className="space-y-6">
            <CodeCard filename="deleteBook.func.ts" badge="func.ts" icon={<Lock className="w-4 h-4 text-green-400" />}>
              <CodeBlock language="typescript">{usageCode}</CodeBlock>
            </CodeCard>

            <div className="space-y-4">
              <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">pikkuAuth</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Session-only — receives <code className="text-green-400 text-xs">(services, session)</code>. Use for authentication gates, role checks, MCP tools, and AI agents.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">pikkuPermission</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Data-aware — receives <code className="text-green-400 text-xs">(services, data, wire)</code>. Use when authorization depends on request data, e.g. ownership or access checks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <Layers className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">OR / AND composition</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Each key in the permissions object is an OR group. Wrap in an array for AND logic. If <em>any</em> group passes, the request proceeds.
                    </p>
                  </div>
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
   4. AUTH MIDDLEWARE
   ───────────────────────────────────────────── */

const middlewareCode = `import { authBearer, authCookie, authAPIKey } from '@pikku/core/middleware'
import { addHTTPMiddleware, addHTTPPermission } from '#pikku'

// JWT bearer token — reads Authorization header
addHTTPMiddleware([authBearer()])

// Cookie-based sessions — auto-refreshes JWT
addHTTPMiddleware([
  authCookie({
    name: 'session',
    expiresIn: { value: 30, unit: 'day' },
    options: { httpOnly: true, secure: true },
  })
])

// API key — from x-api-key header or ?apiKey= query
addHTTPMiddleware([authAPIKey({ source: 'all' })])`;

const scopeCode = `// Global: all HTTP routes
addHTTPMiddleware('*', [authBearer()])

// Prefix-based: only /admin/* routes
addHTTPMiddleware('/admin/*', [auditLog])
addHTTPPermission('/admin/*', { admin: requireAdmin })

// Tag-based: applies to any wiring with 'api' tag
addMiddleware('api', [rateLimiter])
addPermission('api', { auth: requireAuth })

// Inline: per-wiring
wireHTTP({
  route: '/books/:id',
  func: getBook,
  middleware: [cacheControl],
  permissions: { owner: requireOwnership },
})`;

function MiddlewareSection() {
  const strategies = [
    {
      icon: <Key className="w-5 h-5 text-green-400" />,
      title: 'authBearer',
      desc: 'JWT from the Authorization header. Decodes and sets session automatically.',
    },
    {
      icon: <Cookie className="w-5 h-5 text-green-400" />,
      title: 'authCookie',
      desc: 'JWT-encoded cookie. Auto-refreshes on session change. Configurable expiry and options.',
    },
    {
      icon: <Scan className="w-5 h-5 text-green-400" />,
      title: 'authAPIKey',
      desc: 'Reads x-api-key header or apiKey query param. Decodes as JWT to set session.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Auth Middleware</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Built-in strategies. <span className="text-green-400">Four scopes.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Bearer tokens, cookies, and API keys ship out of the box. Apply middleware globally, by route prefix, by tag, or per-wiring.
          </p>
        </div>

        {/* Strategy cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
          {strategies.map((s, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-green-500 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                {s.icon}
                <h3 className="text-base font-bold text-white">{s.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="middleware.ts" badge="built-in" icon={<Shield className="w-4 h-4 text-green-400" />}>
            <CodeBlock language="typescript">{middlewareCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="scopes.ts" badge="4 levels" icon={<Layers className="w-4 h-4 text-green-400" />}>
            <CodeBlock language="typescript">{scopeCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Four scopes highlight */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Global', desc: 'Applies to all wirings of a type' },
            { label: 'Prefix', desc: 'Route-pattern matching like /admin/*' },
            { label: 'Tag', desc: 'Any wiring tagged with a keyword' },
            { label: 'Inline', desc: 'Directly on a single wiring' },
          ].map((scope, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[11px] font-bold mt-0.5">{i + 1}</span>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{scope.label}</p>
                <p className="text-xs text-neutral-500">{scope.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. CTA
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
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-green-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Secure by default
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Scaffold a project with auth middleware pre-configured. Sessions work across every protocol from day one.
        </p>

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
            to="/docs/core-features/user-sessions"
            className="bg-green-500 text-black hover:bg-green-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/20"
          >
            Session Docs
          </Link>
          <Link
            to="/docs/core-features/permission-guards"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Permission Docs
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

export default function SecurityPage() {
  return (
    <Layout
      title="Sessions & Permissions — One Security API, Every Transport"
      description="Pikku sessions, permissions, and auth middleware work the same across HTTP, WebSocket, CLI, MCP, and every protocol. Write your security logic once."
    >
      <Hero />
      <main>
        <SessionSection />
        <PermissionsSection />
        <MiddlewareSection />
        <CTASection />
      </main>
    </Layout>
  );
}
