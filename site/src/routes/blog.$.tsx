import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions'
import { blog, blogSource } from '@/lib/source'
import { Suspense, use } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { Prose } from '@/components/own-mdx'

const serverLoader = createServerFn({ method: 'GET' }).middleware([staticFunctionMiddleware])
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = blogSource.getPage(slugs)
    if (!page) throw notFound()
    return { path: page.path, url: page.url, title: page.data.title ?? '', date: slugs.slice(0, 3).join('-') }
  })

export const Route = createFileRoute('/blog/$')({
  loader: async ({ params }) => {
    const data = await serverLoader({ data: params._splat?.split('/').filter(Boolean) ?? [] })
    await blog.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) => loaderData ? { meta: [{ title: `${loaderData.title} | Pikku Blog` }, { name: 'source-file', content: 'content/blog/' + loaderData.path }] } : {},
  component: Page,
})
function Body({ path }: { path: string }) {
  const page = blog.getPage(path)!
  use(page.load())
  const MDX = page.body
  return <MDX components={useMDXComponents()} />
}
function Page() {
  const d = Route.useLoaderData()
  return <main className="mx-auto max-w-3xl px-4 py-10"><Prose><h1>{d.title}</h1><p className="text-sm text-muted-foreground">{d.date}</p><Suspense fallback={null}><Body path={d.path} /></Suspense></Prose></main>
}
