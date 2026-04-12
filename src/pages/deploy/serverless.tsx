import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  ArrowRight, Cloud, Copy, Check, Terminal,
  FileCode, Layers, Clock, Mail,
  Package, Cog, Zap, Server,
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
    <div className="wire-hero-serverless w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute left-[12%] top-[35%] w-56 h-56 rounded-full bg-orange-400/6 blur-[80px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded mb-6">
            Deployment
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Deploy to AWS.</span><br />
            <span className="text-amber-400">Lambda + SQS + EventBridge.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Pikku generates a complete Serverless Framework config from your functions — Lambda for HTTP, SQS for queues, EventBridge for cron. You just run the deploy.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/runtimes/aws-lambda"
              className="bg-amber-500 text-black hover:bg-amber-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
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
          <div className="bg-[#0d0d0d] border-2 border-amber-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500"># Step 1: Generate serverless config</span><br />
            <span className="text-amber-400">$</span>{' '}
            <span className="text-white">pikku deploy apply</span>{' '}
            <span className="text-amber-300">--provider serverless</span><br />
            <span className="text-neutral-600">  writing .deploy/serverless/serverless.yml</span><br />
            <span className="text-neutral-600">  bundling 12 functions...</span><br />
            <span className="text-green-400">  done.</span><br /><br />
            <span className="text-neutral-500"># Step 2: Deploy with Serverless Framework</span><br />
            <span className="text-amber-400">$</span>{' '}
            <span className="text-white">cd .deploy/serverless</span><br />
            <span className="text-amber-400">$</span>{' '}
            <span className="text-white">npx serverless deploy</span><br />
            <span className="text-neutral-600">  Deploying my-app to stage dev (us-east-1)</span><br />
            <span className="text-green-400">  Service deployed to stack my-app-dev</span>
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
      icon: <Cog className="w-6 h-6 text-amber-400" />,
      title: 'Generate the config',
      command: 'pikku deploy apply --provider serverless',
      desc: 'Pikku scans your functions and generates a complete serverless.yml plus individually bundled entry points in .deploy/serverless/.',
    },
    {
      icon: <Cloud className="w-6 h-6 text-amber-400" />,
      title: 'Deploy to AWS',
      command: 'cd .deploy/serverless && npx serverless deploy',
      desc: 'Standard Serverless Framework deploy. Lambda functions, SQS queues, EventBridge rules — all created from the generated config.',
    },
    {
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      title: 'Local dev',
      command: 'cd .deploy/serverless && npx serverless offline start',
      desc: 'Run the full stack locally with serverless-offline. Hot reload your functions without touching AWS.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Two steps. <span className="text-amber-400">That's it.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku generates the Serverless Framework config. You deploy it. No hand-written YAML, no mapping routes to Lambda handlers manually.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-amber-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-amber-400/80 mb-3">
                $ {step.command}
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-amber-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key difference callout */}
        <div className="max-w-3xl mx-auto bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Two-step flow by design</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Unlike single-command deploys, Pikku intentionally separates <strong className="text-amber-400">generation</strong> from <strong className="text-amber-400">deployment</strong>. You get full visibility into the generated serverless.yml before anything hits AWS. Inspect it, tweak it, commit it — then deploy when you're ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. WHAT GETS GENERATED
   ───────────────────────────────────────────── */

const serverlessYmlCode = `service: my-app

provider:
  name: aws
  runtime: nodejs20.x
  stage: \${opt:stage, 'dev'}
  region: us-east-1
  environment:
    ORDERS_QUEUE_URL: !Ref OrdersQueue

functions:
  getUser:
    handler: functions/getUser.handler
    events:
      - httpApi:
          path: /users/{id}
          method: get

  processOrder:
    handler: functions/processOrder.handler
    events:
      - sqs:
          arn: !GetAtt OrdersQueue.Arn

  dailyReport:
    handler: functions/dailyReport.handler
    events:
      - schedule:
          rate: cron(0 9 * * ? *)

resources:
  Resources:
    OrdersQueue:
      Type: AWS::SQS::Queue`;

const deployInfoOutput = `$ pikku deploy info --provider serverless

Provider:     serverless
Output:       .deploy/serverless/
Status:       generated

Functions:
  HTTP      8 functions   (Lambda + API Gateway)
  Queue     3 consumers   (Lambda + SQS)
  Cron      2 schedules   (Lambda + EventBridge)

Resources:
  OrdersQueue         SQS Queue
  NotificationQueue   SQS Queue

Environment:
  ORDERS_QUEUE_URL        → !Ref OrdersQueue
  NOTIFICATION_QUEUE_URL  → !Ref NotificationQueue`;

function WhatGetsGeneratedSection() {
  const items = [
    { icon: <FileCode className="w-5 h-5 text-amber-400" />, label: 'serverless.yml', desc: 'Complete Serverless Framework config — functions, events, resources, environment' },
    { icon: <Package className="w-5 h-5 text-amber-400" />, label: 'Per-function bundles', desc: 'Each function gets its own entry point and minimal bundle for fast cold starts' },
    { icon: <Server className="w-5 h-5 text-amber-400" />, label: 'Lambda + HTTP API events', desc: 'HTTP routes become API Gateway events wired to individual Lambda handlers' },
    { icon: <Mail className="w-5 h-5 text-amber-400" />, label: 'SQS queue definitions', desc: 'Queue consumers get SQS resources auto-created with proper ARN references' },
    { icon: <Clock className="w-5 h-5 text-amber-400" />, label: 'EventBridge schedules', desc: 'Cron functions become EventBridge rules with the schedule expression from your code' },
    { icon: <Zap className="w-5 h-5 text-amber-400" />, label: 'Auto-injected env vars', desc: 'Lambda ARNs, SQS URLs, and resource references wired into environment variables' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>What Gets Generated</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            A full <span className="text-amber-400">serverless.yml</span> from your code.
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku reads your function signatures — HTTP routes, queue consumers, cron schedules — and generates everything Serverless Framework needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-14">
          {items.map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <span className="text-sm font-bold text-white">{item.label}</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename="serverless.yml" badge="generated" icon={<FileCode className="w-4 h-4 text-amber-400" />}>
            <CodeBlock language="yaml">{serverlessYmlCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="Terminal" badge="inspect" icon={<Terminal className="w-4 h-4 text-amber-400" />}>
            <CodeBlock language="bash">{deployInfoOutput}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. PREREQUISITES
   ───────────────────────────────────────────── */

function PrerequisitesSection() {
  const prereqs = [
    {
      icon: <Package className="w-6 h-6 text-amber-400" />,
      title: 'Install the deploy package',
      command: 'npm install @pikku/deploy-serverless',
      desc: 'Adds the Serverless Framework provider to your Pikku project.',
    },
    {
      icon: <Server className="w-6 h-6 text-amber-400" />,
      title: 'AWS credentials configured',
      command: 'aws configure',
      desc: 'Standard AWS SDK credentials — env vars, ~/.aws/credentials, or IAM role. Same setup you\'d use for any AWS deployment.',
    },
    {
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      title: 'Serverless Framework installed',
      command: 'npm install -g serverless',
      desc: 'The actual deployment runs through the Serverless Framework CLI. Pikku just generates the config it reads.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Prerequisites</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three things. <span className="text-amber-400">Five minutes.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            If you've deployed to AWS before, you probably already have two of these.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {prereqs.map((prereq, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                  {prereq.icon}
                </div>
              </div>
              <h3 className="font-jakarta text-lg font-bold text-white mb-2 text-center">{prereq.title}</h3>
              <p className="text-sm text-neutral-400 mb-4 text-center">{prereq.desc}</p>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-amber-400/70 text-center">
                $ {prereq.command}
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
    navigator.clipboard.writeText('npm install @pikku/deploy-serverless');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-amber-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Ship to Lambda in minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          No more hand-writing serverless.yml. Let Pikku generate it from your actual code.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-md mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-amber-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-amber-400/70 select-none">$ </span>npm install @pikku/deploy-serverless
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-amber-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/runtimes/aws-lambda"
            className="bg-amber-500 text-black hover:bg-amber-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            Lambda Deployment Guide
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

export default function ServerlessDeployPage() {
  return (
    <Layout
      title="Deploy to AWS — Lambda + SQS + EventBridge"
      description="Pikku generates a complete Serverless Framework config from your functions — Lambda for HTTP, SQS for queues, EventBridge for cron. You just run the deploy."
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
