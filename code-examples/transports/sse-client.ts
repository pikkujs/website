import { createSSEClient } from '@pikku/client-sse'

const sse = createSSEClient({
  baseUrl: process.env.API_BASE_URL,
  token: userToken // Authentication token
})

// Type-safe streaming
const handleActivityStream = async () => {
  try {
    // Connect to authenticated stream
    const stream = await sse.connect('/stream/activity')
    
    // Listen for streaming data with full type safety
    stream.onMessage((update) => {
      console.log(`${update.timestamp}: ${update.activity}`)
      console.log(`User: ${update.userId}`)
    })
    
    stream.onError((error) => {
      console.error('Stream error:', error)
    })
    
    // Stream will automatically reconnect on connection loss
    
  } catch (error) {
    console.error('Failed to start activity stream:', error)
  }
}