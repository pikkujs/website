import { Bot } from 'lucide-react'

/** Shown above docs whose frontmatter carries `ai: true`. */
export function AIDisclaimer() {
  return (
    <div className="pk-adm pk-adm--info" role="note" data-ai-disclaimer>
      <div className="pk-adm-title"><Bot size={16} aria-hidden /> AI Generated Content</div>
      <div className="pk-adm-body">
        This documentation was generated with AI assistance. Please <a href="https://github.com/pikkujs/pikku/issues" target="_blank" rel="noreferrer">report any issues</a> you find.
      </div>
    </div>
  )
}
