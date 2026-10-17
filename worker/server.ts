import handler from '@tanstack/react-start/server-entry'

// Pages are the same for everyone and change only when the registry does, so cache the rendered response at the
// edge. A Worker's own responses are not cached automatically: the Cache API is the cache. Stale responses are
// served while a fresh one renders, so a registry change shows up within the TTL with no rebuild and no purge.
const TTL = 3600
const STALE = 86400

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'GET') return handler.fetch(request)
    const cache = (caches as unknown as { default: Cache }).default
    const hit = await cache.match(request)
    if (hit) return hit
    const res = await handler.fetch(request)
    if (res.status !== 200) return res // 404s and errors are never cached, so a newly published addon appears at once
    const out = new Response(res.body, res)
    out.headers.set('Cache-Control', `public, s-maxage=${TTL}, stale-while-revalidate=${STALE}`)
    ctx.waitUntil(cache.put(request, out.clone()))
    return out
  },
}
