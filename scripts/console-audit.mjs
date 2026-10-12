// Opens every route type on the GitHub Pages emulation of dist/client in headless Chromium and fails on any
// hydration error or other console error / page error. Usage: node scripts/console-audit.mjs [port]
// Needs a Chromium that playwright-core can find (npx playwright-core install chromium, or PLAYWRIGHT_BROWSERS_PATH).
import { chromium } from 'playwright-core'
import { startPagesServer } from './pages-server.mjs'

const port = Number(process.argv[2] || 3008)
const routes = ['/', '/developers/', '/getting-started/', '/api/', '/features/', '/benchmarks/', '/wires/http/', '/core/function/', '/deploy/standalone/',
  '/docs/wiring/queue/', '/docs/', '/blog/', '/blog/2026/02/26/ai-era-quality/', '/blog/tags/ai/', '/addons/', '/addons/airtable/', '/openapis/', '/openapis/1forge-com/', '/no-such-page/', '/openapis/not-a-spec/']
const server = await startPagesServer({ port })
const browser = await chromium.launch()
let fail = 0
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t) } catch {} }, theme)
  for (const route of routes) {
    const page = await ctx.newPage(); const errs = []
    page.on('pageerror', (e) => errs.push(e.message.split('\n')[0].slice(0, 160)))
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text().split('\n')[0].slice(0, 160)) })
    const res = await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const expected = /no-such|not-a-spec/.test(route) ? 404 : 200
    if (res.status() !== expected) errs.push(`status ${res.status()} (expected ${expected})`)
    if (errs.length) fail++
    console.log(errs.length ? 'FAIL' : 'ok  ', theme.padEnd(5), route, errs.length ? '\n      ' + [...new Set(errs)].join('\n      ') : '')
    await page.close()
  }
  await ctx.close()
}
await browser.close(); server.close()
console.log(fail ? `${fail} route(s) with console errors` : 'no console or hydration errors')
process.exit(fail ? 1 : 0)
