import React from 'react';
import Link from '@/components/site/Link';
import Layout from '@/components/site/Layout';
import useBrokenLinks from '@/components/site/useBrokenLinks';
import CodeBlock from '@/components/site/CodeBlock';
import { PaperPage, CodeCard } from '@/components/PaperLayout';
import { collapseFunc } from '@/components/FeaturePage';
import snippets from '@/data/snippets.json';
import { wireTypes, wireCategories, type WireCategory } from '@/data/wireTypes';
import {
  GitBranch, Wrench, Shield, Copy, Check, Scissors,
  Package, Puzzle, Key, ArrowRight, Gauge,
} from 'lucide-react';
import styles from './features.module.css';

/* ─────────────────────────────────────────────
   Card data
   ───────────────────────────────────────────── */

interface FeatureCard {
  title: string;
  url: string;
  description: string;
  icon: React.FC<{ size?: number }>;
}

const frameworkCards: FeatureCard[] = [
  {
    title: 'Services',
    url: '/core/services',
    description: 'Inject what you need. Tree-shake what you don\'t. Type-safe dependency injection without decorators.',
    icon: Wrench,
  },
  {
    title: 'Security',
    url: '/core/security',
    description: 'Sessions, permissions, and auth middleware — one API across every transport.',
    icon: Shield,
  },
  {
    title: 'Versioning',
    url: '/core/versioning',
    description: 'Evolve functions, keep workflows running. Contract hashing and CI enforcement.',
    icon: GitBranch,
  },
  {
    title: 'Secrets & Variables',
    url: '/core/secrets',
    description: 'Type-safe config with Zod schemas — validated at startup, managed from code.',
    icon: Key,
  },
  {
    title: 'Tree-Shaking',
    url: '/core/treeshaking',
    description: 'Filter by routes, tags, or types — deploy only what each service needs.',
    icon: Scissors,
  },
  {
    title: 'Built-in Services',
    url: '/core/built-in-services',
    description: 'JWT, queues, workflows, AI storage, secrets — every interface and provider.',
    icon: Package,
  },
  {
    title: 'Scorers & Judges',
    url: '/wires/agent#scoring',
    description: 'Grade what an agent actually did — in code or with a second model, in tests and on live traffic.',
    icon: Gauge,
  },
  {
    title: 'Addons',
    url: '/core/addons',
    description: 'Bundle functions, services, and secrets into npm packages. Install once, wire once.',
    icon: Puzzle,
  },
];

/* The wiring half of the concepts band: the same getItem, wired to a transport by one call (template snippet). */
const WIRING_CODE = snippets.funcMultiWire;

/* ─────────────────────────────────────────────
   Cards
   ───────────────────────────────────────────── */

function ConceptCard({ card }: { card: FeatureCard }) {
  const Icon = card.icon;
  return (
    <Link to={card.url} className={styles.linkCard}>
      <span className={styles.linkCardIcon}><Icon size={19} /></span>
      <span className={styles.linkCardTitleRow}>
        <span className={styles.linkCardTitle}>{card.title}</span>
      </span>
      <p className={styles.linkCardBody}>{card.description}</p>
      <span className={styles.linkCardMore}>
        Learn more <ArrowRight size={14} />
      </span>
    </Link>
  );
}

function WireCard({ wire }: { wire: (typeof wireTypes)[number] }) {
  const Icon = wire.icon;
  return (
    <Link to={wire.url} className={styles.linkCard}>
      <span className={styles.linkCardIcon}><Icon size={18} /></span>
      <span className={styles.linkCardTitleRow}>
        <span className={styles.linkCardTitle}>{wire.label}</span>
        {wire.badge && <span className={styles.linkCardTag}>{wire.badge}</span>}
      </span>
      <p className={styles.linkCardBody}>{wire.description}</p>
      {wire.snippet && (
        <span className={styles.linkCardSnippet}>
          <code>{wire.snippet}</code>
        </span>
      )}
      <span className={styles.linkCardMore}>
        Learn more <ArrowRight size={14} />
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Sections
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.wrap}>
        <span className={styles.badge}>Features</span>
        <h1 className={styles.h1}>Two concepts. Eleven wires. <em>Ship faster.</em></h1>
        <p className={styles.lead}>
          Most frameworks make you choose. Pikku doesn't — write once, connect everywhere.
        </p>
      </div>
    </div>
  );
}

// The two concepts, shown rather than listed: the function on the left is the
// template's real getItem with its body collapsed; every call on the right
// takes that same function.
function ConceptsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Two concepts</h2>
          <p className={styles.lead}>
            Write a function. Wire it to as many protocols as you need — the function doesn't change.
          </p>
        </div>
        <div className={styles.conceptBand}>
          <CodeCard filename="items.functions.ts" badge="the function">
            <CodeBlock language="typescript">{collapseFunc(snippets.getItem)}</CodeBlock>
          </CodeCard>
          <CodeCard filename="items.wiring.ts" badge="the wiring">
            <CodeBlock language="typescript">{WIRING_CODE}</CodeBlock>
          </CodeCard>
        </div>
      </div>
    </section>
  );
}

function WiresSection() {
  useBrokenLinks().collectAnchor('wires');
  const grouped = wireCategories.reduce(
    (acc, cat) => {
      acc[cat] = wireTypes.filter((w) => w.category === cat);
      return acc;
    },
    {} as Record<WireCategory, typeof wireTypes>,
  );

  return (
    <section id="wires" className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Wires</h2>
        </div>
        {wireCategories.map((cat) => (
          <div key={cat} className={styles.group}>
            <h3 className={styles.groupHead}>{cat}</h3>
            <div className={styles.wireGrid}>
              {grouped[cat].map((wire) => <WireCard key={wire.id} wire={wire} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FrameworkSection() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>The rest of the framework</h2>
        </div>
        <div className={styles.wireGrid}>
          {frameworkCards.map((card) => <ConceptCard key={card.title} card={card} />)}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const cmd = 'npm create pikku@latest';
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Pick a wire. <em>Start building.</em></h2>
        <p className={styles.lead}>
          Scaffold a new project in seconds — you'll have a function running across protocols in under 5 minutes.
        </p>

        <button
          className={styles.cmdBlock}
          onClick={copy}
          style={{ paddingRight: 44 }}
          title={copied ? 'Copied' : 'Copy command'}
        >
          <span className={styles.cmdPrompt}>$ </span>{cmd}
          <span className={styles.copyBtn} aria-hidden>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </span>
        </button>

        <div className={styles.ctaActions}>
          <Link to="/getting-started" className={styles.btnPrimary}>Start Building</Link>
          <Link to="https://github.com/pikkujs/pikku" className={styles.btnGhost}>GitHub</Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function FeaturesPage(): React.ReactNode {
  return (
    <Layout
      title="Features"
      description="Two concepts. Eleven wire types. Write your TypeScript backend once — Pikku wires it to HTTP, WebSocket, queues, cron, CLI, AI agents, gateways, and more."
    >
      <PaperPage>
        <Hero />
        <ConceptsSection />
        <WiresSection />
        <FrameworkSection />
        <CTASection />
      </PaperPage>
    </Layout>
  );
}
