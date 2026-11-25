import type { SurfaceEntryPointId, SurfaceLeaf } from './surface.types';

/* Where "Read the guide" goes. A door with a page of its own is named here;
   any other door falls back to the page for the skill the data names. The
   explorer renders in the browser only, so the link gate never sees these:
   every path has to be a page under content/docs. */

const BY_DOOR: Record<string, string> = {
  function: '/docs/core-features/functions',
  setup: '/docs/core-features/services',
  addon: '/docs/addon',
  analytics: '/docs/core-features/analytics',
  error: '/docs/core-features/errors',
  middleware: '/docs/core-features/middleware',
  secrets: '/docs/core-features/secrets',
  variables: '/docs/core-features/variables',
  channel: '/docs/wiring/channels',
  cli: '/docs/wiring/cli',
  gateway: '/docs/wiring/gateway',
  http: '/docs/wiring/http',
  mcp: '/docs/wiring/mcp',
  queue: '/docs/wiring/queue',
  scheduler: '/docs/wiring/scheduled-tasks',
  trigger: '/docs/wiring/triggers',
  auth: '/docs/core-features/permission-guards',
  scopes: '/docs/api/scope-service',
  agent: '/docs/wiring/ai-agents',
  workflow: '/docs/wiring/workflows',
  scenarios: '/docs/core-features/scenarios',
};

const BY_SKILL: Record<string, string> = {
  'pikku-addon': '/docs/addon',
  'pikku-agent': '/docs/wiring/ai-agents',
  'pikku-auth': '/docs/core-features/permission-guards',
  'pikku-concepts': '/docs/core-features',
  'pikku-middleware': '/docs/core-features/middleware',
  'pikku-scenario': '/docs/core-features/scenarios',
  'pikku-services': '/docs/core-features/services',
  'pikku-wiring': '/docs/wiring',
  'pikku-workflow': '/docs/wiring/workflows',
};

export const guideFor = (entry: SurfaceEntryPointId, leaf: SurfaceLeaf): string | null => {
  // Setting up an addon is a different job from setting up an app.
  if (entry === 'addon' && leaf.name === 'setup') return '/docs/addon/creating';
  return BY_DOOR[leaf.name] ?? (leaf.skill ? BY_SKILL[leaf.skill] : undefined) ?? null;
};
