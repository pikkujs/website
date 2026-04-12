import React from 'react'

const chips = [
  { label: 'HTTP',      color: '#22c55e', top: '5%',  right: '2%'  },
  { label: 'WebSocket', color: '#a855f7', top: '18%', right: '-5%' },
  { label: 'MCP',       color: '#ec4899', top: '70%', right: '0%'  },
  { label: 'Queue',     color: '#ef4444', top: '82%', right: '8%'  },
  { label: 'Cron',      color: '#eab308', top: '35%', left: '-8%'  },
  { label: 'RPC',       color: '#3b82f6', top: '55%', left: '-4%'  },
  { label: 'CLI',       color: '#06b6d4', bottom: '8%', left: '5%' },
  { label: 'AI Agent',  color: '#8b5cf6', top: '8%',  left: '3%'  },
]

const plusPositions = [
  { top: '12%', left: '10%' },
  { top: '25%', right: '12%' },
  { top: '75%', left: '15%' },
  { top: '60%', right: '10%' },
  { top: '90%', right: '20%' },
  { top: '40%', left: '2%' },
]

export const HeroDecorations: React.FC = () => {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none">
      {/* Faint grid lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Floating protocol chips */}
      {chips.map((chip, i) => (
        <div
          key={chip.label}
          className="absolute chip-float-in"
          style={{
            top: chip.top,
            right: chip.right,
            left: chip.left,
            bottom: chip.bottom,
            animationDelay: `${0.4 + i * 0.1}s`,
          }}
        >
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm"
            style={{
              backgroundColor: `${chip.color}12`,
              border: `1px solid ${chip.color}30`,
              color: chip.color,
            }}
          >
            {chip.label}
          </div>
        </div>
      ))}

      {/* Scattered plus signs */}
      {plusPositions.map((pos, i) => (
        <span
          key={i}
          className="absolute text-slate-300 chip-float-in"
          style={{
            ...pos,
            fontSize: '14px',
            fontWeight: 300,
            opacity: 0.25,
            fontFamily: 'monospace',
            animationDelay: `${0.6 + i * 0.08}s`,
          }}
        >
          +
        </span>
      ))}

      {/* Code chip decoration */}
      <div
        className="absolute chip-float-in"
        style={{ bottom: '18%', right: '15%', animationDelay: '1s' }}
      >
        <div className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-mono">
          {'</>'}
        </div>
      </div>

      {/* Dot cluster */}
      <div
        className="absolute chip-float-in"
        style={{ top: '45%', right: '5%', animationDelay: '1.1s' }}
      >
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 opacity-40" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-40" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 opacity-40" />
        </div>
      </div>

      {/* Small connector curves */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.08 }}
      >
        <path
          d="M 50% 50% Q 80% 30%, 90% 15%"
          fill="none"
          stroke="#f472b6"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M 50% 50% Q 20% 70%, 10% 85%"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  )
}
