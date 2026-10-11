import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsCode = snippets.cliWiring;

const basicsUsage = snippets.cliUsage;

const subcommandsCode = snippets.cliSubcommands;

const rendererCode = snippets.cliRenderer;

const page: PageData = {
  meta: {
    title: 'CLI Wire — Pikku',
    description: 'Wire your Pikku functions to CLI commands with typed parameters, subcommands, custom renderers, and local or remote execution.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: CLI',
      h1: 'CLI tools,\n_same functions._',
      lead: 'wireCLI turns your Pikku functions into type-safe CLI commands with automatic argument parsing, subcommands, and custom renderers.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/cli/local-cli', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'cli' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Function to _command_',
      lead: 'Wire your functions to CLI commands with typed parameters, options, and auto-generated help.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'cli.wiring.ts', badge: 'wiring.ts', icon: 'cli', code: basicsCode, snippetKey: 'cliWiring' },
      },
      right: {
        type: 'code',
        code: { filename: 'Terminal', badge: 'output', language: 'bash', code: basicsUsage, snippetKey: 'cliUsage' },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Typed parameters', body: '<required> [optional] [variadic...] — parsed and validated automatically.' },
          { title: 'Options & flags', body: 'Long flags, short aliases, defaults, choices — all from a plain config object.' },
          { title: 'Auto help generation', body: '--help is generated from your descriptions — no manual maintenance.' },
        ],
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Subcommands',
      h2: 'Nested _command trees_',
      lead: 'Group related commands under namespaces. Global options cascade down to every subcommand.',
      variant: 'alt',
      code: { filename: 'cli.wiring.ts', icon: 'cli', code: subcommandsCode, snippetKey: 'cliSubcommands' },
      below: {
        type: 'note',
        icon: 'git-branch',
        title: 'Compose across files.',
        body: 'Use defineCLICommands() to define command groups in separate files, then import and compose them in one wireCLI call.',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Renderers',
      h2: 'Custom _output formatting_',
      lead: 'Separate your display logic from your business logic. Each command gets a typed renderer that formats the function\'s output.',
      variant: 'default',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'renderers.ts', icon: 'cli', code: rendererCode, snippetKey: 'cliRenderer' },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'paintbrush', title: 'Typed from output', body: 'pikkuCLIRender<T> is typed from your function\'s return type — the data parameter is fully autocompleted.' },
          { icon: 'layers', title: 'Cascading fallback', body: 'Set a default renderer on the program. Override per-command. Commands without a custom renderer use the fallback.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Execution Modes',
      h2: 'Local or _remote_',
      lead: 'Same wireCLI config generates both a local executable and a remote client that connects over WebSocket.',
      variant: 'alt',
      columns: 2,
      cards: [
        { icon: 'terminal', title: 'Local CLI', body: 'Runs in-process. Direct access to all services — databases, caches, file system. Best for dev tools and admin scripts.' },
        { icon: 'wifi', title: 'Remote CLI', body: 'Connects over WebSocket to your server. Same commands, but execution happens server-side. Best for production admin tools.' },
      ],
      below: {
        type: 'note',
        icon: 'arrow-right',
        title: 'Same commands, different execution.',
        body: 'Local CLI runs functions directly. Remote CLI sends the parsed command over WebSocket and streams back the rendered output.',
      },
    },

    {
      component: 'cta',
      h2: 'Start wiring CLI tools in 5 minutes',
      lead: 'One command to scaffold a project with CLI wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the CLI Docs', to: '/docs/wiring/cli/local-cli', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Local & remote execution modes',
    },
  ],
};

export default function CLIWirePage() {
  return <FeaturePage data={page} />;
}
