import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {
  Key, Variable, ShieldCheck, RefreshCw,
  ArrowRight, BookOpen, Monitor,
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
    <div className="wire-hero-secrets w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-amber-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-yellow-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded mb-6">
            Core Concept
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Type-safe config.</span><br />
            <span className="text-amber-400">Zero guesswork.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            Declare secrets and variables with Zod schemas. Every value is validated, typed, and manageable from the Console or environment.
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/docs/core-features/secrets"
              className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Secrets Docs
            </Link>
            <Link
              to="/docs/core-features/variables"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            >
              Variables Docs
            </Link>
          </div>
        </div>

        {/* Right: visual */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="bg-[#0d0d0d] border-2 border-amber-500/30 rounded-2xl p-8 font-mono text-sm leading-relaxed">
            <span className="text-neutral-500">// Declare a typed secret</span><br />
            <span className="text-amber-400">wireSecret</span>
            <span className="text-white">{'({'}</span><br />
            <span className="text-neutral-300 ml-4">name: <span className="text-green-300">'DATABASE_CONFIG'</span>,</span><br />
            <span className="text-neutral-300 ml-4">schema: z.object({'{'}</span><br />
            <span className="text-neutral-300 ml-8">host: z.string(),</span><br />
            <span className="text-neutral-300 ml-8">port: z.number(),</span><br />
            <span className="text-neutral-300 ml-8">password: z.string()</span><br />
            <span className="text-neutral-300 ml-4">{'}'})</span><br />
            <span className="text-white">{'})'}</span>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. SECRETS
   ───────────────────────────────────────────── */

const secretsCode = `// Declare a secret with a Zod schema
wireSecret({
  name: 'STRIPE_CONFIG',
  schema: z.object({
    apiKey: z.string().startsWith('sk_'),
    webhookSecret: z.string()
  })
})

// In your function — fully typed
const config = await secrets.getSecretJSON('STRIPE_CONFIG')
// config.apiKey   → string (autocompleted)
// config.webhookSecret → string (autocompleted)`;

function SecretsSection() {
  const features = [
    {
      icon: <Key className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'Schema-validated secrets',
      desc: 'Every secret is declared with a Zod schema. If a value is missing or the wrong shape, your app fails fast at startup — not at 3 AM.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: 'TypedSecretService',
      desc: 'The generated service knows every secret name and its shape. getSecretJSON returns the exact type — no casting, no as any.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Secrets</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Secrets with <span className="text-amber-400">superpowers</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Declare once with wireSecret. Read anywhere with full type safety and runtime validation.
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

          <CodeCard filename="secrets.ts" badge="wireSecret">
            <CodeBlock language="typescript">{secretsCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. VARIABLES
   ───────────────────────────────────────────── */

const variablesCode = `// Declare a variable
wireVariable({
  name: 'FEATURE_FLAGS',
  schema: z.object({
    darkMode: z.boolean(),
    maxUploadMB: z.number().default(10)
  })
})

// Read it — typed and validated
const flags = await variables.getVariableJSON('FEATURE_FLAGS')
// flags.darkMode    → boolean
// flags.maxUploadMB → number`;

function VariablesSection() {
  const comparison = [
    { label: 'Secrets', points: ['Encrypted at rest', 'Never logged or exposed', 'API keys, passwords, tokens'] },
    { label: 'Variables', points: ['Plain-text config', 'Safe to log and inspect', 'Feature flags, limits, URLs'] },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Variables</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Config that <span className="text-amber-400">types itself</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Same wireVariable pattern, same Zod schemas — but for non-sensitive configuration you can safely log and inspect.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <CodeCard filename="variables.ts" badge="wireVariable">
            <CodeBlock language="typescript">{variablesCode}</CodeBlock>
          </CodeCard>

          <div className="space-y-5">
            {comparison.map((group, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
                <h3 className="text-base font-bold mb-3 text-white flex items-center gap-2">
                  {i === 0
                    ? <Key className="w-4 h-4 text-amber-400" />
                    : <Variable className="w-4 h-4 text-amber-400" />
                  }
                  {group.label}
                </h3>
                <ul className="space-y-2">
                  {group.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-neutral-400">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. OAUTH2
   ───────────────────────────────────────────── */

const oauth2Code = `wireOAuth2Credential({
  name: 'slackOAuth',
  displayName: 'Slack OAuth',
  // Holds { clientId, clientSecret }
  secretId: 'SLACK_OAUTH_APP',
  // Updated automatically on token refresh
  tokenSecretId: 'SLACK_OAUTH_TOKENS',
  authorizationUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  scopes: ['chat:write', 'channels:read'],
})

// In your function — tokens refresh automatically
const response = await slackOAuth.request(
  'https://slack.com/api/chat.postMessage',
  {
    method: 'POST',
    body: JSON.stringify({ channel, text }),
  }
)
const data = await response.json()`;

function OAuth2Section() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>OAuth2</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Managed <span className="text-amber-400">OAuth2 tokens</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Declare credentials with wireOAuth2Credential — app secrets, token storage, authorization and token URLs. The OAuth2Client handles refresh, caching, and expiry automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <div className="space-y-5">
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <RefreshCw className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Two secrets, clear roles</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <code className="text-amber-400 text-xs">secretId</code> holds your app's <code className="text-amber-400 text-xs">clientId</code> and <code className="text-amber-400 text-xs">clientSecret</code>. <code className="text-amber-400 text-xs">tokenSecretId</code> stores access and refresh tokens — updated automatically whenever a token is refreshed.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Monitor className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold mb-1.5 text-white">Console integration</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Manage secrets, variables, and OAuth2 credentials per environment from the Console UI — no .env juggling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CodeCard filename="oauth2.ts" badge="wireOAuth2Credential">
            <CodeBlock language="typescript">{oauth2Code}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-amber-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Config done right
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Type-safe secrets and variables with Zod validation. Manage everything from code or the Console.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/core-features/secrets"
            className="bg-amber-500 text-white hover:bg-amber-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            Secrets Docs <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/docs/core-features/variables"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
            Variables Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function SecretsPage() {
  return (
    <Layout
      title="Secrets & Variables — Typed Config for Pikku"
      description="Declare secrets and variables with Zod schemas. Every value is validated, typed, and manageable from the Console or environment."
    >
      <Hero />
      <main>
        <SecretsSection />
        <VariablesSection />
        <OAuth2Section />
        <CTASection />
      </main>
    </Layout>
  );
}
