import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsCode = snippets.aiAgent;

const dynamicWorkflowCode = snippets.aiAgentDynamic;

const invokeCode = snippets.aiAgentInvoke;

const streamCode = snippets.aiAgentStream;

const page: PageData = {
  meta: {
    title: 'AI Agent Wire — Pikku',
    description: 'TypeScript AI agent framework — build AI agents with your existing functions as tools. No schema duplication, built-in auth, streaming, and multi-agent delegation.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: AI Agent',
      h1: 'AI agents,\n_same functions._',
      lead: 'pikkuAIAgent turns your Pikku functions into AI agent tools — with memory, streaming, tool approval, and multi-agent delegation.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/ai-agents', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'bot' },
    },

    {
      component: 'feature-grid',
      eyebrow: 'The Problem',
      h2: 'Building AI agents today is _broken_',
      lead: 'Existing frameworks force you to re-describe your functions, handle auth yourself, and learn an entirely new paradigm.',
      variant: 'default',
      columns: 3,
      cards: [
        { icon: 'refresh-cw', title: 'Schema duplication', body: 'With Vercel AI SDK or LangChain, you redefine your function\'s schema as a tool — a separate z.object() definition disconnected from your actual function. Two sources of truth that inevitably drift.' },
        { icon: 'lock', title: 'Auth is an afterthought', body: 'Agent frameworks don\'t handle auth. Your agent can call tools, but who is the user? What can they access? You end up bolting on authorization checks per-tool, with no shared context.' },
        { icon: 'alert-triangle', title: 'New framework, new paradigm', body: 'Want agents? Learn a whole new SDK — LangChain\'s chains/agents/tools, Vercel AI SDK\'s tool() API. Your existing backend functions can\'t be reused. You\'re starting over.' },
      ],
    },

    {
      component: 'feature-grid',
      eyebrow: 'How It Compares',
      h2: 'Pikku vs the _alternatives_',
      lead: 'Vercel AI SDK, Mastra, and LangChain are excellent tools. Pikku\'s edge is simple: your functions are already tools — no translation layer needed.',
      variant: 'alt',
      columns: 3,
      cards: [
        { icon: 'wrench', title: 'Tool definition', body: 'Pikku: your existing functions. Vercel AI SDK: redefine with z.object(). Mastra: createTool() with z.object(). LangChain: wrap in DynamicTool.' },
        { icon: 'shield-check', title: 'Auth & permissions', body: 'Pikku: inherited from the function. Vercel AI SDK: manual per-tool. Mastra: manual per-tool. LangChain: manual per-tool.' },
        { icon: 'layers', title: 'Workflows', body: 'Pikku: built-in durable workflows. Vercel AI SDK: separate concern. Mastra: built-in step graphs. LangChain: LangGraph (separate library).' },
      ],
    },

    {
      component: 'feature-grid',
      eyebrow: 'Use Cases',
      h2: 'What you can _build_',
      lead: 'Every function you\'ve already written is an agent tool waiting to happen.',
      variant: 'default',
      columns: 2,
      cards: [
        { icon: 'headphones', title: 'Customer support agent', body: 'Resolve tickets, look up orders, and escalate — all using functions you already have. Tools: getCustomer, getOrders, createTicket.' },
        { icon: 'bar-chart-3', title: 'Data analyst agent', body: 'Query data, generate charts, and export reports on demand. Tools: queryDatabase, generateChart, exportCSV.' },
        { icon: 'settings', title: 'Admin / ops agent', body: 'Monitor services, scale infrastructure, and deploy — with tool approval for safety. Tools: getMetrics, scaleService, deployVersion.' },
        { icon: 'pen-tool', title: 'Content agent', body: 'Draft, review, and publish content through your existing content pipeline. Tools: generateDraft, checkGrammar, publishPost.' },
      ],
    },

    {
      component: 'wide-code',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Define an _agent_',
      lead: 'Give it a name, instructions, a model, and your Pikku functions as tools. The agent calls them automatically.',
      variant: 'default',
      code: { filename: 'agent.functions.ts', icon: 'bot', code: basicsCode, snippetKey: 'aiAgent' },
      below: {
        type: 'check-list',
        items: [
          { title: 'Functions as tools', body: 'Your existing Pikku functions become agent tools — no adapter code needed.' },
          { title: 'Any LLM provider', body: 'model: "openai/gpt-4o", "anthropic/claude-3-5-sonnet" — use provider/model format.' },
          { title: 'Conversation memory', body: 'Built-in thread-based message storage with configurable context window.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Features',
      h2: 'Streaming, memory, _approval_',
      lead: 'Everything you need to build production AI agents — built into the framework.',
      variant: 'alt',
      columns: 3,
      cards: [
        { icon: 'message-square', title: 'Streaming', body: 'Real-time text deltas, tool calls, and results via channel events. Show progress as the agent works.' },
        { icon: 'database', title: 'Memory', body: 'Thread-based conversation history, configurable context window, and optional working memory for persistent state.' },
        { icon: 'shield-check', title: 'Tool approval', body: 'Require human approval before executing sensitive tools. The agent suspends and waits for your decision.' },
        { icon: 'brain', title: 'Multi-agent', body: 'Agents can delegate to sub-agents. Each sub-agent gets its own session and tools.' },
        { icon: 'wrench', title: 'Structured output', body: 'Define an output schema and the agent returns validated JSON — not just free-text responses.' },
        { icon: 'layers', title: 'AI middleware', body: 'Hook into modifyInput, modifyOutput, and modifyOutputStream to transform agent behavior.' },
      ],
    },

    {
      component: 'two-col',
      eyebrow: 'Dynamic Workflows',
      h2: 'Agents that _build workflows_',
      lead: 'Other frameworks let AI call tools in a loop — burning tokens every time. Pikku agents design actual workflow graphs that run natively after the first pass.',
      variant: 'default',
      columns: '1fr 1fr',
      left: {
        type: 'cards',
        cards: [
          { icon: 'sparkles', title: 'AI designs the workflow', body: 'The agent analyses your request and creates a workflow graph using your existing functions as steps. It proposes the workflow and waits for approval.' },
          { icon: 'play', title: 'Runs natively — no AI', body: 'Once approved, the workflow executes as a real durable workflow. No LLM in the loop. No token cost. Full retry, sleep, and replay guarantees.' },
          { icon: 'code-2', title: 'Promote to code', body: 'Use graph-to-dsl to pull runtime workflows into your codebase as real TypeScript. Version control, code review, and CI/CD — like any other code.' },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'ops-agent.ts', badge: "dynamicWorkflows: 'write'", icon: 'bot', code: dynamicWorkflowCode, snippetKey: 'aiAgentDynamic' },
      },
      below: {
        type: 'note',
        icon: 'zap',
        title: 'Why this matters:',
        body: 'Every other agent framework re-runs the full AI loop on repeat tasks. Pikku saves the workflow — so the second run costs zero tokens, has zero AI latency, and has zero security surface from LLM decisions.',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Invocation',
      h2: 'Run or _stream_',
      lead: 'Two execution modes: get the full result at once, or stream events in real time as the agent thinks and acts.',
      variant: 'alt',
      left: {
        type: 'code',
        code: { filename: 'run.ts', badge: 'non-streaming', icon: 'bot', code: invokeCode, snippetKey: 'aiAgentInvoke' },
      },
      right: {
        type: 'code',
        code: { filename: 'stream.ts', badge: 'streaming', icon: 'bot', code: streamCode, snippetKey: 'aiAgentStream' },
      },
    },

    {
      component: 'cta',
      h2: 'Start building AI agents in 5 minutes',
      lead: 'One command to scaffold a project with AI agent wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the AI Agent Docs', to: '/docs/wiring/ai-agents', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Works with OpenAI, Anthropic & more',
    },
  ],
};

export default function AIAgentWirePage() {
  return <FeaturePage data={page} />;
}
