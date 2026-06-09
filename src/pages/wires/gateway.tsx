import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const wiringCode = `wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})`;

const handlerCode = `const handleMessage = pikkuFunc({
  func: async ({ database, logger }, { senderId, text }) => {
    logger.info(\`Message from \${senderId}: \${text}\`)
    await database.saveMessage(senderId, text)
    return { text: \`Got it! You said: \${text}\` }
  }
})`;

const webhookCode = `wireGateway({
  name: 'slack',
  type: 'webhook',
  route: '/webhooks/slack',
  adapter: slackAdapter,
  func: handleMessage,
})`;

const websocketCode = `wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage,
})`;

const listenerCode = `wireGateway({
  name: 'signal',
  type: 'listener',
  adapter: signalAdapter,
  func: handleMessage,
})`;

const page: PageData = {
  meta: {
    title: 'Gateway Wire — Pikku',
    description: 'Connect your Pikku functions to WhatsApp, Slack, Telegram, and any messaging platform — with normalized messages, auto-verification, and the same middleware you already use.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: Gateway',
      h1: 'Every platform,\n_one handler._',
      lead: 'wireGateway connects your Pikku functions to WhatsApp, Slack, Telegram, and any messaging platform — with normalized messages, auto-verification, and the same middleware you already use.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/gateway', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'gateway' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Wire a _gateway_',
      lead: 'Pick a platform adapter, point it at your function. Messages arrive normalized — your handler never knows which platform sent them.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'gateway.wiring.ts', badge: 'wireGateway', icon: 'gateway', code: wiringCode },
      },
      right: {
        type: 'code',
        code: { filename: 'gateway.functions.ts', badge: 'handler', icon: 'gateway', code: handlerCode },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Normalized messages', body: 'Every platform delivers the same GatewayInboundMessage — senderId, text, attachments.' },
          { title: 'Auto-send responses', body: 'Return an outbound message and Pikku sends it via the adapter automatically.' },
          { title: 'Same middleware', body: 'Auth, permissions, rate limiting — everything you already use carries over.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Transport Types',
      h2: 'Three ways to _connect_',
      lead: 'Webhook, WebSocket, or listener — pick the transport that matches your platform. The handler function stays the same.',
      variant: 'alt',
      left: {
        type: 'codes',
        codes: [
          { filename: 'webhook gateway', badge: 'webhook', icon: 'gateway', code: webhookCode },
          { filename: 'websocket gateway', badge: 'websocket', icon: 'gateway', code: websocketCode },
          { filename: 'listener gateway', badge: 'listener', icon: 'gateway', code: listenerCode },
        ],
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'webhook', title: 'Webhook', body: 'Platform POSTs to you. Auto-registers POST and GET routes. Handles verification challenges (WhatsApp, Slack, Telegram).' },
          { icon: 'message-square', title: 'WebSocket', body: 'Client connects via WebSocket. Uses Pikku\'s Channel wiring internally. Ideal for web chat widgets.' },
          { icon: 'radio', title: 'Listener', body: 'Standalone event loop with no HTTP routes. For platforms that need a persistent connection — Baileys, Signal CLI, Matrix.' },
        ],
      },
    },

    {
      component: 'feature-grid',
      eyebrow: 'Features',
      h2: 'Adapters, verification, _context_',
      lead: 'Everything you need to integrate with messaging platforms — without platform-specific boilerplate.',
      variant: 'default',
      columns: 3,
      cards: [
        { icon: 'layers', title: 'Platform adapters', body: 'Each platform gets a simple adapter: parse inbound, send outbound. Swap adapters without touching your handler.' },
        { icon: 'shield-check', title: 'Auto-verification', body: 'Webhook verification challenges handled automatically — WhatsApp GET challenges, Slack url_verification, and more.' },
        { icon: 'plug', title: 'wire.gateway context', body: 'Access gatewayName, senderId, platform, and send() inside any handler or middleware via wire.gateway.' },
        { icon: 'message-square', title: 'Attachments', body: 'Images, files, and media normalized into GatewayAttachment — same interface across WhatsApp, Slack, and Telegram.' },
        { icon: 'radio', title: 'Lifecycle management', body: 'GatewayService handles listener startup, shutdown, and reconnection. LocalGatewayService included out of the box.' },
        { icon: 'webhook', title: 'Multi-gateway', body: 'Register multiple gateways with the same handler. One function serves WhatsApp, Slack, and WebChat simultaneously.' },
      ],
    },

    {
      component: 'cta',
      h2: 'Start building messaging integrations',
      lead: 'One handler for every messaging platform. No platform-specific boilerplate.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the Gateway Docs', to: '/docs/wiring/gateway', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · WhatsApp, Slack, Telegram & more',
    },
  ],
};

export default function GatewayWirePage() {
  return <FeaturePage data={page} />;
}
