---
sidebar_position: 0
title: Introduction
description: Multi-platform messaging integrations
ai: true
---

# Gateway

Gateways are a meta-wiring for messaging platform integrations. They provide a normalized interface for building chatbots and messaging handlers that work across multiple platforms — WhatsApp, Slack, Telegram, WebChat, and more — without platform-specific boilerplate.

Your handler function receives the same `GatewayInboundMessage` regardless of which platform sent the message. Pikku normalizes inbound messages, routes them through your middleware, calls your function, and auto-sends responses via the platform's API.

## Your First Gateway

Here's a WhatsApp webhook gateway:

```typescript title="gateway.functions.ts"
import { pikkuFunc } from '#pikku'

export const handleMessage = pikkuFunc<
  GatewayInboundMessage,
  GatewayOutboundMessage
>({
  func: async ({ logger, database }, { senderId, text }) => {
    logger.info(`Message from ${senderId}: ${text}`)
    await database.saveMessage(senderId, text)
    return { text: `Got it! You said: ${text}` }
  },
  title: 'Handle incoming gateway message',
  tags: ['messaging']
})
```

```typescript title="gateway.wiring.ts"
import { wireGateway } from '@pikku/core/gateway'
import { whatsAppAdapter } from './adapters/whatsapp.js'
import { handleMessage } from './functions/gateway.functions.js'

wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})
```

Pikku automatically:
- Registers POST and GET HTTP routes for the webhook
- Handles webhook verification challenges on both GET and POST (e.g., WhatsApp's GET challenge, Slack's POST-based `url_verification`)
- Parses inbound messages via the adapter
- Calls your handler function with normalized data
- Auto-sends responses back via the platform's API

## Transport Types

Gateways support three transport mechanisms:

### Webhook

The platform POSTs messages to your application. This is the most common pattern for cloud APIs like WhatsApp Cloud API, Slack Events API, and Telegram Bot API.

```typescript
wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})
```

Pikku registers both a `POST` route (message receiver) and a `GET` route (webhook verification) at the given path. The adapter's `verifyWebhook` method handles platform-specific verification challenges automatically — on both GET (e.g., WhatsApp challenge) and POST (e.g., Slack `url_verification`).

### WebSocket

Clients connect via WebSocket for real-time messaging. Ideal for embedded web chat widgets and browser-based messaging.

```typescript
wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage,
})
```

Internally, this uses Pikku's Channel wiring. The adapter normalizes WebSocket messages into the same `GatewayInboundMessage` format, and responses are sent back through the WebSocket connection.

### Listener

A standalone event loop with no HTTP routes. Used for platforms that require a persistent client connection — like Baileys (WhatsApp via phone), Signal CLI, or Matrix sync.

```typescript
wireGateway({
  name: 'signal',
  type: 'listener',
  adapter: signalAdapter,
  func: handleMessage,
})
```

Listener gateways are started via the `GatewayService`. The adapter's `init()` method establishes the connection and calls your handler for each incoming message.

## The GatewayAdapter Interface

Each platform needs an adapter that normalizes messages and handles sending:

```typescript
interface GatewayAdapter {
  /** Platform name (e.g., 'whatsapp', 'slack', 'telegram') */
  name: string

  /** Parse platform-specific payload into normalized message.
   *  Return null to ignore (e.g., delivery receipts). */
  parse(data: unknown): GatewayInboundMessage | null

  /** Send a message to a specific sender via the platform's API */
  send(senderId: string, message: GatewayOutboundMessage): Promise<void>

  /** Initialize the adapter (for listener gateways).
   *  Call onMessage for each incoming event. */
  init(onMessage: (data: unknown) => Promise<void>): Promise<void>

  /** Tear down the adapter */
  close(): Promise<void>

  /** Handle webhook verification challenges (webhook type only) */
  verifyWebhook?(
    data: unknown,
    request?: PikkuHTTPRequest
  ): WebhookVerificationResult | Promise<WebhookVerificationResult>
}
```

Here's an example adapter for WhatsApp Cloud API:

```typescript title="adapters/whatsapp.ts"
import type { GatewayAdapter } from '@pikku/core/gateway'

export const whatsAppAdapter: GatewayAdapter = {
  name: 'whatsapp',

  parse(data: any) {
    const entry = data?.entry?.[0]?.changes?.[0]?.value
    const message = entry?.messages?.[0]
    if (!message) return null // Delivery receipt or status update

    return {
      senderId: message.from,
      text: message.text?.body ?? '',
      raw: data,
      metadata: { messageId: message.id }
    }
  },

  async send(senderId, message) {
    await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: senderId,
        text: { body: message.text },
      })
    })
  },

  async init() {},
  async close() {},

  verifyWebhook(data: any) {
    if (data['hub.verify_token'] === VERIFY_TOKEN) {
      return { verified: true, response: data['hub.challenge'] }
    }
    return { verified: false }
  }
}
```

## Message Types

### GatewayInboundMessage

The normalized message your handler receives:

```typescript
interface GatewayInboundMessage {
  senderId: string                      // Platform-specific sender ID
  text: string                          // Message text content
  raw: unknown                          // Original platform payload
  attachments?: GatewayAttachment[]     // Files, images, etc.
  metadata?: Record<string, unknown>    // Platform-specific metadata
}
```

### GatewayOutboundMessage

The message you return from your handler (auto-sent via the adapter):

```typescript
interface GatewayOutboundMessage {
  text?: string                         // Plain text response
  richContent?: Record<string, unknown> // Platform-specific rich content
  attachments?: GatewayAttachment[]     // Files, images, etc.
}
```

### GatewayAttachment

File and media attachments shared by both inbound and outbound messages:

```typescript
interface GatewayAttachment {
  type: string                          // Attachment type (e.g., 'image', 'document')
  url?: string                          // URL to the file
  data?: ArrayBuffer | Uint8Array       // Raw file data
  mimeType?: string                     // MIME type (e.g., 'image/png')
  filename?: string                     // Original filename
}
```

If your handler returns an outbound message with `text`, `richContent`, or `attachments`, Pikku automatically calls `adapter.send()` to deliver it.

## The wire.gateway Object

Inside your handler and middleware, `wire.gateway` provides context about the current gateway:

```typescript
func: async (services, data, wire) => {
  wire.gateway.gatewayName   // 'whatsapp'
  wire.gateway.senderId      // '+1234567890'
  wire.gateway.platform      // 'whatsapp' (from adapter.name)
  wire.gateway.send(msg)     // Send a proactive message
}
```

Use `wire.gateway.send()` when you need to send additional messages beyond the auto-sent return value.

## Middleware and Permissions

Gateways support the full middleware and permission system:

```typescript
wireGateway({
  name: 'slack',
  type: 'webhook',
  route: '/webhooks/slack',
  adapter: slackAdapter,
  func: handleMessage,
  middleware: [rateLimitMiddleware, loggingMiddleware],
  permissions: [isAdmin],
  auth: false,  // Default is true
})
```

Middleware receives `wire.gateway`, so you can write gateway-aware middleware:

```typescript
const rateLimitMiddleware = {
  func: async (services, wire, next) => {
    const { senderId, platform } = wire.gateway
    const allowed = await services.rateLimit.check(`${platform}:${senderId}`)
    if (!allowed) {
      await wire.gateway.send({ text: 'Too many messages. Please wait.' })
      return
    }
    await next()
  }
}
```

## GatewayService for Listeners

Listener gateways need to be started explicitly. The `GatewayService` manages their lifecycle:

```typescript
import { LocalGatewayService } from '@pikku/core/services'

const gatewayService = new LocalGatewayService()

// Start all registered listener gateways
await gatewayService.start()

// Stop all listener gateways on shutdown
await gatewayService.stop()
```

`LocalGatewayService` iterates over all registered listener gateways, calls `adapter.init()` with the message handler, and manages cleanup on shutdown.

## Multiple Gateways

Register as many gateways as you need — they all share the same handler function:

```typescript
wireGateway({
  name: 'whatsapp',
  type: 'webhook',
  route: '/webhooks/whatsapp',
  adapter: whatsAppAdapter,
  func: handleMessage,
})

wireGateway({
  name: 'slack',
  type: 'webhook',
  route: '/webhooks/slack',
  adapter: slackAdapter,
  func: handleMessage,
})

wireGateway({
  name: 'webchat',
  type: 'websocket',
  route: '/chat',
  adapter: webChatAdapter,
  func: handleMessage,
})
```

Your handler function stays the same — the adapter normalizes platform differences. Use `wire.gateway.platform` if you need platform-specific behavior.
