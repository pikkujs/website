---
title: uWebSockets
description: Using Pikku with uWS
hide_title: true
image: /img/logos/uws-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku can be / is best used within uws as a handler.

```typescript title="uWS Handler"
import { pikkuHTTPHandler, pikkuWebsocketHandler } from '@pikku/uws-handler'

import { createSingletonServices, createSessionServices } from 'path/to/pikku-bootstrap.ts'

// The uws server setup goes here...

const singletonServices = await createSingletonServices()
this.app.any(
   '/*',
   pikkuHTTPHandler({
      logRoutes: true,
      singletonServices: this.singletonServices,
      createSessionServices: this.createSessionServices,
   })
   )

   this.app.ws(
   '/*',
   pikkuWebsocketHandler({
      logRoutes: true,
      singletonServices: this.singletonServices,
      createSessionServices: this.createSessionServices,
   })
)
```

## Using PikkuUWSServer

:::note
The setup process for Express, uWS, and Fastify servers are identical, except for using different constructors.
:::

PikkuUWSServer is a quick way to get a fastify server started with pikku if you don't need to put in any custom configuration. 

```typescript reference title="Test"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/main/backends/uws/bin/start.ts
```

This script does the following:

1. Imports necessary modules from `@pikku/uws` and your project's configuration and services.
2. Defines an async function `runServer` that:
   - Loads the Pikku configuration
   - Creates singleton services
   - Initializes a new `PikkuUWSServer` instance
   - Enables graceful shutdown on SIGINT
   - Initializes and starts the server
3. Handles any errors by logging them and exiting the process
4. Calls the `runServer` function to start the server

By following this setup, you can easily integrate Pikku with a uWS server, benefiting from both Pikku's features and uWS's performance.
