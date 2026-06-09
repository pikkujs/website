import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const toolCode = `// Any Pikku function becomes an MCP tool with mcp: true
export const createTodo = pikkuFunc({
  description: 'Create a new todo item',
  input: CreateTodoInput,
  output: CreateTodoOutput,
  mcp: true, // ← That's it. Now it's an MCP tool.
  func: async ({ db }, { text, priority }) => {
    return await db.createTodo({ text, priority })
  },
})`;

const resourceCode = `// MCP resources use a dedicated function type
export const getTodo = pikkuMCPResourceFunc({
  uri: 'todos/{id}',
  title: 'Todo Details',
  description: 'Get a todo by ID',
  func: async ({ db }, { id }, { mcp }) => {
    const todo = await db.getTodo(id)
    return [{ uri: mcp.uri!, text: JSON.stringify(todo) }]
  },
})`;

const promptCode = `// MCP prompts use a dedicated function type
export const codeReview = pikkuMCPPromptFunc({
  name: 'codeReview',
  description: 'Generate a code review prompt',
  func: async ({}, { filePath, context }) => {
    return [{
      role: 'user',
      content: {
        type: 'text',
        text: \`Review \${filePath}. Context: \${context}\`
      }
    }]
  },
})`;

const wireObjectCode = `export const manageTodos = pikkuFunc({
  description: 'Manage todo items',
  input: ManageTodosInput,
  output: ManageTodosOutput,
  mcp: true,
  func: async ({ db }, { action, id }, { mcp }) => {
    if (action === 'delete') {
      await db.deleteTodo(id)

      // Notify AI that the resource changed
      mcp.sendResourceUpdated(\`todos/\${id}\`)

      // Dynamically enable/disable tools
      await mcp.enableTools({ archiveTodos: true })

      return { deleted: true }
    }
    // ...
  },
})`;

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
      code: { filename: 'todo.functions.ts', badge: 'mcp: true', icon: 'mcp', code: toolCode },
    },

    {
      component: 'wide-code',
      variant: 'alt',
      code: { filename: 'mcp.functions.ts', badge: 'pikkuMCPResourceFunc', icon: 'mcp', code: resourceCode },
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
      code: { filename: 'mcp.functions.ts', badge: 'pikkuMCPPromptFunc', icon: 'mcp', code: promptCode },
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
        code: { filename: 'mcp.functions.ts', icon: 'mcp', code: wireObjectCode },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Real-World Example',
      h2: 'Shop catalogue _as MCP tools_',
      lead: 'From the online shop template — the same functions wired to HTTP routes also exposed as MCP tools with wireMCPTool. One function, every protocol.',
      variant: 'default',
      code: { filename: 'shop.mcp.ts', icon: 'mcp', code: snippets.mcpTools },
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
