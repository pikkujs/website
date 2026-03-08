import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  FolderTree, LayoutList, Sparkles, Eye,
  MousePointerClick, RefreshCw, ArrowRight, Github,
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-teal-500/12 blur-[120px]" />
        <div className="absolute right-[25%] top-[30%] w-56 h-56 rounded-full bg-cyan-400/6 blur-[80px]" />
      </div>

      <header className="relative max-w-screen-xl mx-auto w-full pt-16 pb-12 lg:pt-24 lg:pb-16 px-6 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 border border-teal-400/40 bg-teal-400/10 px-3 py-1 rounded mb-6">
          Platform
        </span>
        <Heading as="h1" className="font-jakarta text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="text-white">Your functions. Your IDE.</span><br />
          <span className="text-teal-400">Navigate everything.</span>
        </Heading>
        <p className="text-xl font-medium leading-relaxed text-neutral-300 max-w-2xl mx-auto">
          The Pikku VS Code extension gives you full project introspection — explore functions, browse wirings, generate code, and jump to definitions without leaving your editor.
        </p>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. FEATURE GRID
   ───────────────────────────────────────────── */

const vscodeFeatures = [
  {
    icon: FolderTree,
    title: 'Function Explorer',
    desc: 'All your functions organized by tag with protocol badges. Browse inputs, outputs, and permissions at a glance.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: LayoutList,
    title: 'Wiring Dashboard',
    desc: 'Unified view of every connection: HTTP routes, channels, schedulers, queues, MCP, CLI, triggers, workflows, and agents.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Sparkles,
    title: 'Code Generation',
    desc: 'Scaffold typed functions and wirings without boilerplate — pick from pikkuFunc, sessionless, or void, plus seven transport templates.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Eye,
    title: 'CodeLens',
    desc: 'Wiring summary appears above every function definition. Click to explore connected routes, channels, and schedules.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: MousePointerClick,
    title: 'Go-to-Definition',
    desc: 'Cmd+Click on any RPC function name to jump straight to its source. Works across your entire project.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Refresh',
    desc: 'Your project re-inspects on every save. Tree views and CodeLens update instantly — no manual reload needed.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

function FeaturesGrid() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>What's Inside</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Your project, <span className="text-teal-400">at your fingertips</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Six features that make navigating and building Pikku projects effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {vscodeFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 hover:border-teal-500/20 transition-colors"
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-teal-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Try it now
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Install from the VS Code Marketplace and start exploring your Pikku project.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://marketplace.visualstudio.com/items?itemName=pikku.pikku-vscode"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-500 text-white hover:bg-teal-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/20 no-underline"
          >
            Install from Marketplace <ArrowRight className="inline w-4 h-4 ml-1" />
          </a>
          <a
            href="https://github.com/pikkujs/pikku/tree/main/packages/vscode-extension"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 no-underline"
          >
            <Github className="inline w-4 h-4 mr-2" />
            View Source
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function VSCodePage() {
  return (
    <Layout
      title="VS Code Extension — IDE Introspection for Pikku"
      description="The Pikku VS Code extension gives you full project introspection — explore functions, browse wirings, generate code, and jump to definitions."
    >
      <Hero />
      <main>
        <FeaturesGrid />
        <CTASection />
      </main>
    </Layout>
  );
}
