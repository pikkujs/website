export const getUserProfile = pikkuSessionFunc<
  { userId: string },
  { id: string; name: string; email: string; organizationId: string }
>(async ({ logger, userService }, { userId }, session) => {
  // userSession provides authenticated user info
  logger.info(`Getting profile for user ${userId} from org ${session.organizationId}`)
  
  const user = await userService.findUserInOrganization({
    userId,
    organizationId: session.organizationId
  })
  
  if (!user) {
    throw new Error('User not found or access denied')
  }
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    organizationId: user.organizationId
  }
})

export const updateUserProfile = pikkuSessionFunc<
  { userId: string; name?: string; email?: string },
  { success: boolean; updatedAt: string }
>(async ({ userService }, { userId, ...updates }, session) => {
  await userService.updateUser(userId, updates, session.organizationId)
  
  return {
    success: true,
    updatedAt: new Date().toISOString()
  }
})

addRPCService({
  name: 'user-service',
  version: '1.0.0',
  methods: {
    getUserProfile,
    updateUserProfile,
  },
  auth: true
})