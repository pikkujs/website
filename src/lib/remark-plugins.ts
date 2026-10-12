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

/** ```bash npm2yarn  -> <Tabs> with one highlighted bash block per package manager */
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
      // real `bash` code nodes inside the tabs, so Shiki highlights them at build time like every other block
      const code = (pm: string, value: string) => jsx('TabItem', { value: pm, label: pm }, [{ type: 'code', lang: 'bash', meta: null, value }])
      parent.children[index!] = jsx('Tabs', { groupId: 'package-manager' }, [
        code('npm', npm), code('yarn', conv(npm, 'yarn')), code('pnpm', conv(npm, 'pnpm')), code('bun', conv(npm, 'bun')),
      ])
    })
  }
}

/** The docs layout renders the page title as the <h1> (from frontmatter, or fumadocs' auto-title from the first
 *  `# heading`). Drop that leading heading from the body so the title is not shown twice. Runs after the defaults. */
export function remarkStripTitleHeading() {
  return (tree: any, file: any) => {
    const i = (tree.children as any[]).findIndex((n) => n.type === 'heading' && n.depth === 1)
    if (i < 0) return
    const text = (n: any): string => (n.value ?? '') + ((n.children ?? []).map(text).join(''))
    const h = text(tree.children[i]).trim().toLowerCase()
    const t = String(file.data?.frontmatter?.title ?? '').trim().toLowerCase()
    if (!t || h === t) tree.children.splice(i, 1)
    else tree.children[i].data = { ...(tree.children[i].data ?? {}), hProperties: { className: ['doc-own-title'] } } // differs from the title: it wins, the layout h1 is hidden by CSS
  }
}
