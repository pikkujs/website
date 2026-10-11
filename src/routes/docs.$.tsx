import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { docs } from '@/lib/source'
import { docPayload, docsTree } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { findNeighbour } from 'fumadocs-core/page-tree'
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb'
import { Suspense, use, useState } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { Prose } from '@/components/mdx'
import { AIDisclaimer } from '@/components/AIDisclaimer'
import { TreeNav } from '@/components/TreeNav'
import { Toc } from '@/components/Toc'
import { pageHead } from '@/lib/seo'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, Menu, Pencil, X } from 'lucide-react'

const REPO = 'https://github.com/pikkujs/website/blob/main/content/docs/'

type DocData = { path: string; url: string; title: string; description?: string }
export const Route = createFileRoute('/docs/$')({
  component: Page,
  head: ({ loaderData }) => { const d = loaderData as DocData | undefined; return d ? pageHead({ title: d.title, description: d.description || undefined, path: d.url, extra: [{ name: 'source-file', content: 'content/docs/' + d.path }] }) : {} },
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
  const loaded = use(page.load())
  const { toc } = loaded
  const fm = ((loaded as any).frontmatter ?? {}) as Record<string, unknown>
  const MDX = page.body
  const { previous, next } = findNeighbour(tree, url)
  const crumbs = getBreadcrumbItems(url, tree, { includePage: true })
  return (
    <>
      <article className="doc-main">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c: any, i: number) => <span key={i} className="crumb">{i > 0 && <ChevronRight size={12} aria-hidden />}{c.url && i < crumbs.length - 1 ? <Link to={c.url}>{c.name}</Link> : <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c.name}</span>}</span>)}
        </nav>
        <Prose>{fm.ai ? <AIDisclaimer /> : null}{fm.hide_title ? null : <h1>{page.title ?? ''}</h1>}<MDX components={useMDXComponents()} /></Prose>
        <div className="doc-edit"><a href={REPO + path} target="_blank" rel="noreferrer"><Pencil size={14} aria-hidden /> Edit this page on GitHub</a></div>
        <nav className="pager" aria-label="Previous and next page">
          {previous ? <Link to={previous.url as any} className="pager-link"><small>Previous</small><span>&larr; {previous.name}</span></Link> : <span />}
          {next ? <Link to={next.url as any} className="pager-link pager-next"><small>Next</small><span>{next.name} &rarr;</span></Link> : <span />}
        </nav>
      </article>
      <aside className="doc-toc"><Toc items={toc as any} /></aside>
    </>
  )
}
function Page() {
  const data = useFumadocsLoader(Route.useLoaderData()) as DocData & { pageTree: any }
  const [menu, setMenu] = useState(false)
  return (
    <div className="doc-shell">
      <aside className="doc-side" aria-label="Documentation"><TreeNav nodes={data.pageTree.children} path={data.url} /></aside>
      <div className="doc-bar">
        <Dialog.Root open={menu} onOpenChange={setMenu}>
          <Dialog.Trigger className="doc-bar-btn"><Menu size={16} aria-hidden /> Docs menu</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="sheet-overlay" />
            <Dialog.Content className="sheet sheet-left" aria-describedby={undefined}>
              <div className="sheet-head"><Dialog.Title className="brand-name">Documentation</Dialog.Title><Dialog.Close className="nav-icon-btn" aria-label="Close menu"><X size={22} /></Dialog.Close></div>
              <div className="sheet-body"><TreeNav nodes={data.pageTree.children} path={data.url} onNavigate={() => setMenu(false)} /></div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <Suspense><Content path={data.path} tree={data.pageTree} url={data.url} /></Suspense>
    </div>
  )
}
