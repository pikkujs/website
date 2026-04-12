import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Cloud, FileJson, Terminal, Zap,
  ArrowRight, Package, Copy, Check,
  FolderTree, Settings, Clock, Inbox,
  Globe,
} from 'lucide-react';

/* -------------------------------------------------
   Reusable helpers
   ------------------------------------------------- */

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

/* -------------------------------------------------
   1. HERO
   ------------------------------------------------- */

function Hero() {
  return (
    <div className="wire-hero-azure w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute left-[12%] top-[35%] w-56 h-56 rounded-full bg-sky-400/6 blur-[80px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 border border-blue-400/40 bg-blue-400/10 px-3 py-1 rounded mb-6">
            Deployment
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Deploy to Azure.</span><br />
            <span className="text-blue-400">Functions + Storage Queues + Timers.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Pikku generates Azure Functions v4 code from your functions — HTTP triggers, Storage Queue
            triggers, and Timer triggers. You deploy with the Azure CLI.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/getting-started"
              className="bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
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

        {/* Right: terminal — two-step deploy flow */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-blue-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500"># Step 1: Generate Azure Functions code</span><br />
            <span className="text-blue-400">$</span>{' '}
            <span className="text-white">pikku deploy apply</span>{' '}
            <span className="text-blue-300">--provider azure</span><br /><br />
            <span className="text-neutral-500"># Step 2: Deploy to Azure</span><br />
            <span className="text-blue-400">$</span>{' '}
            <span className="text-white">cd .deploy/azure &&</span>{' '}
            <span className="text-blue-300">func azure functionapp publish my-app</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* -------------------------------------------------
   2. HOW IT WORKS
   ------------------------------------------------- */

function HowItWorksSection() {
  const steps = [
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: 'Generate function code',
      desc: 'Run pikku deploy apply --provider azure. Pikku scans your functions and generates Azure Functions v4 code, host.json, and local settings into .deploy/azure/.',
    },
    {
      icon: <Cloud className="w-6 h-6 text-blue-400" />,
      title: 'Deploy with Azure CLI',
      desc: 'cd into .deploy/azure and run func azure functionapp publish <app-name>. Azure\'s tooling handles packaging, uploading, and provisioning.',
    },
    {
      icon: <Terminal className="w-6 h-6 text-blue-400" />,
      title: 'Local dev with func start',
      desc: 'Run func start from the .deploy/azure directory to test locally with the Azure Functions Core Tools emulator. Same triggers, same runtime.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Two steps. <span className="text-blue-400">That's it.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates the Azure Functions code. You deploy it with the Azure CLI. No runtime lock-in, no magic — just generated code you can inspect and customize.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-blue-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-blue-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Terminal examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="Terminal" badge="deploy" icon={<Terminal className="w-4 h-4 text-blue-400" />}>
            <CodeBlock language="bash">{`# Generate Azure Functions code
pikku deploy apply --provider azure

# Deploy to your Function App
cd .deploy/azure
func azure functionapp publish my-function-app`}</CodeBlock>
          </CodeCard>
          <CodeCard filename="Terminal" badge="local dev" icon={<Terminal className="w-4 h-4 text-blue-400" />}>
            <CodeBlock language="bash">{`# Generate Azure Functions code
pikku deploy apply --provider azure

# Start local dev server
cd .deploy/azure
func start`}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------
   3. WHAT GETS GENERATED
   ------------------------------------------------- */

const generatedFunctionCode = `import { app } from '@azure/functions'
import { pikkuHTTPFunctionHandler } from './pikku-azure-http.js'
import { pikkuQueueHandler } from './pikku-azure-queue.js'
import { pikkuTimerHandler } from './pikku-azure-timer.js'

// HTTP triggers
app.http('getUser', {
  methods: ['GET'],
  route: 'users/{id}',
  authLevel: 'anonymous',
  handler: pikkuHTTPFunctionHandler
})

// Storage Queue triggers
app.storageQueue('processOrder', {
  queueName: 'orders',
  connection: 'AzureWebJobsStorage',
  handler: pikkuQueueHandler
})

// Timer triggers
app.timer('dailyCleanup', {
  schedule: '0 0 3 * * *',
  handler: pikkuTimerHandler
})`;

function WhatGetsGeneratedSection() {
  const files = [
    {
      icon: <FileJson className="w-5 h-5 text-blue-400" />,
      name: 'host.json',
      desc: 'Global Azure Function App configuration — runtime version, extension bundles, and logging settings.',
    },
    {
      icon: <Settings className="w-5 h-5 text-blue-400" />,
      name: 'local.settings.json',
      desc: 'Local development settings — storage connection strings, runtime config, and environment variables.',
    },
    {
      icon: <FolderTree className="w-5 h-5 text-blue-400" />,
      name: 'Per-function entry points',
      desc: 'Each function gets an Azure Functions v4 handler using app.http(), app.storageQueue(), or app.timer() from the Node.js programming model.',
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      name: 'Environment variables',
      desc: 'Function URLs, queue connection strings, and any config your functions need — all wired up automatically.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>What Gets Generated</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Real Azure code. <span className="text-blue-400">Not a wrapper.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates standard Azure Functions v4 Node.js code. You can read it, modify it, and deploy it with the tools you already know.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 gap-4">
            {files.map((file, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {file.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{file.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{file.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <CodeCard filename="src/functions/index.ts" badge="generated" icon={<Zap className="w-4 h-4 text-blue-400" />}>
            <CodeBlock language="typescript">{generatedFunctionCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Trigger types */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <Globe className="w-6 h-6 text-blue-400" />, label: 'HTTP Triggers', desc: 'REST endpoints via app.http() — GET, POST, PUT, DELETE with route params.' },
            { icon: <Inbox className="w-6 h-6 text-blue-400" />, label: 'Storage Queue Triggers', desc: 'Background jobs via app.storageQueue() — process messages from Azure Storage Queues.' },
            { icon: <Clock className="w-6 h-6 text-blue-400" />, label: 'Timer Triggers', desc: 'Scheduled tasks via app.timer() — CRON expressions for recurring jobs.' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 text-center hover:border-blue-500/30 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-jakarta text-lg font-bold text-white mb-2">{item.label}</h3>
              <p className="text-sm text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------
   4. PREREQUISITES
   ------------------------------------------------- */

function PrerequisitesSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Prerequisites</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            What you need <span className="text-blue-400">before deploying.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            A couple of installs and an Azure account. Nothing exotic.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            {
              icon: <Package className="w-6 h-6 text-blue-400" />,
              title: 'Install the deploy package',
              command: 'npm install @pikku/deploy-azure',
            },
            {
              icon: <Cloud className="w-6 h-6 text-blue-400" />,
              title: 'Azure Function App',
              command: 'az functionapp create ...',
              note: 'You need an Azure account with a Function App already created.',
            },
            {
              icon: <Terminal className="w-6 h-6 text-blue-400" />,
              title: 'Azure Functions Core Tools',
              command: 'npm install -g azure-functions-core-tools@4',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-blue-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
              </div>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-blue-300 mb-2">
                $ {item.command}
              </div>
              {item.note && (
                <p className="text-xs text-neutral-500 mt-2">{item.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------
   5. CTA
   ------------------------------------------------- */

function CTASection() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm install @pikku/deploy-azure');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-blue-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Ship to Azure in minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Generate. Deploy. Done. Your Pikku functions running on Azure Functions with zero boilerplate.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-md mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-blue-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-blue-400/70 select-none">$ </span>npm install @pikku/deploy-azure
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-blue-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/getting-started"
            className="bg-blue-500 text-white hover:bg-blue-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            Azure Functions Guide
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

/* -------------------------------------------------
   PAGE
   ------------------------------------------------- */

export default function AzureDeployPage() {
  return (
    <Layout
      title="Deploy to Azure Functions"
      description="Pikku generates Azure Functions v4 code from your functions — HTTP triggers, Storage Queue triggers, and Timer triggers. Deploy with the Azure CLI."
    >
      <Hero />
      <main>
        <HowItWorksSection />
        <WhatGetsGeneratedSection />
        <PrerequisitesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
