import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Key, Variable, ShieldCheck, RefreshCw, ArrowRight, BookOpen, Monitor } from 'lucide-react';
import { PaperPage, CodeCard } from '../../components/PaperLayout';
import styles from './secrets.module.css';
import snippets from '../../data/snippets.json';
import { snippetSourceUrl } from '../../utils/snippets';

const secretsCode = snippets.secrets;
const variablesCode = snippets.variables;
const oauth2Code = snippets.shopSecretUsage;

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Core Concept</span>
          <h1 className={styles.h1}>Type-safe config.<br /><em>Zero guesswork.</em></h1>
          <p className={styles.lead}>
            Declare secrets and variables with Zod schemas. Every value is validated, typed, and manageable from the Console or environment.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/core-features/secrets" className={styles.btnPrimary}>Secrets Docs</Link>
            <Link to="/docs/core-features/variables" className={styles.btnGhost}>Variables Docs</Link>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'// Declare a typed secret'}</span><br />
          <span className={styles.hcKw}>wireSecret</span>{'({'}<br />
          <span style={{ marginLeft: 24 }}>name: <span className={styles.hcStr}>'DATABASE_CONFIG'</span>,</span><br />
          <span style={{ marginLeft: 24 }}>schema: z.object{'({'}</span><br />
          <span style={{ marginLeft: 48 }}>host: z.string(),</span><br />
          <span style={{ marginLeft: 48 }}>port: z.<span className={styles.hcAttr}>number</span>(),</span><br />
          <span style={{ marginLeft: 48 }}>password: z.string()</span><br />
          <span style={{ marginLeft: 24 }}>{'})' }</span><br />
          {'})'}
        </div>
      </div>
    </div>
  );
}

function SecretsSection() {
  const features = [
    { icon: <Key size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Schema-validated secrets', desc: "Every secret is declared with a Zod schema. If a value is missing or the wrong shape, your app fails fast at startup — not at 3 AM." },
    { icon: <ShieldCheck size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'TypedSecretService', desc: "The generated service knows every secret name and its shape. getSecretJSON returns the exact type — no casting, no as any." },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Secrets</div>
          <h2 className={styles.h2}>Secrets with <em>superpowers.</em></h2>
          <p className={styles.lead}>Declare once with wireSecret. Read anywhere with full type safety and runtime validation.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => (
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
          <CodeCard sourceUrl={snippetSourceUrl('secrets')} filename="secrets.ts" badge="wireSecret">
            <CodeBlock language="typescript">{secretsCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

function VariablesSection() {
  const comparison = [
    { label: 'Secrets', icon: <Key size={14} style={{ color: '#c2410c' }} />, points: ['Encrypted at rest', 'Never logged or exposed', 'API keys, passwords, tokens'] },
    { label: 'Variables', icon: <Variable size={14} style={{ color: '#c2410c' }} />, points: ['Plain-text config', 'Safe to log and inspect', 'Feature flags, limits, URLs'] },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Variables</div>
          <h2 className={styles.h2}>Config that <em>types itself.</em></h2>
          <p className={styles.lead}>Same wireVariable pattern, same Zod schemas — but for non-sensitive configuration you can safely log and inspect.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <CodeCard sourceUrl={snippetSourceUrl('variables')} filename="variables.ts" badge="wireVariable">
            <CodeBlock language="typescript">{variablesCode}</CodeBlock>
          </CodeCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comparison.map((group, i) => (
              <div key={i} className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {group.icon}
                  <div className={styles.cardTitle} style={{ margin: 0 }}>{group.label}</div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.points.map((pt, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c2410c', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#6b6559' }}>{pt}</span>
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

function OAuth2Section() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>OAuth2</div>
          <h2 className={styles.h2}>Managed <em>OAuth2 tokens.</em></h2>
          <p className={styles.lead}>Declare credentials with wireOAuth2Credential — app secrets, token storage, authorization and token URLs. The OAuth2Client handles refresh, caching, and expiry automatically.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className={styles.card}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <RefreshCw size={16} style={{ color: '#c2410c', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className={styles.cardTitle}>Two secrets, clear roles</div>
                  <p className={styles.cardBody}>
                    <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '0.85em', color: '#c2410c' }}>secretId</code> holds your app's <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '0.85em', color: '#c2410c' }}>clientId</code> and <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '0.85em', color: '#c2410c' }}>clientSecret</code>. <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '0.85em', color: '#c2410c' }}>tokenSecretId</code> stores access and refresh tokens — updated automatically whenever a token is refreshed.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Monitor size={16} style={{ color: '#c2410c', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className={styles.cardTitle}>Console integration</div>
                  <p className={styles.cardBody}>Manage secrets, variables, and OAuth2 credentials per environment from the Console UI — no .env juggling.</p>
                </div>
              </div>
            </div>
          </div>
          <CodeCard sourceUrl={snippetSourceUrl('shopSecretUsage')} filename="oauth2.ts" badge="wireOAuth2Credential">
            <CodeBlock language="typescript">{oauth2Code}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Config done right.</h2>
        <p className={styles.lead} style={{ marginBottom: 32 }}>
          Type-safe secrets and variables with Zod validation. Manage everything from code or the Console.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/secrets" className={styles.btnPrimary}>Secrets Docs <ArrowRight size={15} /></Link>
          <Link to="/docs/core-features/variables" className={styles.btnGhost}><BookOpen size={15} style={{ marginRight: 6 }} />Variables Docs</Link>
        </div>
      </div>
    </section>
  );
}

export default function SecretsPage() {
  return (
    <Layout
      title="Secrets & Variables — Typed Config for Pikku"
      description="Declare secrets and variables with Zod schemas. Every value is validated, typed, and manageable from the Console or environment."
    >
      <PaperPage>
        <Hero />
        <main>
          <SecretsSection />
          <VariablesSection />
          <OAuth2Section />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
