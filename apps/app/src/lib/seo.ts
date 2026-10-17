export const SITE = 'https://pikku.dev'
export const SITE_NAME = 'Pikku'
export const DEFAULT_DESCRIPTION = 'Open-source TypeScript backend platform. One command runs your database, auth, email, workflows and AI agents locally, same as production.'

/** Per-page <head>: title, description, canonical and Open Graph / Twitter tags. `path` is the canonical pathname. */
const clamp = (s: string, n: number) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:\s]+$/, '') + '…')

/** Titles stay under ~60 chars: the " | Pikku" suffix is dropped when it would push past that. */
const withSuffix = (t: string) => {
  if (t.includes('Pikku')) return clamp(t, 60)
  const full = `${t} | Pikku`
  return full.length <= 60 ? full : clamp(t, 60)
}

export function pageHead(o: { title?: string; description?: string; path: string; image?: string; type?: 'website' | 'article'; noindex?: boolean; published?: string; jsonLd?: object; extra?: Record<string, string>[] }) {
  const title = o.title ? withSuffix(o.title) : 'Pikku: run a whole platform from one command'
  const description = clamp(o.description ?? DEFAULT_DESCRIPTION, 160)
  const url = SITE + (o.path === '/' ? '/' : o.path.replace(/\/$/, ''))
  const image = SITE + (o.image ?? '/img/pikku.png')
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: o.type ?? 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { property: 'og:image:alt', content: 'Pikku' },
      ...(o.published ? [{ property: 'article:published_time', content: o.published }] : []),
      ...(o.noindex ? [{ name: 'robots', content: 'noindex' }] : []),
      ...(o.extra ?? []),
    ],
    links: o.noindex ? [] : [{ rel: 'canonical', href: url }],
    ...(o.jsonLd ? { scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', ...o.jsonLd }) }] } : {}),
  }
}
