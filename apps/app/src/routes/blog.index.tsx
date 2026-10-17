import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { blogList } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { pageHead } from '@/lib/seo'
import { PostList } from '@/components/BlogParts'

const list = createServerFn({ method: 'GET' }).handler(async () => blogList())
export const Route = createFileRoute('/blog/')({
  loader: () => (import.meta.env.SSR ? list() : fetchPayload<ReturnType<typeof blogList>>('/payload/blog-index.json')),
  head: () => pageHead({ title: 'Blog', description: 'Design decisions, releases and notes from building Pikku.', path: '/blog' }),
  component: () => {
    const posts = Route.useLoaderData()
    const tags = [...new Set(posts.flatMap((p) => p.tags))].sort()
    return (
      <div className="blog-wrap">
        <header className="blog-head">
          <h1>Blog</h1>
          <p>Design decisions, releases and notes from building Pikku.</p>
          {tags.length ? <ul className="tags" aria-label="Browse by tag">{tags.map((t) => <li key={t}><a className="tag" href={`/blog/tags/${t}`}>{t}</a></li>)}</ul> : null}
        </header>
        <div style={{ marginTop: 28 }}><PostList posts={posts} /></div>
      </div>
    )
  },
})
