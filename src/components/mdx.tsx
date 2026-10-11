import type { ComponentProps, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import { Link as RLink } from '@tanstack/react-router'
import { Admonition } from './Admonition'
import { Pre } from './CodeBlock'
import { Tabs, TabItem, PkgTabs } from './Tabs'
import { Mermaid } from './Mermaid'
import { DocHeaderHero } from './DocHeaderHero'
import { AIDisclaimer } from './AIDisclaimer'
import { AsciinemaPlayer } from './AsciinemaPlayer'
import { Stackblitz } from './Stackblitz'
import Card from './Card'
import CloudCostAtlas from './cost/CloudCostAtlas'
import CloudCostComparison from './cost/CloudCostComparison'
import { BundleArchitecturesSection } from './BundleArchitecturesSection'
import * as Icons from './WiringIcons'

/** Internal links go through the router (client navigation); external ones open in a new tab. */
export function A({ href = '', children, ...p }: ComponentProps<'a'>) {
  if (href.startsWith('/') && !href.startsWith('//')) return <RLink to={href as any} {...(p as any)}>{children}</RLink>
  if (href.startsWith('#') || href.startsWith('mailto:')) return <a href={href} {...p}>{children}</a>
  return <a href={href} target="_blank" rel="noreferrer" {...p}>{children}</a>
}
/** Docusaurus `<Link to>` used inside a few docs. */
const Link = ({ to, children, ...p }: { to: string; children?: ReactNode } & Record<string, unknown>) => <A href={to} {...(p as any)}>{children}</A>

/** Wrap wide tables so they scroll instead of breaking the layout on phones. */
const Table = (p: ComponentProps<'table'>) => <div className="pk-table"><table {...p} /></div>

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: A, pre: Pre, table: Table, Link,
    Admonition, Tabs, TabItem, PkgTabs, Mermaid, DocHeaderHero, AIDisclaimer, AsciinemaPlayer, Stackblitz,
    Card, CloudCostAtlas, CloudCostComparison, BundleArchitecturesSection,
    ...Icons,
    ...components,
  } as MDXComponents
}
export const useMDXComponents = getMDXComponents
export const Prose = ({ children }: { children?: ReactNode }) => <div className="prose-pikku">{children}</div>
declare global { type MDXProvidedComponents = ReturnType<typeof getMDXComponents> }
