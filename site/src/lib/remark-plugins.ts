import { visit } from 'unist-util-visit'

const jsx = (name: string, attrs: Record<string, string>, children: any[] = []) => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: Object.entries(attrs).map(([k, v]) => ({ type: 'mdxJsxAttribute', name: k, value: v })),
  children,
})

const ADMONITIONS = new Set(['note', 'tip', 'info', 'warning', 'danger', 'caution'])

/** `:::note[Title]` ... `:::`  (Docusaurus syntax) -> <Admonition type title> */
export function remarkAdmonitions() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== 'containerDirective' || !ADMONITIONS.has(node.name) || !parent) return
      let title = ''
      const first = node.children[0]
      if (first?.data?.directiveLabel) {
        title = first.children.map((c: any) => c.value ?? '').join('')
        node.children.shift()
      }
      parent.children[index!] = jsx('Admonition', { type: node.name, ...(title ? { title } : {}) }, node.children)
    })
  }
}

/** ```mermaid  -> <Mermaid chart="..."/> (rendered client-side) */
export function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any, index: number | undefined, parent: any) => {
      if (node.lang !== 'mermaid' || !parent) return
      parent.children[index!] = jsx('Mermaid', { chart: node.value })
    })
  }
}

/** ```bash npm2yarn  -> <PkgTabs npm yarn pnpm bun/> */
export function remarkPkgTabs() {
  const conv = (cmd: string, pm: 'yarn' | 'pnpm' | 'bun') =>
    cmd.split('\n').map((l) => {
      l = l.replace(/^npm (install|i|add) (.+)$/, (_, __, p) =>
        pm === 'yarn' ? `yarn add ${p}` : pm === 'pnpm' ? `pnpm add ${p}` : `bun add ${p}`)
      l = l.replace(/^npm install$/, `${pm} install`)
      l = l.replace(/^npm run (.+)$/, pm === 'yarn' ? 'yarn $1' : `${pm} run $1`)
      l = l.replace(/^npm create (.+)$/, pm === 'bun' ? 'bun create $1' : `${pm} create $1`)
      l = l.replace(/^npx (.+)$/, pm === 'yarn' ? 'yarn dlx $1' : pm === 'pnpm' ? 'pnpm dlx $1' : 'bunx $1')
      return l
    }).join('\n')
  return (tree: any) => {
    visit(tree, 'code', (node: any, index: number | undefined, parent: any) => {
      if (!node.meta || !/\bnpm2yarn\b/.test(node.meta) || !parent) return
      const npm = node.value
      parent.children[index!] = jsx('PkgTabs', {
        npm, yarn: conv(npm, 'yarn'), pnpm: conv(npm, 'pnpm'), bun: conv(npm, 'bun'),
      })
    })
  }
}
