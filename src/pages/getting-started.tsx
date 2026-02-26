import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  HttpIcon, WebSocketIcon, QueueIcon, CronIcon, CLIIcon,
  MCPIcon, BotIcon, WorkflowIcon, TriggerIcon, RPCIcon,
} from '../components/WiringIcons';
import { Copy, Check, Terminal } from 'lucide-react';

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function CodeCard({ filename, badge, children }: {
  filename: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-sm font-semibold text-neutral-200">{filename}</span>
        {badge && <span className="ml-auto text-xs text-neutral-600 font-mono">{badge}</span>}
      </div>
      <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
        {children}
      </div>
    </div>
  );
}

function TerminalCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-sm font-semibold text-neutral-200">Terminal</span>
      </div>
      <div className="p-5 bg-[#0a0a0f] font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-base font-bold font-jakarta shrink-0">
        {n}
      </span>
      <Heading as="h2" className="font-jakarta text-3xl md:text-4xl font-bold text-white !mb-0">
        {title}
      </Heading>
    </div>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group inline-flex items-center gap-3 bg-white/[0.04] border border-white/10 hover:border-purple-500/40 rounded-xl px-5 py-3.5 font-mono text-base text-neutral-200 cursor-pointer transition-all hover:bg-white/[0.06]"
    >
      <Terminal className="w-4 h-4 text-purple-400/70" />
      <span><span className="text-purple-400/70 select-none">$ </span>{command}</span>
      {copied
        ? <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        : <Copy className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors ml-1" />
      }
    </button>
  );
}

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-getting-started w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <header className="relative max-w-screen-xl mx-auto w-full pt-14 pb-12 lg:pt-20 lg:pb-16 px-6 text-center">
        <Heading as="h1" className="font-jakarta text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="text-white">Getting Started</span>
        </Heading>
        <p className="text-xl font-medium leading-relaxed text-neutral-400 max-w-xl mx-auto mb-8">
          From an empty folder to a working API in four steps.
        </p>
        <CopyCommand command="npm create pikku@latest" />
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. STEP 1 — CREATE
   ───────────────────────────────────────────── */

function StepCreate() {
  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-screen-lg mx-auto px-6">
        <StepHeader n={1} title="Create your project" />

        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl">
          The CLI scaffolds a working project with your choice of runtime, example functions, and auto-generated types.
        </p>

        <TerminalCard>
          <div className="text-neutral-300 mb-3">
            <span className="text-purple-400">$</span> npm create pikku@latest
          </div>
          <pre className="text-neutral-500 whitespace-pre-wrap m-0">{
` ______ _ _     _
(_____ (_) |   | |
 _____) )| |  _| |  _ _   _
|  ____/ | |_/ ) |_/ ) | | |
| |    | |  _ (|  _ (| |_| |
|_|    |_|_| _)_| _)____/

Welcome to the Pikku Project Generator!

- Downloading template...
✔ Downloading template...
📦 Installing dependencies...`}</pre>
          <pre className="text-neutral-400 whitespace-pre-wrap m-0 mt-2">{
`pikku all (completed in 0ms)
  • 18 HTTP routes
  • 2 Scheduled tasks
  • 1 Trigger
  • 3 MCP endpoints`}</pre>
          <pre className="text-emerald-400 whitespace-pre-wrap m-0 mt-3">{
`✅ Project setup complete!
Run the following command to get started:

cd my-app`}</pre>
        </TerminalCard>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. STEP 2 — WRITE A FUNCTION
   ───────────────────────────────────────────── */

const functionCode = `import { pikkuFunc } from '@pikku/core'

export const getUser = pikkuFunc(
  async ({ db, logger }, { userId }) => {
    logger.info(\`Fetching user \${userId}\`)
    return await db.findUser(userId)
  }
)`;

function StepFunction() {
  return (
    <section className="py-14 lg:py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="max-w-screen-lg mx-auto px-6">
        <StepHeader n={2} title="Write a function" />

        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl">
          A Pikku function receives <strong className="text-neutral-200">services</strong> (your dependencies) and <strong className="text-neutral-200">data</strong> (typed input). No decorators, no classes — just an async function.
        </p>

        <CodeCard filename="src/functions.ts">
          <CodeBlock language="typescript">{functionCode}</CodeBlock>
        </CodeCard>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. STEP 3 — WIRE IT
   ───────────────────────────────────────────── */

const wireHTTPCode = `import { getUser } from './functions'

wireHTTP({
  method: 'get',
  route: '/users/:userId',
  func: getUser
})`;

const wireMoreCode = `// Same function, more protocols
wireHTTP({ method: 'get', route: '/users/:userId', func: getUser })
wireWebSocket({ channel: 'users', func: getUser })
wireRPC({ func: getUser })
wireMCP({ tool: 'get_user', func: getUser })
wireCLI({ command: 'get-user', func: getUser })`;

function StepWire() {
  return (
    <section className="py-14 lg:py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="max-w-screen-lg mx-auto px-6">
        <StepHeader n={3} title="Wire it up" />

        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl">
          Connect your function to a protocol. Start with HTTP — you can always add more later without touching the function.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <CodeCard filename="src/wiring.ts" badge="start here">
            <CodeBlock language="typescript">{wireHTTPCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="src/wiring.ts" badge="add more anytime">
            <CodeBlock language="typescript">{wireMoreCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Compact protocol list */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: <HttpIcon size={16} />, name: 'HTTP' },
            { icon: <WebSocketIcon size={16} />, name: 'WebSocket' },
            { icon: <RPCIcon size={16} />, name: 'RPC' },
            { icon: <MCPIcon size={16} />, name: 'MCP' },
            { icon: <QueueIcon size={16} />, name: 'Queue' },
            { icon: <CronIcon size={16} />, name: 'Cron' },
            { icon: <CLIIcon size={16} />, name: 'CLI' },
            { icon: <TriggerIcon size={16} />, name: 'Trigger' },
            { icon: <BotIcon size={16} />, name: 'AI Agent' },
            { icon: <WorkflowIcon size={16} />, name: 'Workflow' },
          ].map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-neutral-500 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5">
              {p.icon}
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. STEP 4 — RUN IT
   ───────────────────────────────────────────── */

function StepRun() {
  return (
    <section className="py-14 lg:py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="max-w-screen-lg mx-auto px-6">
        <StepHeader n={4} title="Start the server" />

        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl">
          Run <code className="text-purple-400 text-sm">pikku watch</code> to auto-regenerate types as you code, then start the server.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          <TerminalCard>
            <div className="space-y-3">
              <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Terminal 1</div>
              <div>
                <span className="text-purple-400">$</span> <span className="text-neutral-300">npx pikku watch</span>
              </div>
              <div className="text-neutral-500">
                Watching for changes...
              </div>
            </div>
          </TerminalCard>
          <TerminalCard>
            <div className="space-y-3">
              <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Terminal 2</div>
              <div>
                <span className="text-purple-400">$</span> <span className="text-neutral-300">npm run start</span>
              </div>
              <div className="text-neutral-500">
                Server running at http://localhost:4002
              </div>
              <div className="border-t border-neutral-800 pt-3">
                <span className="text-purple-400">$</span> <span className="text-neutral-300">curl http://localhost:4002/users/123</span>
              </div>
              <div className="text-emerald-400">
                {'{"id":"123","name":"John Doe","email":"john@example.com"}'}
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. WHAT'S NEXT
   ───────────────────────────────────────────── */

function NextSteps() {
  const paths = [
    { icon: <HttpIcon size={20} />, title: 'Core Features', desc: 'Functions, middleware, sessions, errors', link: '/docs/core-features' },
    { icon: <WebSocketIcon size={20} />, title: 'Channels', desc: 'Real-time with WebSocket', link: '/docs/wiring/channels' },
    { icon: <QueueIcon size={20} />, title: 'Queues', desc: 'Background job processing', link: '/docs/wiring/queue' },
    { icon: <BotIcon size={20} />, title: 'AI Agents', desc: 'Conversational AI with tools', link: '/docs/wiring/ai-agents' },
    { icon: <WorkflowIcon size={20} />, title: 'Workflows', desc: 'Multi-step stateful processes', link: '/docs/wiring/workflows' },
    { icon: <MCPIcon size={20} />, title: 'MCP', desc: 'Expose functions to AI models', link: '/docs/wiring/mcp' },
  ];

  return (
    <section className="py-14 lg:py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="max-w-screen-lg mx-auto px-6">
        <Heading as="h2" className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-3">
          What's next
        </Heading>
        <p className="text-base text-neutral-400 mb-8">
          You have a working API. Here's where to go from here.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((path, i) => (
            <Link
              key={i}
              to={path.link}
              className="group flex items-start gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all no-underline"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                {path.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5 group-hover:text-purple-300 transition-colors">{path.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed m-0">{path.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/docs"
            className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all no-underline"
          >
            Full Documentation
          </Link>
          <Link
            to="/features"
            className="border border-white/15 text-white/70 hover:bg-white/5 hover:text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all no-underline"
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

export default function GettingStartedPage() {
  return (
    <Layout
      title="Getting Started"
      description="Get up and running with Pikku — create a TypeScript API with one command and wire functions to any protocol."
    >
      <main className="bg-[#0a0a0f] text-white min-h-screen">
        <Hero />
        <StepCreate />
        <StepFunction />
        <StepWire />
        <StepRun />
        <NextSteps />
      </main>
    </Layout>
  );
}
