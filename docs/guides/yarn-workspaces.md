---
title: Yarn Workspaces  
---

Separating components into packages within a repo can offer several advantages, such as:

1. Clear seperation of concerns
2. Supporting different deployment strategies
3. Reducing the pain and effort of private npm repo management without losing any of the benefits

To simplify the process, this documentation focuses on working with the [workspace starter](https://github.com/pikku/workspace-starter). The workspace name is *todos*.

```bash
git clone git@github.com:pikku/yarn-workspace-starter.git
```

Upon cloning, the following folder structure will be present:

```bash
backends/
    express/
        bin/
            start.ts
        package.json
    fastify/
        ...
    uws/
        ...
apps/
    next-app/
        ...
packages/
    functions/
        src/
            events/
                events.functions.ts
                events.channel.ts
            todo/
                todo.functions.ts
                todo.http.ts
            user/
                user.functions.ts
                user.http.ts
        api.ts
        services.ts
        config.ts
        package.json
    services/
        src/
           kysely.ts
           pino.ts
    sdk/
        types/
            todo.types.ts
            user.types.ts
sql/
    0001-initial.sql
package.json
```

This structure resembles previous project setups but is now organized into individual workspaces. The benefit of this approach is the ability to deploy multiple backends seamlessly while sharing types across the entire codebase. This allows each backend to focus on specific routes, whether used for microservices or for integrating functions into other services, such as Next.js.

This section provides an overview of each package and its functionality.

## Functions Packages 

The concept of functions was covered in the overview tutorial. The primary changes in this section are as follows:

- The `main.ts` and `pikku.config.json` files have been moved to the `backends/express/` folder.
- All types are now imported from the SDK directory.

## DataBase


Databases are often the foundation of most applications. Although this may not apply universally, without data, an application is typically just a shell.

There are various types of databases, and a single database can use different systems such as ORMs, SQL builders, or pure SQL.

[Kysely](https://kysely.dev/) is a highly recommended TypeScript-enabled API that allows SQL queries to be built with type-checking directly against the database.

*Note*: While Kysely may not be suitable for everyone, the documentation will proceed accordingly. Requests for new databases or contributions can be made [here](https://github.com/pikku/pikku-website/issues/1).

### Database Migration

To create or migrate the database, the [postgres-migrations](https://www.npmjs.com/package/postgres-migrations) package is used. Although somewhat outdated, it remains effective.

The provided migration script offers a few key benefits:

1. In production, it retrieves PostgreSQL credentials from AWS secrets (within *userland*) and proceeds with the migration.
2. In local environments, it performs the migration on the local database.

The migration script can be run with the following command:

```bash
yarn run db:migrate
```

This command triggers the following script:

```typescript title="scripts/db-migrate.ts"
import pino from 'pino'
import { Client } from 'pg'
import { migrate } from 'postgres-migrations'

import { AWSSecrets } from '@pikku/aws/aws-secrets'
import { config } from '@mindwave/functions/src/config'
import { getDatabaseConfig } from '@mindwave/functions/src/services'

export const migrateDB = async () => {
  const logger = pino()
  logger.level = 'error'

  const secrets = new AWSSecrets(config)
  const databaseConfig = await getDatabaseConfig(secrets, config.secrets.postgresCredentials, config.sql)

  const client = new Client({
    ...databaseConfig,
    ssl: config.sql.ssl
  })

  await client.connect()

  try {
    await client.query(`CREATE DATABASE ${config.sql.database}`)
  } catch (e) {
    console.log('Database already exists')
  }
  
  await migrate({ client }, `${__dirname}/../sql`, { logger: undefined })
  await client.end()
}

migrateDB()
```

### Database Types

Once the database is running, types need to be generated. [Kysely codegen](https://github.com/RobinBlomberg/kysely-codegen) is a useful tool for this.

The types generated are tailored to the Kysely driver. However, a cleanup script is available to transform them into more familiar TypeScript, making them usable across schemas, frontend, and backend code.

```bash
yarn run kysely-pure
```

The cleanup script looks like this:

```typescript title="scripts/kysely-pure.ts"
import { readFile, writeFile } from "fs/promises"

const main = async () => {
    let kysely = await readFile(`${__dirname}/../node_modules/kysely-codegen/dist/db.d.ts`, 'utf8')
    kysely = kysely
        .replace(/import type { ColumnType } from "kysely";/, '')
        .replace(new RegExp('^export\\s+type\\s+Generated<[^>]+>.*?;\\s*$', 'ms'), '')
        .replace(/Generated<(.*)>/g, '$1')
        .replace(/export type Timestamp =.*;/, 'export type Timestamp = Date' )
        console.log('Writing kysely-pure.d.ts')
    
    await writeFile(`${__dirname}/../node_modules/kysely-codegen/dist/db-pure.d.ts`, kysely)
}

main()
```

### Database Service

The database function is housed in `functions/database.service.ts`. This simple wrapper around Kysely ensures that database initialization is kept separate.

```typescript title="packages/functions/src/kysely.service.ts"
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'

export class KyselyDB {
    public kysely: Kysely<DB>
    public pool: Pool

    constructor(config: any) {
        this.pool = new Pool(config)
        this.kysely = new Kysely<DB>({
            dialect: new PostgresDialect({
                pool: this.pool
            }),
            plugins: [
                new CamelCasePlugin()
            ]
        })
    }
}
```

### Using the Database

To use the database in functions or routes, add it to the services as shown below:

```typescript file="packages/functions/src/kysely.services.ts"
export const getDatabaseConfig = async (
  secrets: SecretService, 
  postgresSecret: string, 
  sqlConfig: SQLConfig
) => {
    if (process.env.NODE_ENV === 'production') {
      const config = await secrets.getSecret(postgresSecret)
      return { 
        config,
        ssl: sqlConfig.ssl
      }
    } else {
      return {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'password',
        database: sqlConfig.database
      }
    }
}

const createServices = async () => {
  const databaseConfig = await getDatabaseConfig(
    secrets, 
    config.secrets.postgresSecret, 
    config.sql
  )
  const { kysely } = new KyselyDB(databaseConfig)
}
```

With this setup, full TypeScript support is available throughout the codebase, based directly on the database schema.

```typescript
await services.kysely
  .insertInto('app.websiteNewsletter')
  .values({ email }) 
  .execute()
```

## SDK

The SDK directory would normally contain all types, routes, and the necessary HTTP calls to interact with the server.

Although it is not yet auto-generated (see [issue](https://github.com/pikku/pikku/issues/7)) like in [tRPC](https://trpc.io/), the current setup has the advantage of not relying on a third-party library.
