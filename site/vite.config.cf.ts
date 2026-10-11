import { mergeConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import base from './vite.config.ts'

// Same app, Workers SSR bundle: `vite build -c vite.config.cf.ts`
export default mergeConfig(base, { plugins: [cloudflare({ viteEnvironment: { name: 'ssr' } })] })
