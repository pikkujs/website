import { createWebSocketClient } from '@pikku/client-websocket'

const ws = createWebSocketClient({
  baseUrl: process.env.WS_BASE_URL,
  token: userToken // Authentication token
})

// Type-safe WebSocket communication
const handleChat = async () => {
  try {
    // Connect to authenticated channel
    const channel = await ws.connect('/chat')
    
    // Listen for messages with full type safety
    channel.onMessage((message) => {
      console.log(`${message.from}: ${message.message}`)
    })
    
    // Send type-safe messages
    await channel.send({
      action: 'sendMessage',
      message: 'Hello from Pikku!'
    })
    
  } catch (error) {
    console.error('Chat connection failed:', error)
  }
}