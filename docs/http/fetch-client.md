---
sidebar_position: 4
title: Pikku Fetch
description: Pikku Fetch
---

You can interact with pikku using a thin wrapper around fetch that does type validation.

![Pikku Client](/img/pikku-fetch.gif)

### Creating the client

The pikku CLI can generate a `pikku-fetch.ts` file which would allow you to interact with your functions via http.

It has no client side dependencies, and is driven by a typescript type decalartion file so shouldn't take up any unnecessary space. 

In order to do so you can run `npx @pikku/cli fetch` and will need to have a `pikku.config.json` file within the `fetchFile` path set.

For example:

```json reference title="pikku.config.json"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/master/apps/cli/pikku.config.json
```

The example code seen above can be viewed here:

```typescript reference title="fetch.ts"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/master/apps/cli/bin/fetch.ts
```


For additional functionality or feature requests, please submit an issue on the [Pikku repository](https://github.com/pikkujs/pikku).