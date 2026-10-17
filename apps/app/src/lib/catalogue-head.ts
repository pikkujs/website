import { pageHead } from '@/lib/seo'

/** <head> for an addon detail page. Shared by the static build's route and the Worker's, so they cannot drift. */
export function addonHead(loaderData: { title?: string; description?: string | null } | undefined, slug: string) {
  const name = loaderData?.title ?? slug
  const d = loaderData?.description ?? ''
  // thin vendor blurbs get a consistent tail so snippets stay useful (and distinct per addon)
  const description = d.length >= 70 ? d : `${d ? d.replace(/\.?$/, '. ') : ''}The ${name} addon gives Pikku typed ${name} functions, callable over RPC with secrets and auth wired in.`
  return pageHead({ title: `${name} addon`, description, path: `/addons/${slug}` })
}

/** <head> for an OpenAPI detail page. */
export function openApiHead(loaderData: { title?: string; name?: string } | undefined, slug: string) {
  const name = loaderData?.title ?? loaderData?.name ?? slug
  // one vendor client spans many specs (Azure SQL has ~70): the last slug segment tells them apart
  const tail = slug.split('-').pop() ?? ''
  const part = tail && !name.toLowerCase().includes(tail) ? `: ${tail}` : ''
  return pageHead({
    title: `${name} OpenAPI${part}`,
    description: `Generate a typed Pikku addon from the ${name} OpenAPI specification (${slug}), with typed functions callable over RPC and secrets and auth wired in.`,
    path: `/openapis/${slug}`,
  })
}
