import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { GatewayIcon } from '../../components/WiringIcons';
import {
  Webhook, MessageSquare, Radio, Layers, ShieldCheck, Plug,
  Copy, Check,
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
    <div className="wire-hero-gateway w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-rose-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-pink-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-400 border border-rose-400/40 bg-rose-400/10 px-3 py-1 rounded">
              Wire Type: Gateway
            </span>
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-green-300/70 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              New
            </span>
          </div>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Every platform,</span><br />
            <span className="text-rose-400">one handler.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-rose-400 text-lg">wireGateway</code> connects your Pikku functions to WhatsApp, Slack, Telegram, and any messaging platform — with normalized messages, auto-verification, and the same middleware you already use.
          </p>
          <div className="flex flex-row gap-4">
            <Link to="/docs/wiring/gateway" className="bg-rose-500 text-white hover:bg-rose-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-rose-500/20">Get Started</Link>
            <a href="#basics" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">See the Code</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-rose-500/40 rounded-2xl p-6">
              <GatewayIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Wire a gateway"
   ───────────────────────────────────────────── */

const wiringCode = `wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})`;

const handlerCode = `const handleMessage = pikkuFunc({
  func: async ({ db, logger, gateway }, { senderId, text }) => {
    logger.info(\`Message from \${senderId}: \${text}\`)
    await db.saveMessage(senderId, text)
    return { text: \`Got it! You said: \${text}\` }
  }
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Wire a <span className="text-rose-400">gateway</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Pick a platform adapter, point it at your function. Messages arrive normalized — your handler never knows which platform sent them.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="gateway.wiring.ts" badge="wireGateway" icon={<GatewayIcon size={15} />}>
            <CodeBlock language="typescript">{wiringCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="gateway.functions.ts" badge="handler" icon={<GatewayIcon size={15} />}>
            <CodeBlock language="typescript">{handlerCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Normalized messages', desc: 'Every platform delivers the same GatewayInboundMessage — senderId, text, attachments' },
            { label: 'Auto-send responses', desc: 'Return an outbound message and Pikku sends it via the adapter automatically' },
            { label: 'Same middleware', desc: 'Auth, permissions, rate limiting — everything you already use carries over' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-[11px] font-bold mt-0.5">&#10003;</span>
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
   3. TRANSPORT TYPES
   ───────────────────────────────────────────── */

function TransportTypesSection() {
  const transports = [
    {
      icon: <Webhook className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Webhook',
      desc: 'Platform POSTs to you. Auto-registers POST and GET routes. Handles verification challenges (WhatsApp, Slack, Telegram).',
      code: `wireGateway({
  name: 'slack',
  type: 'webhook',
  route: '/webhooks/slack',
  adapter: slackAdapter,
  func: handleMessage,
})`,
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'WebSocket',
      desc: 'Client connects via WebSocket. Uses Pikku\'s Channel wiring internally. Ideal for web chat widgets.',
      code: `wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage,
})`,
    },
    {
      icon: <Radio className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Listener',
      desc: 'Standalone event loop with no HTTP routes. For platforms that need a persistent connection — Baileys, Signal CLI, Matrix.',
      code: `wireGateway({
  name: 'signal',
  type: 'listener',
  adapter: signalAdapter,
  func: handleMessage,
})`,
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Transport Types</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three ways to <span className="text-rose-400">connect</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Webhook, WebSocket, or listener — pick the transport that matches your platform. The handler function stays the same.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {transports.map((t, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                {t.icon}
                <h3 className="text-lg font-bold text-white">{t.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">{t.desc}</p>
              <div className="rounded-lg overflow-hidden border border-neutral-700/60">
                <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-[11px]">
                  <CodeBlock language="typescript">{t.code}</CodeBlock>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. FEATURES
   ───────────────────────────────────────────── */

function FeaturesSection() {
  const features = [
    {
      icon: <Layers className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Platform adapters',
      desc: 'Each platform gets a simple adapter: parse inbound, send outbound. Swap adapters without touching your handler.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Auto-verification',
      desc: 'Webhook verification challenges handled automatically — WhatsApp GET challenges, Slack url_verification, and more.',
    },
    {
      icon: <Plug className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'wire.gateway context',
      desc: 'Access gatewayName, senderId, platform, and send() inside any handler or middleware via wire.gateway.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Attachments',
      desc: 'Images, files, and media normalized into GatewayAttachment — same interface across WhatsApp, Slack, and Telegram.',
    },
    {
      icon: <Radio className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Lifecycle management',
      desc: 'GatewayService handles listener startup, shutdown, and reconnection. LocalGatewayService included out of the box.',
    },
    {
      icon: <Webhook className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />,
      title: 'Multi-gateway',
      desc: 'Register multiple gateways with the same handler. One function serves WhatsApp, Slack, and WebChat simultaneously.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Features</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Adapters, verification, <span className="text-rose-400">context</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Everything you need to integrate with messaging platforms — without platform-specific boilerplate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                {f.icon}
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">{f.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                </div>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-rose-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Start building messaging integrations</Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">One handler for every messaging platform. No platform-specific boilerplate.</p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-rose-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-rose-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/gateway" className="bg-rose-500 text-white hover:bg-rose-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-rose-500/20">Read the Gateway Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; WhatsApp, Slack, Telegram &amp; more</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function GatewayWirePage() {
  return (
    <Layout title="Gateway Wire — Pikku" description="Connect your Pikku functions to WhatsApp, Slack, Telegram, and any messaging platform — with normalized messages, auto-verification, and the same middleware you already use.">
      <Hero />
      <main>
        <BasicsSection />
        <TransportTypesSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
