import React from 'react';
import Layout from '@/components/site/Layout';
import BrowserOnly from '@/components/site/BrowserOnly';
import SurfaceExplorer from '@/components/Surface';

/* The explorer owns the viewport and carries its state in the location hash,
   so there is nothing for the server to render that the client would not
   immediately replace. `npx pikku doc` prints the same surface in a terminal,
   for whichever version a project actually has installed. */
export default function ApiSurfacePage() {
  return (
    <Layout
      title="SDK"
      description="Everything Pikku gives you to import, in the order you meet it while building a service."
    >
      {/* `display: contents` so the explorer's grid is unaffected. */}
      <div data-paper-page="" style={{ display: 'contents' }}>
        <h1 className="sr-only">Pikku SDK</h1>
        <BrowserOnly>{() => <SurfaceExplorer />}</BrowserOnly>
      </div>
    </Layout>
  );
}
