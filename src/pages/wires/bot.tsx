import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { BotIcon } from '../../components/WiringIcons';
import {
  Wrench, Brain, MessageSquare, ShieldCheck,
  Copy, Check, Database, Layers,
  AlertTriangle, Lock, RefreshCw,
  Headphones, BarChart3, Settings, PenTool,
  Sparkles, Play, Code2, ArrowRight,
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
    <div className="wire-hero-bot w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-violet-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-purple-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-violet-400 border border-violet-400/40 bg-violet-400/10 px-3 py-1 rounded">
              Wire Type: AI Agent
            </span>
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-violet-300/70 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
              Alpha
            </span>
          </div>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">AI agents,</span><br />
            <span className="text-violet-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-violet-400 text-lg">pikkuAIAgent</code> turns your Pikku functions into AI agent tools — with memory, streaming, tool approval, and multi-agent delegation.
          </p>
          <div className="flex flex-row gap-4">
            <Link to="/docs/wiring/ai-agents" className="bg-violet-500 text-white hover:bg-violet-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-violet-500/20">Get Started</Link>
            <a href="#basics" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">See the Code</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-violet-500/40 rounded-2xl p-6">
              <BotIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. PROBLEM — "The problem with building AI agents today"
   ───────────────────────────────────────────── */

function ProblemSection() {
  const painPoints = [
    {
      icon: <RefreshCw className="w-6 h-6 text-violet-400" />,
      title: 'Schema duplication',
      desc: (
        <>
          With Vercel AI SDK or LangChain, you redefine your function's schema as a "tool" —
          a separate <code className="text-violet-400/80 text-sm">z.object()</code> definition,
          disconnected from your actual function. Two sources of truth that inevitably drift apart.
        </>
      ),
    },
    {
      icon: <Lock className="w-6 h-6 text-violet-400" />,
      title: 'Auth is an afterthought',
      desc: 'Agent frameworks don\'t handle auth. Your agent can call tools, but who is the user? What can they access? You end up bolting on authorization checks per-tool, with no shared context.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-violet-400" />,
      title: 'New framework, new paradigm',
      desc: 'Want agents? Learn a whole new SDK — LangChain\'s chains/agents/tools, Vercel AI SDK\'s tool() API. Your existing backend functions can\'t be reused. You\'re starting over.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Problem</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Building AI agents today is <span className="text-violet-400">broken</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Existing frameworks force you to re-describe your functions, handle auth yourself, and learn an entirely new paradigm. Your backend code can't just work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {painPoints.map((p, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 relative group hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{p.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. COMPARISON — Brief visual comparison
   ───────────────────────────────────────────── */

function ComparisonSection() {
  const dimensions = [
    { label: 'Tool definition', pikku: 'Your existing functions', vercel: 'Redefine with z.object()', mastra: 'createTool() with z.object()', langchain: 'Wrap in DynamicTool' },
    { label: 'Auth & permissions', pikku: 'Inherited from function', vercel: 'Manual per-tool', mastra: 'Manual per-tool', langchain: 'Manual per-tool' },
    { label: 'Streaming', pikku: 'Built-in via channels', vercel: 'Built-in', mastra: 'Built-in (Vercel AI)', langchain: 'Callback-based' },
    { label: 'Multi-agent', pikku: 'Built-in delegation', vercel: 'Manual', mastra: 'Built-in agent network', langchain: 'AgentExecutor chains' },
    { label: 'Memory', pikku: 'Thread-based, configurable', vercel: 'Manual', mastra: 'Built-in thread memory', langchain: 'BufferMemory / etc' },
    { label: 'Workflows', pikku: 'Built-in durable workflows', vercel: 'Separate concern', mastra: 'Built-in step graphs', langchain: 'LangGraph' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Compares</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Pikku vs the <span className="text-violet-400">alternatives</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Vercel AI SDK, Mastra, and LangChain are excellent tools. Pikku's edge is simple: your functions are already tools — no translation layer needed.
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
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      <span className="text-sm font-bold text-violet-400 font-jakarta">Pikku</span>
                    </div>
                  </th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[20%]">Vercel AI SDK</th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[21%]">Mastra</th>
                  <th className="py-4 px-5 text-sm font-semibold text-neutral-500 w-[21%]">LangChain</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((d, i) => (
                  <tr key={i} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-3.5 px-5 text-xs font-bold tracking-wider uppercase text-neutral-500">{d.label}</td>
                    <td className="py-3.5 px-5 text-sm text-violet-300 font-medium">{d.pikku}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.vercel}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.mastra}</td>
                    <td className="py-3.5 px-5 text-sm text-neutral-500">{d.langchain}</td>
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
      icon: <Headphones className="w-6 h-6 text-violet-400" />,
      title: 'Customer support agent',
      desc: 'Resolve tickets, look up orders, and escalate — all using functions you already have.',
      functions: ['getCustomer', 'getOrders', 'createTicket'],
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
      title: 'Data analyst agent',
      desc: 'Query data, generate charts, and export reports on demand.',
      functions: ['queryDatabase', 'generateChart', 'exportCSV'],
    },
    {
      icon: <Settings className="w-6 h-6 text-violet-400" />,
      title: 'Admin / ops agent',
      desc: 'Monitor services, scale infrastructure, and deploy — with tool approval for safety.',
      functions: ['getMetrics', 'scaleService', 'deployVersion'],
    },
    {
      icon: <PenTool className="w-6 h-6 text-violet-400" />,
      title: 'Content agent',
      desc: 'Draft, review, and publish content through your existing content pipeline.',
      functions: ['generateDraft', 'checkGrammar', 'publishPost'],
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Use Cases</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            What you can <span className="text-violet-400">build</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Every function you've already written is an agent tool waiting to happen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((uc, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 hover:border-violet-500/30 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  {uc.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1 font-jakarta">{uc.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{uc.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-[60px]">
                {uc.functions.map((fn) => (
                  <span key={fn} className="text-xs font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2.5 py-1 rounded-md">
                    {fn}
                  </span>
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
   5. BASICS — "Define an agent"
   ───────────────────────────────────────────── */

const basicsCode = `const todoAssistant = pikkuAIAgent({
  name: 'todo-assistant',
  description: 'A helpful assistant that manages todos',
  instructions: 'You help users manage their todo lists.',
  model: 'openai/gpt-4o-mini',
  tools: [listTodos, createTodo, completeTodo],
  memory: {
    storage: 'aiStorage',
    lastMessages: 20,
  },
  maxSteps: 5,
  temperature: 0.7,
})`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Define an <span className="text-violet-400">agent</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Give it a name, instructions, a model, and your Pikku functions as tools. The agent calls them automatically.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="agent.functions.ts" icon={<BotIcon size={15} />}>
            <CodeBlock language="typescript">{basicsCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Functions as tools', desc: 'Your existing Pikku functions become agent tools — no adapter code needed' },
            { label: 'Any LLM provider', desc: 'model: "openai/gpt-4o", "anthropic/claude-3-5-sonnet" — provider/model format' },
            { label: 'Conversation memory', desc: 'Built-in thread-based message storage with configurable context window' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-[11px] font-bold mt-0.5">✓</span>
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
   6. FEATURES — "Streaming, memory, approval"
   ───────────────────────────────────────────── */

function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'Streaming',
      desc: 'Real-time text deltas, tool calls, and results via channel events. Show progress as the agent works.',
    },
    {
      icon: <Database className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'Memory',
      desc: 'Thread-based conversation history, configurable context window, and optional working memory for persistent state.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'Tool approval',
      desc: 'Require human approval before executing sensitive tools. The agent suspends and waits for your decision.',
    },
    {
      icon: <Brain className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'Multi-agent',
      desc: 'Agents can delegate to sub-agents. Each sub-agent gets its own session and tools.',
    },
    {
      icon: <Wrench className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'Structured output',
      desc: 'Define an output schema and the agent returns validated JSON — not just free-text responses.',
    },
    {
      icon: <Layers className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />,
      title: 'AI middleware',
      desc: 'Hook into modifyInput, modifyOutput, and modifyOutputStream to transform agent behavior.',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Features</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Streaming, memory, <span className="text-violet-400">approval</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Everything you need to build production AI agents — built into the framework.
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
   7. DYNAMIC WORKFLOWS — "Agents that build workflows"
   ───────────────────────────────────────────── */

const dynamicWorkflowCode = `const ops = pikkuAIAgent({
  name: 'ops-agent',
  tools: [getMetrics, scaleService, restartPod, notify],
  model: 'anthropic/claude-sonnet',
  // Agent can create and run workflows
  dynamicWorkflows: 'write',
})

// Agent designs a workflow graph from your request,
// asks for approval, then runs it natively — no AI in the loop.
// Next time? It reuses the saved workflow. Zero tokens.`;

function DynamicWorkflowsSection() {
  const phases = [
    {
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
      step: '1',
      title: 'AI designs the workflow',
      desc: 'The agent analyses your request and creates a workflow graph using your existing functions as steps. It proposes the workflow and waits for approval.',
    },
    {
      icon: <Play className="w-5 h-5 text-violet-400" />,
      step: '2',
      title: 'Runs natively — no AI',
      desc: 'Once approved, the workflow executes as a real durable workflow. No LLM in the loop. No token cost. Full retry, sleep, and replay guarantees.',
    },
    {
      icon: <Code2 className="w-5 h-5 text-violet-400" />,
      step: '3',
      title: 'Promote to code',
      desc: 'Use graph-to-dsl to pull runtime workflows into your codebase as real TypeScript. Version control, code review, and CI/CD — like any other code.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Dynamic Workflows</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Agents that <span className="text-violet-400">build workflows</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Other frameworks let AI call tools in a loop — burning tokens every time. Pikku agents design actual workflow graphs that run natively after the first pass.
          </p>
        </div>

        <div className="grid lg:grid-cols-[2fr_3fr] gap-10 max-w-5xl mx-auto items-start">
          {/* Left: the 3 phases */}
          <div className="space-y-6">
            {phases.map((phase, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  {phase.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1 font-jakarta">{phase.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}

            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-5 mt-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                <span className="text-violet-400 font-semibold">Why this matters:</span> Every other agent framework re-runs the full AI loop on repeat tasks. Pikku saves the workflow — so the second run costs zero tokens, has zero AI latency, and has zero security surface from LLM decisions.
              </p>
            </div>
          </div>

          {/* Right: code example */}
          <div>
            <CodeCard filename="ops-agent.ts" badge="dynamicWorkflows: 'write'" icon={<BotIcon size={15} />}>
              <CodeBlock language="typescript">{dynamicWorkflowCode}</CodeBlock>
            </CodeCard>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Saved workflows', value: 'Less tokens on repeat tasks' },
                { label: 'Native execution', value: 'No AI in the loop' },
                { label: 'graph-to-dsl', value: 'Pull into your codebase' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-bold text-violet-400 mb-1">{item.label}</p>
                  <p className="text-[11px] text-neutral-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. INVOCATION — "Run or stream"
   ───────────────────────────────────────────── */

const invokeCode = `// Non-streaming: get the full result
const result = await rpc.agent.run('todo-assistant', {
  message: 'Create a task for tomorrow',
  threadId: 'thread-123',
  resourceId: 'user-456'
})

console.log(result.result)   // Agent response
console.log(result.usage)    // Token usage`;

const streamCode = `// Streaming: real-time events
await rpc.agent.stream('todo-assistant', {
  message: 'Create a task',
  threadId: 'thread-123',
  resourceId: 'user-456'
})

// Channel receives events:
// { type: 'text-delta', text: '...' }
// { type: 'tool-call', toolName: 'createTodo', args: {...} }
// { type: 'tool-result', result: {...} }
// { type: 'usage', tokens: { input: 150, output: 42 } }
// { type: 'done' }`;

function InvocationSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Invocation</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Run or <span className="text-violet-400">stream</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Two execution modes: get the full result at once, or stream events in real time as the agent thinks and acts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="run.ts" badge="non-streaming" icon={<BotIcon size={15} />}>
            <CodeBlock language="typescript">{invokeCode}</CodeBlock>
          </CodeCard>

          <CodeCard filename="stream.ts" badge="streaming" icon={<BotIcon size={15} />}>
            <CodeBlock language="typescript">{streamCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-violet-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Start building AI agents in 5 minutes</Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">One command to scaffold a project with AI agent wiring already configured.</p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-violet-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-violet-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-violet-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/ai-agents" className="bg-violet-500 text-white hover:bg-violet-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-violet-500/20">Read the AI Agent Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; Works with OpenAI, Anthropic &amp; more</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function AIAgentWirePage() {
  return (
    <Layout title="AI Agent Wire — Pikku" description="TypeScript AI agent framework — build AI agents with your existing functions as tools. No schema duplication, built-in auth, streaming, and multi-agent delegation.">
      <Hero />
      <main>
        <ProblemSection />
        <ComparisonSection />
        <UseCasesSection />
        <BasicsSection />
        <FeaturesSection />
        <DynamicWorkflowsSection />
        <InvocationSection />
        <CTASection />
      </main>
    </Layout>
  );
}
