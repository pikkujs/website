export const streamUserActivity = pikkuFunc<
  void,
  AsyncGenerator<{ timestamp: string; activity: string; userId: string }>
>(async function* ({ logger }, data, session) {
  // userSession provides authenticated user info
  logger.info(`Starting activity stream for user ${session.userId}`)
  
  let count = 0
  while (true) {
    yield {
      timestamp: new Date().toISOString(),
      activity: `User activity update #${++count}`,
      userId: session.userId
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
})

addHTTPRoute({
  method: 'get',
  route: '/stream/activity',
  func: streamUserActivity,
  auth: true, // Requires authentication
  responseType: 'stream',
  docs: {
    description: 'Stream user activity updates',
    tags: ['streaming'],
  },
})