import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import { PaperPage, Section, Wrap, H1, Lead, CodeCard } from '@site/src/components/PaperLayout';
import { Mark, wall } from '@site/src/components/Catalogue/Wall';
import addons from '@site/src/components/AddonCatalogue/catalogue.module.css';
import styles from './openapi-detail.module.css';

/** One operation as the spec declares it. */
type Operation = {
  method: string;
  path: string;
  id?: string;
  summary?: string;
  tags?: string[];
};

/**
 * What `pikku new addon --openapi` would produce, as fabric's meta extraction
 * recorded it. Not a mock-up of the CLI's output: fabric runs the same
 * generator package the CLI does, over the same document, so a name here is the
 * name the file would be given.
 */
type Generated = {
  addon: string;
  credential?: 'oauth2' | 'bearer' | 'apikey';
  authType?: string;
  command: string;
  functions: string[];
  /** The real count; `functions` is capped for specs with thousands. */
  total?: number;
  declarations?: { kind: 'secret' | 'variable'; id: string }[];
};

export type Spec = {
  slug: string;
  name: string;
  title?: string;
  version?: string;
  description?: string;
  specUrl?: string;
  baseUrl?: string;
  servers?: string[];
  operations?: number;
  /** Operations carried on the page — capped, `operations` is the true total. */
  shown?: number;
  functions?: Operation[];
  tags?: string[];
  auth?: string[];
  generated?: Generated;
  /* ── fabric's enricher ─────────────────────────────────────────────── */
  authType?: string;
  authLocation?: string;
  authParamName?: string;
  authHeaderPrefix?: string;
  tokenAcquisition?: string;
  perUser?: boolean;
  apiStatus?: string;
  pricingModel?: string;
  freeTier?: boolean;
  pagination?: string;
  dataFormats?: string[];
  docsUrl?: string;
  enriched?: boolean;
  enrichment?: {
    docsUrl?: string;
    signupUrl?: string;
    pricingUrl?: string;
    officialDocs?: string;
    rateLimitTier?: string;
    cors?: boolean;
    webhooks?: boolean;
    scopes?: string[];
  };
};

const PAGE = 40;

const LABELS: Record<string, string> = {
  oauth2: 'OAuth 2',
  api_key: 'API key',
  apiKey: 'API key',
  apikey: 'API key',
  bearer: 'Bearer token',
  basic: 'Basic auth',
  openIdConnect: 'OpenID Connect',
  none: 'No auth',
  custom: 'Custom',
  free: 'Free',
  freemium: 'Freemium',
  usage_based: 'Usage-based',
  paid: 'Paid',
  enterprise: 'Enterprise',
  active: 'Active',
  beta: 'Beta',
  deprecated: 'Deprecated',
  sunset: 'Sunset',
  admin_portal: 'Admin portal',
  self_serve: 'Self-serve',
  manual: 'Manual request',
};

const label = (value?: string) => (value ? (LABELS[value] ?? value.replace(/_/g, ' ')) : undefined);

/** Spec descriptions are markdown; this page renders them as text. */
const plain = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#>]/g, '')
    .trim();

/**
 * What each declared id is for. The generator names them by role, so the id
 * itself says which one this is — an OAuth addon declares the app credential
 * and the token store separately, and calling both "the OAuth credential"
 * would leave a reader guessing which to fill in with what.
 */
const describe = (d: { kind: 'secret' | 'variable'; id: string }) => {
  if (d.kind === 'variable') {
    return 'Defaults to the base URL in the specification; override it per stage.';
  }
  if (d.id.endsWith('_OAUTH_TOKENS')) {
    return 'Where the addon keeps the access and refresh tokens it obtains per user.';
  }
  if (d.id.endsWith('_OAUTH_APP')) {
    return 'The client id and secret of your OAuth app, which the addon exchanges for user tokens.';
  }
  return 'The credential every generated function sends upstream.';
};

/** The namespace a reader would plausibly wire the generated addon under. */
const namespaceFor = (addon: string) => addon.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

export default function Detail({ spec }: { spec: Spec }): React.ReactNode {
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);

  const gen = spec.generated;
  const operations = spec.functions ?? [];
  const declarations = gen?.declarations ?? [];
  const secrets = declarations.filter((d) => d.kind === 'secret');
  const variables = declarations.filter((d) => d.kind === 'variable');
  /* Only a recorded preview knows what the addon would be called; the namespace
     is the reader's to choose otherwise, and inventing one here would put a name
     in front of every function that the CLI never writes. */
  const ns = gen ? namespaceFor(gen.addon) : null;
  const docs = spec.enrichment?.docsUrl ?? spec.docsUrl ?? spec.enrichment?.officialDocs;
  const summary = spec.description ? plain(spec.description) : undefined;

  /* The generated names are the page's subject; the spec's own operations are
     what gives each one a method, a path and a sentence. They line up by
     operationId, which is what the generator names from — where a spec gave
     none, the name stands on its own. */
  const byId = useMemo(() => {
    const index = new Map<string, Operation>();
    /* Exact first. Then the same names with the punctuation and case dropped,
       because a generated name is the operationId sanitised into an identifier
       — `binaryauthorization.projects.attestors.create` becomes
       `projectsAttestorsCreate`, which is a suffix of it once both are
       flattened. Only an unambiguous suffix counts; two operations ending the
       same way tell us nothing. */
    const flat = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const ambiguous = new Set<string>();
    const loose = new Map<string, Operation>();
    for (const op of operations) {
      if (!op.id) continue;
      index.set(op.id, op);
      const key = flat(op.id);
      if (loose.has(key)) ambiguous.add(key);
      loose.set(key, op);
    }
    return {
      get(name: string) {
        const exact = index.get(name);
        if (exact) return exact;
        const key = flat(name);
        if (loose.has(key)) return ambiguous.has(key) ? undefined : loose.get(key);
        let hit: Operation | undefined;
        for (const [candidate, op] of loose) {
          if (!candidate.endsWith(key)) continue;
          if (hit) return undefined;
          hit = op;
        }
        return hit;
      },
    };
  }, [operations]);

  const rows = useMemo(() => {
    if (gen?.functions?.length) {
      return gen.functions.map((name) => ({ name, op: byId.get(name) }));
    }
    // No preview for this spec — fall back to what the document itself says.
    return operations.map((op) => ({ name: op.id ?? `${op.method} ${op.path}`, op }));
  }, [gen, operations, byId]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        (row.op?.path ?? '').toLowerCase().includes(needle) ||
        (row.op?.summary ?? '').toLowerCase().includes(needle),
    );
  }, [rows, query]);

  const total = gen?.total ?? spec.operations ?? rows.length;

  const facts = [
    { term: 'Auth', value: label(spec.authType) ?? spec.auth?.map(label).join(', ') },
    { term: 'Pricing', value: label(spec.pricingModel) },
    { term: 'Free tier', value: spec.freeTier === undefined ? undefined : spec.freeTier ? 'Yes' : 'No' },
    { term: 'Status', value: label(spec.apiStatus) },
    { term: 'Credentials', value: label(spec.tokenAcquisition) },
    { term: 'Per user', value: spec.perUser === undefined ? undefined : spec.perUser ? 'Yes' : 'No' },
    { term: 'Pagination', value: label(spec.pagination) },
    { term: 'Rate limits', value: label(spec.enrichment?.rateLimitTier) },
    { term: 'Operations', value: spec.operations?.toLocaleString() },
    { term: 'Base URL', value: spec.baseUrl ?? spec.servers?.[0], mono: true },
  ].filter((fact) => fact.value && fact.value !== 'unknown');

  /* The card is narrow and the command is long, so break it on its flags the
     way anyone would type it — one clipped line reads as a broken page. */
  const snippet = gen
    ? `${gen.command.replace(/ --/g, ' \\\n  --')}\n\n# then, in your app\nwireAddon({ name: '${ns}' })`
    : `# download the spec, then let the generator read it\nnpx pikku new addon <name> \\\n  --openapi ./spec.json`;

  return (
    <Layout
      title={`${spec.title ?? spec.name} — OpenAPI`}
      description={
        summary?.slice(0, 155) ??
        `${spec.title ?? spec.name}: ${total} typed functions from one OpenAPI specification.`
      }
    >
      <PaperPage>
        <Section>
          <Wrap wide>
            <Link className={addons.back} to="/openapis">
              ← OpenAPI catalogue
            </Link>

            <div className={addons.hero}>
              <div className={addons.heroText}>
                <span className={addons.badge}>
                  <Mark title={spec.title ?? spec.name} />
                  <span>
                    {spec.name}
                    {/* Catalogue versions are mostly bare (`1.1.0`) but Google's are
                        already prefixed (`v1beta1`), and `vv1beta1` reads as a typo. */}
                    {spec.version && ` · ${/^v\d/.test(spec.version) ? '' : 'v'}${spec.version}`}
                  </span>
                </span>
                <H1>{spec.title ?? spec.name}</H1>
                {summary && <Lead>{summary.length > 320 ? `${summary.slice(0, 320)}…` : summary}</Lead>}
                <div className={styles.heroLinks}>
                  {docs && (
                    <a href={docs} target="_blank" rel="noreferrer noopener">
                      Vendor documentation ↗
                    </a>
                  )}
                  {spec.enrichment?.pricingUrl && (
                    <a href={spec.enrichment.pricingUrl} target="_blank" rel="noreferrer noopener">
                      Pricing ↗
                    </a>
                  )}
                  {spec.enrichment?.signupUrl && (
                    <a href={spec.enrichment.signupUrl} target="_blank" rel="noreferrer noopener">
                      Get a key ↗
                    </a>
                  )}
                  {spec.specUrl && (
                    <a href={spec.specUrl} target="_blank" rel="noreferrer noopener">
                      The specification ↗
                    </a>
                  )}
                </div>
              </div>

              <div className={addons.heroCode}>
                <CodeCard filename="terminal" badge={gen ? `${ns}:*` : spec.name}>
                  <CodeBlock language="bash">{snippet}</CodeBlock>
                </CodeCard>
              </div>
            </div>
          </Wrap>
        </Section>

        <Section variant="alt">
          <Wrap wide>
            <ol className={addons.steps}>
              <li className={addons.step}>
                <span className={addons.stepN}>Step 1</span>
                <h2 className={addons.stepTitle}>Generate</h2>
                <code className={addons.stepCode}>
                  {gen?.command ?? 'npx pikku new addon <name> --openapi ./spec.json'}
                </code>
                <p className={addons.stepBody}>
                  {spec.specUrl ? (
                    <>
                      Save{' '}
                      <a href={spec.specUrl} target="_blank" rel="noreferrer noopener">
                        the specification
                      </a>{' '}
                      as <code>spec.json</code> first — the CLI reads a local file.
                    </>
                  ) : (
                    <>The CLI reads the specification from a local file.</>
                  )}
                </p>
              </li>

              <li className={addons.step}>
                <span className={addons.stepN}>Step 2</span>
                <h2 className={addons.stepTitle}>Wire</h2>
                <code className={addons.stepCode}>
                  wireAddon({'{'} name: '{ns ?? '<addon>'}' {'}'})
                </code>
                <p className={addons.stepBody}>
                  The name you pick becomes the namespace for all{' '}
                  {total.toLocaleString()} functions. See{' '}
                  <Link to="/docs/addon/consuming">Consuming addons</Link>.
                </p>
              </li>

              <li className={addons.step}>
                <span className={addons.stepN}>Step 3</span>
                <h2 className={addons.stepTitle}>Set credentials</h2>
                <code className={addons.stepCode}>
                  {secrets.length
                    ? secrets.map((d) => d.id).join(', ')
                    : gen?.credential
                      ? `${label(gen.credential)} — passed in`
                      : declarations.length
                        ? declarations.map((d) => d.id).join(', ')
                        : gen
                          ? 'none declared'
                          : (label(spec.authType) ?? 'see the specification')}
                </code>
                <p className={addons.stepBody}>
                  {secrets.length ? (
                    <>
                      Store the {secrets.length === 1 ? 'secret' : 'secrets'} before the first
                      call{variables.length ? ', and point the variable at the host you use' : ''}.
                    </>
                  ) : gen?.credential ? (
                    <>
                      The generated service takes the credential as an argument rather than
                      declaring a secret of its own — so where it is kept stays your decision.
                    </>
                  ) : variables.length ? (
                    <>
                      This API needs no credential — only a base URL, so you can point it at a
                      sandbox.
                    </>
                  ) : gen ? (
                    <>The generated addon declares nothing you must supply.</>
                  ) : (
                    <>
                      The generator names the secret it needs from the security scheme in the
                      specification, and prints it when it writes the addon.
                    </>
                  )}
                </p>
              </li>
            </ol>
          </Wrap>
        </Section>

        {declarations.length > 0 && (
          <Section>
            <Wrap wide>
              <div className={addons.blockHead}>
                <h2 className={addons.blockTitle}>What it asks for</h2>
                <span className={addons.blockNote}>
                  {[
                    secrets.length && `${secrets.length} ${secrets.length === 1 ? 'secret' : 'secrets'}`,
                    variables.length &&
                      `${variables.length} ${variables.length === 1 ? 'variable' : 'variables'}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </div>
              <ul className={addons.secrets}>
                {declarations.map((d) => (
                  <li className={addons.secret} key={d.id}>
                    <code className={addons.secretId}>{d.id}</code>
                    <span className={addons.secretName}>
                      {d.kind === 'secret' ? 'Secret' : 'Variable'}
                      <span className={addons.optional}>
                        {d.kind === 'secret' ? 'secrets store' : 'config'}
                      </span>
                    </span>
                    <p className={addons.secretDesc}>{describe(d)}</p>
                  </li>
                ))}
              </ul>
            </Wrap>
          </Section>
        )}

        {facts.length > 0 && (
          <Section variant={declarations.length > 0 ? 'alt' : 'default'}>
            <Wrap wide>
              <div className={addons.blockHead}>
                <h2 className={addons.blockTitle}>The API itself</h2>
                <span className={addons.blockNote}>
                  {spec.enriched ? 'classified by fabric' : 'read from the specification'}
                </span>
              </div>
              <dl className={styles.facts}>
                {facts.map((fact) => (
                  <div className={styles.fact} key={fact.term}>
                    <dt>{fact.term}</dt>
                    <dd className={fact.mono ? styles.factMono : undefined}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Wrap>
          </Section>
        )}

        <Section variant={facts.length > 0 && declarations.length > 0 ? 'default' : 'alt'}>
          <Wrap wide>
            <div className={addons.blockHead}>
              <h2 className={addons.blockTitle}>What you would call</h2>
              <span className={addons.blockNote}>
                {rows.length < total
                  ? `${rows.length} of ${total.toLocaleString()} functions`
                  : `${total.toLocaleString()} ${total === 1 ? 'function' : 'functions'}`}
              </span>
            </div>

            {rows.length > PAGE && (
              <div className={wall.controls}>
                <input
                  type="search"
                  className={wall.search}
                  placeholder={`Filter ${rows.length} functions…`}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setShown(PAGE);
                  }}
                  aria-label="Filter functions"
                />
                <p className={wall.resultCount} aria-live="polite">
                  {matches.length} of {rows.length}
                </p>
              </div>
            )}

            {matches.length === 0 ? (
              <div className={wall.empty}>
                <p className={wall.emptyTitle}>No function matches that.</p>
                <button
                  type="button"
                  className={wall.reset}
                  onClick={() => {
                    setQuery('');
                    setShown(PAGE);
                  }}
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <ul className={styles.ops}>
                {matches.slice(0, shown).map((row) => (
                  <li className={styles.op} key={row.name}>
                    <code className={styles.opName}>
                      {ns && <span className={addons.ns}>{ns}:</span>}
                      {row.name}
                    </code>
                    {row.op && (
                      <span className={styles.route}>
                        <span className={`${styles.method} ${styles[row.op.method] ?? ''}`}>
                          {row.op.method.toUpperCase()}
                        </span>
                        <span className={styles.path}>{row.op.path}</span>
                      </span>
                    )}
                    {row.op?.summary && <p className={addons.fnDesc}>{plain(row.op.summary)}</p>}
                  </li>
                ))}
              </ul>
            )}

            {shown < matches.length && (
              <button
                type="button"
                className={addons.moreBtn}
                onClick={() => setShown(shown + PAGE * 3)}
              >
                Show {Math.min(PAGE * 3, matches.length - shown)} more of {matches.length}
              </button>
            )}

            {rows.length < total && (
              <p className={styles.capped}>
                This specification declares {total.toLocaleString()} operations. The page lists the
                first {rows.length}; the generator writes a function for every one.
              </p>
            )}
          </Wrap>
        </Section>
      </PaperPage>
    </Layout>
  );
}
