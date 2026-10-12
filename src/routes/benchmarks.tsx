import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/benchmarks'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/benchmarks')({
  head: () => pageHead({ title: "Benchmarks", description: "Pikku performance benchmarks \u2014 Express, Fastify, uWS, and in-process fetch() compared.", path: '/benchmarks' }),
  component: Page,
})
