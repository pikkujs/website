import type { ReactNode } from 'react'
import { Blob } from './Blob'

export type Step = {
  title: string
  body: ReactNode
  /** a short handwritten note shown in Caveat above the title */
  note?: string
  /** one of the built-in illustrations, or your own node (88x88 box) */
  illustration?: 'browser' | 'note' | 'blob' | 'cursors' | ReactNode
}

const ring = (radius: string) => ({ borderRadius: radius, border: '2px solid var(--color-ink)' })
const box = 'relative z-10 shrink-0 w-[88px] h-[88px] bg-paper'

function Browser() {
  return (
    <svg className={box} viewBox="0 0 88 88" style={ring('52% 48% 50% 50% / 48% 52% 48% 52%')} role="img" aria-label="A browser window with a sign-in field">
      <g fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" filter="url(#rough)">
        <rect x="14" y="20" width="60" height="46" rx="4" />
        <path d="M14 31 H74" />
        <rect x="24" y="42" width="40" height="8" rx="3" />
      </g>
      <circle cx="21" cy="26" r="2" fill="var(--color-clay)" />
      <circle cx="28" cy="26" r="2" fill="var(--color-ochre)" />
      <circle cx="35" cy="26" r="2" fill="var(--color-moss)" />
      <path d="M60 52 l0 12 l4 -3 l3 7 l3 -1 l-3 -7 l5 0 z" fill="var(--color-clay)" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg className={box} viewBox="0 0 88 88" style={ring('48% 52% 46% 54% / 52% 46% 54% 48%')} role="img" aria-label="A speech note">
      <path d="M16 22 L72 20 L74 52 L40 54 L28 66 L30 54 L17 55 Z" fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" filter="url(#rough)" />
      <path d="M26 33 h36 M26 43 h24" stroke="var(--color-clay)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function BlobIcon() {
  return (
    <div className={`${box} grid place-items-center border-2 border-ink`} style={{ borderRadius: '54% 46% 52% 48% / 46% 54% 48% 52%' }}>
      <Blob pose="blob" className="w-14 h-14 text-clay -scale-x-100" />
    </div>
  )
}

function Cursors() {
  return (
    <svg className={box} viewBox="0 0 88 88" style={ring('50% 50% 48% 52% / 52% 48% 52% 48%')} role="img" aria-label="Two small cursors pointing at one app">
      <g fill="none" stroke="var(--color-ink)" strokeWidth="2" filter="url(#rough)">
        <rect x="16" y="22" width="56" height="40" rx="4" />
        <path d="M16 32 H72" />
      </g>
      <rect x="26" y="40" width="22" height="14" fill="var(--color-cloudwash)" stroke="var(--color-ink)" strokeWidth="1.4" />
      <use href="#cur" x="50" y="42" width="14" height="20" style={{ color: '#c2410c' }} />
      <use href="#cur" x="56" y="50" width="14" height="20" style={{ color: '#3d6373' }} />
    </svg>
  )
}

const builtin = { browser: Browser, note: NoteIcon, blob: BlobIcon, cursors: Cursors } as const

/**
 * The four-step pattern from pikkustudio.app: numbered-by-order, hand-drawn dotted path between steps,
 * one illustration each. Needs <SvgDefs /> on the page and the tokens/utilities CSS. Pass your own copy.
 */
export function Steps({ steps, className = '' }: { steps: Step[]; className?: string }) {
  return (
    <ol className={`relative grid gap-10 md:grid-cols-4 md:gap-6 ${className}`}>
      <svg className="hidden md:block absolute left-0 right-0 top-[58px] w-full h-10 pointer-events-none" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M80 22 C 200 4, 300 36, 380 18 S 600 6, 700 22 S 880 10, 930 20" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="3 10" strokeLinecap="round" />
      </svg>
      <svg className="md:hidden absolute left-[43px] top-8 bottom-8 w-4 h-[calc(100%-4rem)] pointer-events-none" viewBox="0 0 16 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 0 C 2 80, 14 160, 8 240 S 4 360, 8 400" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="3 10" strokeLinecap="round" />
      </svg>
      {steps.map((s, i) => {
        const Ill = typeof s.illustration === 'string' ? builtin[s.illustration as keyof typeof builtin] : null
        return (
          <li key={i} className="relative flex md:block gap-5">
            {Ill ? <Ill /> : s.illustration ?? null}
            <div className="md:mt-5">
              {s.note ? <p className="hand text-xl text-claydeep">{s.note}</p> : null}
              <h3 className="display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-soft leading-relaxed">{s.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
