import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export interface CardProps {
  icon?: ReactNode
  title?: string
  description?: string | ReactNode
  link?: { href: string; text: string; external?: boolean }
  className?: string
  children?: ReactNode
  variant?: 'default' | 'white' | 'testimonial' | 'minimal'
}

/** Content card used in blog posts and docs. Paper surface, wobbly corners. */
export default function Card({ icon, title, description, link, className, children, variant = 'default' }: CardProps) {
  return (
    <div className={cn('pk-card', variant === 'minimal' && 'pk-card--minimal', className)}>
      {icon && <div className="mb-3 text-4xl">{icon}</div>}
      {title && <h3 className="pk-card-title">{title}</h3>}
      {description && <div className="pk-card-desc">{typeof description === 'string' ? <p>{description}</p> : description}</div>}
      {children}
      {link && (link.external || /^https?:/.test(link.href)
        ? <a href={link.href} target="_blank" rel="noreferrer" className="pk-card-link">{link.text}</a>
        : <Link to={link.href as any} className="pk-card-link">{link.text}</Link>)}
    </div>
  )
}
export { Card }
