import React from 'react'
import { art, colors, palette } from './chameleonData'

interface ColorSpan {
  chars: string
  color: string
}

function buildSpans(): ColorSpan[][] {
  return art.map((row, rowIdx) => {
    const colorRow = colors[rowIdx] || ''
    const spans: ColorSpan[] = []
    let current: ColorSpan | null = null

    for (let i = 0; i < row.length; i++) {
      const ch = row[i]
      const code = colorRow[i] || ' '
      const color = palette[code] || ''

      if (current && current.color === color) {
        current.chars += ch
      } else {
        if (current) spans.push(current)
        current = { chars: ch, color }
      }
    }
    if (current) spans.push(current)
    return spans
  })
}

const cachedSpans = buildSpans()

const AsciiMascotInner: React.FC = () => {
  return (
    <div className="ascii-mascot-wrapper">
      <pre
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", monospace',
          fontSize: '13px',
          lineHeight: '1.15',
          whiteSpace: 'pre',
          userSelect: 'text',
          margin: 0,
          padding: 0,
          background: 'transparent',
        }}
      >
        {cachedSpans.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((span, spanIdx) =>
              span.color ? (
                <span key={spanIdx} style={{ color: span.color }}>
                  {span.chars}
                </span>
              ) : (
                <span key={spanIdx}>{span.chars}</span>
              )
            )}
          </div>
        ))}
      </pre>
    </div>
  )
}

export const AsciiMascot = React.memo(AsciiMascotInner)
