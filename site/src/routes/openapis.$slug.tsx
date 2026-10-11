import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getOpenApi } from '@/lib/catalogue'

export const Route = createFileRoute('/openapis/$slug')({
  loader: async ({ params }) => { const r = await getOpenApi({ data: params.slug }); if (!r) throw notFound(); return r },
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: ({ loaderData }) => loaderData ? { meta: [{ title: `${loaderData.api.title ?? loaderData.api.name} OpenAPI | Pikku` }] } : {},
  component: Detail,
})
function Detail() {
  const { api, stale } = Route.useLoaderData()
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/openapis" className="text-sm">← OpenAPI catalogue</Link>
      <div className="mt-4 text-xs uppercase text-muted-foreground">{api.name}{api.version && ` · v${api.version}`}</div>
      <h1 className="text-4xl font-bold">{api.title ?? api.name}</h1>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {api.provider && <><dt>Provider</dt><dd>{api.provider}</dd></>}
        {api.operations != null && <><dt>Operations</dt><dd>{api.operations}</dd></>}
        {api.openapiVer && <><dt>Spec version</dt><dd>{api.openapiVer}</dd></>}
        {api.authType && <><dt>Auth</dt><dd>{api.authType}</dd></>}
        {api.specUrl && <><dt>Spec</dt><dd><a href={api.specUrl}>{api.specUrl}</a></dd></>}
      </dl>
      <pre className="mt-6 overflow-auto rounded border border-border p-3 text-sm">{`npx pikku new addon --openapi ${api.specUrl ?? api.name}`}</pre>
      {stale && <p className="mt-4 text-xs text-muted-foreground">Served from a snapshot; the registry did not answer.</p>}
    </main>
  )
}
