/** Broken-link detection is the build's link gate (packages/vite-link-check), not a runtime hook. */
export default function useBrokenLinks() { return { collectAnchor(_id?: string) {}, collectLink(_href?: string) {} } }
