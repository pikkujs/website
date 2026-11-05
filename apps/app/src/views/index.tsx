import React from 'react';
import Layout from '@/components/site/Layout';
import { PaperPage } from '@/components/PaperLayout';
import StudioHome from '@/components/StudioHome';

export default function Home() {
  return (
    <Layout
      title="Pikku: build every app, own every piece"
      description="Pikku is an open-source TypeScript framework. Write your functions once and ship them as a web, mobile, desktop, CLI and MCP app, on the database, auth, queue and AI you choose."
    >
      <PaperPage>
        <StudioHome />
      </PaperPage>
    </Layout>
  );
}
