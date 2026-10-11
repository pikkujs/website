import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsFunction = snippets.orderStatusChannel;

const basicsWiring = snippets.channelWiring;

const routingCode = snippets.channelWiring;

const authCode = snippets.channelWiring;

const pubsubCode = snippets.channelPubSub;

const clientCode = snippets.channelPubSub;

const channelMiddlewareCode = snippets.channelPubSub;

const page: PageData = {
  meta: {
    title: 'WebSocket Wire — Pikku',
    description: 'Wire your Pikku functions to WebSocket channels with action routing, pub/sub via EventHub, per-message auth, and a type-safe client.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: WebSocket',
      h1: 'Real-time channels,\n_same functions._',
      lead: 'wireChannel gives bidirectional messaging with action routing, pub/sub, and per-message auth — all using your existing Pikku functions.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/channels', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'websocket' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Connect, route, _respond_',
      lead: 'Define your functions once, wire them to a channel. Pikku routes incoming messages by action name.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'createTodo.func.ts', badge: 'func.ts', code: basicsFunction, snippetKey: 'orderStatusChannel' },
      },
      right: {
        type: 'code',
        code: { filename: 'todos.channel.ts', badge: 'channel.ts', icon: 'websocket', code: basicsWiring, snippetKey: 'channelWiring' },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Action-based routing', body: 'Messages include an action key — Pikku routes to the right function automatically.' },
          { title: 'Lifecycle hooks', body: 'onConnect and onDisconnect let you set up and tear down per-connection state.' },
          { title: 'Same auth system', body: 'Permissions, sessions, and middleware work identically to HTTP wiring.' },
        ],
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Action Routing',
      h2: 'One channel, _many actions_',
      lead: 'Every message carries an action key. Pikku strips it from the data, routes to the right function, and re-adds it to the response.',
      variant: 'alt',
      code: { filename: 'todos.channel.ts', icon: 'websocket', code: routingCode, snippetKey: 'channelWiring' },
      below: {
        type: 'note',
        icon: 'arrow-right',
        title: 'Routing key stripped from data.',
        body: 'Your function receives { text: "Buy milk" } — not the raw message. The action key is re-added to the response automatically.',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Auth',
      h2: 'Authenticate once, _session everywhere_',
      lead: 'Send an auth message over the WebSocket, set the session, and every subsequent action has access to it.',
      variant: 'default',
      left: {
        type: 'cards',
        cards: [
          { icon: 'zap', title: 'Session via setSession', body: 'Call setSession() inside any action to establish an authenticated session for the connection.' },
          { icon: 'shield-check', title: 'Per-action auth override', body: 'Set auth: false on individual actions like authenticate. Everything else requires a valid session by default.' },
          { icon: 'lock', title: 'Auto propagation', body: 'Once the session is set, every subsequent message on that connection automatically carries the session — no re-auth needed.' },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'todos.channel.ts', icon: 'websocket', code: authCode, snippetKey: 'channelWiring' },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Pub/Sub',
      h2: 'Broadcast with _EventHub_',
      lead: 'Subscribe connections to topics on connect. When one client publishes, all subscribers receive the update in real time.',
      variant: 'alt',
      code: { filename: 'todos.channel.ts', icon: 'websocket', code: pubsubCode, snippetKey: 'channelPubSub' },
      below: {
        type: 'note',
        icon: 'zap',
        title: 'Stateful or serverless.',
        body: 'EventHub works in-process for stateful servers (uWebSockets.js) and backs onto PostgreSQL for serverless deployments (AWS Lambda + API Gateway).',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Type-Safe Client',
      h2: 'Full IntelliSense _on the wire_',
      lead: 'Pikku generates a typed WebSocket client from your channel wirings. Every action, every payload, every subscription — autocompleted.',
      variant: 'default',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'client.ts', badge: 'auto-generated types', code: clientCode, snippetKey: 'channelPubSub' },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'wifi', title: 'Generated from wirings', body: 'PikkuWebSocket is auto-generated with typed overloads for every channel action you\'ve wired.' },
          { icon: 'send', title: 'Typed send & subscribe', body: 'route.send() infers input/output per action. route.subscribe() types the callback payload from your EventHub events.' },
          { icon: 'globe', title: 'Works everywhere', body: 'Built on the standard WebSocket API — works in the browser, Node, React Native, or anywhere with a WebSocket implementation.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Middleware',
      h2: 'Hooks at _every level_',
      lead: 'Two types of middleware: wire middleware wraps function calls, channel middleware wraps outbound messages via channel.send().',
      variant: 'alt',
      left: {
        type: 'cards',
        cards: [
          { icon: 'layers', title: 'Wire middleware', body: 'Wraps each function call. Apply per-channel or per-action — rate limiting, audit logging, validation. Same model as HTTP middleware.', mono: false },
          { icon: 'radio', title: 'Channel middleware', body: 'Wraps channel.send() — intercepts every outbound event. Transform payloads, filter events (pass null to drop), or fan out (pass an array).', mono: false },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'channel-middleware.ts', badge: 'channel middleware', icon: 'websocket', code: channelMiddlewareCode, snippetKey: 'channelPubSub' },
      },
      below: {
        type: 'note',
        icon: 'arrow-right',
        title: 'Channel middleware controls what the client sees.',
        body: 'Pass a modified event to next() to transform, null to drop, or an array to fan out into multiple events. Both types run in onion order.',
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Real-World Example',
      h2: 'Order status _channel_',
      lead: 'From the online shop template — a defineChannel that streams live order status updates after checkout. Auth required, typed onMessage discriminated union.',
      variant: 'default',
      code: { filename: 'order-status.channel.ts', icon: 'websocket', code: snippets.orderStatusChannel, snippetKey: 'orderStatusChannel' },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Deploy',
      h2: 'Stateful or _serverless_',
      lead: 'The same wireChannel code runs on both. Your functions don\'t change — only the runtime does.',
      variant: 'default',
      columns: 2,
      cards: [
        { title: 'Stateful', body: 'uWebSockets.js, ws — in-process EventHub, persistent connections. Best for low-latency real-time apps.' },
        { title: 'Serverless', body: 'AWS Lambda, Cloudflare — PostgreSQL-backed EventHub, managed WebSocket API. Best for scale-to-zero workloads.' },
      ],
    },

    {
      component: 'cta',
      h2: 'Start wiring WebSockets in 5 minutes',
      lead: 'One command to scaffold a project with WebSocket wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the WebSocket Docs', to: '/docs/wiring/channels', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Works with uWebSockets.js, ws, AWS Lambda & Cloudflare',
    },
  ],
};

export default function WebSocketWirePage() {
  return <FeaturePage data={page} />;
}
