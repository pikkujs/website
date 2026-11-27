import React from 'react';
import { Pk } from '@pikku/theme-brand';
import Link from '@/components/site/Link';
import Layout from '@/components/site/Layout';
import CodeBlock from '@/components/site/CodeBlock';
import { PaperPage, CodeCard } from '@/components/PaperLayout';
import styles from './services.module.css';
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

function Cards({ items }: { items: { name: string; desc: React.ReactNode }[] }) {
  return (
    <ul className={styles.cards}>
      {items.map((c) => (
        <li key={c.name} className={styles.outline}>
          <h3 className={styles.cardName}>{c.name}</h3>
          <p className={styles.cardText}>{c.desc}</p>
        </li>
      ))}
    </ul>
  );
}

/* ── Hero ─────────────────────────────────────────────── */
function HeroScene() {
  return (
    <svg className={styles.scene} viewBox="0 0 440 400" role="img" aria-labelledby="svcScene">
      <title id="svcScene">
        Hand-drawn lines run from two boxes, services built once and services built for a call, into
        one chameleon labelled "your function", which names kysely and logger.
      </title>
      <g className={styles.sceneLines} filter="url(#rough)">
        <path d="M110 96 C 112 132, 142 150, 168 176" />
        <path d="M330 96 C 328 132, 298 150, 272 176" />
      </g>
      {[
        { x: 12, name: 'shared', when: 'built once' },
        { x: 232, name: 'per call', when: 'built for a call' },
      ].map((box) => (
        <g key={box.name}>
          <rect className={styles.sceneSlot} x={box.x} y={8} width={196} height={82} rx={12} />
          <text x={box.x + 98} y={42} textAnchor="middle" className={styles.sceneMain}>{box.name}</text>
          <text x={box.x + 98} y={74} textAnchor="middle">{box.when}</text>
        </g>
      ))}
      <Pk x={145} y={150} width={150} height={150} color="var(--paper-accent)" />
      <text x={220} y={322} textAnchor="middle" className={styles.sceneMain}>your function</text>
      <rect className={styles.sceneSlot} x={92} y={346} width={256} height={42} rx={10} />
      <text x={220} y={375} textAnchor="middle">{'{ kysely, logger }'}</text>
    </svg>
  );
}

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroSplit}>
        <div>
          <p className={styles.note}>Pikku services</p>
          <h1 className={styles.h1}>You build them. <em>Functions name them.</em></h1>
          <p className={styles.lead}>
            A service is something your code uses, such as a database client, a logger or an email
            sender. You construct services in a factory you write, and each function names the ones
            it wants in its first argument. There are no decorators and no injection container to
            configure.
          </p>
          <div className={styles.actions}>
            <Link to="/docs/core-features/services" className={styles.btnPrimary}>Read the services docs</Link>
            <a href="#two-factories" className={styles.btnGhost}>See the two factories</a>
          </div>
        </div>
        <HeroScene />
      </div>
    </div>
  );
}

/* ── Using a service ──────────────────────────────────── */
function UsingServices() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="your own code" title={<>A service is <em>plain TypeScript</em></>}>
          It can be a class you wrote or a client from a library. This one has no Pikku import in it
          and no base class to extend.
        </Head>
        <div className={styles.stack}>
          <Snippet id="co-service-interface" />
          <p className={styles.body}>
            A function asks for a service by destructuring it. This one from the shop template names
            {' '}<code>kysely</code>, its database client, and nothing else.
          </p>
          <Snippet id="shopGetProfile" />
        </div>
        <Cards
          items={[
            { name: 'In the signature', desc: 'The first argument lists what the function depends on, so you can see it without reading the body.' },
            { name: 'Destructure it', desc: <>Pikku reads those names from your source. If a function, middleware or permission takes the whole object as <code>services</code>, <code>pikku all</code> fails with <code>PKU410</code> unless you relax that lint rule.</> },
            { name: 'No secrets', desc: <>Functions do not get the <code>secrets</code> service: the generated types leave it out, and reading it at run time throws. Read secrets in a factory and build a service with them.</> },
          ]}
        />
      </div>
    </section>
  );
}

/* ── Two factories ────────────────────────────────────── */
function TwoFactories() {
  return (
    <section id="two-factories" className={styles.section}>
      <div className={styles.wrap}>
        <Head note="the two factories" title={<>Built once, <em>or for a call</em></>}>
          You wrap your factories in <code>pikkuServices</code> and <code>pikkuWireServices</code>.
          Import both from <code>#pikku/setup</code>, which Pikku generates in your project with your
          own config and service types. The second factory is optional.
        </Head>

        <h3 className={styles.cardName}>Shared services</h3>
        <p className={styles.body}>
          <code>pikkuServices</code> receives your config and any services the host has already
          built. A server runs it at startup. On AWS Lambda and Cloudflare Workers the result is
          cached and reused while that instance stays warm.
        </p>
        <div className={styles.stack}>
          <Snippet id="shopServices" badge="shared" />
        </div>
        <Cards
          items={[
            { name: 'Keep what you are given', desc: <>Under <code>pikku dev</code> the host passes in services such as <code>kysely</code>. Write <code>existingServices?.emailService ??</code> before your own, as the shop does, and the host’s instance wins. Pikku logs a warning if you replace one.</> },
            { name: 'No request state', desc: 'Every call shares these objects. Do not store a user ID or anything else about one request on them.' },
            { name: 'Where it runs', desc: <>There are runtime packages for Express, Fastify, AWS Lambda and Cloudflare Workers, among others.<br /><Link to="/docs/runtimes" className={styles.textLink}>See the runtimes</Link></> },
          ]}
        />

        <h3 className={styles.cardName}>Per-call services</h3>
        <p className={styles.body}>
          <code>pikkuWireServices</code> receives the shared services and the wire, which describes
          this call, and returns services to add. The shop’s factory can return an empty object, an
          audit log, or an audit log with another <code>kysely</code>.
        </p>
        <div className={styles.stack}>
          <Snippet id="shopWireServices" badge="per call" />
        </div>
        <Cards
          items={[
            { name: 'One flat object', desc: 'The function sees shared and per-call services together. If both have the same name, the per-call one wins.' },
            { name: 'How long they last', desc: 'For a plain function call, those with a cleanup method are cleaned up when it ends. A long-lived WebSocket server builds them once per connection. The serverless WebSocket runner builds them again for each event.' },
            { name: 'When it is skipped', desc: <>On a plain function call, Pikku skips this factory if the function destructures only names from <code>SingletonServices</code>. Give what it builds a name that only <code>Services</code> declares. Replacing a shared service does not make it run.</> },
          ]}
        />
      </div>
    </section>
  );
}

/* ── Unused services ──────────────────────────────────── */
function UnusedServices() {
  return (
    <section id="tree-shaking" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <Head note="tree-shaking" title={<>Which services <em>does this build need?</em></>}>
          <code>pikku all</code> writes <code>requiredSingletonServices</code> to{' '}
          <code>pikku-services.gen.ts</code>, marking each shared service <code>true</code> or{' '}
          <code>false</code>. It starts from the names your wired functions, their middleware and
          their permissions destructure.
        </Head>
        <div className={styles.stack}>
          <Snippet id="co-treeshake-wiring" />
          <p className={styles.body}>
            Take these three routes. A build filtered with{' '}
            <code className={styles.flag}>pikku all --http-routes=/status</code> keeps <code>getStatus</code>, which names
            only <code>logger</code>. The functions that name <code>kysely</code> are left out, so it is
            marked <code>false</code> unless something else in the build needs it. You can also
            filter with <code className={styles.flag}>--tags</code>, <code className={styles.flag}>--wires</code>, <code className={styles.flag}>--names</code> or{' '}
            <code className={styles.flag}>--directories</code>.
          </p>
        </div>
        <p className={styles.body}>
          Some entries are <code>true</code> without a function of yours naming them.{' '}
          <code>config</code>, <code>logger</code>, <code>variables</code>, <code>schema</code> and{' '}
          <code>secrets</code> always are, and features such as workflows add the services they run
          on.
        </p>
        <Cards
          items={[
            { name: 'A map, not a loader', desc: <>The map does not change your factory. A static import still loads and a constructor still runs. To skip a service, check its flag, then <code>import()</code> and construct it inside that branch.</> },
            { name: 'What deploy removes', desc: <><code>pikku deploy</code> makes a map for each unit. It stubs the AI SDK packages when neither <code>agentRunner</code> nor <code>ai</code> is required, and the generated meta service when <code>metaService</code> is not. Do not expect it to drop your other imports.</> },
            { name: 'What the types prove', desc: <>Services marked <code>true</code> are typed as present inside your functions. <code>pikkuServices</code> accepts a partial object, so TypeScript will not tell you the factory forgot to build one.</> },
          ]}
        />
        <p className={styles.after}><Link to="/docs/pikku-cli/tree-shaking" className={styles.textLink}>Filtering and tree-shaking in the docs</Link></p>
      </div>
    </section>
  );
}

/* ── Call to action ───────────────────────────────────── */
function NextStep() {
  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Define your <em>services</em></h2>
        <p className={styles.lead}>The docs cover the service types, both factories and the interfaces Pikku’s own features expect.</p>
        <div className={styles.actions}>
          <Link to="/docs/core-features/services" className={styles.btnPrimary}>Read the services docs</Link>
          <Link to="/core/built-in-services" className={styles.btnGhost}>See built-in services</Link>
        </div>
        <p className={styles.meta}>MIT-licensed runtime.</p>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Layout>
      <PaperPage>
        <div className={styles.page}>
          <Hero />
          <UsingServices />
          <TwoFactories />
          <UnusedServices />
          <NextStep />
        </div>
      </PaperPage>
    </Layout>
  );
}
