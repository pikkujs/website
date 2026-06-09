import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const generatedFunctionCode = `import { app } from '@azure/functions'
import { pikkuHTTPFunctionHandler } from './pikku-azure-http.js'
import { pikkuQueueHandler } from './pikku-azure-queue.js'
import { pikkuTimerHandler } from './pikku-azure-timer.js'

// HTTP triggers
app.http('getUser', {
  methods: ['GET'],
  route: 'users/{id}',
  authLevel: 'anonymous',
  handler: pikkuHTTPFunctionHandler
})

// Storage Queue triggers
app.storageQueue('processOrder', {
  queueName: 'orders',
  connection: 'AzureWebJobsStorage',
  handler: pikkuQueueHandler
})

// Timer triggers
app.timer('dailyCleanup', {
  schedule: '0 0 3 * * *',
  handler: pikkuTimerHandler
})`;

const deployCode = `# Generate Azure Functions code
pikku deploy apply --provider azure

# Deploy to your Function App
cd .deploy/azure
func azure functionapp publish my-function-app`;

const localDevCode = `# Generate Azure Functions code
pikku deploy apply --provider azure

# Start local dev server
cd .deploy/azure
func start`;

const page: PageData = {
  meta: {
    title: 'Deploy to Azure Functions',
    description: 'Pikku generates Azure Functions v4 code from your functions — HTTP triggers, Storage Queue triggers, and Timer triggers. Deploy with the Azure CLI.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Deployment',
      h1: 'Deploy to Azure.\n_Functions + Queues + Timers._',
      lead: 'Pikku generates Azure Functions v4 code from your functions — HTTP triggers, Storage Queue triggers, and Timer triggers. You deploy with the Azure CLI.',
      cta: [
        { label: 'Read the Docs', to: '/getting-started' },
        { label: 'How It Works', to: '#how-it-works', primary: false },
      ],
      right: {
        type: 'code',
        code: `# Step 1: Generate Azure Functions code
$ pikku deploy apply --provider azure

  writing .deploy/azure/src/functions/index.ts
  writing .deploy/azure/host.json
  done.

# Step 2: Deploy to Azure
$ cd .deploy/azure
$ func azure functionapp publish my-app`,
      },
    },
    {
      component: 'step-cards',
      id: 'how-it-works',
      eyebrow: 'How It Works',
      h2: 'Two steps. _That\'s it._',
      lead: 'Pikku generates the Azure Functions code. You deploy it with the Azure CLI. No runtime lock-in, no magic — just generated code you can inspect and customize.',
      steps: [
        {
          title: 'Generate function code',
          desc: 'Pikku scans your functions and generates Azure Functions v4 code, host.json, and local settings into .deploy/azure/.',
          command: 'pikku deploy apply --provider azure',
        },
        {
          title: 'Deploy with Azure CLI',
          desc: "cd into .deploy/azure and run the publish command. Azure's tooling handles packaging, uploading, and provisioning.",
          command: 'func azure functionapp publish <app-name>',
        },
        {
          title: 'Local dev with func start',
          desc: 'Run func start from the .deploy/azure directory to test locally with the Azure Functions Core Tools emulator.',
          command: 'func start',
        },
      ],
      below: {
        type: 'codes',
        codes: [
          { filename: 'Deploy', badge: 'deploy', icon: 'terminal', code: deployCode, language: 'bash' },
          { filename: 'Local dev', badge: 'local dev', icon: 'terminal', code: localDevCode, language: 'bash' },
        ],
      },
    },
    {
      component: 'two-col',
      eyebrow: 'What Gets Generated',
      h2: 'Real Azure code. _Not a wrapper._',
      lead: 'Pikku generates standard Azure Functions v4 Node.js code. You can read it, modify it, and deploy it with the tools you already know.',
      columns: '1fr 1.4fr',
      left: {
        type: 'cards',
        columns: 1,
        cards: [
          { icon: 'file-json', title: 'host.json', body: 'Global Azure Function App configuration — runtime version, extension bundles, and logging settings.' },
          { icon: 'settings', title: 'local.settings.json', body: 'Local development settings — storage connection strings, runtime config, and environment variables.' },
          { icon: 'folder-tree', title: 'Per-function entry points', body: 'Each function gets an Azure Functions v4 handler using app.http(), app.storageQueue(), or app.timer().' },
          { icon: 'globe', title: 'Environment variables', body: 'Function URLs, queue connection strings, and any config your functions need — all wired up automatically.' },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'src/functions/index.ts', badge: 'generated', icon: 'zap', code: generatedFunctionCode, language: 'typescript' },
      },
    },
    {
      component: 'feature-grid',
      eyebrow: 'Trigger Types',
      h2: 'Every Azure trigger. _Auto-wired._',
      columns: 3,
      cards: [
        { icon: 'globe', title: 'HTTP Triggers', body: 'REST endpoints via app.http() — GET, POST, PUT, DELETE with route params and auth levels.' },
        { icon: 'send', title: 'Storage Queue Triggers', body: 'Background jobs via app.storageQueue() — process messages from Azure Storage Queues.' },
        { icon: 'clock', title: 'Timer Triggers', body: 'Scheduled tasks via app.timer() — CRON expressions for recurring jobs.' },
      ],
    },
    {
      component: 'step-cards',
      eyebrow: 'Prerequisites',
      h2: 'What you need _before deploying._',
      lead: 'A couple of installs and an Azure account. Nothing exotic.',
      steps: [
        {
          title: 'Install the deploy package',
          desc: 'Adds the Azure Functions provider to your Pikku project.',
          command: 'npm install @pikku/deploy-azure',
        },
        {
          title: 'Azure Function App',
          desc: 'You need an Azure account with a Function App already created.',
          command: 'az functionapp create ...',
        },
        {
          title: 'Azure Functions Core Tools',
          desc: 'The func CLI handles local dev and deployment. Install it globally.',
          command: 'npm install -g azure-functions-core-tools@4',
        },
      ],
    },
    {
      component: 'cta',
      h2: 'Ship to Azure in minutes',
      lead: 'Generate. Deploy. Done. Your Pikku functions running on Azure Functions with zero boilerplate.',
      cmd: 'npm install @pikku/deploy-azure',
      buttons: [
        { label: 'Azure Functions Guide', to: '/getting-started' },
        { label: 'All Features', to: '/features', primary: false },
      ],
    },
  ],
};

export default function AzureDeployPage() {
  return <FeaturePage data={page} />;
}
