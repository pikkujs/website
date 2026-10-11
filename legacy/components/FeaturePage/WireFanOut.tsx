import React from 'react';
import styles from './wire-fan-out.module.css';

/* One function, every wiring — drawn rather than asserted.
   Replaces the single 120px wire glyph that used to sit in the wire-page hero:
   the glyph said which page you were on, this says what the page is about and
   still says which one you are on, by lighting that wire. */

// Sidebar order (sidebars.ts) — the site's canonical ordering of the wires.
const WIRES = [
  'rpc', 'http', 'websocket', 'queue', 'cron', 'workflow',
  'agent', 'mcp', 'cli', 'trigger', 'gateway',
] as const;

// 366 leaves the longest label ('websocket') the same 12px margin the node
// keeps on the left, so the diagram sits centred in its panel.
const VB_W = 366;
const ROW_H = 32;
const TOP = 26;
const HEIGHT = TOP * 2 + ROW_H * (WIRES.length - 1);
const MID = HEIGHT / 2;

const NODE_X = 116; // right edge of the function node, where every wire leaves
const DOT_X = 272;
const LABEL_X = 286;

export function WireFanOut({ active }: { active: string }) {
  return (
    <svg
      className={styles.diagram}
      viewBox={`0 0 ${VB_W} ${HEIGHT}`}
      role="img"
      aria-label={`One Pikku function fanning out to ${WIRES.length} wirings, with ${active} highlighted`}
    >
      {/* Wires first so the node's fill covers where they start */}
      {WIRES.map((wire, i) => {
        const y = TOP + i * ROW_H;
        const on = wire === active;
        return (
          <g key={wire} className={on ? styles.rowOn : styles.row} style={{ '--i': i } as React.CSSProperties}>
            <path
              className={styles.wire}
              d={`M ${NODE_X} ${MID} C ${NODE_X + 74} ${MID}, ${DOT_X - 74} ${y}, ${DOT_X} ${y}`}
              pathLength={1}
              fill="none"
            />
            <circle className={styles.dot} cx={DOT_X} cy={y} r={on ? 3.5 : 2.5} />
            <text className={styles.label} x={LABEL_X} y={y + 4}>
              {wire}
            </text>
          </g>
        );
      })}

      <g className={styles.node}>
        <rect x={12} y={MID - 23} width={104} height={46} rx={11} />
        <text className={styles.nodeText} x={64} y={MID + 5} textAnchor="middle">
          func()
        </text>
      </g>

      <text className={styles.caption} x={64} y={MID + 44} textAnchor="middle">
        one function
      </text>
    </svg>
  );
}
