import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { NavbarPageToggle } from '../components/HomepageShared';
import { PaperPage, Terminal } from '../components/PaperLayout';
import { StackMatrix } from '../components/StackMatrix';
import styles from './index.module.css';

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
              email, secrets, workflows — <strong>identical to what ships to production.</strong> Nothing to
              install and nothing to assemble before the first line of code. When you ship it, deploy onto
              your own infrastructure — or let Fabric run it for you.
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
    { n: '01', title: 'Database & types', href: '/docs/storage', body: 'Point it at Postgres, MySQL, SQLite or D1 — it reads your schema and generates end-to-end types automatically. No setup, no drift.' },
    { n: '02', title: 'SSO', href: '/docs/middleware/better-auth', body: 'Standard OAuth and OIDC out of the box. Point it at Google, Microsoft, Okta — or any provider — and your team signs in. Nothing to build.' },
    { n: '03', title: 'Content & secrets', href: '/docs/core-features/secrets', body: 'A managed content layer and type-safe secrets, handled the same way on a laptop as in production.' },
    { n: '04', title: 'Email, with previews', href: '/docs/api/email-service', body: 'Generate transactional email and preview every message live in the console — before a single one is sent.' },
    { n: '05', title: 'Workflows & agents', href: '/docs/wiring/workflows', body: 'Durable, restart-proof workflows and AI agents run natively — no separate engine to operate.' },
    { n: '06', title: 'One binary', href: '/docs/deploy', body: 'The entire platform is a single command. No container orchestration to maintain just to run "hello world."' },
    { n: '07', title: 'Audit trails', href: '/docs/api/audit-service', body: 'Every action can leave a record — who, what, when — no matter which entry point it came through. History your auditors will actually accept.', wide: true },
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
            <Link
              key={c.n}
              href={c.href}
              className={`${styles.cell}${c.wide ? ` ${styles.cellWide}` : ''}`}
            >
              <div className={styles.cellNum}>{c.n}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <span className={styles.cellGo} aria-hidden="true">Read the docs →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   What Pikku is — the adapter story and the parity story, one diagram
   ════════════════════════════════════════════════════════════════ */
function WhatPikkuIsSection() {
  return (
    <section id="what-it-is" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>What Pikku is</div>
        <h2 className={styles.h2}>Everything plugs in. <em>Nothing locks in.</em></h2>
        <p className={styles.secLede}>
          This isn't a new stack asking you to abandon the one you have. You write functions and say
          how they're reachable; Pikku wires them to the libraries you'd have picked anyway — and then
          to whatever the place you're deploying to happens to provide.
        </p>
        <StackMatrix />
        <p className={styles.matrixCaption}>
          The top two bands never change. That's the whole parity claim:{' '}
          <code>pikku dev</code> and <code>pikku deploy</code> run the same code against the same
          libraries — only the bottom row swaps.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Addons — the ecosystem story: a package declares, the app wires
   ════════════════════════════════════════════════════════════════ */
function AddonsSection() {
  const addons = [
    {
      pkg: '@pikku/addon-admin',
      call: 'admin:listUsers',
      body: 'The user directory, roles and scopes, credentials and the audit trail — as ordinary RPCs you can call from anywhere in your app.',
    },
    {
      pkg: '@pikku/addon-console',
      call: 'npx pikku dev',
      body: 'The local build surface: every function, wiring and service on one page, editing the code on your laptop as you go.',
    },
    {
      pkg: '@pikku/addon-graph',
      call: 'graph:editFields',
      body: 'Native transforms your workflow graphs can reference by name, so a step that reshapes data needs no function of its own.',
    },
  ];

  return (
    <section id="addons" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Addons</div>
        <h2 className={styles.h2}>Install a capability. <em>Call it by name.</em></h2>
        <p className={styles.addonLede}>
          An addon is an npm package of functions, services, contracts and even database tables.
          Install it, map its secrets onto your own infrastructure, and its functions are reachable
          as <code>namespace:function</code> — fully typed, sharing your logger, your database and
          your auth.
        </p>
        <div className={styles.addonGrid}>
          {addons.map((a) => (
            <div key={a.pkg} className={styles.addonCard}>
              <div className={styles.addonPkg}>{a.pkg}</div>
              <div className={styles.addonCall}>{a.call}</div>
              <p>{a.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.matrixCaption}>
          An addon declares; the app that installs it decides what gets mounted — so nothing appears
          on your API because a dependency felt like it. Write your own with{' '}
          <code>npx pikku new addon</code>, or point it at an OpenAPI spec and get a typed one out.{' '}
          <Link href="/docs/addon">Read the addon docs →</Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Platform ready — what you'd otherwise spend two quarters building
   ════════════════════════════════════════════════════════════════ */
function PlatformReadySection() {
  const cards: Array<{ title: string; cost: string; body: React.ReactNode }> = [
    {
      title: 'Sign-in your customers already have',
      cost: 'usually a quarter of work',
      body: <>Built on standard OAuth and OIDC. Provide credentials for Google, Microsoft, Okta — or any provider — and an organisation signs in with the accounts it already manages. <strong>No authentication code to write, review or own.</strong></>,
    },
    {
      title: 'A history your auditors accept',
      cost: 'usually a separate system',
      body: <>Decide what to audit and Pikku records who did what, and when — across every entry point, not just the ones someone remembered to instrument. <strong>Compliance-grade history with nothing extra to run.</strong></>,
    },
    {
      title: 'Multitenancy that was there from the start',
      cost: 'usually a rewrite',
      body: <>Organisations and tenants are first-class — isolated data, scoped access, and fine-grained permissions wired through every entry point. <strong>The thing that is painful to retrofit, already done.</strong></>,
    },
    {
      title: "Safe tools for the people who aren't engineers",
      cost: 'usually a backlog item forever',
      body: <>Turn any capability into a command your ops and support teams can run — carrying the same auth, the same permissions and the same audit trail as everything else. <strong>Internal tooling that cannot quietly go around the rules.</strong></>,
    },
  ];

  return (
    <section id="platform-ready" className={styles.sectionDark}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Platform ready</div>
        <h2 className={styles.h2}>The work that usually comes <em>after launch.</em></h2>
        <p className={styles.secLede}>
          SSO, audit, multitenancy and granular permissions are the things that hold a deal up
          eighteen months from now. They are in the open-source binary on day one, not behind a
          sales call or a future quarter.
        </p>
        <div className={styles.entGrid}>
          {cards.map((c) => (
            <div key={c.title} className={styles.entCard}>
              <div className={styles.entCost}>{c.cost}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.entFoot}>
          Engineers who want to see the code —{' '}
          <Link href="/developers">it's all on the developer page →</Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Two surfaces, two audiences.

   @pikku/addon-console is the local surface — it edits code, so it belongs
   on a laptop. @pikku/addon-admin is the deployed one — the user directory,
   roles and scopes, credentials and the audit trail, as ordinary RPCs, which
   is what someone operating a live system actually needs.
   ════════════════════════════════════════════════════════════════ */
type Slide = { id: string; label: string; blurb: string; src?: string };

const CONSOLE_GROUPS: {
  id: string;
  name: string;
  tagline: string;
  slides: Slide[];
}[] = [
  {
    id: 'console',
    name: 'Console — while you build',
    tagline: 'Runs on your laptop and edits code: change a function body, a template, an agent config, and the server picks it up.',
    slides: [
      { id: 'overview', label: 'Overview', blurb: 'Every function, wiring and service in the system, on one page.', src: '/img/console-screenshot.webp' },
      { id: 'functions', label: 'Functions', blurb: 'Read a function body, change it, and watch the server pick it up.' },
      { id: 'apis', label: 'APIs', blurb: 'Every route, channel and RPC with its real types — call any of them from here.' },
      { id: 'workflow', label: 'Workflows', blurb: 'The graph as written, next to the runs that went through it.' },
      { id: 'emails', label: 'Emails', blurb: 'Edit a template and preview the message before one is ever sent.' },
      { id: 'agents', label: 'Agents', blurb: 'Tune an agent config, then run it in the playground against real tools.' },
      { id: 'scenarios', label: 'Scenarios', blurb: 'The end-to-end tests, and what they covered on the last run.' },
    ],
  },
  {
    id: 'admin',
    name: 'Admin — once it is live',
    tagline: 'Ships with the deployment for whoever operates it. Changes take effect on the running system — no deploy, no engineer, everything audited.',
    slides: [
      { id: 'users', label: 'Users', blurb: 'The directory — invite, ban, reset a password, revoke every session someone has open.' },
      { id: 'scopes', label: 'Roles & scopes', blurb: 'Build a role, grant scopes, move people in and out of it while the system runs.' },
      { id: 'audit', label: 'Audit', blurb: 'Who did what, when, and through which entry point — including every change made on these screens.' },
      { id: 'secrets', label: 'Secrets', blurb: 'Read and rotate secrets in place, without a redeploy to pick them up.' },
      { id: 'credentials', label: 'Credentials', blurb: 'Per-user provider credentials — set, inspect status, revoke.' },
      { id: 'auth-providers', label: 'Auth providers', blurb: 'Which identity providers are live, and for whom.' },
      { id: 'workflow', label: 'Workflow runs', blurb: 'What is in flight, what paused for approval, what failed and where.' },
      { id: 'agents/threads', label: 'AI conversations', blurb: 'Every agent thread, message by message, with the tool calls it made.' },
    ],
  },
];

function ConsoleSection() {
  const [g, setG] = React.useState(0);
  const [i, setI] = React.useState(0);
  const group = CONSOLE_GROUPS[g];
  const slide = group.slides[i];
  const go = (d: number) => setI((n) => (n + d + group.slides.length) % group.slides.length);
  const pickGroup = (n: number) => { setG(n); setI(0); };

  return (
    <section id="console" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>The console</div>
        <h2 className={styles.h2}>See everything running. <em>Nothing is a black box.</em></h2>
        <p className={styles.secLede}>
          Two surfaces, both shipped with the platform, both running against the exact system in
          front of you. One is for building it. The other is for whoever has to operate it after
          you've stopped touching it.
        </p>

        <div className={styles.groupToggle} role="tablist" aria-label="Console surface">
          {CONSOLE_GROUPS.map((gr, n) => (
            <button
              key={gr.id}
              type="button"
              role="tab"
              aria-selected={n === g}
              className={`${styles.groupBtn} ${n === g ? styles.groupBtnOn : ''}`}
              onClick={() => pickGroup(n)}
            >
              {gr.name}
            </button>
          ))}
        </div>
        <p className={styles.groupTagline}>{group.tagline}</p>

        <div className={styles.carousel}>
          <div className={styles.carTabs} role="tablist" aria-label={`${group.name} pages`}>
            {group.slides.map((sl, n) => (
              <button
                key={sl.id}
                type="button"
                role="tab"
                aria-selected={n === i}
                className={`${styles.carTab} ${n === i ? styles.carTabOn : ''}`}
                onClick={() => setI(n)}
              >
                {sl.label}
              </button>
            ))}
          </div>

          <div className={styles.carStage}>
            <button type="button" className={styles.carArrow} onClick={() => go(-1)} aria-label="Previous page">‹</button>

            <div className={styles.carFrame} key={`${group.id}-${slide.id}`}>
              <div className={styles.screenshotChrome}>
                <span className={styles.termDot} style={{ background: '#e06c5b' }} />
                <span className={styles.termDot} style={{ background: '#e0b34b' }} />
                <span className={styles.termDot} style={{ background: '#79b06a' }} />
                <span className={styles.screenshotAddr}>localhost:3000/console/{slide.id}</span>
              </div>
              {slide.src ? (
                <img src={slide.src} alt={`Pikku Console — ${slide.label}`} loading="lazy" />
              ) : (
                <div className={styles.carPlaceholder}>
                  <span className={styles.carPlaceholderLabel}>{slide.label}</span>
                  <span className={styles.carPlaceholderNote}>screenshot coming</span>
                </div>
              )}
            </div>

            <button type="button" className={styles.carArrow} onClick={() => go(1)} aria-label="Next page">›</button>
          </div>

          <p className={styles.carBlurb}>
            <span className={styles.carBlurbLabel}>{slide.label}</span>
            {slide.blurb}
          </p>
        </div>

        <p className={styles.consoleFoot}>
          The admin half is the internal tool you were going to build anyway — users, roles,
          secrets, audits — except it already knows your permissions, and every change it makes
          lands in the same audit trail as everything else.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Deploy — the open-source path, positioned plainly
   ════════════════════════════════════════════════════════════════ */
function DeploySection() {
  const tiers: {
    title: string;
    who: string;
    body: string;
    cmd: React.ReactNode;
    featured?: boolean;
  }[] = [
    {
      title: 'Standalone',
      who: 'One file. Server or desktop.',
      body: 'Bundles the API, the console and your frontend into a single Node bundle or compiled Bun binary. Copy it onto a box and run it — or wrap it as a desktop app.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p standalone</>,
      featured: true,
    },
    {
      title: 'Your cloud, serverful',
      who: 'A long-running server you control.',
      body: 'Deploy to any host that runs Node or Bun — a VM, a container, your existing platform. Nothing about the application changes.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p aws</>,
    },
    {
      title: 'Your cloud, serverless',
      who: 'Scales to zero, and back.',
      body: 'Every function becomes the primitive its wiring implies — Lambda and SQS on AWS, Workers and Queues on Cloudflare. Same code, no rewrite.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p cloudflare</>,
    },
  ];

  return (
    <section id="deploy" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>When you're ready to ship</div>
        <h2 className={styles.h2}>Deploy it. Host it yourself. <em>Pick server or serverless.</em></h2>
        <p className={styles.secLede}>
          One command, and it's live on infrastructure you own. The choice between a long-running
          server and functions that scale to zero is a flag — not an architecture you commit to on
          day one and regret on day four hundred.
        </p>
        <div className={styles.tiers}>
          {tiers.map((t) => (
            <div key={t.title} className={`${styles.tier} ${t.featured ? styles.tierFeatured : ''}`}>
              <h3>{t.title}</h3>
              <div className={styles.tierWho}>{t.who}</div>
              <p>{t.body}</p>
              <code className={styles.tierCode}>{t.cmd}</code>
              <span className={styles.pillOss}>open source</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Fabric — the managed option, stated once
   ════════════════════════════════════════════════════════════════ */
function FabricSection() {
  return (
    <section id="fabric" className={styles.section} style={{ paddingTop: 0 }}>
      <div className={styles.wrap}>
        <div className={styles.fabricCard}>
          <div>
            <div className={styles.fabricEyebrow}>Fabric — the managed home for Pikku</div>
            <h2 className={styles.fabricH2}>
              Or don't host it at all. <em>We'll run it.</em>
            </h2>
            <p className={styles.fabricP}>
              The same application, hosted and observable, with an assistant that understands your
              data and your logic because Pikku already describes them. Push and forget.
            </p>
            <p className={styles.fabricP}>
              Nothing about your code changes when you move either way — Fabric is a deploy target,
              not a different product.
            </p>
            <Link href="https://pikkufabric.com" className={styles.fabricBtn}>
              Explore Fabric
            </Link>
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
        <WhatPikkuIsSection />
        <AddonsSection />
        <PlatformReadySection />
        <ConsoleSection />
        <DeploySection />
        <FabricSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
