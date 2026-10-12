import { source, blogSource } from '@/lib/source'

/** Compact search index: [url, title, description, [[headingId, headingText], ...]] per page.
 *  Titles, descriptions and headings only (about 0.3 MB), not full text: the palette finds pages and sections. */
export type SearchRow = [url: string, title: string, description: string, headings: [string, string][]]

// Marketing pages are not in the content tree; list the ones worth finding.
const SITE_PAGES: SearchRow[] = [
  ['/getting-started', 'Getting started', 'Create a project, run npx pikku dev, deploy', []],
  ['/features', 'Features', 'Two concepts, eleven wire types', []],
  ['/developers', 'For developers', 'One function, every wiring', []],
  ['/benchmarks', 'Benchmarks', 'Express, Fastify, uWS and in-process fetch compared', []],
  ['/api', 'SDK reference', 'Everything Pikku gives you to import', []],
  ['/addons', 'Addon catalogue', 'Typed functions for hundreds of services', []],
  ['/openapis', 'OpenAPI catalogue', 'Generate typed addons from OpenAPI specifications', []],
  ['/core/function', 'Pikku functions', 'Write once, wire everywhere', []],
  ['/core/services', 'Services', 'pikkuServices and pikkuWireServices', []],
  ['/core/security', 'Sessions and permissions', 'One security API, every transport', []],
  ['/core/secrets', 'Secrets and variables', 'Typed config with Zod', []],
  ['/core/versioning', 'Versioning and contracts', 'Contract hashes and safe evolution', []],
  ['/core/treeshaking', 'Tree-shaking', 'Same codebase, any deployment', []],
  ['/core/addons', 'Addons', 'Extend Pikku with packages', []],
  ['/core/built-in-services', 'Built-in services', 'Every service interface Pikku ships', []],
]

async function rows(src: typeof source, includeHeadings: boolean): Promise<SearchRow[]> {
  const out: SearchRow[] = []
  for (const page of src.getPages()) {
    const d = page.data as any
    let headings: [string, string][] = []
    if (includeHeadings && typeof d.load === 'function') {
      const loaded = await d.load()
      headings = (loaded.structuredData?.headings ?? []).map((h: { id: string; content: string }) => [h.id, h.content] as [string, string])
    }
    out.push([page.url, d.title ?? page.url, d.description ?? '', headings])
  }
  return out
}

export async function buildSearchIndex(): Promise<SearchRow[]> {
  return [...SITE_PAGES, ...(await rows(source, true)), ...(await rows(blogSource as any, false))]
}
