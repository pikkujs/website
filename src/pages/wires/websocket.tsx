import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { WebSocketIcon } from '../../components/WiringIcons';
import {
  ShieldCheck, Lock, Globe, Layers,
  Radio, Zap, Copy, Check, Send, Wifi,
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
    <div className="wire-hero-websocket w-full relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-purple-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-violet-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        {/* Left: text */}
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-400/40 bg-purple-400/10 px-3 py-1 rounded mb-6">
            Wire Type: WebSocket
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Real-time channels,</span><br />
            <span className="text-purple-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-purple-400 text-lg">wireChannel</code> gives bidirectional messaging with action routing, pub/sub, and per-message auth — all using your existing Pikku functions.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/channels"
              className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
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

        {/* Right: icon visual */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[40px]" />
              <div className="relative bg-[#0d0d0d] border-2 border-purple-500/40 rounded-2xl p-6">
                <WebSocketIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Connect, route, respond"
   ───────────────────────────────────────────── */

const basicsFunction = `const createTodo = pikkuFunc({
  title: 'Create Todo',
  description: 'Create a new todo item',
  func: async ({ db }, { text }) => {
    const todo = await db.createTodo({ text })
    return { todo }
  },
  permissions: { user: isAuthenticated }
})`;

const basicsWiring = `wireChannel({
  domain: 'todos',
  onConnect: async () => {},
  onDisconnect: async () => {},
  onMessageWiring: {
    create: { func: createTodo },
    list:   { func: listTodos, auth: false },
  }
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Connect, route, <span className="text-purple-400">respond</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Define your functions once, wire them to a channel. Pikku routes incoming messages by action name.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="createTodo.func.ts" badge="func.ts">
            <CodeBlock language="typescript">{basicsFunction}</CodeBlock>
          </CodeCard>

          <CodeCard filename="todos.channel.ts" badge="channel.ts" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{basicsWiring}</CodeBlock>
          </CodeCard>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Action-based routing', desc: 'Messages include an action key — Pikku routes to the right function automatically' },
            { label: 'Lifecycle hooks', desc: 'onConnect and onDisconnect let you set up and tear down per-connection state' },
            { label: 'Same auth system', desc: 'Permissions, sessions, and middleware work identically to HTTP wiring' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. ACTION ROUTING — "One channel, many actions"
   ───────────────────────────────────────────── */

const routingCode = `wireChannel({
  domain: 'todos',
  onConnect: async () => {},
  onDisconnect: async () => {},
  onMessageWiring: {
    auth:      { func: authenticate, auth: false },
    subscribe: { func: subscribeTodos },
    list:      { func: listTodos },
    create:    { func: createTodo },
  }
})`;

function ActionRoutingSection() {
  const steps = [
    { label: 'Client sends', code: '{ action: "create", text: "Buy milk" }', color: 'text-purple-400' },
    { label: 'Pikku routes to', code: 'createTodo({ text: "Buy milk" })', color: 'text-white' },
    { label: 'Response sent', code: '{ action: "create", todo: { ... } }', color: 'text-purple-400' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Action Routing</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One channel, <span className="text-purple-400">many actions</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every message carries an action key. Pikku strips it from the data, routes to the right function, and re-adds it to the response.
          </p>
        </div>

        {/* Visual: message flow */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{step.label}</p>
                <code className={`text-sm font-mono ${step.color}`}>{step.code}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <CodeCard filename="todos.channel.ts" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{routingCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Callout */}
        <div className="max-w-2xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <span className="text-purple-400 text-lg mt-0.5">→</span>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Routing key stripped from data.</span>{' '}
            Your function receives <code className="text-purple-400 text-xs">{'{ text: "Buy milk" }'}</code> — not the raw message. The action key is re-added to the response automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. AUTH — "Authenticate once, session everywhere"
   ───────────────────────────────────────────── */

const authCode = `const authenticate = pikkuFunc({
  title: 'Authenticate',
  func: async ({ setSession }, { token }) => {
    const session = await verifyJWT(token)
    setSession(session)
    return { success: true }
  }
})

wireChannel({
  domain: 'todos',
  onConnect: async () => {},
  onDisconnect: async () => {},
  onMessageWiring: {
    // No auth required — this is how you log in
    auth:      { func: authenticate, auth: false },
    // These require a session (default)
    subscribe: { func: subscribeTodos },
    create:    { func: createTodo },
  }
})`;

function AuthSection() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Session via setSession',
      desc: 'Call setSession() inside any action to establish an authenticated session for the connection.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Per-action auth override',
      desc: 'Set auth: false on individual actions like authenticate. Everything else requires a valid session by default.',
    },
    {
      icon: <Lock className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Auto propagation',
      desc: 'Once the session is set, every subsequent message on that connection automatically carries the session — no re-auth needed.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Auth</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Authenticate once, <span className="text-purple-400">session everywhere</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Send an auth message over the WebSocket, set the session, and every subsequent action has access to it.
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
          <CodeCard filename="todos.channel.ts" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{authCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. PUB/SUB — "Broadcast with EventHub"
   ───────────────────────────────────────────── */

const pubsubCode = `wireChannel({
  domain: 'todos',
  onConnect: async ({ eventHub, channel }) => {
    // Subscribe this connection to a topic
    eventHub.subscribe('todos:updated', (data) => {
      channel.send(data)
    })
  },
  onDisconnect: async () => {},
  onMessageWiring: {
    create: {
      func: pikkuFunc({
        title: 'Create Todo',
        func: async ({ db, eventHub }, { text }) => {
          const todo = await db.createTodo({ text })
          // Broadcast to all subscribers
          eventHub.publish('todos:updated', {
            event: 'created',
            todo
          })
          return { todo }
        }
      })
    },
  }
})`;

function PubSubSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Pub/Sub</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Broadcast with <span className="text-purple-400">EventHub</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Subscribe connections to topics on connect. When one client publishes, all subscribers receive the update in real time.
          </p>
        </div>

        {/* Visual: pub/sub flow */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Client A', action: 'subscribe("todos:updated")', role: 'subscriber' },
              { label: 'Client B', action: 'publish("todos:updated")', role: 'publisher' },
              { label: 'Client C', action: 'subscribe("todos:updated")', role: 'subscriber' },
            ].map((client, i) => (
              <div key={i} className={`bg-[#0d0d0d] border ${client.role === 'publisher' ? 'border-purple-500/40 border-2' : 'border-neutral-800'} rounded-lg p-4 text-center`}>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{client.label}</p>
                <code className={`text-xs font-mono ${client.role === 'publisher' ? 'text-purple-400' : 'text-neutral-400'}`}>{client.action}</code>
                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${client.role === 'publisher' ? 'bg-purple-500/15 text-purple-400' : 'bg-neutral-800 text-neutral-500'}`}>
                    {client.role === 'publisher' ? <Send className="w-3 h-3 inline mr-1" /> : <Radio className="w-3 h-3 inline mr-1" />}
                    {client.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="todos.channel.ts" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{pubsubCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Callout */}
        <div className="max-w-3xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <span className="text-purple-400 text-lg mt-0.5">⚡</span>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Stateful or serverless.</span>{' '}
            EventHub works in-process for stateful servers (uWebSockets.js) and backs onto PostgreSQL for serverless deployments (AWS Lambda + API Gateway).
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. TYPE-SAFE CLIENT — "Full IntelliSense on the wire"
   ───────────────────────────────────────────── */

const clientCode = `import { PikkuWebSocket } from '.pikku/pikku-websocket.gen.js'

const pikku = new PikkuWebSocket(ws)

// Get a typed route — action name is autocompleted
const todosRoute = pikku.getRoute('todos')

// Typed send — input and output inferred from your func
const result = await todosRoute.send('create', {
  text: 'Buy milk'
})

// Typed subscribe — callback payload matches publish type
todosRoute.subscribe('todos:updated', (data) => {
  console.log(data.event, data.todo)
})`;

function TypeSafeClientSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Type-Safe Client</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Full IntelliSense <span className="text-purple-400">on the wire</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates a typed WebSocket client from your channel wirings. Every action, every payload, every subscription — autocompleted.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          {/* Left: code */}
          <CodeCard filename="client.ts" badge="auto-generated types">
            <CodeBlock language="typescript">{clientCode}</CodeBlock>
          </CodeCard>

          {/* Right: highlights */}
          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Wifi className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Generated from wirings</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-purple-400 text-xs">PikkuWebSocket</code> is auto-generated with typed overloads for every channel action you've wired.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Send className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Typed send & subscribe</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-purple-400 text-xs">route.send()</code> infers input/output per action. <code className="text-purple-400 text-xs">route.subscribe()</code> types the callback payload from your EventHub events.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Works everywhere</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Built on the standard WebSocket API — works in the browser, Node, React Native, or anywhere with a WebSocket implementation.
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
   7. MIDDLEWARE
   ───────────────────────────────────────────── */

const wireMiddlewareCode = `wireChannel({
  domain: 'todos',
  onConnect: async () => {},
  onDisconnect: async () => {},
  // Channel-level — wraps every outbound channel.send()
  channelMiddleware: [rateLimit({ maxMessages: 100, windowMs: 60_000 })],
  onMessageWiring: {
    create: {
      func: createTodo,
      // Per-action wire middleware
      middleware: [auditLog]
    },
    list: { func: listTodos },
  }
})`;

const channelMiddlewareCode = `import { pikkuChannelMiddleware } from '@pikku/core'

// Channel middleware intercepts channel.send()
// Signature: (services, event, next) => void
const addTimestamp = pikkuChannelMiddleware(
  async ({ logger }, event, next) => {
    logger.info({ phase: 'before-send', event })
    // Transform the event before it reaches the client
    await next({ ...event, sentAt: Date.now() })
  }
)

// Drop events by passing null to next()
const filterSensitive = pikkuChannelMiddleware(
  async (_services, event, next) => {
    if (event.internal) return await next(null)
    await next(event)
  }
)

// Apply to channel via tag or inline
addChannelMiddleware('todos', [addTimestamp, filterSensitive])

// Or inline on the wireChannel config
wireChannel({
  domain: 'todos',
  channelMiddleware: [addTimestamp],
  // ...
})`;

function MiddlewareSection() {
  const types = [
    {
      icon: <Layers className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Wire middleware',
      desc: 'Wraps each function call. Apply per-channel or per-action — rate limiting, audit logging, validation. Same model as HTTP middleware.',
      tag: 'func',
    },
    {
      icon: <Radio className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />,
      title: 'Channel middleware',
      desc: 'Wraps channel.send() — intercepts every outbound event. Transform payloads, filter events (pass null to drop), or fan out (pass an array).',
      tag: 'send',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Middleware</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Hooks at <span className="text-purple-400">every level</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Two types of middleware: wire middleware wraps function calls, channel middleware wraps outbound messages via <code className="text-purple-400">channel.send()</code>.
          </p>
        </div>

        {/* Type cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {types.map((t, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                {t.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-white">{t.title}</h3>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{t.tag}</span>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Code examples side by side */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="todos.channel.ts" badge="wire middleware" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{wireMiddlewareCode}</CodeBlock>
          </CodeCard>

          <CodeCard filename="channel-middleware.ts" badge="channel middleware" icon={<WebSocketIcon size={15} />}>
            <CodeBlock language="typescript">{channelMiddlewareCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Callout */}
        <div className="max-w-5xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <span className="text-purple-400 text-lg mt-0.5">→</span>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Channel middleware controls what the client sees.</span>{' '}
            Pass a modified event to <code className="text-purple-400 text-xs">next()</code> to transform, <code className="text-purple-400 text-xs">null</code> to drop, or an array to fan out into multiple events. Both types run in onion order.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. DEPLOY — "Stateful or serverless"
   ───────────────────────────────────────────── */

function DeploySection() {
  const modes = [
    {
      title: 'Stateful',
      runtime: 'uWebSockets.js',
      desc: 'In-process EventHub, persistent connections. Best for low-latency real-time apps.',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
    },
    {
      title: 'Serverless',
      runtime: 'AWS Lambda + API Gateway',
      desc: 'PostgreSQL-backed EventHub, managed WebSocket API. Best for scale-to-zero workloads.',
      border: 'border-neutral-700',
      bg: 'bg-neutral-900/50',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Deploy</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Stateful or <span className="text-purple-400">serverless</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            The same wireChannel code runs on both. Your functions don't change — only the runtime does.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {modes.map((mode, i) => (
            <div key={i} className={`${mode.bg} border ${mode.border} rounded-xl p-6 text-center`}>
              <h3 className="text-lg font-bold text-white mb-1">{mode.title}</h3>
              <p className="text-sm font-mono text-purple-400 mb-3">{mode.runtime}</p>
              <p className="text-sm text-neutral-400 leading-relaxed">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-purple-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring WebSockets in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with WebSocket wiring already configured.
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
            to="/docs/wiring/channels"
            className="bg-purple-500 text-white hover:bg-purple-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            Read the WebSocket Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Works with uWebSockets.js, AWS Lambda &amp; API Gateway
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function WebSocketWirePage() {
  return (
    <Layout
      title="WebSocket Wire — Pikku"
      description="Wire your Pikku functions to WebSocket channels with action routing, pub/sub via EventHub, per-message auth, and a type-safe client."
    >
      <Hero />
      <main>
        <BasicsSection />
        <ActionRoutingSection />
        <AuthSection />
        <PubSubSection />
        <TypeSafeClientSection />
        <MiddlewareSection />
        <DeploySection />
        <CTASection />
      </main>
    </Layout>
  );
}
