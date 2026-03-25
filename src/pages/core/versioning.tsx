import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  ArrowRight, Hash, FileJson, ShieldCheck,
  Lock, Search,
  Copy, Check, GitCommit,
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

function TerminalBlock({ title, status, statusColor, children }: {
  title: string;
  status?: string;
  statusColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border ${statusColor === 'red' ? 'border-red-500/30' : 'border-green-500/30'} overflow-hidden`}>
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-sm font-semibold text-neutral-200">{title}</span>
        {status && (
          <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded ${statusColor === 'red' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
            {status}
          </span>
        )}
      </div>
      <div className="p-5 bg-[#0a0a0f] font-mono text-xs leading-relaxed">
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
    <div className="wire-hero-function w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-purple-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-fuchsia-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-400/40 bg-purple-400/10 px-3 py-1 rounded mb-6">
            Core Concept
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Evolve functions.</span><br />
            <span className="text-purple-400">Keep workflows running.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Pikku hashes every function's contract — name, input schema, output schema — so your workflows and AI agents keep running even as functions evolve.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/core-features/versioning"
              className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              Read the Docs
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: visual — contract hash */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-purple-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Every function has a contract</span><br />
            <span className="text-purple-400">hash</span>
            <span className="text-white">(</span><br />
            <span className="text-neutral-300 ml-4"><span className="text-yellow-300">functionName</span></span>
            <span className="text-neutral-600 ml-2">// "getBook"</span><br />
            <span className="text-neutral-300 ml-4">+ <span className="text-cyan-300">inputSchema</span></span>
            <span className="text-neutral-600 ml-2">// z.object({'{...}'})</span><br />
            <span className="text-neutral-300 ml-4">+ <span className="text-green-300">outputSchema</span></span>
            <span className="text-neutral-600 ml-2">// z.object({'{...}'})</span><br />
            <span className="text-white">{')'}</span>
            <span className="text-neutral-600 ml-2">→</span>
            <span className="text-purple-400 ml-2">a1b2c3d4e5f6g7h8</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. HOW IT WORKS — 3 step pipeline
   ───────────────────────────────────────────── */

const versionsJsonCode = `{
  "manifestVersion": 1,
  "contracts": {
    "createTodo": {
      "latest": 1,
      "versions": {
        "1": "a1b2c3d4e5f6g7h8"
      }
    },
    "getTodos": {
      "latest": 2,
      "versions": {
        "1": "i9j0k1l2m3n4o5p6",
        "2": "q7r8s9t0u1v2w3x4"
      }
    }
  }
}`;

function HowItWorksSection() {
  const steps = [
    {
      icon: <Hash className="w-6 h-6 text-purple-400" />,
      title: 'Hash',
      desc: 'Function name + input schema + output schema are hashed into a deterministic 16-character hex contract hash.',
      color: 'border-t-purple-500',
    },
    {
      icon: <FileJson className="w-6 h-6 text-purple-400" />,
      title: 'Track',
      desc: 'Hashes are stored in a versions.pikku.json manifest, committed to Git alongside your code. Every version has its own hash.',
      color: 'border-t-purple-500',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: 'Guard',
      desc: 'The CLI compares current contracts against the manifest on every build. Changed contract without a version bump? Build fails.',
      color: 'border-t-purple-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three steps. <span className="text-purple-400">Bulletproof contracts.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Every function's API surface is tracked, versioned, and enforced automatically.
          </p>
        </div>

        {/* Step cards with arrows */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 max-w-4xl mx-auto mb-12">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className={`flex-1 bg-[#0d0d0d] border border-neutral-800 ${step.color} border-t-2 rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  {step.icon}
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-1">
                  <ArrowRight className="w-5 h-5 text-purple-500/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* versions.pikku.json example */}
        <div className="max-w-2xl mx-auto">
          <CodeCard filename="versions.pikku.json" badge="manifest" icon={<FileJson className="w-4 h-4 text-purple-400" />}>
            <CodeBlock language="json">{versionsJsonCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. CI GATE
   ───────────────────────────────────────────── */

const ciTerminalOutput = `$ npx pikku versions check

✗ getBook — contract changed without version bump
  Input schema hash:  a1b2c3d4 → f9e8d7c6
  Output schema hash: i9j0k1l2 → z5y4x3w2

  Run: npx pikku versions update
  after bumping to version 2`;

const githubActionsYaml = `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx pikku versions check`;

function CIGateSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>CI Integration</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One line in CI. <span className="text-purple-400">Zero accidental breaking changes.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Add <code className="text-purple-400 text-base">pikku versions check</code> to your pipeline. Breaking changes fail the build with an actionable fix — before they reach production.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {/* Left: CI terminal */}
          <TerminalBlock title="CI Pipeline" status="failed" statusColor="red">
            <pre className="text-neutral-400 whitespace-pre-wrap">{ciTerminalOutput}</pre>
          </TerminalBlock>

          {/* Right: GitHub Actions YAML */}
          <CodeCard filename=".github/workflows/ci.yml" badge="GitHub Actions" icon={<GitCommit className="w-4 h-4 text-purple-400" />}>
            <CodeBlock language="yaml">{githubActionsYaml}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. VERSIONED FUNCTIONS
   ───────────────────────────────────────────── */

const versionedFuncCode = `// v1 — kept for running workflows and agents
const getBookV1 = pikkuFunc({
  title: 'Get Book',
  version: 1,
  input: z.object({ bookId: z.string() }),
  output: z.object({ title: z.string() }),
  func: async ({ db }, { bookId }) => {
    return await db.getBook(bookId)
  }
})

// v2 — the latest version, called by default
const getBook = pikkuFunc({
  title: 'Get Book',
  input: z.object({
    bookId: z.string(),
    format: z.enum(['full', 'summary'])
  }),
  output: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string()
  }),
  func: async ({ db }, { bookId, format }) => {
    return await db.getBook(bookId, format)
  }
})`;

function VersionedFunctionsSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Side-by-Side Versions</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            v1 and v2 <span className="text-purple-400">coexist.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Running workflows and AI agents keep working. New code gets the latest version. Both run across every wire — no migration needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto items-start">
          {/* Code — spans 3 cols */}
          <div className="lg:col-span-3">
            <CodeCard filename="getBook.func.ts" badge="version: 1 → 2">
              <CodeBlock language="typescript">{versionedFuncCode}</CodeBlock>
            </CodeCard>
          </div>

          {/* Highlights — spans 2 cols */}
          <div className="lg:col-span-2 space-y-4 lg:pt-4">
            {[
              { title: 'Latest by default', desc: 'New workflows and agents use the newest version automatically.' },
              { title: 'Old versions stay available', desc: 'Running workflows and AI agents keep calling v1 as long as you keep it.' },
              { title: 'Works across all wires', desc: 'HTTP, WebSocket, queue, CLI, MCP — both versions are available everywhere.' },
              { title: 'Schema hashes in Git', desc: 'Contract hashes are deterministic and diffable — every change is visible in your commit history.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[11px] font-bold mt-0.5">&#10003;</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. THE RULES
   ───────────────────────────────────────────── */

function GuaranteesSection() {
  const guarantees = [
    {
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      title: 'Shipped means locked',
      desc: 'Once a version is published, its contract can never silently change. Running workflows get exactly what they expect.',
    },
    {
      icon: <Search className="w-5 h-5 text-purple-400" />,
      title: 'Changes are caught automatically',
      desc: 'Modify a schema and the CLI knows immediately. No manual diffing, no guessing — it tells you exactly what changed.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      title: 'Every bump is intentional',
      desc: 'You decide when to create a new version. The system won\'t let you accidentally ship a breaking change — you have to mean it.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Guarantees</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            What the system <span className="text-purple-400">promises you.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Versioning you can trust — so you can evolve fast without worrying about what breaks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {guarantees.map((g, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                {g.icon}
                <h3 className="text-base font-bold text-white">{g.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. DEVELOPER WORKFLOW
   ───────────────────────────────────────────── */

function WorkflowSection() {
  const steps = [
    { title: 'Develop', desc: 'Change function inputs or outputs', command: null },
    { title: 'Check', desc: 'Detect the contract change', command: 'npx pikku versions check' },
    { title: 'Bump', desc: 'Increment version in your function', command: 'version: 2' },
    { title: 'Update', desc: 'Record the new contract hash', command: 'npx pikku versions update' },
    { title: 'Commit', desc: 'Check in the updated manifest', command: 'git commit -am "bump getBook v2"' },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Developer Workflow</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Five steps. <span className="text-purple-400">Every time.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            A repeatable workflow that makes breaking changes intentional — never accidental.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-4 text-center relative">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold mb-3">{i + 1}</span>
              <p className="text-sm font-semibold text-white mb-1">{step.title}</p>
              <p className="text-xs text-neutral-500 mb-2">{step.desc}</p>
              {step.command && (
                <code className="text-[10px] font-mono text-purple-400/80 bg-purple-500/10 px-2 py-1 rounded block">{step.command}</code>
              )}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-neutral-700 text-lg z-10">&rarr;</div>
              )}
            </div>
          ))}
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
    navigator.clipboard.writeText('npx pikku versions init');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-purple-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start versioning in 30 seconds
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One command to initialize the manifest. Every function contract is tracked from that moment on.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-purple-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-purple-400/70 select-none">$ </span>npx pikku versions init
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-purple-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/core-features/versioning"
            className="bg-purple-500 text-white hover:bg-purple-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            Read the Versioning Docs
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          MIT Licensed &nbsp;&middot;&nbsp; Works with Express, Fastify, Lambda &amp; Cloudflare
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function VersioningPage() {
  return (
    <Layout
      title="Versioning & Contracts — Evolve Functions, Keep Workflows Running"
      description="Pikku hashes every function's contract and catches breaking changes before deploy. Workflows and AI agents keep running even as functions evolve."
    >
      <Hero />
      <main>
        <HowItWorksSection />
        <CIGateSection />
        <VersionedFunctionsSection />
        <GuaranteesSection />
        <WorkflowSection />
        <CTASection />
      </main>
    </Layout>
  );
}
