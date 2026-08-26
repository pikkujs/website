import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import { Highlight, Prism } from 'prism-react-renderer';
import { NavbarPageToggle } from '../components/HomepageShared';
import { PaperPage } from '../components/PaperLayout';
import snippets from '../data/snippets.json';
import { wireTypes, wireCategories } from '../data/wireTypes';
import { snippetSourceUrl } from '../utils/snippets';
import styles from './index.module.css';

/* Prism ships no SQL grammar by default and the migration snippet is SQL, so it
   is registered once here rather than per render. */
(globalThis as any).Prism = Prism;
require('prismjs/components/prism-sql');

/* Colour comes from `.token.*` rules in index.module.css, not from a
   prism-react-renderer theme — the paper palette is CSS variables, and a JS
   theme would hardcode the same hues a second time. */
function Code({ code, lang = 'typescript' }: { code: string; lang?: string }) {
  return (
    <Highlight code={code} language={lang} theme={{ plain: {}, styles: [] }}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={styles.codeBlock} tabIndex={0}>
          <code>
            {tokens.map((line, i) => (
              <span key={i} {...getLineProps({ line })}>
                {line.map((token, k) => <span key={k} {...getTokenProps({ token })} />)}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

/* Every code sample on this page is extracted from the online-shop example in
   the pikku monorepo, not written here. `npm run sync-snippets` is the only
   thing that may change them. */
function Snippet({ name, lang }: { name: keyof typeof snippets; lang?: string }) {
  const href = snippetSourceUrl(name);
  return (
    <div className={styles.snippet}>
      <Code code={snippets[name]} lang={lang ?? 'typescript'} />
      {href && (
        <a className={styles.snippetSource} href={href} target="_blank" rel="noreferrer">
          {lang === 'sql' ? 'real migration' : 'real code'} — online-shop example ↗
        </a>
      )}
    </div>
  );
}

/* ── Screenshot frame with browser chrome ────────────────────── */
function ScreenshotFrame({
  src,
  alt,
  addr,
  width,
  height,
}: {
  src: string;
  alt: string;
  addr: string;
  width: number;
  height: number;
}) {
  return (
    <figure className={styles.screenshotFrame}>
      <div className={styles.screenshotChrome}>
        <span className={styles.termDot} style={{ background: '#e06c5b' }} />
        <span className={styles.termDot} style={{ background: '#e0b34b' }} />
        <span className={styles.termDot} style={{ background: '#79b06a' }} />
        <span className={styles.screenshotAddr}>{addr}</span>
      </div>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </figure>
  );
}

/* ── Click-to-copy command chip ──────────────────────────────── */
function CopyCmd({ cmd }: { cmd: string }) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2000);
  };

  const label =
    state === 'copied' ? '✓ copied' : state === 'failed' ? 'press ⌘C to copy' : cmd;

  return (
    <button
      type="button"
      className={styles.heroCmd}
      onClick={copy}
      aria-label={`Copy command: ${cmd}`}
    >
      <span className={styles.heroCmdText}>{label}</span>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Copy failed' : ''}
      </span>
    </button>
  );
}

/* ── Code carousel — flip between the layers of one artefact ─── */
function CodeCarousel({ slides }: { slides: { label: string; code: React.ReactNode }[] }) {
  const [i, setI] = React.useState(0);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const go = (next: number) => {
    const n = (next + slides.length) % slides.length;
    setI(n);
    tabs.current[n]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselBar}>
        <div className={styles.carouselTabs} role="tablist" aria-label="Scenario code layers" onKeyDown={onKeyDown}>
          {slides.map((s, n) => (
            <button
              key={s.label}
              ref={(el) => { tabs.current[n] = el; }}
              type="button"
              role="tab"
              id={`sc-tab-${n}`}
              aria-selected={n === i}
              aria-controls={`sc-panel-${n}`}
              tabIndex={n === i ? 0 : -1}
              className={n === i ? styles.carouselTabOn : styles.carouselTab}
              onClick={() => setI(n)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.carouselNav}>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous snippet">←</button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next snippet">→</button>
        </div>
      </div>
      {/* Each slide brings its own <pre> — a sourced snippet also carries a link
          back to the file it came from, which cannot live inside one. */}
      {slides.map((s, n) => (
        <div
          key={s.label}
          id={`sc-panel-${n}`}
          role="tabpanel"
          aria-labelledby={`sc-tab-${n}`}
          hidden={n !== i}
          className={styles.carouselPanel}
        >
          {s.code}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Hero — the prompt goes in, the system comes out
   ════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 className={styles.h1}>
              Describe your business.<br />
              Ship the software that <em>runs it.</em>
            </h1>
            <p className={styles.lede}>
              Tell Pikku what your business does, in plain English. You get a real system —
              database, sign-in, permissions, long-running processes, tests — organised around
              the people it serves. One command runs the whole thing on your laptop. The same
              thing ships to production.
            </p>
            <div className={styles.heroActions}>
              <Link href="/getting-started" className={styles.btnPrimary}>Get started</Link>
              <Link href="#people" className={styles.btnGhost}>See what makes it different</Link>
            </div>
            <p className={styles.heroMeta}>
              Runtime MIT · compiler BSL · runs on your own infrastructure
            </p>
          </div>

          <PromptPanel />
        </div>
      </div>
    </header>
  );
}

/* ── Hero artefact: prompt in, working system out ─────────────── */
function PromptPanel() {
  return (
    <div className={styles.promptPanel}>
      <div className={styles.promptBar}>
        <span className={styles.termDot} style={{ background: '#e06c5b' }} />
        <span className={styles.termDot} style={{ background: '#e0b34b' }} />
        <span className={styles.termDot} style={{ background: '#79b06a' }} />
        <span className={styles.promptBarTitle}>claude — ~/retreat</span>
      </div>

      <div className={styles.promptBody}>
        <div className={styles.promptYou}>
          <span className={styles.promptWho}>you</span>
          <p>
            Guests book rooms for a retreat. Staff confirm them. Send a reminder the week
            before, and don't let two guests hold the same room.
          </p>
        </div>

        <div className={styles.promptOut}>
          <div className={styles.promptOutHead}>pikku</div>
          <ul className={styles.promptList}>
            <li><span className={styles.pOk}>✓</span> <b>4 tables</b> <span className={styles.pDim}>— room, booking, guest, reminder</span></li>
            <li><span className={styles.pOk}>✓</span> <b>2 personas</b> <span className={styles.pDim}>— guest <i>(primary)</i>, staff</span></li>
            <li><span className={styles.pOk}>✓</span> <b>9 functions</b> <span className={styles.pDim}>— permissions + audit wired</span></li>
            <li><span className={styles.pOk}>✓</span> <b>1 workflow</b> <span className={styles.pDim}>— hold → confirm → remind</span></li>
            <li><span className={styles.pOk}>✓</span> <b>5 scenarios</b> <span className={styles.pDim}>— run as guest &amp; staff</span></li>
          </ul>
          <div className={styles.promptBranch}>
            on branch <span className={styles.pBranch}>feature/bookings</span> — read the diff, then merge it
          </div>
        </div>
      </div>
    </div>
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
          <span className={styles.trustLabel}>Running businesses in production at</span>
          <div className={styles.trustLogos}>
            {logos.map((l) => (
              l.img ? (
                <Link key={l.name} href={l.url} className={styles.trustLogoLink} title={l.name}>
                  <img src={`/img/logos/${l.img}`} alt={l.name} height={26} loading="lazy" />
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
   Act I — Say what you need
   ════════════════════════════════════════════════════════════════ */
function PromptSection() {
  return (
    <section id="describe" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>Say what you need</div>
          <h2 className={styles.h2}>Your coding agent stops guessing.</h2>
          <p className={styles.secLede}>
            Pikku ships 62 skills for Claude Code, opencode and pi. They hand the agent your
            entire project — every function, route, table, permission and workflow — in a single
            call. It builds against what your system <em>is</em>, not what the filenames suggest.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <ol className={styles.steps}>
            <li>
              <code>npm create pikku@latest</code>
              <span>Scaffold the project.</span>
            </li>
            <li>
              <code>npx pikku skills install --core</code>
              <span>Drop the core skill set into your agent.</span>
            </li>
            <li>
              <code>npx pikku dev</code>
              <span>The whole platform comes up, locally.</span>
            </li>
            <li>
              <code>claude</code>
              <span>Now describe the thing you want built.</span>
            </li>
          </ol>

          <ul className={styles.claimList}>
            <li>
              <b>It reads the real system.</b> One <code>pikku meta context</code> call returns
              every function, wire, schema and permission — so the agent plans against facts.
            </li>
            <li>
              <b>The diff is the contract.</b> Work lands on a branch. There's no plan document to
              approve and no hidden state: read the diff, merge it, or delete the branch.
            </li>
            <li>
              <b>It stays idiomatic.</b> The skills encode how Pikku is meant to be written, so
              what comes back looks like the rest of your codebase.
            </li>
            <li>
              <b>MIT, and yours.</b> The skills are open source and live in your repo. No
              subscription sits between you and your own code.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Act II — People, not endpoints  (the differentiator)
   ════════════════════════════════════════════════════════════════ */
function PeopleSection() {
  // Docusaurus finds anchors only through this hook, never from a rendered
  // `id` attribute, so the hero link to #people needs the section to say so.
  useBrokenLinks().collectAnchor('people');

  const consequences = [
    {
      title: 'They sign in for real',
      body: 'Standard OAuth and OIDC. Point it at Google, Microsoft, Okta or any provider and your people are in — no authentication code to own.',
    },
    {
      title: 'They are allowed to do things',
      body: 'Scopes and roles hang off the person, enforced on every entry point. A refusal is a first-class outcome you can write a test against.',
    },
    {
      title: 'You know who did what',
      body: 'Audit records carry the person, the action and the moment — through HTTP, a queue, a workflow or an agent. One history, every route in.',
    },
    {
      title: 'Their data stays theirs',
      body: 'Organisations and tenants are part of the session, not a WHERE clause you hope everyone remembered.',
    },
  ];

  return (
    <section id="people" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>What Pikku is built around</div>
          <h2 className={styles.h2}>Software shaped like your business, not your database.</h2>
          <p className={styles.secLede}>
            Most frameworks start with routes and tables — and the people using them end up
            implied, scattered across middleware and someone's head. Pikku starts with who your
            business serves. You name them once, and they run through everything you build.
          </p>
        </div>

        <div className={styles.defRow}>
          <div className={styles.def}>
            <div className={styles.defTerm}>Persona</div>
            <p><b>The kind of person</b> your product is for. The guest. The staff member. The nightly job that answers to nobody.</p>
          </div>
          <div className={styles.def}>
            <div className={styles.defTerm}>Actor</div>
            <p><b>One body that signs in.</b> Usually one per persona — until a scenario needs two guests, which is exactly what an isolation test is.</p>
          </div>
          <div className={styles.def}>
            <div className={styles.defTerm}>Role</div>
            <p><b>What they may do.</b> A named set of permissions, composed by an admin, checked on every way in.</p>
          </div>
        </div>

        <div className={styles.peopleGrid}>
          <div className={styles.peopleCode}>
            <Snippet name="definePersonas" />
            <p className={styles.codeNote}>
              <b>They have a personality, not just an email.</b> That line is why an actor can be
              handed to a language model and told to go and use your product in character — the
              same declaration that signs them in also tells them who to be.
            </p>
          </div>

          <div className={styles.peopleWhy}>
            <h3 className={styles.h3}>Name them once. They show up everywhere.</h3>
            <div className={styles.consList}>
              {consequences.map((c) => (
                <div key={c.title} className={styles.cons}>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Act III — The four commands
   ════════════════════════════════════════════════════════════════ */
/* The report is the default slide, so it carries the terminal's colour the way
   the other artefacts on this page do rather than sitting flat. */
const ok = <span className={styles.tOk}>✓</span>;
const dim = (t: string) => <span className={styles.tDim}>{t}</span>;

/* Every scenario title and step label below is the string the template actually
   declares — see the `scenario` and `converse` slides beside this one. */
const REPORT_SLIDE = (
  <pre className={styles.codeBlock} tabIndex={0}><code>
    <span className={styles.tPrompt}>$</span> npx pikku scenario run local{'\n\n'}
    <span className={styles.tOk}>PASS</span> Shopper buys an item {dim('(1284ms)')}{'\n'}
    {'  Shopper opens their basket        '}{ok}  {dim(' 41ms')}{'\n'}
    {'  Shopper browses the catalogue     '}{ok}  {dim(' 63ms')}{'\n'}
    {'  Shopper adds a mug to the basket  '}{ok}  {dim(' 38ms')}{'\n'}
    {'  Shopper checks out                '}{ok}  {dim('212ms')}{'\n'}
    {'  Order is paid                     '}{ok}  {dim('902ms')}{'\n'}
    <span className={styles.tOk}>PASS</span> Shopper gets help from the assistant {dim('(4610ms)')}{'\n'}
    {'  Shopper chats to the assistant  '}{ok}  {dim('4.4s')}{'\n'}
    {'  Basket really has the mug       '}{ok}  {dim(' 36ms')}{'\n\n'}
    {dim("2/2 scenarios passed against 'local'")}
  </code></pre>
);

const PILLARS: {
  cmd: string;
  claim: string;
  body: React.ReactNode;
  points: string[];
  artefact: React.ReactNode;
}[] = [
  {
    cmd: 'pikku dev',
    claim: 'Your whole production topology, on a laptop.',
    body: (
      <>
        Not a router with a file watcher. Queues, scheduled jobs, workflows, triggers, webhooks,
        email, file storage, AI agents, a database and an admin console — all running in one
        process, all swapping to real infrastructure when you deploy.
      </>
    ),
    points: [
      'No Docker, no cloud account, nothing to install first',
      'Embedded database — SQLite or Postgres, your choice',
      'Save a file and the types reload into the running process',
      'Console at localhost:3000/console, already signed in',
    ],
    artefact: (
      <div className={styles.term}>
        <div className={styles.termBar}>
          <span className={styles.termDot} style={{ background: '#e06c5b' }} />
          <span className={styles.termDot} style={{ background: '#e0b34b' }} />
          <span className={styles.termDot} style={{ background: '#79b06a' }} />
          <span className={styles.termTitle}>~/retreat — zsh</span>
        </div>
        <div className={styles.termBody}>
          <div><span className={styles.tPrompt}>$</span> npx pikku dev</div>
          <div className={styles.tDim}>◇ starting…</div>
          <div><span className={styles.tOk}>✓</span> database — schema read, types written</div>
          <div><span className={styles.tOk}>✓</span> sign-in · permissions · audit</div>
          <div><span className={styles.tOk}>✓</span> queues · schedules · workflows · agents</div>
          <div><span className={styles.tOk}>✓</span> email previews · file storage</div>
          <div><span className={styles.tOk}>✓</span> console <span className={styles.tUrl}>localhost:3000/console</span></div>
          <div><span className={styles.tOk}>✓</span> api <span className={styles.tUrl}>localhost:3000</span> <span className={styles.cursor} /></div>
        </div>
      </div>
    ),
  },
  {
    cmd: 'pikku db',
    claim: 'Your schema is a type — and privacy is part of it.',
    body: (
      <>
        One migration history produces your database types, your validators and your runtime
        coercion. Beside it sits one file most stacks keep in a spreadsheet instead: who may ever
        see each column. It lists every column you have, so the compiler notices a new one.
      </>
    ),
    points: [
      'Returning a secret column from an API is a compile error',
      'Add a column and the build fails until you classify it',
      'pikku db audit names every sensitive column with no anonymisation plan',
      'pikku db check tells you whether production really matches its migrations',
      'Same commands on SQLite, embedded Postgres, or the real thing',
    ],
    artefact: (
      <div className={styles.artStack}>
        <Snippet name="paymentTable" lang="sql" />
        <div className={styles.artStep}>and the compiler asks about every column</div>
        <div className={styles.term}>
          <div className={styles.termBar}>
            <span className={styles.termDot} style={{ background: '#e06c5b' }} />
            <span className={styles.termDot} style={{ background: '#e0b34b' }} />
            <span className={styles.termDot} style={{ background: '#79b06a' }} />
            <span className={styles.termTitle}>~/shop — zsh</span>
          </div>
          {/* Shape copied from the CLI's own printer — packages/cli/src/functions/
              commands/db-audit.ts. It groups by table, pads column names to 30,
              and has no glyphs and no "unclassified" state: the manifest only
              carries columns somebody has already classified. */}
          <div className={styles.termBody}>
            <div><span className={styles.tPrompt}>$</span> npx pikku db audit</div>
            <div>Classification audit:</div>
            <div>{'  payment:'}</div>
            <div>{'    provider_ref                   '}secret<span className={styles.tDim}>{'   (null → will be nulled on clone)'}</span></div>
            <div>{'    amount_cents                   '}public</div>
            <div>{'    reason                         '}private<span className={styles.tDim}>{'  redact'}</span></div>
            <div>{'\u00a0'}</div>
            <div className={styles.tDim}>Summary: 3 columns total — 1 public, 1 private, 1 secret</div>
            <div className={styles.tDim}>Secret columns (extra-sensitive): payment.provider_ref</div>
            <div className={styles.tWarn}>1 private/secret column(s) have no anonymize strategy and will be NULLed on clone: payment.provider_ref<span className={styles.cursor} /></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    cmd: 'pikku knowledge',
    claim: 'The part your code can never tell you.',
    body: (
      <>
        Pikku already knows every function, table and permission — so the knowledge base refuses
        to store any of it. What goes here is what no generator can derive: what a thing means to
        the business, why a rule was chosen, what it rules out, and what nobody has answered yet.
      </>
    ),
    points: [
      'Every reference points at real code — and is checked that it still exists',
      'Try to write down routes or tables and it stops you: pikku already knows',
      'pikku knowledge validate fails CI when a note drifts from reality',
      'It is what your agent reads before it touches anything',
    ],
    artefact: (
      <div className={styles.term}>
        <div className={styles.termBar}>
          <span className={styles.termDot} style={{ background: '#e06c5b' }} />
          <span className={styles.termDot} style={{ background: '#e0b34b' }} />
          <span className={styles.termDot} style={{ background: '#79b06a' }} />
          <span className={styles.termTitle}>~/retreat — zsh</span>
        </div>
        <div className={styles.termBody}>
          <div><span className={styles.tPrompt}>$</span> npx pikku knowledge validate</div>
          <div><span className={styles.tOk}>✓</span> decisions/no-overbooking.md</div>
          <div className={styles.tDim}>&nbsp;&nbsp;→ resource:func:createBooking — ok</div>
          <div><span className={styles.tErr}>✗</span> slices/late-checkout.md</div>
          <div className={styles.tDim}>&nbsp;&nbsp;→ resource:func:extendStay — no longer exists</div>
          <div><span className={styles.tErr}>✗</span> slices/room-swap.md</div>
          <div className={styles.tDim}>&nbsp;&nbsp;→ no scenario — nothing to build against</div>
          <div className={styles.tDim}>2 findings — the docs drifted, not the code<span className={styles.cursor} /></div>
        </div>
      </div>
    ),
  },
  {
    cmd: 'pikku scenario',
    claim: 'One test file. Three jobs.',
    body: (
      <>
        A scenario is a workflow whose every step is performed <em>by one of your people</em>, over
        the real transport. Each actor carries its own signed-in client and cookie jar, so the
        permissions and the serialisation are the real ones. Which means the same file is your
        end-to-end test locally, your smoke test on staging, and your health check against
        production.
      </>
    ),
    points: [
      'Steps must name who performs them — a scenario cannot reach past the front door',
      'A 403 is data, not a crash, so permission rules are directly testable',
      'Browser steps and API steps sit in the same story',
      'An LLM can play a persona, talk to your agents in character, and report back',
    ],
    artefact: (
      <CodeCarousel
        slides={[
          { label: 'what you read', code: REPORT_SLIDE },
          { label: 'the scenario', code: <Snippet name="scenarioSteps" /> },
          { label: 'talking to an agent', code: <Snippet name="converseSteps" /> },
        ]}
      />
    ),
  },
];

function PillarsSection() {
  return (
    <section id="platform" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>The platform</div>
          <h2 className={styles.h2}>Four commands cover the parts nobody wants to build.</h2>
          <p className={styles.secLede}>
            Every business system needs a place to run, a schema it can trust, a memory of why it
            works this way, and proof that it still does. Most teams assemble that from six
            vendors. Here it is four commands, and they already know about each other.
          </p>
        </div>

        <div className={styles.pillars}>
          {PILLARS.map((p) => (
            <article key={p.cmd} className={styles.pillar}>
              <div className={styles.pillarCopy}>
                <h3 className={styles.pillarCmd}><span className={styles.pillarDollar}>$</span> {p.cmd}</h3>
                <p className={styles.pillarClaim}>{p.claim}</p>
                <p className={styles.pillarBody}>{p.body}</p>
                <ul className={styles.pillarPoints}>
                  {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </div>
              <div className={styles.pillarArt}>{p.artefact}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Act IV — Workflows
   ════════════════════════════════════════════════════════════════ */
function WorkflowSection() {
  return (
    <section id="workflows" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>Work that takes longer than a request</div>
          <h2 className={styles.h2}>
            Real business processes wait on people, money and time.
          </h2>
          <p className={styles.secLede}>
            Onboarding, approvals, refunds, renewals, chasing an unpaid invoice — the work that
            actually runs a company spans days and needs a human to say yes. Write it as ordinary sequential
            code. Pikku handles the persistence, the retries and the resumption.
          </p>
        </div>

        <div className={styles.wfGrid}>
          <Snippet name="workflowBranching" />
          <ul className={styles.claimList}>
            <li>
              <b>It survives everything.</b> Crash, restart or redeploy on step four and it
              resumes at step four — completed steps return their stored result instead of
              running twice.
            </li>
            <li>
              <b>It can wait weeks.</b> A sleeping workflow holds no connection and no process.
              State lives in Postgres, Redis or Mongo.
            </li>
            <li>
              <b>People are part of it.</b> An approval step suspends the run until someone
              decides — no polling loop, no cron job pretending to be a queue.
            </li>
            <li>
              <b>Agents are just steps.</b> An AI agent can be a node in the graph, using your
              existing functions as its tools, with the same auth as everyone else.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Console
   ════════════════════════════════════════════════════════════════ */
function ConsoleSection() {
  return (
    <section id="console" className={styles.sectionDark}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>The console</div>
          <h2 className={styles.h2}>Open it and the business is legible.</h2>
          <p className={styles.secLede}>
            The operating console ships with the platform, locally and in production. On the left,
            everything the system can do. On the right, the same system told as stories —
            each with its cast, each one runnable.
          </p>
        </div>

        <div className={styles.consoleGrid}>
          <div>
            <ScreenshotFrame
              src="/img/console-screenshot.webp"
              alt="Pikku Console listing every function with its type, auth, permissions and wirings, and a detail panel for one function"
              addr="localhost:3000/console — functions"
              width={2932}
              height={1850}
            />
            <p className={styles.shotCaption}>
              Every function, what it needs, and everything it's wired to.
            </p>
          </div>
          <div>
            <ScreenshotFrame
              src="/img/console-scenarios.png"
              alt="Pikku Console scenarios view showing a feature, its cast of actors, and Given/When/Then steps"
              addr="localhost:3000/console — scenarios"
              width={1470}
              height={780}
            />
            <p className={styles.shotCaption}>
              The same system as behaviour — cast, steps, and a pass or fail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Deploy
   ════════════════════════════════════════════════════════════════ */
function DeploySection() {
  const tiers: {
    title: string;
    who: string;
    body: string;
    cmd: React.ReactNode;
    pill: 'oss' | 'managed';
    featured?: boolean;
  }[] = [
    {
      title: 'Standalone',
      who: 'Anywhere you control.',
      body: 'Compile the entire platform into a single executable and run it on your own machine, your own rack, or a customer\'s network.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p standalone</>,
      pill: 'oss',
    },
    {
      title: 'Your cloud',
      who: 'Your account, your bill.',
      body: 'Ship to AWS or Cloudflare yourself. Same application, your infrastructure, nothing proprietary in the path.',
      cmd: <><span className={styles.thl}>pikku</span> deploy apply -p aws</>,
      pill: 'oss',
    },
    {
      title: 'Fabric',
      who: 'Managed, and it knows your system.',
      body: 'Push and forget. Every function becomes a serverless worker with logs, metrics and traces — and an assistant that already understands your data and your rules.',
      cmd: <><span className={styles.thl}>pikku</span> fabric deploy apply</>,
      pill: 'managed',
      featured: true,
    },
  ];

  return (
    <section id="deploy" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>When it's time to ship</div>
          <h2 className={styles.h2}>One command out. Three places to land.</h2>
          <p className={styles.secLede}>
            The same application deploys three ways, and you can change your mind later without
            rewriting anything. Two of them you run yourself. The third is us running it for
            you.
          </p>
        </div>
        <div className={styles.tiers}>
          {tiers.map((t) => (
            <div key={t.title} className={`${styles.tier} ${t.featured ? styles.tierFeatured : ''}`}>
              <div className={styles.tierHead}>
                <h3>{t.title}</h3>
                <span className={t.pill === 'oss' ? styles.pillOss : styles.pillManaged}>
                  {t.pill === 'oss' ? 'self-hosted' : 'managed'}
                </span>
              </div>
              <div className={styles.tierWho}>{t.who}</div>
              <p>{t.body}</p>
              <code className={styles.tierCode}>{t.cmd}</code>
            </div>
          ))}
        </div>
        <p className={styles.deployNote}>
          Fabric is the hosted option — <Link href="https://pikkufabric.com">see what it adds →</Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Every wiring — the way out to the per-wire pages
   ════════════════════════════════════════════════════════════════ */
/* The list is `wireTypes`, the same data /features renders from, so a wiring
   added there appears here without anyone remembering this page exists. */
function WiresSection() {
  return (
    <section id="wires" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.secHead}>
          <div className={styles.eyebrow}>One function, every way in</div>
          <h2 className={styles.h2}>The same function, wired however it is reached.</h2>
          <p className={styles.secLede}>
            A function does not know whether it was called by a request, a queue, a schedule
            or a language model. Wiring is the one line that decides — and every one of them
            works the same way.
          </p>
        </div>

        {wireCategories.map((category) => {
          const wires = wireTypes.filter((w) => w.category === category);
          if (wires.length === 0) return null;
          return (
            <div key={category} className={styles.wireGroup}>
              <h3 className={styles.wireGroupTitle}>{category}</h3>
              <div className={styles.wireGrid}>
                {wires.map((w) => (
                  <Link key={w.id} href={w.url} className={styles.wireCard}>
                    <span className={styles.wireCardIcon}><w.icon size={20} /></span>
                    <span className={styles.wireCardBody}>
                      <span className={styles.wireCardLabel}>
                        {w.label}
                        {w.badge && <span className={styles.wireCardBadge}>{w.badge}</span>}
                      </span>
                      <span className={styles.wireCardDesc}>{w.description}</span>
                    </span>
                    <span className={styles.wireCardArrow} aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   CTA
   ════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section id="start" className={`${styles.sectionAlt} ${styles.cta}`}>
      <div className={styles.wrap}>
        <div className={styles.ctaIn}>
          <h2 className={styles.ctaH2}>
            A tech stack gives you parts.<br />
            <em>Pikku gives you the system that runs the business.</em>
          </h2>
          <p className={styles.ctaLede}>
            The people it serves, what they're allowed to do, the processes that take a month, the
            proof it still works, and a record of why it was built that way — in one project you
            can run right now.
          </p>

          <div className={styles.ctaCmds}>
            <CopyCmd cmd="npm create pikku@latest" />
            <CopyCmd cmd="npx pikku dev" />
          </div>

          <div className={styles.ctaActions}>
            <Link href="/getting-started" className={styles.btnPrimary}>Read the quick start</Link>
            <Link href="/developers" className={styles.btnGhost}>Pikku for engineers</Link>
            <Link href="https://github.com/pikkujs/pikku" className={styles.btnGhost}>GitHub</Link>
          </div>
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
      title="Pikku — Describe your business. Ship the software that runs it."
      description="A platform built around the people your business serves. Describe what you need, get a real system — database, permissions, durable workflows and tests — running locally with one command and shipping anywhere."
    >
      <NavbarPageToggle isDeveloperPage={false} />
      <PaperPage>
        <Hero />
        <TrustStrip />
        <PromptSection />
        <PeopleSection />
        <PillarsSection />
        <WorkflowSection />
        <ConsoleSection />
        <DeploySection />
        <WiresSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
