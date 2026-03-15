import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { WorkflowIcon } from '../../components/WiringIcons';
import {
  GitBranch, Clock, RefreshCw, Layers,
  Copy, Check, Zap, Pause,
  Server, BookOpen, Lock,
  UserPlus, CreditCard, FileText, Database,
  ArrowRight,
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
    <div className="wire-hero-workflow w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-teal-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-emerald-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 border border-teal-400/40 bg-teal-400/10 px-3 py-1 rounded mb-6">
            Wire Type: Workflow
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Durable workflows,</span><br />
            <span className="text-teal-400">plain TypeScript.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-teal-400 text-lg">wireWorkflow</code> orchestrates multi-step processes with durable execution, retries, sleep, and deterministic replay — all in plain TypeScript.
          </p>
          <div className="flex flex-row gap-4">
            <Link to="/docs/wiring/workflows" className="bg-teal-500 text-black hover:bg-teal-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-teal-500/20">Get Started</Link>
            <a href="#basics" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">See the Code</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-teal-500/40 rounded-2xl p-6">
              <WorkflowIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. PROBLEM — "The problem with workflow engines today"
   ───────────────────────────────────────────── */

function ProblemSection() {
  const painPoints = [
    {
      icon: <Server className="w-6 h-6 text-teal-400" />,
      title: 'Separate infrastructure',
      desc: 'Temporal requires a cluster. Inngest needs their cloud or a self-hosted server. You\'re adding another service to manage, monitor, and pay for — before you write a single workflow.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-teal-400" />,
      title: 'New programming model',
      desc: 'Temporal has activities, workflows, signals, and queries. Inngest has step.run, step.sleep, step.sendEvent. Each comes with its own SDK, its own patterns, its own testing story. Your existing functions can\'t be reused.',
    },
    {
      icon: <Lock className="w-6 h-6 text-teal-400" />,
      title: 'Vendor lock-in',
      desc: 'Your workflow logic is coupled to the engine. Switching from Inngest to Temporal means rewriting everything. Your business logic lives inside their SDK.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Problem</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            The problem with workflow engines <span className="text-teal-400">today</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Existing tools solve durable execution well — but they come with trade-offs that compound as your system grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 relative group hover:border-neutral-700 transition-colors">
              <div className="bg-teal-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-jakarta">{point.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-teal-500/5 border border-teal-500/20 rounded-xl p-6 text-center">
          <p className="text-neutral-300 text-base leading-relaxed">
            <span className="text-teal-400 font-semibold">Pikku takes a different approach.</span> Your workflows use the same functions you already have, run on your existing infrastructure, and persist state to any storage backend. No new service. No new SDK. No lock-in.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. COMPARISON — "How Pikku compares"
   ───────────────────────────────────────────── */

function ComparisonSection() {
  const dimensions = [
    { label: 'Setup', pikku: 'Your existing app', temporal: 'Separate cluster + workers', inngest: 'Cloud service or self-host', mastra: 'Your existing app' },
    { label: 'Step definition', pikku: 'workflow.do() with your functions', temporal: 'Activities + workflow code', inngest: 'step.run() callbacks', mastra: 'step() with z.object()' },
    { label: 'Function reuse', pikku: 'Same Pikku functions', temporal: 'Wrap in activities', inngest: 'Inline or import', mastra: 'Inline or import' },
    { label: 'Sleep / timers', pikku: 'workflow.sleep()', temporal: 'workflow.sleep()', inngest: 'step.sleep()', mastra: 'Not built-in' },
    { label: 'State persistence', pikku: 'Any storage backend', temporal: 'Temporal server', inngest: 'Inngest cloud', mastra: 'In-memory or custom' },
    { label: 'TypeScript-native', pikku: 'Yes, plain TS', temporal: 'SDK with decorators', inngest: 'Yes', mastra: 'Yes' },
    { label: 'Graph workflows', pikku: 'Built-in DAGs', temporal: 'Manual orchestration', inngest: 'Fan-out only', mastra: 'Built-in step graphs' },
    { label: 'AI agent integration', pikku: 'Same framework', temporal: 'Separate concern', inngest: 'Separate concern', mastra: 'Same framework' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Compares</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Pikku vs the <span className="text-teal-400">alternatives</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Temporal, Inngest, and Mastra are excellent tools. Pikku's advantage is that workflows use the same functions and infrastructure you already have, with no separate service.
          </p>
        </div>
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="py-4 px-5 text-xs font-bold tracking-widest uppercase text-neutral-600 w-[18%]"></th>
                  <th className="py-4 px-5 w-[20%]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      <span className="text-sm font-bold text-teal-400 font-jakarta">Pikku</span>
                    </div>
                  </th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[20%]">Temporal</th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[21%]">Inngest</th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[21%]">Mastra</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((d, i) => (
                  <tr key={i} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-3.5 px-5 text-xs font-bold tracking-wider uppercase text-neutral-500">{d.label}</td>
                    <td className="py-3.5 px-5 text-sm text-teal-300 font-medium">{d.pikku}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.temporal}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.inngest}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.mastra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. USE CASES — "What you can build"
   ───────────────────────────────────────────── */

function UseCasesSection() {
  const useCases = [
    {
      icon: <UserPlus className="w-5 h-5 text-teal-400" />,
      title: 'User onboarding',
      steps: ['createProfile', 'addToCRM', 'sleep(5min)', 'sendWelcomeEmail'],
    },
    {
      icon: <CreditCard className="w-5 h-5 text-teal-400" />,
      title: 'Payment processing',
      steps: ['createCharge', 'waitForWebhook', 'generateInvoice', 'sendReceipt'],
    },
    {
      icon: <FileText className="w-5 h-5 text-teal-400" />,
      title: 'Content pipeline',
      steps: ['generateDraft', 'humanReview', 'publishPost', 'notifySubscribers'],
    },
    {
      icon: <Database className="w-5 h-5 text-teal-400" />,
      title: 'Data migration',
      steps: ['exportFromSource', 'transformRecords', 'importToTarget', 'verifyIntegrity'],
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Use Cases</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            What you can <span className="text-teal-400">build</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Each step is a regular Pikku function — the same ones you use for HTTP, queues, and everything else.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((uc, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-teal-500/10 w-9 h-9 rounded-lg flex items-center justify-center">
                  {uc.icon}
                </div>
                <h3 className="text-base font-bold text-white font-jakarta">{uc.title}</h3>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                {uc.steps.map((step, j) => (
                  <React.Fragment key={j}>
                    <span className="text-xs font-mono px-2.5 py-1.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20 whitespace-nowrap">
                      {step}
                    </span>
                    {j < uc.steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. BASICS — "Orchestrate with workflow.do()"
   ───────────────────────────────────────────── */

const basicsCode = `const onboardUser = pikkuWorkflowFunc<
  { email: string; userId: string },
  { success: boolean }
>(async ({}, data, { workflow }) => {
  // Step 1: RPC call (executed as queue job)
  const user = await workflow.do(
    'Create profile',
    'createUserProfile',
    { email: data.email, userId: data.userId }
  )

  // Step 2: Inline step (immediate, cached)
  const message = await workflow.do(
    'Generate welcome',
    async () => \`Welcome, \${data.email}!\`
  )

  // Step 3: Durable sleep
  await workflow.sleep('Wait 5 minutes', '5min')

  // Step 4: Another RPC call
  await workflow.do('Send email', 'sendEmail', {
    to: data.email,
    subject: 'Welcome!',
    body: message,
  })

  return { success: true }
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Orchestrate with <span className="text-teal-400">workflow.do()</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Each <code className="text-teal-400">workflow.do()</code> call is a durable step. RPC steps run as queue jobs. Inline steps execute immediately. Both are cached for replay.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="onboarding.workflow.ts" icon={<WorkflowIcon size={15} />}>
            <CodeBlock language="typescript">{basicsCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Deterministic replay', desc: 'Completed steps are never re-executed. Results are cached and replayed on recovery.' },
            { label: 'Plain TypeScript', desc: 'Loops, conditionals, Promise.all — use any TypeScript construct. No YAML, no DSL.' },
            { label: 'Typed I/O', desc: 'Workflow input and output are fully typed. Each RPC step infers types from the target function.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. STEP TYPES — "Four step primitives"
   ───────────────────────────────────────────── */

function StepTypesSection() {
  const steps = [
    {
      icon: <Zap className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />,
      title: 'workflow.do(name, rpcName, data, options?)',
      desc: 'Execute a Pikku function as a queue job. Supports retries and retry delay.',
      tag: 'RPC',
    },
    {
      icon: <Layers className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />,
      title: 'workflow.do(name, async () => value)',
      desc: 'Inline step — runs immediately, result cached for replay. Great for transformations.',
      tag: 'inline',
    },
    {
      icon: <Clock className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />,
      title: 'workflow.sleep(name, duration)',
      desc: 'Durable sleep. Survives restarts — the workflow resumes after the duration.',
      tag: 'sleep',
    },
    {
      icon: <Pause className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />,
      title: 'workflow.suspend(reason)',
      desc: 'Pause the workflow until explicitly resumed. For human-in-the-loop approval flows.',
      tag: 'suspend',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Step Types</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Four step <span className="text-teal-400">primitives</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every workflow is built from these four building blocks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                {s.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-white font-mono">{s.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400">{s.tag}</span>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
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
   4. PATTERNS — "Fan-out, retry, branch"
   ───────────────────────────────────────────── */

const patternsCode = `// Fan-out: parallel steps with Promise.all
const users = await Promise.all(
  data.userIds.map(async (userId) =>
    await workflow.do(\`Get user \${userId}\`, 'userGet', { userId })
  )
)

// Retry: automatic retry with backoff
const payment = await workflow.do(
  'Process payment',
  'processPayment',
  { amount: 100 },
  { retries: 3, retryDelay: '1s' }
)

// Branch: standard TypeScript conditionals
if (user.plan === 'pro') {
  await workflow.do('Apply discount', 'applyDiscount', { userId })
}`;

function PatternsSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Patterns</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Fan-out, retry, <span className="text-teal-400">branch</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Use standard TypeScript for control flow. Promise.all for parallelism. if/else for branching. Retries via step options.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="workflow-patterns.ts" icon={<WorkflowIcon size={15} />}>
            <CodeBlock language="typescript">{patternsCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. GRAPH WORKFLOWS — "Visual DAGs"
   ───────────────────────────────────────────── */

const graphCode = `const userOnboarding = pikkuWorkflowGraph({
  description: 'Onboard a new user',
  nodes: {
    createProfile: 'createUserProfile',
    sendWelcome:   'sendEmail',
    setupDefaults: 'createDefaultTodos',
  },
  config: {
    createProfile: {
      next: ['sendWelcome', 'setupDefaults'],  // Parallel
    },
    sendWelcome: {
      input: (ref) => ({
        to: ref('createProfile', 'email'),
        subject: 'Welcome!',
      }),
    },
  },
})`;

function GraphSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Graph Workflows</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Declarative <span className="text-teal-400">DAGs</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            For node-based workflows, use <code className="text-teal-400">pikkuWorkflowGraph</code>. Define nodes, edges, and input mappings — Pikku handles execution order and parallelism.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          <CodeCard filename="onboarding.graph.ts" icon={<WorkflowIcon size={15} />} badge="graph">
            <CodeBlock language="typescript">{graphCode}</CodeBlock>
          </CodeCard>

          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <GitBranch className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Branching</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Use <code className="text-teal-400 text-xs">graph.branch('key')</code> inside a node to select which edge to follow. Record-based next config maps keys to nodes.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <RefreshCw className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">ref() for data flow</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Use <code className="text-teal-400 text-xs">ref('nodeId', 'path')</code> to reference output from previous nodes — resolved at runtime.
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
   6. HTTP WIRING — "Start, poll, resume"
   ───────────────────────────────────────────── */

const httpCode = `// Start a workflow (returns runId)
wireHTTP({
  method: 'post',
  route: '/workflow/onboard',
  func: workflowStart('userOnboarding'),
})

// Run to completion (synchronous)
wireHTTP({
  method: 'post',
  route: '/workflow/onboard/run',
  func: workflow('userOnboarding'),
})

// Check status
wireHTTP({
  method: 'get',
  route: '/workflow/status/:runId',
  func: workflowStatus('userOnboarding'),
})`;

function HTTPWiringSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>HTTP Wiring</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Start, poll, <span className="text-teal-400">resume</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Pikku provides helper functions to wire workflows to HTTP endpoints — start, run to completion, or poll status.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <CodeCard filename="workflow.wiring.ts" icon={<WorkflowIcon size={15} />}>
            <CodeBlock language="typescript">{httpCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-teal-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Start wiring workflows in 5 minutes</Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">One command to scaffold a project with workflow wiring already configured.</p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-teal-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-teal-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/workflows" className="bg-teal-500 text-black hover:bg-teal-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/20">Read the Workflow Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; DSL &amp; graph workflows</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function WorkflowWirePage() {
  return (
    <Layout title="Workflow Wire — Pikku" description="TypeScript durable workflows with no separate infrastructure. Pikku is a workflow engine for TypeScript that provides durable execution, retries, sleep, fan-out, and DAG-based graph workflows — using your existing functions and database.">
      <Hero />
      <main>
        <ProblemSection />
        <ComparisonSection />
        <UseCasesSection />
        <BasicsSection />
        <StepTypesSection />
        <PatternsSection />
        <GraphSection />
        <HTTPWiringSection />
        <CTASection />
      </main>
    </Layout>
  );
}
