"use client"

/**
 * DsHeader — Proof-of-Concept Component
 *
 * Demonstrates 100% token-based styling from Design_Tokens.json.
 * Zero hard-coded colors, spacing, or fonts.
 *
 * Token chain:
 *   Design_Tokens.json → globals.css (CSS vars) → Tailwind classes → this component
 *
 * Verify tokens used:
 *   - colors.light.background      → bg-background
 *   - colors.light.primary         → text-primary, border-primary
 *   - colors.light.foreground      → text-foreground
 *   - colors.light.mutedForeground → text-muted-foreground
 *   - colors.light.border          → border-border
 *   - colors.light.sidebar         → bg-sidebar
 *   - typography.fontFamily.sans   → font-sans
 *   - typography.fontSize.*        → text-sm, text-base, text-xl
 *   - typography.fontWeight.*      → font-semibold, font-medium
 *   - radius.base                  → rounded-lg (1rem)
 *   - shadows.md                   → shadow-md
 *   - spacing.scale.*              → px-4, py-3, gap-2, etc.
 */

import { Bell, Search, Moon, Sun, Menu, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface DsHeaderProps {
  title?: string
  subtitle?: string
  breadcrumbs?: string[]
}

export function DsHeader({
  title = 'Dashboard',
  subtitle = 'DevPro Flow Enterprise',
  breadcrumbs = ['Home', 'Dashboard'],
}: DsHeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const toggleDark = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header
      className={[
        'w-full border-b border-border bg-background',
        'shadow-md',
        'font-sans',
      ].join(' ')}
    >
      {/* Top strip — primary brand bar */}
      <div className="h-1 w-full bg-primary" />

      <div className="flex items-center justify-between px-6 py-3 gap-4">

        {/* ── LEFT: Logo + Title ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo mark — uses primary token */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md">
            <span className="text-sm font-semibold text-primary-foreground">DP</span>
          </div>

          <div className="min-w-0">
            {/* App name — textStyle: h4 */}
            <p className="truncate text-xl font-semibold leading-tight text-foreground">
              {subtitle}
            </p>
            {/* Breadcrumb — textStyle: caption */}
            <nav className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3" />}
                  <span className={i === breadcrumbs.length - 1 ? 'text-foreground' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* ── CENTER: Search ── */}
        <div className="hidden flex-1 max-w-sm md:flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
            ⌘K
          </kbd>
        </div>

        {/* ── RIGHT: Actions ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification button */}
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Bell className="size-4" />
            {/* Notification dot — uses destructive token */}
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleDark}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* User avatar */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold shadow-md transition-opacity hover:opacity-90"
          >
            AD
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent md:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default DsHeader
