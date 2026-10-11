import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

const FIRST = 220

/** Static search index: titles, headings and the first paragraph under each heading, trimmed.
 *  The full text of every page (about 10 MB) is not needed for a command palette. */
export const searchServer = createFromSource(source, {
  buildIndex: async (page) => {
    const d = (page.data as any)
    const loaded = typeof d.load === 'function' ? await d.load() : d
    const sd = loaded.structuredData as { headings: { id: string; content: string }[]; contents: { heading?: string; content: string }[] }
    const seen = new Set<string | undefined>()
    const contents: typeof sd.contents = []
    for (const c of sd.contents) {
      if (seen.has(c.heading)) continue
      seen.add(c.heading)
      const text = c.content.replace(/\s+/g, ' ').trim()
      if (text) contents.push({ heading: c.heading, content: text.length > FIRST ? text.slice(0, FIRST) + '…' : text })
    }
    return { id: page.url, url: page.url, title: d.title ?? page.url, description: d.description, structuredData: { headings: sd.headings, contents } } as any
  },
})
