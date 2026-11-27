import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from '@tanstack/react-router';
import Link from '@/components/site/Link';
import useBaseUrl from '@/components/site/useBaseUrl';
import { docBlocks, inlineSpans, originChip, originText, unfence } from './surface-docs';
import { proseFor, stepsOf } from './surface-steps';
import { guideFor } from './surface-guides';
import { optionsOf, searchSurface, type Hit } from './surface-search';
import type {
  SurfaceDoc,
  SurfaceEntryPoint,
  SurfaceEntryPointId,
  SurfaceLeaf,
} from './surface.types';
import styles from './surface.module.css';

/* ════════════════════════════════════════════════════════════════
   The API explorer: the entry-point switch, the six build steps as the
   spine, one door in the middle and one export docked on the right.

     - search is global, not scoped to the open door, so someone who
       already knows a name does not have to guess which door it is behind.
     - every selection writes the location hash, so any state is a link.

   This is the only place the surface is published, and it is generated
   data: scripts/generate-api-surface.mjs vendors it from @pikku/cli.
   ════════════════════════════════════════════════════════════════ */

const ENTRY_LABEL: Record<SurfaceEntryPointId, string> = {
  app: 'Building an app',
  addon: 'Building an addon',
};

/* ── the hash ──────────────────────────────────────────────────
   #app/http/wireHTTP. A door travels as its name rather than its specifier:
   `#pikku/http` carries both a `#` and a `/`, neither of which survives a
   fragment intact, while the name is already URL-shaped. Names are unique
   inside an entry point; the docs link straight at them (/api#app/http). */

interface State {
  entry: SurfaceEntryPointId;
  /** A leaf's `name`, e.g. `http`. */
  door: string | null;
  symbol: string | null;
  query: string;
  /** A hash that does not read as a link into the explorer at all. */
  badLink: string | null;
}

const HOME: State = { entry: 'app', door: null, symbol: null, query: '', badLink: null };

/** The whole state a hash describes. Nothing is carried over from what was open. */
const parseHash = (hash: string): State => {
  const anchor = hash.replace(/^#/, '');
  // The skip link is an anchor on the page, not a link into the explorer.
  const raw = anchor === 'main' ? '' : anchor;
  const at = raw.indexOf('?q=');
  const path = at < 0 ? raw : raw.slice(0, at);
  let query = '';
  if (at >= 0) {
    try {
      query = decodeURIComponent(raw.slice(at + 3));
    } catch {
      /* a hand-edited hash is not worth a blank page */
    }
  }
  const parts = path.split('/').filter(Boolean);
  const [entry, door, symbol] = parts;
  if (entry !== undefined && entry !== 'app' && entry !== 'addon') {
    return { ...HOME, query, badLink: `#${raw}` };
  }
  if (parts.length > 3) return { ...HOME, query, badLink: `#${raw}` };
  return {
    entry: entry ?? 'app',
    door: door ?? null,
    symbol: symbol ?? null,
    query,
    badLink: null,
  };
};

const hashFor = (state: State) => {
  const parts: string[] = [state.entry];
  if (state.door) parts.push(state.door);
  if (state.symbol) parts.push(state.symbol);
  return `#${parts.join('/')}${state.query ? `?q=${encodeURIComponent(state.query)}` : ''}`;
};

const keyOf = (hit: Hit) => `${hit.leaf.name}/${hit.symbol.name}`;

const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );

/* ── icons ─────────────────────────────────────────────────── */

const Icon = ({ path, ...rest }: { path: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon} {...rest}>
    <path d={path} />
  </svg>
);

const CHEVRON = 'M6 9l6 6 6-6';
const CLOSE = 'M6 6l12 12M18 6L6 18';

/* Which door you came through reframes every leaf below it, so it is a
   control rather than a page. It renders twice — in the toolbar where there is
   room for it, and at the head of the drawer where there is not — because at
   phone width the alternative was hiding half the data behind nothing. */
function DoorSwitch({
  doc,
  current,
  className,
  onPick,
}: {
  doc: SurfaceDoc;
  current: SurfaceEntryPointId;
  className: string;
  onPick: (id: SurfaceEntryPointId) => void;
}) {
  return (
    <div className={`${styles.doors} ${className}`} role="group" aria-label="What you are building">
      {doc.entryPoints.map((each) => (
        <button
          key={each.id}
          type="button"
          className={styles.door}
          aria-pressed={each.id === current}
          onClick={() => onPick(each.id)}
        >
          {ENTRY_LABEL[each.id] ?? each.job}
        </button>
      ))}
    </div>
  );
}

/* Doc comments carry backticked names; rendering them raw shows the
   backticks. See inlineSpans. */
function Prose({ text }: { text: string }) {
  return (
    <>
      {inlineSpans(text).map((span, index) =>
        span.code ? (
          <code key={index} className={styles.inlineCode}>
            {span.text}
          </code>
        ) : (
          <React.Fragment key={index}>{span.text}</React.Fragment>
        )
      )}
    </>
  );
}

/* ── rows ──────────────────────────────────────────────────── */

function StatusChip({ status }: { status?: number }) {
  if (status === undefined) return null;
  return <span className={`${styles.badge} ${styles.status}`}>HTTP {status}</span>;
}

function ExportRow({
  hit,
  current,
  showDoor,
  onSelect,
}: {
  hit: Hit;
  current: boolean;
  showDoor: boolean;
  onSelect: (hit: Hit) => void;
}) {
  const { symbol, leaf } = hit;
  const summaryId = `surface-summary-${leaf.name}-${symbol.name}`;
  const label = [
    symbol.name,
    symbol.kind,
    symbol.status !== undefined && `HTTP ${symbol.status}`,
    symbol.deprecated && 'deprecated',
    `from ${leaf.specifier}`,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <button
      type="button"
      className={styles.row}
      data-key={keyOf(hit)}
      aria-label={label}
      aria-describedby={summaryId}
      aria-current={current || undefined}
      onClick={() => onSelect(hit)}
    >
      <span className={styles.rowMain}>
        <span className={styles.rowTop}>
          <span className={styles.sym}>{symbol.name}</span>
          <span className={`${styles.badge} ${styles[symbol.kind] ?? ''}`}>{symbol.kind}</span>
          <StatusChip status={symbol.status} />
          {symbol.deprecated && (
            <span className={`${styles.badge} ${styles.deprecated}`}>deprecated</span>
          )}
          {showDoor && <span className={styles.fromDoor}>{leaf.specifier}</span>}
        </span>
        <span
          id={summaryId}
          className={`${styles.rowSummary} ${symbol.summary ? '' : styles.undocumented}`}
        >
          {symbol.summary ? <Prose text={symbol.summary} /> : 'Not documented yet'}
        </span>
        <span className={styles.rowImport}>
          import {'{'} {symbol.name} {'}'} from '{leaf.specifier}'
        </span>
      </span>
      <span className={styles.rowOrigin}>{originChip(symbol.origin)}</span>
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [outcome, setOutcome] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (outcome === 'idle') return;
    const timer = setTimeout(() => setOutcome('idle'), 2500);
    return () => clearTimeout(timer);
  }, [outcome]);

  const copy = () => {
    if (!navigator.clipboard) {
      setOutcome('failed');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => setOutcome('copied'),
      () => setOutcome('failed')
    );
  };

  return (
    <>
      <button type="button" className={styles.copyBtn} onClick={copy}>
        {outcome === 'copied' ? 'Copied' : outcome === 'failed' ? 'Copy failed' : 'Copy'}
      </button>
      <span role="status" className="sr-only">
        {outcome === 'copied' && 'Import line copied'}
        {outcome === 'failed' && 'Copy failed. Select the import line to copy it by hand.'}
      </span>
    </>
  );
}

/* ── the detail, docked right ──────────────────────────────── */

function Detail({
  hit,
  onClose,
  closeRef,
}: {
  hit: Hit | null;
  onClose: () => void;
  closeRef: React.Ref<HTMLButtonElement>;
}) {
  if (!hit) {
    return (
      <div className={styles.panelEmpty}>
        <p>Pick an export to read its doc comment, its options and its signature.</p>
        {/* The panel's resting state is 420px of nothing until you click
            something, which is exactly where the keys are worth knowing. */}
        <dl className={styles.keys}>
          <div>
            <dt>/</dt>
            <dd>search every export</dd>
          </div>
          <div>
            <dt>↑ ↓</dt>
            <dd>walk the list</dd>
          </div>
          <div>
            <dt>esc</dt>
            <dd>back out one level</dd>
          </div>
        </dl>
      </div>
    );
  }

  const { symbol, leaf } = hit;
  const blocks = symbol.docs ? docBlocks(symbol.docs) : [];
  const options = optionsOf(symbol.members ?? []);
  const required = options.filter((option) => option.required).length;
  const importLine = `import { ${symbol.name} } from '${leaf.specifier}'`;

  return (
    <>
      <div className={styles.panelHead}>
        <h2 className={`${styles.sym} ${styles.panelTitle}`}>{symbol.name}</h2>
        <span className={`${styles.badge} ${styles[symbol.kind] ?? ''}`}>{symbol.kind}</span>
        <StatusChip status={symbol.status} />
        {symbol.deprecated && (
          <span className={`${styles.badge} ${styles.deprecated}`}>deprecated</span>
        )}
        <button
          ref={closeRef}
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close detail"
        >
          <Icon path={CLOSE} />
        </button>
      </div>

      <div className={styles.panelBody}>
        {blocks.length > 0 ? (
          <div>
            {blocks.map((block, index) =>
              block.kind === 'code' ? (
                <pre key={index} className={styles.code}>
                  {block.text}
                </pre>
              ) : (
                <p key={index} className={styles.prose}>
                  <Prose text={block.text} />
                </p>
              )
            )}
          </div>
        ) : (
          <p className={`${styles.prose} ${styles.undocumented}`}>
            No doc comment yet — the signature below is all there is.
          </p>
        )}

        {symbol.deprecated && (
          <div>
            <div className={styles.lab}>deprecated</div>
            <p className={styles.prose}>
              <Prose text={symbol.deprecated} />
            </p>
          </div>
        )}

        <div>
          <div className={styles.labRow}>
            <div className={styles.lab}>import it from</div>
            <CopyButton key={keyOf(hit)} text={importLine} />
          </div>
          <pre className={`${styles.code} ${styles.wrap}`}>{importLine}</pre>
        </div>

        {symbol.examples && symbol.examples.length > 0 && (
          <div>
            <div className={styles.lab}>
              {symbol.examples.length === 1 ? 'example' : `${symbol.examples.length} examples`}
            </div>
            {symbol.examples.map((example, index) => (
              <pre key={index} className={styles.code}>
                {unfence(example)}
              </pre>
            ))}
          </div>
        )}

        {options.length > 0 && (
          <div>
            <div className={styles.lab}>
              {options.length} {options.length === 1 ? 'option' : 'options'}
              {required > 0 && ` · ${required} required`}
            </div>
            <div className={styles.members}>
              {options.map((option, index) => (
                <div key={`${index}:${option.line}`} className={styles.member}>
                  <code>
                    {option.line}
                    {option.required && <span className={styles.required}>required</span>}
                  </code>
                  {option.doc && (
                    <p>
                      <Prose text={option.doc} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {symbol.signature && (
          <details className={styles.sig}>
            <summary>signature · {symbol.signature.length} chars</summary>
            <pre className={styles.code}>{symbol.signature}</pre>
          </details>
        )}

        <div className={styles.originLine}>{originText(symbol.origin)}</div>
      </div>
    </>
  );
}

/* ── the explorer ──────────────────────────────────────────── */

export default function SurfaceExplorer() {
  const router = useRouter();
  const dataUrl = useBaseUrl('/api-surface.json');
  const [doc, setDoc] = useState<SurfaceDoc | null>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<State>(() => parseHash(window.location.hash));
  const [navOpen, setNavOpen] = useState(false);
  /** Below this the detail panel is a sheet over the list. */
  const overlay = useMediaQuery('(max-width: 1180px)');
  /** Below this the navigator is a drawer too. */
  const phone = useMediaQuery('(max-width: 900px)');
  const shellRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const doorBtnRef = useRef<HTMLButtonElement>(null);
  /** How the next state change reaches history. */
  const historyMode = useRef<'push' | 'replace'>('replace');
  /** Where focus goes once the next selection has rendered. */
  const focusNext = useRef<'row' | 'panel' | null>(null);

  /* The 300-odd KB never enters the page bundle — the shell ships empty and
     fills in, the same trade /openapis makes with its catalogue. */
  useEffect(() => {
    let live = true;
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((loaded: SurfaceDoc) => {
        if (live) setDoc(loaded);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [dataUrl]);

  /* The URL is the source of truth whenever something else changes it: back,
     forward, an in-page link or the site search. The router's history sees all
     of them, including its own pushes, which fire no `hashchange`. */
  useEffect(
    () =>
      router.history.subscribe(() => {
        const { pathname, hash } = router.history.location;
        // Leaving the page is not a change of what the explorer shows.
        if (pathname.replace(/\/$/, '') !== '/api') return;
        // The skip link is an anchor on the page, not a link into the explorer.
        if (hash === '#main') return;
        const next = parseHash(hash);
        setState((prev) => (hashFor(prev) === hashFor(next) && !next.badLink ? prev : next));
      }),
    [router]
  );

  const entry: SurfaceEntryPoint | null = useMemo(() => {
    if (!doc) return null;
    return doc.entryPoints.find((each) => each.id === state.entry) ?? doc.entryPoints[0];
  }, [doc, state.entry]);

  const namedLeaf = entry?.leaves.find((each) => each.name === state.door) ?? null;

  // An untouched page is already reading rather than asking to be clicked:
  // the first door of the first step is where the story starts.
  const leaf: SurfaceLeaf | null = namedLeaf ?? entry?.leaves[0] ?? null;

  const results: Hit[] | null = useMemo(() => {
    if (!entry || !state.query.trim()) return null;
    return searchSurface(entry, state.query);
  }, [entry, state.query]);

  /* The named door wins; a link naming the wrong door still finds the export. */
  const selected: Hit | null = useMemo(() => {
    if (!entry || !state.symbol) return null;
    const named = entry.leaves.filter((each) => each.name === state.door);
    for (const each of [...named, ...entry.leaves]) {
      const found = each.symbols.find((symbol) => symbol.name === state.symbol);
      if (found) return { symbol: found, leaf: each };
    }
    return null;
  }, [entry, state.door, state.symbol]);
  const selectedKey = selected ? keyOf(selected) : null;

  const unknownLink = !entry
    ? null
    : state.badLink ??
      ((state.symbol && !selected) || (state.door && !namedLeaf && !selected)
        ? hashFor({ ...state, query: '' })
        : null);

  useEffect(() => {
    if (!doc) return;
    // The address always names the door the export is really behind.
    if (selected && state.door !== selected.leaf.name) {
      setState((prev) => ({ ...prev, door: selected.leaf.name }));
      return;
    }
    // An unreadable link stays in the address bar, next to the note about it.
    if (state.badLink) return;
    const next = hashFor(state);
    const mode = historyMode.current;
    historyMode.current = 'replace';
    const { pathname, search, hash } = router.history.location;
    if (hash === next) return;
    router.history[mode](`${pathname}${search}${next}`);
  }, [doc, state, selected, router]);

  const rows: Hit[] = useMemo(() => {
    if (results) return results;
    if (!leaf) return [];
    return leaf.symbols.map((symbol) => ({ symbol, leaf }));
  }, [results, leaf]);

  const rowFor = useCallback(
    (key: string) =>
      docRef.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`) ?? null,
    []
  );

  const select = useCallback((hit: Hit | null, focus: 'row' | 'panel' | null = null) => {
    historyMode.current = 'push';
    focusNext.current = focus;
    setState((prev) => ({
      ...prev,
      door: hit ? hit.leaf.name : prev.door,
      symbol: hit ? hit.symbol.name : null,
      badLink: null,
    }));
  }, []);

  /* Picking an export by hand: on a narrow screen the detail covers the list,
     so focus follows it there. */
  const open = useCallback(
    (hit: Hit) => select(hit, overlay ? 'panel' : null),
    [select, overlay]
  );

  const closeNav = useCallback(() => {
    setNavOpen(false);
    doorBtnRef.current?.focus();
  }, []);

  const pickEntry = useCallback(
    (id: SurfaceEntryPointId) => {
      historyMode.current = 'push';
      setState((prev) => ({ ...prev, entry: id, door: null, symbol: null, badLink: null }));
      if (navOpen) closeNav();
    },
    [navOpen, closeNav]
  );

  const openLeaf = useCallback(
    (door: string) => {
      historyMode.current = 'push';
      setState((prev) => ({ ...prev, door, symbol: null, query: '', badLink: null }));
      if (navOpen) closeNav();
    },
    [navOpen, closeNav]
  );

  /* `/` focuses this page's search. Typed into a field it is a slash, and
     inside a dialog it belongs to the dialog. */
  useEffect(() => {
    const onKeyDownCapture = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return;
      event.preventDefault();
      event.stopPropagation();
      searchRef.current?.focus();
      searchRef.current?.select();
    };

    document.addEventListener('keydown', onKeyDownCapture, true);
    return () => document.removeEventListener('keydown', onKeyDownCapture, true);
  }, []);

  /* An app answers the keyboard: arrows to walk the list, Escape to back out
     one level. Only for keys pressed in the explorer or with nothing focused,
     so the site's menus and dialogs keep their own. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      const onBody = target === document.body || target === document.documentElement;
      if (!onBody && !shellRef.current?.contains(target)) return;
      const typing = target === searchRef.current;

      if (event.key === 'Escape') {
        if (navOpen) {
          closeNav();
        } else if (typing && state.query) {
          event.preventDefault();
          setState((prev) => ({ ...prev, query: '' }));
        } else if (state.symbol) {
          select(null);
        }
        return;
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const onRow = Boolean(target.closest('[data-key]'));
      if (!(typing || onRow || onBody) || rows.length === 0) return;
      event.preventDefault();
      const at = rows.findIndex((hit) => keyOf(hit) === selectedKey);
      const next =
        event.key === 'ArrowDown'
          ? at < 0
            ? 0
            : Math.min(at + 1, rows.length - 1)
          : at < 0
            ? rows.length - 1
            : Math.max(at - 1, 0);
      if (next !== at) select(rows[next], onRow ? 'row' : null);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [rows, selectedKey, state.symbol, state.query, navOpen, select, closeNav]);

  /* A different list starts at its top. Declared before the effect that
     brings the selected row into view, which has the last word. */
  useEffect(() => {
    if (docRef.current) docRef.current.scrollTop = 0;
  }, [leaf?.name, state.entry, state.query]);

  /* Runs again once the data arrives, because a deep link names a row before
     there are any rows. */
  const lastKey = useRef<string | null>(null);
  useEffect(() => {
    if (!doc) return;
    const previous = lastKey.current;
    lastKey.current = selectedKey;
    if (panelRef.current) panelRef.current.scrollTop = 0;
    const focus = focusNext.current;
    focusNext.current = null;

    if (selectedKey) {
      const row = rowFor(selectedKey);
      row?.scrollIntoView({ block: 'nearest' });
      if (focus === 'row') row?.focus({ preventScroll: true });
      if (focus === 'panel') closeRef.current?.focus({ preventScroll: true });
      return;
    }

    // Closing the detail hands focus back to the row it was opened from.
    const active = document.activeElement;
    if (previous && (active === document.body || panelRef.current?.contains(active))) {
      (rowFor(previous) ?? searchRef.current)?.focus({ preventScroll: true });
    }
  }, [doc, selectedKey, results, rowFor]);

  useEffect(() => {
    if (!navOpen) return;
    const nav = navRef.current;
    (nav?.querySelector<HTMLElement>('[aria-current]') ?? nav?.querySelector('button'))?.focus();
  }, [navOpen]);

  useEffect(() => {
    if (!phone) setNavOpen(false);
  }, [phone]);

  if (failed) {
    return (
      <div className={styles.shell}>
        <div className={styles.loading} role="alert">
          <p>
            The API reference didn’t load. Reload the page to try again, or read the{' '}
            <Link to="/docs">docs</Link>.
          </p>
        </div>
      </div>
    );
  }

  if (!doc || !entry) {
    return (
      <div className={styles.shell}>
        <div className={styles.loading}>
          <p>Reading the surface…</p>
        </div>
      </div>
    );
  }

  const groups = stepsOf(entry);
  const total = entry.leaves.reduce((count, each) => count + each.symbols.length, 0);
  const allBehindBase = entry.leaves.every(
    (each) =>
      each.specifier === entry.specifierBase ||
      each.specifier.startsWith(`${entry.specifierBase}/`)
  );
  const matchCount = results
    ? `${results.length} ${results.length === 1 ? 'export matches' : 'exports match'} “${state.query}”`
    : '';
  const guide = leaf ? guideFor(entry.id, leaf) : null;
  const sheetOpen = phone && Boolean(selected);

  return (
    <div ref={shellRef} className={styles.shell} data-nav={navOpen ? 'open' : undefined}>
      <div className={styles.bar}>
        <button
          ref={doorBtnRef}
          type="button"
          className={styles.doorBtn}
          aria-expanded={navOpen}
          aria-controls="surface-doors"
          onClick={() => setNavOpen((isOpen) => !isOpen)}
        >
          <span className={styles.doorBtnLabel}>Door</span>
          <span className={styles.doorBtnName}>{results ? 'all' : leaf?.name}</span>
          <Icon path={CHEVRON} />
        </button>

        <DoorSwitch doc={doc} current={entry.id} className={styles.barDoors} onPick={pickEntry} />

        <div className={styles.search}>
          <input
            ref={searchRef}
            id="surface-search"
            type="search"
            value={state.query}
            placeholder="Search every export"
            aria-label="Search every export"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => {
              historyMode.current = 'replace';
              const query = event.target.value;
              setState((prev) => ({ ...prev, query, symbol: null, badLink: null }));
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || event.nativeEvent.isComposing || !results?.[0]) return;
              event.preventDefault();
              open(results[0]);
            }}
          />
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
        </div>

        <div className={styles.count}>
          {total} exports · {entry.leaves.length} doors · v{doc.version}
        </div>
        <div role="status" aria-live="polite" className="sr-only">
          {matchCount}
        </div>
      </div>

      <div className={styles.panes}>
        <nav
          ref={navRef}
          id="surface-doors"
          className={styles.nav}
          aria-label="Doors"
          inert={phone && !navOpen}
        >
          <DoorSwitch doc={doc} current={entry.id} className={styles.navDoors} onPick={pickEntry} />
          {groups.map((group) => (
            <React.Fragment key={group.step}>
              <div className={styles.navStep}>{group.step}</div>
              {group.leaves.map((each) => (
                <button
                  key={each.name}
                  type="button"
                  className={styles.navRow}
                  aria-label={`${each.specifier}, ${each.symbols.length} ${each.symbols.length === 1 ? 'export' : 'exports'}`}
                  aria-current={(!results && leaf?.name === each.name) || undefined}
                  onClick={() => openLeaf(each.name)}
                >
                  <span className={styles.navName}>{each.specifier}</span>
                  <span className={styles.navCount}>{each.symbols.length}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className={styles.doc} ref={docRef} inert={sheetOpen}>
          {unknownLink && (
            <p className={styles.notice} role="status">
              Nothing in this release answers to <code>{unknownLink}</code>. Search for the name, or
              pick a door.
            </p>
          )}

          {results ? (
            <div className={styles.docHead}>
              <div className={styles.step}>search</div>
              <h2>{matchCount}</h2>
              {allBehindBase && (
                <p>
                  Across every door behind <code>{entry.specifierBase}</code>.
                </p>
              )}
            </div>
          ) : (
            leaf && (
              <>
                {!state.door && !state.symbol && entry.summary && (
                  <p className={styles.intro}>
                    <Prose text={entry.summary} />
                  </p>
                )}
                <div className={styles.docHead}>
                  <div className={styles.step}>{leaf.step}</div>
                  <h2>{leaf.specifier}</h2>
                  <p>{proseFor(leaf.step)}</p>
                  <p>
                    <Prose text={leaf.summary} />
                  </p>
                  {guide && (
                    <Link to={guide} className={styles.guide}>
                      Read the guide<span className="sr-only"> for {leaf.specifier}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </>
            )
          )}

          {rows.length > 0 ? (
            <div className={styles.rows}>
              {rows.map((hit) => (
                <ExportRow
                  key={keyOf(hit)}
                  hit={hit}
                  current={selectedKey === keyOf(hit)}
                  showDoor={Boolean(results)}
                  onSelect={open}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              Nothing here answers to that. Try <code>wire</code>, <code>func</code> or{' '}
              <code>Error</code>.
            </div>
          )}
        </div>

        <aside
          ref={panelRef}
          className={styles.panel}
          data-open={selected ? 'true' : undefined}
          aria-label="Export detail"
          inert={overlay && !selected}
        >
          <Detail hit={selected} onClose={() => select(null)} closeRef={closeRef} />
        </aside>
      </div>

      <button
        type="button"
        className={styles.scrim}
        aria-hidden="true"
        tabIndex={-1}
        onClick={closeNav}
      />
    </div>
  );
}
