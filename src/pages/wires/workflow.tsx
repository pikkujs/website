import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsCode = snippets.checkoutWorkflow;

const patternsCode = snippets.workflowPatterns;

const graphCode = snippets.workflowPatterns;

const httpCode = snippets.workflowHTTPWiring;

const page: PageData = {
  meta: {
    title: 'Workflow Wire — Pikku',
    description: 'TypeScript durable workflows with no separate infrastructure. Pikku provides durable execution, retries, sleep, fan-out, and DAG-based graph workflows — using your existing functions and database.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: Workflow',
      h1: 'Durable workflows,\n_plain TypeScript._',
      lead: 'wireWorkflow orchestrates multi-step processes with durable execution, retries, sleep, and deterministic replay — all in plain TypeScript.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/workflows', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'workflow' },
    },

    {
      component: 'feature-grid',
      eyebrow: 'The Problem',
      h2: 'The problem with workflow engines _today_',
      lead: 'Existing tools solve durable execution well — but they come with trade-offs that compound as your system grows.',
      variant: 'default',
      columns: 3,
      cards: [
        { icon: 'server', title: 'Separate infrastructure', body: 'Temporal requires a cluster. Inngest needs their cloud or a self-hosted server. You\'re adding another service to manage, monitor, and pay for — before you write a single workflow.' },
        { icon: 'book-open', title: 'New programming model', body: 'Temporal has activities, workflows, signals, and queries. Inngest has step.run, step.sleep, step.sendEvent. Each comes with its own SDK, its own patterns, its own testing story.' },
        { icon: 'lock', title: 'Vendor lock-in', body: 'Your workflow logic is coupled to the engine. Switching from Inngest to Temporal means rewriting everything. Your business logic lives inside their SDK.' },
      ],
      below: {
        type: 'note',
        icon: 'zap',
        title: 'Pikku takes a different approach.',
        body: 'Your workflows use the same functions you already have, run on your existing infrastructure, and persist state to any storage backend. No new service. No new SDK. No lock-in.',
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'How It Compares',
      h2: 'Pikku vs the _alternatives_',
      lead: 'Temporal, Inngest, and Mastra are excellent tools. Pikku\'s advantage is that workflows use the same functions and infrastructure you already have, with no separate service.',
      variant: 'alt',
      columns: 3,
      cards: [
        { title: 'Setup', body: 'Pikku: your existing app. Temporal: separate cluster + workers. Inngest: cloud service or self-host. Mastra: your existing app.' },
        { title: 'Function reuse', body: 'Pikku: same Pikku functions. Temporal: wrap in activities. Inngest: inline or import. Mastra: inline or import.' },
        { title: 'State persistence', body: 'Pikku: any storage backend. Temporal: Temporal server. Inngest: Inngest cloud. Mastra: in-memory or custom.' },
        { title: 'TypeScript-native', body: 'Pikku: yes, plain TypeScript. Temporal: SDK with decorators. Inngest: yes. Mastra: yes.' },
        { title: 'Graph workflows', body: 'Pikku: built-in DAGs. Temporal: manual orchestration. Inngest: fan-out only. Mastra: built-in step graphs.' },
        { title: 'AI agent integration', body: 'Pikku: same framework. Temporal: separate concern. Inngest: separate concern. Mastra: same framework.' },
      ],
    },

    {
      component: 'feature-grid',
      eyebrow: 'Use Cases',
      h2: 'What you can _build_',
      lead: 'Each step is a regular Pikku function — the same ones you use for HTTP, queues, and everything else.',
      variant: 'default',
      columns: 2,
      cards: [
        { icon: 'user-plus', title: 'User onboarding', body: 'createProfile → addToCRM → sleep(5min) → sendWelcomeEmail' },
        { icon: 'credit-card', title: 'Payment processing', body: 'createCharge → waitForWebhook → generateInvoice → sendReceipt' },
        { icon: 'file-text', title: 'Content pipeline', body: 'generateDraft → humanReview → publishPost → notifySubscribers' },
        { icon: 'database', title: 'Data migration', body: 'exportFromSource → transformRecords → importToTarget → verifyIntegrity' },
      ],
    },

    {
      component: 'wide-code',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Define steps with _defineWorkflow_',
      lead: 'Each step in a defineWorkflow is a durable unit. Steps can read prior results via ctx.steps. All results are cached for deterministic replay.',
      variant: 'default',
      code: { filename: 'checkout.workflow.ts', icon: 'workflow', code: basicsCode, snippetKey: 'checkoutWorkflow' },
      below: {
        type: 'check-list',
        items: [
          { title: 'Deterministic replay', body: 'Completed steps are never re-executed. Results are cached and replayed on recovery.' },
          { title: 'Step context', body: 'Each step receives ctx.steps with the results of all previous steps — fully typed.' },
          { title: 'Typed I/O', body: 'Workflow input and output are fully typed via Zod schemas on input and output fields.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Step Types',
      h2: 'Four step _primitives_',
      lead: 'Every workflow is built from these four building blocks.',
      variant: 'alt',
      columns: 2,
      cards: [
        { icon: 'zap', title: 'workflow.do(name, rpcName, data, options?)', body: 'Execute a Pikku function as a queue job. Supports retries and retry delay.', mono: true },
        { icon: 'layers', title: 'workflow.do(name, async () => value)', body: 'Inline step — runs immediately, result cached for replay. Great for transformations.', mono: true },
        { icon: 'clock', title: 'workflow.sleep(name, duration)', body: 'Durable sleep. Survives restarts — the workflow resumes after the duration.', mono: true },
        { icon: 'pause', title: 'workflow.suspend(reason)', body: 'Pause the workflow until explicitly resumed. For human-in-the-loop approval flows.', mono: true },
      ],
    },

    {
      component: 'wide-code',
      eyebrow: 'Patterns',
      h2: 'Fan-out, retry, _branch_',
      lead: 'Use standard TypeScript for control flow. Promise.all for parallelism. if/else for branching. Retries via step options.',
      variant: 'default',
      code: { filename: 'workflow-patterns.ts', icon: 'workflow', code: patternsCode, snippetKey: 'workflowPatterns' },
    },

    {
      component: 'two-col',
      eyebrow: 'Graph Workflows',
      h2: 'Declarative _DAGs_',
      lead: 'For node-based workflows, use pikkuWorkflowGraph. Define nodes, edges, and input mappings — Pikku handles execution order and parallelism.',
      variant: 'alt',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'onboarding.graph.ts', badge: 'graph', icon: 'workflow', code: graphCode, snippetKey: 'workflowPatterns' },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'git-branch', title: 'Branching', body: 'Use graph.branch(\'key\') inside a node to select which edge to follow. Record-based next config maps keys to nodes.' },
          { icon: 'refresh-cw', title: 'ref() for data flow', body: 'Use ref(\'nodeId\', \'path\') to reference output from previous nodes — resolved at runtime.' },
        ],
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'HTTP Wiring',
      h2: 'Start, poll, _resume_',
      lead: 'Pikku provides helper functions to wire workflows to HTTP endpoints — start, run to completion, or poll status.',
      variant: 'default',
      code: { filename: 'workflow.wiring.ts', icon: 'workflow', code: httpCode, snippetKey: 'workflowHTTPWiring' },
    },

    {
      component: 'cta',
      h2: 'Start wiring workflows in 5 minutes',
      lead: 'One command to scaffold a project with workflow wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the Workflow Docs', to: '/docs/wiring/workflows', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · DSL & graph workflows',
    },
  ],
};

export default function WorkflowWirePage() {
  return <FeaturePage data={page} />;
}
