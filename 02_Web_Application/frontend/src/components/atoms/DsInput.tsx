'use client'

/**
 * DsInput — Web Atomic Component
 *
 * Token chain: Design_Tokens.json → globals.css (CSS vars) → Tailwind → this component
 *
 * Interactions:
 *   focus   → ring-2 ring-ring border-primary   (--ring, --primary tokens)
 *   error   → border-destructive ring-destructive (--destructive token)
 *   hover   → border-primary/60                  (opacity modifier)
 *   disabled → opacity-50 cursor-not-allowed     (opacity token)
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string
  helperText?:  string
  errorText?:   string
  leftIcon?:    React.ReactNode
  rightIcon?:   React.ReactNode
  inputSize?:   'sm' | 'default' | 'lg'
  variant?:     'default' | 'filled' | 'flushed'
  isRequired?:  boolean
}

// ── Component ─────────────────────────────────────────────────────────────────
const DsInput = React.forwardRef<HTMLInputElement, DsInputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      inputSize = 'default',
      variant   = 'default',
      isRequired,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? React.useId()
    const hasError = !!errorText
    const isDisabled = disabled

    // ── Size config ────────────────────────────────────────────────────────
    // Heights map to spacing.scale tokens: sm=32, default=36, lg=40
    const sizeClasses = {
      sm:      'h-8 text-xs px-3',
      default: 'h-9 text-sm px-3',
      lg:      'h-10 text-sm px-4',
    }[inputSize]

    // ── Variant config ─────────────────────────────────────────────────────
    const variantClasses = {
      default: 'border border-border bg-background rounded-lg',
      filled:  'border border-transparent bg-muted rounded-lg',
      flushed: 'border-b border-border bg-transparent rounded-none px-0',
    }[variant]

    return (
      <div className="flex w-full flex-col gap-1.5">

        {/* Label — textStyles.label (sm, medium) */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none text-foreground',
              isDisabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {label}
            {isRequired && (
              <span className="ml-1 text-destructive" aria-hidden>*</span>
            )}
          </label>
        )}

        {/* Input wrapper (for icon positioning) */}
        <div className="relative flex items-center">

          {/* Left icon — uses muted-foreground token */}
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            data-slot="ds-input"
            data-error={hasError || undefined}
            disabled={isDisabled}
            aria-invalid={hasError}
            aria-describedby={
              errorText   ? `${inputId}-error` :
              helperText  ? `${inputId}-helper` : undefined
            }
            className={cn(
              // Base — font-sans, text-foreground
              'w-full font-sans text-foreground placeholder:text-muted-foreground',
              // Transition — animations.duration.fast (150ms)
              'transition-all duration-150',
              // Variant
              variantClasses,
              // Size
              sizeClasses,
              // Icon padding
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              // Hover — border-primary/60
              !hasError && 'hover:border-primary/60',
              // Focus — ring-2 ring-ring border-primary
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
              !hasError && 'focus:border-primary',
              // Error — border-destructive ring-destructive
              hasError && [
                'border-destructive',
                'focus:ring-destructive focus:border-destructive',
                'hover:border-destructive',
              ],
              // Disabled
              isDisabled && 'opacity-50 cursor-not-allowed bg-muted',
              className,
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message — text-destructive, caption size */}
        {errorText && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs font-medium text-destructive"
          >
            <svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1a.5.5 0 0 1 .447.276l4.5 9A.5.5 0 0 1 10.5 11h-9a.5.5 0 0 1-.447-.724l4.5-9A.5.5 0 0 1 6 1zm0 3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2A.5.5 0 0 0 6 4zm0 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
            </svg>
            {errorText}
          </p>
        )}

        {/* Helper text — text-muted-foreground, caption size */}
        {!errorText && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  },
)
DsInput.displayName = 'DsInput'

export { DsInput }
export default DsInput
