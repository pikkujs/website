import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link as RLink } from '@tanstack/react-router'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to?: string; href?: string; children?: ReactNode }

/** Internal paths use client-side routing; external URLs, hashes, files and mailto use a plain anchor. */
export default function Link({ to, href, children, ...rest }: Props) {
  const target = to ?? href ?? '#'
  const internal = target.startsWith('/') && !target.startsWith('//') && !/\.(json|xml|svg|png|webp|cast|txt)(#|$)/.test(target)
  if (internal) return <RLink to={target as any} {...(rest as any)}>{children}</RLink>
  const ext = /^https?:\/\//.test(target)
  return <a href={target} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>
}
export { Link }
