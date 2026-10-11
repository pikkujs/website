import { pikkuConfig } from '#pikku/setup'

export const createConfig = pikkuConfig(async () => ({
  sqliteDb: process.env.SITE_DB ?? '.pikku-runtime/dev.db',
}))
