import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Puzzle, Package, Tag, Key, Upload, BookOpen, ArrowRight, Check } from 'lucide-react';
import { PaperPage, CodeCard } from '../../components/PaperLayout';
import styles from './addons.module.css';

const consumingCode = `// Call addon functions via namespaced RPCs
const result = await rpc('postgres:insert', {
  table: 'users',
  data: { name: 'Alice', email: 'alice@example.com' }
})

// Addons declare secrets via wireSecret —
// you provide the values through your own secret store
await secrets.getSecretJSON('POSTGRES_URL')`;

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

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Ecosystem</span>
          <h1 className={styles.h1}>Extend anything.<br /><em>Share everything.</em></h1>
          <p className={styles.lead}>
            Addons bundle functions, services, secrets, and wires into a single npm package. Install one package — get an entire feature.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/addon/consuming" className={styles.btnPrimary}>Using Addons</Link>
            <Link to="/docs/addon/creating" className={styles.btnGhost}>Create an Addon</Link>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'// Wire an addon — one line'}</span><br />
          <span className={styles.hcVar}>wireAddon</span>
          {'({'}<br />
          <span style={{ marginLeft: 24 }}>name: <span className={styles.hcStr}>'redis'</span>,</span><br />
          <span style={{ marginLeft: 24 }}>package: <span className={styles.hcStr}>'@pikku/external-redis'</span></span><br />
          {'})'}<br /><br />
          <span className={styles.hcComment}>{'// All functions are namespaced'}</span><br />
          <span className={styles.hcKw}>await</span>{' rpc('}
          <span className={styles.hcStr}>'redis:keySet'</span>
          {', { key, value })'}
        </div>
      </div>
    </div>
  );
}

function ConsumingSection() {
  const features = [
    { icon: <Tag size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Namespaced functions', desc: 'Every addon function is prefixed with the addon name — postgres:insert, stripe:charge — so there are never collisions.' },
    { icon: <Check size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Full type safety', desc: 'Addon inputs and outputs are typed. Your IDE autocompletes addon function names, parameters, and return values.' },
    { icon: <Key size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Secret overrides', desc: "Addons declare the secrets they need. You provide the values in your environment or Console — the addon reads them transparently." },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Consuming Addons</div>
          <h2 className={styles.h2}>Install. Wire. <em>Done.</em></h2>
          <p className={styles.lead}>Addons are npm packages. One import, one wireAddon call, and every function, service, and secret is available.</p>
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
          <CodeCard filename="app.ts" badge="consuming">
            <CodeBlock language="typescript">{consumingCode}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

function CreatingSection() {
  const steps = [
    { icon: <Package size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Standard npm package', desc: "An addon is a package with addon: true in pikku.config.json. It exports services, secrets, variables, and functions like any Pikku app." },
    { icon: <Puzzle size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'pikkuAddonServices', desc: "Your service factory receives the host app's variables and secrets. Return the services your addon functions need — they're injected automatically." },
    { icon: <Upload size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Publish & share', desc: 'Publish to npm. Consumers install, call wireAddon, and provide secret values — the addon does the rest.' },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Creating Addons</div>
          <h2 className={styles.h2}>Build your own <em>plugin.</em></h2>
          <p className={styles.lead}>Package any set of functions, services, and secrets into a reusable addon that anyone can install.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CodeCard filename="redis.secret.ts" badge="wireSecret">
              <CodeBlock language="typescript">{creatingSecretCode}</CodeBlock>
            </CodeCard>
            <CodeCard filename="services.ts" badge="pikkuAddonServices">
              <CodeBlock language="typescript">{creatingServicesCode}</CodeBlock>
            </CodeCard>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((s, i) => (
              <div key={i} className={styles.card}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {s.icon}
                  <div>
                    <div className={styles.cardTitle}>{s.title}</div>
                    <p className={styles.cardBody}>{s.desc}</p>
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

function CTASection() {
  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Extend Pikku your way.</h2>
        <p className={styles.lead} style={{ marginBottom: 32 }}>
          Install community addons or build your own. Every addon is just an npm package.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/addon/consuming" className={styles.btnPrimary}>Using Addons <ArrowRight size={15} /></Link>
          <Link to="/docs/addon/creating" className={styles.btnGhost}><BookOpen size={15} style={{ marginRight: 6 }} />Create an Addon</Link>
        </div>
      </div>
    </section>
  );
}

export default function AddonsPage() {
  return (
    <Layout
      title="Addons — Extend Pikku with Plugins"
      description="Pikku addons bundle functions, services, secrets, and wires into a single npm package. Install once, wire once — get an entire feature."
    >
      <PaperPage>
        <Hero />
        <main>
          <ConsumingSection />
          <CreatingSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
