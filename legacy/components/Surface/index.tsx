import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { docBlocks, inlineSpans, originChip, originText, unfence } from './surface-docs';
import { proseFor, stepsOf } from './surface-steps';
import type {
  SurfaceDoc,
  SurfaceEntryPoint,
  SurfaceEntryPointId,
  SurfaceLeaf,
  SurfaceSymbol,
} from './surface.types';
import styles from './surface.module.css';

/* ════════════════════════════════════════════════════════════════
   The API surface, as the console shows it.

   The console's SurfacePage says why this page can exist at all:

     "The public surface page. The doc and the measured usage are supplied
      rather than fetched here, so the same page serves the website — which
      has the doc for a released version and can measure nothing — and the
      console, which has both."

   So the model is ported (surface.types.ts, surface-steps.ts, surface-docs.ts
   are near-verbatim) and the chrome is rebuilt: the console draws itself with
   Mantine, whose CSS variables would fight this site's, and reads its copy
   from a 4.6 MB Paraglide catalogue. What is kept is the shape — the
   entry-point switch, the six build steps as the spine, a door document in the
   middle, one export docked on the right.

   What is deliberately different, because a website is not a console:
     - search is global, not scoped to the open door. The console filters
       inside a leaf because it has a separate command palette; here one input
       does both, and someone who already knows the name should not have to
       guess which door it is behind.
     - every selection writes the location hash, so any state is a link.
     - there is no usage column. Nothing here can measure a project, and an
       empty column would read as "nothing imports this".

   This is the only place the surface is published. The generated markdown
   reference that used to sit under docs/api-reference/ was a second copy of
   the same JSON, and a second copy is a second thing to keep honest.
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
}

const readHash = (): Partial<State> => {
  if (typeof window === 'undefined') return {};
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return {};
  const [path, encodedQuery] = raw.split('?q=');
  const next: Partial<State> = {};
  if (encodedQuery) {
    try {
      next.query = decodeURIComponent(encodedQuery);
    } catch {
      /* a hand-edited hash is not worth a blank page */
    }
  }
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'app' || parts[0] === 'addon') next.entry = parts[0];
  if (parts[1]) next.door = parts[1];
  if (parts[2]) next.symbol = parts[2];
  return next;
};

const hashFor = (state: State) => {
  const parts: string[] = [state.entry];
  if (state.door) parts.push(state.door);
  if (state.symbol) parts.push(state.symbol);
  return `#${parts.join('/')}${state.query ? `?q=${encodeURIComponent(state.query)}` : ''}`;
};

/* ── icons ─────────────────────────────────────────────────── */

const Icon = ({ path, ...rest }: { path: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon} {...rest}>
    <path d={path} />
  </svg>
);

const MENU = 'M3 6h18M3 12h18M3 18h18';
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

interface Hit {
  symbol: SurfaceSymbol;
  leaf: SurfaceLeaf;
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
  return (
    <button
      type="button"
      className={styles.row}
      data-sym={symbol.name}
      aria-current={current || undefined}
      onClick={() => onSelect(hit)}
    >
      <span className={styles.rowMain}>
        <span className={styles.rowTop}>
          <span className={styles.sym}>{symbol.name}</span>
          <span className={`${styles.badge} ${styles[symbol.kind] ?? ''}`}>{symbol.kind}</span>
          {symbol.deprecated && (
            <span className={`${styles.badge} ${styles.deprecated}`}>deprecated</span>
          )}
          {showDoor && <span className={styles.fromDoor}>{leaf.specifier}</span>}
        </span>
        {symbol.summary ? (
          <span className={styles.rowSummary}>
            <Prose text={symbol.summary} />
          </span>
        ) : (
          <span className={`${styles.rowSummary} ${styles.undocumented}`}>Not documented yet</span>
        )}
        <span className={styles.rowImport}>
          import {'{'} {symbol.name} {'}'} from '{leaf.specifier}'
        </span>
      </span>
      <span className={styles.rowOrigin}>{originChip(symbol.origin)}</span>
    </button>
  );
}

/* ── the detail, docked right ──────────────────────────────── */

function Detail({ hit, onClose }: { hit: Hit | null; onClose: () => void }) {
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

  return (
    <>
      <div className={styles.panelHead}>
        <span className={styles.sym}>{symbol.name}</span>
        <span className={`${styles.badge} ${styles[symbol.kind] ?? ''}`}>{symbol.kind}</span>
        {symbol.deprecated && (
          <span className={`${styles.badge} ${styles.deprecated}`}>deprecated</span>
        )}
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close detail">
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
          <div className={styles.lab}>import it from</div>
          <pre className={`${styles.code} ${styles.wrap}`}>
            import {'{'} {symbol.name} {'}'} from '{leaf.specifier}'
          </pre>
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

        {symbol.members && symbol.members.length > 0 && (
          <div>
            <div className={styles.lab}>{symbol.members.length} options</div>
            <div className={styles.members}>
              {symbol.members.map((member) => (
                <div key={member.line} className={styles.member}>
                  <code>{member.line}</code>
                  {member.doc && (
                    <p>
                      <Prose text={member.doc} />
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
  const dataUrl = useBaseUrl('/api-surface.json');
  const [doc, setDoc] = useState<SurfaceDoc | null>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<State>({
    entry: 'app',
    door: null,
    symbol: null,
    query: '',
  });
  const [navOpen, setNavOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLDivElement>(null);

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

  /* The hash is read once on mount and then on every back/forward. */
  useEffect(() => {
    const sync = () => setState((prev) => ({ ...prev, ...readHash() }));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    if (!doc) return;
    const next = hashFor(state);
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [doc, state]);

  const entry: SurfaceEntryPoint | null = useMemo(() => {
    if (!doc) return null;
    return doc.entryPoints.find((each) => each.id === state.entry) ?? doc.entryPoints[0];
  }, [doc, state.entry]);

  const leaf: SurfaceLeaf | null = useMemo(() => {
    if (!entry) return null;
    // An untouched page is already reading rather than asking to be clicked:
    // the first door of the first step is where the story starts.
    return entry.leaves.find((each) => each.name === state.door) ?? entry.leaves[0];
  }, [entry, state.door]);

  const results: Hit[] | null = useMemo(() => {
    if (!entry) return null;
    const query = state.query.trim().toLowerCase();
    if (!query) return null;
    const out: Hit[] = [];
    for (const each of entry.leaves) {
      for (const symbol of each.symbols) {
        if (
          symbol.name.toLowerCase().includes(query) ||
          (symbol.summary ?? '').toLowerCase().includes(query)
        ) {
          out.push({ symbol, leaf: each });
        }
      }
    }
    return out;
  }, [entry, state.query]);

  const selected: Hit | null = useMemo(() => {
    if (!entry || !state.symbol) return null;
    for (const each of entry.leaves) {
      const found = each.symbols.find((symbol) => symbol.name === state.symbol);
      if (found) return { symbol: found, leaf: each };
    }
    return null;
  }, [entry, state.symbol]);

  const rows: Hit[] = useMemo(() => {
    if (results) return results;
    if (!leaf) return [];
    return leaf.symbols.map((symbol) => ({ symbol, leaf }));
  }, [results, leaf]);

  const select = useCallback((hit: Hit | null) => {
    setState((prev) => ({
      ...prev,
      symbol: hit ? hit.symbol.name : null,
      // While searching, opening a result must not also move the navigator —
      // the search is across doors, and the list under it would change shape.
      door: hit && !prev.query ? hit.leaf.name : prev.door,
    }));
  }, []);

  const pickEntry = useCallback((id: SurfaceEntryPointId) => {
    setState((prev) => ({ ...prev, entry: id, door: null, symbol: null }));
    setNavOpen(false);
  }, []);

  const openLeaf = useCallback((door: string) => {
    setState((prev) => ({ ...prev, door, symbol: null, query: '' }));
    setNavOpen(false);
    if (docRef.current) docRef.current.scrollTop = 0;
  }, []);

  /* `/` is taken: Docusaurus binds it to the Algolia box in the navbar. On
     this page it belongs to the page's own search, so the claim is made in the
     capture phase — which runs before any bubble-phase listener whatever the
     registration order — and propagation stops there. Everywhere else on the
     site `/` still opens Algolia. */
  useEffect(() => {
    const onKeyDownCapture = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      // A `/` typed into any field is a slash, including Algolia's own box.
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      event.stopPropagation();
      searchRef.current?.focus();
      searchRef.current?.select();
    };

    document.addEventListener('keydown', onKeyDownCapture, true);
    return () => document.removeEventListener('keydown', onKeyDownCapture, true);
  }, []);

  /* An app answers the keyboard: arrows to walk the list, Escape to back out
     one level. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = event.target === searchRef.current;

      if (event.key === 'Escape') {
        if (typing && state.query) {
          setState((prev) => ({ ...prev, query: '' }));
          return;
        }
        if (state.symbol) {
          select(null);
          return;
        }
        setNavOpen(false);
        return;
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (rows.length === 0) return;
      event.preventDefault();
      const at = rows.findIndex((hit) => hit.symbol.name === state.symbol);
      const next =
        event.key === 'ArrowDown'
          ? at < 0
            ? 0
            : Math.min(at + 1, rows.length - 1)
          : at < 0
            ? rows.length - 1
            : Math.max(at - 1, 0);
      select(rows[next]);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [rows, state.symbol, state.query, select]);

  /* Keep the walked row in view — the arrow keys are useless past the fold. */
  useEffect(() => {
    if (!state.symbol || !docRef.current) return;
    const row = docRef.current.querySelector(`[data-sym="${CSS.escape(state.symbol)}"]`);
    if (row) row.scrollIntoView({ block: 'nearest' });
  }, [state.symbol]);

  if (failed) {
    return (
      <div className={styles.shell}>
        <div className={styles.loading}>
          <p>
            The surface could not be loaded. It is generated by{' '}
            <code>npm run sync-api-surface</code> — meanwhile{' '}
            <code>npx pikku doc</code> prints the same exports for the version
            you have installed.
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

  return (
    <div className={styles.shell} data-nav={navOpen ? 'open' : undefined}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Show doors"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <Icon path={MENU} />
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
            onChange={(event) =>
              setState((prev) => ({ ...prev, query: event.target.value, symbol: null }))
            }
          />
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
        </div>

        <div className={styles.count}>
          {total} exports · {entry.leaves.length} doors · v{doc.version}
        </div>
      </div>

      <div className={styles.panes}>
        <nav className={styles.nav} aria-label="Doors">
          <DoorSwitch doc={doc} current={entry.id} className={styles.navDoors} onPick={pickEntry} />
          {groups.map((group) => (
            <React.Fragment key={group.step}>
              <div className={styles.navStep}>{group.step}</div>
              {group.leaves.map((each) => (
                <button
                  key={each.specifier}
                  type="button"
                  className={styles.navRow}
                  aria-current={(!state.query && leaf?.name === each.name) || undefined}
                  onClick={() => openLeaf(each.name)}
                >
                  <span className={styles.navName}>{each.specifier}</span>
                  <span className={styles.navCount}>{each.symbols.length}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <main className={styles.doc} ref={docRef}>
          {results ? (
            <div className={styles.docHead}>
              <div className={styles.step}>search</div>
              <h1>
                {results.length} {results.length === 1 ? 'export' : 'exports'} match “
                {state.query}”
              </h1>
              <p>
                Across every door behind <code>{entry.specifierBase}</code>.
              </p>
            </div>
          ) : (
            leaf && (
              <div className={styles.docHead}>
                <div className={styles.step}>{leaf.step}</div>
                <h1>{leaf.specifier}</h1>
                <p>{proseFor(leaf.step)}</p>
                <p>
                  <Prose text={leaf.summary} />
                </p>
              </div>
            )
          )}

          {rows.length > 0 ? (
            <div className={styles.rows}>
              {rows.map((hit) => (
                <ExportRow
                  key={`${hit.leaf.name}/${hit.symbol.name}`}
                  hit={hit}
                  current={state.symbol === hit.symbol.name}
                  showDoor={Boolean(results)}
                  onSelect={select}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              Nothing here answers to that. Try <code>wire</code>, <code>func</code> or{' '}
              <code>Error</code>.
            </div>
          )}
        </main>

        <aside
          className={styles.panel}
          data-open={selected ? 'true' : undefined}
          aria-label="Export detail"
        >
          <Detail hit={selected} onClose={() => select(null)} />
        </aside>
      </div>

      <button
        type="button"
        className={styles.scrim}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => {
          setNavOpen(false);
          select(null);
        }}
      />
    </div>
  );
}
