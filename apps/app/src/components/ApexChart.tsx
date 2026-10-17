import { useEffect, useState, type ComponentType } from 'react'

/** react-apexcharts needs the DOM, so it is loaded after mount and never enters the SSR/Worker bundle. */
export function ApexChart(props: Record<string, any>) {
  const [Chart, setChart] = useState<ComponentType<any> | null>(null)
  useEffect(() => {
    let live = true
    import('react-apexcharts').then((m: any) => live && setChart(() => m.default ?? m))
    return () => { live = false }
  }, [])
  if (!Chart) return <div style={{ height: props.height ?? 300 }} className="grid place-items-center text-sm text-muted-foreground">Loading chart...</div>
  return <Chart {...props} />
}
