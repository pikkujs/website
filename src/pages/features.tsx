import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { wireTypes, wireCategories, type WireCategory } from '../data/wireTypes';
import { Code2, GitBranch, Wrench, Shield, Copy, Check, Scissors, Package, Puzzle, Monitor, Key } from 'lucide-react';

/* ─────────────────────────────────────────────
   Core concept cards data
   ───────────────────────────────────────────── */

const coreConcepts = [
  {
    title: 'Functions',
    url: '/core/function',
    description: 'Your logic, nothing else. One function signature across every protocol.',
    icon: Code2,
    accent: 'purple',
  },
  {
    title: 'Services',
    url: '/core/services',
    description: 'Two factory functions — pikkuServices and pikkuWireServices — with automatic tree-shaking.',
    icon: Wrench,
    accent: 'yellow',
  },
  {
    title: 'Security',
    url: '/core/security',
    description: 'Sessions, permissions, and auth middleware — one API across every transport.',
    icon: Shield,
    accent: 'green',
  },
  {
    title: 'Versioning',
    url: '/core/versioning',
    description: 'Evolve functions, keep workflows running. Contract hashing and CI enforcement.',
    icon: GitBranch,
    accent: 'fuchsia',
  },
  {
    title: 'Secrets & Variables',
    url: '/core/secrets',
    description: 'Type-safe config with Zod schemas — validated at startup, managed from code or Console.',
    icon: Key,
    accent: 'amber',
  },
];

/* ─────────────────────────────────────────────
   npm copy helper
   ───────────────────────────────────────────── */

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group flex items-center gap-3 bg-white/[0.04] border border-white/10 hover:border-purple-500/40 rounded-xl px-5 py-3.5 font-mono text-sm text-neutral-300 transition-all hover:bg-white/[0.06] cursor-pointer"
    >
      <span className="text-purple-400">$</span>
      <span>{command}</span>
      {copied
        ? <Check size={14} className="ml-auto text-green-400" />
        : <Copy size={14} className="ml-auto text-neutral-600 group-hover:text-neutral-400 transition-colors" />
      }
    </button>
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
        <div className="absolute left-[10%] top-[30%] w-56 h-56 rounded-full bg-fuchsia-400/6 blur-[80px]" />
      </div>

      <header className="relative max-w-screen-xl mx-auto w-full pt-16 pb-12 lg:pt-24 lg:pb-16 px-6 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-400/40 bg-purple-400/10 px-3 py-1 rounded mb-6">
          Features
        </span>
        <Heading as="h1" className="font-jakarta text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="text-white">Everything Pikku </span>
          <span className="text-purple-400">can do.</span>
        </Heading>
        <p className="text-xl font-medium leading-relaxed text-neutral-400 max-w-2xl mx-auto">
          Two core concepts, ten wire types. Write once, connect everywhere.
        </p>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. CORE CONCEPTS
   ───────────────────────────────────────────── */

function CoreConceptsSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 lg:py-20">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-8">Core Concepts</p>
      <div className="grid md:grid-cols-2 gap-6">
        {coreConcepts.map((concept) => {
          const Icon = concept.icon;
          return (
            <Link
              key={concept.title}
              to={concept.url}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] no-underline"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon size={22} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {concept.title}
                  </h3>
                  <p className="text-base text-neutral-400 leading-relaxed m-0">
                    {concept.description}
                  </p>
                </div>
              </div>
              <span className="block mt-4 ml-[4.25rem] text-sm font-semibold text-purple-500/60 group-hover:text-purple-400 transition-colors">
                Learn more &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Deployment cards data
   ───────────────────────────────────────────── */

const deploymentCards = [
  {
    title: 'Tree-Shaking',
    url: '/core/treeshaking',
    description: 'Filter by routes, tags, or types — deploy only what each service needs.',
    icon: Scissors,
    accent: 'cyan',
  },
  {
    title: 'Built-in Services',
    url: '/core/built-in-services',
    description: 'JWT, queues, workflows, AI storage, secrets — every interface and provider.',
    icon: Package,
    accent: 'orange',
  },
];

/* ─────────────────────────────────────────────
   3. WIRES GRID
   ───────────────────────────────────────────── */

function WiresSection() {
  const grouped = wireCategories.reduce(
    (acc, cat) => {
      acc[cat] = wireTypes.filter((w) => w.category === cat);
      return acc;
    },
    {} as Record<WireCategory, typeof wireTypes>,
  );

  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-16 lg:pb-20">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-8">Wires</p>

      <div className="space-y-12">
        {wireCategories.map((cat) => (
          <div key={cat}>
            <h3 className="font-jakarta text-lg font-semibold text-neutral-300 mb-5">{cat}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped[cat].map((wire) => {
                const Icon = wire.icon;
                return (
                  <Link
                    key={wire.id}
                    to={wire.url}
                    className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] no-underline"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Icon size={18} className="text-neutral-300 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-jakarta text-sm font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {wire.label}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed m-0">
                        {wire.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. DEPLOYMENT
   ───────────────────────────────────────────── */

function DeploymentSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-16 lg:pb-20">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-8">Deployment</p>
      <div className="grid md:grid-cols-2 gap-6">
        {deploymentCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.url}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] no-underline"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon size={22} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-base text-neutral-400 leading-relaxed m-0">
                    {card.description}
                  </p>
                </div>
              </div>
              <span className="block mt-4 ml-[4.25rem] text-sm font-semibold text-purple-500/60 group-hover:text-purple-400 transition-colors">
                Learn more &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Platform cards data
   ───────────────────────────────────────────── */

const platformCards = [
  {
    title: 'Console',
    url: '/core/console',
    description: 'Visual control plane — explore functions, run workflows, test agents, and manage config.',
    icon: Monitor,
    accent: 'rose',
  },
];

/* ─────────────────────────────────────────────
   Ecosystem cards data
   ───────────────────────────────────────────── */

const ecosystemCards = [
  {
    title: 'Addons',
    url: '/core/addons',
    description: 'Bundle functions, services, and secrets into npm packages. Install once, wire once.',
    icon: Puzzle,
    accent: 'indigo',
  },
];

/* ─────────────────────────────────────────────
   5. PLATFORM
   ───────────────────────────────────────────── */

function PlatformSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-16 lg:pb-20">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-8">Platform</p>
      <div className="grid md:grid-cols-2 gap-6">
        {platformCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.url}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] no-underline"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon size={22} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-base text-neutral-400 leading-relaxed m-0">
                    {card.description}
                  </p>
                </div>
              </div>
              <span className="block mt-4 ml-[4.25rem] text-sm font-semibold text-purple-500/60 group-hover:text-purple-400 transition-colors">
                Learn more &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. ECOSYSTEM
   ───────────────────────────────────────────── */

function EcosystemSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-16 lg:pb-20">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-8">Ecosystem</p>
      <div className="grid md:grid-cols-2 gap-6">
        {ecosystemCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.url}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] no-underline"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon size={22} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-base text-neutral-400 leading-relaxed m-0">
                    {card.description}
                  </p>
                </div>
              </div>
              <span className="block mt-4 ml-[4.25rem] text-sm font-semibold text-purple-500/60 group-hover:text-purple-400 transition-colors">
                Learn more &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-20 lg:pb-28">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 lg:p-14 text-center">
        <Heading as="h2" className="font-jakarta text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to build?
        </Heading>
        <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
          Scaffold a new project in seconds and start wiring functions to any protocol.
        </p>

        <div className="flex justify-center mb-8">
          <CopyCommand command="npm create pikku@latest" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/docs"
            className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-purple-500/20 no-underline"
          >
            Read the Docs
          </Link>
          <a
            href="https://github.com/pikkujs/pikku"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function FeaturesPage(): React.ReactNode {
  return (
    <Layout title="Features" description="Everything Pikku can do — core concepts and wire types for connecting your functions to any protocol.">
      <main className="bg-[#0a0a0f] text-white min-h-screen">
        <Hero />
        <CoreConceptsSection />
        <WiresSection />
        <DeploymentSection />
        <PlatformSection />
        <EcosystemSection />
        <CTASection />
      </main>
    </Layout>
  );
}
