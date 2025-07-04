import { createRPCClient } from '@pikku/client-rpc'

const userService = createRPCClient({
  service: 'user-service',
  version: '1.0.0',
  baseUrl: process.env.API_BASE_URL,
  token: userToken // Authentication token
})

// Type-safe service calls
const handleUserOperations = async (userId: string) => {
  try {
    // Get user profile with full type safety
    const user = await userService.getUserProfile({ 
      userId 
    })
    
    console.log(`User: ${user.name} (${user.email})`)
    console.log(`Organization: ${user.organizationId}`)
    
    // Update user profile
    const updateResult = await userService.updateUserProfile({
      userId,
      name: 'New Name',
      email: 'new@example.com'
    })
    
    console.log(`Update successful: ${updateResult.success}`)
    console.log(`Updated at: ${updateResult.updatedAt}`)
    
    return user
  } catch (error) {
    console.error('User operation failed:', error)
    throw error
  }
}