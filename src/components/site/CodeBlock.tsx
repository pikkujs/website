import { Highlight, type PrismTheme } from 'prism-react-renderer'
import './prism-bash'
import { Check, Copy } from 'lucide-react'
import { useState, type ReactNode } from 'react'

/** Written in CSS variables so the inline token colours follow the surface (paper, ink, light/dark). */
const v = (n: string) => `var(--code-${n})`
const theme: PrismTheme = {
  plain: { color: v('plain'), backgroundColor: v('bg') },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: v('cmt'), fontStyle: 'italic' } },
    { types: ['keyword', 'atrule', 'rule', 'important', 'builtin', 'tag', 'selector'], style: { color: v('kw') } },
    { types: ['string', 'attr-value', 'char', 'regex', 'url', 'inserted'], style: { color: v('str') } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'unit', 'deleted'], style: { color: v('num') } },
    { types: ['function', 'function-variable', 'method'], style: { color: v('fn') } },
    { types: ['class-name', 'maybe-class-name'], style: { color: v('type') } },
    { types: ['property', 'property-access', 'attr-name', 'parameter', 'variable'], style: { color: v('prop') } },
    { types: ['operator', 'entity', 'namespace'], style: { color: v('op') } },
    { types: ['punctuation'], style: { color: v('punct') } },
  ],
}

const LANG: Record<string, string> = { ts: 'typescript', sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash' }

/** Page-level code block (marketing pages). Docs/blog code is highlighted by Shiki at build time instead. */
export default function CodeBlock({ children, language = 'typescript', title }: { children: ReactNode; language?: string; title?: string }) {
  const code = String(children ?? '').replace(/\n$/, '')
  const [done, setDone] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500) } catch {} }
  return (
    <div className="pk-code pk-code--page">
      {title && <div className="pk-code-title">{title}</div>}
      <button type="button" className="pk-code-copy" onClick={copy} aria-label={done ? 'Copied' : 'Copy code'}>{done ? <Check size={14} /> : <Copy size={14} />}</button>
      <Highlight theme={theme} code={code} language={LANG[language] ?? language}>
        {({ tokens, getLineProps, getTokenProps, style }) => (
          <pre style={{ ...style, margin: 0 }} tabIndex={0}>
            <code>
              {tokens.map((line, i) => (
                <span key={i} {...getLineProps({ line })} style={{ display: 'block' }}>
                  {line.map((t, k) => <span key={k} {...getTokenProps({ token: t })} />)}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
/** Just the coloured tokens, for callers that bring their own <pre> (the feature-page hero panel). */
export function Tokens({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <Highlight theme={theme} code={code.replace(/\n$/, '')} language={LANG[language] ?? language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>{tokens.map((line, i) => (
          <span key={i} {...getLineProps({ line })} style={{ display: 'block' }}>
            {line.map((t, k) => <span key={k} {...getTokenProps({ token: t })} />)}
          </span>
        ))}</>
      )}
    </Highlight>
  )
}
export { CodeBlock }
