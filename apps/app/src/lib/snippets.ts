import snippetsMeta from '@/data/snippets-meta.json'

const { base, sources } = snippetsMeta as {
  base: string
  sources: Record<string, { path: string; trimmed?: boolean }>
}

/** The snippet's lines on GitHub, at the template commit it was synced from. */
export function snippetSourceUrl(key: string | undefined): string | undefined {
  const source = key ? sources[key] : undefined
  return source ? base + source.path : undefined
}

/** True when the page shows less than the source: `@snippet hide` left a `// ...` in it. */
export function isSnippetTrimmed(key: string | undefined): boolean {
  return Boolean(key && sources[key]?.trimmed)
}
