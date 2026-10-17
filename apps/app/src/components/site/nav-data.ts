import { Code2, Wrench, Shield, GitBranch, Scissors, Package, Key, Puzzle, Gauge, Cloud, Server, Globe, Box, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { wireTypes, wireCategories } from '@/data/wireTypes'

export type MenuEntry = { id: string; label: string; description: string; url: string; icon: LucideIcon | React.FC<{ className?: string; size?: number }> }

export const coreEntries: MenuEntry[] = [
  { id: 'function', label: 'Functions', description: 'One signature, every protocol', url: '/core/function', icon: Code2 },
  { id: 'services', label: 'Services', description: 'Injected toolbox with tree-shaking', url: '/core/services', icon: Wrench },
  { id: 'security', label: 'Security', description: 'Sessions, permissions & auth', url: '/core/security', icon: Shield },
  { id: 'versioning', label: 'Versioning', description: 'Contract hashing & CI enforcement', url: '/core/versioning', icon: GitBranch },
  { id: 'secrets', label: 'Secrets & Variables', description: 'Type-safe config with Zod', url: '/core/secrets', icon: Key },
]
export const deploymentEntries: MenuEntry[] = [
  { id: 'deploy-cloudflare', label: 'Cloudflare Workers', description: 'One-command deploy to the edge', url: '/deploy/cloudflare', icon: Cloud },
  { id: 'deploy-serverless', label: 'AWS Serverless', description: 'Lambda + SQS + EventBridge', url: '/deploy/serverless', icon: Server },
  { id: 'deploy-azure', label: 'Azure Functions', description: 'HTTP + Queue + Timer triggers', url: '/deploy/azure', icon: Globe },
  { id: 'deploy-standalone', label: 'Standalone', description: 'One bundle or one binary, self-hosted', url: '/deploy/standalone', icon: Box },
]
export const platformEntries: MenuEntry[] = [
  { id: 'treeshaking', label: 'Tree-Shaking', description: 'Filter & deploy only what you need', url: '/core/treeshaking', icon: Scissors },
  { id: 'built-in-services', label: 'Built-in Services', description: 'Every interface & provider', url: '/core/built-in-services', icon: Package },
  { id: 'addons', label: 'Addons', description: 'Extend with npm packages', url: '/core/addons', icon: Puzzle },
  { id: 'scorers', label: 'Scorers & Judges', description: 'Grade agent runs in tests and in production', url: '/wires/agent#scoring', icon: Scale },
  { id: 'benchmarks', label: 'Benchmarks', description: 'Real-world performance numbers', url: '/benchmarks', icon: Gauge },
]
export const menuColumns: { label: string; entries: MenuEntry[] }[] = [
  { label: 'Core', entries: coreEntries },
  ...wireCategories.map((cat) => ({ label: cat as string, entries: wireTypes.filter((w) => w.category === cat) as MenuEntry[] })),
  { label: 'Deployment', entries: deploymentEntries },
  { label: 'Platform', entries: platformEntries },
]

export const primaryLinks = [
  { to: '/docs', label: 'Docs' },
  { to: '/blog', label: 'Blog' },
  { to: '/api', label: 'API' },
  { to: '/addons', label: 'Addons' },
  { to: '/openapis', label: 'OpenAPIs' },
]

export const footerColumns = [
  { title: 'Product', items: [
    { label: 'Overview', to: '/' }, { label: 'For developers', to: '/developers' }, { label: 'Features', to: '/features' },
    { label: 'Benchmarks', to: '/benchmarks' }, { label: 'Fabric (managed hosting)', to: 'https://pikkufabric.com' } ] },
  { title: 'Learn', items: [
    { label: 'Getting Started', to: '/getting-started' }, { label: 'Documentation', to: '/docs' }, { label: 'Wiring (HTTP, WS, Queues…)', to: '/docs/wiring/http' },
    { label: 'Runtimes', to: '/docs/runtimes/fastify-plugin' }, { label: 'CLI Reference', to: '/docs/pikku-cli' } ] },
  { title: 'Community', items: [
    { label: 'GitHub', to: 'https://github.com/pikkujs/pikku' }, { label: 'Blog', to: '/blog' }, { label: 'Addon catalogue', to: '/addons' } ] },
]
