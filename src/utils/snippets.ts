import snippetsMeta from '../data/snippets-meta.json'

const GITHUB_REPO = 'https://github.com/pikkujs/pikku/blob/main'
const SNIPPET_ROOT = 'examples/online-shop/src'

/**
 * Origins are recorded relative to the example's src dir, but migrations and
 * the config live above it — so `..` segments are resolved before linking,
 * because GitHub serves those paths literally rather than normalising them.
 */
function resolveRelative(file: string): string {
  const segments = [...SNIPPET_ROOT.split('/'), ...file.split('/')]
  const out: string[] = []
  for (const segment of segments) {
    if (segment === '..') out.pop()
    else if (segment !== '.' && segment !== '') out.push(segment)
  }
  return out.join('/')
}

export function snippetSourceUrl(key: string): string | undefined {
  const file = (snippetsMeta as Record<string, string>)[key]
  if (!file) return undefined
  return `${GITHUB_REPO}/${resolveRelative(file)}`
}
