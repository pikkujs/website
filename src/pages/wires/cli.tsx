import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { CLIIcon } from '../../components/WiringIcons';
import {
  Layers, Terminal, Wifi,
  Copy, Check, Paintbrush, GitBranch,
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
    <div className="wire-hero-cli w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-teal-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-400 border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 rounded mb-6">
            Wire Type: CLI
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">CLI tools,</span><br />
            <span className="text-cyan-400">same functions.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            <code className="text-cyan-400 text-lg">wireCLI</code> turns your Pikku functions into type-safe CLI commands with automatic argument parsing, subcommands, and custom renderers.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/wiring/cli/local-cli"
              className="bg-cyan-500 text-black hover:bg-cyan-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Get Started
            </Link>
            <a
              href="#basics"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See the Code
            </a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[40px]" />
              <div className="relative bg-[#0d0d0d] border-2 border-cyan-500/40 rounded-2xl p-6">
                <CLIIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. BASICS — "Function to command"
   ───────────────────────────────────────────── */

const basicsCode = `wireCLI({
  program: 'todos',
  commands: {
    add: pikkuCLICommand({
      parameters: '<text>',
      func: createTodo,
      description: 'Add a new todo',
      render: todoRenderer,
      options: {
        priority: {
          description: 'Set priority',
          short: 'p',
          default: 'normal',
          choices: ['low', 'normal', 'high'],
        }
      }
    }),
    list: pikkuCLICommand({
      func: listTodos,
      description: 'List all todos',
      render: todosRenderer,
      options: {
        completed: {
          description: 'Show completed only',
          short: 'c',
          default: false,
        }
      }
    }),
  }
})`;

const basicsUsage = `$ todos add "Buy milk" --priority high
✓ Created: Buy milk (priority: high)

$ todos list --completed
  1. Write docs     ✓
  2. Ship feature   ✓

$ todos --help
Usage: todos <command> [options]

Commands:
  add <text>   Add a new todo
  list         List all todos`;

function BasicsSection() {
  return (
    <section id="basics" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Basics</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Function to <span className="text-cyan-400">command</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Wire your functions to CLI commands with typed parameters, options, and auto-generated help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <CodeCard filename="cli.wiring.ts" badge="wiring.ts" icon={<CLIIcon size={15} />}>
            <CodeBlock language="typescript">{basicsCode}</CodeBlock>
          </CodeCard>

          <CodeCard filename="Terminal" badge="output">
            <CodeBlock language="bash">{basicsUsage}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Typed parameters', desc: '<required> [optional] [variadic...] — parsed and validated automatically' },
            { label: 'Options & flags', desc: 'Long flags, short aliases, defaults, choices — all from a plain config object' },
            { label: 'Auto help generation', desc: '--help is generated from your descriptions — no manual maintenance' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] font-bold mt-0.5">✓</span>
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
   3. SUBCOMMANDS — "Nested command trees"
   ───────────────────────────────────────────── */

const subcommandsCode = `wireCLI({
  program: 'app',
  options: {
    verbose: { description: 'Verbose output', short: 'v', default: false },
  },
  commands: {
    // Simple top-level command
    greet: pikkuCLICommand({
      parameters: '<name>',
      func: greetUser,
      render: greetRenderer,
    }),

    // Nested subcommands
    user: {
      description: 'User management',
      subcommands: {
        create: pikkuCLICommand({
          parameters: '<username> <email>',
          func: createUser,
          render: userRenderer,
          options: {
            admin: { description: 'Admin role', short: 'a', default: false }
          }
        }),
        list: pikkuCLICommand({
          func: listUsers,
          render: usersRenderer,
          options: {
            limit: { description: 'Max results', short: 'l' },
          }
        }),
      }
    },
  }
})`;

function SubcommandsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Subcommands</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Nested <span className="text-cyan-400">command trees</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Group related commands under namespaces. Global options cascade down to every subcommand.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CodeCard filename="cli.wiring.ts" icon={<CLIIcon size={15} />}>
            <CodeBlock language="typescript">{subcommandsCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="max-w-3xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <GitBranch className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Compose across files.</span>{' '}
            Use <code className="text-cyan-400 text-xs">defineCLICommands()</code> to define command groups in separate files, then import and compose them in one wireCLI call.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. RENDERERS — "Custom output formatting"
   ───────────────────────────────────────────── */

const rendererCode = `const todoRenderer = pikkuCLIRender<{ todo: Todo }>(
  (_services, { todo }) => {
    console.log(\`✓ Created: \${todo.text} (priority: \${todo.priority})\`)
  }
)

const todosRenderer = pikkuCLIRender<{ todos: Todo[] }>(
  (_services, { todos }) => {
    todos.forEach((t, i) => {
      const check = t.completed ? '✓' : ' '
      console.log(\`  \${i + 1}. \${t.text}  \${check}\`)
    })
  }
)

// Fallback: JSON renderer for commands without custom render
wireCLI({
  program: 'todos',
  render: jsonRenderer,  // Default for all commands
  commands: {
    add: pikkuCLICommand({
      func: createTodo,
      render: todoRenderer,  // Override per command
    }),
  }
})`;

function RenderersSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Renderers</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Custom <span className="text-cyan-400">output formatting</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Separate your display logic from your business logic. Each command gets a typed renderer that formats the function's output.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          <CodeCard filename="renderers.ts" icon={<CLIIcon size={15} />}>
            <CodeBlock language="typescript">{rendererCode}</CodeBlock>
          </CodeCard>

          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Paintbrush className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Typed from output</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-cyan-400 text-xs">pikkuCLIRender&lt;T&gt;</code> is typed from your function's return type — the data parameter is fully autocompleted.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Layers className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Cascading fallback</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Set a default renderer on the program. Override per-command. Commands without a custom renderer use the fallback.
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
   5. LOCAL vs REMOTE — "Two execution modes"
   ───────────────────────────────────────────── */

function ExecutionModesSection() {
  const modes = [
    {
      title: 'Local CLI',
      desc: 'Runs in-process. Direct access to all services — databases, caches, file system. Best for dev tools and admin scripts.',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
    },
    {
      title: 'Remote CLI',
      desc: 'Connects over WebSocket to your server. Same commands, but execution happens server-side. Best for production admin tools.',
      border: 'border-neutral-700',
      bg: 'bg-neutral-900/50',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Execution Modes</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Local or <span className="text-cyan-400">remote</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Same wireCLI config generates both a local executable and a remote client that connects over WebSocket.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {modes.map((mode, i) => (
            <div key={i} className={`${mode.bg} border ${mode.border} rounded-xl p-6`}>
              <div className="flex items-center gap-3 mb-3">
                {i === 0 ? <Terminal className="w-5 h-5 text-cyan-400" /> : <Wifi className="w-5 h-5 text-cyan-400" />}
                <h3 className="text-lg font-bold text-white">{mode.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{mode.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-6 bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 flex items-start gap-3">
          <span className="text-cyan-400 text-lg mt-0.5">→</span>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-semibold">Same commands, different execution.</span>{' '}
            Local CLI runs functions directly. Remote CLI sends the parsed command over WebSocket and streams back the rendered output.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-cyan-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start wiring CLI tools in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to scaffold a project with CLI wiring already configured.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-cyan-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-cyan-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-cyan-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/wiring/cli/local-cli"
            className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Read the CLI Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Local &amp; remote execution modes
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function CLIWirePage() {
  return (
    <Layout
      title="CLI Wire — Pikku"
      description="Wire your Pikku functions to CLI commands with typed parameters, subcommands, custom renderers, and local or remote execution."
    >
      <Hero />
      <main>
        <BasicsSection />
        <SubcommandsSection />
        <RenderersSection />
        <ExecutionModesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
