import type { SurfaceOrigin } from './surface.types';

/* Copied from packages/console/src/components/surface/surface-docs.ts. */

export type SurfaceDocBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'code'; text: string };

/**
 * A doc comment as the panel should read it. The source is wrapped to whatever
 * column its author's editor used, so a paragraph's own line breaks are an
 * artefact and get reflowed, while blank lines and fenced examples are what the
 * author meant and are kept as written.
 */
export const docBlocks = (docs: string): SurfaceDocBlock[] => {
  const blocks: SurfaceDocBlock[] = [];
  const segments = docs.split(/```[^\n]*\n?/);

  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      const text = segment.replace(/\n$/, '');
      if (text.trim()) blocks.push({ kind: 'code', text });
      return;
    }
    for (const paragraph of segment.split(/\n\s*\n/)) {
      const text = paragraph.replace(/\s*\n\s*/g, ' ').trim();
      if (text) blocks.push({ kind: 'prose', text });
    }
  });

  return blocks;
};

/**
 * Where a symbol was declared, as a sentence rather than a path. The console's
 * surface-copy.ts does this through Paraglide messages; the website has no
 * catalogue, so the English is inlined — the same three sentences as
 * `surface_origin_*` in packages/console/messages/en.json, except that a core
 * subpath arrives as `./errors` and is resolved to the specifier you would
 * actually type, the way scripts/generate-api-surface.mjs already writes it.
 */
export const originText = (origin?: SurfaceOrigin): string => {
  if (!origin) return '';
  if (origin.via === 'core') {
    return `Re-exported from @pikku/core${origin.subpath.replace(/^\./, '')}`;
  }
  if (origin.via === 'package') return `Re-exported from ${origin.packageName}`;
  return 'Generated for this project';
};

/** The same fact as a chip rather than a sentence — a list row has no room. */
export const originChip = (origin?: SurfaceOrigin): string => {
  if (!origin) return '';
  if (origin.via === 'core') return `@pikku/core${origin.subpath.replace(/^\./, '')}`;
  if (origin.via === 'package') return origin.packageName;
  return 'generated';
};

/** An `@example` arrives either fenced or bare; the panel renders it fenceless. */
export const unfence = (example: string): string =>
  String(example)
    .replace(/^```[^\n]*\n?/, '')
    .replace(/```\s*$/, '')
    .replace(/\n$/, '');

/**
 * Upstream JSDoc writes specifiers and export names in backticks, so a summary
 * rendered as plain text shows the backticks themselves. Splitting on them is
 * the whole of the markdown this page needs — the doc comments contain no other
 * inline syntax, and the generated reference does the same thing in reverse
 * (scripts/generate-api-surface.mjs adds backticks where JSDoc forgot them).
 */
export const inlineSpans = (text: string): { code: boolean; text: string }[] =>
  text
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`')
        ? { code: true, text: part.slice(1, -1) }
        : { code: false, text: part }
    );
