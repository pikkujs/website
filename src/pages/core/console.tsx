import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  LayoutDashboard, FunctionSquare, GitBranch, Bot,
  Settings, Search, ArrowRight, BookOpen,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

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
    <div className="wire-hero-console w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-white/8 blur-[120px]" />
        <div className="absolute right-[25%] top-[30%] w-56 h-56 rounded-full bg-white/[0.04] blur-[80px]" />
      </div>

      <header className="relative max-w-screen-xl mx-auto w-full pt-16 pb-12 lg:pt-24 lg:pb-16 px-6 ">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-white/20 bg-white/[0.06] px-3 py-1 rounded mb-6">
          Platform
        </span>
        <Heading as="h1" className="font-jakarta text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="text-white">See everything.</span><br />
          <span className="text-primary">Control everything.</span>
        </Heading>
        <p className="text-xl font-medium leading-relaxed text-neutral-300 max-w-2xl mb-4">
          The Pikku Console is your visual control plane — explore functions, run workflows, test agents, and manage configuration in one UI.
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          A static site that connects to your running Pikku app. No extra server, no hosted service — just open and go.
        </p>
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-rose-300/70 bg-white/[0.06] border border-white/12 px-3 py-1 rounded-full">
          Alpha
        </span>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. FEATURE GRID
   ───────────────────────────────────────────── */

const consoleFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Overview Dashboard',
    desc: 'See every registered function, wire, and service at a glance. Filter by type, tag, or addon.',
    color: 'text-white/55',
    bg: 'bg-white/[0.06]',
    border: 'border-white/12',
  },
  {
    icon: FunctionSquare,
    title: 'Functions Explorer',
    desc: 'Browse all functions with their input/output schemas, permissions, versions, and connected wires.',
    color: 'text-white/55',
    bg: 'bg-white/[0.06]',
    border: 'border-white/12',
  },
  {
    icon: GitBranch,
    title: 'Workflows',
    desc: 'Visualize workflow graphs, inspect step states, and trigger runs with custom input directly from the UI.',
    color: 'text-white/55',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
  },
  {
    icon: Bot,
    title: 'Agents',
    desc: 'Chat playground for AI agents. Send messages, inspect tool calls, and debug agent behavior in real time.',
    color: 'text-white/55',
    bg: 'bg-white/[0.06]',
    border: 'border-white/12',
  },
  {
    icon: Settings,
    title: 'Configuration',
    desc: 'Manage secrets, OAuth2 credentials, and variables per environment — no need to touch .env files.',
    color: 'text-white/55',
    bg: 'bg-white/[0.06]',
    border: 'border-white/12',
  },
  {
    icon: Search,
    title: 'Spotlight Search',
    desc: 'Cmd+K to find any function, service, or wire instantly. Jump straight to docs, schemas, or configuration.',
    color: 'text-white/55',
    bg: 'bg-white/[0.06]',
    border: 'border-white/12',
  },
];

function FeaturesGrid() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="mb-12">
          <SectionLabel>What's Inside</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Your entire app, <span className="text-primary">visible</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl">
            Six panels that give you full observability and control over your Pikku application.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {consoleFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 hover:border-white/12 transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${feat.bg} border ${feat.border} mb-4`}>
                  <Icon size={20} className={feat.color} />
                </div>
                <h3 className="font-jakarta text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-white/5 blur-[80px]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Try the Console
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl">
          The Console ships with the Pikku CLI. Run your app and open the visual control plane.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/docs/console"
            className="bg-primary text-white hover:bg-primary px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-black/20"
          >
            Console Docs <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/docs/console/features"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
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

export default function ConsolePage() {
  return (
    <Layout
      title="Console — Visual Control Plane for Pikku"
      description="The Pikku Console lets you explore functions, run workflows, test agents, and manage secrets and variables in a single visual UI."
    >
      <Hero />
      <main>
        <FeaturesGrid />
        <CTASection />
      </main>
    </Layout>
  );
}
