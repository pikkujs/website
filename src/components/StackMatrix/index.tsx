import React from 'react';
import styles from './stackMatrix.module.css';

/* ════════════════════════════════════════════════════════════════
   What Pikku is, in one diagram.

   Three bands, read top to bottom:
     1. what you write            — fixed
     2. what Pikku adapts         — fixed, and deliberately all names you know
     3. what it runs on           — interactive; this is the ONLY band that
                                    changes between `pikku dev` and production

   That third band is also the parity argument: the two above it never move.
   ════════════════════════════════════════════════════════════════ */

/* ── Band 1 — the wirings you write against ──────────────────── */
const WIRINGS = [
  'http', 'channel', 'queue', 'cron',
  'workflow', 'agent', 'mcp', 'cli',
];

/* ── Band 2 — what each wiring is actually built on ──────────── */
type Adapted = {
  name: string;
  backing: string;
  /** Set when Pikku wrote the thing itself, with the reason why. */
  ownReason?: string;
};

/* One row per wiring in band 1, in the same order — the two lists are meant
   to be read straight down against each other. */
const ADAPTED_WIRINGS: Adapted[] = [
  { name: 'http', backing: 'Fastify · Express · uWebSockets · Node · Bun · Next · TanStack Start' },
  { name: 'channel', backing: 'ws · uWebSockets · Durable Objects' },
  { name: 'queue', backing: 'BullMQ · pg-boss · NATS' },
  { name: 'cron', backing: 'cron · cron-schedule' },
  {
    name: 'workflow',
    backing: 'ours, on your queues and your database',
    ownReason: 'Nothing off the shelf did graphs, branching and a typed DSL over a queue we did not own.',
  },
  { name: 'agent', backing: 'the Vercel AI SDK underneath — the agent loop, its tools and its scorers are ours' },
  { name: 'mcp', backing: "@modelcontextprotocol/sdk — Anthropic's own" },
  {
    name: 'cli',
    backing: 'ours — local or remote',
    ownReason: 'Every framework CLI we tried pulled in more than it ran. This one also calls a remote deployment, not just localhost.',
  },
];

/* Not wirings — the services a function is handed, and the library behind each. */
const ADAPTED_SERVICES: Adapted[] = [
  { name: 'auth', backing: 'Better Auth' },
  { name: 'database', backing: 'Kysely — Postgres, SQLite, D1' },
  { name: 'files', backing: 'S3 · Backblaze B2 · local disk' },
  { name: 'schema', backing: 'ajv · cfworker' },
];

/* ── Band 3 — the interchangeable part ───────────────────────── */
type Target = {
  id: string;
  cmd: string;
  who: string;
  note: string;
  services: { role: string; impl: string }[];
};

const TARGETS: Target[] = [
  {
    id: 'dev',
    cmd: 'pikku dev',
    who: 'Your machine',
    note: 'Every service has a built-in local implementation, so nothing needs installing and nothing is stubbed out.',
    services: [
      { role: 'http', impl: 'Node http server' },
      { role: 'channels', impl: 'ws' },
      { role: 'queues', impl: 'in-memory queue' },
      { role: 'schedules', impl: 'in-memory scheduler' },
      { role: 'workflow state', impl: 'in-memory store' },
      { role: 'database', impl: 'SQLite' },
      { role: 'files', impl: 'local disk' },
      { role: 'secrets', impl: '.env' },
      { role: 'email', impl: 'local preview inbox' },
    ],
  },
  {
    id: 'standalone',
    cmd: 'pikku deploy apply -p standalone',
    who: 'Your own box',
    note: 'Bundles the API, the console and your frontend into a single Node bundle or compiled Bun binary — one file to copy onto a box, or wrap as a desktop app.',
    services: [
      { role: 'http', impl: 'bundled server' },
      { role: 'channels', impl: 'ws' },
      { role: 'queues', impl: 'BullMQ · pg-boss' },
      { role: 'schedules', impl: 'in-process cron' },
      { role: 'workflow state', impl: 'your database' },
      { role: 'database', impl: 'Postgres · SQLite' },
      { role: 'files', impl: 'local disk · S3' },
      { role: 'secrets', impl: 'environment' },
      { role: 'frontend', impl: 'served from the same binary' },
    ],
  },
  {
    id: 'serverless',
    cmd: 'pikku deploy apply -p serverless',
    who: 'AWS',
    note: 'Generates serverless.yml and Lambda entry points, so each wiring becomes the AWS primitive it should have been all along. Your account, your bill, no lock-in.',
    services: [
      { role: 'http', impl: 'Lambda + API Gateway' },
      { role: 'channels', impl: 'API Gateway WebSocket' },
      { role: 'queues', impl: 'SQS' },
      { role: 'schedules', impl: 'EventBridge' },
      { role: 'workflow state', impl: 'your database' },
      { role: 'database', impl: 'your own — RDS, Neon, wherever' },
      { role: 'files', impl: 'S3' },
      { role: 'secrets', impl: 'SSM Parameter Store' },
      { role: 'email', impl: 'your provider' },
    ],
  },
  {
    id: 'cloudflare',
    cmd: 'pikku deploy apply -p cloudflare',
    who: 'Cloudflare',
    note: 'The same functions, mapped onto the Workers platform — including the stateful bits most edge runtimes make you give up. Anything that cannot run in a Worker is bundled as a container and proxied through a Durable Object.',
    services: [
      { role: 'http', impl: 'Workers, or Containers' },
      { role: 'channels', impl: 'Durable Objects' },
      { role: 'queues', impl: 'Cloudflare Queues' },
      { role: 'schedules', impl: 'Cron Triggers' },
      { role: 'workflow state', impl: 'D1' },
      { role: 'database', impl: 'D1' },
      { role: 'files', impl: 'R2' },
      { role: 'secrets', impl: 'Workers secrets' },
      { role: 'email', impl: 'your provider' },
    ],
  },
  {
    id: 'azure',
    cmd: 'pikku deploy apply -p azure',
    who: 'Azure',
    note: 'Generates v4 entry points with code-based trigger registration, host.json and the infra manifest.',
    services: [
      { role: 'http', impl: 'Azure Functions' },
      { role: 'channels', impl: 'Web PubSub' },
      { role: 'queues', impl: 'Storage Queues' },
      { role: 'schedules', impl: 'Timer triggers' },
      { role: 'workflow state', impl: 'your database' },
      { role: 'database', impl: 'your own — Azure SQL, Postgres, wherever' },
      { role: 'files', impl: 'Blob Storage' },
      { role: 'secrets', impl: 'app settings' },
      { role: 'email', impl: 'your provider' },
    ],
  },
];

export function StackMatrix() {
  const [active, setActive] = React.useState(0);
  const target = TARGETS[active];
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  /* Left/right arrows move between targets, as a tablist should. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + TARGETS.length) % TARGETS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={styles.matrix}>

      {/* ── Band 1 ─────────────────────────────────────────── */}
      <div className={styles.band}>
        <div className={styles.bandLabel}>
          <span className={styles.bandNum}>You write</span>
          <span className={styles.bandHint}>functions, and the wirings that expose them</span>
        </div>
        <div className={styles.chips}>
          {WIRINGS.map((w) => (
            <span key={w} className={styles.chip}>{w}</span>
          ))}
        </div>
      </div>

      <div className={styles.seam} aria-hidden="true" />

      {/* ── Band 2 ─────────────────────────────────────────── */}
      <div className={styles.band}>
        <div className={styles.bandLabel}>
          <span className={styles.bandNum}>Pikku adapts</span>
          <span className={styles.bandHint}>the libraries you already know — not replacements for them</span>
        </div>
        <div className={styles.adaptSplit}>
          {([
            { key: 'wirings', label: 'wirings', rows: ADAPTED_WIRINGS },
            { key: 'services', label: 'services', rows: ADAPTED_SERVICES },
          ] as const).map((group) => (
            <div key={group.key} className={styles.adaptGroup}>
              <span className={styles.adaptGroupLabel}>{group.label}</span>
              <ul className={styles.adaptList}>
                {group.rows.map((a) => (
                  <li key={a.name} className={a.ownReason ? styles.adaptOwn : undefined}>
                    <span className={styles.adaptWiring}>
                      {a.name}
                      {a.ownReason && <span className={styles.star} aria-hidden="true">✻</span>}
                    </span>
                    <span className={styles.adaptBacking}>{a.backing}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.starNote}>
          <span className={styles.star} aria-hidden="true">✻</span>
          <span>
            Two things we did write.{' '}
            {ADAPTED_WIRINGS.filter((a) => a.ownReason).map((a) => (
              <React.Fragment key={a.name}>
                <b>{a.name}:</b> {a.ownReason}{' '}
              </React.Fragment>
            ))}
          </span>
        </p>
      </div>

      <div className={styles.seam} aria-hidden="true" />

      {/* ── Band 3 — the only part that changes ────────────── */}
      <div className={styles.band}>
        <div className={styles.bandLabel}>
          <span className={styles.bandNum}>It runs on</span>
          <span className={styles.bandHint}>whatever the environment gives you — this row, and only this row, changes</span>
        </div>

        <div className={styles.targetSplit}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Deployment target"
            onKeyDown={onKeyDown}
          >
            {TARGETS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`stack-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls={`stack-panel-${t.id}`}
                tabIndex={i === active ? 0 : -1}
                className={`${styles.tab} ${i === active ? styles.tabOn : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabCmd}>{t.cmd}</span>
                <span className={styles.tabWho}>{t.who}</span>
              </button>
            ))}
            <a
              className={styles.tabAsk}
              href="https://github.com/pikkujs/pikku/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              request your own →
            </a>
          </div>

          <div
            className={styles.panel}
            role="tabpanel"
            id={`stack-panel-${target.id}`}
            aria-labelledby={`stack-tab-${target.id}`}
            key={target.id}
          >
            <p className={styles.panelNote}>{target.note}</p>
            <ul className={styles.svcList}>
              {target.services.map((s) => (
                <li key={s.role}>
                  <span className={styles.svcRole}>{s.role}</span>
                  <span className={styles.svcDots} aria-hidden="true" />
                  <span className={styles.svcImpl}>{s.impl}</span>
                </li>
              ))}
            </ul>
            <p className={styles.panelFoot}>
              Defaults only — these are handed to your{' '}
              <code>createSingletonServices</code>, and whatever you construct there
              comes back out and wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
