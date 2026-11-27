import React from 'react'
import Link from '@/components/site/Link'
import { Pk } from '@pikku/theme-brand'
import { HeroScene } from './HeroScene'
import { BACKEND, FRONTEND, type Group, type Item } from './inventory'
import './studio-home.css'

const GITHUB = 'https://github.com/pikkujs/pikku'
const CHANGELOG = 'https://github.com/pikkujs/pikku/blob/main/packages/core/CHANGELOG.md'

function Actions() {
  return (
    <div className="sh-actions">
      <Link to="/docs" className="btn-ink">Get started</Link>
      <a href={GITHUB} className="btn-line">View on GitHub</a>
    </div>
  )
}

function Hero() {
  return (
    <section className="sh-hero" aria-labelledby="h-hero">
      <div className="sh-wrap sh-hero-grid">
        <div>
          <h1 id="h-hero" className="display sh-h1">
            Full-stack TypeScript, with <span className="scribble">the backend included</span>.
          </h1>
          <p className="sh-lede sh-hero-lede">
            Typed clients for your web, mobile and desktop apps. Underneath, one set of typed functions
            with users, a database, queues, cron, workflows, AI agents and MCP.
          </p>
          <Actions />
          <p className="sh-fine">
            <code>@pikku/core</code> and the runtimes are MIT licensed. The CLI is <span className="nowrap">AGPL-3.0-only</span>.
          </p>
        </div>
        <figure className="sh-hero-fig">
          <HeroScene />
        </figure>
      </div>
    </section>
  )
}

const ENTRY: [string, string[]][] = [
  ['from apps', ['HTTP + OpenAPI', 'WebSocket', 'Server-sent events', 'RPC']],
  ['from the backend', ['Queue', 'Cron', 'Workflows', 'Triggers']],
  ['from AI and tools', ['AI agents', 'MCP', 'CLI', 'Slack gateway']],
]
const SERVICES: [string, string][] = [
  ['Database', 'declared tables'],
  ['Queue', 'swappable'],
  ['Scheduler', 'swappable'],
  ['Email', 'swappable'],
  ['File storage', 'swappable'],
  ['Your clients', 'e.g. Stripe'],
]
const LEDGER: [string, string, string][] = [
  ['Queue', 'In-memory, BullMQ, pg-boss, NATS, SQS, Cloudflare, Azure', "Reading a job's result: BullMQ and pg-boss return it, SQS, Cloudflare and Azure throw, NATS and in-memory return nothing. SQS, Cloudflare and Azure apply only a delay, in whole seconds."],
  ['Scheduler', 'In-memory, BullMQ, pg-boss, NATS', 'Cloudflare, Lambda and Azure have no scheduler service, so one-off delayed calls need a server runtime.'],
  ['Email', 'One send interface; logged instead of sent in dev', 'Only Mailgun sends attachments through it so far. Resend and SMTP refuse templates.'],
  ['File storage', 'Local disk, S3, Backblaze B2', 'Uploads go to storage through signed URLs. Streaming uploads into a function are not fully supported.'],
  ['Secrets', 'AWS, or SQL, Redis or MongoDB stores', 'Read where services are built, never inside a function.'],
]

function Bus({ dir }: { dir: 'in' | 'out' }) {
  const d = dir === 'in'
    ? 'M2 20 C 30 20, 26 50, 54 50 M2 50 H54 M2 80 C 30 80, 26 50, 54 50'
    : 'M2 50 C 30 50, 26 18, 54 18 M2 50 H54 M2 50 C 30 50, 26 82, 54 82'
  return (
    <div className="sh-bus" aria-hidden="true">
      <svg className="sh-bus-h" viewBox="0 0 56 100" preserveAspectRatio="none">
        <path className={`scene-wire march${dir === 'in' ? ' scene-wire-clay' : ''}`} d={d} vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="sh-bus-v" viewBox="0 0 40 44">
        <path className={`scene-wire march${dir === 'in' ? ' scene-wire-clay' : ''}`} d="M20 2 C 16 16, 24 28, 20 42" />
      </svg>
    </div>
  )
}

function Backend() {
  return (
    <section className="sh-band sh-alt" aria-labelledby="h-backend">
      <div className="sh-wrap">
        <div className="sh-head">
          <h2 id="h-backend" className="display sh-h2">Every entry point runs the same typed function, with the same checks.</h2>
          <p className="sh-lede">
            A Pikku function takes typed input and the services it uses, and returns data. It doesn't need a
            request object, a queue message or a socket. HTTP, queues, cron, MCP and the rest all call it
            through one runner.
          </p>
        </div>

        <figure className="sh-mech" aria-labelledby="mech-cap">
          <figcaption id="mech-cap" className="sr-only">
            Twelve entry points on the left feed one runner in the middle, which resolves the session,
            validates input, checks permissions and then runs your function. On the right, the services your
            function receives as an argument.
          </figcaption>
          <div>
            <p className="sh-label">Entry points</p>
            <div className="sh-entry">
              {ENTRY.map(([from, chips]) => (
                <div key={from}>
                  <p className="sh-from">{from}</p>
                  <ul className="sh-chips">
                    {chips.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Bus dir="in" />
          <div className="sh-runner">
            <p className="sh-runner-h display"><Pk size={44} color="var(--color-clay)" />One runner</p>
            <ol>
              <li>Session resolved: cookie, JWT or API key</li>
              <li>Input validated against the function's types</li>
              <li>Permission guards checked</li>
              <li className="is-fn">Your function runs</li>
            </ol>
            <p className="note sh-runner-note">same checks, every way in</p>
          </div>
          <Bus dir="out" />
          <div>
            <p className="sh-label">Services, passed in</p>
            <ul className="sh-svc">
              {SERVICES.map(([n, h]) => <li key={n}>{n}<span>{h}</span></li>)}
            </ul>
          </div>
        </figure>

        <div className="sh-notes">
          <div>
            <h3 className="sh-h4">Signed in by default</h3>
            <p>
              Functions require a user unless declared otherwise. Queue jobs, cron tasks, local CLI runs and MCP
              over stdio have no user, so functions wired to them are declared sessionless. A cron function takes
              no input.
            </p>
          </div>
          <div>
            <h3 className="sh-h4">No secrets inside functions</h3>
            <p>
              Asking for the secrets service inside a function throws. Secrets are read where services are built,
              so a function gets the Stripe client, never the Stripe key.
            </p>
          </div>
          <div>
            <h3 className="sh-h4">Tied to a transport only when you ask</h3>
            <p>
              A function can ask for something specific to HTTP or the queue when it needs it, and is then tied to
              that entry point. Otherwise it stays plain.
            </p>
          </div>
        </div>

        <div className="sh-swap">
          <div>
            <h3 className="display sh-h3">Swap a service without touching function code</h3>
            <p className="sh-swap-p">
              Services are interfaces, chosen in the file that builds them. Changing the implementation changes
              that file and your config. The code inside your functions stays the same. What can differ is how
              the new backend behaves:
            </p>
            <table className="sh-ledger">
              <thead>
                <tr><th scope="col">Service</th><th scope="col">Implementations</th><th scope="col">What differs</th></tr>
              </thead>
              <tbody>
                {LEDGER.map(([s, impl, diff]) => (
                  <tr key={s}>
                    <th scope="row">{s}</th>
                    <td data-label="Implementations">{impl}</td>
                    <td data-label="What differs">{diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="sh-card sh-db" aria-labelledby="h-db">
            <h3 id="h-db" className="display sh-h3">The database: declare tables once</h3>
            <p>
              Tables declared in <code>db/tables.ts</code> generate migrations and types for each engine, with one
              migrations folder per engine. Change the engine in config and Pikku writes that engine's migrations
              from the same declaration.
            </p>
            <ul className="sh-engines" aria-label="Engines">
              <li>SQLite</li><li>Postgres</li><li>MySQL</li>
            </ul>
            <p className="sh-label">What does not carry over</p>
            <ul className="sh-dash">
              <li>Your rows. Pikku doesn't copy data between engines.</li>
              <li>SQL you wrote for one engine, and queries using a feature another engine lacks, such as RETURNING on MySQL.</li>
              <li>CHECK constraints: Postgres and MySQL enforce them, SQLite doesn't.</li>
              <li>Cloudflare Workers need a SQLite-family database (D1, libSQL or Turso). Standalone builds take SQLite or Postgres.</li>
              <li>MySQL needs a running server, even in dev. SQLite and an embedded Postgres run locally.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Marker({ kind }: { kind: Item['kind'] }) {
  return kind === 'core'
    ? <span className="sh-mk sh-mk-core">built in</span>
    : <span className="sh-mk sh-mk-add">add-on</span>
}

function Name({ item }: { item: Item }) {
  return item.to
    ? <Link to={item.to} className="sh-inv-link">{item.name}</Link>
    : <span className="sh-inv-name">{item.name}</span>
}

/** Lower-case a title for running text, keeping acronyms such as AI. */
const lower = (t: string) => t.split(' ').map((w) => (/^[A-Z]{2,}/.test(w) ? w : w.toLowerCase())).join(' ')

function InvGroup({ group }: { group: Group }) {
  return (
    <div className="sh-group">
      <h3 className="sh-group-h">{group.title}</h3>
      <ul className="sh-lead">
        {group.lead.map((it) => (
          <li key={it.name}>
            <div className="sh-row"><Name item={it} /><Marker kind={it.kind} /></div>
            <p>{it.desc}</p>
          </li>
        ))}
      </ul>
      {group.more.length > 0 && (
        <details className="sh-more">
          <summary>More in {lower(group.title)}</summary>
          <ul>
            {group.more.map((it) => (
              <li key={it.name}>
                <div className="sh-row"><Name item={it} /><Marker kind={it.kind} /></div>
                <p>{it.desc}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function Legend() {
  return (
    <dl className="sh-legend">
      <div>
        <dt><span className="sh-mk sh-mk-core">built in</span></dt>
        <dd>part of <code>@pikku/core</code> or the CLI. A line may name production backends you install alongside.</dd>
      </div>
      <div>
        <dt><span className="sh-mk sh-mk-add">add-on</span></dt>
        <dd>a separate package or addon you install.</dd>
      </div>
    </dl>
  )
}

function Inventory() {
  return (
    <section className="sh-band" aria-labelledby="h-inv">
      <div className="sh-wrap">
        <div className="sh-head">
          <h2 id="h-inv" className="display sh-h2">Users, data, background work, AI and operations, in one framework.</h2>
          <p className="sh-lede">Each name links to its docs page. Names without a link don't have a docs page yet.</p>
        </div>
        <Legend />
        <div className="sh-inv">
          {BACKEND.map((g) => <InvGroup key={g.title} group={g} />)}
        </div>
        <p className="sh-foot-note">
          Not included: a caching service. Maturity labels from the docs: AWS Lambda and Azure Functions are beta,
          custom WebSocket hosts are a work in progress, and native app builds are unsigned.
        </p>
      </div>
    </section>
  )
}

function Arrow({ label, clay }: { label: string; clay?: boolean }) {
  return (
    <div className="sh-arrow" aria-hidden="true">
      <span className="note">{label}</span>
      <svg viewBox="0 0 60 24" className="sh-arrow-h">
        <path className={`scene-wire march${clay ? ' scene-wire-clay' : ''}`} d="M2 12 C 20 9, 36 15, 52 12" />
        <path className={`scene-head${clay ? ' scene-wire-clay' : ''}`} d="M45 6 L54 12 L45 18" />
      </svg>
      <svg viewBox="0 0 24 44" className="sh-arrow-v">
        <path className={`scene-wire march${clay ? ' scene-wire-clay' : ''}`} d="M12 2 C 9 16, 15 26, 12 38" />
        <path className={`scene-head${clay ? ' scene-wire-clay' : ''}`} d="M6 32 L12 41 L18 32" />
      </svg>
    </div>
  )
}

const CLIENTS = ['fetch client · HTTP routes', 'RPC client · functions by name', 'WebSocket client · channels', 'React provider and hooks', 'React Query hooks', 'OpenAPI spec']

function AppIcon({ kind }: { kind: 'web' | 'phone' | 'android' | 'desktop' }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden="true" className="sh-app-icon">
      {kind === 'web' && <><path d="M3 4 H37 V28 H3 Z" /><path d="M3 10 H37" /></>}
      {kind === 'phone' && <><path d="M13 2 H27 V30 H13 Z" /><path d="M18 5 H22" /></>}
      {kind === 'android' && <><path d="M13 2 H27 V30 H13 Z" /><path d="M18 26.5 H22" /></>}
      {kind === 'desktop' && <><path d="M4 3 H36 V23 H4 Z" /><path d="M15 29 H25 M20 23 V29" /></>}
    </svg>
  )
}

function Frontend() {
  return (
    <section className="sh-band sh-alt" aria-labelledby="h-fe">
      <div className="sh-wrap">
        <div className="sh-head">
          <h2 id="h-fe" className="display sh-h2">Your apps call the same functions through generated, typed clients.</h2>
          <p className="sh-lede">
            Clients are generated from your functions and routes, so a web, mobile or desktop app calls the backend
            with the types the function declares. Native apps are the same web frontend, packaged with Tauri.
          </p>
        </div>

        <figure className="sh-fe" aria-labelledby="fe-cap">
          <figcaption id="fe-cap" className="sr-only">
            Your typed functions on the left. Pikku generates typed clients from them: fetch, RPC, WebSocket, React
            hooks and an OpenAPI spec. Those clients are used by web, iOS, Android and desktop apps on the right.
          </figcaption>
          <div className="sh-card sh-fe-core">
            <Pk size={56} color="var(--color-clay)" />
            <div>
              <p className="display sh-h3">Your typed functions</p>
              <p className="sh-small">and their HTTP routes and channels</p>
            </div>
          </div>
          <Arrow label="generates" clay />
          <div className="sh-card">
            <p className="sh-label">Typed clients</p>
            <ul className="sh-clients">
              {CLIENTS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <Arrow label="used by" />
          <ul className="sh-apps">
            <li><AppIcon kind="web" />Web</li>
            <li><AppIcon kind="phone" />iOS<span>Tauri</span></li>
            <li><AppIcon kind="android" />Android<span>Tauri</span></li>
            <li><AppIcon kind="desktop" />Desktop<span>Tauri</span></li>
          </ul>
        </figure>

        <div className="sh-inv sh-inv-fe">
          {FRONTEND.map((g) => <InvGroup key={g.title} group={g} />)}
        </div>
      </div>
    </section>
  )
}

function Check() {
  return (
    <section className="sh-band" aria-labelledby="h-check">
      <div className="sh-wrap">
        <div className="sh-head">
          <h2 id="h-check" className="display sh-h2">Check before you commit.</h2>
          <p className="sh-lede">The limits, the lock-in and who maintains it, stated plainly.</p>
        </div>
        <div className="sh-check">
          <div>
            <h3 className="display sh-h3">Known limits</h3>
            <ul>
              <li>Node.js 24+ or Bun.</li>
              <li>AWS Lambda and Azure Functions are beta.</li>
              <li>Serverless deploys don't export runtime telemetry yet, and deploys don't remove old units.</li>
              <li>In dev, jobs, schedules and workflows live in memory, so durability isn't exercised until you configure persistent services.</li>
              <li>Audit events are stored only once you wire an audit store.</li>
            </ul>
          </div>
          <div>
            <h3 className="display sh-h3">What you take on</h3>
            <ul>
              <li>Your functions depend on <code>@pikku/core</code>'s function shape and service types.</li>
              <li>Your build has a Pikku step: the CLI generates wiring and types from your code.</li>
              <li>A unit test mocks the services and calls the function directly, with no server.</li>
              <li>
                <code>@pikku/core</code>, the runtimes, services and clients are MIT. The CLI and inspectors are
                AGPL-3.0-only; the wording that leaves generated code yours to license is a draft awaiting legal review.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="display sh-h3">Versions</h3>
            <ul>
              <li><b>Pin exact versions.</b> Releases are patch-numbered and any of them can break.</li>
              <li>Breaking changes are marked in the <a className="sh-link" href={CHANGELOG}>changelog</a>.</li>
              <li><code>pikku deploy plan</code> previews every unit and resource before anything is deployed.</li>
              <li>
                Build mistakes fail with a numbered error code, and most codes have their own{' '}
                <Link className="sh-link" to="/docs/pikku-cli/errors">docs page</Link>.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="display sh-h3">Who builds it</h3>
            <ul>
              <li>Built mainly by one maintainer, Yasser Fadl, since 2021.</li>
              <li>Issues are open. Code pull requests are paused until a contributor licence agreement is in place.</li>
              <li>The core and runtimes are MIT, so you can fork what your app runs on.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const DOCS: [string, string, string][] = [
  ['/docs/core-features/functions', 'Functions', 'Typed input, services in, data out'],
  ['/docs/wiring/http', 'Wiring', 'HTTP, WebSocket, queues, cron, MCP and the rest'],
  ['/docs/core-features/services', 'Services', 'The interfaces you swap behind your functions'],
  ['/docs/frontend/react', 'Frontend', 'The React provider and hooks'],
  ['/docs/deploy', 'Deploy', 'Servers, standalone builds and serverless targets'],
  ['/docs/philosophy/limitations', 'Limitations', "What Pikku doesn't cover yet"],
]

function Close() {
  return (
    <section className="sh-band sh-alt" aria-labelledby="h-close">
      <div className="sh-wrap sh-close">
        <div>
          <h2 id="h-close" className="display sh-h2">Start with how a function is written and wired.</h2>
          <Actions />
          <Pk size={96} color="var(--color-clay)" className="sh-close-pk" />
        </div>
        <nav aria-label="Docs to start with" className="sh-docs">
          {DOCS.map(([to, title, desc]) => (
            <Link key={to} to={to}>
              <b>{title}</b>
              <span>{desc}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default function StudioHome() {
  return (
    <div className="sh">
      <main>
        <Hero />
        <Backend />
        <Inventory />
        <Frontend />
        <Check />
        <Close />
      </main>
    </div>
  )
}
