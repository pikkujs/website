import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  LayoutDashboard, FunctionSquare, GitBranch, Bot,
  Settings, Search, ArrowRight, BookOpen,
} from 'lucide-react';
import { PaperPage } from '../../components/PaperLayout';
import styles from './console.module.css';

const ACC = '#c2410c';

const consoleFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Overview Dashboard',
    desc: 'See every registered function, wire, and service at a glance. Filter by type, tag, or addon.',
  },
  {
    icon: FunctionSquare,
    title: 'Functions Explorer',
    desc: 'Browse all functions with their input/output schemas, permissions, versions, and connected wires.',
  },
  {
    icon: GitBranch,
    title: 'Workflows',
    desc: 'Visualize workflow graphs, inspect step states, and trigger runs with custom input directly from the UI.',
  },
  {
    icon: Bot,
    title: 'Agents',
    desc: 'Chat playground for AI agents. Send messages, inspect tool calls, and debug agent behavior in real time.',
  },
  {
    icon: Settings,
    title: 'Configuration',
    desc: 'Manage secrets, OAuth2 credentials, and variables per environment — no need to touch .env files.',
  },
  {
    icon: Search,
    title: 'Spotlight Search',
    desc: 'Cmd+K to find any function, service, or wire instantly. Jump straight to docs, schemas, or configuration.',
  },
];

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.badge}>Platform</span>
        <h1 className={styles.h1}>
          See everything.<br /><em>Control everything.</em>
        </h1>
        <p className={styles.lead} style={{ maxWidth: '56ch' }}>
          The Pikku Console is your visual control plane — explore functions, run workflows, test agents, and manage configuration in one UI.
        </p>
        <p style={{ marginTop: 12, fontSize: 14, color: '#9a9387' }}>
          A static site that connects to your running Pikku app. No extra server, no hosted service — just open and go.
        </p>
        <span className={styles.alphaBadge}>Alpha</span>
      </div>
    </div>
  );
}

function FeaturesGrid() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>What's Inside</div>
          <h2 className={styles.h2}>Your entire app, <em>visible.</em></h2>
          <p className={styles.lead}>Six panels that give you full observability and control over your Pikku application.</p>
        </div>

        <div className={styles.featGrid}>
          {consoleFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className={styles.card}>
                <div className={styles.featIcon}><Icon size={18} /></div>
                <div className={styles.cardTitle}>{feat.title}</div>
                <p className={styles.cardBody}>{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Try the Console</h2>
        <p className={styles.lead} style={{ marginBottom: 32 }}>
          The Console ships with the Pikku CLI. Run your app and open the visual control plane.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/console" className={styles.btnPrimary}>
            Console Docs <ArrowRight size={15} />
          </Link>
          <Link to="/docs/console/features" className={styles.btnGhost}>
            <BookOpen size={15} style={{ marginRight: 6 }} />All Features
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ConsolePage() {
  return (
    <Layout
      title="Console — Visual Control Plane for Pikku"
      description="The Pikku Console lets you explore functions, run workflows, test agents, and manage secrets and variables in a single visual UI."
    >
      <PaperPage>
        <Hero />
        <main>
          <FeaturesGrid />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
