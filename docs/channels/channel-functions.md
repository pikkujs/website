---
sidebar_position: 10 
title: Channels Functions
description: The different functions used within channels
---

### `PikkuChannel` Interface

The `PikkuChannel` interface defines the essential components of a channel. It is **not created directly** by the user; instead, it is provided as part of the `ChannelConnection`, `ChannelDisconnection`, and `ChannelMessage` methods.

```typescript
export interface PikkuChannel<OpeningData, Out> {
  // The channel ID
  channelId: string;

  // The data the channel was created with, such as query parameters
  // or data in the URL
  openingData: OpeningData;

  // Sends data over the channel. Fails if the stream is closed
  send: (data: Out) => void;

  // Closes the channel
  close: () => void;

  // The current state of the channel
  state: 'initial' | 'open' | 'closed';
}
```

### Channel Method Types

There are three main method types used for handling channels. In each of these methods, the `PikkuChannel` object is provided as a parameter, pre-configured with the relevant data and functionality.

#### 1. **ChannelConnection**

The `ChannelConnection` method is triggered when a connection is first created. It allows you to perform initialization tasks or send a message immediately upon connection.

```typescript
const onConnect: ChannelConnection<'hello!'> = async (services, channel) => {
    channel.send('hello!');
}
```

- **Generic Argument**: `<Output>` specifies the types of data the method can send (e.g., `'hello!'` in this example).
- **Usage**: Ideal for sending a welcome message or performing setup operations when a connection is established.

---

#### 2. **ChannelDisconnection**

The `ChannelDisconnection` method is triggered when a connection is closed. It is useful for cleanup tasks or logging. Sending data from this method is not allowed and will result in a TypeScript error.

```typescript
export const onDisconnect: ChannelDisconnection = async (services, channel) => {
    services.logger.info('Disconnected from the channel');
}
```

- **Behavior**: Once this method is called, the channel is closed, and no further messages can be sent.
- **Common Use Case**: Logging disconnections or performing cleanup.

---

#### 3. **ChannelMessage**

The `ChannelMessage` method is triggered whenever data is received through the channel. It allows you to handle incoming data and send responses.

```typescript
export const onMessage: ChannelMessage<'hi!' | 'hey', 'hello' | 'ola'> = async (services, channel, data) => {
  if (data === 'hi!') {
    channel.send('hello');
  } else {
    channel.send('ola');
  }
}
```

- **Generic Arguments**:
  - `<Input>`: Specifies the types of data that can be received (e.g., `'hi!' | 'hey'`).
  - `<Output>`: Specifies the types of data that can be sent in response (e.g., `'hello' | 'ola'`).
- **Usage**: Handle incoming messages and send appropriate responses based on the received data.

---

### Summary

The `PikkuChannel` interface provides a robust abstraction for managing channel interactions. While you don’t create the channel directly, it is made available to you in the three key methods:
- **`ChannelConnection`**: For initializing and handling new connections.
- **`ChannelDisconnection`**: For managing cleanup tasks upon disconnection.
- **`ChannelMessage`**: For dynamically responding to incoming data.

By leveraging these methods, you can build type-safe and efficient real-time features tailored to your application's needs.
