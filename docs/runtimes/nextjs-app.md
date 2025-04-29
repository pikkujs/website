---
title: NextJS
description: Using Pikku with NextJS App Router
hide_title: true
image: /img/logos/nextjs-light.png
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

:::info
The pikku nextjs integration currently only supports nextJS version 15, as it introduced breaking changes when it comes to headers.

The App Router is still in development, with some APIs having an `_unstable` prefix. As a result, certain features like caching may not function as intended yet.

We can add support to version 14 if there's enough interest.
:::

Deploying Pikku with NextJS allows for code separation benefits without running a separate server, while also leveraging NextJS Server-Side Rendering (SSR) capabilities.

![NextJS Coding](/img/nextjs-coding.gif)

### Setting up Pikku

The pikku CLI can generate a `pikku-next.ts` file which would allow you to directly interact with your functions.

In order to do so you can run `npx @pikku/cli all` or target it specifically with `npx @pikku/cli next`  and will need to have a `nextBackendFile` property set within your `pikku config`.

For example:

```json reference title="pikku.config.json"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/master/apps/next-app/pikku.config.json
```

For additional functionality or feature requests, please submit an issue on the [Pikku repository](https://github.com/pikkujs/pikku).

### Server-side Actions

Invoke server-side actions by calling the Pikku action request with the method, route, and data.

```typescript
async function addTodo(text: string) {
  'use server'
  await pikku().post(
    '/todo',
    { text }
  )
}
```

### SSR Loading

Load data directly via the API within pages by referencing it in the function:

```typescript
export default async function TodoPage() {
  const todos: Todos = await pikku().get(
    '/todos'
    null
  )
  return <TodosCard todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} />
}
```

### Static SSR Loading

For when your server side rendering isn't based on the user session (for example during build-time), you can use `staticGet`. This skips accessing the `headers`.

```typescript
export default async function TodoPage() {
  const todos: Todos = await pikku().staticGet(
    '/todos',
    null
  )
  return <TodosCard todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} />
}
```
