import { useRef, useState, type ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'

/** `pre` override for MDX: optional title bar (from ```lang title="x") and a copy button. */
export function Pre({ title, icon: _icon, children, className, ...rest }: ComponentProps<'pre'> & { title?: string; icon?: string }) {
  const ref = useRef<HTMLPreElement>(null)
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(ref.current?.innerText.replace(/\n$/, '') ?? ''); setDone(true); setTimeout(() => setDone(false), 1600) } catch {}
  }
  return (
    <figure className="pk-code">
      {title && <figcaption className="pk-code-title">{title}</figcaption>}
      <button type="button" className="pk-code-copy" onClick={copy} aria-label={done ? 'Copied' : 'Copy code'}>
        {done ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre ref={ref} className={className} {...rest}>{children}</pre>
    </figure>
  )
}
