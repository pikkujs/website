import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { testimonials } from '@site/data/testimonials';
import { NavbarPageToggle } from '../components/HomepageShared';
import { CodeCard, PaperPage, Terminal } from '../components/PaperLayout';
import { StackMatrix } from '../components/StackMatrix';
import styles from './index.module.css';

/* ── Click-to-copy command chip ──────────────────────────────────
   Awaits the write, handles the rejection, and announces the result —
   clipboard access is denied often enough (insecure origin, permission
   policy, Safari outside a user gesture) that a silent failure means the
   reader thinks they copied a command they did not.
   ──────────────────────────────────────────────────────────────── */
function CopyCmd({ cmd }: { cmd: string }) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(cmd);
      setState('copied');
    } catch {
      setState('failed');
    }
    timer.current = setTimeout(() => setState('idle'), 1800);
  };

  return (
    <>
      <button
        type="button"
        className={styles.heroCmd}
        onClick={copy}
        aria-label={`Copy ${cmd} to clipboard`}
      >
        {state === 'copied' ? '✓ copied' : state === 'failed' ? 'select to copy' : cmd}
      </button>
      <span className={styles.srOnly} role="status">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed — select the command to copy it' : ''}
      </span>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Hero

   The headline is the sharpest sentence the old page had, which was
   buried two thousand pixels down in a section body. The lede's job is
   to say what this is — the previous one never used the word TypeScript.
   ════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        {/* The headline runs the full measure above both columns -- at 72px
            across 1076px it breaks to two lines on its own, and the column
            split below reads as a consequence of it rather than a container
            it has to fit inside. */}
        <div className={styles.heroHead}>
          <div className={styles.kicker}>Open-source core · self-hostable · MIT + BUSL</div>
          <h1 className={styles.h1}>
            Most frameworks hand you a router and a <em>to-do list.</em>
          </h1>
        </div>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.lede}>
              Pikku is a TypeScript backend framework with the platform already attached — database,
              auth, secrets, email, queues, workflows and a console. Write a function once, wire it to
              HTTP, WebSocket, cron, queue, RPC or MCP. Deploy it onto your own infrastructure, or let
              Fabric run it.
            </p>
            <div className={styles.heroActions}>
              <Link href="/getting-started" className={styles.btnPrimary}>Get started</Link>
              <Link href="#how-it-works" className={styles.btnGhost}>See how it works</Link>
              <CopyCmd cmd="npm create pikku@latest" />
            </div>
            <p className={styles.twoLine}>
              two commands — scaffold, then <code>npx pikku dev</code>
            </p>
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
    { name: 'BambooRose', img: 'bamboorose-light.png', url: 'https://bamboorose.com' },
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
   What it is — the definition, before any inventory of features.

   This used to sit a thousand pixels below a feature grid, which meant
   the page listed what Pikku has before saying what Pikku is.
   ════════════════════════════════════════════════════════════════ */
function WhatPikkuIsSection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>How it works</div>
        <h2 className={styles.h2}>Everything plugs in. <em>Nothing locks in.</em></h2>
        <p className={styles.secLede}>
          This isn't a new stack asking you to abandon the one you have. You write functions and say
          how they're reachable; Pikku wires them to the libraries you'd have picked anyway — and then
          to whatever the place you're deploying to happens to provide.
        </p>
        <StackMatrix />
        <p className={styles.matrixCaption}>
          The top bands never change. That's the whole parity claim: the same code, the same
          libraries, the same generated clients — only the bottom row swaps.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   The console — one real screenshot.

   The carousel this replaces had fifteen tabs and fourteen "screenshot
   coming" placeholders. Naming the rest in prose costs nothing and
   promises nothing that cannot be shown.
   ════════════════════════════════════════════════════════════════ */
const OTHER_SCREENS = [
  'functions', 'APIs', 'workflows', 'emails', 'agents', 'scenarios',
  'users', 'roles and scopes', 'audit', 'secrets', 'credentials',
  'auth providers', 'workflow runs', 'agent threads',
];

function ConsoleSection() {
  return (
    <section id="console" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>The console</div>
        <h2 className={styles.h2}>See everything running. <em>Nothing is a black box.</em></h2>
        <p className={styles.secLede}>
          Every function, its wirings, its permissions and its last run — in a console that ships with
          the framework and runs on your machine.
        </p>

        <div className={styles.screenshotFrame}>
          <div className={styles.screenshotChrome}>
            <span className={styles.termDot} style={{ background: '#e06c5b' }} />
            <span className={styles.termDot} style={{ background: '#e0b34b' }} />
            <span className={styles.termDot} style={{ background: '#79b06a' }} />
            <span className={styles.screenshotAddr}>localhost:3000/console</span>
          </div>
          <img
            src="/img/console-screenshot.webp"
            alt="The Pikku console, showing every function in the system"
            loading="lazy"
          />
        </div>

        <p className={styles.consoleRest}>
          <strong>Fourteen more screens ship with it</strong> — {OTHER_SCREENS.join(', ')}. The admin
          half is the internal tool you were going to build anyway, except it already knows your
          permissions, and every change it makes lands in the same audit trail as everything else.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Scenarios.

   Deliberately the one h2 on this page that does not use the
   "Assertion. Counter-assertion." construction every other heading uses —
   five in a row had turned a house voice into a reflex.

   Every claim here is checked against source, because the first draft of
   this section undersold it to about a third of its real size:
     - given/when/then phases      core/.../scenario-step.types.ts:21
     - surfaces browser|cli|default            same file:49
     - --run / --strict / --coverage / --video  cli/src/cli.wiring.ts:746-793
     - V8 precise coverage via CDP   core/src/services/v8-coverage-service.ts
     - video + ffmpeg re-encode      @pikku/playwright src/capture.ts
     - click by accessible name      examples/online-shop/.../browser.steps.ts:314
   The code card is the real journey.scenario.ts from the online-shop example.

   What is NOT claimed, having checked: no .feature files (@pikku/cucumber is
   deprecated — "Deleted, Pikku end-to-end tests are written with
   pikkuScenario"), no load testing, no fuzzing, no contract testing.
   ════════════════════════════════════════════════════════════════ */
function ScenariosSection() {
  const surfaces: { flag: string; title: string; body: string }[] = [
    {
      flag: '--run default',
      title: 'Server-side',
      body: 'Every step is an RPC through that person’s authenticated client — real sign-in, real middleware, real permission checks. Never internal dispatch. This is the fast path.',
    },
    {
      flag: '--run browser',
      title: 'Through a browser',
      body: 'A real Chromium, driven by Playwright. Steps click by the label a person would look for, so a control nobody can find fails the step instead of passing on a test id.',
    },
    {
      flag: '--run cli',
      title: 'Over the websocket',
      body: 'The same journey driven the way a connected client drives it, so the transport your realtime users are on is exercised by the same file.',
    },
  ];

  return (
    <section id="scenarios" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Scenarios</div>
        <h2 className={styles.h2}>Write the journey once. Run it as a human.</h2>
        <p className={styles.secLede}>
          A scenario is given, when, then — in TypeScript. Each step names what a person is
          trying to do, the code that does it, and who is doing it. Declare the people your app is
          for, and the same file becomes your end-to-end test, your staging smoke test and your
          production health check.
        </p>

        <div className={styles.scenGrid}>
          <div className={styles.scenPoints}>
            <div className={styles.scenPoint}>
              <h3>Prose, not glue</h3>
              <p>
                Every step carries a <code>template</code>, so a run reports itself in English —
                given, when and then, with the actor&rsquo;s name in the sentence. Gherkin&rsquo;s
                readability, without a <code>.feature</code> file and a step-definition layer
                drifting apart from each other.
              </p>
            </div>
            <div className={styles.scenPoint}>
              <h3>Coverage from the journey</h3>
              <p>
                <code>--coverage</code> snapshots precise V8 coverage around each scenario — the
                same backend, whether the journey drove it by clicking or by RPC. Not which lines
                your unit tests touched. Which of your functions no real journey has ever reached.
                That is a shorter list, and a more alarming one.
              </p>
            </div>
            <div className={styles.scenPoint}>
              <h3>Failures arrive with the evidence</h3>
              <p>
                Video of the run, the screenshot at the moment it broke, console errors, page
                errors, failed requests. Every scenario records; by default only the failures are
                kept. They play back in the console, captioned with who was driving.
              </p>
            </div>
          </div>

          <CodeCard filename="journey.scenario.ts">
            <pre>
              <code>{`export const shopperBuysAnItem = pikkuScenario({
  title: 'A shopper fills a basket and checks out',
  tags: ['journey'],
  func: async (_services, _data, { scenario, actors }) => {
    const visitor = actors.visitor

    await scenario.then('opens the app',
      'opensPage', { path: '/app' }, { actor: visitor })

    await scenario.then('clicks through to the catalogue',
      'clicks', { name: 'Catalogue' }, { actor: visitor })

    await scenario.then('sees a mug for sale',
      'seesText', { text: 'Enamel coffee mug' }, { actor: visitor })

    // Eight buttons say "Add to basket". This one is the mug's.
    await scenario.then('adds it to the basket',
      'clicksNear',
      { near: 'Enamel coffee mug', name: 'Add to basket' },
      { actor: visitor })
  },
})`}</code>
            </pre>
          </CodeCard>
        </div>

        {/* The three surfaces. This is the part the first draft missed entirely:
            one file, three ways of driving it, chosen at run time by a flag. */}
        <div className={styles.scenSurfaces}>
          {surfaces.map((s) => (
            <div key={s.flag} className={styles.scenSurface}>
              <code className={styles.scenSurfaceFlag}>{s.flag}</code>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <p className={styles.matrixCaption}>
          The prose is a contract. Run with <code>--strict</code> and a{' '}
          <code>then</code> that no witness checked on the surface its sentence claims is a
          failure, not a quiet pass. And when a deterministic script is not enough —{' '}
          <code>pikku persona run</code> hands a declared person to a model to play in character
          against a real environment. That one asserts nothing: it works your API as them and
          reports back what came out that should not have.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Day one — the platform work, on the page's one dark band.

   This merges what used to be two sections making the same argument
   three and a half thousand pixels apart.
   ════════════════════════════════════════════════════════════════ */
function PlatformReadySection() {
  const cards: { title: string; cost: string; body: React.ReactNode }[] = [
    {
      cost: 'usually a quarter of work',
      title: 'Sign-in your customers already have',
      body: <>Standard OAuth and OIDC. Point it at Google, Microsoft, Okta — or any provider you already pay for — and an organisation signs in with the accounts it already manages.</>,
    },
    {
      cost: 'usually a separate system',
      title: 'A history your auditors accept',
      body: <>Every action leaves a record — who, what, when — no matter which entry point it came through, not just the ones someone remembered to instrument.</>,
    },
    {
      cost: 'usually a rewrite',
      title: 'Multitenancy from the start',
      body: <>Organisations and tenants are first-class — isolated data, scoped access, permissions wired through every entry point. The thing that is painful to retrofit, already done.</>,
    },
    {
      cost: 'usually a backlog item forever',
      title: 'Secrets that never touch a .env',
      body: <>One interface locally and in production. Swap to Secrets Manager or Vault without touching a function.</>,
    },
    {
      cost: 'usually a week of plumbing',
      title: 'Database and types from your schema',
      body: <>Point it at Postgres, SQLite or D1. It reads your schema and generates end-to-end types — no setup, no drift.</>,
    },
    {
      cost: 'usually a separate vendor',
      title: 'Email with live previews',
      body: <>Compose transactional mail and preview every message in the console before a single one is sent.</>,
    },
  ];

  return (
    <section id="platform" className={styles.sectionInk}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Day one</div>
        <h2 className={styles.h2}>The work that usually comes <em>after launch.</em></h2>
        <p className={styles.secLede}>
          SSO, audit, multitenancy and granular permissions are the things that hold a deal up
          eighteen months from now. They are in the open-source binary from the first command — not
          behind a sales call or a future quarter.
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
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Where it runs — one decision, one section.

   Deploy and Fabric were two sections for the same choice. The provider
   flags here are the ones the CLI actually accepts; `-p aws` is not one
   of them, and used to be printed on this page as copyable text.
   ════════════════════════════════════════════════════════════════ */
function DeploySection() {
  const tiers: {
    title: string;
    who: string;
    body: string;
    cmd?: React.ReactNode;
    featured?: boolean;
    link?: { href: string; label: string };
  }[] = [
    {
      title: 'Standalone',
      who: 'One file. Server or desktop.',
      body: 'Bundles the API, the console and your frontend into a single Node bundle or compiled Bun binary. Copy it onto a box and run it — or wrap it as a desktop app.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p standalone</>,
      featured: true,
    },
    {
      title: 'AWS',
      who: 'Your account, your bill.',
      body: 'Generates serverless.yml and Lambda entry points — API Gateway for HTTP and WebSocket, SQS for queues, EventBridge for schedules, S3 for files, SSM for secrets. Azure is the same deal, one flag away.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p serverless</>,
    },
    {
      title: 'Cloudflare',
      who: 'Workers and Containers.',
      body: 'Workers, Durable Objects, Queues, Cron Triggers, D1 and R2 — including the stateful bits most edge runtimes make you give up. Anything that cannot run in a Worker is bundled as a container and proxied through a Durable Object.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p cloudflare</>,
    },
    {
      title: 'Fabric',
      who: "Or don't host it at all.",
      body: 'The same application, hosted and observable, with an assistant that understands your data and your logic because Pikku already describes them. A deploy target, not a different product.',
      /* No `cmd`: the other three chips hold copyable shell, so putting
         English in that slot — in the class that marks the binary, no less —
         read as a fourth command, or as a truncated one. */
      link: { href: 'https://pikkufabric.com', label: 'Explore Fabric →' },
    },
  ];

  return (
    <section id="deploy" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Where it runs</div>
        <h2 className={styles.h2}>Host it yourself. <em>Or don't.</em></h2>
        <p className={styles.secLede}>
          The same functions, the same wirings, the same generated clients. Only the backing services
          change — and your own <code>createSingletonServices</code> always has the last word.
        </p>
        <div className={styles.tiers}>
          {tiers.map((t) => (
            <div key={t.title} className={`${styles.tier} ${t.featured ? styles.tierFeatured : ''}`}>
              <h3>{t.title}</h3>
              <div className={styles.tierWho}>{t.who}</div>
              <p>{t.body}</p>
              {t.cmd && <code className={styles.tierCode}>{t.cmd}</code>}
              {t.link && (
                <Link href={t.link.href} className={styles.tierLink}>{t.link.label}</Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Proof — the homepage had four logos and not one customer word.
   ════════════════════════════════════════════════════════════════ */
function ProofSection() {
  const t = testimonials[0];
  return (
    <section id="proof" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Proof</div>
        <blockquote className={styles.quote}>
          <p>“{t.quote}”</p>
          <cite className={styles.quoteCite}>
            <b>{t.author}</b> — {t.role}, {t.company}
          </cite>
        </blockquote>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Where to go next — one labelled departure block.

   This replaces eleven links scattered through six sections, most of
   them firing into /docs before the product had been defined.
   ════════════════════════════════════════════════════════════════ */
const EXITS = [
  { label: 'For engineers', title: 'Pikku for developers', href: '/developers' },
  { label: 'The ecosystem', title: 'Addons & OpenAPI', href: '/addons' },
  { label: 'Performance', title: 'Benchmarks', href: '/benchmarks' },
  { label: 'Reference', title: 'Documentation', href: '/docs' },
];

function NextSection() {
  return (
    <section id="next" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Where to go next</div>
        <h2 className={styles.h2}>Pick your depth.</h2>
        <div className={styles.nextGrid}>
          {EXITS.map((e) => (
            <Link key={e.href} href={e.href} className={styles.nextCard}>
              <span className={styles.nextLabel}>{e.label}</span>
              <span className={styles.nextTitle}>{e.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   CTA — the last thing read, so it gets the strongest line.
   ════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section id="start" className={`${styles.section} ${styles.cta}`}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow} style={{ textAlign: 'center' }}>Try it now</div>
        <h2 className={styles.h2} style={{ margin: '0 auto 22px', textAlign: 'center' }}>
          Two commands. <em>A whole platform.</em>
        </h2>
        <p className={styles.secLede} style={{ margin: '0 auto', textAlign: 'center' }}>
          No account. No installation. No setup. Run it and watch the whole system come up.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/getting-started" className={styles.btnPrimary}>Read the quick start</Link>
          <Link href="https://github.com/pikkujs/pikku" className={styles.btnGhost}>Star on GitHub</Link>
        </div>
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
      title="Pikku — a TypeScript backend framework with the platform attached."
      description="Write a function once and wire it to HTTP, WebSocket, cron, queue, RPC or MCP. Database, auth, secrets, email, workflows and a console included. Deploy anywhere, including fully managed."
    >
      <NavbarPageToggle isDeveloperPage={false} />
      <PaperPage>
        <Hero />
        <TrustStrip />
        <WhatPikkuIsSection />
        <ConsoleSection />
        <ScenariosSection />
        <PlatformReadySection />
        <DeploySection />
        <ProofSection />
        <NextSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
