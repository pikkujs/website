import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const deployInfoCode = `Units:
  api-get-users       http
  api-create-order    http
  send-welcome-email  queue
  daily-cleanup       cron

Queues:
  welcome-emails  consumer: send-welcome-email

Secrets:
  DATABASE_URL    bound to all units
  STRIPE_KEY      bound to api-create-order`;

const deployPlanCode = `+ create  api-get-users        worker
+ create  api-create-order     worker
+ create  send-welcome-email   worker
+ create  welcome-emails       queue
+ create  daily-cleanup        cron
~ update  DATABASE_URL         secret
- delete  old-webhook-handler  worker

3 to create, 1 to update, 1 to delete`;

const deployApplyCode = `Building workers...
  + api-get-users         built  148 KB
  + api-create-order      built  203 KB
  + send-welcome-email    built   52 KB
  + daily-cleanup         built   34 KB

Build complete.
Deploying to Cloudflare...
Deployment complete. 4 workers deployed.`;

const page: PageData = {
  meta: {
    title: 'Deploy to Cloudflare — One Command',
    description: 'Pikku analyzes your functions and deploys each one as a Cloudflare Worker — with queues, cron, D1, KV, and secrets all configured automatically.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Deployment',
      h1: 'Deploy to Cloudflare.\n_One command._',
      lead: 'Pikku analyzes your functions and deploys each one as a Cloudflare Worker — with queues, cron, D1, KV, and secrets all configured automatically.',
      cta: [
        { label: 'Read the Docs', to: '/docs/runtimes/cloudflare-functions' },
        { label: 'How It Works', to: '#how-it-works', primary: false },
      ],
      right: {
        type: 'code',
        code: `# Deploy everything to Cloudflare
$ pikku deploy apply

Building workers...
  + api-get-users         worker
  + api-create-order      worker
  + send-welcome-email    queue consumer
  + daily-cleanup         cron

Build complete. 4 workers deployed.`,
      },
    },
    {
      component: 'step-cards',
      id: 'how-it-works',
      eyebrow: 'How It Works',
      h2: 'Three commands. _Full control._',
      lead: "Inspect, preview, deploy. Every step is transparent — you always know what's happening before it happens.",
      steps: [
        {
          title: 'pikku deploy info',
          desc: 'See what will deploy — units, queues, cron triggers, secrets, and which roles each worker needs. No changes made.',
          command: 'pikku deploy info',
        },
        {
          title: 'pikku deploy plan',
          desc: 'Dry-run that shows exactly what will be created, updated, deleted, or drained. Review before you commit.',
          command: 'pikku deploy plan',
        },
        {
          title: 'pikku deploy apply',
          desc: 'Deploys everything to your Cloudflare account. Workers, queues, cron triggers, D1, KV, secrets — all wired up.',
          command: 'pikku deploy apply',
        },
      ],
      below: {
        type: 'codes',
        codes: [
          { filename: 'pikku deploy info', icon: 'terminal', code: deployInfoCode, language: 'bash' },
          { filename: 'pikku deploy plan', icon: 'layers', code: deployPlanCode, language: 'bash' },
          { filename: 'pikku deploy apply', icon: 'zap', code: deployApplyCode, language: 'bash' },
        ],
      },
    },
    {
      component: 'feature-grid',
      eyebrow: 'What Gets Deployed',
      h2: 'Everything your app needs. _Auto-configured._',
      lead: "Pikku reads your function signatures and figures out which Cloudflare resources to provision. You don't write wrangler.toml by hand.",
      columns: 3,
      cards: [
        { icon: 'globe', title: 'Workers', body: 'One per function or unit. Each worker is independently deployable and scalable.' },
        { icon: 'radio', title: 'Queues', body: 'Cloudflare Queues with consumers auto-wired to the right worker. No manual binding.' },
        { icon: 'clock', title: 'Cron Triggers', body: 'Scheduled tasks deployed as cron triggers. Set the schedule in your function metadata.' },
        { icon: 'database', title: 'D1 Databases', body: 'For workflow state, session storage, or anything else. Bindings handled automatically.' },
        { icon: 'package', title: 'KV Namespaces', body: 'Key-value storage for caching, config, or feature flags. Created and bound for you.' },
        { icon: 'key', title: 'Secrets & Variables', body: 'Environment variables and secrets deployed to the workers that need them. No leaking across boundaries.' },
      ],
    },
    {
      component: 'step-cards',
      eyebrow: 'Prerequisites',
      h2: "Three things. _That's it._",
      lead: "Install the deploy package, set two environment variables, and you're ready to go.",
      steps: [
        {
          title: 'Install the package',
          desc: 'Adds the Cloudflare provider to your Pikku project.',
          command: 'npm install @pikku/deploy-cloudflare',
        },
        {
          title: 'Account ID',
          desc: 'Your Cloudflare account ID from the dashboard.',
          command: 'export CLOUDFLARE_ACCOUNT_ID=...',
        },
        {
          title: 'API Token',
          desc: 'A Cloudflare API token with Workers and Queues permissions.',
          command: 'export CLOUDFLARE_API_TOKEN=...',
        },
      ],
    },
    {
      component: 'cta',
      h2: 'Ship to the edge',
      lead: 'Your functions, deployed as Cloudflare Workers. Queues, cron, D1, KV — all handled.',
      cmd: 'npm install @pikku/deploy-cloudflare',
      buttons: [
        { label: 'Cloudflare Guide', to: '/docs/runtimes/cloudflare-functions' },
        { label: 'All Features', to: '/features', primary: false },
      ],
    },
  ],
};

export default function CloudflareDeployPage() {
  return <FeaturePage data={page} />;
}
