import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SurfaceExplorer from '../components/Surface';

/* The explorer owns the viewport and carries its state in the location hash,
   so there is nothing for the server to render that the client would not
   immediately replace. `npx pikku doc` prints the same surface in a terminal,
   for whichever version a project actually has installed.

   `noFooter` because the page never scrolls: a footer below a 100vh grid is
   a footer nobody can reach. */
export default function ApiSurfacePage() {
  return (
    <Layout
      noFooter
      title="SDK"
      description="Everything Pikku gives you to import, in the order you meet it while building a service."
    >
      {/* The site's chrome is paper, and the explorer is the ink slab inside
          it — the same relationship the homepage's ink band has to the page
          around it. `display: contents` so the grid below is unaffected. */}
      <div data-paper-page="" style={{ display: 'contents' }}>
        <BrowserOnly>{() => <SurfaceExplorer />}</BrowserOnly>
      </div>
    </Layout>
  );
}
