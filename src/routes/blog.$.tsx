import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { blog } from '@/lib/source'
import { blogPayload } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { Suspense, use } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { Prose } from '@/components/mdx'
import { Link } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { authors } from '@/data/authors'
import { TagList, fmtDate } from '@/components/BlogParts'

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
  head: ({ loaderData }) => loaderData ? pageHead({ title: loaderData.title, description: loaderData.description || undefined, path: loaderData.url, type: 'article', extra: [{ name: 'source-file', content: 'content/blog/' + loaderData.path }] }) : {},
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
  const people = d.authors.map((a) => authors[a]).filter(Boolean)
  return (
    <div className="blog-wrap">
      <article>
        <header className="post-head">
          <div className="blog-meta"><time dateTime={d.date}>{fmtDate(d.date)}</time></div>
          <h1>{d.title}</h1>
          {people.map((a) => <a key={a.name} className="post-author" href={a.url} target="_blank" rel="noreferrer"><img src={a.image} alt="" width={36} height={36} /><span><strong>{a.name}</strong>{a.title}</span></a>)}
          <TagList tags={d.tags} />
        </header>
        <div className="post-body"><Prose><Suspense fallback={null}><Body path={d.path} /></Suspense></Prose></div>
      </article>
      <div className="blog-foot"><Link to="/blog">&larr; All posts</Link><a href="/blog/rss.xml">RSS</a></div>
    </div>
  )
}
