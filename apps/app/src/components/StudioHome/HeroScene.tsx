import { Pk } from '@pikku/theme-brand'

const APPS: [string, string?][] = [['Web'], ['iOS'], ['Android'], ['Desktop', 'Tauri'], ['AI tools', 'MCP']]
const BACKEND = [
  'Database', 'Users & roles', 'Queues', 'Cron',
  'Workflows', 'AI agents', 'Files', 'Email',
  'Secrets', 'Audit', 'Analytics', 'Feature flags',
]

/** A hand-cut box: corners nudged by a few units so it reads as drawn, not ruled. */
function box(x: number, y: number, w: number, h: number) {
  return `M${x + 1} ${y + 2} L${x + w - 2} ${y} L${x + w} ${y + h - 1} L${x} ${y + h + 1} Z`
}

const SUMMARY =
  'Three layers. On top, your apps: web, iOS, Android and desktop, plus AI assistants. They reach Pikku through generated typed clients. In the middle, the chameleon: your typed functions, reached over HTTP, WebSocket, queues, cron, MCP, agents and the CLI, with input and permissions checked on every call. Underneath, the backend those functions are given: database, users and roles, queues, cron, workflows, AI agents, files, email, secrets, audit, analytics and feature flags.'

export function HeroScene() {
  return (
    <>
      <svg viewBox="0 0 600 560" className="scene scene-wide" role="img" aria-labelledby="heroT">
        <title id="heroT">{SUMMARY}</title>

        <text className="scene-note" x="0" y="22">your apps</text>
        <g className="scene-box">
          {APPS.map((_, i) => <path key={i} d={box(i * 123, 34, 108, 62)} />)}
        </g>
        {APPS.map(([name, sub], i) => (
          <g key={name}>
            <text className="scene-label" x={i * 123 + 54} y={sub ? 62 : 71} textAnchor="middle">{name}</text>
            {sub && <text className="scene-sub" x={i * 123 + 54} y="83" textAnchor="middle">{sub}</text>}
          </g>
        ))}

        <g className="scene-wire march">
          {APPS.map((_, i) => (
            <path key={i} d={`M${i * 123 + 54} 100 C ${i * 123 + 54} 130, ${150 + i * 75} 128, ${150 + i * 75} 166`} />
          ))}
        </g>
        <text className="scene-note" x="462" y="142">typed clients</text>

        <ellipse className="scene-wash" cx="300" cy="230" rx="270" ry="72" />
        <path className="scene-core" d={box(30, 170, 540, 122)} />
        <Pk x={44} y={180} width={102} height={102} color="var(--color-clay)" />
        <text className="scene-title" x="162" y="218">Your typed functions</text>
        <text className="scene-body" x="162" y="246">Reached over HTTP, WebSocket, queues, cron,</text>
        <text className="scene-body" x="162" y="268">MCP, agents and the CLI.</text>
        <text className="scene-note" x="372" y="318">input + permissions checked on every call</text>

        <g className="scene-wire scene-wire-clay march">
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${150 + i * 100} 296 C ${150 + i * 100} 322, ${75 + i * 150} 318, ${75 + i * 150} 350`} />
          ))}
        </g>
        <text className="scene-note" x="0" y="330">services, passed in</text>

        <path className="scene-tray" d={box(0, 352, 600, 196)} />
        <text className="scene-note" x="14" y="380">the backend, included</text>
        <g className="scene-box">
          {BACKEND.map((_, i) => <path key={i} d={box(14 + (i % 4) * 145, 394 + Math.floor(i / 4) * 50, 134, 40)} />)}
        </g>
        {BACKEND.map((b, i) => (
          <text key={b} className="scene-label" x={81 + (i % 4) * 145} y={420 + Math.floor(i / 4) * 50} textAnchor="middle">{b}</text>
        ))}
      </svg>

      <svg viewBox="0 0 360 660" className="scene scene-narrow" role="img" aria-labelledby="heroTm">
        <title id="heroTm">{SUMMARY}</title>

        <text className="scene-note" x="0" y="22">your apps</text>
        <g className="scene-box">
          {[0, 1, 2].map((i) => <path key={i} d={box(i * 124, 34, 112, 46)} />)}
          {[0, 1].map((i) => <path key={i} d={box(i * 186, 92, 174, 56)} />)}
        </g>
        {APPS.slice(0, 3).map(([name], i) => (
          <text key={name} className="scene-label" x={i * 124 + 56} y="63" textAnchor="middle">{name}</text>
        ))}
        {APPS.slice(3).map(([name, sub], i) => (
          <g key={name}>
            <text className="scene-label" x={i * 186 + 87} y="116" textAnchor="middle">{name}</text>
            <text className="scene-sub" x={i * 186 + 87} y="136" textAnchor="middle">{sub}</text>
          </g>
        ))}

        <g className="scene-wire march">
          <path d="M90 152 C 90 172, 120 172, 120 196" />
          <path d="M270 152 C 270 172, 240 172, 240 196" />
        </g>
        <text className="scene-note" x="132" y="180">typed clients</text>

        <ellipse className="scene-wash" cx="180" cy="262" rx="176" ry="70" />
        <path className="scene-core" d={box(0, 200, 360, 124)} />
        <Pk x={10} y={214} width={78} height={78} color="var(--color-clay)" />
        <text className="scene-title scene-title-sm" x="98" y="242">Your typed functions</text>
        <text className="scene-body" x="98" y="268">Reached over HTTP,</text>
        <text className="scene-body" x="98" y="290">WebSocket, queues, cron,</text>
        <text className="scene-body" x="98" y="312">MCP, agents and the CLI.</text>
        <text className="scene-note scene-note-sm" x="0" y="352">input + permissions checked on every call</text>
        <text className="scene-note scene-note-sm" x="0" y="382">services, passed in</text>

        <g className="scene-wire scene-wire-clay march">
          <path d="M318 328 C 314 352, 324 374, 318 398" />
        </g>

        <path className="scene-tray" d={box(0, 402, 360, 250)} />
        <text className="scene-note" x="12" y="430">the backend, included</text>
        <g className="scene-box">
          {BACKEND.map((_, i) => <path key={i} d={box(10 + (i % 3) * 115, 444 + Math.floor(i / 3) * 50, 107, 40)} />)}
        </g>
        {BACKEND.map((b, i) => (
          <text key={b} className="scene-label scene-label-sm" x={63 + (i % 3) * 115} y={469 + Math.floor(i / 3) * 50} textAnchor="middle">{b}</text>
        ))}
      </svg>
    </>
  )
}
