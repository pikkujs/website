import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { docs } from '@/lib/source'
import { docPayload, docsTree } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { findNeighbour } from 'fumadocs-core/page-tree'
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb'
import { Suspense, use } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { Prose } from '@/components/own-mdx'
import { TreeNav } from '@/components/TreeNav'

type DocData = { path: string; url: string; title: string }
export const Route = createFileRoute('/docs/$')({
  component: Page,
  head: ({ loaderData }) => { const d = loaderData as DocData | undefined; return d ? { meta: [{ title: `${d.title} | Pikku` }, { name: 'source-file', content: 'content/docs/' + d.path }] } : {} },
  loader: async ({ params }): Promise<DocData & { pageTree: any }> => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? []
    // SSR/prerender call the functions directly; browser navigation reads prerendered static JSON (no Worker call)
    const [data, pageTree] = (import.meta.env.SSR
      ? await Promise.all([serverLoader({ data: slugs }), treeLoader()])
      : await Promise.all([fetchPayload<DocData>(`/payload/docs/${slugs.length ? slugs.join('/') : 'index'}.json`), fetchPayload<Awaited<ReturnType<typeof docsTree>>>('/payload/docs-tree.json')])) as [DocData, Awaited<ReturnType<typeof docsTree>>]
    await docs.getPage(data.path)?.preload()
    return { ...data, pageTree } as DocData & { pageTree: any }
  },
})
const serverLoader = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const p = docPayload(slugs)
    if (!p) throw notFound()
    return p
  })
const treeLoader = createServerFn({ method: 'GET' })
  .handler(async () => docsTree())
function Content({ path, tree, url }: { path: string; tree: any; url: string }) {
  const page = docs.getPage(path)
  if (!page) throw new Error(`unknown page: ${path}`)
  const { toc } = use(page.load())
  const MDX = page.body
  const { previous, next } = findNeighbour(tree, url)
  const crumbs = getBreadcrumbItems(url, tree, { includePage: true })
  return (
    <>
      <main className="min-w-0 flex-1 py-8">
        <nav className="mb-4 flex gap-1 text-sm text-muted-foreground">{crumbs.map((c: any, i: number) => <span key={i}>{i ? '/ ' : ''}{c.url ? <Link to={c.url}>{c.name}</Link> : c.name}</span>)}</nav>
        <Prose><h1>{page.title ?? ''}</h1><MDX components={useMDXComponents()} /></Prose>
        <div className="mt-12 flex justify-between border-t border-border pt-6 text-sm">
          {previous ? <Link to={previous.url}>&larr; {previous.name}</Link> : <span />}{next ? <Link to={next.url}>{next.name} &rarr;</Link> : <span />}
        </div>
      </main>
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-auto py-8 xl:block"><div className="mb-2 text-xs font-semibold uppercase">On this page</div>
        <ul className="space-y-1 text-sm">{toc.map((t: any) => <li key={t.url} style={{ paddingLeft: (t.depth - 2) * 12 }}><a href={t.url}>{t.title}</a></li>)}</ul></aside>
    </>
  )
}
function Page() {
  const data = useFumadocsLoader(Route.useLoaderData()) as DocData & { pageTree: any }
  return (
    <div className="mx-auto flex max-w-[90rem] gap-8 px-4">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-auto py-6 lg:block"><TreeNav nodes={data.pageTree.children} path={data.url} /></aside>
      <Suspense><Content path={data.path} tree={data.pageTree} url={data.url} /></Suspense>
    </div>
  )
}
