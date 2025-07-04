export const dailyReportTask = pikkuVoidFunc(
  async ({ logger, emailService, analyticsService }) => {
    try {
      // Generate daily metrics report
      const metrics = await analyticsService.getDailyMetrics()
      
      // Send report to admin team
      await emailService.sendReport({
        to: 'admin@company.com',
        subject: 'Daily Metrics Report',
        data: {
          totalUsers: metrics.activeUsers,
          totalRequests: metrics.apiCalls,
          avgResponseTime: metrics.avgResponseTime,
          date: new Date().toISOString().split('T')[0]
        }
      })
      
      logger.info(`Daily report sent - ${metrics.activeUsers} active users`)
    } catch (error) {
      logger.error('Failed to generate daily report:', error)
      throw error // Will trigger retry logic
    }
  }
)

addScheduledTask({
  name: 'dailyReport',
  schedule: '0 8 * * *', // Daily at 8 AM
  func: dailyReportTask,
  timezone: 'America/New_York',
  docs: {
    description: 'Generate and send daily metrics report',
    tags: ['reports', 'analytics'],
  },
})