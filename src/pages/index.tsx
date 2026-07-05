import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { NavbarPageToggle } from '../components/HomepageShared';
import { PaperPage, Terminal } from '../components/PaperLayout';
import styles from './index.module.css';
import snippets from '../data/snippets.json';

/* ── Screenshot frame with browser chrome ────────────────────── */
function ScreenshotFrame({ src, alt, addr, wide = false }: { src: string; alt: string; addr: string; wide?: boolean }) {
  return (
    <div className={`${styles.screenshotFrame} ${wide ? styles.wide : ''}`}>
      <div className={styles.screenshotChrome}>
        <span className={styles.termDot} style={{ background: '#e06c5b' }} />
        <span className={styles.termDot} style={{ background: '#e0b34b' }} />
        <span className={styles.termDot} style={{ background: '#79b06a' }} />
        <span className={styles.screenshotAddr}>{addr}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

/* ── Click-to-copy command chip ──────────────────────────────── */
function CopyCmd({ cmd }: { cmd: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button type="button" className={styles.heroCmd} onClick={copy} title="Copy to clipboard">
      {copied ? '✓ copied' : cmd}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.kicker}>Open source · self-hostable · MIT</div>
            <h1 className={styles.h1}>
              Run a whole platform from <em>one command.</em>
            </h1>
            <p className={styles.lede}>
              One command gives your team a complete backend on their machine — database, auth, content,
              email, secrets, workflows — <strong>identical to what ships to production.</strong> No services to
              install. No infrastructure to assemble. Deploy it anywhere, including fully managed.
            </p>
            <div className={styles.heroActions}>
              <Link href="/getting-started" className={styles.btnPrimary}>Get started</Link>
              <Link href="#platform" className={styles.btnGhost}>See how it works</Link>
              <CopyCmd cmd="npx pikku dev" />
            </div>
          </div>
          <Terminal />
        </div>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   Trust strip
   ════════════════════════════════════════════════════════════════ */
function TrustStrip() {
  const logos: { name: string; url: string; img?: string }[] = [
    { name: 'marta', img: 'marta-dark.svg', url: 'https://marta.de' },
    { name: 'BambooRose', url: 'https://bamboorose.com' },
    { name: 'AgreeWe', url: 'https://www.agreewe.com' },
    { name: 'HeyGermany', img: 'heygermany-light.svg', url: 'https://hey-germany.com' },
    { name: 'Calligraphy Cut', img: 'calligraphycut-light.svg', url: 'https://calligraphy-cut.com' },
  ];
  return (
    <div className={styles.trust}>
      <div className={styles.wrap}>
        <div className={styles.trustIn}>
          <span className={styles.trustLabel}>Running in production at</span>
          <div className={styles.trustLogos}>
            {logos.map((l) => (
              l.img ? (
                <Link key={l.name} href={l.url} className={styles.trustLogoLink} title={l.name}>
                  <img src={`/img/logos/${l.img}`} alt={l.name} loading="lazy" />
                </Link>
              ) : (
                <Link key={l.name} href={l.url} className={styles.trustLogo}>{l.name}</Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Platform — "The whole stack, the moment you start"
   ════════════════════════════════════════════════════════════════ */
function PlatformSection() {
  const cells = [
    { n: '01', title: 'Database & types', body: 'SQLite to start, or point it at Postgres — it reads your schema and generates end-to-end types automatically. No setup, no drift.' },
    { n: '02', title: 'SSO', body: 'Standard OAuth and OIDC out of the box. Point it at Google, Microsoft, Okta — or any provider — and your team signs in. Nothing to build.' },
    { n: '03', title: 'Content & secrets', body: 'A managed content layer and type-safe secrets, handled the same way on a laptop as in production.' },
    { n: '04', title: 'Email, with previews', body: 'Generate transactional email and preview every message live in the console — before a single one is sent.' },
    { n: '05', title: 'Workflows & agents', body: 'Durable, restart-proof workflows and AI agents run natively — no separate engine to operate.' },
    { n: '06', title: 'One binary', body: 'The entire platform is a single command. No container orchestration to maintain just to run "hello world."' },
    { n: '07', title: 'Audit trails', body: 'Every action can leave a record — who, what, when — no matter which entry point it came through. History your auditors will actually accept.', wide: true },
  ];

  return (
    <section id="platform" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>The whole stack, the moment you start</div>
        <h2 className={styles.h2}>A production platform, <em>not a starter kit.</em></h2>
        <p className={styles.secLede}>
          Most frameworks hand you a router and a to-do list. Pikku boots the entire thing — and what
          your engineers build against locally is exactly what runs live.
        </p>
        <div className={styles.platformGrid}>
          {cells.map((c) => (
            <div key={c.n} className={`${styles.cell}${c.wide ? ` ${styles.cellWide}` : ''}`}>
              <div className={styles.cellNum}>{c.n}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Parity — "Local equals production"
   ════════════════════════════════════════════════════════════════ */
const PARITY_FEATURES = ['Console', 'Workflows', 'Agents', 'Auth', 'Queues', 'Schedules', 'MCP'];

function ParitySection() {
  return (
    <section id="parity" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Local equals production</div>
        <h2 className={styles.h2}>What your team builds is <em>what you ship.</em></h2>
        <div className={styles.parityGrid}>
          <div className={styles.parityVis}>
            <div className={styles.envCards}>
              <div className={`${styles.envCard} ${styles.envCardLocal}`}>
                <span className={styles.envCardLabel}>Local</span>
                <code className={styles.envCardCmd}>npx pikku dev</code>
                <div className={styles.envPills}>
                  {PARITY_FEATURES.map(f => <span key={f} className={styles.envPill}>{f}</span>)}
                </div>
              </div>
              <div className={styles.envCardEq}>=</div>
              <div className={`${styles.envCard} ${styles.envCardProd}`}>
                <span className={styles.envCardLabel}>Production</span>
                <code className={styles.envCardCmd}>pikku deploy</code>
                <div className={styles.envPills}>
                  {PARITY_FEATURES.map(f => <span key={f} className={styles.envPill}>{f}</span>)}
                </div>
              </div>
            </div>
          </div>
          <ul className={styles.parityList}>
            <li>The same auth, permissions and validation run in both places.</li>
            <li>Switch from SQLite to Postgres by swapping the connection string and running migrations — your functions stay untouched.</li>
            <li>The console you debug in is the console you operate with in production.</li>
            <li>No "works on my machine." No environment you can't reproduce.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Enterprise — "From day one"
   ════════════════════════════════════════════════════════════════ */
function EnterpriseSection() {
  const cards: Array<{ title: string; body: React.ReactNode; code: string }> = [
    {
      title: 'SSO with any provider',
      body: <>Built on standard OAuth and OIDC. Provide credentials for Google, Microsoft, Okta — or any provider — and your organization signs in. <strong>No authentication code to write or own.</strong></>,
      code: snippets.authProviders,
    },
    {
      title: 'Full audit trails',
      body: <>Decide what to audit and Pikku records who did what, and when — across every entry point. <strong>Compliance-grade history without a separate system.</strong></>,
      code: snippets.auditDispatch,
    },
    {
      title: 'Multitenancy & permissions',
      body: <>Organizations and tenants are first-class — isolated data, scoped access, and fine-grained permissions wired through everything. <strong>Multi-tenant SaaS without the usual plumbing.</strong></>,
      code: snippets.permissionsCompact,
    },
    {
      title: 'Your own internal tools',
      body: <>Turn any capability into a command-line tool for your ops and support teams — same auth, same permissions, same audit. <strong>Internal tooling that's safe by default.</strong></>,
      code: snippets.cliSubcommands,
    },
  ];

  return (
    <section id="enterprise" className={styles.sectionDark}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Enterprise from day one</div>
        <h2 className={styles.h2}>The requirements your platform needs — <em>already met.</em></h2>
        <p className={styles.secLede}>
          SSO, audit, multitenancy and granular permissions aren't a premium tier or a future quarter.
          They ship in the open-source binary.
        </p>
        <div className={styles.entGrid}>
          {cards.map((c) => (
            <div key={c.title} className={styles.entCard}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <pre className={styles.miniCode}>{c.code}</pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Console — screenshots
   ════════════════════════════════════════════════════════════════ */
function ConsoleSection() {
  return (
    <section id="console" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>The console</div>
        <h2 className={styles.h2}>See everything running. <em>Nothing is a black box.</em></h2>
        <p className={styles.secLede}>
          The operating console ships with the platform. Inspect functions, watch queues, replay workflows,
          preview email, review tests and permissions — for the exact system in front of you.
        </p>

        <div className={styles.consoleGrid}>
          <ScreenshotFrame
            src="/img/console-screenshot.webp"
            alt="Pikku Console — browse and run functions, inspect wirings"
            addr="localhost:3000/console — Pikku Console"
            wide
          />
        </div>
        <p className={styles.consoleCaption}>
          Browse functions · watch queues · replay workflows · preview email · inspect permissions
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Deploy — "You choose the destination"
   ════════════════════════════════════════════════════════════════ */
function DeploySection() {
  const tiers: {
    step: string;
    title: string;
    who: string;
    body: string;
    cmd: React.ReactNode;
    pill: 'oss' | 'managed';
    featured?: boolean;
  }[] = [
    {
      step: 'OPTION 01',
      title: 'Standalone',
      who: 'Run it anywhere you control.',
      body: 'Bundle the entire platform into a single executable and run it on your own infrastructure. A complete server in one file.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p standalone</>,
      pill: 'oss',
    },
    {
      step: 'OPTION 02',
      title: 'Your cloud',
      who: 'Your account, your bill.',
      body: 'Deploy the open-source way to AWS or Cloudflare. Same application, your infrastructure, no lock-in.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p aws · cloudflare</>,
      pill: 'oss',
    },
    {
      step: 'OPTION 03',
      title: 'Fabric',
      who: 'Managed, with an AI that knows your system.',
      body: 'Push and forget. Every function becomes a serverless worker, fully observable — and you can talk to your platform in plain language.',
      cmd: <><span className={styles.thl}>pikku</span> fabric deploy apply</>,
      pill: 'managed',
      featured: true,
    },
  ];

  return (
    <section id="deploy" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>When you're ready to ship</div>
        <h2 className={styles.h2}>One command to deploy. <em>You choose the destination.</em></h2>
        <p className={styles.secLede}>
          The same application ships three ways. Stay fully in control, run it in your own cloud,
          or hand operations to us — without rewriting anything.
        </p>
        <div className={styles.tiers}>
          {tiers.map((t) => (
            <div key={t.title} className={`${styles.tier} ${t.featured ? styles.tierFeatured : ''}`}>
              <div className={styles.tierStep}>{t.step}</div>
              <h3>{t.title}</h3>
              <div className={styles.tierWho}>{t.who}</div>
              <p>{t.body}</p>
              <code className={styles.tierCode}>{t.cmd}</code>
              <span className={t.pill === 'oss' ? styles.pillOss : styles.pillManaged}>
                {t.pill === 'oss' ? 'open source' : 'managed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Fabric — "Talk to your platform"
   ════════════════════════════════════════════════════════════════ */
function FabricSection() {
  return (
    <section id="fabric" className={styles.section} style={{ paddingTop: 0 }}>
      <div className={styles.wrap}>
        <div className={styles.fabricCard}>
          <div>
            <div className={styles.fabricEyebrow}>Fabric — the managed home for Pikku</div>
            <h2 className={styles.fabricH2}>
              Talk to your platform. <em>It already understands it.</em>
            </h2>
            <p className={styles.fabricP}>
              Because Pikku knows your entire system, Fabric gives you an assistant that understands your
              data, your logic and your operations. Ask for a change in plain language — and watch it
              happen, live.
            </p>
            <p className={styles.fabricP}>
              It's the same application your team ran locally, now hosted, observable, and conversational.
            </p>
            <p className={styles.fabricP}>
              <strong>Not a developer?</strong> This works for you too — describe the product you want and
              the assistant builds the data, the screens, the emails, and the deployment. No terminal, no code.
            </p>
            <Link href="https://pikkufabric.com" className={styles.fabricBtn}>
              Explore Fabric
            </Link>
          </div>
          <div className={styles.fabricChat}>
            <div className={styles.fmsg}>
              <div className={`${styles.fav} ${styles.favU}`}>You</div>
              <div className={styles.fbub}>Add a weekly summary email for active customers.</div>
            </div>
            <div className={styles.fmsg}>
              <div className={`${styles.fav} ${styles.favA}`}>✦</div>
              <div className={`${styles.fbub} ${styles.fbubAi}`}>
                Done — created the job, scheduled it weekly, and built the email. Preview it in the console.
              </div>
            </div>
            <div className={styles.fmsg}>
              <div className={`${styles.fav} ${styles.favU}`}>You</div>
              <div className={styles.fbub}>Ship it.</div>
            </div>
            <div className={styles.fmsg}>
              <div className={`${styles.fav} ${styles.favA}`}>✦</div>
              <div className={`${styles.fbub} ${styles.fbubAi}`}>
                <span className={styles.fbubMono}>✓ live</span> — deployed as a serverless worker.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   CTA
   ════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section id="start" className={`${styles.section} ${styles.cta}`}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow} style={{ textAlign: 'center' }}>Try it now</div>
        <h2 className={styles.h2} style={{ margin: '0 auto 22px', textAlign: 'center' }}>
          A complete platform is one command away.
        </h2>
        <p className={styles.secLede} style={{ margin: '0 auto', textAlign: 'center' }}>
          No account. No installation. No setup. Run it and watch the whole system come up.
        </p>
        <div className={styles.ctaTerm}>
          <Terminal />
        </div>
        <div className={styles.ctaActions}>
          <Link href="/getting-started" className={styles.btnPrimary}>Read the quick start</Link>
          <Link href="https://github.com/pikkujs/pikku" className={styles.btnGhost}>Star on GitHub</Link>
        </div>
        <p className={styles.engNote}>
          Engineers — curious how it works underneath?{' '}
          <Link href="/developers">See Pikku for developers →</Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page assembly
   ════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <Layout
      title="Pikku — Run a whole platform from one command."
      description="One command gives your team a complete backend — database, auth, email, workflows, agents — identical to what ships to production. Deploy anywhere, including fully managed."
    >
      <NavbarPageToggle isDeveloperPage={false} />
      <PaperPage>
        <Hero />
        <TrustStrip />
        <PlatformSection />
        <ParitySection />
        <EnterpriseSection />
        <ConsoleSection />
        <DeploySection />
        <FabricSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
