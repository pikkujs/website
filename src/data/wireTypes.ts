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
  },
  {
    id: 'websocket',
    label: 'WebSocket',
    description: 'Real-time bidirectional channels',
    url: '/wires/websocket',
    category: 'Protocols',
    icon: WebSocketIcon,
  },
  {
    id: 'rpc',
    label: 'RPC',
    description: 'Direct function-to-function calls',
    url: '/wires/rpc',
    category: 'Protocols',
    icon: RPCIcon,
  },
  {
    id: 'mcp',
    label: 'MCP',
    description: 'Model Context Protocol for AI',
    url: '/wires/mcp',
    category: 'Protocols',
    icon: MCPIcon,
  },
  // Scheduling & Processing
  {
    id: 'queue',
    label: 'Queue',
    description: 'Background job processing',
    url: '/wires/queue',
    category: 'Scheduling & Processing',
    icon: QueueIcon,
  },
  {
    id: 'cron',
    label: 'Cron',
    description: 'Scheduled recurring tasks',
    url: '/wires/cron',
    category: 'Scheduling & Processing',
    icon: CronIcon,
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
  },
  {
    id: 'workflow',
    label: 'Workflows',
    description: 'Multi-step stateful processes',
    url: '/wires/workflow',
    category: 'AI & Orchestration',
    icon: WorkflowIcon,
  },
];

export const wireCategories: WireCategory[] = [
  'Protocols',
  'Scheduling & Processing',
  'AI & Orchestration',
];
