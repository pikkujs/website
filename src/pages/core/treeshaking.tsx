import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Scissors, Filter, FileCode, Zap, Server, Layers, FunctionSquare, Copy, Check, ArrowRight, Package } from 'lucide-react';
import { PaperPage, CodeCard } from '../../components/PaperLayout';
import styles from './treeshaking.module.css';

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

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Deployment</span>
          <h1 className={styles.h1}>Same codebase.<br /><em>Any deployment.</em></h1>
          <p className={styles.lead}>
            Pikku's CLI scans your function signatures and filters by routes, tags, or types — generating entry points with only the functions and services each deployment needs.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/pikku-cli/tree-shaking" className={styles.btnPrimary}>Read the Docs</Link>
            <a href="#how-it-works" className={styles.btnGhost}>How It Works</a>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'# Deploy only admin routes'}</span><br />
          <span className={styles.hcPrompt}>$</span>{' pikku '}
          <span className={styles.hcFlag}>--http-routes=/admin</span><br /><br />
          <span className={styles.hcComment}>{'# Deploy by tag'}</span><br />
          <span className={styles.hcPrompt}>$</span>{' pikku '}
          <span className={styles.hcFlag}>--tags=payments</span><br /><br />
          <span className={styles.hcComment}>{'# Deploy only HTTP wire'}</span><br />
          <span className={styles.hcPrompt}>$</span>{' pikku '}
          <span className={styles.hcFlag}>--types=http</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: <Scissors size={20} style={{ color: '#c2410c' }} />, title: 'CLI scans destructuring', desc: 'Pikku analyzes which services each function, middleware, and permission actually destructures from the services parameter.' },
    { icon: <Filter size={20} style={{ color: '#c2410c' }} />, title: 'Filter with CLI flags', desc: 'Use --http-routes, --tags, or --types to include only the functions your deployment needs. Everything else is excluded.' },
    { icon: <FileCode size={20} style={{ color: '#c2410c' }} />, title: 'Generates entry points', desc: 'The CLI produces typed entry files with only the needed functions, routes, and services — ready to deploy.' },
  ];

  const flags = [
    { flag: '--http-routes=/admin', desc: 'Only include functions mapped to admin routes', example: 'pikku --http-routes=/admin --http-routes=/auth' },
    { flag: '--tags=payments', desc: 'Only include functions tagged "payments"', example: 'pikku --tags=payments --tags=billing' },
    { flag: '--types=http', desc: 'Only include HTTP wire functions', example: 'pikku --types=http --types=cron' },
  ];

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>How It Works</div>
          <h2 className={styles.h2}>Three flags. <em>Infinite architectures.</em></h2>
          <p className={styles.lead}>The same source code becomes a monolith, microservices, or individual functions — just by changing CLI flags.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {steps.map((step, i) => (
            <div key={i} className={styles.card} style={{ borderTopWidth: 3, borderTopColor: '#1d6070', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontSize: 11, fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{i + 1}</span>
                <div className={styles.cardTitle} style={{ margin: 0 }}>{step.title}</div>
              </div>
              <p className={styles.cardBody}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', color: '#d4ccba', display: 'none' }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {flags.map((item, i) => (
            <div key={i} className={styles.card}>
              <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 13, fontWeight: 700, color: '#c2410c' }}>{item.flag}</code>
              <p className={styles.cardBody} style={{ margin: '8px 0 12px' }}>{item.desc}</p>
              <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, background: '#efece4', border: '1px solid #e3ddd0', borderRadius: 6, padding: '6px 10px', color: '#6b6559' }}>
                $ {item.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitecturesSection() {
  const architectures = [
    { icon: <Server size={24} style={{ color: '#c2410c' }} />, name: 'Monolith', description: 'Run everything in one process', command: 'pikku', bundleSize: '~2.8 MB', includes: 'All functions, all protocols' },
    { icon: <Layers size={24} style={{ color: '#c2410c' }} />, name: 'Microservices', description: 'Split by domain or feature', command: 'pikku --http-routes=/admin', altCommand: 'pikku --tags=admin', bundleSize: '~180 KB', includes: 'Only admin routes + dependencies' },
    { icon: <FunctionSquare size={24} style={{ color: '#c2410c' }} />, name: 'Functions', description: 'One function per deployment', command: 'pikku --http-routes=/users/:id --types=http', bundleSize: '~50 KB', includes: 'Single endpoint + minimal runtime' },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Architectures</div>
          <h2 className={styles.h2}>One codebase, <em>three shapes.</em></h2>
          <p className={styles.lead}>No code changes. Just different CLI flags for different deployments.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {architectures.map((arch, i) => (
            <div key={i} className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {arch.icon}
                </div>
              </div>
              <div className={styles.cardTitle} style={{ fontSize: 18, textAlign: 'center', marginBottom: 6 }}>{arch.name}</div>
              <p className={styles.cardBody} style={{ textAlign: 'center', marginBottom: 16 }}>{arch.description}</p>
              <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, background: '#efece4', border: '1px solid #e3ddd0', borderRadius: 6, padding: '5px 9px', color: '#6b6559', marginBottom: 4 }}>
                $ {arch.command}
              </div>
              {arch.altCommand && (
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, background: '#efece4', border: '1px solid #e3ddd0', borderRadius: 6, padding: '5px 9px', color: '#6b6559', marginBottom: 4 }}>
                  $ {arch.altCommand}
                </div>
              )}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e3ddd0' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#c2410c', marginBottom: 3 }}>{arch.bundleSize}</div>
                <div style={{ fontSize: 12, color: '#9a9387' }}>{arch.includes}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceLoadingSection() {
  const highlights = [
    { label: 'Faster cold starts', desc: "Health-check endpoints don't load your database driver. Payment endpoints don't load your email SDK." },
    { label: 'Same codebase', desc: 'Deploy as monolith, microservices, or individual functions — filter with CLI flags, no code changes.' },
    { label: 'Type-safe', desc: 'RequiredSingletonServices narrows your factory return type so TypeScript catches missing services at compile time.' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Service Loading</div>
          <h2 className={styles.h2}>Only load what you <em>actually use.</em></h2>
          <p className={styles.lead}>
            The CLI generates a <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>requiredSingletonServices</code> map. Guard heavy imports with dynamic <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>import()</code> — unused services never load.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          <CodeCard filename=".pikku/pikku-services.gen.ts" badge="auto-generated" icon={<Zap size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{requiredServicesCode}</CodeBlock>
          </CodeCard>
          <CodeCard filename="services.ts" badge="your code" icon={<Package size={13} style={{ color: '#c2410c' }} />}>
            <CodeBlock language="typescript">{dynamicImportCode}</CodeBlock>
          </CodeCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontSize: 10, fontWeight: 700 }}>✓</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1814', marginBottom: 2 }}>{h.label}</div>
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
        <h2 className={styles.h2}>Deploy your way.</h2>
        <p className={styles.lead} style={{ marginBottom: 28 }}>
          One codebase, any architecture. Start building with tree-shaking from day one.
        </p>
        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npm create pikku@latest
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/pikku-cli/tree-shaking" className={styles.btnPrimary}>Tree-Shaking Guide</Link>
          <Link to="/features" className={styles.btnGhost}>All Features</Link>
        </div>
      </div>
    </section>
  );
}

export default function TreeShakingPage() {
  return (
    <Layout
      title="Tree-Shaking — Same Codebase, Any Deployment"
      description="Pikku's CLI scans your function signatures, filters by routes, tags, or types, and generates entry points with only what each deployment needs."
    >
      <PaperPage>
        <Hero />
        <main>
          <HowItWorksSection />
          <ArchitecturesSection />
          <ServiceLoadingSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
