import type { CoreConfig, CoreServices, CoreSingletonServices, CoreUserSession } from '@pikku/core/types'
import type { Kysely } from 'kysely'
import type { DB } from '#pikku/db/schema.gen.js'

export interface UserSession extends CoreUserSession {}

export interface Config extends CoreConfig {
  /** Path of the SQLite file `pikku dev` / `pikku serve` open. */
  sqliteDb?: string
}

export interface SingletonServices extends CoreSingletonServices<Config> {
  /** Injected by the runtime (pikku dev: node:sqlite; Cloudflare: D1). The site never builds its own dialect. */
  kysely: Kysely<DB>
}

export interface Services extends CoreServices<SingletonServices> {}
