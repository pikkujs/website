import React from 'react';
import Link from '@docusaurus/Link';
import styles from './apiDoc.module.css';

/* ════════════════════════════════════════════════════════════════
   The generated API reference, presented the way the console presents
   the same data.

   In the console a list pane is one bordered surface of full-width rows —
   name and summary on the left, a pill on the right — and clicking a row
   opens a detail pane of small-caps labelled blocks. A docs page has no
   panel to open, so the row links to the detail already below it.

   All of these are registered globally in src/theme/MDXComponents.ts, so the
   pages scripts/generate-api-surface.mjs writes need no imports.
   ════════════════════════════════════════════════════════════════ */

function Badges({
  kind,
  origin,
  deprecated,
}: {
  kind?: string;
  origin?: string;
  deprecated?: boolean;
}) {
  return (
    <>
      {kind && <span className={`${styles.badge} ${styles.kind}`}>{kind}</span>}
      {deprecated && (
        <span className={`${styles.badge} ${styles.deprecated}`}>deprecated</span>
      )}
      {origin && <span className={`${styles.badge} ${styles.origin}`}>{origin}</span>}
    </>
  );
}

function Row({
  to,
  name,
  summary,
  badges,
}: {
  to: string;
  name: string;
  summary?: string;
  badges: React.ReactNode;
}) {
  return (
    <Link to={to} className={styles.row}>
      <div>
        <div className={styles.rowName}>{name}</div>
        <div className={styles.rowSummary}>{summary}</div>
      </div>
      <div className={styles.rowMeta}>{badges}</div>
    </Link>
  );
}

/** The doors, as the console's navigator lists them. */
export function ApiDoors({
  items,
}: {
  items: { specifier: string; href: string; exports: number; summary?: string }[];
}) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <Row
          key={item.href}
          to={item.href}
          name={item.specifier}
          summary={item.summary}
          badges={
            <span className={`${styles.badge} ${styles.kind}`}>
              {item.exports} {item.exports === 1 ? 'export' : 'exports'}
            </span>
          }
        />
      ))}
    </div>
  );
}

/** One door's exports, as the console's list pane shows them. */
export function ApiExports({
  items,
}: {
  items: {
    name: string;
    kind: string;
    anchor: string;
    summary?: string;
    deprecated?: boolean;
  }[];
}) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <Row
          key={item.anchor}
          to={`#${item.anchor}`}
          name={item.name}
          summary={item.summary}
          badges={<Badges kind={item.kind} deprecated={item.deprecated} />}
        />
      ))}
    </div>
  );
}

/**
 * One export in full — the console's detail pane. The heading stays a markdown
 * `###` inside it so it keeps its anchor and its place in the table of
 * contents; Docusaurus's toc plugin walks nested nodes, so wrapping hides
 * nothing.
 */
export function ApiSymbol({ children }: { children: React.ReactNode }) {
  return <div className={styles.symbol}>{children}</div>;
}

/** The pill row under a detail pane's title: what kind it is, where it came from. */
export function ApiMeta({
  kind,
  origin,
  deprecated,
}: {
  kind: string;
  origin?: string;
  deprecated?: boolean;
}) {
  return (
    <div className={styles.symbolMeta}>
      <Badges kind={kind} origin={origin} deprecated={deprecated} />
    </div>
  );
}

/** A labelled block inside the detail pane — the console's DESCRIPTION, INPUT, … */
export function ApiSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>{label}</div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}
