import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  BarChart3, RefreshCw, Zap, ShieldCheck, Clock, Database,
  Shield, Key, Lock, UserCheck, Layers, Variable, FileJson,
  GitCommit, Server, FunctionSquare, Package, Scissors, Filter,
  FileCode, Search, TreePine, Wrench, Cookie, Scan, ArrowRight,
  Hash, BookOpen, Copy, Check,
  AlertTriangle, Headphones, Settings, PenTool, MessageSquare, Brain,
  Globe, GitBranch, Pause, Wifi, Send, Radio, Power,
  UserPlus, CreditCard, FileText, Calendar, SkipForward,
  Webhook, Plug, FolderTree, Link2, Paintbrush, Terminal,
  Sparkles, Play, Code2,
} from 'lucide-react';
import {
  HttpIcon, WebSocketIcon, SSEIcon, CronIcon, QueueIcon,
  RPCIcon, MCPIcon, CLIIcon, TriggerIcon, BotIcon, WorkflowIcon, GatewayIcon,
} from '../WiringIcons';
import { PaperPage, CodeCard } from '../PaperLayout';
import styles from './feature-page.module.css';
import snippetsMeta from '../../data/snippets-meta.json';
import type {
  PageData, Section, ColContent, CardItem, CodeSpec,
  HeroSection, TwoColSection, FeatureGridSection,
  WideCodeSection, StepCardsSection, CtaSection,
} from './types';

const GITHUB_BASE = 'https://github.com/pikkujs/template-online-shop/blob/main/packages/functions/src/';
function snippetSourceUrl(key: string | undefined): string | undefined {
  if (!key) return undefined;
  const file = (snippetsMeta as Record<string, string>)[key];
  return file ? GITHUB_BASE + file : undefined;
}

/* ── Icon resolution ─────────────────────────────────────── */

const LUCIDE: Record<string, React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  'bar-chart-3': BarChart3, 'refresh-cw': RefreshCw, 'zap': Zap,
  'shield-check': ShieldCheck, 'clock': Clock, 'database': Database,
  'shield': Shield, 'key': Key, 'lock': Lock, 'user-check': UserCheck,
  'layers': Layers, 'variable': Variable, 'file-json': FileJson,
  'git-commit': GitCommit, 'server': Server, 'function-square': FunctionSquare,
  'package': Package, 'scissors': Scissors, 'filter': Filter,
  'file-code': FileCode, 'search': Search, 'tree-pine': TreePine,
  'wrench': Wrench, 'cookie': Cookie, 'scan': Scan,
  'arrow-right': ArrowRight, 'hash': Hash, 'book-open': BookOpen,
  'alert-triangle': AlertTriangle, 'headphones': Headphones, 'settings': Settings,
  'pen-tool': PenTool, 'message-square': MessageSquare, 'brain': Brain,
  'globe': Globe, 'git-branch': GitBranch, 'pause': Pause,
  'wifi': Wifi, 'send': Send, 'radio': Radio, 'power': Power,
  'user-plus': UserPlus, 'credit-card': CreditCard, 'file-text': FileText,
  'calendar': Calendar, 'skip-forward': SkipForward,
  'webhook': Webhook, 'plug': Plug, 'folder-tree': FolderTree,
  'link-2': Link2, 'paintbrush': Paintbrush, 'terminal': Terminal,
  'sparkles': Sparkles, 'play': Play, 'code-2': Code2,
};

const WIRE: Record<string, React.FC<{ size?: number }>> = {
  http: HttpIcon, websocket: WebSocketIcon, sse: SSEIcon,
  cron: CronIcon, queue: QueueIcon, rpc: RPCIcon,
  mcp: MCPIcon, cli: CLIIcon, trigger: TriggerIcon,
  bot: BotIcon, workflow: WorkflowIcon, gateway: GatewayIcon,
};

function resolveIcon(name: string | undefined, size = 16, style?: React.CSSProperties): React.ReactNode {
  if (!name) return null;
  const L = LUCIDE[name];
  if (L) return <L size={size} style={{ color: '#c2410c', ...style }} />;
  const W = WIRE[name];
  if (W) return <W size={size} />;
  return null;
}

/* ── collapseFunc: trim func: async body to // ... ──────── */

function collapseFunc(code: string): string {
  const lines = code.split('\n');
  const out: string[] = [];
  let inBody = false;
  let depth = 0;

  for (const line of lines) {
    if (!inBody) {
      out.push(line);
      if (/func:\s*async/.test(line)) {
        inBody = true;
        depth = (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
        if (depth > 0) out.push('    // ...');
      }
    } else {
      depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
      if (depth <= 0) {
        out.push(line);
        inBody = false;
      }
    }
  }
  return out.join('\n');
}

/* ── Text parser: _italic_ → <em> ───────────────────────── */

function parseText(text: string): React.ReactNode {
  const parts = text.split(/(_[^_]+_)/);
  return parts.map((part, i) =>
    part.startsWith('_') && part.endsWith('_')
      ? <em key={i}>{part.slice(1, -1)}</em>
      : part
  );
}

/* ── ColContent renderer ─────────────────────────────────── */

function renderCards(cards: CardItem[], columns = 3): React.ReactNode {
  // Single-column lists (e.g. "Runtime context" wire-object cards) render as
  // a compact def-list — icon + mono label + description — not boxed cards.
  if (columns === 1) {
    return (
      <dl className={styles.defList}>
        {cards.map((c, i) => (
          <div key={i} className={styles.defItem}>
            <dt className={styles.defTerm}>
              {c.icon && <span className={styles.defIcon}>{resolveIcon(c.icon, 14)}</span>}
              <code className={styles.defLabel}>{c.title}</code>
            </dt>
            <dd className={styles.defDesc}>{c.body}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
      {cards.map((c, i) => (
        <div key={i} className={styles.card} style={c.accentColor ? { borderTopWidth: 3, borderTopColor: c.accentColor } : undefined}>
          {c.icon && (
            <div style={{ marginBottom: 10 }}>{resolveIcon(c.icon, 16, { flexShrink: 0 })}</div>
          )}
          <div className={styles.cardTitle} style={c.mono ? { fontFamily: 'Geist Mono, monospace' } : undefined}>{c.title}</div>
          <p className={styles.cardBody}>{c.body}</p>
        </div>
      ))}
    </div>
  );
}

function renderCodeSpec(spec: CodeSpec): React.ReactNode {
  const code = spec.collapse ? collapseFunc(spec.code) : spec.code;
  return (
    <CodeCard
      filename={spec.filename}
      badge={spec.badge}
      icon={spec.icon ? resolveIcon(spec.icon, 13) : undefined}
      sourceUrl={snippetSourceUrl(spec.snippetKey)}
    >
      <CodeBlock language={spec.language ?? 'typescript'}>{code}</CodeBlock>
    </CodeCard>
  );
}

function renderCol(col: ColContent): React.ReactNode {
  switch (col.type) {
    case 'cards':
      return renderCards(col.cards, col.columns ?? 1);
    case 'code':
      return renderCodeSpec(col.code);
    case 'codes':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {col.codes.map((c, i) => <div key={i}>{renderCodeSpec(c)}</div>)}
        </div>
      );
    case 'check-list':
      return (
        <div className={styles.checkList}>
          {col.items.map((item, i) => (
            <div key={i} className={styles.checkItem}>
              <span className={styles.checkCircle}>✓</span>
              <div>
                <div className={styles.checkLabel}>{item.title}</div>
                <div className={styles.checkDesc}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'note':
      return (
        <div className={styles.note}>
          {col.icon && <span className={styles.noteIconWrap}>{resolveIcon(col.icon, 16)}</span>}
          <span>
            {col.title && <strong>{col.title} </strong>}
            {col.body}
          </span>
        </div>
      );
  }
}

/* ── Section header (eyebrow + h2 + lead) ────────────────── */

function SectionHeader({ eyebrow, h2, lead }: { eyebrow?: string; h2?: string; lead?: string }) {
  if (!eyebrow && !h2 && !lead) return null;
  return (
    <div className={styles.sectionHead}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      {h2 && <h2 className={styles.h2}>{parseText(h2)}</h2>}
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}

/* ── Section variant class ───────────────────────────────── */

function sectionClass(variant?: 'default' | 'alt' | 'dark') {
  if (variant === 'alt') return styles.sectionAlt;
  if (variant === 'dark') return styles.sectionDark;
  return styles.section;
}

/* ── Hero ────────────────────────────────────────────────── */

function HeroRenderer({ s }: { s: HeroSection }) {
  const hasRight = !!s.right;
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner} style={!hasRight ? { gridTemplateColumns: '1fr', maxWidth: 720 } : undefined}>
        <div>
          {s.badge && <span className={styles.badge}>{s.badge}</span>}
          <h1 className={styles.h1}>{parseText(s.h1)}</h1>
          <p className={styles.lead}>{s.lead}</p>
          <div className={styles.heroActions}>
            {s.cta.map((btn, i) => (
              btn.primary !== false
                ? <Link key={i} to={btn.to} className={styles.btnPrimary}>{btn.label}</Link>
                : <Link key={i} to={btn.to} className={styles.btnGhost}>{btn.label}</Link>
            ))}
          </div>
        </div>

        {s.right?.type === 'wire-icon' && (
          <div className={styles.heroIconBox}>
            {(() => { const W = WIRE[s.right.name]; return W ? <W size={120} /> : null; })()}
          </div>
        )}

        {s.right?.type === 'code' && (
          <pre className={styles.heroCode}>{s.right.code}</pre>
        )}
      </div>
    </div>
  );
}

/* ── Two-col ─────────────────────────────────────────────── */

function TwoColRenderer({ s }: { s: TwoColSection }) {
  return (
    <section id={s.id} className={sectionClass(s.variant)}>
      <div className={styles.wrap}>
        <SectionHeader eyebrow={s.eyebrow} h2={s.h2} lead={s.lead} />
        <div style={{ display: 'grid', gridTemplateColumns: s.columns ?? '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>{renderCol(s.left)}</div>
          <div style={{ minWidth: 0 }}>{renderCol(s.right)}</div>
        </div>
        {s.below && <div style={{ marginTop: 32 }}>{renderCol(s.below)}</div>}
      </div>
    </section>
  );
}

/* ── Feature grid ────────────────────────────────────────── */

function FeatureGridRenderer({ s }: { s: FeatureGridSection }) {
  return (
    <section id={s.id} className={sectionClass(s.variant)}>
      <div className={styles.wrap}>
        <SectionHeader eyebrow={s.eyebrow} h2={s.h2} lead={s.lead} />
        {renderCards(s.cards, s.columns ?? 3)}
        {s.below && <div style={{ marginTop: 24 }}>{renderCol(s.below)}</div>}
      </div>
    </section>
  );
}

/* ── Wide code ───────────────────────────────────────────── */

function WideCodeRenderer({ s, flip = false }: { s: WideCodeSection; flip?: boolean }) {
  // Split: prose (eyebrow + h2 + lead) left, code right.
  // When `flip` is true, code moves left and prose moves right via CSS order.
  const hasHeader = !!(s.eyebrow || s.h2 || s.lead);
  return (
    <section id={s.id} className={sectionClass(s.variant)}>
      <div className={styles.wrap}>
        {hasHeader ? (
          <div className={`${styles.wideSplit} ${flip ? styles.wideSplitFlip : ''}`}>
            <div className={styles.wideSplitProse}>
              <SectionHeader eyebrow={s.eyebrow} h2={s.h2} lead={s.lead} />
            </div>
            <div className={styles.wideSplitCode}>
              {renderCodeSpec(s.code)}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 760 }}>{renderCodeSpec(s.code)}</div>
        )}
        {s.below && <div className={styles.wideBelow}>{renderCol(s.below)}</div>}
      </div>
    </section>
  );
}

/* ── Step cards ──────────────────────────────────────────── */

function StepCardsRenderer({ s }: { s: StepCardsSection }) {
  const cols = s.columns ?? s.steps.length;
  return (
    <section id={s.id} className={sectionClass(s.variant)}>
      <div className={styles.wrap}>
        <SectionHeader eyebrow={s.eyebrow} h2={s.h2} lead={s.lead} />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
          {s.steps.map((step, i) => (
            <div key={i} className={styles.card}>
              <span className={styles.stepBadge} style={{ marginBottom: 10 }}>{i + 1}</span>
              <div className={styles.cardTitle}>{step.title}</div>
              <p className={styles.cardBody} style={{ marginBottom: step.command ? 10 : 0 }}>{step.desc}</p>
              {step.command && (
                <code style={{ fontSize: 11, fontFamily: 'Geist Mono, monospace', color: '#6b6559', background: '#efece4', border: '1px solid #e3ddd0', padding: '3px 7px', borderRadius: 5, display: 'block' }}>
                  {step.command}
                </code>
              )}
            </div>
          ))}
        </div>
        {s.below && <div style={{ marginTop: 32 }}>{renderCol(s.below)}</div>}
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────── */

function CtaRenderer({ s }: { s: CtaSection }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (s.cmd) {
      navigator.clipboard.writeText(s.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>{parseText(s.h2)}</h2>
        {s.lead && <p className={styles.lead} style={{ marginBottom: 28 }}>{s.lead}</p>}
        {s.cmd && (
          <div className={styles.cmdBlock} onClick={copy} style={{ paddingRight: 44 }}>
            <span className={styles.cmdPrompt}>$ </span>{s.cmd}
            <button className={styles.copyBtn} onClick={e => { e.stopPropagation(); copy(); }} title="Copy">
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {s.buttons.map((btn, i) => (
            btn.primary !== false
              ? <Link key={i} to={btn.to} className={styles.btnPrimary}>{btn.label}</Link>
              : <Link key={i} to={btn.to} className={styles.btnGhost}>{btn.label}</Link>
          ))}
        </div>
        {s.footnote && <p style={{ marginTop: 24, fontSize: 13, color: '#9a9387' }}>{s.footnote}</p>}
      </div>
    </section>
  );
}

/* ── Section dispatcher ──────────────────────────────────── */

function renderSection(s: Section, i: number, wideCodeIndex: number): React.ReactNode {
  switch (s.component) {
    case 'hero':          return <HeroRenderer key={i} s={s} />;
    case 'two-col':       return <TwoColRenderer key={i} s={s} />;
    case 'feature-grid':  return <FeatureGridRenderer key={i} s={s} />;
    case 'wide-code':     return <WideCodeRenderer key={i} s={s} flip={wideCodeIndex % 2 !== 0} />;
    case 'step-cards':    return <StepCardsRenderer key={i} s={s} />;
    case 'cta':           return <CtaRenderer key={i} s={s} />;
    default:              return null;
  }
}

/* ── FeaturePage entry point ─────────────────────────────── */

export function FeaturePage({ data }: { data: PageData }) {
  let wideCodeIndex = 0;
  return (
    <Layout title={data.meta.title} description={data.meta.description}>
      <PaperPage>
        {data.sections.map((s, i) => {
          if (s.component === 'wide-code') {
            const node = renderSection(s, i, wideCodeIndex);
            wideCodeIndex++;
            return node;
          }
          return renderSection(s, i, 0);
        })}
      </PaperPage>
    </Layout>
  );
}
