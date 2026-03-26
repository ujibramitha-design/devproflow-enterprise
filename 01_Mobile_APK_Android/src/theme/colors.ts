/**
 * Design System Colors — 01_Mobile_APK_Android
 *
 * ⭐ Single Source of Truth: 05_UI_Design_System/Shared/Design_Tokens.json
 * All values re-exported from tokens.ts which reads the JSON directly.
 * primary = #3B82F6 (light) / #60A5FA (dark) — identical to 02_Web_Application.
 *
 * DO NOT hard-code any color values here.
 */

import { Colors as TokenColors } from './tokens'

export const DesignSystemColors = {
  // ── Light mode (default) — Token: colors.light.* ──
  primary:              TokenColors.light.primary,              // #3B82F6
  primaryForeground:    TokenColors.light.primaryForeground,    // #FFFFFF
  primaryVariant:       TokenColors.light.sidebarPrimary,       // #3B82F6

  secondary:            TokenColors.light.secondary,            // #F5F5F4
  secondaryForeground:  TokenColors.light.secondaryForeground,  // #1C1917

  background:           TokenColors.light.background,           // #FAFAF9
  foreground:           TokenColors.light.foreground,           // #18181B

  surface:              TokenColors.light.card,                 // #FFFFFF
  surfaceVariant:       TokenColors.light.muted,                // #F0F0EE
  card:                 TokenColors.light.card,                 // #FFFFFF
  cardForeground:       TokenColors.light.cardForeground,       // #18181B

  border:               TokenColors.light.border,               // #E7E5E4
  input:                TokenColors.light.input,                // #E7E5E4
  ring:                 TokenColors.light.ring,                 // #3B82F6

  muted:                TokenColors.light.muted,                // #F0F0EE
  mutedForeground:      TokenColors.light.mutedForeground,      // #78716C

  accent:               TokenColors.light.accent,               // #FB923C
  accentForeground:     TokenColors.light.accentForeground,     // #292524

  destructive:          TokenColors.light.destructive,          // #EF4444
  destructiveForeground: TokenColors.light.primaryForeground,   // #FFFFFF

  popover:              TokenColors.light.popover,              // #FFFFFF
  popoverForeground:    TokenColors.light.popoverForeground,    // #18181B

  // ── Semantic colors — Token: colors.light.success/warning/info ──
  success:              TokenColors.light.success,              // #10B981
  warning:              TokenColors.light.warning,              // #F59E0B
  error:                TokenColors.light.destructive,          // #EF4444
  info:                 TokenColors.light.info,                 // #3B82F6

  // ── Chart colors — Token: colors.light.chart* ──
  chart1:               TokenColors.light.chart1,               // #3B82F6
  chart2:               TokenColors.light.chart2,               // #10B981
  chart3:               TokenColors.light.chart3,               // #FB923C
  chart4:               TokenColors.light.chart4,               // #F59E0B
  chart5:               TokenColors.light.chart5,               // #8B5CF6

  // ── Status / SLA semantic aliases ──
  status: {
    pending:    TokenColors.light.warning,                      // #F59E0B
    inProgress: TokenColors.light.info,                         // #3B82F6
    completed:  TokenColors.light.success,                      // #10B981
    failed:     TokenColors.light.destructive,                  // #EF4444
    cancelled:  TokenColors.light.mutedForeground,              // #78716C
  },
  sla: {
    onTrack:    TokenColors.light.success,                      // #10B981
    warning:    TokenColors.light.warning,                      // #F59E0B
    overdue:    TokenColors.light.destructive,                  // #EF4444
    critical:   '#DC2626',
  },

  // ── Dark mode overrides — Token: colors.dark.* ──
  dark: {
    background:     TokenColors.dark.background,    // #0F172A
    foreground:     TokenColors.dark.foreground,    // #F8FAFC
    surface:        TokenColors.dark.card,          // #1E293B
    card:           TokenColors.dark.card,          // #1E293B
    border:         TokenColors.dark.border,        // #475569
    input:          TokenColors.dark.input,         // #475569
    muted:          TokenColors.dark.muted,         // #334155
    mutedForeground: TokenColors.dark.mutedForeground, // #94A3B8
    accent:         TokenColors.dark.accent,        // #FDBA74
    primary:        TokenColors.dark.primary,       // #60A5FA
  },
}

// Color utility functions
export const getColorByStatus = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: DesignSystemColors.status.pending,
    in_progress: DesignSystemColors.status.inProgress,
    completed: DesignSystemColors.status.completed,
    failed: DesignSystemColors.status.failed,
    cancelled: DesignSystemColors.status.cancelled,
  }
  return statusColors[status] || DesignSystemColors.gray[500]
}

export const getColorBySLA = (slaStatus: string): string => {
  const slaColors: Record<string, string> = {
    on_track: DesignSystemColors.sla.onTrack,
    warning: DesignSystemColors.sla.warning,
    overdue: DesignSystemColors.sla.overdue,
    critical: DesignSystemColors.sla.critical,
  }
  return slaColors[slaStatus] || DesignSystemColors.sla.warning
}

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const rgb = parseInt(backgroundColor.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = rgb & 0xff
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

export default DesignSystemColors
