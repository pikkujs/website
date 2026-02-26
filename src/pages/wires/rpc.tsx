import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { RPCIcon } from '../../components/WiringIcons';
import {
  ShieldCheck, Globe, Layers,
  Copy, Check, Zap, GitBranch, Lock,
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
    <div className="wire-hero-rpc w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-blue-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-indigo-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 border border-blue-400/40 bg-blue-400/10 px-3 py-1 rounded mb-6">
            Wire Type: RPC
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Function-to-function,</span><br />
            <span className="text-blue-400">fully typed.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-blue-400 text-lg">rpc.invoke</code> lets your Pikku functions call each other — with session inheritance, depth tracking, and type-safe inputs and outputs.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/rpcs"
              className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
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

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-blue-500/40 rounded-2xl p-6">
              <RPCIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Call any function from any function"
   ───────────────────────────────────────────── */

const basicsCode = `const calculateTax = pikkuSessionlessFunc({
  title: 'Calculate Tax',
  func: async ({}, { amount, rate }) => {
    return { tax: amount * rate }
  }
})

const processOrder = pikkuFunc({
  title: 'Process Order',
  func: async ({ db }, { orderId }, { rpc }) => {
    const order = await db.getOrder(orderId)

    // Type-safe — input and output inferred
    const { tax } = await rpc.invoke('calculateTax', {
      amount: order.total,
      rate: 0.08
    })

    return { orderId, total: order.total + tax }
  }
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Call any function from <span className="text-blue-400">any function</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            <code className="text-blue-400">rpc.invoke()</code> calls another Pikku function by name — fully typed, with session inheritance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="order.functions.ts" icon={<RPCIcon size={15} />}>
            <CodeBlock language="typescript">{basicsCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Type-safe calls', desc: 'Function name, input, and output are all inferred from your wirings' },
            { label: 'Session inherited', desc: 'The caller\'s auth session propagates to the called function automatically' },
            { label: 'Depth tracked', desc: 'rpc.depth increments on each call — built-in recursion protection' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. METHODS — "Four ways to call"
   ───────────────────────────────────────────── */

const exposeCode = `// Expose a function for external RPC calls
const greet = pikkuSessionlessFunc({
  title: 'Greet',
  expose: true,  // ← makes it callable via rpc.exposed()
  func: async ({}, { name }) => {
    return { message: \`Hello, \${name}!\` }
  }
})

// Public HTTP endpoint for RPC
wireHTTP({
  route: '/rpc/:rpcName',
  method: 'post',
  auth: false,
  func: rpcCaller,
})`;

function MethodsSection() {
  const methods = [
    {
      icon: <Zap className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
      title: 'rpc.invoke(name, data)',
      desc: 'Call a function from within the same instance. Session inherited, depth tracked.',
      tag: 'internal',
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
      title: 'rpc.remote(name, data)',
      desc: 'Call a function on another instance via DeploymentService. Session forwarded securely.',
      tag: 'remote',
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
      title: 'rpc.exposed(name, data)',
      desc: 'Call any function with expose: true. Used by public HTTP RPC endpoints.',
      tag: 'exposed',
    },
    {
      icon: <GitBranch className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
      title: 'rpc.startWorkflow(name, input)',
      desc: 'Start a workflow by name and get back a runId. Integrates with the workflow engine.',
      tag: 'workflow',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>RPC Methods</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Four ways to <span className="text-blue-400">call</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Internal, remote, exposed, or workflow — every call is type-safe and session-aware.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            {methods.map((m, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {m.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-white font-mono">{m.title}</h3>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{m.tag}</span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CodeCard filename="rpc.wiring.ts" icon={<RPCIcon size={15} />} badge="expose: true">
            <CodeBlock language="typescript">{exposeCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. TYPE-SAFE CLIENT — "Typed RPC from the browser"
   ───────────────────────────────────────────── */

const clientCode = `import { pikkuRPC } from '.pikku/pikku-rpc.gen.js'

pikkuRPC.setServerUrl('http://localhost:4002')

// Fully typed — name, input, and output inferred
const result = await pikkuRPC.invoke('calculateTax', {
  amount: 100,
  rate: 0.08
})
// result.tax → number

// Auth: set a JWT for authenticated calls
pikkuRPC.setAuthorizationJWT(token)`;

function TypeSafeClientSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Type-Safe Client</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Typed RPC from <span className="text-blue-400">the browser</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates a typed RPC client from your exposed functions. Invoke functions, start workflows, or call AI agents — all autocompleted.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          <CodeCard filename="client.ts" badge="auto-generated types">
            <CodeBlock language="typescript">{clientCode}</CodeBlock>
          </CodeCard>

          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Generated from wirings</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-blue-400 text-xs">PikkuRPC</code> is auto-generated with typed overloads for every exposed function, workflow, and AI agent.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Layers className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Namespaced addons</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Call addon functions with namespace prefixes: <code className="text-blue-400 text-xs">rpc.invoke('stripe:createCharge', ...)</code>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-blue-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring RPC in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with RPC wiring already configured.
        </p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-blue-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-blue-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/rpcs" className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20">Read the RPC Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; Internal, remote &amp; exposed RPC</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function RPCWirePage() {
  return (
    <Layout title="RPC Wire — Pikku" description="Call Pikku functions from other functions with type-safe RPC — internal, remote, and exposed, with session inheritance and depth tracking.">
      <Hero />
      <main>
        <BasicsSection />
        <MethodsSection />
        <TypeSafeClientSection />
        <CTASection />
      </main>
    </Layout>
  );
}
