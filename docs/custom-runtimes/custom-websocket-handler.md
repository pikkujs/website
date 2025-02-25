---
sidebar_position: 40
title: Custom Channel Runtime
image: /img/logos/custom-light.svg
hide_title: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

:::info
This is still a work in progress as websockets have a few different aspects in order to work in a distributed fashion.
:::

There are two different ways we can deal with channels, both local and serverless. The implementation is slightly different, since running them locally (like with uWebsockets or ws) means we can skip alot of serverless state management and is more performant, but doesn't scale the same way or provide the benefits of serverless deployments.

## Interfaces used

Creating a websocket handler requires us to understand a few concepts:

1) EventHubStore
2) ChannelStore

## Local Channels

As a high level overview, it ties to the normal websocket lifecycle events:

1) `onUpgrade` 

On upgrade we get a channelHandler, which is our interface to the Pikku framework

```typescript
const request = new PikkuUWSRequest(req, res)
const response = new PikkuUWSResponse(res)

const channelHandler = await runLocalChannel({
    channelId: crypto.randomUUID().toString(),
    request,
    response,
    singletonServices: singletonServicesWithEventHub,
    createSessionServices,
    route: req.getUrl() as string,
})
```

2) `onOpen`

On Open we:

- register the send method
- we call onChannel opened on our eventHub
- we call open on the channel handler

:::info
We do both these things since we want to allow Pikku to be as minimal as possible and not need to wrap the websocket objects.
:::

```typescript
open: (ws) => {
    const { channelHandler } = ws.getUserData()
    channelHandler.registerOnSend((data) => {
    if (isSerializable(data)) {
        ws.send(JSON.stringify(data))
    } else {
        ws.send(data as any)
        }
    })
    eventHub.onChannelOpened(channelHandler.channelId, ws)
    channelHandler.open()
}
```

3) `onMessage`

When we recieve a message we decode it and provide it to the channel handler. Vramework allows direct responses to messages (which means we can wire up non-stream based functions to methods), so we need to send results back if provided. This is also in sync with how AWS lambda websockets can work.

```typescript
 message: async (ws, message, isBinary) => {
    const { channelHandler } = ws.getUserData()
    const data = isBinary ? message : decoder.decode(message)
    const result = await channelHandler.message(data)
    if (result) {
        // TODO: This doesn't deal with binary results
        ws.send(JSON.stringify(result))
    }
}
```

4) `onClose`

This cleans up the channel

```typescript
close: (ws) => {
    const { channelHandler } = ws.getUserData()
    eventHub.onChannelClosed(channelHandler.channelId)
    channelHandler.close()
}
```

## Serverless Integration

Serverless websockets usually means that a function is invoked without the state necessarily being on the machine that owns the websocket connection.

Think of it as if you have a loadbalancer that accepts websocket connections, which then fans out events to different processes.

As such, we now need to find a way to distribute state so that  user code can continue working as if it's local.

What this means in Pikku is:

1) The EventHubConnections need to be stored in some form of distributed memory
2) The Channels need to be stored in some form of distributed memory

Looking at aws lambda websockets:

1) `onOpen`

```typescript
export const connectWebsocket = async <
  SingletonServices extends CoreSingletonServices,
  Services extends CoreServices<SingletonServices>,
  UserSession extends CoreUserSession,
>(
  event: APIGatewayEvent,
  {
    singletonServices,
    createSessionServices,
    channelStore,
  }: WebsocketParams<SingletonServices, Services, UserSession>
): Promise<APIGatewayProxyResult> => {
  const runnerParams = getServerlessDependencies(
    singletonServices.logger,
    channelStore,
    event
  )
  const request = new PikkuAPIGatewayLambdaRequest(event)
  const response = new PikkuAPIGatewayLambdaResponse()
  await runChannelConnect({
    ...runnerParams,
    request,
    response,
    singletonServices: singletonServices as any,
    createSessionServices: createSessionServices as any,
    route: event.path || '/',
  })
  return response.getLambdaResponse()
}
```

2) `onOpen`