import type { Plugin } from 'vite'
export default function linkCheck(opts?: { outDir?: string; isKnown?: (url: string) => boolean; isIgnored?: RegExp[] | ((url: string) => boolean); failOnError?: boolean }): Plugin
