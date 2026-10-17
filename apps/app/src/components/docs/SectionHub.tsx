import { HubRow, HubSection } from './HubRow'
import type { ChildRow, Hue } from '@/lib/docs-hub'

const HUES: Hue[] = ['clay', 'moss', 'slate', 'ochre', 'rose']

/** "In this section": the children of a folder as rows, in meta.json order, text from each page's description. */
export function SectionHub({ rows, title = 'In this section' }: { rows: ChildRow[]; title?: string }) {
  if (!rows.length) return null
  return (
    <HubSection id="children" title={title}>
      {rows.map((r, i) => (
        <HubRow key={r.url} url={r.url} title={r.title} text={r.description || (r.count ? `${r.count} pages` : undefined)} aside={r.count && r.description ? `${r.count} pages` : undefined}
          icon={r.icon ? `w:${r.icon.split(',')[0]}` : r.count ? 'l:Folder' : 'l:FileText'} hue={HUES[i % HUES.length]} small />
      ))}
    </HubSection>
  )
}
