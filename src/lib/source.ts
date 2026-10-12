import { defineDocs } from 'fumadocs-mdx/macro'
import { frontmatterSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'
import { loader } from 'fumadocs-core/source'

const schema = frontmatterSchema.extend({ title: z.string().optional(), icon: z.string().optional(), date: z.coerce.string().optional() }).loose()
export const docs = defineDocs({ dir: 'content/docs', docs: { async: true, schema } })
export const blog = defineDocs({ dir: 'content/blog', docs: { async: true, schema } })

// icon names pass straight through the page tree (a string is a valid ReactNode); the UI maps them to wiring icons
export const source = loader({ baseUrl: '/docs', source: docs.toFumadocsSource(), icon: (name) => name as any })

// Docusaurus blog URLs: /blog/yyyy/mm/dd/slug from the file name 2025-03-12-slug.mdx
export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
  slugs: ({ path }) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})-(.+?)\.mdx?$/.exec(path.split('/').pop()!)
    return m ? [m[1], m[2], m[3], m[4]] : undefined
  },
})
