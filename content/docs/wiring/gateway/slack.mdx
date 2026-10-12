---
title: Slack
sidebar_position: 1
description: Ready-made Slack gateway adapter with OAuth, slash commands, and signature verification
ai: true
---

# Slack

`@pikku/gateway-slack` is a ready-made [gateway adapter](/docs/wiring/gateway) for Slack. Instead of hand-rolling an adapter, install the package and get Events API parsing, thread-aware replies, multi-workspace token resolution, OAuth install flows, slash command helpers, and request-signature verification.

## Installation

```bash npm2yarn
npm install @pikku/gateway-slack @slack/web-api
```

## Setup

One adapter serves **all** workspaces. Slack sends a `team_id` with every event, and the adapter resolves the right bot token per workspace via your `tokenResolver`:

Create one `SlackGatewayAdapter` from `@pikku/gateway-slack`, with two options:

- `tokenResolver`: an async function that takes a `teamId` and returns that workspace's bot token (or `null`). Look it up wherever your OAuth install flow stored it, for example your database.
- `signingSecret`: your Slack app's signing secret, read from your secrets or environment.

Export the adapter so your handler and your wiring can both import it.

Wire it like any other webhook gateway: `wireGateway` with `name: 'slack'`, `type: 'webhook'`, `route: '/webhooks/slack'`, `adapter` set to your Slack adapter, and `func` set to your handler. The generic webhook wiring is shown on the [gateway introduction](/docs/wiring/gateway#webhook).

The adapter handles Slack's `url_verification` challenge automatically, parses `event_callback` payloads (`message` and `app_mention` events) into the normalized `GatewayInboundMessage`, ignores bot messages to prevent loops, and maps Slack files to gateway attachments.

## Replying with SlackGatewayHelper

Slack replies need channel and thread context, which the generic `senderId`-based send doesn't carry. Use `SlackGatewayHelper` inside your handler — it binds sends to the same team, channel, and thread the message came from:

In your handler, build the helper from the inbound message and the adapter with `new SlackGatewayHelper(message, slackAdapter)`. Then:

- `slack.sendText('Thinking…')` sends an interim message to the same thread.
- `return slack.reply('Here is the answer!')` returns the final reply, which Pikku sends for you, thread-aware.

The helper also exposes `replyBlocks(blocks)` for [Block Kit](https://api.slack.com/block-kit) rich messages, and `metadata` getters (`teamId`, `channelId`, `threadTs`).

## OAuth Install Flow

For a multi-workspace app, wire two HTTP routes — one that redirects to Slack's consent screen, one that exchanges the callback code for a bot token:

Wire two sessionless functions to HTTP routes:

- **Install**: returns `{ url }` built with `buildSlackInstallUrl({ clientId, scopes: RECOMMENDED_BOT_SCOPES, redirectUri })`. Read the client id from your variables.
- **Callback**: takes `{ code }` and calls `exchangeSlackOAuthCode({ clientId, clientSecret, code, redirectUri })`, with the client id and secret read from your secrets. The result carries `teamId`, `teamName`, `botToken` and `botUserId`. Store the token against the team id; that's what `tokenResolver` reads later.

`RECOMMENDED_BOT_SCOPES` covers the usual agent-integration set: mentions, channel/group/IM history, `chat:write`, `commands`, and `users:read`.

:::tip[Token rotation]
The adapter caches one `WebClient` per workspace. After rotating a token, call `slackAdapter.invalidateClient(teamId)` so the next send picks up the new one.
:::

## Slash Commands

Slash commands arrive as form-encoded POSTs on their own route, not through the Events API. Parse them with `parseSlashCommand`:

Wire a sessionless function to the slash command route. Inside it:

1. Call `parseSlashCommand(data)`. For `/myapp install addon` you get `subcommand: 'install'` and `argsList: ['addon']`, plus the `responseUrl`.
2. To answer within Slack's 3-second limit, return the response body directly, for example `{ response_type: 'ephemeral', text: 'All systems go.' }`.
3. For longer work, return an acknowledgement now and, when the work finishes, call `respondToSlashCommand(cmd.responseUrl, { response_type: 'in_channel', text })`.

## Verifying Request Signatures

Slack signs every request with HMAC-SHA256. Verify signatures in middleware so spoofed events never reach your handler:

Write a middleware that reads the `x-slack-signature` and `x-slack-request-timestamp` headers and the raw request body from `wire.http.request`, then calls `verifySlackSignature(signingSecret, signature, timestamp, body)` with the signing secret from your secrets. If it returns false, throw; otherwise call `next()`.

`verifySlackSignature` also rejects requests older than five minutes, defending against replay attacks.

## Related

- [Gateway introduction](/docs/wiring/gateway) — the adapter interface, transport types, and message formats
- [AI Agents](/docs/wiring/ai-agents) — pair a Slack gateway with an agent for a conversational Slack bot
