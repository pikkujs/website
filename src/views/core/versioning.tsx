import React from 'react';
import Link from '@/components/site/Link';
import Layout from '@/components/site/Layout';
import CodeBlock from '@/components/site/CodeBlock';
import { ArrowRight, Hash, FileJson, ShieldCheck, Lock, Search, Copy, Check } from 'lucide-react';
import { PaperPage, CodeCard } from '@/components/PaperLayout';
import styles from './versioning.module.css';
import snippets from '@/data/snippets.json';
import { snippetSourceUrl } from '@/lib/snippets';

const versionedFuncCode = snippets.shopVersionedItem;

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.badge}>Core Concept</span>
          <h1 className={styles.h1}>Evolve functions.<br /><em>Keep workflows running.</em></h1>
          <p className={styles.lead}>
            Pikku hashes every function's contract — name, input schema, output schema — so your workflows and AI agents keep running even as functions evolve.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/core-features/versioning" className={styles.btnPrimary}>Read the Docs</Link>
            <a href="#how-it-works" className={styles.btnGhost}>See How It Works</a>
          </div>
        </div>

        <div className={styles.heroCode}>
          <span className={styles.hcComment}>{'// Every function has a contract'}</span><br />
          <span className={styles.hcHash}>hash</span>{'('}<br />
          <span style={{ marginLeft: 24 }}><span className={styles.hcVar1}>functionName</span></span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'"getBook"'}</span><br />
          <span style={{ marginLeft: 24 }}>+ <span className={styles.hcVar2}>inputSchema</span></span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'z.object({...})'}</span><br />
          <span style={{ marginLeft: 24 }}>+ <span className={styles.hcVar3}>outputSchema</span></span>
          <span style={{ marginLeft: 8, color: '#8a8475' }}>{'z.object({...})'}</span><br />
          {')'}<span style={{ color: '#8a8475' }}> →</span>
          <span className={styles.hcHash}> a1b2c3d4e5f6g7h8</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: <Hash size={20} style={{ color: '#c2410c' }} />, title: 'Hash', desc: 'Function name + input schema + output schema are hashed into a deterministic 16-character hex contract hash.' },
    { icon: <FileJson size={20} style={{ color: '#c2410c' }} />, title: 'Track', desc: 'Hashes are stored in a versions.pikku.json manifest, committed to Git alongside your code. Every version has its own hash.' },
    { icon: <ShieldCheck size={20} style={{ color: '#c2410c' }} />, title: 'Guard', desc: "The CLI compares current contracts against the manifest on every build. Changed contract without a version bump? Build fails." },
  ];

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>How It Works</div>
          <h2 className={styles.h2}>Three steps. <em>Bulletproof contracts.</em></h2>
          <p className={styles.lead}>Every function's API surface is tracked, versioned, and enforced automatically.</p>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 40 }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className={styles.card} style={{ flex: 1, borderTopWidth: 3, borderTopColor: '#c2410c' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  {step.icon}
                  <div className={styles.cardTitle} style={{ margin: 0, fontSize: 17 }}>{step.title}</div>
                </div>
                <p className={styles.cardBody}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#d4ccba' }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.card} style={{ maxWidth: 600 }}>
          <div className={styles.cardTitle} style={{ fontSize: 17 }}>The manifest</div>
          <p className={styles.cardBody}>Hashes live in a versions.pikku.json file committed next to your code, one entry per function and version.</p>
          <p className={styles.cardBody}><Link to="/docs/core-features/versioning">See the manifest format <ArrowRight size={14} style={{ verticalAlign: '-2px' }} /></Link></p>
        </div>
      </div>
    </section>
  );
}

function CIGateSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>CI Integration</div>
          <h2 className={styles.h2}>One line in CI. <em>Zero accidental breaking changes.</em></h2>
          <p className={styles.lead}>
            Add <code style={{ fontFamily: 'Geist Mono, monospace', color: '#c2410c', fontSize: '0.9em' }}>pikku versions check</code> to your pipeline. Breaking changes fail the build with an actionable fix — before they reach production.
          </p>
        </div>

        <div className={styles.card} style={{ maxWidth: 600 }}>
          <div className={styles.cardTitle} style={{ fontSize: 17 }}>See it fail, then fix it</div>
          <p className={styles.cardBody}>A breaking change fails the check with the exact schema hashes that moved and the command that fixes it. The docs include the CI pipeline step and the full output.</p>
          <p className={styles.cardBody}><Link to="/docs/core-features/versioning">CI setup and sample output <ArrowRight size={14} style={{ verticalAlign: '-2px' }} /></Link></p>
        </div>
      </div>
    </section>
  );
}

function VersionedFunctionsSection() {
  const highlights = [
    { title: 'Latest by default', desc: 'New workflows and agents use the newest version automatically.' },
    { title: 'Old versions stay available', desc: 'Running workflows and AI agents keep calling v1 as long as you keep it.' },
    { title: 'Works across all wires', desc: 'HTTP, WebSocket, queue, CLI, MCP — both versions are available everywhere.' },
    { title: 'Schema hashes in Git', desc: 'Contract hashes are deterministic and diffable — every change is visible in your commit history.' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Side-by-Side Versions</div>
          <h2 className={styles.h2}>v1 and v2 <em>coexist.</em></h2>
          <p className={styles.lead}>Running workflows and AI agents keep working. New code gets the latest version. Both run across every wire — no migration needed.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32, alignItems: 'start' }}>
          <CodeCard sourceUrl={snippetSourceUrl('shopVersionedItem')} filename="getBook.func.ts" badge="version: 1 → 2">
            <CodeBlock language="typescript">{versionedFuncCode}</CodeBlock>
          </CodeCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#f4e6dd', border: '1px solid #e8cfc3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c', fontSize: 10, fontWeight: 700 }}>✓</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1814', marginBottom: 2 }}>{h.title}</div>
                  <div style={{ fontSize: 12, color: '#9a9387' }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuaranteesSection() {
  const guarantees = [
    { icon: <Lock size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Shipped means locked', desc: "Once a version is published, its contract can never silently change. Running workflows get exactly what they expect." },
    { icon: <Search size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Changes are caught automatically', desc: 'Modify a schema and the CLI knows immediately. No manual diffing, no guessing — it tells you exactly what changed.' },
    { icon: <ShieldCheck size={16} style={{ color: '#c2410c', flexShrink: 0 }} />, title: 'Every bump is intentional', desc: "You decide when to create a new version. The system won't let you accidentally ship a breaking change — you have to mean it." },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Guarantees</div>
          <h2 className={styles.h2}>What the system <em>promises you.</em></h2>
          <p className={styles.lead}>Versioning you can trust — so you can evolve fast without worrying about what breaks.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {guarantees.map((g, i) => (
            <div key={i} className={styles.card}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                {g.icon}
                <div className={styles.cardTitle} style={{ margin: 0 }}>{g.title}</div>
              </div>
              <p className={styles.cardBody}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  const steps = [
    { title: 'Develop', desc: 'Change function inputs or outputs', command: null },
    { title: 'Check', desc: 'Detect the contract change', command: 'npx pikku versions check' },
    { title: 'Bump', desc: 'Increment version in your function', command: 'version: 2' },
    { title: 'Update', desc: 'Record the new contract hash', command: 'npx pikku versions update' },
    { title: 'Commit', desc: 'Check in the updated manifest', command: 'git commit -am "bump getBook v2"' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>Developer Workflow</div>
          <h2 className={styles.h2}>Five steps. <em>Every time.</em></h2>
          <p className={styles.lead}>A repeatable workflow that makes breaking changes intentional — never accidental.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {steps.map((step, i) => (
            <div key={i} className={styles.card} style={{ position: 'relative' }}>
              <span className={styles.stepBadge} style={{ marginBottom: 10 }}>{i + 1}</span>
              <div className={styles.cardTitle}>{step.title}</div>
              <p className={styles.cardBody} style={{ marginBottom: step.command ? 10 : 0 }}>{step.desc}</p>
              {step.command && (
                <code style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: '#6b6559', background: '#efece4', border: '1px solid #e3ddd0', padding: '3px 7px', borderRadius: 5, display: 'block' }}>{step.command}</code>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard.writeText('npx pikku versions init'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Start versioning in 30 seconds.</h2>
        <p className={styles.lead} style={{ marginBottom: 28 }}>
          One command to initialize the manifest. Every function contract is tracked from that moment on.
        </p>
        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npx pikku versions init
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/versioning" className={styles.btnPrimary}>Read the Versioning Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className={styles.btnGhost}>View on GitHub</Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: '#9a9387' }}>MIT Licensed · Works with Express, Fastify, Lambda &amp; Cloudflare</p>
      </div>
    </section>
  );
}

export default function VersioningPage() {
  return (
    <Layout
      title="Versioning & Contracts — Evolve Functions, Keep Workflows Running"
      description="Pikku hashes every function's contract and catches breaking changes before deploy. Workflows and AI agents keep running even as functions evolve."
    >
      <PaperPage>
        <Hero />
        <main>
          <HowItWorksSection />
          <CIGateSection />
          <VersionedFunctionsSection />
          <GuaranteesSection />
          <WorkflowSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
