import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Puzzle, Package, Tag, Key, Upload, BookOpen,
  ArrowRight, Check,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function CodeCard({ filename, badge, children }: {
  filename: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
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
    <div className="wire-hero-addons w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-indigo-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-violet-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 rounded mb-6">
            Ecosystem
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Extend anything.</span><br />
            <span className="text-indigo-400">Share everything.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Addons bundle functions, services, secrets, and wires into a single npm package. Install one package — get an entire feature.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/addon/consuming"
              className="bg-indigo-500 text-white hover:bg-indigo-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
              Using Addons
            </Link>
            <Link
              to="/docs/addon/creating"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              Create an Addon
            </Link>
          </div>
        </div>

        {/* Right: visual */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-indigo-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Wire an addon — one line</span><br />
            <span className="text-yellow-300">wireAddon</span>
            <span className="text-white">{'({'}</span><br />
            <span className="text-neutral-300 ml-4">name: <span className="text-green-300">'redis'</span>,</span><br />
            <span className="text-neutral-300 ml-4">package: <span className="text-green-300">'@pikku/external-redis'</span></span><br />
            <span className="text-white">{'})'}</span><br />
            <br />
            <span className="text-neutral-500">// All functions are namespaced</span><br />
            <span className="text-indigo-400">await</span>{' '}
            <span className="text-white">rpc(</span>
            <span className="text-green-300">'redis:keySet'</span>
            <span className="text-white">, {'{ key, value }'})</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. CONSUMING ADDONS
   ───────────────────────────────────────────── */

const consumingCode = `// Call addon functions via namespaced RPCs
const result = await rpc('postgres:insert', {
  table: 'users',
  data: { name: 'Alice', email: 'alice@example.com' }
})

// Addons declare secrets via wireSecret —
// you provide the values through your own secret store
await secrets.getSecretJSON('POSTGRES_URL')`;

function ConsumingSection() {
  const features = [
    {
      icon: <Tag className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'Namespaced functions',
      desc: 'Every addon function is prefixed with the addon name — postgres:insert, stripe:charge — so there are never collisions.',
    },
    {
      icon: <Check className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'Full type safety',
      desc: 'Addon inputs and outputs are typed. Your IDE autocompletes addon function names, parameters, and return values.',
    },
    {
      icon: <Key className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'Secret overrides',
      desc: 'Addons declare the secrets they need. You provide the values in your environment or Console — the addon reads them transparently.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Consuming Addons</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Install. Wire. <span className="text-indigo-400">Done.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Addons are npm packages. One import, one wireAddon call, and every function, service, and secret is available.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            {features.map((feat, i) => (
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

          <CodeCard filename="app.ts" badge="consuming">
            <CodeBlock language="typescript">{consumingCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. CREATING ADDONS
   ───────────────────────────────────────────── */

const creatingSecretCode = `// src/redis.secret.ts
wireSecret({
  name: 'password',
  displayName: 'Redis Password',
  description: 'Redis authentication password',
  secretId: 'REDIS_PASSWORD',
  schema: z.string().optional(),
})`;

const creatingServicesCode = `// src/services.ts
export const createSingletonServices =
  pikkuAddonServices(async (config, { variables, secrets }) => {
    const params = await variables.getJSON('REDIS_PARAMS')
    const password = await secrets.getSecret('REDIS_PASSWORD')
    return {
      redis: new Redis({ host: params.host, password })
    }
  })`;

function CreatingSection() {
  const steps = [
    {
      icon: <Package className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'Standard npm package',
      desc: 'An addon is a package with addon: true in pikku.config.json. It exports services, secrets, variables, and functions like any Pikku app.',
    },
    {
      icon: <Puzzle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'pikkuAddonServices',
      desc: 'Your service factory receives the host app\'s variables and secrets. Return the services your addon functions need — they\'re injected automatically.',
    },
    {
      icon: <Upload className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />,
      title: 'Publish & share',
      desc: 'Publish to npm. Consumers install, call wireAddon, and provide secret values — the addon does the rest.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Creating Addons</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Build your own <span className="text-indigo-400">plugin</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Package any set of functions, services, and secrets into a reusable addon that anyone can install.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-6">
            <CodeCard filename="redis.secret.ts" badge="wireSecret">
              <CodeBlock language="typescript">{creatingSecretCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="services.ts" badge="pikkuAddonServices">
              <CodeBlock language="typescript">{creatingServicesCode}</CodeBlock>
            </CodeCard>
          </div>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  {step.icon}
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-white">{step.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
                  </div>
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
   4. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-indigo-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Extend Pikku your way
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Install community addons or build your own. Every addon is just an npm package.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/addon/consuming"
            className="bg-indigo-500 text-white hover:bg-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            Using Addons <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/docs/addon/creating"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
            Create an Addon
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function AddonsPage() {
  return (
    <Layout
      title="Addons — Extend Pikku with Plugins"
      description="Pikku addons bundle functions, services, secrets, and wires into a single npm package. Install once, wire once — get an entire feature."
    >
      <Hero />
      <main>
        <ConsumingSection />
        <CreatingSection />
        <CTASection />
      </main>
    </Layout>
  );
}
