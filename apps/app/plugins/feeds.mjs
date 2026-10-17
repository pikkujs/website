// Ours (Fumadocs ships none): sitemap.xml from the prerendered output + blog RSS/Atom from content/blog.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import { Feed } from 'feed'

export default function feeds({ site, title = 'Blog', blogDir = 'content/blog', outDir = 'dist/client' }) {
  return {
    name: 'feeds', enforce: 'post', apply: 'build',
    buildApp: { order: 'post', async handler(builder) {
      const out = path.resolve(builder.config.root, outDir)
      // GitHub Pages serves 404.html (HTTP 404) for unknown paths. Render it with the real SSR handler on an unmatched
      // path, so the HTML is exactly what the client router renders for any unknown URL (no hydration mismatch).
      const serverEntry = path.resolve(builder.config.root, 'dist/server/server.js')
      if (fs.existsSync(serverEntry)) {
        const mod = (await import(pathToFileURL(serverEntry).href + '?nf=' + Date.now())).default
        const res = await mod.fetch(new Request(site + '/__not-found'))
        if (res.status === 404) {
          // not a real page: keep it out of the index and drop the (wrong) canonical to the home page
          const html = (await res.text()).replace(/<link[^>]*rel="canonical"[^>]*>/, '').replace('</head>', '<meta name="robots" content="noindex"/></head>')
          fs.writeFileSync(path.join(out, '404.html'), html)
        }
        else console.warn('[feeds] 404.html not written: unmatched path rendered with status', res.status)
      }
      const urls = []
      const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'index.html' && !/http-equiv="refresh"/.test(fs.readFileSync(p, 'utf8'))) urls.push('/' + path.relative(out, d).split(path.sep).join('/')) } }
      walk(out)
      const list = [...new Set(urls.map((u) => (u === '/' || u === '/.' ? '/' : u)))].sort()
      fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((u) => `  <url><loc>${site}${u === '/' ? '' : u}</loc>${(() => { const m = /^\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//.exec(u); return m ? `<lastmod>${m[1]}-${m[2]}-${m[3]}</lastmod>` : '' })()}</url>`).join('\n')}\n</urlset>\n`)
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
