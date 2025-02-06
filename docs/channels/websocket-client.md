---
sidebar_position: 30
title: Websocket Client
description: Pikku Websocket Client
---

### Creating the client

The pikku CLI can generate a `pikku-websocket.ts` file which would allow you to interact with your channels.

It has no client side dependencies, and is driven by a typescript type decalartion file so shouldn't take up any unnecessary space. 

In order to do so you can run `npx @pikku/cli websocket` and will need to have a `websocketFile` within the `pikku.config.json` file  set.

```typescript reference title="websocket.ts"
https://raw.githubusercontent.com/pikku/workspace-starter/blob/master/apps/cli/bin/websocket.ts
```
