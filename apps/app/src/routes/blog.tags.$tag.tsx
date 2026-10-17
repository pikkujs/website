import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { blogList } from '@/lib/payload'
import { fetchPayload } from '@/lib/payload-client'
import { pageHead } from '@/lib/seo'
import { PostList } from '@/components/BlogParts'

const list = createServerFn({ method: 'GET' }).handler(async () => blogList())
export const Route = createFileRoute('/blog/tags/$tag')({
  loader: () => (import.meta.env.SSR ? list() : fetchPayload<ReturnType<typeof blogList>>('/payload/blog-index.json')),
  head: ({ params }) => pageHead({ title: `Posts tagged "${params.tag}"`, description: `Pikku blog posts about ${params.tag}.`, path: `/blog/tags/${params.tag}` }),
  component: () => {
    const { tag } = Route.useParams()
    const posts = Route.useLoaderData().filter((p) => p.tags.includes(tag))
    return (
      <div className="blog-wrap">
        <header className="blog-head"><h1>#{tag}</h1><p>{posts.length} post{posts.length === 1 ? '' : 's'}. <a href="/blog" style={{ color: 'var(--paper-accent)' }}>All posts</a></p></header>
        <PostList posts={posts} />
      </div>
    )
  },
})
