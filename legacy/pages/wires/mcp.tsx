import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const toolCode = snippets.mcpSingleTool;

const resourceCode = snippets.mcpResource;

const promptCode = snippets.mcpPrompt;

const wireObjectCode = snippets.mcpWireObject;

const page: PageData = {
  meta: {
    title: 'MCP Wire — Pikku',
    description: 'Expose your Pikku functions to AI models via the Model Context Protocol — tools, resources, and prompts with typed parameters.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: MCP',
      h1: 'AI tools,\n_same functions._',
      lead: 'Add mcp: true to any Pikku function and it becomes an MCP tool. Resources and prompts use dedicated function types — all exposed automatically via the Model Context Protocol.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/mcp', primary: true },
        { label: 'See the Code', to: '#tools', primary: false },
      ],
      right: { type: 'wire-icon', name: 'mcp' },
    },

    {
      component: 'wide-code',
      id: 'tools',
      eyebrow: 'Three Primitives',
      h2: 'Tools, resources, _prompts_',
      lead: 'MCP defines three primitives for AI integration. Pikku exposes your functions automatically — no wiring code needed.',
      variant: 'default',
      code: { filename: 'todo.functions.ts', badge: 'mcp: true', icon: 'mcp', code: toolCode, snippetKey: 'mcpSingleTool' },
    },

    {
      component: 'wide-code',
      variant: 'alt',
      code: { filename: 'mcp.functions.ts', badge: 'pikkuMCPResourceFunc', icon: 'mcp', code: resourceCode, snippetKey: 'mcpResource' },
      below: {
        type: 'note',
        icon: 'file-text',
        title: 'Resources.',
        body: 'Data the AI can read. URI templates map to typed function parameters — the AI can request specific resources by URI.',
      },
    },

    {
      component: 'wide-code',
      variant: 'default',
      code: { filename: 'mcp.functions.ts', badge: 'pikkuMCPPromptFunc', icon: 'mcp', code: promptCode, snippetKey: 'mcpPrompt' },
      below: {
        type: 'note',
        icon: 'message-square',
        title: 'Prompts.',
        body: 'Prompt templates the AI can use. Return structured message arrays — the AI incorporates them into its context.',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Wire Object',
      h2: 'Dynamic control _at runtime_',
      lead: 'Every MCP function gets a wire.mcp object to notify resource changes and toggle capabilities.',
      variant: 'alt',
      left: {
        type: 'cards',
        cards: [
          { icon: 'zap', title: 'sendResourceUpdated(uri)', body: 'Notify the AI that a resource changed — it can re-read it to get fresh data.', mono: true },
          { icon: 'wrench', title: 'enableTools / enableResources / enablePrompts', body: 'Dynamically show or hide capabilities based on context. Pass a map of names to booleans.', mono: true },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'mcp.functions.ts', icon: 'mcp', code: wireObjectCode, snippetKey: 'mcpWireObject' },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Real-World Example',
      h2: 'Shop catalogue _as MCP tools_',
      lead: 'From the online shop template — the same functions wired to HTTP routes also exposed as MCP tools with wireMCPTool. One function, every protocol.',
      variant: 'default',
      code: { filename: 'shop.mcp.ts', icon: 'mcp', code: snippets.mcpTools, snippetKey: 'mcpTools' },
    },

    {
      component: 'cta',
      h2: 'Start wiring MCP in 5 minutes',
      lead: 'One command to scaffold a project with MCP wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the MCP Docs', to: '/docs/wiring/mcp', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Tools, Resources & Prompts',
    },
  ],
};

export default function MCPWirePage() {
  return <FeaturePage data={page} />;
}
