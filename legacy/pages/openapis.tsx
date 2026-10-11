import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { PaperPage, Section, Wrap, H1, Lead } from '../components/PaperLayout';
import { Chips, Tiles, wall, type WallItem } from '../components/Catalogue/Wall';
import styles from './openapis.module.css';

/* The catalogue is vendored to static/registry/openapis.json by
   `npm run sync-registry`. It is fetched rather than imported so the 2,500-odd
   entries never enter the page bundle — the browse page ships as an empty
   shell and fills in on the client. */

interface OpenApiEntry {
  name: string;
  title?: string;
  provider?: string;
  categories?: string[];
  logo?: string;
  operations?: number;
  /** Security schemes the spec declares: 'oauth2', 'bearer', 'apiKey:header'… */
  auth?: string[];
  version?: string;
  /* ── from fabric's enricher, absent on specs it has not read yet ──────── */
  /** 'oauth2' | 'api_key' | 'bearer' | 'basic' | 'none' | 'custom' */
  authType?: string;
  /** 'active' | 'beta' | 'deprecated' | 'sunset' */
  apiStatus?: string;
  /** 'free' | 'freemium' | 'paid' | 'usage_based' | 'enterprise' */
  pricingModel?: string;
  freeTier?: boolean;
  /** The vendor's own documentation, as found by the enricher. */
  docsUrl?: string;
}

interface Catalogue {
  apis: OpenApiEntry[];
  providers: { provider: string; apiCount: number }[];
}

type Status = 'loading' | 'ready' | 'empty' | 'error';

/* The scheme strings come straight from the spec's securitySchemes, which is
   where the raw shapes like `apiKey:header` come from. Anything unlisted falls
   back to the raw string rather than being hidden. */
const AUTH_LABELS: Record<string, string> = {
  oauth2: 'OAuth 2',
  openIdConnect: 'OpenID Connect',
  bearer: 'Bearer token',
  basic: 'Basic auth',
  'apiKey:header': 'API key (header)',
  'apiKey:query': 'API key (query)',
  'apiKey:cookie': 'API key (cookie)',
};

/* The enricher's own vocabulary, which is coarser than the spec's schemes and
   covers specs whose schemes never parsed. 'Free tier' is the boolean, folded
   into the same control because it is the question people actually ask. */
const PRICING_LABELS: Record<string, string> = {
  free: 'Free',
  freemium: 'Freemium',
  usage_based: 'Usage-based',
  paid: 'Paid',
  enterprise: 'Enterprise',
};

const STATUS_LABELS: Record<string, string> = {
  beta: 'Beta',
  deprecated: 'Deprecated',
  sunset: 'Sunset',
};

/** Matches `specSlug` in scripts/generate-registry.mjs, which names the files
    the openapi-catalogue plugin turns into routes. */
const specSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '');

const PAGE_SIZE = 96;
/** More categories than this and the chip row stops being scannable. */
const CHIP_LIMIT = 14;

export default function OpenApis(): React.ReactNode {
  const url = useBaseUrl('/registry/openapis.json');
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<Catalogue>({ apis: [], providers: [] });
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('');
  const [auth, setAuth] = useState('');
  const [pricing, setPricing] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);

  useEffect(() => {
    let live = true;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((catalogue: Catalogue) => {
        if (!live) return;
        setData(catalogue);
        setStatus(catalogue.apis?.length ? 'ready' : 'empty');
      })
      .catch(() => live && setStatus('error'));
    return () => {
      live = false;
    };
  }, [url]);

  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const api of data.apis) {
      for (const name of api.categories ?? []) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, CHIP_LIMIT)
      .map(([key, count]) => ({ key, label: key.replace(/_/g, ' '), count }));
  }, [data.apis]);

  const authKinds = useMemo(() => {
    const counts = new Map<string, number>();
    for (const api of data.apis) {
      for (const kind of api.auth ?? []) counts.set(kind, (counts.get(kind) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [data.apis]);

  /* `free-tier` is the boolean rather than a pricingModel value, so it is
     counted separately and matched separately in `results`. */
  const pricingKinds = useMemo(() => {
    const counts = new Map<string, number>();
    let freeTier = 0;
    for (const api of data.apis) {
      if (api.pricingModel) counts.set(api.pricingModel, (counts.get(api.pricingModel) ?? 0) + 1);
      if (api.freeTier) freeTier += 1;
    }
    const models = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return freeTier > 0 ? [['free-tier', freeTier] as [string, number], ...models] : models;
  }, [data.apis]);

  /** How much of the catalogue the enricher has actually classified. */
  const enrichedCount = useMemo(
    () => data.apis.filter((api) => api.authType || api.pricingModel || api.docsUrl).length,
    [data.apis],
  );

  /* Only worth stating once the specs have actually been read — before that it
     would say "0 operations" across a catalogue of real APIs. */
  const totalOperations = useMemo(
    () => data.apis.reduce((sum, api) => sum + (api.operations ?? 0), 0),
    [data.apis],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.apis.filter((api) => {
      if (provider && api.provider !== provider) return false;
      if (category && !(api.categories ?? []).includes(category)) return false;
      if (auth && !(api.auth ?? []).includes(auth)) return false;
      if (pricing === 'free-tier' && !api.freeTier) return false;
      if (pricing && pricing !== 'free-tier' && api.pricingModel !== pricing) return false;
      if (!needle) return true;
      return (
        api.name?.toLowerCase().includes(needle) ||
        api.title?.toLowerCase().includes(needle) ||
        api.provider?.toLowerCase().includes(needle)
      );
    });
  }, [data.apis, query, provider, category, auth, pricing]);

  // A new filter should show the top of its results, not page 4 of the old ones.
  useEffect(() => setShown(PAGE_SIZE), [query, provider, category, auth, pricing]);

  /* Every spec has a prerendered page of its own — what the generated addon
     would be called, the functions it would ship, the secrets it would ask for.
     The vendor's docs link lives on that page rather than on the tile. */
  const items: WallItem[] = results.slice(0, shown).map((api) => ({
    id: api.name,
    title: api.title ?? api.name,
    subtitle: STATUS_LABELS[api.apiStatus ?? '']
      ? `${api.provider} · ${STATUS_LABELS[api.apiStatus!]}`
      : api.provider,
    count: api.operations,
    logo: api.logo,
    externalLogo: true,
    href: `/openapis/${specSlug(api.name)}`,
  }));

  return (
    <Layout
      title="OpenAPI Catalogue"
      description="Every OpenAPI specification pikku can generate a typed client for, searchable by provider and category."
    >
      <PaperPage>
        <Section>
          <Wrap wide>
            <div className={styles.mastheadTop}>
              <H1>
                Every API, <em>already typed</em>
              </H1>
              {status === 'ready' && (
                <span className={styles.tally}>
                  {data.apis.length.toLocaleString()} specs ·{' '}
                  {data.providers.length.toLocaleString()} providers
                  {totalOperations > 0 &&
                    ` · ${totalOperations.toLocaleString()} operations`}
                  {enrichedCount > 0 && ` · ${enrichedCount.toLocaleString()} classified`}
                </span>
              )}
            </div>
            <Lead>
              OpenAPI specifications pikku can generate typed functions from — point it
              at one and it writes the functions, the types and the secrets for you.
            </Lead>
            <p className={styles.headLink}>
              <Link to="/docs/addon/creating#openapi-generation">
                How OpenAPI generation works →
              </Link>
            </p>
          </Wrap>
        </Section>

        <Section variant="alt">
          <Wrap wide>
            {status === 'loading' && <p className={styles.notice}>Loading the catalogue…</p>}

            {status === 'error' && (
              <p className={styles.notice}>
                The catalogue could not be loaded. It is a static file, so this is usually a
                deploy that ran before <code>npm run sync-registry</code>.
              </p>
            )}

            {status === 'empty' && (
              <p className={styles.notice}>
                The catalogue has not been vendored yet. Run <code>npm run sync-registry</code> to
                fetch it.
              </p>
            )}

            {status === 'ready' && (
              <>
                <div className={wall.controls}>
                  <input
                    className={wall.search}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or provider…"
                    aria-label="Search the OpenAPI catalogue"
                  />

                  <select
                    className={styles.select}
                    value={provider}
                    onChange={(event) => setProvider(event.target.value)}
                    aria-label="Filter by provider"
                  >
                    <option value="">All providers</option>
                    {data.providers.map((entry) => (
                      <option key={entry.provider} value={entry.provider}>
                        {entry.provider} ({entry.apiCount})
                      </option>
                    ))}
                  </select>

                  {authKinds.length > 0 && (
                    <select
                      className={styles.select}
                      value={auth}
                      onChange={(event) => setAuth(event.target.value)}
                      aria-label="Filter by authentication scheme"
                    >
                      <option value="">Any auth</option>
                      {authKinds.map(([kind, count]) => (
                        <option key={kind} value={kind}>
                          {AUTH_LABELS[kind] ?? kind} ({count})
                        </option>
                      ))}
                    </select>
                  )}

                  {pricingKinds.length > 0 && (
                    <select
                      className={styles.select}
                      value={pricing}
                      onChange={(event) => setPricing(event.target.value)}
                      aria-label="Filter by pricing"
                    >
                      <option value="">Any pricing</option>
                      {pricingKinds.map(([kind, count]) => (
                        <option key={kind} value={kind}>
                          {kind === 'free-tier'
                            ? 'Has a free tier'
                            : (PRICING_LABELS[kind] ?? kind)}{' '}
                          ({count})
                        </option>
                      ))}
                    </select>
                  )}

                  <p className={wall.resultCount} aria-live="polite">
                    {results.length.toLocaleString()}{' '}
                    {results.length === 1 ? 'specification' : 'specifications'}
                  </p>
                </div>

                <Chips
                  groups={groups}
                  active={category}
                  total={data.apis.length}
                  onChange={setCategory}
                />

                {results.length === 0 ? (
                  <div className={wall.empty}>
                    <p className={wall.emptyTitle}>Nothing matches that.</p>
                    <p className={wall.emptyBody}>
                      Try a shorter search, or clear the filters.
                    </p>
                    <button
                      type="button"
                      className={wall.reset}
                      onClick={() => {
                        setQuery('');
                        setProvider('');
                        setAuth('');
                        setPricing('');
                        setCategory(null);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: 26 }}>
                    <Tiles items={items} />
                  </div>
                )}

                {shown < results.length && (
                  <button
                    type="button"
                    className={wall.moreBtn}
                    onClick={() => setShown((count) => count + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, results.length - shown).toLocaleString()} more
                  </button>
                )}
              </>
            )}
          </Wrap>
        </Section>

        <Section>
          <Wrap>
            <p className={styles.footNote}>
              Looking for ready-made function packages instead?{' '}
              <Link to="/addons">Browse the addon catalogue</Link>
            </p>
          </Wrap>
        </Section>
      </PaperPage>
    </Layout>
  );
}
