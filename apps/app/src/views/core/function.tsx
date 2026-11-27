import React from 'react';
import { Pk } from '@pikku/theme-brand';
import Link from '@/components/site/Link';
import Layout from '@/components/site/Layout';
import CodeBlock from '@/components/site/CodeBlock';
import { PaperPage, CodeCard, StepBadge } from '@/components/PaperLayout';
import styles from './function.module.css';
import snippets from '@/data/snippets.json';
import snippetsMeta from '@/data/snippets-meta.json';

type SnippetKey = keyof typeof snippets & keyof typeof snippetsMeta.sources;

/** A template snippet, labelled with the name of the file it comes from. */
function Snippet({ id, badge }: { id: SnippetKey; badge?: string }) {
  const file = snippetsMeta.sources[id].path.split('#')[0].split('/').pop()!;
  return (
    <CodeCard snippet={id} filename={file} badge={badge}>
      <CodeBlock language="typescript">{snippets[id]}</CodeBlock>
    </CodeCard>
  );
}

function Head({ note, title, children }: { note: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.sectionHead}>
      <p className={styles.note}>{note}</p>
      <h2 className={styles.h2}>{title}</h2>
      <p className={styles.lead}>{children}</p>
    </div>
  );
}

function Cards({ items }: { items: { name: string; desc: React.ReactNode; example?: string }[] }) {
  return (
    <ul className={styles.cards}>
      {items.map((c) => (
        <li key={c.name} className={styles.outline}>
          <h3 className={styles.cardName}>{c.name}</h3>
          <p className={styles.cardText}>{c.desc}</p>
          {c.example && <code className={styles.cardExample}>{c.example}</code>}
        </li>
      ))}
    </ul>
  );
}

/* ── Hero ─────────────────────────────────────────────── */
function HeroScene() {
  const ways = [
    { x: 70, label: 'HTTP', hue: 'var(--hue-slate)' },
    { x: 220, label: 'CLI', hue: 'var(--hue-ochre)' },
    { x: 370, label: 'AI agent', hue: 'var(--hue-indigo)' },
  ];
  return (
    <svg className={styles.scene} viewBox="0 0 440 400" role="img" aria-labelledby="fnScene">
      <title id="fnScene">
        Hand-drawn lines run from HTTP, a command line and an AI agent into one chameleon labelled
        "your function", which takes services, data and wire.
      </title>
      <g className={styles.sceneLines} filter="url(#rough)">
        <path d="M70 108 C 80 150, 135 156, 168 178" />
        <path d="M220 108 C 224 125, 216 142, 220 158" />
        <path d="M370 108 C 360 150, 305 156, 272 178" />
      </g>
      {ways.map((w) => (
        <g key={w.label}>
          <Pk x={w.x - 30} y={4} width={60} height={60} color={w.hue} />
          <text x={w.x} y={94} textAnchor="middle">{w.label}</text>
        </g>
      ))}
      <Pk x={145} y={150} width={150} height={150} color="var(--paper-accent)" />
      <text x={220} y={322} textAnchor="middle" className={styles.sceneMain}>your function</text>
      {['services', 'data', 'wire'].map((name, i) => (
        <g key={name}>
          <rect className={styles.sceneSlot} x={22 + i * 136} y={346} width={124} height={42} rx={10} />
          <text x={84 + i * 136} y={375} textAnchor="middle">{name}</text>
        </g>
      ))}
    </svg>
  );
}

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroSplit}>
        <div>
          <p className={styles.note}>Pikku functions</p>
          <h1 className={styles.h1}>One function. <em>Many ways in.</em></h1>
          <p className={styles.lead}>
            A Pikku function is a typed async function with three arguments: the services it uses, its
            input, and information about this call, such as who is signed in. Wire it to HTTP, the
            command line or an AI agent without rewriting the body. A function that needs a signed-in
            user needs a way in that can identify one.
          </p>
          <div className={styles.actions}>
            <Link to="/docs/core-features/functions" className={styles.btnPrimary}>Read the function docs</Link>
            <a href="#every-way-in" className={styles.btnGhost}>See it wired three ways</a>
          </div>
        </div>
        <HeroScene />
      </div>
    </div>
  );
}

/* ── One function, three ways in ──────────────────────── */
const TABS: { id: SnippetKey; label: string; text: string }[] = [
  { id: 'httpAuthRoute', label: 'HTTP', text: 'The first route serves listItems at GET /items, with no sign-in. The second belongs to another function.' },
  { id: 'wireCli', label: 'CLI', text: 'The items command runs listItems. The other two commands run other functions.' },
  { id: 'aiAgent', label: 'AI agent', text: 'The shop assistant has listItems in its list of tools. This declares the agent; reaching it from outside is a separate step.' },
];

function WiringTabs() {
  const [active, setActive] = React.useState(0);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const last = TABS.length - 1;
    const next =
      e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label="Ways into listItems" className={styles.tabs} onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={i !== active}>
          <p className={styles.tabText}>{t.text}</p>
          <Snippet id={t.id} />
        </div>
      ))}
    </div>
  );
}

const WAYS: [string, string][] = [
  ['HTTP', '/wires/http'], ['WebSocket', '/wires/websocket'], ['Queue', '/wires/queue'], ['Cron', '/wires/cron'],
  ['CLI', '/wires/cli'], ['MCP', '/wires/mcp'], ['AI agent', '/wires/agent'], ['RPC', '/wires/rpc'],
  ['Workflow', '/wires/workflow'], ['Trigger', '/wires/trigger'], ['Gateway', '/wires/gateway'],
];

function EveryWayIn() {
  return (
    <section id="every-way-in" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="one body, three ways in" title={<>Connect it once <em>for each way in</em></>}>
          Each way in is a short wiring or a flag on the function. Here <code>listItems</code>, which
          needs no signed-in user, sits behind an HTTP route, a CLI command and an AI agent.
        </Head>
        <div className={styles.stack}>
          <Snippet id="listItems" />
          <WiringTabs />
        </div>
        <Cards
          items={[
            { name: 'One body', desc: 'Each wiring maps its input onto the data argument, so the body does not have to parse a request.' },
            { name: 'One contract', desc: 'The HTTP route, the CLI command and the agent tool use the same input and output schemas.' },
            { name: 'MCP, queues, cron', desc: <>Setting <code>mcp: true</code> on a function makes it an MCP tool. Queue workers take functions that do not require a session. Cron takes those with no input or output.</> },
          ]}
        />
        <p className={styles.chipsLabel}>More on each way in:</p>
        <ul className={styles.chips}>
          {WAYS.map(([label, to]) => (
            <li key={to}><Link to={to} className={styles.chip}>{label}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Three arguments ──────────────────────────────────── */
function ThreeArguments() {
  return (
    <section id="three-args" className={styles.section}>
      <div className={styles.wrap}>
        <Head note="the signature" title={<>Three arguments, <em>in the same order</em></>}>
          Every function has the same signature: services, data, wire. Leave off the ones you do not
          use. This one cancels an order.
        </Head>
        <Cards
          items={[
            { name: 'services', desc: 'What your code uses: the database, logger, queues, email and anything you add. Factories build them, and the function names the ones it needs.', example: '{ kysely, queueService }' },
            { name: 'data', desc: 'The input. Over HTTP, route params, query string and body arrive as one object. If two of them give the same key different values, the request is rejected.', example: '{ orderId }' },
            { name: 'wire', desc: <>Information about this call: the session, <code>rpc</code> for calling other functions, and an object for the way in, such as <code>http</code> or <code>cli</code>.</>, example: '{ session }' },
          ]}
        />
        <Snippet id="cancelOrder" />
      </div>
    </section>
  );
}

/* ── Checks ───────────────────────────────────────────── */
function Checks() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="before the body runs" title={<>Checks are declared <em>on the function</em></>}>
          <code>cancelOrder</code> above lists a scope and a permission next to its code. Pikku checks
          them before the body, so the body has no ownership test of its own.
        </Head>
        <Cards
          items={[
            { name: 'Input', desc: 'With a schema service configured, input is validated against the function’s schema before permissions and the body.' },
            { name: 'Scopes and permissions', desc: 'Every listed scope is required. Permissions work the other way: if you list several keys, passing any one is enough. Put checks in an array under one key to require all of them.' },
            { name: 'What can differ', desc: 'An HTTP route has no permissions setting; it can add middleware. A CLI command that declares its own auth or permissions replaces the function’s.' },
          ]}
        />
      </div>
    </section>
  );
}

/* ── Typed client ─────────────────────────────────────── */
function TypedClient() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <Head note="from your apps" title={<>Call it <em>with types</em></>}>
          Mark a function <code>expose: true</code> and your TypeScript apps can call it by name through
          a client Pikku generates, with the function’s input and output types. Functions you do not
          expose stay internal.
        </Head>
        <Snippet id="rpcClient" />
        <p className={styles.after}><Link to="/wires/rpc" className={styles.textLink}>How RPC and the generated client work</Link></p>
      </div>
    </section>
  );
}

/* ── Sessions ─────────────────────────────────────────── */
function Sessions() {
  const steps = [
    { step: 'Identify the caller', desc: 'Over HTTP, auth middleware you register reads a cookie, bearer token or API key and sets the session.' },
    { step: 'Read it', desc: 'The function gets it from wire: session.userId, and whatever else your session type holds.' },
    { step: 'Change it', desc: 'setSession and clearSession update it. A session store or cookie middleware, if you configure one, keeps the change.' },
  ];
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="who is calling" title={<>The signed-in user <em>comes with the call</em></>}>
          <code>pikkuFunc</code> requires a session. <code>pikkuSessionlessFunc</code> can run without
          one. A local CLI command, a queue job and a cron task have no session unless your setup
          provides one.
        </Head>
        <ol className={styles.cards}>
          {steps.map((s, i) => (
            <li key={s.step} className={styles.outline}>
              <StepBadge n={i + 1} />
              <h3 className={styles.cardName}>{s.step}</h3>
              <p className={styles.cardText}>{s.desc}</p>
            </li>
          ))}
        </ol>
        <Snippet id="shopGetProfile" />
      </div>
    </section>
  );
}

/* ── Services ─────────────────────────────────────────── */
function Services() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <Head note="your toolbox" title={<>Built once, <em>or for each call</em></>}>
          A factory builds the services your app shares. A second, optional factory builds services
          for each call.
        </Head>
        <Cards
          items={[
            { name: 'Shared services', desc: 'Built at startup and used by every call: the database pool, the logger, email, API clients.' },
            { name: 'Per-call services', desc: <>Built for a call from the shared services and that call’s details. A long-lived WebSocket server builds them once per connection. Any with a <code>close()</code> method is closed afterwards.</> },
            { name: 'Named in the signature', desc: 'A function names the services it uses in its first argument, so its dependencies are visible where you read it.' },
          ]}
        />
        <p className={styles.after}><Link to="/docs/core-features/services" className={styles.textLink}>How services work</Link></p>
      </div>
    </section>
  );
}

/* ── Versions ─────────────────────────────────────────── */
function Versions() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="contracts" title={<>Change a contract <em>on purpose</em></>}>
          After <code>pikku versions init</code> and <code>pikku versions update</code>, Pikku records
          hashes of each function’s input and output schemas in <code>versions.pikku.json</code>.
          When a recorded contract changes, <code>pikku all</code> reports it and keeps
          building. <code>pikku versions check</code> fails, so run it in CI before any
          step that runs <code>pikku all</code>.
        </Head>
        <p className={styles.body}>
          To change a contract, keep the old function and add a new version beside it. Over RPC, a
          caller can name a version, such as <code>getItem@v1</code>. A caller that uses the plain
          name, <code>getItem</code>, moves to the newest one as soon as you add it. An HTTP route
          calls the function you wire to it.
        </p>
        <Snippet id="shopVersionedItem" badge="v1 and v2" />
        <p className={styles.after}><Link to="/docs/core-features/versioning" className={styles.textLink}>How versioning works, with CI setup</Link></p>
      </div>
    </section>
  );
}

/* ── Call to action ───────────────────────────────────── */
function NextStep() {
  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Write your <em>first function</em></h2>
        <p className={styles.lead}>The docs go through defining a function, its schemas and its checks, one step at a time.</p>
        <div className={styles.actions}>
          <Link to="/docs/core-features/functions" className={styles.btnPrimary}>Read the function docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className={styles.btnGhost}>View on GitHub</Link>
        </div>
        <p className={styles.meta}>@pikku/core and the runtimes are MIT. The Pikku CLI is AGPL-3.0-only.</p>
      </div>
    </section>
  );
}

export default function FunctionPage() {
  return (
    <Layout>
      <PaperPage>
        <div className={styles.page}>
          <Hero />
          <EveryWayIn />
          <ThreeArguments />
          <Checks />
          <TypedClient />
          <Sessions />
          <Services />
          <Versions />
          <NextStep />
        </div>
      </PaperPage>
    </Layout>
  );
}
