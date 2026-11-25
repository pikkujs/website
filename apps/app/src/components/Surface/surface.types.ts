/* The shape of public/api-surface.json. */

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
  /** The HTTP status an error class answers with. */
  status?: number;
  deprecated?: string;
}

export interface SurfaceLeaf {
  /** The specifier you import from, e.g. `#pikku/http`. */
  specifier: string;
  name: string;
  step: SurfaceStep;
  summary: string;
  /** The Pikku agent skill that teaches this door, when the data names one. */
  skill?: string;
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
