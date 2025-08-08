import React, { useEffect, useRef } from 'react'
import sdk from '@stackblitz/sdk'

export const Stackblitz: React.FunctionComponent<{ repo: string, initialFiles: string[] }> = ({ repo, initialFiles }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const openFile = initialFiles.map(f => f) 
        await sdk.embedGithubProject(
          containerRef.current,
          `pikkujs/${repo}`, {
          height: 800,
          openFile: openFile.filter(f => !f.startsWith('client/')),
          view: 'editor',
          showSidebar: false,
          clickToLoad: true
        });
      } catch {
        console.log('Error')
      }
    }
    load()
  }, []);

  return <div className='h-[800px] rounded-md border border-zinc-2'>
    <div ref={containerRef}></div>
  </div>;
}