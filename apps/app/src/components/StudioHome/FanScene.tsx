import { Pk } from '@pikku/theme-brand'

export function FanScene() {
  return (
    <>
      <svg
        viewBox="0 0 760 560"
        className="hidden sm:block w-full h-auto"
        role="img"
        aria-labelledby="fanT"
      >
        <title id="fanT">
          One orange chameleon in the middle, labelled "your function". Hand-drawn lines fan out to
          seven smaller chameleons, each a different colour: HTTP, RPC, WebSockets, queues, cron,
          MCP and AI agents.
        </title>
        <ellipse
          cx="380"
          cy="300"
          rx="120"
          ry="100"
          fill="#e8b48f"
          opacity=".4"
          filter="url(#wash)"
        />
        <g
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#rough)"
        >
          <path d="M296 242 C 256 189, 203 150, 140 130" />
          <path d="M274 298 C 226 290, 176 288, 128 293" />
          <path d="M293 358 C 254 407, 202 441, 141 456" />
          <path d="M464 242 C 504 189, 557 150, 620 130" />
          <path d="M486 298 C 534 290, 584 288, 632 293" />
          <path d="M467 358 C 506 407, 558 441, 619 456" />
          <path d="M380 204 C 385 172, 385 138, 380 106" />
        </g>
        <Pk x={300} y={222} width={160} height={160} color="#c2410c" />
        <text x="322" y="410" fontSize="28" fill="var(--color-clay)">
          your function
        </text>

        <g fontSize="26" fill="var(--color-ink)">
          <circle cx="104" cy="104" r="34" fill="#c9dbe2" filter="url(#wash)" />
          <Pk x={76} y={76} width={56} height={56} color="#3d6373" />
          <text x="56" y="168">
            HTTP
          </text>

          <circle cx="84" cy="292" r="34" fill="#efd9a9" filter="url(#wash)" />
          <Pk x={56} y={264} width={56} height={56} color="#b97d12" />
          <text x="56" y="352">
            RPC
          </text>

          <circle cx="104" cy="480" r="34" fill="#d7e3c8" filter="url(#wash)" />
          <Pk x={76} y={452} width={56} height={56} color="#55703c" />
          <text x="40" y="544">
            WebSockets
          </text>

          <circle cx="656" cy="104" r="34" fill="#ecc7cf" filter="url(#wash)" />
          <Pk x={628} y={76} width={56} height={56} color="#a8485f" />
          <text x="620" y="168">
            Queues
          </text>

          <circle cx="676" cy="292" r="34" fill="#ddd0ea" filter="url(#wash)" />
          <Pk x={648} y={264} width={56} height={56} color="#6b4e8a" />
          <text x="650" y="352">
            Cron
          </text>

          <circle cx="656" cy="480" r="34" fill="#bfe0d9" filter="url(#wash)" />
          <Pk x={628} y={452} width={56} height={56} color="#1f7a6d" />
          <text x="630" y="544">
            MCP
          </text>

          <circle cx="380" cy="62" r="34" fill="#d3d8ef" filter="url(#wash)" />
          <Pk x={352} y={34} width={56} height={56} color="#4a5aa8" />
          <text x="420" y="70">
            AI agents
          </text>
        </g>
      </svg>
      <svg
        viewBox="0 0 340 560"
        className="sm:hidden w-full h-auto"
        role="img"
        aria-labelledby="fanTm"
      >
        <title id="fanTm">
          One orange chameleon at the top labelled "your function", with a hand-drawn stem running
          down to seven smaller coloured chameleons: HTTP, RPC, WebSockets, queues, cron, MCP and AI
          agents.
        </title>
        <ellipse cx="80" cy="74" rx="76" ry="62" fill="#e8b48f" opacity=".45" filter="url(#wash)" />
        <Pk x={20} y={14} width={120} height={120} color="#c2410c" />
        <text x="150" y="80" fontSize="28" fill="var(--color-clay)">
          your function
        </text>
        <g
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#rough)"
        >
          <path d="M70 140 C 64 260, 76 400, 70 524" />
          <path d="M70 176 C 90 170, 110 176, 128 174" />
          <path d="M70 230 C 90 224, 110 230, 128 228" />
          <path d="M70 284 C 90 278, 110 284, 128 282" />
          <path d="M70 338 C 90 332, 110 338, 128 336" />
          <path d="M70 392 C 90 386, 110 392, 128 390" />
          <path d="M70 446 C 90 440, 110 446, 128 444" />
          <path d="M70 500 C 90 494, 110 500, 128 498" />
        </g>
        <g fontSize="27" fill="var(--color-ink)">
          <Pk x={132} y={152} width={44} height={44} color="#3d6373" />
          <text x="186" y="184">
            HTTP
          </text>
          <Pk x={132} y={206} width={44} height={44} color="#b97d12" />
          <text x="186" y="238">
            RPC
          </text>
          <Pk x={132} y={260} width={44} height={44} color="#55703c" />
          <text x="186" y="292">
            WebSockets
          </text>
          <Pk x={132} y={314} width={44} height={44} color="#a8485f" />
          <text x="186" y="346">
            Queues
          </text>
          <Pk x={132} y={368} width={44} height={44} color="#6b4e8a" />
          <text x="186" y="400">
            Cron
          </text>
          <Pk x={132} y={422} width={44} height={44} color="#1f7a6d" />
          <text x="186" y="454">
            MCP
          </text>
          <Pk x={132} y={476} width={44} height={44} color="#4a5aa8" />
          <text x="186" y="508">
            AI agents
          </text>
        </g>
      </svg>
    </>
  )
}
