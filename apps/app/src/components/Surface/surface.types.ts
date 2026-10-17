/* ════════════════════════════════════════════════════════════════
   Copied verbatim from packages/console/src/components/surface/surface.types.ts,
   minus the usage types the website has no source for.

   `SurfacePage.tsx` in the console says why the copy is legitimate:
   "the doc and the measured usage are supplied rather than fetched here, so the
   same page serves the website — which has the doc for a released version and
   can measure nothing — and the console, which has both."
   ════════════════════════════════════════════════════════════════ */

export type SurfaceKind =
  | 'function'
  | 'class'
  | 'interface'
  | 'type'
  | 'const'
  | 'enum'
  | 'namespace';

/**
 * The order in which you meet these doors while building a service. It is the
 * page's spine: the navigator groups by it and the reading order follows it.
 */
export type SurfaceStep =
  | 'create a function'
  | 'enhance it'
  | 'wire it up'
  | 'guard it'
  | 'orchestrate it'
  | 'test it';

export type SurfaceOrigin =
  | { via: 'generated' }
  | { via: 'core'; subpath: string }
  | { via: 'package'; packageName: string };

export interface SurfaceMember {
  line: string;
  doc?: string;
}

export interface SurfaceSymbol {
  name: string;
  kind: SurfaceKind;
  origin: SurfaceOrigin;
  /** One line, for a list row. */
  summary?: string;
  /** The full documentation, for the panel that reads one export. */
  docs?: string;
  signature?: string;
  examples?: string[];
  members?: SurfaceMember[];
  status?: string;
  deprecated?: string;
}

export interface SurfaceLeaf {
  /** The specifier you import from, e.g. `#pikku/http`. */
  specifier: string;
  name: string;
  step: SurfaceStep;
  summary: string;
  symbols: SurfaceSymbol[];
}

export type SurfaceEntryPointId = 'app' | 'addon';

export interface SurfaceEntryPoint {
  id: SurfaceEntryPointId;
  /** What someone reaching for this entry point is trying to do. */
  job: string;
  specifierBase: string;
  summary: string;
  leaves: SurfaceLeaf[];
}

export interface SurfaceDoc {
  version: string;
  entryPoints: SurfaceEntryPoint[];
}
