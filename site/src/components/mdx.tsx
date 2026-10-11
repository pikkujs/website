import type { MDXComponents } from 'mdx/types'
import { Admonition, PkgTabs, Mermaid, DocHeaderHero, AIDisclaimer, AsciinemaPlayer, mdxComponents } from './own-mdx'
export function getMDXComponents(components?: MDXComponents) {
  return { ...mdxComponents, Admonition, PkgTabs, Mermaid, DocHeaderHero, AIDisclaimer, AsciinemaPlayer, ...components } as MDXComponents
}
export const useMDXComponents = getMDXComponents
declare global { type MDXProvidedComponents = ReturnType<typeof getMDXComponents> }
