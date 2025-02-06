---
title: Fastify
description: Using Pikku with Fastify
---

# Using Fastify Plugin

Pikku can be / is best used within fastify as a plugin.

```typescript title="Fastify plugin"
import pikkuFastifyPlugin from '@pikku/fastify-plugin'

import { createSingletonServices, createSessionServices } from 'path/to/pikku-bootstrap.ts'

// The fastify server setup goes here...

const singletonServices = await createSingletonServices()
app.register(pikkuFastifyPlugin, {
   pikku: {
      singletonServices,
      createSessionServices,
      respondWith404: true,
      logRoutes: true,
      loadSchemas: true
   }
})
```

# Using PikkuFastifyServer

:::note
The setup process for Express, uWS, and Fastify servers are identical, except for using different constructors.
:::

PikkuFastifyServer is a quick way to get a fastify server started with pikku if you don't need to put in any custom configuration. 

```typescript reference title="Test"
https://raw.githubusercontent.com/pikku/workspace-starter/blob/master/backends/fastify/bin/start.ts
```

This script does the following:

1. Imports necessary modules from `@pikku/fastify` and your project's configuration and services.
2. Defines an async function `runServer` that:
   - Loads the Pikku configuration
   - Creates singleton services
   - Initializes a new `PikkuFastifyServer` instance
   - Enables graceful shutdown on SIGINT
   - Initializes and starts the server
3. Handles any errors by logging them and exiting the process
4. Calls the `runServer` function to start the server

By following this setup, you can easily integrate Pikku with a Fastify server, benefiting from both Pikku's features and Fastify's performance.