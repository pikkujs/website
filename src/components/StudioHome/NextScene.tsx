export function NextScene() {
  return (
    <>
      <svg
        viewBox="0 0 320 260"
        className="hidden md:block w-full max-w-xs mx-auto h-auto"
        aria-hidden="true"
      >
        <ellipse
          cx="160"
          cy="150"
          rx="130"
          ry="100"
          fill="#c2410c"
          opacity=".35"
          filter="url(#wash)"
        />
        <path
          d="M10 236 C 90 220, 200 240, 312 226"
          fill="none"
          stroke="#b08a5f"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#rough)"
        />
        <g className="bob">
          <use href="#pk" x="50" y="20" width="220" height="220" style={{ color: '#f0a56f' }} />
        </g>
        <text x="196" y="40" fontSize="26" fill="#f0a56f" transform="rotate(6 196 40)">
          see you there
        </text>
      </svg>
    </>
  )
}
