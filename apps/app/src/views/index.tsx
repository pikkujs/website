import React from 'react';
import Layout from '@/components/site/Layout';
import { PaperPage } from '@/components/PaperLayout';
import StudioHome from '@/components/StudioHome';

export default function Home() {
  return (
    <Layout
      title="Pikku: full-stack TypeScript framework"
      description="Pikku is an open-source TypeScript framework: typed clients for web, mobile and desktop apps, and a backend with users, a database, queues, workflows, AI agents and MCP."
    >
      <PaperPage>
        <StudioHome />
      </PaperPage>
    </Layout>
  );
}
