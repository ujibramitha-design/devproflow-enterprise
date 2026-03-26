'use client'

/**
 * DsModal — Web Atomic Component
 *
 * Token chain: Design_Tokens.json → globals.css (CSS vars) → Tailwind → this component
 *
 * Interactions:
 *   open/close → fade + scale animation    (animations.duration.normal, easing.easeOut)
 *   overlay    → bg-black/50 backdrop-blur (scrim)
 *   close btn  → hover:bg-accent           (--accent token)
 *   focus trap → Radix Dialog handles it
 *
 * Built on @radix-ui/react-dialog (already in package.json)
 */

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

// ── Size variants (from spacing.scale tokens) ─────────────────────────────────
type ModalSize = 'sm' | 'default' | 'lg' | 'xl' | 'full'

const modalSizeClass: Record<ModalSize, string> = {
  sm:      'max-w-sm',
  default: 'max-w-lg',
  lg:      'max-w-2xl',
  xl:      'max-w-4xl',
  full:    'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
}

// ── Overlay ────────────────────────────────────────────────────────────────────
function DsModalOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="ds-modal-overlay"
      className={cn(
        // Fixed full-screen overlay — uses scrim/backdrop
        'fixed inset-0 z-modal',
        // Token: bg-black/50 (rgba approximation of scrim token)
        'bg-black/50 backdrop-blur-sm',
        // Animate open/close — animations.duration.normal (200ms)
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

// ── Content ────────────────────────────────────────────────────────────────────
interface DsModalContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  size?:          ModalSize
  showCloseBtn?:  boolean
}

function DsModalContent({
  className,
  children,
  size = 'default',
  showCloseBtn = true,
  ...props
}: DsModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DsModalOverlay />
      <DialogPrimitive.Content
        data-slot="ds-modal-content"
        className={cn(
          // Fixed centered position
          'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
          // Size
          'w-full',
          modalSizeClass[size],
          // Token: bg-background, border-border, rounded-lg
          // rounded-lg = --radius (1rem) from radius.base
          'bg-background border border-border rounded-lg',
          // Shadow — shadows.xl token
          'shadow-xl',
          // Focus outline
          'outline-none',
          // Animations (open/close) — duration.normal (200ms)
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          // Duration from animations token
          'duration-200',
          className,
        )}
        {...props}
      >
        {children}

        {/* Close button — hover:bg-accent token */}
        {showCloseBtn && (
          <DialogPrimitive.Close
            data-slot="ds-modal-close-btn"
            className={cn(
              'absolute right-4 top-4',
              'flex size-7 items-center justify-center rounded-md',
              'text-muted-foreground',
              // Hover — bg-accent from --accent token
              'transition-colors duration-150',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            aria-label="Close modal"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

// ── Header, Body, Footer slots ─────────────────────────────────────────────────
function DsModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="ds-modal-header"
      className={cn(
        'flex flex-col gap-1.5 border-b border-border px-6 py-4',
        className,
      )}
      {...props}
    />
  )
}

function DsModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="ds-modal-title"
      // textStyles.h3: text-2xl font-semibold
      className={cn('text-lg font-semibold leading-none text-foreground', className)}
      {...props}
    />
  )
}

function DsModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="ds-modal-description"
      // textStyles.bodySmall
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function DsModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="ds-modal-body"
      // padding from spacing.scale[6] = 24px
      className={cn('px-6 py-4', className)}
      {...props}
    />
  )
}

function DsModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="ds-modal-footer"
      className={cn(
        'flex items-center justify-end gap-2',
        'border-t border-border bg-muted/50 px-6 py-4',
        'rounded-b-lg',
        className,
      )}
      {...props}
    />
  )
}

// ── Root re-exports ────────────────────────────────────────────────────────────
const DsModal         = DialogPrimitive.Root
const DsModalTrigger  = DialogPrimitive.Trigger
const DsModalClose    = DialogPrimitive.Close
const DsModalPortal   = DialogPrimitive.Portal

export {
  DsModal,
  DsModalTrigger,
  DsModalContent,
  DsModalOverlay,
  DsModalHeader,
  DsModalTitle,
  DsModalDescription,
  DsModalBody,
  DsModalFooter,
  DsModalClose,
  DsModalPortal,
}
export default DsModal
