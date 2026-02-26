import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { MCPIcon } from '../../components/WiringIcons';
import {
  Wrench, FileText, MessageSquare,
  Copy, Check, Zap,
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
    <div className="wire-hero-mcp w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-pink-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-rose-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-pink-400 border border-pink-400/40 bg-pink-400/10 px-3 py-1 rounded mb-6">
            Wire Type: MCP
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">AI tools,</span><br />
            <span className="text-pink-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Add <code className="text-pink-400 text-lg">mcp: true</code> to any Pikku function and it becomes an MCP tool. Resources and prompts use dedicated function types — all exposed automatically via the Model Context Protocol.
          </p>
          <div className="flex flex-row gap-4">
            <Link to="/docs/wiring/mcp" className="bg-pink-500 text-white hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-pink-500/20">Get Started</Link>
            <a href="#tools" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">See the Code</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-[40px]" />
            <div className="relative bg-[#0d0d0d] border-2 border-pink-500/40 rounded-2xl p-6">
              <MCPIcon size={120} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. THREE PRIMITIVES
   ───────────────────────────────────────────── */

const toolCode = `// Any Pikku function becomes an MCP tool with mcp: true
export const createTodo = pikkuFunc({
  description: 'Create a new todo item',
  input: CreateTodoInput,
  output: CreateTodoOutput,
  mcp: true, // ← That's it. Now it's an MCP tool.
  func: async ({ db }, { text, priority }) => {
    return await db.createTodo({ text, priority })
  },
})`;

const resourceCode = `// MCP resources use a dedicated function type
export const getTodo = pikkuMCPResourceFunc({
  uri: 'todos/{id}',
  title: 'Todo Details',
  description: 'Get a todo by ID',
  func: async ({ db }, { id }, { mcp }) => {
    const todo = await db.getTodo(id)
    return [{ uri: mcp.uri!, text: JSON.stringify(todo) }]
  },
})`;

const promptCode = `// MCP prompts use a dedicated function type
export const codeReview = pikkuMCPPromptFunc({
  name: 'codeReview',
  description: 'Generate a code review prompt',
  func: async ({}, { filePath, context }) => {
    return [{
      role: 'user',
      content: {
        type: 'text',
        text: \`Review \${filePath}. Context: \${context}\`
      }
    }]
  },
})`;

function PrimitivesSection() {
  const primitives = [
    {
      icon: <Wrench className="w-6 h-6 text-pink-400" />,
      title: 'Tools',
      desc: 'Any Pikku function becomes a tool — just add mcp: true.',
      code: toolCode,
      filename: 'todo.functions.ts',
      badge: 'mcp: true',
    },
    {
      icon: <FileText className="w-6 h-6 text-pink-400" />,
      title: 'Resources',
      desc: 'Data the AI can read. URI templates with typed parameters.',
      code: resourceCode,
      filename: 'mcp.functions.ts',
      badge: 'pikkuMCPResourceFunc',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-pink-400" />,
      title: 'Prompts',
      desc: 'Prompt templates the AI can use. Return structured message arrays.',
      code: promptCode,
      filename: 'mcp.functions.ts',
      badge: 'pikkuMCPPromptFunc',
    },
  ];

  return (
    <section id="tools" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Three Primitives</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Tools, resources, <span className="text-pink-400">prompts</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            MCP defines three primitives for AI integration. Pikku exposes your functions automatically — no wiring code needed.
          </p>
        </div>

        <div className="space-y-10 max-w-4xl mx-auto">
          {primitives.map((p, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                {p.icon}
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <span className="text-sm text-neutral-500">{p.desc}</span>
              </div>
              <CodeCard filename={p.filename} badge={p.badge} icon={<MCPIcon size={15} />}>
                <CodeBlock language="typescript">{p.code}</CodeBlock>
              </CodeCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. WIRE OBJECT — "Dynamic control at runtime"
   ───────────────────────────────────────────── */

const wireObjectCode = `export const manageTodos = pikkuFunc({
  description: 'Manage todo items',
  input: ManageTodosInput,
  output: ManageTodosOutput,
  mcp: true,
  func: async ({ db }, { action, id }, { mcp }) => {
    if (action === 'delete') {
      await db.deleteTodo(id)

      // Notify AI that the resource changed
      mcp.sendResourceUpdated(\`todos/\${id}\`)

      // Dynamically enable/disable tools
      await mcp.enableTools({ archiveTodos: true })

      return { deleted: true }
    }
    // ...
  },
})`;

function WireObjectSection() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />,
      title: 'sendResourceUpdated(uri)',
      desc: 'Notify the AI that a resource changed — it can re-read it to get fresh data.',
    },
    {
      icon: <Wrench className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />,
      title: 'enableTools / enableResources / enablePrompts',
      desc: 'Dynamically show or hide capabilities based on context. Pass a map of names to booleans.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Wire Object</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Dynamic control <span className="text-pink-400">at runtime</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every MCP function gets a <code className="text-pink-400">wire.mcp</code> object to notify resource changes and toggle capabilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {f.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white font-mono">{f.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CodeCard filename="mcp.functions.ts" icon={<MCPIcon size={15} />}>
            <CodeBlock language="typescript">{wireObjectCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-pink-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Start wiring MCP in 5 minutes</Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">One command to scaffold a project with MCP wiring already configured.</p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-pink-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-pink-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-pink-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/mcp" className="bg-pink-500 text-white hover:bg-pink-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-pink-500/20">Read the MCP Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &nbsp;&middot;&nbsp; Tools, Resources &amp; Prompts</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function MCPWirePage() {
  return (
    <Layout title="MCP Wire — Pikku" description="Expose your Pikku functions to AI models via the Model Context Protocol — tools, resources, and prompts with typed parameters.">
      <Hero />
      <main>
        <PrimitivesSection />
        <WireObjectSection />
        <CTASection />
      </main>
    </Layout>
  );
}
