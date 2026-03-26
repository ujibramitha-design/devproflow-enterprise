'use client'

/**
 * DsButton — Web Atomic Component
 *
 * Token chain: Design_Tokens.json → globals.css (CSS vars) → Tailwind → this component
 *
 * Interactions (all token-sourced):
 *   hover  → bg-primary/90        (opacity modifier on --primary)
 *   active → scale-[0.97]         (spacing.scale subtlety)
 *   focus  → ring-2 ring-ring     (--ring = colors.light.ring)
 *   disabled → opacity-50         (opacity tokens)
 *   loading → spinner + disabled
 *
 * Variants use: --primary, --secondary, --destructive, --accent,
 *               --devpro-success, --devpro-warning
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Variants (all classes resolve to CSS vars from Design_Tokens.json) ────────
const dsButtonVariants = cva(
  // ── Base ──
  // rounded-lg = --radius (1rem) | font-medium = typography.fontWeight.medium
  // transition uses animations.duration.fast (150ms)
  // focus ring uses --ring token
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-lg text-sm font-medium font-sans',
    'transition-all duration-150 ease-in-out',
    'select-none',
    // Focus visible — ring from --ring token
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // Active — subtle scale (platform-consistent feel)
    'active:scale-[0.97]',
    // Disabled
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    // SVG icons
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        // ── Standard tokens (colors.light.*) ──
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70',
        outline:
          'border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        link:
          'text-primary underline-offset-4 hover:underline active:opacity-70 p-0 h-auto',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive',

        // ── Extended semantic tokens (devpro-*) ──
        success:
          'bg-devpro-success text-white shadow-sm hover:bg-devpro-success/90 active:bg-devpro-success/80',
        warning:
          'bg-devpro-warning text-white shadow-sm hover:bg-devpro-warning/90 active:bg-devpro-warning/80',
        devpro:
          'devpro-gradient text-white shadow-md hover:opacity-90 active:opacity-80',
      },

      size: {
        // Heights from spacing scale tokens
        xs:      'h-7 px-2.5 text-xs gap-1 [&_svg]:size-3',      // ~28px
        sm:      'h-8 px-3 text-xs gap-1.5 [&_svg]:size-3.5',    // 32px
        default: 'h-9 px-4 text-sm gap-2 [&_svg]:size-4',        // 36px
        lg:      'h-10 px-5 text-sm gap-2 [&_svg]:size-4',       // 40px
        xl:      'h-12 px-6 text-base gap-2.5 [&_svg]:size-5',   // 48px
        icon:    'size-9 [&_svg]:size-4',
        'icon-sm': 'size-8 [&_svg]:size-3.5',
        'icon-lg': 'size-10 [&_svg]:size-5',
      },

      fullWidth: {
        true:  'w-full justify-center',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  },
)

// ── Props ─────────────────────────────────────────────────────────────────────
export interface DsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dsButtonVariants> {
  asChild?:    boolean
  loading?:    boolean
  leftIcon?:   React.ReactNode
  rightIcon?:  React.ReactNode
}

// ── Component ─────────────────────────────────────────────────────────────────
const DsButton = React.forwardRef<HTMLButtonElement, DsButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        data-slot="ds-button"
        data-variant={variant}
        disabled={isDisabled}
        className={cn(dsButtonVariants({ variant, size, fullWidth }), className)}
        aria-busy={loading}
        {...props}
      >
        {/* Loading spinner (same size as icon) */}
        {loading && (
          <Spinner
            className={cn(
              size === 'xs' || size === 'sm'   ? 'size-3' :
              size === 'xl'                    ? 'size-5' : 'size-4',
            )}
          />
        )}

        {/* Left icon (hidden when loading to avoid double icon) */}
        {!loading && leftIcon}

        {/* Content */}
        {children}

        {/* Right icon */}
        {!loading && rightIcon}
      </Comp>
    )
  },
)
DsButton.displayName = 'DsButton'

export { DsButton, dsButtonVariants }
export default DsButton
