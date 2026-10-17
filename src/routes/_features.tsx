import { createFileRoute, Outlet } from '@tanstack/react-router'
import { FeaturesShell } from '@/components/features/FeaturesShell'

/** Pathless layout: /features and every page in the Features menu (/core/*, /wires/*, /deploy/*, /benchmarks). */
export const Route = createFileRoute('/_features')({
  component: () => <FeaturesShell><Outlet /></FeaturesShell>,
})
