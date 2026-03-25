import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  ArrowRight, MessageSquare, Terminal, Plug, Lock,
  Bot, ClipboardList, Cpu, DollarSign,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. HERO
   ════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          Give your API
          <br />
          <span className="text-primary">a brain.</span>
        </h1>

        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Turn any API into a chat assistant, CLI tools, and an MCP server
          your customers can use right away. No rebuilding required.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/#waitlist" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
            Get early access <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="#how-it-works" className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. PROBLEM
   ════════════════════════════════════════════════════════════════ */

function Problem() {
  return (
    <section className="py-16 lg:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-lg text-white/50 leading-relaxed">
          You've invested years building your API. Adding AI shouldn't mean
          starting over. Most of your API's power is locked behind UIs only
          power users navigate.
          <span className="text-white/70"> Give every customer a way in.</span>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. WHAT YOU GET — three interfaces
   ════════════════════════════════════════════════════════════════ */

function WhatYouGet() {
  const interfaces = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      step: 'Chat assistant',
      title: 'Your customers ask questions. Your API answers them.',
      desc: 'The agent maps natural language to the right endpoints automatically. No docs for your users to read, no tickets for your team to answer.',
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      step: 'CLI tools',
      title: 'Power users get CLI tools they can script and chain.',
      desc: 'Every API capability becomes a command. Pipe it, chain it, build workflows. Works with local AI agents and MCP clients too.',
    },
    {
      icon: <Plug className="w-5 h-5" />,
      step: 'Platform integration',
      title: 'Your product works inside ChatGPT, Claude, Cursor, and more.',
      desc: 'It becomes a native tool in the AI platforms your customers already use. No custom integration work on your end.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Three interfaces from one API spec.
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-lg mx-auto">
            Connect your OpenAPI spec. Pick your interfaces. Ship.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {interfaces.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-6 transition-all hover:bg-white/[0.04]">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary mb-4">
                {item.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">{item.step}</p>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. HOW IT WORKS — the flow
   ════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            From OpenAPI spec to working agent.
          </h2>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="grid gap-6 lg:grid-cols-[140px_1fr] items-start">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">1</span>
              <div>
                <p className="text-sm font-bold text-white">Connect your API</p>
                <p className="text-xs text-white/30">Point it at your spec</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="bash">{`$ pikku agent init --spec https://api.acme.dev/openapi.json

  ✓ Parsed 42 endpoints
  ✓ Generated function types
  ✓ Created agent project

  Next: pikku deploy`}</CodeBlock>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid gap-6 lg:grid-cols-[140px_1fr] items-start">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">2</span>
              <div>
                <p className="text-sm font-bold text-white">Pick your interfaces</p>
                <p className="text-xs text-white/30">Chat, CLI, MCP — any combo</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`// Your API endpoints become agent tools automatically
const agent = pikkuAIAgent({
  name: 'acme-assistant',
  instructions: 'Help users manage their account',
  tools: [getDeployments, createIncident, getCloudSpend, ...],
})

// Expose as chat, CLI, and MCP
wireChannel({ channel: 'support', agent })
wireCLI({ program: 'acme', agent })
wireMCP({ agent })`}</CodeBlock>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid gap-6 lg:grid-cols-[140px_1fr] items-start">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">3</span>
              <div>
                <p className="text-sm font-bold text-white">Ship it</p>
                <p className="text-xs text-white/30">Deploy to Fabric</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <div className="p-5 font-mono text-[13px] leading-7">
                <div className="text-white">$ pikku deploy</div>
                <div className="mt-2 text-emerald-400">  ✓ Chat assistant   <span className="text-white/25">wss://chat.acme.dev</span></div>
                <div className="text-emerald-400">  ✓ CLI published    <span className="text-white/25">npx @acme/cli</span></div>
                <div className="text-emerald-400">  ✓ MCP server       <span className="text-white/25">mcp://acme.dev</span></div>
                <div className="text-emerald-400">  ✓ 42 tools active  <span className="text-white/25">from your OpenAPI spec</span></div>
                <div className="mt-2 text-white font-semibold">  Live in 4.2s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. COST + TRUST
   ════════════════════════════════════════════════════════════════ */

function CostAndTrust() {
  return (
    <section className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Cost */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
              One AI call per workflow. Zero tokens after that.
            </h2>
            <p className="text-sm text-white/45 leading-relaxed mb-6">
              The AI figures out your workflow once and turns it into a
              deterministic execution plan. Every run after that is native code.
              No model calls, no token costs, no latency variance.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-4">
                <p className="text-xs text-red-400/60 font-semibold uppercase tracking-widest mb-1">LLM on every request</p>
                <p className="text-2xl font-bold text-red-400/80">~$14,400<span className="text-sm font-normal text-red-400/40">/yr</span></p>
                <p className="text-xs text-white/25 mt-1">8-step workflow, 50x/day</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                <p className="text-xs text-emerald-400/60 font-semibold uppercase tracking-widest mb-1">Pikku (AI designs once)</p>
                <p className="text-2xl font-bold text-emerald-400">~$1.20<span className="text-sm font-normal text-emerald-400/50">/yr</span></p>
                <p className="text-xs text-white/25 mt-1">Same workflow, native execution</p>
              </div>
            </div>
          </div>

          {/* Trust */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
              Your API's rules still apply.
            </h2>

            <div className="space-y-4">
              {[
                { icon: <Lock className="w-4 h-4" />, title: 'Permissions carry over', desc: 'Your API\'s auth layer stays in the loop. The agent can only do what the user could already do.' },
                { icon: <Bot className="w-4 h-4" />, title: 'AI can\'t go rogue', desc: 'It designs the workflow. It doesn\'t execute it. Your existing permissions enforce every request.' },
                { icon: <ClipboardList className="w-4 h-4" />, title: 'Full audit trail', desc: 'Every conversation, workflow, and execution is logged.' },
                { icon: <Cpu className="w-4 h-4" />, title: 'Deterministic execution', desc: 'Approved workflows produce the same result every time. No temperature, no variance.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{item.title}</p>
                    <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
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

/* ════════════════════════════════════════════════════════════════
   6. CTA
   ════════════════════════════════════════════════════════════════ */

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          You built the API.<br />Let your customers use all of it.
        </h2>
        <p className="mt-4 text-base text-white/40 max-w-md mx-auto">
          Upload your OpenAPI spec. Get a chat assistant, CLI tools, and MCP
          server — deployed on Pikku Fabric.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/#waitlist" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 no-underline">
            Get early access <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/" className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 no-underline">
            Learn about Fabric
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */

export default function ApiAgentsPage() {
  return (
    <Layout
      title="Give Your API a Brain — Pikku Fabric"
      description="Turn any API into a chat assistant, CLI tools, and an MCP server. No rebuilding. Deploy on Pikku Fabric with your existing auth, permissions, and API spec."
    >
      <Hero />
      <main>
        <Problem />
        <WhatYouGet />
        <HowItWorks />
        <CostAndTrust />
        <CTA />
      </main>
    </Layout>
  );
}
