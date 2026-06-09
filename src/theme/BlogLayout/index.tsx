import React from 'react';
import Head from '@docusaurus/Head';
import OriginalBlogLayout from '@theme-original/BlogLayout';
import type { Props } from '@theme/BlogLayout';

export default function BlogLayout(props: Props): React.ReactElement {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div data-paper-page="">
        <OriginalBlogLayout {...props} />
      </div>
    </>
  );
}
