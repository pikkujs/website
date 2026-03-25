import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { ArrowRight, Shield, Zap, Eye } from 'lucide-react';

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 no-underline hover:bg-white/[0.08] transition mb-6">
          Pikku Fabric use case
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
          WebSockets + SSE with
          <br />
          <span className="text-violet-400">types and auth.</span>
        </h1>
        <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          WebSocket channels and Server-Sent Events built from the same typed
          functions as your API. Typed messages, session context, and auth —
          no separate realtime server.
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

function Problem() {
  return (
    <section className="py-16 lg:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-lg text-white/50 leading-relaxed">
          You need realtime updates — live notifications, collaborative editing,
          streaming data. So you add Socket.io for WebSockets or a custom SSE
          endpoint. Now you have two servers, two auth systems, and message
          types that are strings you parse with <code className="text-white/40">JSON.parse</code> and hope for the best.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Same functions. Now realtime.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400/60">You write this</p>
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[13px] [&_pre]:!overflow-x-auto">
                <CodeBlock language="typescript">{`// Functions — same as your API
const getMessages = pikkuFunc({
  input: z.object({ channelId: z.string() }),
  output: z.array(MessageSchema),
  func: async ({ db }, { channelId }) =>
    db.messages.list({ channelId }),
  permissions: { user: isChannelMember },
})

const sendMessage = pikkuFunc({
  input: z.object({ channelId: z.string(), text: z.string() }),
  output: MessageSchema,
  func: async ({ db }, data) =>
    db.messages.create(data),
  permissions: { user: isChannelMember },
})

// Wire to WebSocket
wireChannel({
  channel: 'chat',
  route: '/chat',
  onConnect: getMessages,
  onMessage: { sendMessage },
})

// Wire to SSE (one-way streaming)
wireSSE({ route: '/messages/stream', func: getMessages })

// Same functions also work as HTTP
wireHTTP({ method: 'get', route: '/messages/:channelId', func: getMessages })
wireHTTP({ method: 'post', route: '/messages', func: sendMessage })`}</CodeBlock>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">What Fabric gives you</p>
            <div className="space-y-3">
              {[
                { icon: <Zap className="w-4 h-4" />, title: 'Typed messages', desc: 'Input and output schemas validated on both sides. No JSON.parse guessing.' },
                { icon: <Shield className="w-4 h-4" />, title: 'Session auth', desc: 'WebSocket connections authenticated with the same session as your HTTP API.' },
                { icon: <Eye className="w-4 h-4" />, title: 'Observable', desc: 'Connection counts, message rates, errors — same dashboard as everything else.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <div className="flex-shrink-0 mt-0.5 text-violet-400/60">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{item.title}</p>
                    <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-3 text-xs text-white/20 font-mono">client (auto-generated)</span>
              </div>
              <div className="p-4 font-mono text-[12px] leading-6">
                <div className="text-white/30">// Type-safe WebSocket client</div>
                <div className="text-violet-400/70">const channel = client.chat.connect()</div>
                <div className="text-white/30">channel.on('sendMessage', (msg) =&gt; {'{'}</div>
                <div className="text-white/20">  // msg is typed as Message</div>
                <div className="text-white/30">{'}'})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/4 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Realtime without a second codebase.
        </h2>
        <p className="mt-4 text-base text-white/40">Same functions. Now over WebSocket. Deploy.</p>
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

export default function RealtimePage() {
  return (
    <Layout
      title="Realtime — Pikku Fabric"
      description="WebSocket channels and Server-Sent Events built from typed functions. Same auth, same validation, typed messages. No separate realtime server."
    >
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <CTA />
      </main>
    </Layout>
  );
}
