import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Scissors, Filter, FileCode, Zap,
  Server, Layers, FunctionSquare, Copy, Check,
  ArrowRight, Package,
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
    <div className="wire-hero-treeshaking w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute left-[12%] top-[35%] w-56 h-56 rounded-full bg-teal-400/6 blur-[80px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-400 border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 rounded mb-6">
            Deployment
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Same codebase.</span><br />
            <span className="text-cyan-400">Any deployment.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Pikku's CLI scans your function signatures and filters by routes, tags, or types — generating
            entry points with only the functions and services each deployment needs.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/pikku-cli/tree-shaking"
              className="bg-cyan-500 text-black hover:bg-cyan-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
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

        {/* Right: visual — CLI filter */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-cyan-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500"># Deploy only admin routes</span><br />
            <span className="text-cyan-400">$</span>{' '}
            <span className="text-white">pikku</span>{' '}
            <span className="text-cyan-300">--http-routes=/admin</span><br /><br />
            <span className="text-neutral-500"># Deploy by tag</span><br />
            <span className="text-cyan-400">$</span>{' '}
            <span className="text-white">pikku</span>{' '}
            <span className="text-cyan-300">--tags=payments</span><br /><br />
            <span className="text-neutral-500"># Deploy only HTTP wire</span><br />
            <span className="text-cyan-400">$</span>{' '}
            <span className="text-white">pikku</span>{' '}
            <span className="text-cyan-300">--types=http</span>
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
      icon: <Scissors className="w-6 h-6 text-cyan-400" />,
      title: 'CLI scans destructuring',
      desc: 'Pikku analyzes which services each function, middleware, and permission actually destructures from the services parameter.',
    },
    {
      icon: <Filter className="w-6 h-6 text-cyan-400" />,
      title: 'Filter with CLI flags',
      desc: 'Use --http-routes, --tags, or --types to include only the functions your deployment needs. Everything else is excluded.',
    },
    {
      icon: <FileCode className="w-6 h-6 text-cyan-400" />,
      title: 'Generates entry points',
      desc: 'The CLI produces typed entry files with only the needed functions, routes, and services — ready to deploy.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Three flags. <span className="text-cyan-400">Infinite architectures.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            The same source code becomes a monolith, microservices, or individual functions — just by changing CLI flags.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0d0d0d] border border-neutral-800 border-t-2 border-t-cyan-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-cyan-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CLI flag examples */}
        <div className="grid lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { flag: '--http-routes=/admin', desc: 'Only include functions mapped to admin routes', example: 'pikku --http-routes=/admin --http-routes=/auth' },
            { flag: '--tags=payments', desc: 'Only include functions tagged "payments"', example: 'pikku --tags=payments --tags=billing' },
            { flag: '--types=http', desc: 'Only include HTTP wire functions', example: 'pikku --types=http --types=cron' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5">
              <code className="text-cyan-400 text-sm font-bold">{item.flag}</code>
              <p className="text-sm text-neutral-400 mt-2 mb-3">{item.desc}</p>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-500">
                $ {item.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. THREE ARCHITECTURES
   ───────────────────────────────────────────── */

function ArchitecturesSection() {
  const architectures = [
    {
      icon: <Server className="w-7 h-7 text-cyan-400" />,
      name: 'Monolith',
      description: 'Run everything in one process',
      command: 'pikku',
      bundleSize: '~2.8 MB',
      includes: 'All functions, all protocols',
    },
    {
      icon: <Layers className="w-7 h-7 text-cyan-400" />,
      name: 'Microservices',
      description: 'Split by domain or feature',
      command: 'pikku --http-routes=/admin',
      altCommand: 'pikku --tags=admin',
      bundleSize: '~180 KB',
      includes: 'Only admin routes + dependencies',
    },
    {
      icon: <FunctionSquare className="w-7 h-7 text-cyan-400" />,
      name: 'Functions',
      description: 'One function per deployment',
      command: 'pikku --http-routes=/users/:id --types=http',
      bundleSize: '~50 KB',
      includes: 'Single endpoint + minimal runtime',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Architectures</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            One codebase, <span className="text-cyan-400">three shapes.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            No code changes. Just different CLI flags for different deployments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {architectures.map((arch, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                  {arch.icon}
                </div>
              </div>
              <h3 className="font-jakarta text-xl font-bold text-white mb-2">{arch.name}</h3>
              <p className="text-sm text-neutral-400 mb-4">{arch.description}</p>
              <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-500 mb-1">
                $ {arch.command}
              </div>
              {arch.altCommand && (
                <div className="text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-500 mb-1 mt-1">
                  $ {arch.altCommand}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="text-sm font-bold text-cyan-400 mb-1">{arch.bundleSize}</div>
                <div className="text-xs text-neutral-500">{arch.includes}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. SERVICE LOADING
   ───────────────────────────────────────────── */

const requiredServicesCode = `// .pikku/pikku-services.gen.ts  (auto-generated)
export const requiredSingletonServices = {
  'database': true,     // used by getUser, deleteUser
  'audit': true,        // used by deleteUser
  'cache': false,       // not used by any wired function
  'jwt': true,          // used by auth middleware
} as const`;

const dynamicImportCode = `import { requiredSingletonServices } from '.pikku/pikku-services.gen.js'

export const createSingletonServices = pikkuServices(
  async (config) => {
    const logger = new ConsoleLogger()

    // Only create JWT if wired functions actually need it
    let jwt: JWTService | undefined
    if (requiredSingletonServices.jwt) {
      const { JoseJWTService } = await import('@pikku/jose')
      jwt = new JoseJWTService(keys, logger)
    }

    return { config, logger, jwt }
  }
)`;

function ServiceLoadingSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Service Loading</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Only load what you <span className="text-cyan-400">actually use.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            The CLI generates a <code className="text-cyan-400 text-base">requiredSingletonServices</code> map. Guard
            heavy imports with dynamic <code className="text-cyan-400 text-base">import()</code> — unused services
            never load.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          <CodeCard filename=".pikku/pikku-services.gen.ts" badge="auto-generated" icon={<Zap className="w-4 h-4 text-cyan-400" />}>
            <CodeBlock language="typescript">{requiredServicesCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="services.ts" badge="your code" icon={<Package className="w-4 h-4 text-cyan-400" />}>
            <CodeBlock language="typescript">{dynamicImportCode}</CodeBlock>
          </CodeCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: 'Faster cold starts', desc: 'Health-check endpoints don\'t load your database driver. Payment endpoints don\'t load your email SDK.' },
            { label: 'Same codebase', desc: 'Deploy as monolith, microservices, or individual functions — filter with CLI flags, no code changes.' },
            { label: 'Type-safe', desc: 'RequiredSingletonServices narrows your factory return type so TypeScript catches missing services at compile time.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] font-bold mt-0.5">&#10003;</span>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-cyan-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Deploy your way
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One codebase, any architecture. Start building with tree-shaking from day one.
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
            to="/docs/pikku-cli/tree-shaking"
            className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Tree-Shaking Guide
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

export default function TreeShakingPage() {
  return (
    <Layout
      title="Tree-Shaking — Same Codebase, Any Deployment"
      description="Pikku's CLI scans your function signatures, filters by routes, tags, or types, and generates entry points with only what each deployment needs."
    >
      <Hero />
      <main>
        <HowItWorksSection />
        <ArchitecturesSection />
        <ServiceLoadingSection />
        <CTASection />
      </main>
    </Layout>
  );
}
