import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { AIDisclaimer } from '@site/src/components/AIDisclaimer';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.JSX.Element {
  // `metadata.frontMatter` keeps the front matter as-authored, so custom keys
  // survive; the `frontMatter` field beside it is narrowed to Docusaurus's own.
  const { metadata } = useDoc();
  const showAIDisclaimer = Boolean(metadata.frontMatter.ai);

  // The `.doc-shell` wrapper is what docs-shell.css hangs the three-column
  // frame off. It has to be a real element rather than a fragment: the shell
  // targets `.doc-shell > .row > .col` with child combinators so it reaches
  // the page's own columns and not the `.row`/`.col` markup a DocCardList
  // renders inside the content.
  //
  // The paper theme itself is not applied here — the DocsRoot swizzle already
  // wraps every docs route in `data-paper-page`, which is above `.markdown`
  // as custom.css's `:has()` rules and blog.css's `[data-paper-page] .markdown
  // pre` both require.
  return (
    <div className="doc-shell">
      {showAIDisclaimer && <AIDisclaimer />}
      <Layout {...props} />
    </div>
  );
}
