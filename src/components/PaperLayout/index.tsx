import React from 'react';
import Link from '@docusaurus/Link';
import { ExternalLink } from 'lucide-react';
import styles from './paper.module.css';

export { styles as paper };

/* ── Page wrapper ──────────────────────────────────────── */
export function PaperPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page} data-paper-page="">{children}</div>
  );
}

/* ── Typography ────────────────────────────────────────── */
export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className={styles.eyebrow} style={style}>{children}</div>;
}

export function H1({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h1 className={styles.h1} style={style}>{children}</h1>;
}

export function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h2 className={styles.h2} style={style}>{children}</h2>;
}

export function Lead({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p className={styles.lead} style={style}>{children}</p>;
}

export function SectionHead({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionHead}>{children}</div>;
}

/* ── Layout containers ─────────────────────────────────── */
export function Wrap({ children, wide = false, style }: { children: React.ReactNode; wide?: boolean; style?: React.CSSProperties }) {
  return <div className={wide ? styles.wrapWide : styles.wrap} style={style}>{children}</div>;
}

export function Section({ children, variant = 'default', id, style }: { children: React.ReactNode; variant?: 'default' | 'alt' | 'dark'; id?: string; style?: React.CSSProperties }) {
  const cls = variant === 'alt' ? styles.sectionAlt : variant === 'dark' ? styles.sectionDark : styles.section;
  return <section id={id} className={cls} style={style}>{children}</section>;
}

/* ── Buttons ───────────────────────────────────────────── */
export function BtnPrimary({ to, href, children, onClick }: { to?: string; href?: string; children: React.ReactNode; onClick?: () => void }) {
  if (to || href) return <Link to={to ?? href!} className={styles.btnPrimary}>{children}</Link>;
  return <button className={styles.btnPrimary} onClick={onClick}>{children}</button>;
}

export function BtnGhost({ to, href, children }: { to?: string; href?: string; children: React.ReactNode }) {
  return <Link to={to ?? href!} className={styles.btnGhost}>{children}</Link>;
}

/* ── Badge (e.g. "Core Concept") ───────────────────────── */
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}

/* ── Card ──────────────────────────────────────────────── */
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className={styles.card} style={style}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardTitle}>{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <p className={styles.cardBody}>{children}</p>;
}

/* ── Code card ─────────────────────────────────────────── */
export function CodeCard({ filename, badge, icon, sourceUrl, children }: {
  filename: string;
  badge?: string;
  icon?: React.ReactNode;
  sourceUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.codeCard} data-code-ink="">
      <div className={styles.codeCardBar}>
        {icon}
        <span className={styles.codeCardFilename}>{filename}</span>
        {badge && <span className={styles.codeCardBadge}>{badge}</span>}
        <span style={{ flex: 1 }} />
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.codeCardSourceLink}
            title="View source on GitHub"
          >
            <ExternalLink size={11} />
          </a>
        )}
      </div>
      <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
        {children}
      </div>
    </div>
  );
}

/* ── Terminal ──────────────────────────────────────────── */
/* Lines below are the real output of `pikku dev` against the online-shop
   template — verbatim, only the noise a first run does not have is dropped. */
export function Terminal() {
  return (
    <div className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.termDot} style={{ background: '#e06c5b' }} />
        <span className={styles.termDot} style={{ background: '#e0b34b' }} />
        <span className={styles.termDot} style={{ background: '#79b06a' }} />
        <span className={styles.termTitle}>~/shop — zsh</span>
      </div>
      <div className={styles.termBody}>
        <div><span className={styles.tPrompt}>$</span> npx pikku dev</div>
        <div className={styles.tDim}>◇◆ pikku ::</div>
        <div className={styles.tSpacer} />
        <div className={styles.tDim}>pikku all (completed in 1.8s)</div>
        <div className={styles.tList}>
          <div><span className={styles.tBullet}>•</span> <span className={styles.tHl}>41</span> HTTP routes</div>
          <div><span className={styles.tBullet}>•</span> <span className={styles.tHl}>6</span> Queue workers</div>
          <div><span className={styles.tBullet}>•</span> <span className={styles.tHl}>4</span> Scheduled tasks</div>
          <div><span className={styles.tBullet}>•</span> <span className={styles.tHl}>10</span> Workflows</div>
          <div><span className={styles.tBullet}>•</span> <span className={styles.tHl}>7</span> MCP endpoints</div>
        </div>
        <div className={styles.tSpacer} />
        <div>All schemas loaded</div>
        <div>Pikku Console available at <span className={styles.tUrl}>http://localhost:3000/console</span></div>
        <div>pikku: ready on <span className={styles.tUrl}>http://localhost:3000</span> <span className={styles.cursor} /></div>
      </div>
    </div>
  );
}

/* ── Check item ────────────────────────────────────────── */
export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.checkItem}>
      <span className={styles.checkMark}>✓</span>
      <span>{children}</span>
    </div>
  );
}

/* ── Step badge ────────────────────────────────────────── */
export function StepBadge({ n }: { n: number }) {
  return <span className={styles.stepBadge}>{n}</span>;
}
