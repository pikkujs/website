---
title: Slack
sidebar_position: 1
description: Ready-made Slack gateway adapter with OAuth, slash commands, and signature verification
ai: true
---

# Slack

`@pikku/gateway-slack` is a ready-made [gateway adapter](./index.md) for Slack. Instead of hand-rolling an adapter, install the package and get Events API parsing, thread-aware replies, multi-workspace token resolution, OAuth install flows, slash command helpers, and request-signature verification.

## Installation

```bash npm2yarn
npm install @pikku/gateway-slack @slack/web-api
```

## Setup

One adapter serves **all** workspaces. Slack sends a `team_id` with every event, and the adapter resolves the right bot token per workspace via your `tokenResolver`:

```typescript title="adapters/slack.ts"
import { SlackGatewayAdapter } from '@pikku/gateway-slack'

export const slackAdapter = new SlackGatewayAdapter({
  // Look up the bot token for a workspace (e.g. from your database,
  // stored there by the OAuth install flow below)
  tokenResolver: async (teamId) => {
    const install = await db.getSlackInstall(teamId)
    return install?.botToken ?? null
  },
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
})
```

```typescript title="slack.wiring.ts"
import { wireGateway } from '@pikku/core/gateway'
import { slackAdapter } from './adapters/slack.js'
import { handleMessage } from './functions/gateway.functions.js'

wireGateway({
  name: 'slack',
  type: 'webhook',
  route: '/webhooks/slack',
  adapter: slackAdapter,
  func: handleMessage,
})
```

The adapter handles Slack's `url_verification` challenge automatically, parses `event_callback` payloads (`message` and `app_mention` events) into the normalized `GatewayInboundMessage`, ignores bot messages to prevent loops, and maps Slack files to gateway attachments.

## Replying with SlackGatewayHelper

Slack replies need channel and thread context, which the generic `senderId`-based send doesn't carry. Use `SlackGatewayHelper` inside your handler — it binds sends to the same team, channel, and thread the message came from:

```typescript title="functions/gateway.functions.ts"
import { pikkuFunc } from '#pikku'
import { SlackGatewayHelper } from '@pikku/gateway-slack'
import { slackAdapter } from '../adapters/slack.js'

export const handleMessage = pikkuFunc<
  GatewayInboundMessage,
  GatewayOutboundMessage
>({
  func: async ({ logger }, message) => {
    const slack = new SlackGatewayHelper(message, slackAdapter)

    // Send an interim message to the same thread
    await slack.sendText('Thinking…')

    // Return the final reply (auto-sent, thread-aware)
    return slack.reply('Here is the answer!')
  },
  title: 'Handle Slack messages',
})
```

The helper also exposes `replyBlocks(blocks)` for [Block Kit](https://api.slack.com/block-kit) rich messages, and `metadata` getters (`teamId`, `channelId`, `threadTs`).

## OAuth Install Flow

For a multi-workspace app, wire two HTTP routes — one that redirects to Slack's consent screen, one that exchanges the callback code for a bot token:

```typescript title="functions/slack-oauth.functions.ts"
import { pikkuSessionlessFunc } from '#pikku'
import {
  buildSlackInstallUrl,
  exchangeSlackOAuthCode,
  RECOMMENDED_BOT_SCOPES,
} from '@pikku/gateway-slack'

export const slackInstall = pikkuSessionlessFunc<void, { url: string }>({
  func: async ({ variables }) => ({
    url: buildSlackInstallUrl({
      clientId: await variables.get('SLACK_CLIENT_ID'),
      scopes: RECOMMENDED_BOT_SCOPES,
      redirectUri: 'https://app.example.com/slack/callback',
    }),
  }),
})

export const slackCallback = pikkuSessionlessFunc<{ code: string }, void>({
  func: async ({ secrets, database }, { code }) => {
    const result = await exchangeSlackOAuthCode({
      clientId: await secrets.getSecret('SLACK_CLIENT_ID'),
      clientSecret: await secrets.getSecret('SLACK_CLIENT_SECRET'),
      code,
      redirectUri: 'https://app.example.com/slack/callback',
    })
    // Store the token — this is what tokenResolver reads later
    await database.saveSlackInstall(result.teamId, {
      teamName: result.teamName,
      botToken: result.botToken,
      botUserId: result.botUserId,
    })
  },
})
```

`RECOMMENDED_BOT_SCOPES` covers the usual agent-integration set: mentions, channel/group/IM history, `chat:write`, `commands`, and `users:read`.

:::tip Token rotation
The adapter caches one `WebClient` per workspace. After rotating a token, call `slackAdapter.invalidateClient(teamId)` so the next send picks up the new one.
:::

## Slash Commands

Slash commands arrive as form-encoded POSTs on their own route, not through the Events API. Parse them with `parseSlashCommand`:

```typescript title="functions/slack-command.functions.ts"
import { pikkuSessionlessFunc } from '#pikku'
import {
  parseSlashCommand,
  respondToSlashCommand,
} from '@pikku/gateway-slack'

export const slackCommand = pikkuSessionlessFunc<unknown, unknown>({
  func: async ({ logger }, data) => {
    const cmd = parseSlashCommand(data)
    // "/myapp install addon" → subcommand: 'install', argsList: ['addon']

    if (cmd.subcommand === 'status') {
      // Respond within 3 seconds: return the response body directly
      return { response_type: 'ephemeral', text: 'All systems go.' }
    }

    // Longer work: acknowledge now, respond later via response_url
    void doSlowThing().then((result) =>
      respondToSlashCommand(cmd.responseUrl, {
        response_type: 'in_channel',
        text: result,
      })
    )
    return { response_type: 'ephemeral', text: 'Working on it…' }
  },
})
```

## Verifying Request Signatures

Slack signs every request with HMAC-SHA256. Verify signatures in middleware so spoofed events never reach your handler:

```typescript title="middleware/slack-signature.ts"
import { verifySlackSignature } from '@pikku/gateway-slack'

export const slackSignatureMiddleware = async (services, wire, next) => {
  const signature = wire.http.request.header('x-slack-signature')
  const timestamp = wire.http.request.header('x-slack-request-timestamp')
  const body = await wire.http.request.text()

  const valid = verifySlackSignature(
    await services.secrets.getSecret('SLACK_SIGNING_SECRET'),
    signature,
    timestamp,
    body
  )
  if (!valid) {
    throw new Error('Invalid Slack signature')
  }
  await next()
}
```

`verifySlackSignature` also rejects requests older than five minutes, defending against replay attacks.

## Related

- [Gateway introduction](./index.md) — the adapter interface, transport types, and message formats
- [AI Agents](../ai-agents/index.md) — pair a Slack gateway with an agent for a conversational Slack bot
