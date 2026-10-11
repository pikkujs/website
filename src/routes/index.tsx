import { createFileRoute, Link } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: () => <main className="p-10"><h1 className="text-3xl">Pikku docs (Fumadocs headless v2)</h1><ul className="mt-4 space-y-1"><li><Link to="/docs/$" params={{ _splat: '' }}>Docs</Link></li><li><Link to="/blog">Blog</Link></li><li><Link to="/addons">Addons</Link></li></ul></main> })
