import React from 'react';
import DocsRoot from '@theme-original/DocsRoot';
import type DocsRootType from '@theme/DocsRoot';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof DocsRootType>;

export default function DocsRootWrapper(props: Props): React.JSX.Element {
  return (
    <div data-paper-page="" style={{ display: 'contents' }}>
      <DocsRoot {...props} />
    </div>
  );
}
