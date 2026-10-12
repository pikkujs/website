// Writes src/tailwind-theme.css from the light :root block of tokens.css, so the tokens are declared once.
// Tailwind v4 needs the names in @theme to generate utilities (bg-paper, text-claydeep, font-display ...).
// Run: npm run gen -w @pikku/theme-brand   (also run by `npm run build` of the consuming site)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src')
const css = fs.readFileSync(path.join(dir, 'tokens.css'), 'utf8')
const root = /^:root \{([\s\S]*?)^\}/m.exec(css)[1]
const lines = root.split('\n').filter((l) => /^\s*--(color|font)-/.test(l))
fs.writeFileSync(path.join(dir, 'tailwind-theme.css'), `/* GENERATED from tokens.css by scripts/gen-tailwind-theme.mjs, do not edit.
   Import after tailwindcss. Declares the names so utilities exist; tokens.css (imported by the site) stays the single source of values. */
@theme {
${lines.join('\n')}
}
`)
