import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Wrench, Database, RefreshCw, TreePine,
  Copy, Check, Zap, Package,
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
    <div className="wire-hero-services w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-yellow-500/10 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-purple-400/6 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-yellow-400 border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 rounded mb-6">
            Core Concept
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Your toolbox.</span><br />
            <span className="text-yellow-400">Injected.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Two factory functions — <code className="text-yellow-400 text-lg">pikkuServices</code> and{' '}
            <code className="text-yellow-400 text-lg">pikkuWireServices</code> — wire your entire
            application together with full type safety and tree-shaking.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/core-features/services"
              className="bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              Read the Docs
            </Link>
            <a
              href="#two-factories"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: visual — service destructuring */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-yellow-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Every function destructures</span><br />
            <span className="text-neutral-500">// only what it needs</span><br />
            <span className="text-purple-400">async</span>{' '}
            <span className="text-white">(</span><br />
            <span className="text-neutral-300 ml-4">{'{ '}<span className="text-yellow-300">db</span>{', '}<span className="text-yellow-300">logger</span>{', '}<span className="text-yellow-300">jwt</span>{' }'}</span>
            <span className="text-neutral-600 ml-2">// services</span><br />
            <span className="text-white ml-4">...</span><br />
            <span className="text-white">{') => { ... }'}</span><br /><br />
            <span className="text-neutral-500">// Pikku tracks which services</span><br />
            <span className="text-neutral-500">// each function uses → tree-shaking</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. THE TWO FACTORIES
   ───────────────────────────────────────────── */

const singletonCode = `import { pikkuServices } from '#pikku'

export const createSingletonServices = pikkuServices(
  async (config, existingServices) => {
    const logger = new ConsoleLogger()
    const database = new DatabasePool(config.database)
    await database.connect()

    const jwt = new JoseJWTService(
      async () => [{ id: 'my-key', value: JWT_SECRET }],
      logger
    )

    return {
      config,
      logger,
      database,
      jwt,
      books: new BookService(),
    }
  }
)`;

const wireCode = `import { pikkuWireServices } from '#pikku'

export const createWireServices = pikkuWireServices(
  async (singletonServices, wire) => {
    // Created fresh per request / queue job / CLI command
    // Pikku merges these with singleton services automatically
    return {
      userSession: createUserSessionService(wire),
      dbTransaction: new DatabaseTransaction(
        singletonServices.database
      ),
    }
  }
)`;

function TwoFactoriesSection() {
  const factories = [
    {
      icon: <Database className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'pikkuServices — Singletons',
      desc: 'Created once at startup, shared across all requests. Database pools, loggers, JWT, third-party clients. Receives (config, existingServices).',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'pikkuWireServices — Per-request',
      desc: 'Created fresh per HTTP request, queue job, CLI command, or WebSocket lifetime. Sessions, transactions, audit contexts. Receives (singletonServices, wire).',
    },
    {
      icon: <Wrench className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />,
      title: 'Destructure what you need',
      desc: 'Functions declare dependencies explicitly. Pikku merges singleton + wire services so your function sees one flat object. Only pull what you use.',
    },
  ];

  return (
    <section id="two-factories" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>The Two Factories</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Two functions. <span className="text-yellow-400">Everything wired.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            <code className="text-yellow-400 text-base">pikkuServices</code> creates singletons at startup.{' '}
            <code className="text-yellow-400 text-base">pikkuWireServices</code> creates per-request services. That's the whole model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Left: feature cards */}
          <div className="space-y-5">
            {factories.map((feat, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {feat.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">{feat.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: code examples stacked */}
          <div className="space-y-6">
            <CodeCard filename="services.ts" badge="startup" icon={<Database className="w-4 h-4 text-yellow-400" />}>
              <CodeBlock language="typescript">{singletonCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="services.ts" badge="per-request" icon={<RefreshCw className="w-4 h-4 text-yellow-400" />}>
              <CodeBlock language="typescript">{wireCode}</CodeBlock>
            </CodeCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. TREE-SHAKING
   ───────────────────────────────────────────── */

const requiredServicesCode = `// .pikku/pikku-services.gen.ts  (auto-generated)
export const requiredSingletonServices = {
  'database': true,     // used by getUser, deleteUser
  'audit': true,        // used by deleteUser
  'cache': false,       // not used by any wired function
  'jwt': true,          // used by auth middleware
} as const

export type RequiredSingletonServices =
  Pick<SingletonServices, 'database' | 'audit' | 'jwt'>
  & Partial<Omit<SingletonServices, 'database' | 'audit' | 'jwt'>>`;

const dynamicImportCode = `import { requiredSingletonServices } from '.pikku/pikku-services.gen.js'
import { pikkuServices } from '#pikku'

export const createSingletonServices = pikkuServices(
  async (config) => {
    const logger = new ConsoleLogger()

    // Only create JWT if wired functions actually need it
    let jwt: JWTService | undefined
    if (requiredSingletonServices.jwt) {
      const { JoseJWTService } = await import('@pikku/jose')
      jwt = new JoseJWTService(keys, logger)
    }

    // Only connect to database if needed
    let database: Database | undefined
    if (requiredSingletonServices.database) {
      database = await createDatabase(config.databaseUrl)
    }

    return { config, logger, jwt, database }
  }
)`;

function TreeShakingSection() {
  const steps = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: 'CLI scans destructuring',
      desc: 'Pikku analyzes which services each function, middleware, and permission actually destructures from the services parameter.',
    },
    {
      icon: <Package className="w-5 h-5 text-yellow-400" />,
      title: 'Generates requiredSingletonServices',
      desc: 'A boolean map marking each service true or false. Plus a RequiredSingletonServices type that narrows your factory\'s return type.',
    },
    {
      icon: <TreePine className="w-5 h-5 text-yellow-400" />,
      title: 'Dynamic imports skip unused services',
      desc: 'Guard heavy imports with if (requiredSingletonServices.x). When a service isn\'t needed, the import is never executed — zero cold-start overhead.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Tree-Shaking</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Only load what you <span className="text-yellow-400">actually use.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku's CLI generates <code className="text-yellow-400 text-base">requiredSingletonServices</code> — a map of which services your filtered functions need. Pair it with dynamic <code className="text-yellow-400 text-base">import()</code> calls to skip everything else.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
          {steps.map((step, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-yellow-500 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                {step.icon}
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CodeCard filename=".pikku/pikku-services.gen.ts" badge="auto-generated" icon={<Zap className="w-4 h-4 text-yellow-400" />}>
            <CodeBlock language="typescript">{requiredServicesCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="services.ts" badge="your code" icon={<TreePine className="w-4 h-4 text-yellow-400" />}>
            <CodeBlock language="typescript">{dynamicImportCode}</CodeBlock>
          </CodeCard>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {[
            { label: 'Faster cold starts', desc: 'Health-check endpoints don\'t load your database driver. Payment endpoints don\'t load your email SDK.' },
            { label: 'Same codebase', desc: 'Deploy as monolith, microservices, or individual functions — filter with CLI flags, no code changes.' },
            { label: 'Type-safe', desc: 'RequiredSingletonServices narrows your factory return type so TypeScript catches missing services at compile time.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-[11px] font-bold mt-0.5">&#10003;</span>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-yellow-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Start building in 5 minutes
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Scaffold a project with services pre-configured. Add your own, destructure what you need, and deploy anywhere.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-yellow-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-yellow-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-yellow-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/core-features/services"
            className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            Read the Services Docs
          </Link>
          <Link
            to="/docs/pikku-cli/tree-shaking"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Tree-Shaking Guide
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

export default function ServicesPage() {
  return (
    <Layout
      title="Services — Your Toolbox, Injected"
      description="Pikku services use two factory functions — pikkuServices and pikkuWireServices — with automatic tree-shaking via RequiredSingletonServices."
    >
      <Hero />
      <main>
        <TwoFactoriesSection />
        <TreeShakingSection />
        <CTASection />
      </main>
    </Layout>
  );
}
