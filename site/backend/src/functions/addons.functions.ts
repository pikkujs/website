import { z } from 'zod'
import { pikkuSessionlessFunc } from '#pikku/function'

export const AddonSummary = z.object({
  slug: z.string(),
  name: z.string(),
  title: z.string(),
  category: z.string(),
  categoryLabel: z.string(),
  description: z.string().nullable(),
  functionCount: z.number(),
})

export const AddonFunction = z.object({
  name: z.string(),
  rpc: z.string().nullable(),
  description: z.string().nullable(),
  input: z.string().nullable(),
  output: z.string().nullable(),
})

export const AddonSecret = z.object({
  name: z.string(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  secretId: z.string(),
  optional: z.boolean().optional(),
})

export const ListAddonsInput = z.object({})
export const ListAddonsOutput = z.object({ addons: z.array(AddonSummary) })
export const GetAddonInput = z.object({ slug: z.string() })
export const GetAddonOutput = z.object({
  slug: z.string(),
  name: z.string(),
  title: z.string(),
  version: z.string().nullable(),
  description: z.string().nullable(),
  category: z.string(),
  categoryLabel: z.string(),
  secrets: z.array(AddonSecret),
  functions: z.array(AddonFunction),
})

export const listAddons = pikkuSessionlessFunc({
  expose: true,
  auth: false, // a public catalogue: declared public on purpose
  description: 'List every addon in the catalogue with its category and function count.',
  input: ListAddonsInput,
  output: ListAddonsOutput,
  func: async ({ kysely }) => {
    const rows = await kysely
      .selectFrom('addon')
      .leftJoin('addonFunction', 'addonFunction.addonSlug', 'addon.slug')
      .select(({ fn }) => [
        'addon.slug', 'addon.name', 'addon.title', 'addon.category', 'addon.categoryLabel', 'addon.description',
        fn.count<number>('addonFunction.position').as('functionCount'),
      ])
      .groupBy('addon.slug')
      .orderBy('addon.title')
      .execute()
    return {
      addons: rows.map((r) => ({
        slug: r.slug, name: r.name, title: r.title, category: r.category,
        categoryLabel: r.categoryLabel, description: r.description, functionCount: Number(r.functionCount),
      })),
    }
  },
})

export const getAddon = pikkuSessionlessFunc({
  expose: true,
  auth: false, // a public catalogue: declared public on purpose
  description: 'Get one addon by slug, with its secrets and every function it exposes.',
  input: GetAddonInput,
  output: GetAddonOutput,
  func: async ({ kysely }, { slug }) => {
    const addon = await kysely.selectFrom('addon').selectAll().where('slug', '=', slug).executeTakeFirst()
    if (!addon) throw new Error(`Addon not found: ${slug}`)
    const functions = await kysely
      .selectFrom('addonFunction')
      .select(['name', 'rpc', 'description', 'input', 'output'])
      .where('addonSlug', '=', slug)
      .orderBy('position')
      .execute()
    return {
      slug: addon.slug, name: addon.name, title: addon.title, version: addon.version,
      description: addon.description, category: addon.category, categoryLabel: addon.categoryLabel,
      secrets: JSON.parse(addon.secrets),
      functions,
    }
  },
})
