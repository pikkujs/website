import { useEffect, useRef } from 'react'

/** Embeds a pikkujs GitHub template in StackBlitz. Client-only; the SDK is loaded after mount. */
export function Stackblitz({ repo, initialFiles }: { repo: string; initialFiles: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let live = true
    import('@stackblitz/sdk').then(async ({ default: sdk }) => {
      if (!live || !ref.current) return
      try {
        await sdk.embedGithubProject(ref.current, `pikkujs/${repo}`, { height: 800, openFile: initialFiles, view: 'editor', showSidebar: false, clickToLoad: false })
      } catch (e) { console.error('Failed to load StackBlitz project:', e) }
    })
    return () => { live = false }
  }, [repo, initialFiles.join(',')])
  return <div className="pk-embed" style={{ height: 800 }}><div ref={ref} /></div>
}
