import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  KeyRound, UserCheck, ListTodo, GitMerge,
  Brain, HardDrive, Radio, FileText,
  Shield, Settings, Clock, Rocket,
  Copy, Check,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

function ProviderBadge({ name }: { name: string }) {
  return (
    <span className="inline-block text-[11px] font-mono font-medium bg-orange-500/10 text-orange-400/80 border border-orange-500/20 rounded px-2 py-0.5">
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Service data
   ───────────────────────────────────────────── */

interface ServiceEntry {
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  providers: string[];
  docUrl?: string;
}

interface ServiceGroup {
  title: string;
  services: ServiceEntry[];
}

const serviceGroups: ServiceGroup[] = [
  {
    title: 'Auth & Identity',
    services: [
      {
        name: 'JWT',
        description: 'Token signing & verification for stateless auth.',
        icon: KeyRound,
        providers: ['@pikku/jose'],
        docUrl: '/docs/core-features/user-sessions',
      },
      {
        name: 'Sessions',
        description: 'User session management across all wire types.',
        icon: UserCheck,
        providers: ['built-in'],
        docUrl: '/docs/core-features/user-sessions',
      },
    ],
  },
  {
    title: 'Data & Storage',
    services: [
      {
        name: 'Queues',
        description: 'Background job processing with retries and scheduling.',
        icon: ListTodo,
        providers: ['@pikku/bullmq', '@pikku/pg-boss', '@pikku/sqs'],
        docUrl: '/docs/wiring/queue',
      },
      {
        name: 'Workflows',
        description: 'Multi-step stateful processes with persistence.',
        icon: GitMerge,
        providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'],
        docUrl: '/docs/wiring/workflows',
      },
      {
        name: 'AI Storage',
        description: 'Conversation and context persistence for AI agents.',
        icon: Brain,
        providers: ['@pikku/pg', '@pikku/kysely'],
      },
      {
        name: 'Content',
        description: 'File storage and retrieval with pluggable backends.',
        icon: HardDrive,
        providers: ['local', '@pikku/s3'],
      },
      {
        name: 'Channels',
        description: 'Pub/sub messaging for real-time communication.',
        icon: Radio,
        providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'],
      },
    ],
  },
  {
    title: 'Infrastructure',
    services: [
      {
        name: 'Logger',
        description: 'Structured logging across all wire types.',
        icon: FileText,
        providers: ['console', '@pikku/pino'],
      },
      {
        name: 'Schema Validation',
        description: 'Input and output validation at wire boundaries.',
        icon: Shield,
        providers: ['@pikku/ajv', '@pikku/cfworker'],
      },
      {
        name: 'Secrets',
        description: 'Secure secret resolution from external stores.',
        icon: KeyRound,
        providers: ['local', '@pikku/gopass', '@pikku/aws-secrets'],
        docUrl: '/docs/addon/secrets',
      },
      {
        name: 'Variables',
        description: 'Runtime configuration variables.',
        icon: Settings,
        providers: ['built-in'],
      },
      {
        name: 'Scheduler',
        description: 'Cron and delayed job scheduling.',
        icon: Clock,
        providers: ['@pikku/bullmq', '@pikku/pg-boss'],
        docUrl: '/docs/wiring/scheduled-tasks',
      },
      {
        name: 'Deployment',
        description: 'Registry and metadata for deployed functions.',
        icon: Rocket,
        providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'],
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-builtins w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute left-[10%] top-[30%] w-56 h-56 rounded-full bg-amber-400/6 blur-[80px]" />
      </div>

      <header className="relative max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-orange-400 border border-orange-400/40 bg-orange-400/10 px-3 py-1 rounded mb-6">
          Deployment
        </span>
        <Heading as="h1" className="font-jakarta text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="text-white">Built-in </span>
          <span className="text-orange-400">services.</span>
        </Heading>
        <p className="text-xl font-medium leading-relaxed text-neutral-400 max-w-2xl mx-auto">
          Every interface Pikku ships, with the providers you can plug in. One import away.
        </p>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. SERVICE GRID
   ───────────────────────────────────────────── */

function ServiceGridSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 lg:py-20">
      <div className="space-y-16">
        {serviceGroups.map((group) => (
          <div key={group.title}>
            <SectionLabel>{group.title}</SectionLabel>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.services.map((service) => {
                const Icon = service.icon;
                const content = (
                  <div
                    className={`group relative bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 transition-all ${service.docUrl ? 'hover:border-orange-500/30 hover:bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-jakarta text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-neutral-400 leading-relaxed m-0">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {service.providers.map((p) => (
                        <ProviderBadge key={p} name={p} />
                      ))}
                    </div>
                    {service.docUrl && (
                      <span className="absolute bottom-4 right-5 text-xs font-semibold text-orange-500/50 group-hover:text-orange-400 transition-colors">
                        Docs &rarr;
                      </span>
                    )}
                  </div>
                );

                return service.docUrl ? (
                  <Link key={service.name} to={service.docUrl} className="no-underline">
                    {content}
                  </Link>
                ) : (
                  <div key={service.name}>{content}</div>
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
   3. CTA
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-orange-500/6 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Ready to build?
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          All services are included in the scaffold. Pick your providers and start shipping.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-orange-500/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-orange-400/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
            title="Copy to clipboard"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-orange-400" />
              : <Copy className="w-3.5 h-3.5 text-white/70" />
            }
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/core-features/services"
            className="bg-orange-500 text-black hover:bg-orange-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            Services Docs
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

export default function BuiltInServicesPage() {
  return (
    <Layout
      title="Built-in Services — Every Interface & Provider"
      description="Every service interface Pikku ships — JWT, sessions, queues, workflows, AI storage, content, channels, logger, secrets, and more — with pluggable providers."
    >
      <Hero />
      <main>
        <ServiceGridSection />
        <CTASection />
      </main>
    </Layout>
  );
}
