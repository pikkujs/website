import snippetsMeta from '../data/snippets-meta.json'

const GITHUB_BASE =
  'https://github.com/pikkujs/template-online-shop/blob/main/packages/functions/src'

export function snippetSourceUrl(key: string): string | undefined {
  const file = (snippetsMeta as Record<string, string>)[key]
  if (!file) return undefined
  return `${GITHUB_BASE}/${file}`
}
