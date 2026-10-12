/** Shared SVG defs: hand-drawn filters (#rough, #wash) and the cursor symbol (#cur). Render once near the top of <body>. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
        <filter id="wash" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="22" />
        </filter>
        <symbol id="cur" viewBox="0 0 20 28">
          <path
            d="M1 1 L1 22 L7 17 L11 26 L15 24 L11 15 L19 15 Z"
            fill="currentColor"
            stroke="var(--color-ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </symbol>
      </defs>
    </svg>
  )
}
