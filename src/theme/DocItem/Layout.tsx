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
  return (
    <>
      {showAIDisclaimer && <AIDisclaimer />}
      <Layout {...props} />
    </>
  );
}
