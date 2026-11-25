import type {
  SurfaceEntryPoint,
  SurfaceLeaf,
  SurfaceMember,
  SurfaceSymbol,
} from './surface.types';

export interface Hit {
  symbol: SurfaceSymbol;
  leaf: SurfaceLeaf;
}

/** `WeakKeyMaterialError` reads as `weak key material error`. */
export const splitName = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase();

/** Lower is better; null is no match. */
const rank = ({ symbol, leaf }: Hit, query: string, terms: string[]): number | null => {
  const name = symbol.name.toLowerCase();
  const words = splitName(symbol.name);
  const joined = terms.join('');
  if (name === joined) return 0;
  if (symbol.status !== undefined && String(symbol.status) === query) return 1;
  if (name.startsWith(joined)) return 2;
  const wordList = words.split(' ');
  if (
    name.includes(joined) ||
    terms.every((term) => wordList.some((word) => word.startsWith(term)))
  ) {
    return 3;
  }
  const summary = (symbol.summary ?? '').toLowerCase();
  if (summary.includes(query)) return 4;
  if (leaf.name === query || leaf.specifier.toLowerCase() === query) return 5;
  const everything = `${words} ${name} ${summary} ${leaf.name} ${symbol.status ?? ''}`;
  if (terms.every((term) => everything.includes(term))) return 6;
  return null;
};

export const searchSurface = (entry: SurfaceEntryPoint, input: string): Hit[] => {
  const query = input.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const ranked: { hit: Hit; score: number }[] = [];
  for (const leaf of entry.leaves) {
    for (const symbol of leaf.symbols) {
      const hit = { symbol, leaf };
      const score = rank(hit, query, terms);
      if (score !== null) ranked.push({ hit, score });
    }
  }
  // Among prefixes, the shorter name is the closer match.
  return ranked
    .sort(
      (a, b) =>
        a.score - b.score ||
        (a.score === 2 ? a.hit.symbol.name.length - b.hit.symbol.name.length : 0)
    )
    .map((each) => each.hit);
};

export interface SurfaceOption extends SurfaceMember {
  required: boolean;
}

/** A member is required when its declaration has no `?` after the name. */
const isRequired = (line: string): boolean => {
  const match = /^(?:readonly\s+)?[\w$'"-]+(\?)?\s*[:(<]/.exec(line);
  return match !== null && match[1] === undefined;
};

/** Required options first, otherwise in the order the data lists them. */
export const optionsOf = (members: SurfaceMember[]): SurfaceOption[] =>
  members
    .map((member) => ({ ...member, required: isRequired(member.line) }))
    .sort((a, b) => Number(b.required) - Number(a.required));
