export const createTodo = pikkuFunc<
  { title: string; description: string },
  { id: string; title: string; createdBy: string }
>(async ({ logger }, data, session) => {
  // userSession is passed as 3rd parameter
  const todo = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    createdBy: session.userId,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  logger.info(`Todo created by ${session.userId}`)
  return todo
})

addHTTPRoute({
  method: 'post',
  route: '/todos',
  func: createTodo,
  auth: true, // Requires authentication
  docs: {
    description: 'Create a new todo',
    tags: ['todos'],
  },
})