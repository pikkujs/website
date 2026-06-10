import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Wrench, Database, RefreshCw, TreePine, Copy, Check, Zap, Package } from 'lucide-react';
import { PaperPage, CodeCard } from '../../components/PaperLayout';
import styles from './services.module.css';

import snippets from '../../data/snippets.json';
import { snippetSourceUrl } from '../../utils/snippets';

const singletonCode = snippets.shopServices;
const wireCode = snippets.shopWireServices;

const requiredServicesCode = `// .pikku/pikku-services.gen.ts  (auto-generated)
export const requiredSingletonServices = {
  'kysely': true,        // used by getItem, createOrder, etc.
  'paymentService': true, // used by processPayment
  'logger': true,        // used everywhere
  'secrets': false,      // not used by any wired function
} as const

export type RequiredSingletonServices =
  Pick<SingletonServices, 'kysely' | 'paymentService' | 'logger'>
  & Partial<Omit<SingletonServices, 'kysely' | 'paymentService' | 'logger'>>`;

const dynamicImportCode = snippets.shopDynamicImport;

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Core Concept</span>
          <h1 className={styles.h1}>Your toolbox.<br /><em>Injected.</em></h1>
          <p className={styles.lead}>
            Two factory functions — <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>pikkuServices</code> and{' '}
            <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>pikkuWireServices</code> — wire your entire application together with full type safety and tree-shaking.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/core-features/services" className={styles.btnPrimary}>Read the Docs</Link>
            <a href="#two-factories" className={styles.btnGhost}>See How It Works</a>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'// Every function destructures'}</span><br />
          <span className={styles.hcComment}>{'// only what it needs'}</span><br />
          <span className={styles.hcKw}>async</span>{' ('}<br />
          <span style={{ marginLeft: 24 }}>{'{ '}<span className={styles.hcVar}>db</span>{', '}<span className={styles.hcVar}>logger</span>{', '}<span className={styles.hcVar}>jwt</span>{' }'}</span><br />
          <span style={{ marginLeft: 24 }}>...</span><br />
          {') => { ... }'}<br /><br />
          <span className={styles.hcComment}>{'// Pikku tracks which services'}</span><br />
          <span className={styles.hcComment}>{'// each function uses → tree-shaking'}</span>
        </div>
      </div>
    </div>
  );
}

function TwoFactoriesSection() {
  const factories = [
    { icon: <Database size={16} style={{ color: '#c2410c', flexShrink: 0, marginTop: 2 }} />, title: 'pikkuServices — Singletons', desc: 'Created once at startup, shared across all requests. Database pools, loggers, JWT, third-party clients. Receives (config, existingServices).' },
    { icon: <RefreshCw size={16} style={{ color: '#c2410c', flexShrink: 0, marginTop: 2 }} />, title: 'pikkuWireServices — Per-request', desc: 'Created fresh per HTTP request, queue job, CLI command, or WebSocket lifetime. Sessions, transactions, audit contexts. Receives (singletonServices, wire).' },
    { icon: <Wrench size={16} style={{ color: '#c2410c', flexShrink: 0, marginTop: 2 }} />, title: 'Destructure what you need', desc: "Functions declare dependencies explicitly. Pikku merges singleton + wire services so your function sees one flat object. Only pull what you use." },
  ];

  return (
    <section id="two-factories" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>The Two Factories</div>
          <h2 className={styles.h2}>Two functions. <em>Everything wired.</em></h2>
          <p className={styles.lead}>
            <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>pikkuServices</code> creates singletons at startup.{' '}
            <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>pikkuWireServices</code> creates per-request services. That's the whole model.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {factories.map((f, i) => (
              <div key={i} className={styles.card}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {f.icon}
                  <div>
                    <div className={styles.cardTitle}>{f.title}</div>
                    <p className={styles.cardBody}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CodeCard sourceUrl={snippetSourceUrl('shopServices')} filename="services.ts" badge="startup" icon={<Database size={13} style={{ color: '#c2410c' }} />}>
              <CodeBlock language="typescript">{singletonCode}</CodeBlock>
            </CodeCard>
            <CodeCard sourceUrl={snippetSourceUrl('shopWireServices')} filename="services.ts" badge="per-request" icon={<RefreshCw size={13} style={{ color: '#c2410c' }} />}>
              <CodeBlock language="typescript">{wireCode}</CodeBlock>
            </CodeCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreeShakingSection() {
  const steps = [
    { icon: <Zap size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'CLI scans destructuring', desc: "Pikku analyzes which services each function, middleware, and permission actually destructures from the services parameter." },
    { icon: <Package size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Generates requiredSingletonServices', desc: "A boolean map marking each service true or false. Plus a RequiredSingletonServices type that narrows your factory's return type." },
    { icon: <TreePine size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Dynamic imports skip unused services', desc: "Guard heavy imports with if (requiredSingletonServices.x). When a service isn't needed, the import is never executed — zero cold-start overhead." },
  ];

  const highlights = [
    { label: 'Faster cold starts', desc: "Health-check endpoints don't load your database driver. Payment endpoints don't load your email SDK." },
    { label: 'Same codebase', desc: 'Deploy as monolith, microservices, or individual functions — filter with CLI flags, no code changes.' },
    { label: 'Type-safe', desc: 'RequiredSingletonServices narrows your factory return type so TypeScript catches missing services at compile time.' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Tree-Shaking</div>
          <h2 className={styles.h2}>Only load what you <em>actually use.</em></h2>
          <p className={styles.lead}>
            Pikku's CLI generates <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>requiredSingletonServices</code> — a map of which services your filtered functions need. Pair it with dynamic <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>import()</code> calls to skip everything else.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={i} className={styles.card} style={{ borderTopWidth: 3, borderTopColor: '#c2410c' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                {s.icon}
                <div className={styles.cardTitle} style={{ margin: 0 }}>{s.title}</div>
              </div>
              <p className={styles.cardBody}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          <CodeCard filename=".pikku/pikku-services.gen.ts" badge="auto-generated" icon={<Zap size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{requiredServicesCode}</CodeBlock>
          </CodeCard>
          <CodeCard sourceUrl={snippetSourceUrl('shopDynamicImport')} filename="services.ts" badge="your code" icon={<TreePine size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{dynamicImportCode}</CodeBlock>
          </CodeCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontSize: 10, fontWeight: 700, marginTop: 2 }}>✓</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1814', marginBottom: 3 }}>{h.label}</div>
                <div style={{ fontSize: 12, color: '#9a9387' }}>{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard.writeText('npm create pikku@latest'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Start building in 5 minutes.</h2>
        <p className={styles.lead} style={{ marginBottom: 28 }}>
          Scaffold a project with services pre-configured. Add your own, destructure what you need, and deploy anywhere.
        </p>
        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npm create pikku@latest
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/services" className={styles.btnPrimary}>Read the Services Docs</Link>
          <Link to="/docs/pikku-cli/tree-shaking" className={styles.btnGhost}>Tree-Shaking Guide</Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: '#9a9387' }}>MIT Licensed · Works with Express, Fastify, Lambda &amp; Cloudflare</p>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Layout
      title="Services — Your Toolbox, Injected"
      description="Pikku services use two factory functions — pikkuServices and pikkuWireServices — with automatic tree-shaking via RequiredSingletonServices."
    >
      <PaperPage>
        <Hero />
        <main>
          <TwoFactoriesSection />
          <TreeShakingSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
