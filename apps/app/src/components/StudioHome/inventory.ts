/** The verified inventory for the homepage. `lead` items are shown first; the rest sit in a disclosure. `to` only where a docs page exists. */
export type Kind = 'core' | 'addon'
export type Item = { name: string; kind: Kind; desc: string; to?: string }
export type Group = { title: string; lead: Item[]; more: Item[] }

export const BACKEND: Group[] = [
  {
    title: 'Data',
    lead: [
      { name: 'Declared tables', kind: 'core', desc: 'One TypeScript declaration generates migrations and types for SQLite, Postgres or MySQL' },
      { name: 'SQL databases', kind: 'addon', to: '/docs/storage/kysely', desc: 'Kysely on SQLite (Node, Bun, libSQL, Turso, D1), Postgres or MySQL' },
    ],
    more: [
      { name: 'File storage', kind: 'core', to: '/docs/api/content-service', desc: 'Signed upload and download URLs, on local disk, S3 or Backblaze B2' },
      { name: 'State stores', kind: 'addon', to: '/docs/storage', desc: 'Workflow state, sessions and secrets in SQL, Redis or MongoDB; audit in SQL' },
      { name: 'Variables', kind: 'core', to: '/docs/core-features/variables', desc: 'Typed configuration values your app reads at runtime' },
      { name: 'Knowledge notes', kind: 'addon', to: '/docs/core-features/knowledge', desc: "Markdown notes that describe the app in its users' words" },
    ],
  },
  {
    title: 'Users and access',
    lead: [
      { name: 'Sessions', kind: 'core', to: '/docs/core-features/user-sessions', desc: 'Cookie, JWT or API-key auth, resolved before your function runs' },
      { name: 'Roles and permissions', kind: 'core', to: '/docs/core-features/permission-guards', desc: 'Roles, scopes and permission guards checked before the function body' },
    ],
    more: [
      { name: 'Secrets', kind: 'core', to: '/docs/core-features/secrets', desc: 'Typed secrets, read where services are built, never inside functions' },
      { name: 'Better Auth', kind: 'addon', to: '/docs/middleware/better-auth', desc: 'Sign-in through Better Auth, with sessions and scopes' },
      { name: 'Credentials and OAuth2', kind: 'core', to: '/docs/wiring/credentials', desc: 'Per-user and platform credentials, with OAuth2 tokens managed for you' },
      { name: 'Rate limits', kind: 'core', desc: 'Per-caller limits on HTTP routes and MCP calls' },
      { name: 'Admin', kind: 'addon', to: '/docs/addon/shipped-addons', desc: 'User directory, roles, scopes, credentials and audit trail, as ordinary RPCs' },
    ],
  },
  {
    title: 'Background work',
    lead: [
      { name: 'Queues', kind: 'core', to: '/docs/wiring/queue', desc: 'In-memory, BullMQ, pg-boss, NATS, SQS, Cloudflare or Azure' },
      { name: 'Workflows', kind: 'core', to: '/docs/wiring/workflows', desc: 'Durable steps that resume from cached results, given a persistent store' },
    ],
    more: [
      { name: 'Cron', kind: 'core', to: '/docs/wiring/scheduled-tasks', desc: 'Scheduled functions that take no input' },
      { name: 'Queue service', kind: 'core', to: '/docs/wiring/queue/client', desc: 'Add jobs and check their status from any function' },
      { name: 'Delayed calls', kind: 'core', to: '/docs/api/scheduler-service', desc: 'One-off function calls at a later time, on server runtimes' },
      { name: 'Graph workflows', kind: 'core', to: '/docs/wiring/workflows/graph-workflows', desc: 'Node-based workflow definitions, importable from n8n exports' },
      { name: 'Triggers', kind: 'core', to: '/docs/wiring/triggers', desc: 'Subscriptions to external events that call your functions' },
      { name: 'Outgoing webhooks', kind: 'core', to: '/docs/api/webhook-service', desc: 'Signed webhooks, delivered through a queue' },
      { name: 'Event hub', kind: 'core', to: '/docs/api/event-hub', desc: 'Publish and subscribe for real-time messages' },
      { name: 'Email', kind: 'core', to: '/docs/api/email-service', desc: 'One interface for text, HTML or templated email; logged, not sent, in dev' },
    ],
  },
  {
    title: 'AI and messaging',
    lead: [
      { name: 'AI agents', kind: 'core', to: '/docs/wiring/ai-agents', desc: 'Agents that use your functions as tools, with memory and streaming' },
      { name: 'MCP', kind: 'core', to: '/docs/wiring/mcp', desc: 'Your functions as MCP tools, plus resources and prompts' },
    ],
    more: [
      { name: 'Voice', kind: 'addon', desc: 'Browser microphone, silence detection and playback for agent conversations' },
      { name: 'Browser automation', kind: 'addon', to: '/docs/api/browser-service', desc: 'Warm, reusable browser sessions through puppeteer, on server runtimes' },
      { name: 'Slack', kind: 'addon', to: '/docs/wiring/gateway/slack', desc: 'Slack events, OAuth and slash commands, wired to your functions' },
    ],
  },
  {
    title: 'Operate',
    lead: [
      { name: 'Telemetry', kind: 'core', desc: 'OTLP traces, logs and process metrics from pikku serve and standalone builds' },
      { name: 'Audit', kind: 'core', to: '/docs/api/audit-service', desc: 'Per-function audit events, with identity filled in for you' },
    ],
    more: [
      { name: 'Tests and scenarios', kind: 'core', to: '/docs/core-features/testing', desc: 'Unit tests that call functions directly; scenarios that double as end-to-end tests' },
      { name: 'Logging', kind: 'core', to: '/docs/api/logger', desc: 'Structured logger in every function and service; console or Pino' },
      { name: 'Analytics', kind: 'core', to: '/docs/core-features/analytics', desc: 'Typed product events, sent to the sinks you add' },
      { name: 'Feature flags', kind: 'core', to: '/docs/core-features/feature-flags', desc: 'Flags resolved per caller, gating functions and readable from the frontend' },
      { name: 'Errors', kind: 'core', to: '/docs/core-features/errors', desc: 'Typed errors mapped to HTTP status codes' },
      { name: 'Versioning', kind: 'core', to: '/docs/core-features/versioning', desc: 'Function versions, with breaking contract changes detected' },
      { name: 'Virtual users', kind: 'core', to: '/docs/core-features/virtual-users', desc: 'AI personas that use your running app and report what went wrong' },
    ],
  },
  {
    title: 'Ship and extend',
    lead: [
      { name: 'Server runtimes', kind: 'addon', to: '/docs/runtimes', desc: 'Express, Fastify, Bun, Node HTTP, uWebSockets, Next.js or TanStack Start' },
      { name: 'Deploy', kind: 'addon', to: '/docs/deploy', desc: 'Cloudflare Workers, AWS Lambda (beta), Azure Functions (beta), planned before applied' },
    ],
    more: [
      { name: 'Standalone build', kind: 'addon', to: '/docs/deploy', desc: 'One Node bundle or compiled Bun binary that runs its own migrations' },
      { name: 'Addons', kind: 'addon', to: '/docs/addon', desc: 'The first-party admin and graph addons' },
      { name: 'Addons from OpenAPI', kind: 'core', to: '/docs/addon/creating', desc: "Generate an addon's functions from an OpenAPI spec" },
      { name: 'Remote addons', kind: 'core', desc: "Call another Pikku app's remote functions as an addon" },
      { name: 'Custom runtimes', kind: 'core', to: '/docs/custom-runtimes', desc: 'Bring your own HTTP, queue, scheduler or MCP host; WebSocket hosts are a work in progress' },
    ],
  },
]

export const FRONTEND: Group[] = [
  {
    title: 'Calling the backend',
    lead: [
      { name: 'RPC client', kind: 'core', to: '/docs/wiring/rpcs/external', desc: 'Call exposed functions by name, typed end to end' },
      { name: 'Fetch client', kind: 'addon', to: '/docs/wiring/http/fetch-client', desc: 'Typed client generated from your HTTP routes' },
    ],
    more: [
      { name: 'WebSocket client', kind: 'addon', to: '/docs/wiring/channels/websocket-client', desc: 'Typed client for your channels' },
      { name: 'Server-sent events', kind: 'core', to: '/docs/wiring/http/server-sent-events', desc: 'Stream updates from a function to the browser' },
      { name: 'OpenAPI', kind: 'core', to: '/docs/wiring/http/openapi', desc: 'A spec generated from your HTTP routes' },
    ],
  },
  {
    title: 'React and UI',
    lead: [
      { name: 'React', kind: 'addon', to: '/docs/frontend/react', desc: 'Provider and hooks for RPC, realtime, agents, workflows, flags and analytics' },
      { name: 'React Query hooks', kind: 'core', to: '/docs/wiring/rpcs/react-query', desc: 'Generated typed queries, mutations and infinite queries' },
    ],
    more: [
      { name: 'Agent chat UI', kind: 'addon', to: '/docs/wiring/ai-agents', desc: 'assistant-ui bindings for your agents, with approvals' },
      { name: 'Workflow graph', kind: 'addon', desc: 'Render a workflow as an interactive graph' },
      { name: 'i18n', kind: 'addon', to: '/docs/frontend/i18n', desc: 'Translated strings, locale selection and RTL, through Paraglide' },
    ],
  },
  {
    title: 'Apps and tools',
    lead: [
      { name: 'Desktop and mobile', kind: 'core', to: '/docs/deploy/native-apps', desc: 'Package a frontend for desktop, Android or iOS with Tauri; builds are unsigned' },
      { name: 'Remote CLI', kind: 'core', to: '/docs/wiring/cli/remote-cli', desc: 'Run your CLI commands against a running app, over WebSocket' },
    ],
    more: [],
  },
]
