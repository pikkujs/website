import { createFetchClient } from '@pikku/client-fetch'

const api = createFetchClient({
  baseUrl: process.env.API_BASE_URL,
  token: userToken // Authentication token
})

// Type-safe API calls
const handleCreateTodo = async () => {
  try {
    // Full TypeScript intellisense and validation
    const todo = await api.post('/todos', {
      title: 'Learn Pikku',
      description: 'Build my first Pikku application'
    })
    
    console.log(`Created todo: ${todo.title} by ${todo.createdBy}`)
    return todo
  } catch (error) {
    console.error('Failed to create todo:', error)
    throw error
  }
}