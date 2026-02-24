import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { AIDisclaimer } from '@site/src/components/AIDisclaimer';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.JSX.Element {
  const { frontMatter } = useDoc();
  return (
    <>
      {frontMatter.ai && <AIDisclaimer />}
      <Layout {...props} />
    </>
  );
}
