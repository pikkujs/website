import React from 'react';
import Link from '@docusaurus/Link';
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
export function CodeCard({ filename, badge, icon, children }: {
  filename: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.codeCard}>
      <div className={styles.codeCardBar}>
        {icon}
        <span className={styles.codeCardFilename}>{filename}</span>
        {badge && <span className={styles.codeCardBadge}>{badge}</span>}
      </div>
      <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
        {children}
      </div>
    </div>
  );
}

/* ── Terminal ──────────────────────────────────────────── */
export function Terminal() {
  return (
    <div className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.termDot} style={{ background: '#e06c5b' }} />
        <span className={styles.termDot} style={{ background: '#e0b34b' }} />
        <span className={styles.termDot} style={{ background: '#79b06a' }} />
        <span className={styles.termTitle}>~/product — zsh</span>
      </div>
      <div className={styles.termBody}>
        <div><span className={styles.tPrompt}>$</span> npx pikku dev</div>
        <div className={styles.tDim}>◇ starting local platform…</div>
        <div><span className={styles.tOk}>✓</span> database <span className={styles.tHl}>postgres</span> — introspected, types generated</div>
        <div><span className={styles.tOk}>✓</span> auth, content, secrets — ready</div>
        <div><span className={styles.tOk}>✓</span> email previews · workflows · agents — mounted</div>
        <div><span className={styles.tOk}>✓</span> console <span className={styles.tUrl}>localhost:4173</span></div>
        <div><span className={styles.tOk}>✓</span> api <span className={styles.tUrl}>localhost:8787</span> <span className={styles.cursor} /></div>
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
