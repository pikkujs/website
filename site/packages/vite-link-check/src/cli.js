#!/usr/bin/env node
import { crawl } from './index.js'
const r = crawl({ outDir: process.argv[2] ?? 'dist/client' })
console.log(`crawled ${r.pages} pages, ${r.links} links, ${r.errors.length} broken`)
if (r.errors.length) { console.error(r.errors.join('\n')); process.exit(1) }
