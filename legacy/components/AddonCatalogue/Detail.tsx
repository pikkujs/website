import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import { PaperPage, Section, Wrap, H1, Lead, CodeCard } from '@site/src/components/PaperLayout';
import { Mark, wall } from '@site/src/components/Catalogue/Wall';
import type { AddonEntry } from './Browse';
import styles from './catalogue.module.css';

type AddonFunction = {
  name: string;
  description?: string;
  sessionless?: boolean;
  services?: string[];
  input?: string;
  output?: string;
  rpc?: string;
};

type AddonSecret = {
  name: string;
  displayName?: string;
  description?: string;
  secretId: string;
  optional?: boolean;
};

type Addon = AddonEntry & {
  version?: string;
  functions?: AddonFunction[];
  secrets?: AddonSecret[];
};

const PAGE = 36;

/**
 * Function descriptions come from the upstream API's own docs, which are
 * markdown — links included. They render as plain text here, so flatten the
 * link syntax to its label rather than showing `[text](https://…)`.
 */
const plain = (text: string) =>
  text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`([^`]*)`/g, '$1');

// The namespace is the consumer's choice, but a plausible one makes the RPC
// names on this page readable rather than abstract.
const suggestedNamespace = (slug: string) =>
  slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

/**
 * These functions are named for what they touch — accountCreate, accountGet,
 * chargeList — so the leading noun is a free table of contents. It is what
 * turns GitHub's 811 functions into 32 things a reader can hold in their head.
 */
const familyOf = (name: string) => (name.match(/^[a-z]+/) ?? ['other'])[0];

export default function Detail({ addon }: { addon: Addon }): React.ReactNode {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

  const functions = addon.functions ?? [];
  const secrets = addon.secrets ?? [];
  const ns = suggestedNamespace(addon.slug);
  const required = secrets.filter((secret) => !secret.optional);
  const first = functions[0];

  const families = useMemo(() => {
    const counts = new Map<string, number>();
    for (const fn of functions) {
      const key = familyOf(fn.rpc ?? fn.name);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [functions]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return functions.filter((fn) => {
      const name = fn.rpc ?? fn.name;
      if (family && familyOf(name) !== family) return false;
      if (!needle) return true;
      return (
        name.toLowerCase().includes(needle) ||
        (fn.description ?? '').toLowerCase().includes(needle)
      );
    });
  }, [functions, query, family]);

  // The card is narrow and the block does not wrap, so a long upstream sentence
  // would run off its right edge. One clause, and only if it fits.
  const heroComment = first?.description
    ? plain(first.description).split(/(?<=\.)\s|[;:]\s/)[0].replace(/\.$/, '')
    : undefined;
  const callSnippet = first
    ? `${heroComment && heroComment.length <= 58 ? `// ${heroComment}\n` : ''}const result = await rpc.invoke('${ns}:${first.rpc ?? first.name}', {\n  /* ${first.input ?? 'no input'} */\n})`
    : `await rpc.invoke('${ns}:…')`;

  const reset = () => {
    setQuery('');
    setFamily(null);
    setShown(PAGE);
  };

  return (
    <Layout
      title={`${addon.title} addon`}
      description={
        addon.description ??
        `The ${addon.title} addon for Pikku — ${functions.length} typed functions, wired with one call.`
      }
    >
      <PaperPage>
        <Section>
          <Wrap wide>
            <Link className={styles.back} to="/addons">
              ← Addon catalogue
            </Link>

            <div className={styles.hero}>
              <div className={styles.heroText}>
                <span className={styles.badge}>
                  <Mark title={addon.title} logo={addon.logo} />
                  <span>
                    {addon.name}
                    {addon.version && ` · v${addon.version}`}
                  </span>
                </span>
                <H1>{addon.title}</H1>
                {addon.description && <Lead>{addon.description}</Lead>}
              </div>

              <div className={styles.heroCode}>
                <CodeCard filename="rpc.ts" badge={`${ns}:*`}>
                  <CodeBlock language="typescript">{callSnippet}</CodeBlock>
                </CodeCard>
              </div>
            </div>
          </Wrap>
        </Section>

        <Section variant="alt">
          <Wrap wide>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.stepN}>Step 1</span>
                <h2 className={styles.stepTitle}>Install</h2>
                <code className={styles.stepCode}>npm install {addon.name}</code>
                <p className={styles.stepBody}>
                  A published package — it stays a dependency you upgrade, not code
                  you own.
                </p>
              </li>

              <li className={styles.step}>
                <span className={styles.stepN}>Step 2</span>
                <h2 className={styles.stepTitle}>Wire</h2>
                <code className={styles.stepCode}>
                  wireAddon({'{'} name: '{ns}' {'}'})
                </code>
                <p className={styles.stepBody}>
                  The name you pick becomes the namespace for all {functions.length}{' '}
                  functions. See <Link to="/docs/addon/consuming">Consuming addons</Link>.
                </p>
              </li>

              <li className={styles.step}>
                <span className={styles.stepN}>Step 3</span>
                <h2 className={styles.stepTitle}>Set secrets</h2>
                <code className={styles.stepCode}>
                  {required.length
                    ? required.map((secret) => secret.secretId).join(', ')
                    : 'none required'}
                </code>
                <p className={styles.stepBody}>
                  {required.length ? (
                    <>
                      Store these before the first call, or map them onto your own names
                      with <code>secretOverrides</code>.
                    </>
                  ) : secrets.length ? (
                    <>Every secret this addon reads is optional.</>
                  ) : (
                    <>This addon needs no credentials.</>
                  )}
                </p>
              </li>
            </ol>
          </Wrap>
        </Section>

        {secrets.length > 0 && (
          <Section>
            <Wrap wide>
              <div className={styles.blockHead}>
                <h2 className={styles.blockTitle}>Secrets</h2>
                <span className={styles.blockNote}>
                  {required.length} required
                  {secrets.length > required.length &&
                    ` · ${secrets.length - required.length} optional`}
                </span>
              </div>
              <ul className={styles.secrets}>
                {secrets.map((secret) => (
                  <li className={styles.secret} key={secret.secretId}>
                    <code className={styles.secretId}>{secret.secretId}</code>
                    <span className={styles.secretName}>
                      {secret.displayName ?? secret.name}
                      {secret.optional && (
                        <span className={styles.optional}>optional</span>
                      )}
                    </span>
                    {secret.description && (
                      <p className={styles.secretDesc}>{secret.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Wrap>
          </Section>
        )}

        <Section variant={secrets.length > 0 ? 'alt' : 'default'}>
          <Wrap wide>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>What you can call</h2>
              <span className={styles.blockNote}>
                {functions.length} {functions.length === 1 ? 'function' : 'functions'}
                {families.length > 1 && ` · ${families.length} families`}
              </span>
            </div>

            {functions.length > PAGE && (
              <div className={wall.controls}>
                <input
                  type="search"
                  className={wall.search}
                  placeholder={`Filter ${functions.length} functions…`}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setShown(PAGE);
                  }}
                  aria-label="Filter functions"
                />
                <p className={wall.resultCount} aria-live="polite">
                  {matches.length} of {functions.length}
                </p>
              </div>
            )}

            {families.length > 1 && (
              <div className={wall.chips}>
                <button
                  type="button"
                  className={wall.chip}
                  aria-pressed={family === null}
                  onClick={() => {
                    setFamily(null);
                    setShown(PAGE);
                  }}
                >
                  All
                  <span className={wall.chipCount}>{functions.length}</span>
                </button>
                {families.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    className={wall.chip}
                    aria-pressed={family === entry.key}
                    onClick={() => {
                      setFamily(family === entry.key ? null : entry.key);
                      setShown(PAGE);
                    }}
                  >
                    {entry.key}*
                    <span className={wall.chipCount}>{entry.count}</span>
                  </button>
                ))}
              </div>
            )}

            {matches.length === 0 ? (
              <div className={wall.empty}>
                <p className={wall.emptyTitle}>No function matches that.</p>
                <button type="button" className={wall.reset} onClick={reset}>
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className={styles.fnList}>
                {matches.slice(0, shown).map((fn) => (
                  <li className={styles.fn} key={fn.name}>
                    <code className={styles.rpc}>
                      <span className={styles.ns}>{ns}:</span>
                      {fn.rpc ?? fn.name}
                    </code>
                    {fn.description && (
                      <p className={styles.fnDesc}>{plain(fn.description)}</p>
                    )}
                    {(fn.input || fn.output) && (
                      <span className={styles.sig}>
                        {fn.input ?? 'void'}
                        <span className={styles.arrow}>→</span>
                        {fn.output ?? 'void'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {shown < matches.length && (
              <button
                type="button"
                className={wall.moreBtn}
                onClick={() => setShown(shown + PAGE * 3)}
              >
                Show {Math.min(PAGE * 3, matches.length - shown)} more of {matches.length}
              </button>
            )}
          </Wrap>
        </Section>
      </PaperPage>
    </Layout>
  );
}
