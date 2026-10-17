#!/usr/bin/env node
import { crawl } from './index.js'
import { isIgnored, isKnown } from '../../../link-gate.config.mjs'
const r = crawl({ outDir: process.argv[2] ?? 'dist/client', isKnown, isIgnored: (h) => isIgnored.some((re) => re.test(h)) })
console.log(`crawled ${r.pages} pages, ${r.links} links, ${r.warnings.length} allowed-missing, ${r.errors.length} broken`)
if (r.errors.length) { console.error(r.errors.join('\n')); process.exit(1) }
