import React from 'react';
import OriginalBlogLayout from '@theme-original/BlogLayout';
import type { Props } from '@theme/BlogLayout';

export default function BlogLayout(props: Props): React.ReactElement {
  return (
    <div data-paper-page="" style={{ display: 'contents' }}>
      <OriginalBlogLayout {...props} />
    </div>
  );
}
