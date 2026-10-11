import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  KeyRound, UserCheck, ListTodo, GitMerge,
  Brain, HardDrive, Radio, FileText,
  Shield, Settings, Clock, Rocket,
  Copy, Check,
} from 'lucide-react';
import { PaperPage } from '../../components/PaperLayout';
import styles from './built-in-services.module.css';

interface ServiceEntry {
  name: string;
  description: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  providers: string[];
  docUrl?: string;
}

interface ServiceGroup {
  title: string;
  services: ServiceEntry[];
}

const serviceGroups: ServiceGroup[] = [
  {
    title: 'Auth & Identity',
    services: [
      { name: 'JWT', description: 'Token signing & verification for stateless auth.', icon: KeyRound, providers: ['@pikku/jose'], docUrl: '/docs/core-features/user-sessions' },
      { name: 'Sessions', description: 'User session management across all wire types.', icon: UserCheck, providers: ['built-in'], docUrl: '/docs/core-features/user-sessions' },
    ],
  },
  {
    title: 'Data & Storage',
    services: [
      { name: 'Queues', description: 'Background job processing with retries and scheduling.', icon: ListTodo, providers: ['@pikku/bullmq', '@pikku/pg-boss', '@pikku/sqs'], docUrl: '/docs/wiring/queue' },
      { name: 'Workflows', description: 'Multi-step stateful processes with persistence.', icon: GitMerge, providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'], docUrl: '/docs/wiring/workflows' },
      { name: 'AI Storage', description: 'Conversation and context persistence for AI agents.', icon: Brain, providers: ['@pikku/pg', '@pikku/kysely'] },
      { name: 'Content', description: 'File storage and retrieval with pluggable backends.', icon: HardDrive, providers: ['local', '@pikku/s3'] },
      { name: 'Channels', description: 'Pub/sub messaging for real-time communication.', icon: Radio, providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'] },
    ],
  },
  {
    title: 'Infrastructure',
    services: [
      { name: 'Logger', description: 'Structured logging across all wire types.', icon: FileText, providers: ['console', '@pikku/pino'] },
      { name: 'Schema Validation', description: 'Input and output validation at wire boundaries.', icon: Shield, providers: ['@pikku/ajv', '@pikku/cfworker'] },
      { name: 'Secrets', description: 'Secure secret resolution from external stores.', icon: KeyRound, providers: ['local', '@pikku/gopass', '@pikku/aws-secrets'], docUrl: '/docs/addon/secrets' },
      { name: 'Variables', description: 'Runtime configuration variables.', icon: Settings, providers: ['built-in'] },
      { name: 'Scheduler', description: 'Cron and delayed job scheduling.', icon: Clock, providers: ['@pikku/bullmq', '@pikku/pg-boss'], docUrl: '/docs/wiring/scheduled-tasks' },
      { name: 'Deployment', description: 'Registry and metadata for deployed functions.', icon: Rocket, providers: ['@pikku/pg', '@pikku/redis', '@pikku/kysely'] },
    ],
  },
];

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.badge}>Deployment</span>
        <h1 className={styles.h1}>Built-in <em>services.</em></h1>
        <p className={styles.lead} style={{ maxWidth: '54ch' }}>
          Every interface Pikku ships, with the providers you can plug in. One import away.
        </p>
      </div>
    </div>
  );
}

function ServiceGridSection() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {serviceGroups.map((group) => (
            <div key={group.title}>
              <div className={styles.groupLabel}>{group.title}</div>
              <div className={styles.serviceGrid}>
                {group.services.map((service) => {
                  const Icon = service.icon;
                  const card = (
                    <div className={styles.serviceCard}>
                      <div className={styles.serviceIcon}><Icon size={18} /></div>
                      <div className={styles.cardTitle} style={{ marginBottom: 6 }}>{service.name}</div>
                      <p className={styles.cardBody} style={{ marginBottom: 12 }}>{service.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {service.providers.map((p) => (
                          <span key={p} className={styles.providerBadge}>{p}</span>
                        ))}
                      </div>
                    </div>
                  );
                  return service.docUrl ? (
                    <Link key={service.name} to={service.docUrl} style={{ textDecoration: 'none' }}>{card}</Link>
                  ) : (
                    <div key={service.name}>{card}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard.writeText('npm create pikku@latest'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={styles.sectionDark}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Ready to build?</h2>
        <p className={styles.lead} style={{ marginBottom: 28 }}>
          All services are included in the scaffold. Pick your providers and start shipping.
        </p>

        <div className={styles.cmdBlock} onClick={copy}>
          <span className={styles.cmdPrompt}>$ </span>npm create pikku@latest
          <button className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); copy(); }} title="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/docs/core-features/services" className={styles.btnPrimary}>Services Docs</Link>
          <Link to="/features" className={styles.btnGhost}>All Features</Link>
        </div>
      </div>
    </section>
  );
}

export default function BuiltInServicesPage() {
  return (
    <Layout
      title="Built-in Services — Every Interface & Provider"
      description="Every service interface Pikku ships — JWT, sessions, queues, workflows, AI storage, content, channels, logger, secrets, and more — with pluggable providers."
    >
      <PaperPage>
        <Hero />
        <main>
          <ServiceGridSection />
          <CTASection />
        </main>
      </PaperPage>
    </Layout>
  );
}
