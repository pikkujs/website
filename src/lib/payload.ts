import { source, blogSource } from './source'

/**
 * Metadata-only payloads for docs and blog. They are the single source of truth for both
 * paths a page can be loaded by:
 *  - SSR / prerender: the route loader calls a server function that returns these directly;
 *  - client navigation: the loader fetches the same JSON from /payload/*.json, which is
 *    prerendered into the static assets, so no Worker (and no MDX) is involved.
 */
export const docPayload = (slugs: string[]) => {
  const page = source.getPage(slugs)
  return page ? { path: page.path, url: page.url, title: page.data.title ?? '' } : null
}
export const docsTree = async () => source.serializePageTree(source.getPageTree())

export const blogPayload = (slugs: string[]) => {
  const page = blogSource.getPage(slugs)
  return page ? { path: page.path, url: page.url, title: page.data.title ?? '', date: slugs.slice(0, 3).join('-') } : null
}
export const blogList = () =>
  blogSource.getPages().map((p) => ({ url: p.url, title: p.data.title ?? '', description: p.data.description ?? '', date: p.slugs.slice(0, 3).join('-') })).sort((a, b) => b.date.localeCompare(a.date))

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
/** "a/b.json" -> ["a","b"]; "index.json" -> [] */
export const slugsOf = (splat: string | undefined) => (splat ?? '').replace(/\.json$/, '').split('/').filter((s) => s && s !== 'index')
