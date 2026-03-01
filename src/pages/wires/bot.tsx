import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { BotIcon } from '../../components/WiringIcons';
import {
  Wrench, Brain, MessageSquare, ShieldCheck,
  Copy, Check, Database, Layers,
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
   2. BASICS — "Define an agent"
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
   3. FEATURES — "Streaming, memory, approval"
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
   4. INVOCATION — "Run or stream"
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
    <Layout title="AI Agent Wire — Pikku" description="Build AI agents that use your Pikku functions as tools — with memory, streaming, tool approval, and multi-agent delegation.">
      <Hero />
      <main>
        <BasicsSection />
        <FeaturesSection />
        <InvocationSection />
        <CTASection />
      </main>
    </Layout>
  );
}
