import { notFound } from '@tanstack/react-router'
export async function fetchPayload<T>(url: string): Promise<T> {
  const r = await fetch(url)
  if (r.status === 404) throw notFound()
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`)
  return r.json() as Promise<T>
}
