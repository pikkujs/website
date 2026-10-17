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
import { PinnedNav, TreeNav } from '@/components/TreeNav'
import { DocsHub } from '@/components/docs/DocsHub'
import { SectionHub } from '@/components/docs/SectionHub'
import { HubRow, HubSection } from '@/components/docs/HubRow'
import { PinButton } from '@/components/docs/pins'
import type { ChildRow, HubData } from '@/lib/docs-hub'
import { Toc } from '@/components/Toc'
import { pageHead, SITE } from '@/lib/seo'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, Menu, Pencil, X } from 'lucide-react'

const REPO = 'https://github.com/pikkujs/website/blob/main/content/docs/'

type DocData = { path: string; url: string; title: string; description?: string; ai?: boolean; hideTitle?: boolean; hub?: HubData; children?: ChildRow[] }
export const Route = createFileRoute('/docs/$')({
  component: Page,
  head: ({ loaderData }) => { const d = loaderData as DocData | undefined; return d ? pageHead({ title: d.title, description: d.description || undefined, path: d.url, jsonLd: { '@type': 'TechArticle', headline: d.title, description: d.description || undefined, url: SITE + d.url, publisher: { '@type': 'Organization', name: 'Pikku', url: SITE } } }) : {} },
  loader: async ({ params }): Promise<DocData & { pageTree: any }> => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? []
    // SSR/prerender call the functions directly; browser navigation reads prerendered static JSON (no server call)
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
/** Sibling pages in the same folder, for the "keep going" cards (the page itself and its neighbours excluded). */
const siblingsOf = (nodes: any[], url: string): any[] | null => {
  for (const n of nodes) {
    if (n.type !== 'folder') continue
    const kids = [...(n.index ? [n.index] : []), ...n.children.filter((c: any) => c.type === 'page')]
    if (kids.some((k: any) => k.url === url)) return kids
    const deeper = siblingsOf(n.children, url)
    if (deeper) return deeper
  }
  return null
}
const HUES = ['clay', 'moss', 'slate', 'ochre', 'rose'] as const

function Content({ path, tree, url, ai, hideTitle, hub, rows }: { path: string; tree: any; url: string; ai?: boolean; hideTitle?: boolean; hub?: HubData; rows?: ChildRow[] }) {
  const page = docs.getPage(path)
  if (!page) throw new Error(`unknown page: ${path}`)
  const loaded = use(page.load())
  const { toc } = loaded
  const MDX = page.body
  const components = useMDXComponents()
  const { previous, next } = findNeighbour(tree, url)
  const crumbs = getBreadcrumbItems(url, tree, { includePage: true })
  const related = (siblingsOf(tree.children, url) ?? []).filter((k: any) => k.url !== url && k.url !== previous?.url && k.url !== next?.url).slice(0, 3)
  const title = page.title ?? ''
  if (hub) return <><article className="doc-main"><DocsHub hub={hub} /></article><aside className="doc-toc" /></>
  return (
    <>
      <article className="doc-main">
        <div className="doc-top">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c: any, i: number) => <span key={i} className="crumb">{i > 0 && <ChevronRight size={12} aria-hidden />}{c.url && i < crumbs.length - 1 ? <Link to={c.url}>{c.name}</Link> : <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c.name}</span>}</span>)}
        </nav>
        <PinButton url={url} title={title} />
        </div>
        <Prose>{ai ? <AIDisclaimer /> : null}{hideTitle ? null : <h1 className="doc-title">{page.title ?? ''}</h1>}<MDX components={components} /></Prose>
        {rows?.length ? <SectionHub rows={rows} /> : null}
        <div className="doc-edit"><a href={REPO + path} target="_blank" rel="noreferrer"><Pencil size={14} aria-hidden /> Edit this page on GitHub</a></div>
        {related.length ? (
          <HubSection id="related" title="Keep going" blurb="More from this section.">
            {related.map((k: any, i: number) => <HubRow key={k.url} url={k.url} title={String(k.name)} icon="l:FileText" hue={HUES[i % HUES.length]} small />)}
          </HubSection>
        ) : null}
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
      <aside className="doc-side" aria-label="Documentation"><PinnedNav path={data.url} /><TreeNav nodes={data.pageTree.children} path={data.url} /></aside>
      <div className="doc-bar">
        <Dialog.Root open={menu} onOpenChange={setMenu}>
          <Dialog.Trigger className="doc-bar-btn"><Menu size={16} aria-hidden /> Docs menu</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="sheet-overlay" />
            <Dialog.Content className="sheet sheet-left" aria-describedby={undefined}>
              <div className="sheet-head"><Dialog.Title className="brand-name">Documentation</Dialog.Title><Dialog.Close className="nav-icon-btn" aria-label="Close menu"><X size={22} /></Dialog.Close></div>
              <div className="sheet-body"><PinnedNav path={data.url} onNavigate={() => setMenu(false)} /><TreeNav nodes={data.pageTree.children} path={data.url} onNavigate={() => setMenu(false)} /></div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <Suspense><Content path={data.path} tree={data.pageTree} url={data.url} ai={data.ai} hideTitle={data.hideTitle} hub={data.hub} rows={data.children} /></Suspense>
    </div>
  )
}
