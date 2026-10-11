import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { PaperPage, Section, Wrap, H1, Lead } from '@site/src/components/PaperLayout';
import { Band, Chips, wall, type WallBand } from '@site/src/components/Catalogue/Wall';
import styles from './catalogue.module.css';

export type AddonEntry = {
  slug: string;
  name: string;
  title: string;
  category: string;
  categoryLabel: string;
  description?: string;
  logo?: string;
  functionCount: number;
};

export default function Browse({ addons }: { addons: AddonEntry[] }): React.ReactNode {
  const [query, setQuery] = useState('');
  // Detail pages link back with ?category=, so the catalogue opens where the
  // reader left off. Read once on mount — the prerendered HTML has no search.
  const [category, setCategory] = useState<string | null>(null);
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('category');
    if (wanted) setCategory(wanted);
  }, []);

  const totalFunctions = useMemo(
    () => addons.reduce((sum, addon) => sum + addon.functionCount, 0),
    [addons]
  );

  const groups = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const addon of addons) {
      const entry = counts.get(addon.category);
      if (entry) entry.count += 1;
      else counts.set(addon.category, { label: addon.categoryLabel, count: 1 });
    }
    return [...counts.entries()]
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [addons]);

  const { bands, total } = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = addons.filter((addon) => {
      if (category && addon.category !== category) return false;
      if (!needle) return true;
      return (
        addon.title.toLowerCase().includes(needle) ||
        addon.name.toLowerCase().includes(needle) ||
        addon.categoryLabel.toLowerCase().includes(needle) ||
        (addon.description ?? '').toLowerCase().includes(needle)
      );
    });

    const byCategory = new Map<string, AddonEntry[]>();
    for (const addon of matches) {
      const list = byCategory.get(addon.category);
      if (list) list.push(addon);
      else byCategory.set(addon.category, [addon]);
    }

    return {
      total: matches.length,
      bands: [...byCategory.entries()]
        .map(([key, items]): WallBand => ({
          key,
          label: items[0].categoryLabel,
          items: items
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((addon) => ({
              id: addon.slug,
              title: addon.title,
              subtitle: addon.name.replace('@pikku/addon-', ''),
              count: addon.functionCount,
              logo: addon.logo,
              href: `/addons/${addon.slug}`,
            })),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };
  }, [addons, query, category]);

  return (
    <Layout
      title="Addon Catalogue"
      description={`${addons.length} Pikku addons — ${totalFunctions.toLocaleString()} typed functions you can wire into a project with one call.`}
    >
      <PaperPage>
        <Section>
          <Wrap wide>
            <div className={styles.masthead}>
              <div className={styles.mastheadTop}>
                <H1>Someone already wrote it.</H1>
                <span className={styles.tally}>
                  {addons.length} addons · {totalFunctions.toLocaleString()} functions
                </span>
              </div>
              <Lead>
                Every addon is a package of typed Pikku functions — namespaced, secrets
                declared, ready to call over RPC. Wire one and its functions join your
                app as if you had written them.
              </Lead>

              <div className={styles.wireLine}>
                <span className={styles.tKw}>import</span>
                <span className={styles.tPunct}> {'{'} </span>wireAddon
                <span className={styles.tPunct}> {'}'} </span>
                <span className={styles.tKw}>from</span>
                <span className={styles.tStr}> '#pikku/addon'</span>
                {'\n\n'}
                <span className={styles.tFn}>wireAddon</span>
                <span className={styles.tPunct}>({'{'} </span>
                <span className={styles.tProp}>name</span>
                <span className={styles.tPunct}>: </span>
                <span className={styles.tStr}>'stripe'</span>
                <span className={styles.tPunct}>, </span>
                <span className={styles.tProp}>package</span>
                <span className={styles.tPunct}>: </span>
                <span className={styles.tStr}>'@pikku/addon-stripe'</span>
                <span className={styles.tPunct}> {'}'})</span>
              </div>
            </div>
          </Wrap>
        </Section>

        <Section variant="alt">
          <Wrap wide>
            <div className={wall.controls}>
              <input
                type="search"
                className={wall.search}
                placeholder="Search 218 addons…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search the addon catalogue"
              />
              <p className={wall.resultCount} aria-live="polite">
                {total} {total === 1 ? 'addon' : 'addons'}
              </p>
            </div>

            <Chips
              groups={groups}
              active={category}
              total={addons.length}
              onChange={setCategory}
            />

            {total === 0 ? (
              <div className={wall.empty}>
                <p className={wall.emptyTitle}>Nothing matches “{query}”.</p>
                <p className={wall.emptyBody}>
                  Addons are published from the Fabric registry — if what you need isn’t
                  here yet, you can write it and publish it yourself.
                </p>
                <button
                  type="button"
                  className={wall.reset}
                  onClick={() => {
                    setQuery('');
                    setCategory(null);
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 26 }}>
                {bands.map((band) => (
                  <Band band={band} key={band.key} />
                ))}
              </div>
            )}
          </Wrap>
        </Section>
      </PaperPage>
    </Layout>
  );
}
