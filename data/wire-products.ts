export type WireProduct = {
  id: string;
  route: string;
  name: string;
  icon: string;
  label: string;
  headline: string;
  subheadline: string;
  description: string;
  outcomes: string[];
  capabilities: string[];
  defineCode: string;
  wireCode: string;
  docsPath: string;
  deploymentKey?: 'http' | 'websocket' | 'sse' | 'queue' | 'scheduled' | 'rpc' | 'mcp';
};

export const wireProducts: WireProduct[] = [
  {
    id: 'http',
    route: '/http',
    name: 'HTTP',
    icon: 'http',
    label: 'API Surface',
    headline: 'Turn functions into production HTTP APIs.',
    subheadline: 'Typed contracts, shared auth/middleware, and portable deployment.',
    description:
      'Use the same function model for public APIs, internal APIs, and partner endpoints. Pikku maps input contracts, permissions, and runtime wiring from one source of truth.',
    outcomes: [
      'Ship new API routes without duplicating business logic.',
      'Keep auth and permission checks consistent with non-HTTP surfaces.',
      'Generate contract-ready metadata from static inspection.',
    ],
    capabilities: [
      'Route mapping with typed params and bodies',
      'Shared middleware and permission filters',
      'OpenAPI-friendly metadata from functions',
      'Portable across middleware, serverless, and edge runtimes',
    ],
    defineCode: `export const createInvoice = pikkuFunc({
  permissions: { account: 'billing:write' },
  middleware: [requireAuth, auditRequest],
  func: async ({ billing }, input) => billing.createInvoice(input),
})`,
    wireCode: `wireHTTP({
  method: 'post',
  route: '/accounts/:accountId/invoices',
  func: createInvoice,
})`,
    docsPath: '/docs/wiring/http',
    deploymentKey: 'http',
  },
  {
    id: 'websocket',
    route: '/websocket',
    name: 'WebSocket',
    icon: 'websocket',
    label: 'Realtime Surface',
    headline: 'Drive realtime systems from the same functions.',
    subheadline: 'Sessions, auth, and function invocation over persistent connections.',
    description:
      'Model realtime events with channel wiring while keeping permissions and domain logic in core functions. Move between infra options without rewrites.',
    outcomes: [
      'Reuse existing business functions for realtime actions.',
      'Keep channel-level auth and permissions explicit.',
      'Deploy realtime logic on server or serverless adapters.',
    ],
    capabilities: [
      'Typed channel actions and payloads',
      'Shared middleware with HTTP and jobs',
      'Connection-aware permission enforcement',
      'Portable websocket runtime adapters',
    ],
    defineCode: `export const sendMessage = pikkuFunc({
  permissions: { room: 'chat:write' },
  func: async ({ chat }, input) => chat.sendMessage(input),
})`,
    wireCode: `wireChannel({
  name: 'chat',
  onMessageWiring: {
    action: { sendMessage },
  },
})`,
    docsPath: '/docs/wiring/channels',
    deploymentKey: 'websocket',
  },
  {
    id: 'workflows',
    route: '/workflows',
    name: 'Workflows',
    icon: 'queue',
    label: 'Orchestration Surface',
    headline: 'Compose durable workflows from production functions.',
    subheadline: 'Step orchestration with retries, waits, replay, and conflict handling.',
    description:
      'Use the same function inventory as workflow steps. Pikku keeps steps deterministic, inspectable, and resumable while preserving permission boundaries.',
    outcomes: [
      'Build long-running flows without rebuilding your domain layer.',
      'Replay and recover steps after failures.',
      'Resolve conflicts with explicit workflow control points.',
    ],
    capabilities: [
      'Function-backed workflow steps',
      'Sleep/wait support for delayed processes',
      'Retry and replay-friendly orchestration',
      'Shared policy model across workflows and APIs',
    ],
    defineCode: `export const createInvoice = pikkuFunc({
  func: async ({ billing }, input) => billing.createInvoice(input),
})`,
    wireCode: `const result = await workflow.do(
  'Generate invoice',
  'createInvoice',
  { accountId, period },
)`,
    docsPath: '/docs/wiring/workflows',
  },
  {
    id: 'scheduled',
    route: '/scheduled',
    name: 'Scheduled Tasks',
    icon: 'cron',
    label: 'Automation Surface',
    headline: 'Run scheduled automation with function-grade guarantees.',
    subheadline: 'Cron scheduling backed by the same policy and service model.',
    description:
      'Attach time-based triggers to production functions to automate billing runs, sync jobs, and lifecycle tasks.',
    outcomes: [
      'Add cron automation without separate worker codebases.',
      'Apply identical auth/permission/middleware policy models.',
      'Inspect schedules and dependencies in one inventory.',
    ],
    capabilities: [
      'Cron expression scheduling',
      'Shared services and middleware',
      'Portable scheduler deployment',
      'Inspector-visible trigger metadata',
    ],
    defineCode: `export const runMonthlyBilling = pikkuFunc({
  func: async ({ billing }) => billing.runMonthlyBilling(),
})`,
    wireCode: `wireScheduler({
  cron: '0 2 1 * *',
  func: runMonthlyBilling,
})`,
    docsPath: '/docs/wiring/scheduled-tasks',
    deploymentKey: 'scheduled',
  },
  {
    id: 'queues',
    route: '/queues',
    name: 'Queues',
    icon: 'queue',
    label: 'Async Surface',
    headline: 'Process background jobs with the same function core.',
    subheadline: 'Queue workers that keep business logic and policy in one place.',
    description:
      'Use queue infrastructure for async and bursty workloads without creating a parallel backend model.',
    outcomes: [
      'Scale heavy workloads independently from APIs.',
      'Reuse validated domain functions in workers.',
      'Switch queue backends with minimal app-level changes.',
    ],
    capabilities: [
      'Queue worker wiring to functions',
      'Concurrency and retry controls',
      'Shared service injection',
      'Cross-runtime queue adapters',
    ],
    defineCode: `export const processInvoice = pikkuFunc({
  func: async ({ billing }, input) => billing.processInvoice(input),
})`,
    wireCode: `wireQueueWorker({
  queue: 'invoice-processing',
  func: processInvoice,
  concurrency: 10,
})`,
    docsPath: '/docs/wiring/queue',
    deploymentKey: 'queue',
  },
  {
    id: 'rpc',
    route: '/rpc',
    name: 'RPC',
    icon: 'rpc',
    label: 'Service Surface',
    headline: 'Invoke backend functions internally with typed RPC.',
    subheadline: 'Service-to-service communication on the same function contract.',
    description:
      'Use RPC wiring to orchestrate internal service calls while keeping type safety and policy boundaries intact.',
    outcomes: [
      'Reduce integration glue between internal services.',
      'Retain function-level typing across calls.',
      'Keep invocation and ownership visible in one graph.',
    ],
    capabilities: [
      'Typed function invocation',
      'Shared authorization semantics',
      'Service boundary visibility',
      'Portable runtime adapters',
    ],
    defineCode: `export const getInvoice = pikkuFunc({
  func: async ({ billing }, { invoiceId }) => billing.get(invoiceId),
})`,
    wireCode: `const invoice = await rpc.invoke('getInvoice', {
  invoiceId: 'inv_123',
})`,
    docsPath: '/docs/wiring/rpcs',
    deploymentKey: 'rpc',
  },
  {
    id: 'mcp',
    route: '/mcp',
    name: 'MCP',
    icon: 'mcp',
    label: 'Agent Surface',
    headline: 'Expose backend functions as safe agent tools.',
    subheadline: 'Use production functions in AI systems with scoped permissions.',
    description:
      'Publish typed, permission-aware tools for AI agents directly from your function catalog, with auditable invocation boundaries.',
    outcomes: [
      'Reuse hardened backend capabilities inside agents.',
      'Control tool access through the same permission system.',
      'Maintain one backend model for product and AI surfaces.',
    ],
    capabilities: [
      'MCP tool/resource/prompt wiring',
      'Permission-scoped tool exposure',
      'Typed function contract reuse',
      'Auditable invocation paths',
    ],
    defineCode: `export const createInvoice = pikkuFunc({
  permissions: { account: 'billing:write' },
  func: async ({ billing }, input) => billing.createInvoice(input),
})`,
    wireCode: `wireMCPTool({
  name: 'create_invoice',
  description: 'Create a new invoice for an account',
  func: createInvoice,
})`,
    docsPath: '/docs/wiring/mcp/tools',
    deploymentKey: 'mcp',
  },
  {
    id: 'sse',
    route: '/sse',
    name: 'SSE',
    icon: 'sse',
    label: 'Streaming Surface',
    headline: 'Stream backend events with function-backed SSE.',
    subheadline: 'Progress updates and event streams without separate stream code.',
    description:
      'Use function outputs and events to power server-sent event streams while keeping shared middleware and policies.',
    outcomes: [
      'Add progressive UI updates with minimal backend overhead.',
      'Unify streaming logic with existing service functions.',
      'Keep transport-specific concerns isolated in wiring.',
    ],
    capabilities: [
      'SSE route wiring',
      'Shared auth and permission layers',
      'Incremental event streaming',
      'Compatible with HTTP-oriented infra',
    ],
    defineCode: `export const exportReport = pikkuFunc({
  func: async ({ reports }, input) => reports.runExport(input),
})`,
    wireCode: `wireHTTP({
  method: 'get',
  route: '/reports/:id/export',
  func: exportReport,
  sse: true,
})`,
    docsPath: '/docs/wiring/http/server-sent-events',
    deploymentKey: 'sse',
  },
  {
    id: 'cli',
    route: '/cli',
    name: 'CLI',
    icon: 'cli',
    label: 'Operator Surface',
    headline: 'Run the same backend functions from CLI workflows.',
    subheadline: 'Operational commands wired to production-safe domain functions.',
    description:
      'Expose operational workflows for support and platform teams by wiring commands directly to shared backend logic.',
    outcomes: [
      'Eliminate drift between CLI scripts and API behavior.',
      'Reuse validation, permissions, and service dependencies.',
      'Build internal tooling on the same function foundation.',
    ],
    capabilities: [
      'Command and subcommand wiring',
      'Typed command parameters',
      'Shared domain services',
      'Consistent execution path with API surfaces',
    ],
    defineCode: `export const syncAccount = pikkuFunc({
  func: async ({ accounts }, { accountId }) => accounts.sync(accountId),
})`,
    wireCode: `wireCLI({
  program: 'accounts',
  commands: {
    sync: pikkuCLICommand({
      parameters: '<accountId>',
      func: syncAccount,
    }),
  },
})`,
    docsPath: '/docs/wiring/cli',
  },
  {
    id: 'triggers',
    route: '/triggers',
    name: 'Triggers',
    icon: 'trigger',
    label: 'Event Surface',
    headline: 'React to events with function-native trigger wiring.',
    subheadline: 'Bridge external events to production functions without bespoke handlers.',
    description:
      'Map event sources and trigger contracts to your function inventory while preserving policy and observability.',
    outcomes: [
      'Standardize event ingestion across systems.',
      'Keep event handlers aligned with core business functions.',
      'Trace trigger usage and ownership from inspector metadata.',
    ],
    capabilities: [
      'Event trigger wiring',
      'Function-centric event processing',
      'Shared middleware and permissions',
      'Operational traceability',
    ],
    defineCode: `export const onPaymentSettled = pikkuFunc({
  func: async ({ billing }, event) => billing.reconcile(event),
})`,
    wireCode: `wireTrigger({
  name: 'payment.settled',
  func: onPaymentSettled,
})`,
    docsPath: '/docs/wiring/triggers',
  },
];

export const wireProductsById = Object.fromEntries(
  wireProducts.map((product) => [product.id, product]),
) as Record<string, WireProduct>;
