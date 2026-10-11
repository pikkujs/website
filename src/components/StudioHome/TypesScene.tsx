const stops = ['Database', 'Function', 'Client', 'Screen']

export function TypesScene() {
  return (
    <>
      <svg
        viewBox="0 0 520 210"
        className="hidden md:block mt-6 w-full h-auto"
        role="img"
        aria-labelledby="typT"
      >
        <title id="typT">
          One unbroken thread runs through four stops in order: Database, Function, Client and
          Screen. A note says that if the database changes, the screen finds out at build time.
        </title>
        <g
          stroke="var(--paper-text)"
          strokeWidth="2.2"
          fill="var(--paper-bg-alt)"
          strokeLinejoin="round"
          filter="url(#rough)"
        >
          <path d="M10 66 L116 62 L118 142 L12 146 Z" />
          <path d="M140 62 L246 66 L244 146 L142 142 Z" />
          <path d="M270 66 L376 62 L378 142 L272 146 Z" />
          <path d="M400 62 L506 66 L508 146 L402 142 Z" />
        </g>
        <path
          d="M4 118 C 40 108, 80 130, 118 118 S 190 108, 244 120 S 330 132, 376 118 S 470 108, 516 120"
          fill="none"
          stroke="#c2410c"
          strokeWidth="3.4"
          strokeLinecap="round"
          filter="url(#rough)"
        />
        <g fontSize="26" fill="var(--paper-text)" textAnchor="middle">
          {stops.map((s, i) => (
            <text key={s} x={63 + i * 130} y="96">
              {s}
            </text>
          ))}
        </g>
        <g fill="#c2410c" stroke="var(--paper-bg-alt)" strokeWidth="2">
          {stops.map((s, i) => (
            <circle key={s} cx={63 + i * 130} cy="122" r="5" />
          ))}
        </g>
        <path
          d="M92 176 C 80 166, 70 158, 66 152"
          fill="none"
          stroke="#5f5143"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text x="100" y="186" fontSize="22" fill="#5f5143">
          change the database, and the screen finds out at build time
        </text>
        <use href="#pk" x="4" y="-4" width="58" height="58" style={{ color: '#c2410c' }} />
      </svg>

      <svg
        viewBox="0 0 280 470"
        className="md:hidden mt-6 w-full max-w-xs mx-auto h-auto"
        role="img"
        aria-labelledby="typM"
      >
        <title id="typM">
          One unbroken thread runs down through four stops in order: Database, Function, Client and
          Screen. A note says that if the database changes, the screen finds out at build time.
        </title>
        <g
          stroke="var(--paper-text)"
          strokeWidth="2.2"
          fill="var(--paper-bg-alt)"
          strokeLinejoin="round"
          filter="url(#rough)"
        >
          <path d="M60 10 L220 6 L222 76 L62 80 Z" />
          <path d="M60 106 L220 110 L218 176 L62 172 Z" />
          <path d="M60 202 L220 198 L222 268 L62 272 Z" />
          <path d="M60 298 L220 302 L218 372 L62 368 Z" />
        </g>
        <path
          d="M196 2 C 184 30, 208 50, 196 80 S 184 130, 196 160 S 208 220, 196 250 S 184 310, 196 340 S 208 380, 196 400"
          fill="none"
          stroke="#c2410c"
          strokeWidth="3.4"
          strokeLinecap="round"
          filter="url(#rough)"
        />
        <g fontSize="26" fill="var(--paper-text)" textAnchor="start">
          {stops.map((s, i) => (
            <text key={s} x="76" y={36 + i * 96}>
              {s}
            </text>
          ))}
        </g>
        <g fill="#c2410c" stroke="var(--paper-bg-alt)" strokeWidth="2">
          {stops.map((s, i) => (
            <circle key={s} cx="196" cy={60 + i * 96} r="5" />
          ))}
        </g>
        <text x="140" y="432" fontSize="22" fill="#5f5143" textAnchor="middle">
          change the database, and the
        </text>
        <text x="140" y="456" fontSize="22" fill="#5f5143" textAnchor="middle">
          screen finds out at build time
        </text>
        <use href="#pk" x="212" y="-6" width="56" height="56" style={{ color: '#c2410c' }} />
      </svg>
    </>
  )
}
