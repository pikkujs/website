import React from 'react';
import Link from '@/components/site/Link';
import { ArrowRight, Copy, Check, Search } from 'lucide-react';
import CodeBlock from '@/components/site/CodeBlock';
import { CodeCard } from '@/components/PaperLayout';
import { collapseFunc } from '@/components/FeaturePage';
import { HubRow, HubSection } from '@/components/docs/HubRow';
import { DocIcon } from '@/components/docs/DocIcon';
import { openSearch } from '@/components/docs/DocsHub';
import { featureGroups } from '@/lib/features-nav';
import type { Hue } from '@/lib/docs-hub';
import snippets from '@/data/snippets.json';
import styles from './features.module.css';

const HUES: Hue[] = ['clay', 'moss', 'slate', 'ochre', 'rose'];

/** One line under each group heading, like the docs hub. */
const BLURBS: Record<string, string> = {
  core: 'The function you write once, and what every function gets.',
  protocols: 'How clients and other services call your functions.',
  'scheduling-processing': 'Work that runs in the background, on a timer, on an event, or from a terminal.',
  'ai-orchestration': 'Agents, durable workflows and messaging platforms, on the same functions.',
  deployment: 'Where the same codebase runs.',
  platform: 'The rest of the framework: ship less, extend more, measure what you ship.',
};

/* The wiring half of the concepts card: the same getItem, wired to a transport by one call (template snippet). */
const WIRING_CODE = snippets.funcMultiWire;

/* The two concepts, shown rather than listed: the function on the left is the template's real getItem with its
   body collapsed; every call on the right takes that same function. */
function Concepts() {
  return (
    <section className="hub-section" aria-labelledby="hub-concepts">
      <h2 id="hub-concepts" className="hub-h">Two concepts</h2>
      <p className="hub-blurb">Write a function. Wire it to as many protocols as you need. The function doesn't change.</p>
      <div className={styles.conceptBand}>
        <CodeCard filename="items.functions.ts" badge="the function">
          <CodeBlock language="typescript">{collapseFunc(snippets.getItem)}</CodeBlock>
        </CodeCard>
        <CodeCard filename="items.wiring.ts" badge="the wiring">
          <CodeBlock language="typescript">{WIRING_CODE}</CodeBlock>
        </CodeCard>
      </div>
    </section>
  );
}

function Cta() {
  const cmd = 'npm create pikku@latest';
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className={`${styles.ctaSection} ${styles.ctaCard}`}>
      <h2 className={styles.h2}>Pick a wire. <em>Start building.</em></h2>
      <p className={styles.lead}>
        Scaffold a new project in seconds. You'll have a function running across protocols in under 5 minutes.
      </p>
      <button className={styles.cmdBlock} onClick={copy} style={{ paddingRight: 44 }} title={copied ? 'Copied' : 'Copy command'}>
        <span className={styles.cmdPrompt}>$ </span>{cmd}
        <span className={styles.copyBtn} aria-hidden>{copied ? <Check size={13} /> : <Copy size={13} />}</span>
      </button>
      <div className={styles.ctaActions}>
        <Link to="/getting-started" className={styles.btnPrimary}>Start Building</Link>
        <a href="https://github.com/pikkujs/pikku" target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>GitHub</a>
      </div>
    </section>
  );
}

/** The /features landing, laid out like the /docs hub: lead, jump pill, the two concepts, wire chips, grouped rows. */
export default function FeaturesPage(): React.ReactNode {
  const wires = featureGroups.flatMap((g) => g.entries).filter((e) => e.wireIcon);
  return (
    <article className="feat-hub-main">
      <div className="hub">
        <header className="hub-lead">
          <p className="hub-crumb">Features</p>
          <h1 className="doc-title">Two concepts. Eleven wires. <em>Ship faster.</em></h1>
          <p className="hub-sub">Most frameworks make you choose. Pikku doesn't: write once, connect everywhere.</p>
        </header>

        <button type="button" className="hub-search" onClick={openSearch}>
          <Search size={18} aria-hidden />
          <span>Jump to a feature</span>
          <kbd>⌘K</kbd>
        </button>

        <Concepts />

        <section id="wires" className="hub-section" aria-labelledby="hub-wires">
          <h2 id="hub-wires" className="hub-h">Pick a wire</h2>
          <p className="hub-blurb">One function, many ways in. Choose how yours is called.</p>
          <ul className="hub-wires">
            {wires.map((w) => (
              <li key={w.url}><Link to={w.url as any} className="hub-wire"><DocIcon icon={`w:${w.wireIcon}`} size={18} /><span>{w.label}</span></Link></li>
            ))}
          </ul>
        </section>

        {featureGroups.map((g) => (
          <HubSection key={g.id} id={g.id} title={g.label} blurb={BLURBS[g.id]}>
            {g.entries.map((e, i) => (
              <HubRow key={e.id} url={e.url} title={e.label} text={e.long} code={e.snippet} aside={e.badge}
                icon={e.wireIcon ? `w:${e.wireIcon}` : e.icon} hue={HUES[i % HUES.length]} />
            ))}
          </HubSection>
        ))}

        <Cta />
        <p className="feat-hub-more"><Link to="/docs">Looking for the reference? <b>Read the docs <ArrowRight size={14} aria-hidden /></b></Link></p>
      </div>
    </article>
  );
}
