---
sidebar_position: 20
title: Channel Routes
description: Mapping a channel messages to functions 
---

## Introduction to Channel Routes

API routes in Pikku serve as the entry points for handling Channels (as of now this is just websockets). When a request is made, an API route listens on the specified path and processes the request by calling a function. The process involves:

- **Extracting the session (if possible)**
- **Calling the onConnection method (if available)**
- **Routing messages recieved to the approtatie function**
- **Calling the onDisconnection method (if available)**

## Defining API Routes

An channel route is a configuration object that defines the behavior for a specific channel request. Here is an example that demonstrates setting up routes for fetching and updating a book:

```typescript reference title="events.channel.ts"
https://raw.githubusercontent.com/pikku/workspace-starter/blob/master/packages/functions/src/functions/events/events.channel.ts
```