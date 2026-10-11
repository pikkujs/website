import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { blog } from '@/lib/source'
import { blogPayload } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { Suspense, use } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { Prose } from '@/components/mdx'

const serverLoader = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const p = blogPayload(slugs)
    if (!p) throw notFound()
    return p
  })

export const Route = createFileRoute('/blog/$')({
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? []
    const data = import.meta.env.SSR ? await serverLoader({ data: slugs }) : await fetchPayload<NonNullable<ReturnType<typeof blogPayload>>>(`/payload/blog/${slugs.join('/')}.json`)
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
