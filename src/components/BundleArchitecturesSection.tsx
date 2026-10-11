import Card from './Card'

const architectures = [
  { name: 'Monolith', icon: '🏢', description: 'Run everything in one process', command: 'pikku', bundleSize: '~2.8MB', includes: 'All functions, all protocols' },
  { name: 'Microservices', icon: '📦', description: 'Split by domain or feature', command: 'pikku --http-routes=/admin', altCommand: 'pikku --tags=admin', bundleSize: '~180KB', includes: 'Only admin routes + dependencies' },
  { name: 'Functions', icon: 'λ', description: 'One function per deployment', command: 'pikku --http-routes=/users/:id --types=http', bundleSize: '~50KB', includes: 'Single endpoint + minimal runtime' },
]

/** The three deployment shapes, as cards. */
export function BundleArchitecturesSection() {
  return (
    <div className="my-6 grid gap-6 md:grid-cols-3">
      {architectures.map((a) => (
        <Card key={a.name} className="text-center">
          <div className="mb-2 text-5xl">{a.icon}</div>
          <h3 className="pk-card-title">{a.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{a.description}</p>
          <code className="mb-2 block rounded bg-muted p-2 text-xs">{a.command}</code>
          {a.altCommand && <code className="mb-2 block rounded bg-muted p-2 text-xs">{a.altCommand}</code>}
          <div className="mt-3 border-t border-border pt-3">
            <div className="text-sm font-semibold text-accent">{a.bundleSize}</div>
            <div className="text-xs text-muted-foreground">{a.includes}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
