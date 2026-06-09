import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Shield, Lock, KeyRound, UserCheck, Layers, Copy, Check, ShieldCheck, Cookie, Key, Scan } from 'lucide-react';
import { PaperPage, CodeCard } from '../../components/PaperLayout';
import styles from './security.module.css';

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

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Core Concept</span>
          <h1 className={styles.h1}>One session API.<br /><em>Every transport.</em></h1>
          <p className={styles.lead}>
            Sessions, permissions, and auth middleware work the same across HTTP, WebSocket, CLI, MCP, and every other wire. Write your security logic once.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/core-features/user-sessions" className={styles.btnPrimary}>Read the Docs</Link>
            <a href="#sessions" className={styles.btnGhost}>See How It Works</a>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'// Same API everywhere'}</span><br />
          <span className={styles.hcKw}>async</span>{' ('}<br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcVar1}>db</span>{' }'}</span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'// services'}</span><br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcVar2}>bookId</span>{' }'}</span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'// data'}</span><br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcVar3}>session</span>{', '}<span className={styles.hcVar3}>setSession</span>{' }'}</span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'// wire'}</span><br />
          {') => { ... }'}<br /><br />
          <span className={styles.hcComment}>{'// HTTP cookie, WebSocket token,'}</span><br />
          <span className={styles.hcComment}>{"// CLI auth, MCP — doesn't matter"}</span>
        </div>
      </div>
    </div>
  );
}

function SessionSection() {
  const lifecycle = [
    { step: 'Middleware loads', desc: 'Session populated from cookie, bearer token, or connection state' },
    { step: 'Function reads', desc: 'Access session via the wire parameter — userId, role, etc.' },
    { step: 'Function modifies', desc: 'Call setSession() or clearSession() to update' },
    { step: 'Middleware persists', desc: 'Changes saved back to the transport — cookie, store, etc.' },
  ];

  return (
    <section id="sessions" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Sessions</div>
          <h2 className={styles.h2}>Read, write, clear. <em>That's the API.</em></h2>
          <p className={styles.lead}>Whether the request arrives over HTTP, WebSocket, or CLI — your function reads and writes the session the same way.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {lifecycle.map((item, i) => (
            <div key={i} className={styles.card} style={{ position: 'relative' }}>
              <span className={styles.stepBadge} style={{ marginBottom: 12 }}>{i + 1}</span>
              <div className={styles.cardTitle}>{item.step}</div>
              <p className={styles.cardBody}>{item.desc}</p>
              {i < lifecycle.length - 1 && (
                <div style={{ display: 'none' }}>→</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <CodeCard filename="login.func.ts" badge="setSession" icon={<Lock size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{loginCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="getProfile.func.ts" badge="session" icon={<UserCheck size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{getProfileCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="logout.func.ts" badge="clearSession" icon={<KeyRound size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{logoutCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

function PermissionsSection() {
  const explainers = [
    { icon: <ShieldCheck size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'pikkuAuth', desc: 'Session-only — receives (services, session). Use for authentication gates, role checks, MCP tools, and AI agents.' },
    { icon: <Shield size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'pikkuPermission', desc: 'Data-aware — receives (services, data, wire). Use when authorization depends on request data, e.g. ownership or access checks.' },
    { icon: <Layers size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'OR / AND composition', desc: 'Each key in the permissions object is an OR group. Wrap in an array for AND logic. If any group passes, the request proceeds.' },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Permissions</div>
          <h2 className={styles.h2}>Boolean checks. <em>Composable logic.</em></h2>
          <p className={styles.lead}>
            Permissions run before your function. Return <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>true</code> to allow,{' '}
            <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>false</code> to reject. Group them with OR/AND logic.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CodeCard filename="auth.ts" badge="pikkuAuth" icon={<ShieldCheck size={13} style={{ color: '#c2410c' }} />}>
              <CodeBlock language="typescript">{authCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="permissions.ts" badge="pikkuPermission" icon={<Shield size={13} style={{ color: '#c2410c' }} />}>
              <CodeBlock language="typescript">{permissionCode}</CodeBlock>
            </CodeCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CodeCard filename="deleteBook.func.ts" badge="func.ts" icon={<Lock size={13} style={{ color: '#c2410c' }} />}>
              <CodeBlock language="typescript">{usageCode}</CodeBlock>
            </CodeCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {explainers.map((e, i) => (
                <div key={i} className={styles.card}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {e.icon}
                    <div>
                      <div className={styles.cardTitle}>{e.title}</div>
                      <p className={styles.cardBody}>{e.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiddlewareSection() {
  const strategies = [
    { icon: <Key size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'authBearer', desc: 'JWT from the Authorization header. Decodes and sets session automatically.' },
    { icon: <Cookie size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'authCookie', desc: 'JWT-encoded cookie. Auto-refreshes on session change. Configurable expiry and options.' },
    { icon: <Scan size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'authAPIKey', desc: 'Reads x-api-key header or apiKey query param. Decodes as JWT to set session.' },
  ];

  const scopes = [
    { label: 'Global', desc: 'Applies to all wirings of a type' },
    { label: 'Prefix', desc: 'Route-pattern matching like /admin/*' },
    { label: 'Tag', desc: 'Any wiring tagged with a keyword' },
    { label: 'Inline', desc: 'Directly on a single wiring' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Auth Middleware</div>
          <h2 className={styles.h2}>Built-in strategies. <em>Four scopes.</em></h2>
          <p className={styles.lead}>Bearer tokens, cookies, and API keys ship out of the box. Apply middleware globally, by route prefix, by tag, or per-wiring.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {strategies.map((s, i) => (
            <div key={i} className={styles.card} style={{ borderTopWidth: 3, borderTopColor: '#2f6f4e' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                {s.icon}
                <div className={styles.cardTitle} style={{ margin: 0 }}>{s.title}</div>
              </div>
              <p className={styles.cardBody}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          <CodeCard filename="middleware.ts" badge="built-in" icon={<Shield size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{middlewareCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="scopes.ts" badge="4 levels" icon={<Layers size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{scopeCode}</CodeBlock>
          </CodeCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {scopes.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontSize: 10, fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1814', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#9a9387' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard.writeText('npm create pikku@latest'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Secure by default.</h2>
        <p className={styles.lead} style={{ marginBottom: 28 }}>
          Scaffold a project with auth middleware pre-configured. Sessions work across every protocol from day one.
        </p>
        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npm create pikku@latest
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/user-sessions" className={styles.btnPrimary}>Session Docs</Link>
          <Link to="/docs/core-features/permission-guards" className={styles.btnGhost}>Permission Docs</Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: '#9a9387' }}>MIT Licensed · Works with Express, Fastify, Lambda &amp; Cloudflare</p>
      </div>
    </section>
  );
}

export default function SecurityPage() {
  return (
    <Layout
      title="Sessions & Permissions — One Security API, Every Transport"
      description="Pikku sessions, permissions, and auth middleware work the same across HTTP, WebSocket, CLI, MCP, and every protocol. Write your security logic once."
    >
      <PaperPage>
        <Hero />
        <main>
          <SessionSection />
          <PermissionsSection />
          <MiddlewareSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
