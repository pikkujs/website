export function Stackblitz({ repo }: { repo: string; initialFiles?: string[] }) {
  return <div className="my-4 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">[Stackblitz embed: {repo}]</div>
}
