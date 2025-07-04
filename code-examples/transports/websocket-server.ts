export const onConnect = pikkuChannelConnectionFunc<{ welcome: string }>(
  async ({ logger, channel }, session) => {
    logger.info(`User ${session.userId} connected to chat`)
    channel.send({
      welcome: `Welcome ${session.username}!`
    })
  }
)

export const sendMessage = pikkuChannelFunc<
  { message: string },
  { timestamp: string; from: string; message: string }
>(async ({ channel, eventHub }, data, session) => {
  // userSession provides authenticated user info
  const chatMessage = {
    timestamp: new Date().toISOString(),
    from: session.username,
    message: data.message
  }
  
  await eventHub?.publish('chat', channel.channelId, chatMessage)
  return chatMessage
})

addChannel({
  name: 'chat',
  route: '/chat',
  onConnect,
  auth: true, // Requires authentication
  onMessageRoute: {
    action: {
      sendMessage,
    },
  },
})