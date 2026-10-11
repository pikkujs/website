import { Pk } from './Pk'

const APPS = ['Web', 'iOS & Android', 'Desktop', 'CLI', 'MCP']
const PIECES = ['Database', 'Queue', 'Scheduler', 'Email', 'Secrets', 'AI']

export function LayersScene() {
  return (
    <>
      <svg viewBox="0 0 1000 470" className="hidden md:block w-full h-auto" role="img" aria-labelledby="layT">
        <title id="layT">
          A layer cake. On top, five apps: web, iOS and Android, desktop, CLI and MCP. In the middle,
          one orange chameleon labelled "your functions". Underneath, six swappable pieces:
          database, queue, scheduler, email, secrets and AI. Dotted lines join every app to the
          middle and the middle to every piece.
        </title>
        <ellipse cx="500" cy="235" rx="360" ry="62" fill="#e8b48f" opacity=".4" filter="url(#wash)" />
        <g fill="none" stroke="#2b2219" strokeWidth="2.2" strokeLinecap="round" className="march" filter="url(#rough)">
          {APPS.map((_, i) => (
            <path key={i} d={`M${115 + i * 192.5} 112 C ${115 + i * 192.5} 170, ${420 + i * 40} 170, ${420 + i * 40} 205`} />
          ))}
          {PIECES.map((_, i) => (
            <path key={i} d={`M${100 + i * 160} 358 C ${100 + i * 160} 300, ${390 + i * 44} 300, ${390 + i * 44} 268`} />
          ))}
        </g>
        <g stroke="#2b2219" strokeWidth="2.2" strokeLinejoin="round" fill="#fbf6ec" filter="url(#rough)">
          {APPS.map((_, i) => (
            <path key={i} d={`M${40 + i * 192.5} 24 L${190 + i * 192.5} 20 L${192 + i * 192.5} 110 L${38 + i * 192.5} 114 Z`} />
          ))}
          {PIECES.map((_, i) => (
            <path key={i} d={`M${24 + i * 160} 362 L${158 + i * 160} 360 L${160 + i * 160} 440 L${22 + i * 160} 442 Z`} fill={i % 2 ? '#ebdfc8' : '#fbf6ec'} />
          ))}
        </g>
        <g fontSize="30" fill="#2b2219" textAnchor="middle">
          {APPS.map((a, i) => (
            <text key={a} x={115 + i * 192.5} y="76" fontSize={a.length > 9 ? 24 : 30}>{a}</text>
          ))}
          {PIECES.map((p, i) => (
            <text key={p} x={91 + i * 160} y="410" fontSize="27">{p}</text>
          ))}
        </g>
        <use href="#pk" x="420" y="190" width="120" height="120" style={{ color: '#c2410c' }} className="bob" />
        <text x="560" y="250" fontSize="32" fill="#c2410c">your functions</text>
        <text x="120" y="248" fontSize="26" fill="#5f5143" textAnchor="middle">auth, validation,</text>
        <text x="120" y="276" fontSize="26" fill="#5f5143" textAnchor="middle">permissions</text>
      </svg>
      <div className="md:hidden grid gap-3">
        <div className="flex flex-wrap gap-2">
          {APPS.map((a) => (
            <span key={a} className="chip">{a}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-clay hand text-2xl">
          <Pk className="w-14 h-14" /> your functions
        </div>
        <div className="flex flex-wrap gap-2">
          {PIECES.map((p) => (
            <span key={p} className="chip" style={{ background: '#ebdfc8' }}>{p}</span>
          ))}
        </div>
      </div>
    </>
  )
}
