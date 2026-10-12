import { Blob } from '@pikku/theme-brand'
export function DeployScene() {
  return (
    <>
      <svg viewBox="0 0 520 300" className="mt-6 w-full h-auto" role="img" aria-labelledby="depT">
        <title id="depT">
          The blob carries a tied parcel along a dotted path from a laptop to three homes: a
          serverless cloud, Cloudflare, and your own server.
        </title>

        <g
          stroke="var(--paper-text)"
          strokeWidth="2.2"
          fill="var(--paper-bg-alt)"
          strokeLinejoin="round"
          filter="url(#rough)"
        >
          <path d="M20 196 L120 192 L122 262 L18 264 Z" />
          <path d="M4 266 L136 262 L146 282 L-2 284 Z" fill="#ebdfc8" />
        </g>
        <text x="26" y="236" fontSize="22" fill="#5f5143">
          laptop
        </text>

        <path
          d="M110 190 C 160 70, 300 40, 380 70"
          fill="none"
          stroke="var(--paper-text)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="march"
          strokeDasharray="2 11"
        />

        <g transform="translate(140 0) scale(.85)">
          <Blob pose="blob" x={0} y={0} width={92} height={92} color="#c2410c" transform="translate(92 0) scale(-1 1)" />
          <g transform="rotate(-8 80 74)" filter="url(#rough)">
            <rect
              x="66"
              y="58"
              width="34"
              height="28"
              fill="#d9a441"
              stroke="var(--paper-text)"
              strokeWidth="2"
            />
            <path d="M83 58 v28 M66 72 h34" stroke="var(--paper-text)" strokeWidth="1.6" />
          </g>
        </g>

        <g
          stroke="var(--paper-text)"
          strokeWidth="2.2"
          fill="var(--paper-bg-alt)"
          strokeLinejoin="round"
          filter="url(#rough)"
        >
          <path d="M392 120 c -22 0 -26 -26 -6 -30 c 2 -22 36 -26 44 -8 c 12 -14 40 -4 36 14 c 20 2 20 24 0 24 z" />
          <path
            d="M400 188 c -20 0 -24 -22 -6 -26 c 2 -20 32 -22 40 -6 c 12 -12 36 -2 32 12 c 18 2 18 20 0 20 z"
            fill="#f6dcc4"
          />
          <path d="M398 222 L478 220 L480 284 L396 286 Z" />
        </g>
        <g stroke="var(--paper-text)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M410 240 h54 M410 256 h54 M410 272 h54" />
        </g>
        <circle cx="470" cy="240" r="3" fill="#55703c" />
        <g fontSize="22" fill="var(--paper-text)">
          <text x="300" y="124" textAnchor="end">
            serverless
          </text>
          <text x="300" y="186" textAnchor="end">
            Cloudflare
          </text>
          <text x="300" y="260" textAnchor="end">
            your own server
          </text>
        </g>
        <g
          fill="none"
          stroke="var(--paper-text)"
          strokeWidth="1.6"
          strokeDasharray="3 6"
          strokeLinecap="round"
        >
          <path d="M306 116 L376 108" />
          <path d="M306 180 L384 176" />
          <path d="M306 254 L390 254" />
        </g>
      </svg>
    </>
  )
}
