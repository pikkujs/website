export const SITE = 'https://pikku.dev'
export const SITE_NAME = 'Pikku'
export const DEFAULT_DESCRIPTION = 'Open-source TypeScript backend platform. One command runs database, auth, content, email, secrets, workflows and AI agents locally, identical to production. Deploy anywhere.'
export const GA_ID = 'G-SNE58L9QKR'

/** Per-page <head>: title, description, canonical and Open Graph / Twitter tags. `path` is the canonical pathname. */
export function pageHead(o: { title?: string; description?: string; path: string; image?: string; type?: 'website' | 'article'; noindex?: boolean; extra?: Record<string, string>[] }) {
  const title = o.title ? (o.title.includes('Pikku') ? o.title : `${o.title} | Pikku`) : 'Pikku: run a whole platform from one command'
  const description = o.description ?? DEFAULT_DESCRIPTION
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
      ...(o.noindex ? [{ name: 'robots', content: 'noindex' }] : []),
      ...(o.extra ?? []),
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
