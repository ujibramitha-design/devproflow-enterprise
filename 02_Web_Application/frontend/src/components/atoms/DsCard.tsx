'use client'

/**
 * DsCard — Web Atomic Component
 *
 * Token chain: Design_Tokens.json → globals.css (CSS vars) → Tailwind → this component
 *
 * Interactions:
 *   hoverable  → shadow-lg + -translate-y-0.5    (shadows.lg token + transform)
 *   clickable  → cursor-pointer + active:scale-[0.99]
 *   focus      → ring-2 ring-ring                (--ring token)
 *   disabled   → opacity-50 pointer-events-none
 *
 * Elevation variants map to shadows.sm/md/lg from Design_Tokens.json
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
type CardElevation = 'flat' | 'sm' | 'md' | 'lg'
type CardPadding   = 'none' | 'sm' | 'md' | 'lg'

export interface DsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?:  CardElevation
  padding?:    CardPadding
  hoverable?:  boolean
  clickable?:  boolean
  bordered?:   boolean
  disabled?:   boolean
  header?:     React.ReactNode
  footer?:     React.ReactNode
  headerClassName?: string
  footerClassName?: string
}

// ── Elevation → shadow classes (from shadows.* tokens) ───────────────────────
const elevationClass: Record<CardElevation, string> = {
  flat: 'shadow-none',
  sm:   'shadow-sm',
  md:   'shadow-md',
  lg:   'shadow-lg',
}

// ── Padding → padding classes (from spacing.scale tokens) ────────────────────
const paddingClass: Record<CardPadding, string> = {
  none: 'p-0',
  sm:   'p-3',     // spacing.scale[3] = 12px
  md:   'p-4',     // spacing.scale[4] = 16px
  lg:   'p-6',     // spacing.scale[6] = 24px
}

// ── Component ─────────────────────────────────────────────────────────────────
const DsCard = React.forwardRef<HTMLDivElement, DsCardProps>(
  (
    {
      className,
      elevation  = 'md',
      padding    = 'md',
      hoverable  = false,
      clickable  = false,
      bordered   = true,
      disabled   = false,
      header,
      footer,
      headerClassName,
      footerClassName,
      children,
      onClick,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const isInteractive = clickable || !!onClick

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick?.(e as any)
      }
      onKeyDown?.(e)
    }

    return (
      <div
        ref={ref}
        data-slot="ds-card"
        data-interactive={isInteractive || undefined}
        data-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        tabIndex={isInteractive && !disabled ? (tabIndex ?? 0) : tabIndex}
        role={isInteractive ? 'button' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          // ── Base — bg-card, border-border, rounded-lg ──
          // rounded-lg = --radius (1rem) from radius.base token
          'bg-card text-card-foreground rounded-lg font-sans',
          // Border — border-border token
          bordered && 'border border-border',
          // Elevation — shadows.* tokens
          elevationClass[elevation],
          // Transition — animations.duration.normal (200ms)
          'transition-all duration-200 ease-in-out',
          // Hoverable — lift effect (shadows.lg)
          hoverable && !disabled && [
            'hover:shadow-lg hover:-translate-y-0.5',
          ],
          // Clickable / Interactive
          isInteractive && !disabled && [
            'cursor-pointer',
            'active:scale-[0.99] active:shadow-sm',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'focus-visible:outline-none',
          ],
          // Disabled
          disabled && 'opacity-50 pointer-events-none',
          // Overflow for rounded corners
          'overflow-hidden',
          className,
        )}
        {...props}
      >
        {/* Header slot */}
        {header && (
          <div
            className={cn(
              'border-b border-border px-4 py-3',
              'text-sm font-semibold text-foreground',
              headerClassName,
            )}
          >
            {header}
          </div>
        )}

        {/* Content */}
        <div className={cn(paddingClass[padding])}>
          {children}
        </div>

        {/* Footer slot */}
        {footer && (
          <div
            className={cn(
              'border-t border-border bg-muted/50 px-4 py-3',
              'text-sm text-muted-foreground',
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    )
  },
)
DsCard.displayName = 'DsCard'

// ── Sub-components (compatible with shadcn Card API) ──────────────────────────
function DsCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

function DsCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-tight text-foreground', className)} {...props} />
}

function DsCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function DsCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 pb-4', className)} {...props} />
}

function DsCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2 border-t border-border bg-muted/50 px-4 py-3', className)} {...props} />
  )
}

DsCardHeader.displayName     = 'DsCardHeader'
DsCardTitle.displayName      = 'DsCardTitle'
DsCardDescription.displayName= 'DsCardDescription'
DsCardContent.displayName    = 'DsCardContent'
DsCardFooter.displayName     = 'DsCardFooter'

export {
  DsCard,
  DsCardHeader,
  DsCardTitle,
  DsCardDescription,
  DsCardContent,
  DsCardFooter,
}
export default DsCard
