import { readFileSync } from 'fs'
import { join } from 'path'

const EXAMPLES_DIR = join(__dirname, 'transports')

export function readCodeExample(filename: string): string {
  return readFileSync(join(EXAMPLES_DIR, filename), 'utf-8')
}

export const codeExamples = {
  http: {
    serverCode: () => readCodeExample('http-server.ts'),
    clientCode: () => readCodeExample('http-client.ts'),
  },
  websocket: {
    serverCode: () => readCodeExample('websocket-server.ts'),
    clientCode: () => readCodeExample('websocket-client.ts'),
  },
  sse: {
    serverCode: () => readCodeExample('sse-server.ts'),
    clientCode: () => readCodeExample('sse-client.ts'),
  },
  cron: {
    codeSnippet: () => readCodeExample('cron.ts'),
  },
  queues: {
    codeSnippet: () => readCodeExample('queue.ts'),
  },
  rpc: {
    serverCode: () => readCodeExample('rpc-server.ts'),
    clientCode: () => readCodeExample('rpc-client.ts'),
  },
}