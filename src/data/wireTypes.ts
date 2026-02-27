import {
  HttpIcon,
  WebSocketIcon,
  RPCIcon,
  MCPIcon,
  QueueIcon,
  CronIcon,
  TriggerIcon,
  CLIIcon,
  BotIcon,
  WorkflowIcon,
} from '../components/WiringIcons';

export type WireCategory = 'Protocols' | 'Scheduling & Processing' | 'AI & Orchestration';

export interface WireType {
  id: string;
  label: string;
  description: string;
  url: string;
  category: WireCategory;
  icon: React.FC<{ className?: string; size?: number }>;
  badge?: string;
  snippet?: string;
}

export const wireTypes: WireType[] = [
  // Protocols
  {
    id: 'http',
    label: 'HTTP',
    description: 'REST APIs and server-sent events',
    url: '/wires/http',
    category: 'Protocols',
    icon: HttpIcon,
    snippet: `wireHTTP({ method: 'get', route: '/cards/:id', func: getCard })`,
  },
  {
    id: 'websocket',
    label: 'WebSocket',
    description: 'Real-time bidirectional channels',
    url: '/wires/websocket',
    category: 'Protocols',
    icon: WebSocketIcon,
    snippet: `wireChannel({ name: 'cards', onMessage: { getCard } })`,
  },
  {
    id: 'rpc',
    label: 'RPC',
    description: 'Direct function-to-function calls',
    url: '/wires/rpc',
    category: 'Protocols',
    icon: RPCIcon,
    snippet: `await rpc.invoke('getCard', { cardId })`,
  },
  {
    id: 'mcp',
    label: 'MCP',
    description: 'Model Context Protocol for AI',
    url: '/wires/mcp',
    category: 'Protocols',
    icon: MCPIcon,
    snippet: `wireMCPResource({ uri: 'card/{id}', func: getCard })`,
  },
  // Scheduling & Processing
  {
    id: 'queue',
    label: 'Queue',
    description: 'Background job processing',
    url: '/wires/queue',
    category: 'Scheduling & Processing',
    icon: QueueIcon,
    snippet: `wireQueueWorker({ queue: 'cards', func: getCard })`,
  },
  {
    id: 'cron',
    label: 'Cron',
    description: 'Scheduled recurring tasks',
    url: '/wires/cron',
    category: 'Scheduling & Processing',
    icon: CronIcon,
    snippet: `wireScheduler({ cron: '0 * * * *', func: syncCards })`,
  },
  {
    id: 'trigger',
    label: 'Triggers',
    description: 'Event-driven subscriptions',
    url: '/wires/trigger',
    category: 'Scheduling & Processing',
    icon: TriggerIcon,
  },
  {
    id: 'cli',
    label: 'CLI',
    description: 'Command-line interface tools',
    url: '/wires/cli',
    category: 'Scheduling & Processing',
    icon: CLIIcon,
  },
  // AI & Orchestration
  {
    id: 'bot',
    label: 'AI Agents',
    description: 'Conversational AI with tools',
    url: '/wires/bot',
    category: 'AI & Orchestration',
    icon: BotIcon,
    badge: 'Alpha',
    snippet: `pikkuAgent({ tools: [getCard], model: 'claude-sonnet' })`,
  },
  {
    id: 'workflow',
    label: 'Workflows',
    description: 'Multi-step stateful processes',
    url: '/wires/workflow',
    category: 'AI & Orchestration',
    icon: WorkflowIcon,
    snippet: `await workflow.do('Fetch', 'getCard', { cardId })`,
  },
];

export const wireCategories: WireCategory[] = [
  'Protocols',
  'Scheduling & Processing',
  'AI & Orchestration',
];
