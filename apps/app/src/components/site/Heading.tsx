import { createElement, type HTMLAttributes } from 'react'
export default function Heading({ as = 'h2', ...p }: { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' } & HTMLAttributes<HTMLHeadingElement>) {
  return createElement(as, p)
}
