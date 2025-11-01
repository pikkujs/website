import React, { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export interface CardProps {
  /** Optional icon or image to display at the top */
  icon?: ReactNode;
  /** Card title */
  title?: string;
  /** Card description/content */
  description?: string | ReactNode;
  /** Optional link configuration */
  link?: {
    href: string;
    text: string;
    external?: boolean;
  };
  /** Additional CSS classes */
  className?: string;
  /** Children for custom card content */
  children?: ReactNode;
  /** Variant for different card styles */
  variant?: 'default' | 'white' | 'testimonial' | 'minimal';
}

/**
 * Reusable Card component with consistent Pikku styling
 *
 * Variants:
 * - default: bg-neutral-50 dark:bg-neutral-900 with border-2 border-primary (main pikku style)
 * - white: bg-white dark:bg-neutral-900 with subtle border (for lighter sections)
 * - testimonial: bg-white dark:bg-neutral-900 with gray border (for testimonials)
 * - minimal: bg-white dark:bg-neutral-800 without border (for simple cards)
 *
 * @example
 * ```tsx
 * <Card
 *   icon="💰"
 *   title="Cost Optimization"
 *   description="Start optimizing your infrastructure budget"
 *   link={{ href: '/why/vendor-lock-in', text: 'Learn more →' }}
 *   variant="default"
 * />
 * ```
 */
export default function Card({
  icon,
  title,
  description,
  link,
  className,
  children,
  variant = 'default'
}: CardProps) {
  const variantClasses = {
    default: 'bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 shadow-md border-2 border-primary',
    white: 'bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md',
    testimonial: 'bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-neutral-800',
    minimal: 'bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md'
  };

  return (
    <div className={clsx(variantClasses[variant], className)}>
      {icon && (
        <div className="text-5xl mb-4">
          {icon}
        </div>
      )}

      {title && (
        <h3 className="text-xl font-bold mb-3">
          {title}
        </h3>
      )}

      {description && (
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
      )}

      {children}

      {link && (
        <Link
          to={link.href}
          className="text-primary hover:underline font-medium text-sm inline-block mt-2"
        >
          {link.text}
        </Link>
      )}
    </div>
  );
}
