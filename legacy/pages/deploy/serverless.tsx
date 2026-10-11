import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const serverlessYmlCode = `service: my-app

provider:
  name: aws
  runtime: nodejs20.x
  stage: \${opt:stage, 'dev'}
  region: us-east-1
  environment:
    ORDERS_QUEUE_URL: !Ref OrdersQueue

functions:
  getUser:
    handler: functions/getUser.handler
    events:
      - httpApi:
          path: /users/{id}
          method: get

  processOrder:
    handler: functions/processOrder.handler
    events:
      - sqs:
          arn: !GetAtt OrdersQueue.Arn

  dailyReport:
    handler: functions/dailyReport.handler
    events:
      - schedule:
          rate: cron(0 9 * * ? *)

resources:
  Resources:
    OrdersQueue:
      Type: AWS::SQS::Queue`;

const deployInfoOutput = `Provider:     serverless
Output:       .deploy/serverless/
Status:       generated

Functions:
  HTTP      8 functions   (Lambda + API Gateway)
  Queue     3 consumers   (Lambda + SQS)
  Cron      2 schedules   (Lambda + EventBridge)

Resources:
  OrdersQueue         SQS Queue
  NotificationQueue   SQS Queue

Environment:
  ORDERS_QUEUE_URL        → !Ref OrdersQueue
  NOTIFICATION_QUEUE_URL  → !Ref NotificationQueue`;

const page: PageData = {
  meta: {
    title: 'Deploy to AWS — Lambda + SQS + EventBridge',
    description: 'Pikku generates a complete Serverless Framework config from your functions — Lambda for HTTP, SQS for queues, EventBridge for cron. You just run the deploy.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Deployment',
      h1: 'Deploy to AWS.\n_Lambda + SQS + EventBridge._',
      lead: 'Pikku generates a complete Serverless Framework config from your functions — Lambda for HTTP, SQS for queues, EventBridge for cron. You just run the deploy.',
      cta: [
        { label: 'Read the Docs', to: '/docs/runtimes/aws-lambda' },
        { label: 'How It Works', to: '#how-it-works', primary: false },
      ],
      right: {
        type: 'code',
        code: `# Step 1: Generate config
$ pikku deploy apply --provider serverless
  writing .deploy/serverless/serverless.yml
  bundling 12 functions...
  done.

# Step 2: Deploy
$ cd .deploy/serverless
$ npx serverless deploy
  Deploying my-app to stage dev (us-east-1)
  Service deployed to stack my-app-dev`,
      },
    },
    {
      component: 'step-cards',
      id: 'how-it-works',
      eyebrow: 'How It Works',
      h2: 'Two steps. _That\'s it._',
      lead: "Pikku generates the Serverless Framework config. You deploy it. No hand-written YAML, no mapping routes to Lambda handlers manually.",
      steps: [
        {
          title: 'Generate the config',
          desc: 'Pikku scans your functions and generates a complete serverless.yml plus individually bundled entry points in .deploy/serverless/.',
          command: 'pikku deploy apply --provider serverless',
        },
        {
          title: 'Deploy to AWS',
          desc: 'Standard Serverless Framework deploy. Lambda functions, SQS queues, EventBridge rules — all created from the generated config.',
          command: 'cd .deploy/serverless && npx serverless deploy',
        },
        {
          title: 'Local dev',
          desc: 'Run the full stack locally with serverless-offline. Hot reload your functions without touching AWS.',
          command: 'cd .deploy/serverless && npx serverless offline start',
        },
      ],
      below: {
        type: 'note',
        icon: 'layers',
        title: 'Two-step flow by design.',
        body: "Unlike single-command deploys, Pikku intentionally separates generation from deployment. You get full visibility into the generated serverless.yml before anything hits AWS. Inspect it, tweak it, commit it — then deploy when you're ready.",
      },
    },
    {
      component: 'feature-grid',
      eyebrow: 'What Gets Generated',
      h2: 'A full _serverless.yml_ from your code.',
      lead: 'Pikku reads your function signatures — HTTP routes, queue consumers, cron schedules — and generates everything Serverless Framework needs.',
      columns: 3,
      cards: [
        { icon: 'file-code', title: 'serverless.yml', body: 'Complete Serverless Framework config — functions, events, resources, environment.' },
        { icon: 'package', title: 'Per-function bundles', body: 'Each function gets its own entry point and minimal bundle for fast cold starts.' },
        { icon: 'server', title: 'Lambda + HTTP API events', body: 'HTTP routes become API Gateway events wired to individual Lambda handlers.' },
        { icon: 'send', title: 'SQS queue definitions', body: 'Queue consumers get SQS resources auto-created with proper ARN references.' },
        { icon: 'clock', title: 'EventBridge schedules', body: 'Cron functions become EventBridge rules with the schedule expression from your code.' },
        { icon: 'zap', title: 'Auto-injected env vars', body: 'Lambda ARNs, SQS URLs, and resource references wired into environment variables.' },
      ],
      below: {
        type: 'codes',
        codes: [
          { filename: 'serverless.yml', badge: 'generated', icon: 'file-code', code: serverlessYmlCode, language: 'yaml' },
          { filename: 'pikku deploy info --provider serverless', badge: 'inspect', icon: 'terminal', code: deployInfoOutput, language: 'bash' },
        ],
      },
    },
    {
      component: 'step-cards',
      eyebrow: 'Prerequisites',
      h2: 'Three things. _Five minutes._',
      lead: "If you've deployed to AWS before, you probably already have two of these.",
      steps: [
        {
          title: 'Install the deploy package',
          desc: 'Adds the Serverless Framework provider to your Pikku project.',
          command: 'npm install @pikku/deploy-serverless',
        },
        {
          title: 'AWS credentials configured',
          desc: "Standard AWS SDK credentials — env vars, ~/.aws/credentials, or IAM role. Same setup you'd use for any AWS deployment.",
          command: 'aws configure',
        },
        {
          title: 'Serverless Framework installed',
          desc: 'The actual deployment runs through the Serverless Framework CLI. Pikku just generates the config it reads.',
          command: 'npm install -g serverless',
        },
      ],
    },
    {
      component: 'cta',
      h2: 'Ship to Lambda in minutes',
      lead: "No more hand-writing serverless.yml. Let Pikku generate it from your actual code.",
      cmd: 'npm install @pikku/deploy-serverless',
      buttons: [
        { label: 'Lambda Deployment Guide', to: '/docs/runtimes/aws-lambda' },
        { label: 'All Features', to: '/features', primary: false },
      ],
    },
  ],
};

export default function ServerlessDeployPage() {
  return <FeaturePage data={page} />;
}
