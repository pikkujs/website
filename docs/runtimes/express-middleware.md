---
title: Express
description: Using Pikku with Express
hide_title: true
image: /img/logos/express-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku can be added to an express server via `middleware`, or you can just use the `PikkuExpressServer` if everything is using pikku.

## Using Express Middleware

Pikku can be / is best used within express as a middleware function.

```typescript title="Express middleware"
import { pikkuExpressMiddleware } from '@pikku/express-middleware'

import { createSingletonServices, createSessionServices } from 'path/to/pikku-bootstrap.ts'

// The express server setup goes here...

const singletonServices = await createSingletonServices()
app.use(pikkuExpressMiddleware(
   singletonServices, 
   createSessionServices, 
   {
      respondWith404: false,
      logRoutes: true,
      loadSchemas: true
   }
))
```

# Using PikkuExpressServer 

:::note
The setup process for Express, uWS, and Fastify servers are identical, except for using different constructors.
:::

PikkuExpressServer is a quick way to get an express server started with pikku if you don't need to put in any custom configuration. 

```typescript reference title="Express start"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/master/backends/express/bin/start.ts
```

This script does the following:

1. Imports necessary modules from `@pikku/express` and your project's configuration and services.
2. Defines an async function `runServer` that:
   - Loads the Pikku configuration
   - Creates singleton services
   - Initializes a new `PikkuExpressServer` instance
   - Enables graceful shutdown on SIGINT
   - Initializes and starts the server
3. Handles any errors by logging them and exiting the process
4. Calls the `runServer` function to start the server

By following this setup, you can easily integrate Pikku with a Express server, benefiting from both Pikku's features and Express's ecosystem.