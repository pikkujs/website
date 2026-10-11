// Ours (Fumadocs ships none): sitemap.xml from the prerendered output + blog RSS/Atom from content/blog.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Feed } from 'feed'

export default function feeds({ site, title = 'Blog', blogDir = 'content/blog', outDir = 'dist/client' }) {
  return {
    name: 'feeds', enforce: 'post', apply: 'build',
    buildApp: { order: 'post', handler(builder) {
      const out = path.resolve(builder.config.root, outDir)
      const urls = []
      const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'index.html') urls.push('/' + path.relative(out, d).split(path.sep).join('/')) } }
      walk(out)
      const list = [...new Set(urls.map((u) => (u === '/' || u === '/.' ? '/' : u)))].sort()
      fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((u) => `  <url><loc>${site}${u === '/' ? '' : u}</loc></url>`).join('\n')}\n</urlset>\n`)
      const feed = new Feed({ title, id: site + '/blog', link: site + '/blog', description: title, copyright: '' })
      const dir = path.resolve(builder.config.root, blogDir)
      const posts = fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.mdx?$/.test(f)).sort().reverse()
      for (const f of posts) {
        const m = /^(\d{4})-(\d{2})-(\d{2})-(.+?)\.mdx?$/.exec(f), { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'))
        const url = `${site}/blog/${m[1]}/${m[2]}/${m[3]}/${m[4]}`
        feed.addItem({ title: data.title ?? m[4], id: url, link: url, description: data.description ?? '', date: new Date(`${m[1]}-${m[2]}-${m[3]}`) })
      }
      fs.mkdirSync(path.join(out, 'blog'), { recursive: true })
      fs.writeFileSync(path.join(out, 'blog/rss.xml'), feed.rss2()); fs.writeFileSync(path.join(out, 'blog/atom.xml'), feed.atom1())
      console.log(`[feeds] sitemap ${list.length} urls, rss/atom ${posts.length} posts`)
    } },
  }
}
