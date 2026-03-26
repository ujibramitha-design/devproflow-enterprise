/**
 * React Native Paper MD3 Theme — 01_Mobile_APK_Android
 *
 * ⭐ Single Source of Truth: 05_UI_Design_System/Shared/Design_Tokens.json
 * Maps Design Tokens → Paper MD3 color scheme so Mobile primary (#3B82F6)
 * is identical to 02_Web_Application.
 *
 * Token chain:
 *   Design_Tokens.json
 *     └── tokens.ts (Colors, Typography, Spacing)
 *           └── paperTheme.ts (MD3LightTheme / MD3DarkTheme)
 *                 └── ThemeProvider.tsx (PaperProvider)
 *                       └── All screens / components
 */

import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  type MD3Theme,
} from 'react-native-paper'
import { Colors, Typography, Spacing } from './tokens'

// ── Font configuration from Design_Tokens.json typography.* ──────────────────
const fontConfig = {
  displayLarge:  { fontFamily: 'System', fontSize: Typography.fontSize['5xl'], fontWeight: Typography.fontWeight.bold as '700',     letterSpacing: 0 },
  displayMedium: { fontFamily: 'System', fontSize: Typography.fontSize['4xl'], fontWeight: Typography.fontWeight.bold as '700',     letterSpacing: 0 },
  displaySmall:  { fontFamily: 'System', fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.semibold as '600', letterSpacing: 0 },
  headlineLarge: { fontFamily: 'System', fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.semibold as '600', letterSpacing: 0 },
  headlineMedium:{ fontFamily: 'System', fontSize: Typography.fontSize.xl,     fontWeight: Typography.fontWeight.semibold as '600', letterSpacing: 0 },
  headlineSmall: { fontFamily: 'System', fontSize: Typography.fontSize.lg,     fontWeight: Typography.fontWeight.semibold as '600', letterSpacing: 0 },
  titleLarge:    { fontFamily: 'System', fontSize: Typography.fontSize.lg,     fontWeight: Typography.fontWeight.semibold as '600', letterSpacing: 0 },
  titleMedium:   { fontFamily: 'System', fontSize: Typography.fontSize.base,   fontWeight: Typography.fontWeight.medium as '500',   letterSpacing: 0.15 },
  titleSmall:    { fontFamily: 'System', fontSize: Typography.fontSize.sm,     fontWeight: Typography.fontWeight.medium as '500',   letterSpacing: 0.1 },
  bodyLarge:     { fontFamily: 'System', fontSize: Typography.fontSize.base,   fontWeight: Typography.fontWeight.normal as '400',   letterSpacing: 0.5 },
  bodyMedium:    { fontFamily: 'System', fontSize: Typography.fontSize.sm,     fontWeight: Typography.fontWeight.normal as '400',   letterSpacing: 0.25 },
  bodySmall:     { fontFamily: 'System', fontSize: Typography.fontSize.xs,     fontWeight: Typography.fontWeight.normal as '400',   letterSpacing: 0.4 },
  labelLarge:    { fontFamily: 'System', fontSize: Typography.fontSize.sm,     fontWeight: Typography.fontWeight.medium as '500',   letterSpacing: 0.1 },
  labelMedium:   { fontFamily: 'System', fontSize: Typography.fontSize.xs,     fontWeight: Typography.fontWeight.medium as '500',   letterSpacing: 0.5 },
  labelSmall:    { fontFamily: 'System', fontSize: 10,                         fontWeight: Typography.fontWeight.medium as '500',   letterSpacing: 0.5 },
}

// ── Light Theme ───────────────────────────────────────────────────────────────
// All color values sourced from tokens.ts → Design_Tokens.json colors.light.*
export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4, // 4 × 4 = 16px base = matches radius.base (1rem)
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,

    // ── Core brand colors ── Token: colors.light.primary
    primary:          Colors.light.primary,              // #3B82F6 ← identical to Web --primary
    onPrimary:        Colors.light.primaryForeground,    // #FFFFFF
    primaryContainer: Colors.light.sidebarAccent,        // #EFF6FF (light primary bg)
    onPrimaryContainer: '#1E3A8A',

    // ── Secondary (accent orange) ── Token: colors.light.accent
    secondary:          Colors.light.accent,             // #FB923C
    onSecondary:        '#FFFFFF',
    secondaryContainer: '#FFF7ED',
    onSecondaryContainer: '#7C2D12',

    // ── Tertiary (success green) ── Token: colors.light.success
    tertiary:          Colors.light.success,             // #10B981
    onTertiary:        '#FFFFFF',
    tertiaryContainer: '#D1FAE5',
    onTertiaryContainer: '#065F46',

    // ── Error/Destructive ── Token: colors.light.destructive
    error:          Colors.light.destructive,            // #EF4444
    onError:        '#FFFFFF',
    errorContainer: '#FEF2F2',
    onErrorContainer: '#991B1B',

    // ── Surfaces & Backgrounds ── Token: colors.light.background / card / muted
    background:     Colors.light.background,             // #FAFAF9
    onBackground:   Colors.light.foreground,             // #18181B
    surface:        Colors.light.card,                   // #FFFFFF
    onSurface:      Colors.light.foreground,             // #18181B
    surfaceVariant: Colors.light.muted,                  // #F0F0EE
    onSurfaceVariant: Colors.light.mutedForeground,      // #78716C
    surfaceDisabled: Colors.light.muted,
    onSurfaceDisabled: Colors.light.mutedForeground,

    // ── Outline & Dividers ── Token: colors.light.border
    outline:        Colors.light.border,                 // #E7E5E4
    outlineVariant: Colors.light.input,                  // #E7E5E4

    // ── Inverse (used in snackbar, tooltips) ──
    inverseSurface:   Colors.dark.card,                  // #1E293B
    inverseOnSurface: Colors.dark.foreground,            // #F8FAFC
    inversePrimary:   Colors.dark.primary,               // #60A5FA

    // ── Elevation / Scrim ──
    shadow:           '#000000',
    scrim:            '#000000',
    backdrop:         'rgba(0,0,0,0.5)',

    // ── Elevation surfaces (MD3 tonal elevation) ──
    elevation: {
      level0: 'transparent',
      level1: Colors.light.card,
      level2: Colors.light.muted,
      level3: '#E8E6E4',
      level4: '#E4E2E0',
      level5: '#E0DEDC',
    },
  },
}

// ── Dark Theme ────────────────────────────────────────────────────────────────
// All color values sourced from tokens.ts → Design_Tokens.json colors.dark.*
export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 4,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,

    // ── Core brand colors ── Token: colors.dark.primary
    primary:          Colors.dark.primary,               // #60A5FA ← dark mode blue
    onPrimary:        Colors.dark.primaryForeground,     // #FFFFFF
    primaryContainer: Colors.dark.sidebarAccent,         // #1E3A8A
    onPrimaryContainer: '#DBEAFE',

    // ── Secondary (accent) ── Token: colors.dark.accent
    secondary:          Colors.dark.accent,              // #FDBA74
    onSecondary:        '#431407',
    secondaryContainer: '#7C2D12',
    onSecondaryContainer: '#FED7AA',

    // ── Tertiary (success) ── Token: colors.dark.success
    tertiary:          Colors.dark.success,              // #34D399
    onTertiary:        '#022C22',
    tertiaryContainer: '#065F46',
    onTertiaryContainer: '#A7F3D0',

    // ── Error ── Token: colors.dark.destructive
    error:          Colors.dark.destructive,             // #DC2626
    onError:        '#FFFFFF',
    errorContainer: '#7F1D1D',
    onErrorContainer: '#FCA5A5',

    // ── Surfaces ── Token: colors.dark.background / card / muted
    background:     Colors.dark.background,              // #0F172A
    onBackground:   Colors.dark.foreground,              // #F8FAFC
    surface:        Colors.dark.card,                    // #1E293B
    onSurface:      Colors.dark.foreground,              // #F8FAFC
    surfaceVariant: Colors.dark.muted,                   // #334155
    onSurfaceVariant: Colors.dark.mutedForeground,       // #94A3B8
    surfaceDisabled: Colors.dark.muted,
    onSurfaceDisabled: Colors.dark.mutedForeground,

    // ── Outline ── Token: colors.dark.border
    outline:        Colors.dark.border,                  // #475569
    outlineVariant: Colors.dark.input,                   // #475569

    // ── Inverse ──
    inverseSurface:   Colors.light.card,                 // #FFFFFF
    inverseOnSurface: Colors.light.foreground,           // #18181B
    inversePrimary:   Colors.light.primary,              // #3B82F6

    shadow:    '#000000',
    scrim:     '#000000',
    backdrop:  'rgba(0,0,0,0.7)',

    elevation: {
      level0: 'transparent',
      level1: '#1E293B',
      level2: '#243044',
      level3: '#2A374F',
      level4: '#2C3A53',
      level5: '#303F59',
    },
  },
}

// ── Named spacing helpers from Design_Tokens.json ────────────────────────────
export const PaperSpacing = {
  xs:  Spacing.scale[1],    // 4
  sm:  Spacing.scale[2],    // 8
  md:  Spacing.scale[4],    // 16
  lg:  Spacing.scale[6],    // 24
  xl:  Spacing.scale[8],    // 32
  xxl: Spacing.scale[12],   // 48
  screenPadding:   Spacing.scale[4],  // 16
  cardPadding:     Spacing.scale[4],  // 16
  sectionGap:      Spacing.scale[6],  // 24
  itemGap:         Spacing.scale[3],  // 12
  borderRadius:    Spacing.borderRadius,
}

export default { paperLightTheme, paperDarkTheme, PaperSpacing }
