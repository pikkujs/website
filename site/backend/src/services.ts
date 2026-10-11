import { JsonConsoleLogger, LocalSecretService, LocalVariablesService } from '@pikku/core/services'
import { CFWorkerSchemaService } from '@pikku/schema-cfworker'
import { pikkuServices, pikkuWireServices } from '#pikku/setup'

export const createSingletonServices = pikkuServices(async (config, existingServices) => {
  const variables = existingServices?.variables ?? new LocalVariablesService()
  const logger = existingServices?.logger ?? new JsonConsoleLogger()
  const schema = existingServices?.schema ?? new CFWorkerSchemaService(logger)
  const secrets = existingServices?.secrets ?? new LocalSecretService(variables)
  if (!existingServices?.kysely) throw new Error('kysely was not injected by the runtime')
  return { config, logger, variables, schema, secrets, kysely: existingServices.kysely }
})

export const createWireServices = pikkuWireServices(async () => ({}))
