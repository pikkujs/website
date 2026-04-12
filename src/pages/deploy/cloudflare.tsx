import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Cloud, Layers, Clock, Database, Key, Box,
  ArrowRight, Copy, Check, Terminal, Settings,
  Zap, Package, Radio,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

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

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-cloudflare w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute left-[12%] top-[35%] w-56 h-56 rounded-full bg-emerald-400/6 blur-[80px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 rounded mb-6">
            Deployment
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Deploy to Cloudflare.</span><br />
            <span className="text-emerald-400">One command.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Pikku analyzes your functions and deploys each one as a Cloudflare Worker — with queues,
            cron, D1, KV, and secrets all configured automatically.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/runtimes/cloudflare-functions"
              className="bg-emerald-500 text-black hover:bg-emerald-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              Read the Docs
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right: terminal showing deploy output */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-emerald-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed max-w-md w-full">
            <span className="text-neutral-500"># Deploy everything to Cloudflare</span><br />
            <span className="text-emerald-400">$</span>{' '}
            <span className="text-white">pikku deploy apply</span><br /><br />
            <span className="text-neutral-500">Building workers...</span><br />
            <span className="text-emerald-400">  +</span>{' '}
            <span className="text-white">api-get-users</span>{' '}
            <span className="text-neutral-600">worker</span><br />
            <span className="text-emerald-400">  +</span>{' '}
            <span className="text-white">api-create-order</span>{' '}
            <span className="text-neutral-600">worker</span><br />
            <span className="text-emerald-400">  +</span>{' '}
            <span className="text-white">send-welcome-email</span>{' '}
            <span className="text-neutral-600">queue consumer</span><br />
            <span className="text-emerald-400">  +</span>{' '}
            <span className="text-white">daily-cleanup</span>{' '}
            <span className="text-neutral-600">cron</span><br /><br />
            <span className="text-emerald-400">Build complete.</span>{' '}
            <span className="text-neutral-400">4 workers deployed.</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. HOW IT WORKS
   ───────────────────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      title: 'pikku deploy info',
      desc: 'See what will deploy — units, queues, cron triggers, secrets, and which roles each worker needs. No changes made.',
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: 'pikku deploy plan',
      desc: 'Dry-run that shows exactly what will be created, updated, deleted, or drained. Review before you commit.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: 'pikku deploy apply',
      desc: 'Deploys everything to your Cloudflare account. Workers, queues, cron triggers, D1, KV, secrets — all wired up.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three commands. <span className="text-emerald-400">Full control.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Inspect, preview, deploy. Every step is transparent — you always know what's happening before it happens.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-emerald-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-emerald-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Terminal examples */}
        <div className="grid lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <CodeCard filename="pikku deploy info" icon={<Terminal className="w-4 h-4 text-emerald-400" />}>
            <CodeBlock language="bash">{`Units:
  api-get-users       http
  api-create-order    http
  send-welcome-email  queue
  daily-cleanup       cron

Queues:
  welcome-emails      consumer: send-welcome-email

Secrets:
  DATABASE_URL        bound to all units
  STRIPE_KEY          bound to api-create-order`}</CodeBlock>
          </CodeCard>

          <CodeCard filename="pikku deploy plan" icon={<Layers className="w-4 h-4 text-emerald-400" />}>
            <CodeBlock language="bash">{`+ create  api-get-users        worker
+ create  api-create-order     worker
+ create  send-welcome-email   worker
+ create  welcome-emails       queue
+ create  daily-cleanup        cron
~ update  DATABASE_URL         secret
- delete  old-webhook-handler  worker

3 to create, 1 to update, 1 to delete`}</CodeBlock>
          </CodeCard>

          <CodeCard filename="pikku deploy apply" icon={<Zap className="w-4 h-4 text-emerald-400" />}>
            <CodeBlock language="bash">{`Building workers...
  + api-get-users         built  148 KB
  + api-create-order      built  203 KB
  + send-welcome-email    built   52 KB
  + daily-cleanup         built   34 KB

Build complete.
Deploying to Cloudflare...
Deployment complete. 4 workers deployed.`}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. WHAT GETS DEPLOYED
   ───────────────────────────────────────────── */

function WhatGetsDeployedSection() {
  const resources = [
    {
      icon: <Cloud className="w-7 h-7 text-emerald-400" />,
      name: 'Workers',
      description: 'One per function or unit. Each worker is independently deployable and scalable.',
    },
    {
      icon: <Radio className="w-7 h-7 text-emerald-400" />,
      name: 'Queues',
      description: 'Cloudflare Queues with consumers auto-wired to the right worker. No manual binding.',
    },
    {
      icon: <Clock className="w-7 h-7 text-emerald-400" />,
      name: 'Cron Triggers',
      description: 'Scheduled tasks deployed as cron triggers. Set the schedule in your function metadata.',
    },
    {
      icon: <Database className="w-7 h-7 text-emerald-400" />,
      name: 'D1 Databases',
      description: 'For workflow state, session storage, or anything else. Bindings handled automatically.',
    },
    {
      icon: <Box className="w-7 h-7 text-emerald-400" />,
      name: 'KV Namespaces',
      description: 'Key-value storage for caching, config, or feature flags. Created and bound for you.',
    },
    {
      icon: <Key className="w-7 h-7 text-emerald-400" />,
      name: 'Secrets & Variables',
      description: 'Environment variables and secrets deployed to the workers that need them. No leaking across boundaries.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>What Gets Deployed</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Everything your app needs. <span className="text-emerald-400">Auto-configured.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Pikku reads your function signatures and figures out which Cloudflare resources to provision.
            You don't write wrangler.toml by hand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resources.map((r, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 text-center hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                  {r.icon}
                </div>
              </div>
              <h3 className="font-jakarta text-xl font-bold text-white mb-2">{r.name}</h3>
              <p className="text-sm text-neutral-400">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. PREREQUISITES
   ───────────────────────────────────────────── */

function PrerequisitesSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Prerequisites</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three things. <span className="text-emerald-400">That's it.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Install the deploy package, set two environment variables, and you're ready to go.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {[
            {
              icon: <Package className="w-6 h-6 text-emerald-400" />,
              title: 'Install the package',
              code: 'npm install @pikku/deploy-cloudflare',
            },
            {
              icon: <Settings className="w-6 h-6 text-emerald-400" />,
              title: 'Account ID',
              code: 'export CLOUDFLARE_ACCOUNT_ID=...',
            },
            {
              icon: <Key className="w-6 h-6 text-emerald-400" />,
              title: 'API Token',
              code: 'export CLOUDFLARE_API_TOKEN=...',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                {item.icon}
                <span className="text-sm font-semibold text-white">{item.title}</span>
              </div>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-emerald-400/80">
                $ {item.code}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: 'No wrangler.toml needed', desc: 'Pikku generates all Cloudflare configuration from your function signatures. No manual config files.' },
            { label: 'Incremental deploys', desc: 'Only changed workers get redeployed. Unchanged workers are left alone — fast and safe.' },
            { label: 'Rollback-friendly', desc: 'Every deploy is traceable. Run plan before apply, and you always know what changed.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[11px] font-bold mt-0.5">&#10003;</span>
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
   5. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const installCmd = 'npm install @pikku/deploy-cloudflare';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-emerald-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Ship to the edge
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Your functions, deployed as Cloudflare Workers. Queues, cron, D1, KV — all handled.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-md mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-emerald-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-emerald-400/70 select-none">$ </span>{installCmd}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/runtimes/cloudflare-functions"
            className="bg-emerald-500 text-black hover:bg-emerald-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
          >
            Cloudflare Guide
          </Link>
          <Link
            to="/features"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            All Features
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function CloudflareDeployPage() {
  return (
    <Layout
      title="Deploy to Cloudflare — One Command"
      description="Pikku analyzes your functions and deploys each one as a Cloudflare Worker — with queues, cron, D1, KV, and secrets all configured automatically."
    >
      <Hero />
      <main>
        <HowItWorksSection />
        <WhatGetsDeployedSection />
        <PrerequisitesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
