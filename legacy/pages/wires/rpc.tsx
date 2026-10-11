import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsCode = snippets.rpcInternalCall;

const exposeCode = snippets.rpcFunc;

const clientCode = snippets.rpcClient;

const page: PageData = {
  meta: {
    title: 'RPC Wire — Pikku',
    description: 'Call Pikku functions from other functions with type-safe RPC — internal, remote, and exposed, with session inheritance and depth tracking.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: RPC',
      h1: 'Function-to-function,\n_fully typed._',
      lead: 'rpc.invoke lets your Pikku functions call each other — with session inheritance, depth tracking, and type-safe inputs and outputs.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/rpcs', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'rpc' },
    },

    {
      component: 'wide-code',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Call any function from _any function_',
      lead: 'rpc.invoke() calls another Pikku function by name — fully typed, with session inheritance.',
      variant: 'default',
      code: { filename: 'order.functions.ts', icon: 'rpc', code: basicsCode, snippetKey: 'rpcInternalCall' },
      below: {
        type: 'check-list',
        items: [
          { title: 'Type-safe calls', body: 'Function name, input, and output are all inferred from your wirings.' },
          { title: 'Session inherited', body: "The caller's auth session propagates to the called function automatically." },
          { title: 'Depth tracked', body: 'rpc.depth increments on each call — built-in recursion protection.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'RPC Methods',
      h2: 'Four ways to _call_',
      lead: 'Internal, remote, exposed, or workflow — every call is type-safe and session-aware.',
      variant: 'alt',
      left: {
        type: 'cards',
        cards: [
          { icon: 'zap', title: 'rpc.invoke(name, data)', body: 'Call a function from within the same instance. Session inherited, depth tracked.', mono: true },
          { icon: 'globe', title: 'rpc.remote(name, data)', body: 'Call a function on another instance via DeploymentService. Session forwarded securely.', mono: true },
          { icon: 'lock', title: 'rpc.exposed(name, data)', body: 'Call any function with expose: true. Used by public HTTP RPC endpoints.', mono: true },
          { icon: 'git-branch', title: 'rpc.startWorkflow(name, input)', body: 'Start a workflow by name and get back a runId. Integrates with the workflow engine.', mono: true },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'rpc.wiring.ts', badge: 'expose: true', icon: 'rpc', code: exposeCode, snippetKey: 'rpcFunc' },
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Type-Safe Client',
      h2: 'Typed RPC from _the browser_',
      lead: 'Pikku generates a typed RPC client from your exposed functions. Invoke functions, start workflows, or call AI agents — all autocompleted.',
      variant: 'default',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'client.ts', badge: 'auto-generated types', code: clientCode, snippetKey: 'rpcClient' },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'shield-check', title: 'Generated from wirings', body: 'PikkuRPC is auto-generated with typed overloads for every exposed function, workflow, and AI agent.' },
          { icon: 'layers', title: 'Namespaced addons', body: 'Call addon functions with namespace prefixes: rpc.invoke(\'stripe:createCharge\', ...)' },
        ],
      },
    },

    {
      component: 'cta',
      h2: 'Start wiring RPC in 5 minutes',
      lead: 'One command to scaffold a project with RPC wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the RPC Docs', to: '/docs/wiring/rpcs', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Internal, remote & exposed RPC',
    },
  ],
};

export default function RPCWirePage() {
  return <FeaturePage data={page} />;
}
