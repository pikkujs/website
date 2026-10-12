import { Link } from '@tanstack/react-router'

export type BlogItem = { url: string; title: string; description: string; date: string; tags: string[]; authors: string[] }
export const fmtDate = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return <ul className="tags" aria-label="Tags">{tags.map((t) => <li key={t}><Link to={'/blog/tags/$tag' as any} params={{ tag: t } as any} className="tag">{t}</Link></li>)}</ul>
}

export function PostList({ posts }: { posts: BlogItem[] }) {
  return (
    <ul className="blog-list">
      {posts.map((p, i) => (
        <li key={p.url}>
          <Link to={p.url as any} className={i === 0 ? 'blog-card blog-card-lead' : 'blog-card'}>
            <div className="blog-meta">
              <time dateTime={p.date}>{fmtDate(p.date)}</time>
              {p.tags.slice(0, 3).map((t) => <span key={t} className="blog-card-tag">{t}</span>)}
            </div>
            <h2>{p.title}</h2>
            {p.description ? <p>{p.description}</p> : null}
            <span className="blog-card-more" aria-hidden="true">Read post →</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
