import * as React from 'react'
import * as D from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
export const Sheet = D.Root
export const SheetTrigger = D.Trigger
export const SheetTitle = D.Title
export const SheetContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof D.Content>>(({ className, children, ...p }, ref) => (
  <D.Portal>
    <D.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <D.Content ref={ref} className={cn('fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background p-4 shadow-lg border-r border-border', className)} {...p}>
      <D.Description className="sr-only">Navigation</D.Description>{children}
    </D.Content>
  </D.Portal>))
SheetContent.displayName = 'SheetContent'
