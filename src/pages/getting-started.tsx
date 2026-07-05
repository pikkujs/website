import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  PaperPage, Section, Wrap, Eyebrow, H1, H2, Lead,
  BtnPrimary, BtnGhost, CodeCard, Terminal, CheckItem, StepBadge,
} from '../components/PaperLayout';
import { WiringIcon } from '../components/WiringIcons';
import snippets from '../data/snippets.json';
import styles from './getting-started.module.css';

/* ── Step heading ────────────────────────────────────────── */
function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <div className={styles.stepHead}>
      <StepBadge n={n} />
      <H2 style={{ margin: 0 }}>{title}</H2>
    </div>
  );
}

/* ── Simple terminal card for one-off commands ───────────── */
function Cmd({ lines }: { lines: React.ReactNode[] }) {
  return (
    <div className={styles.cmd}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <header className={styles.hero}>
      <Wrap>
        <Eyebrow>Getting started</Eyebrow>
        <H1>From an empty folder to a <em>running platform.</em></H1>
        <Lead>
          Two commands stand between you and a complete backend — database, auth, content,
          email, workflows and the console, running locally and ready to deploy.
        </Lead>
      </Wrap>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   Step 1 — Create
   ───────────────────────────────────────────────────────── */
function StepCreate() {
  return (
    <Section>
      <Wrap>
        <StepHead n={1} title="Create your project" />
        <p className={styles.stepBody}>
          The generator scaffolds a working project — pick a template, and you get example
          functions, wirings, and a local database schema to start from.
        </p>
        <Cmd lines={[
          <><span className={styles.prompt}>$</span> npm create pikku@latest</>,
          <span className={styles.dim}>✔ template downloaded · dependencies installed</span>,
          <span className={styles.dim}>→ cd my-app</span>,
        ]} />
      </Wrap>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────
   Step 2 — Run the platform
   ───────────────────────────────────────────────────────── */
function StepRun() {
  return (
    <Section variant="alt">
      <Wrap>
        <StepHead n={2} title="Start the whole platform" />
        <p className={styles.stepBody}>
          One command boots everything. Not just an HTTP server — the database is introspected
          and typed, auth and content are live, email previews work, and the console is watching
          all of it.
        </p>
        <div className={styles.runGrid}>
          <Terminal />
          <div className={styles.runChecks}>
            <CheckItem>Database up, schema introspected, end-to-end types generated</CheckItem>
            <CheckItem>Auth, content, secrets and email previews — already working</CheckItem>
            <CheckItem>The console at <code>localhost:3000/console</code> shows every function, wire and workflow</CheckItem>
            <CheckItem>Exactly what runs in production — no separate local setup to maintain</CheckItem>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────
   Step 3 — Write & wire a function
   ───────────────────────────────────────────────────────── */
const WIRE_CHIPS = [
  { icon: 'http', label: 'HTTP', link: '/docs/wiring/http' },
  { icon: 'websocket', label: 'WebSocket', link: '/docs/wiring/channels' },
  { icon: 'rpc', label: 'RPC', link: '/docs/wiring/rpcs' },
  { icon: 'queue', label: 'Queue', link: '/docs/wiring/queue' },
  { icon: 'cron', label: 'Cron', link: '/docs/wiring/scheduled-tasks' },
  { icon: 'workflow', label: 'Workflow', link: '/docs/wiring/workflows' },
  { icon: 'bot', label: 'AI Agent', link: '/docs/wiring/ai-agents' },
  { icon: 'mcp', label: 'MCP', link: '/docs/wiring/mcp' },
  { icon: 'cli', label: 'CLI', link: '/docs/wiring/cli' },
];

function StepWrite() {
  return (
    <Section>
      <Wrap>
        <StepHead n={3} title="Write a function, wire it up" />
        <p className={styles.stepBody}>
          A Pikku function receives your services and typed input — no decorators, no classes.
          Wiring connects it to the outside world. Add more wires whenever you like; the
          function never changes.
        </p>
        <div className={styles.codeGrid}>
          <CodeCard filename="src/items.functions.ts">
            <CodeBlock language="typescript">{snippets.listCategories}</CodeBlock>
          </CodeCard>
          <CodeCard filename="src/items.http.ts" badge="add more anytime">
            <CodeBlock language="typescript">{snippets.httpSingleRoute}</CodeBlock>
          </CodeCard>
        </div>
        <div className={styles.chips}>
          {WIRE_CHIPS.map((c) => (
            <Link key={c.label} to={c.link} className={styles.chip}>
              <WiringIcon wiringId={c.icon} size={15} />
              {c.label}
            </Link>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────
   Step 4 — Ship it
   ───────────────────────────────────────────────────────── */
function StepShip() {
  return (
    <Section variant="alt">
      <Wrap>
        <StepHead n={4} title="Ship it" />
        <p className={styles.stepBody}>
          The same application deploys three ways — a standalone binary you run anywhere,
          your own cloud, or fully managed on Fabric.
        </p>
        <div className={styles.shipGrid}>
          <div className={styles.shipCard}>
            <h3>Standalone</h3>
            <p>One self-contained server you run on infrastructure you control.</p>
            <code>npx pikku deploy apply -p standalone</code>
          </div>
          <div className={styles.shipCard}>
            <h3>Your cloud</h3>
            <p>Deploy to Cloudflare or AWS. Your account, your bill, no lock-in.</p>
            <code>npx pikku deploy apply -p cloudflare</code>
          </div>
          <div className={styles.shipCard}>
            <h3>Fabric</h3>
            <p>Managed hosting with observability and an assistant that knows your system.</p>
            <code>npx pikku fabric deploy apply</code>
          </div>
        </div>
        <p className={styles.shipNote}>
          Run <code>npx pikku deploy plan</code> first to see exactly what will be created.
        </p>
      </Wrap>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────
   What's next
   ───────────────────────────────────────────────────────── */
const NEXT = [
  { icon: 'http', title: 'Core Features', desc: 'Functions, services, middleware, permissions', link: '/docs/core-features' },
  { icon: 'websocket', title: 'Channels', desc: 'Real-time with WebSocket', link: '/docs/wiring/channels' },
  { icon: 'queue', title: 'Queues', desc: 'Background job processing', link: '/docs/wiring/queue' },
  { icon: 'bot', title: 'AI Agents', desc: 'Conversational AI with tools', link: '/docs/wiring/ai-agents' },
  { icon: 'workflow', title: 'Workflows', desc: 'Durable multi-step processes', link: '/docs/wiring/workflows' },
  { icon: 'mcp', title: 'MCP', desc: 'Expose functions to AI models', link: '/docs/wiring/mcp' },
];

function NextSteps() {
  return (
    <Section>
      <Wrap>
        <Eyebrow>What's next</Eyebrow>
        <H2>You have a running platform. <em>Here's where to go.</em></H2>
        <div className={styles.nextGrid}>
          {NEXT.map((n) => (
            <Link key={n.title} to={n.link} className={styles.nextCard}>
              <span className={styles.nextIcon}><WiringIcon wiringId={n.icon} size={20} /></span>
              <span>
                <span className={styles.nextTitle}>{n.title}</span>
                <span className={styles.nextDesc}>{n.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className={styles.nextActions}>
          <BtnPrimary to="/docs">Full documentation</BtnPrimary>
          <BtnGhost to="/developers">Pikku for developers</BtnGhost>
        </div>
      </Wrap>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */
export default function GettingStartedPage() {
  return (
    <Layout
      title="Getting Started"
      description="From an empty folder to a running platform — create a project, run npx pikku dev, and get a complete backend with database, auth, email, workflows and the console."
    >
      <PaperPage>
        <Hero />
        <StepCreate />
        <StepRun />
        <StepWrite />
        <StepShip />
        <NextSteps />
      </PaperPage>
    </Layout>
  );
}
