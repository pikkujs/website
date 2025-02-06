---
title: WebSocket
description: Using Pikku with WS
---

# Using WS Handler

You can allow WS to start handling websockets by using the **pikkuWebsocketHandler**

:::note
You need to pass in the HTTP server seperately in order
to allow upgrades to correctly work. We can alter this in
the future if needed by providing more than one access point
to running channels.
:::

```typescript reference title="WS start"
https://raw.githubusercontent.com/pikku/workspace-starter/blob/master/backends/ws/bin/start.ts
```