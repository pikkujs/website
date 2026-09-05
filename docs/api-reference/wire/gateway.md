---
title: '#pikku/gateway'
sidebar_label: '#pikku/gateway'
sidebar_position: 3
description: 'Wires a function behind a gateway that receives requests on behalf of another system.'
---

# `#pikku/gateway`

Wires a function behind a gateway that receives requests on behalf of another system.

```typescript
import { wireGateway, GatewayAdapter, GatewayInboundMessage } from '#pikku/gateway'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`GatewayAdapter`](#gatewayadapter) | interface | What a gateway integration implements: parse an incoming event into a message, send one back, and open and close the connection. |
| [`GatewayInboundMessage`](#gatewayinboundmessage) | interface | One message arriving from a gateway, normalised: who sent it, in which conversation, and what they said. |
| [`GatewayOutboundMessage`](#gatewayoutboundmessage) | interface | One message to send back through a gateway — plain text, or the provider's own rich content. |
| [`GatewayTransportType`](#gatewaytransporttype) | type | 'webhook' the platform POSTs to us, 'websocket' the client connects to us, 'listener' no route at all. |
| [`GatewayWiring`](#gatewaywiring) | type | Type definition for gateway wirings. Declares a gateway name, its transport and its target pikku function. |
| [`PikkuGatewayAdapterFactory`](#pikkugatewayadapterfactory) | type | Builds a &#123;@link GatewayAdapter&#125; from your application's services. The core factory type is handed `CoreSingletonServices`; this one receives the services your project actually registered. |
| [`WebhookVerificationResult`](#webhookverificationresult) | type | What a gateway's `verifyWebhook` returns — verified, with the response the provider expects back, or not. |
| [`wireGateway`](#wiregateway) | function | Registers a gateway with the Pikku framework. Runs everywhere — inspector extracts at build time. |

## Reference

### `GatewayAdapter` {#gatewayadapter}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/gateway`</span>

What a gateway integration implements: parse an incoming event into a
message, send one back, and open and close the connection.

<details>
<summary>Config keys (6)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `close` <sup>required</sup> | `() => Promise<void>` | Called by GatewayService.stop(); release the connection init() opened. |
| `init` <sup>required</sup> | `(onMessage: (data: unknown) => Promise<void>) => Promise<void>` | Called by GatewayService.start(); must call onMessage per incoming event. |
| `name` <sup>required</sup> | `string` | Identifies the gateway in wirings and logs, e.g. `'slack'`. |
| `parse` <sup>required</sup> | `(data: unknown) => GatewayInboundMessage \| null` | Return null to ignore the event, e.g. a delivery receipt. |
| `send` <sup>required</sup> | `(senderId: string, message: GatewayOutboundMessage) => Promise<void>` | Deliver a reply back to the sender the message came from. |
| `verifyWebhook` | `((data: unknown, request?: PikkuHTTPRequest) => WebhookVerificationResult \| Promise<Webho…` | Receives the GET query params, or the POST body when called from the POST handler. |

</details>

### `GatewayInboundMessage` {#gatewayinboundmessage}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/gateway`</span>

One message arriving from a gateway, normalised: who sent it, in which
conversation, and what they said.

<details>
<summary>Config keys (5)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `attachments` | `GatewayAttachment[]` | Files and media that came with the message. |
| `metadata` | `Record<string, unknown>` | Anything else the adapter wants to carry through to the wiring. |
| `raw` <sup>required</sup> | `unknown` | The provider's own event, untouched, for anything this shape drops. |
| `senderId` <sup>required</sup> | `string` | Platform-specific: a phone number, a Slack user id, and so on. |
| `text` <sup>required</sup> | `string` | What they said, as plain text, with the provider's markup stripped. |

</details>

### `GatewayOutboundMessage` {#gatewayoutboundmessage}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/gateway`</span>

One message to send back through a gateway — plain text, or the provider's
own rich content.

<details>
<summary>Config keys (3)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `attachments` | `GatewayAttachment[]` | Files and media to send alongside. |
| `richContent` | `Record<string, unknown>` | The provider's own rich payload, e.g. Slack blocks. Passed through as-is. |
| `text` | `string` | The reply as plain text. Every provider can render this. |

</details>

### `GatewayTransportType` {#gatewaytransporttype}

<span className="api-symbol-meta">type · re-exported from `@pikku/core/gateway`</span>

'webhook' the platform POSTs to us, 'websocket' the client connects to us, 'listener' no route at all.

### `GatewayWiring` {#gatewaywiring}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Type definition for gateway wirings.
Declares a gateway name, its transport and its target pikku function.

<details>
<summary>Config keys (13)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `adapter` <sup>required</sup> | `GatewayAdapter \| GatewayAdapterFactory` | Translates between the platform's message format and pikku's. A factory is called with services, for an adapter that needs a token or a client. |
| `auth` | `boolean` | Unset lets the handler's own `auth` govern; gateway handlers are sessionless by default. |
| `description` | `string` | What this does, for whoever is reading the wiring rather than writing it. |
| `errors` | `string[]` | Names of error classes this may throw, so each one's registered status is used instead of a 500. |
| `func` <sup>required</sup> | `CorePikkuFunctionConfig<any, any>` | The function to run per inbound message. It receives the normalised message, not the platform's raw payload. |
| `middleware` | `CorePikkuMiddlewareGroup<any, any>` | Wraps every inbound message: signature verification, tracing, rate limiting. |
| `name` <sup>required</sup> | `string` | Unique across the project. It is how the gateway is addressed in `pikku meta` and in logs. |
| `platform` | `string` | Which service this speaks to — slack, whatsapp, discord. It selects the adapter's dialect, not the transport. |
| `route` | `string` | Required for 'webhook' and 'websocket'; unused for 'listener'. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this gateway in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this wiring, shown wherever it is listed rather than called. |
| `type` <sup>required</sup> | `"webhook" \| "websocket" \| "listener"` | How the platform reaches us: a `webhook` it posts to, a `websocket` it holds open, or a `listener` we open outward. |

</details>

### `PikkuGatewayAdapterFactory` {#pikkugatewayadapterfactory}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Builds a &#123;@link GatewayAdapter&#125; from your application's services.
The core factory type is handed `CoreSingletonServices`; this one receives
the services your project actually registered.

### `WebhookVerificationResult` {#webhookverificationresult}

<span className="api-symbol-meta">type · re-exported from `@pikku/core/gateway`</span>

What a gateway's `verifyWebhook` returns — verified, with the response the
provider expects back, or not.

<details>
<summary>Config keys (1)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `verified` <sup>required</sup> | `boolean` | True when the request really came from the provider. False when the signature or challenge did not check out. |

</details>

### `wireGateway` {#wiregateway}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a gateway with the Pikku framework.
Runs everywhere — inspector extracts at build time.

```typescript
wireGateway: (gateway: GatewayWiring) => void
```

<details>
<summary>Config keys (13)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `adapter` <sup>required</sup> | `GatewayAdapter \| GatewayAdapterFactory` | Translates between the platform's message format and pikku's. A factory is called with services, for an adapter that needs a token or a client. |
| `auth` | `boolean` | Unset lets the handler's own `auth` govern; gateway handlers are sessionless by default. |
| `description` | `string` | What this does, for whoever is reading the wiring rather than writing it. |
| `errors` | `string[]` | Names of error classes this may throw, so each one's registered status is used instead of a 500. |
| `func` <sup>required</sup> | `CorePikkuFunctionConfig<any, any>` | The function to run per inbound message. It receives the normalised message, not the platform's raw payload. |
| `middleware` | `CorePikkuMiddlewareGroup<any, any>` | Wraps every inbound message: signature verification, tracing, rate limiting. |
| `name` <sup>required</sup> | `string` | Unique across the project. It is how the gateway is addressed in `pikku meta` and in logs. |
| `platform` | `string` | Which service this speaks to — slack, whatsapp, discord. It selects the adapter's dialect, not the transport. |
| `route` | `string` | Required for 'webhook' and 'websocket'; unused for 'listener'. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this gateway in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this wiring, shown wherever it is listed rather than called. |
| `type` <sup>required</sup> | `"webhook" \| "websocket" \| "listener"` | How the platform reaches us: a `webhook` it posts to, a `websocket` it holds open, or a `listener` we open outward. |

</details>

```typescript
wireGateway({
  name: 'stripe',
  type: 'webhook',
  func: handleStripeEvent
})
```

## Inside an addon

This door is application-only — there is no `#pikku/addon/gateway`. Everything on it wires a function to the outside world, and that is the installing application's call, not the addon's. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.

---

Run `npx pikku doc gateway` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
