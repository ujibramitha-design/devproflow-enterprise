/**
 * Design Tokens - Mobile Platform (React Native)
 * 
 * This file imports design tokens from 05_UI_Design_System/Shared/Design_Tokens.json
 * NO HARD-CODED VALUES - All colors, spacing, typography from tokens
 */

import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';

// ===== COLORS FROM DESIGN_TOKENS.JSON =====
export const Colors = {
  light: {
    background: tokens.colors.light.background.value,
    foreground: tokens.colors.light.foreground.value,
    primary: tokens.colors.light.primary.value,
    primaryForeground: tokens.colors.light.primaryForeground.value,
    secondary: tokens.colors.light.secondary.value,
    secondaryForeground: tokens.colors.light.secondaryForeground.value,
    accent: tokens.colors.light.accent.value,
    accentForeground: tokens.colors.light.accentForeground.value,
    destructive: tokens.colors.light.destructive.value,
    destructiveForeground: tokens.colors.light.destructiveForeground.value,
    success: tokens.colors.light.success.value,
    warning: tokens.colors.light.warning.value,
    info: tokens.colors.light.info.value,
    muted: tokens.colors.light.muted.value,
    mutedForeground: tokens.colors.light.mutedForeground.value,
    border: tokens.colors.light.border.value,
    input: tokens.colors.light.input.value,
    ring: tokens.colors.light.ring.value,
    card: tokens.colors.light.card.value,
    cardForeground: tokens.colors.light.cardForeground.value,
    popover: tokens.colors.light.popover.value,
    popoverForeground: tokens.colors.light.popoverForeground.value,
    sidebar: tokens.colors.light.sidebar.value,
    sidebarForeground: tokens.colors.light.sidebarForeground.value,
    sidebarPrimary: tokens.colors.light.sidebarPrimary.value,
    sidebarPrimaryForeground: tokens.colors.light.sidebarPrimaryForeground.value,
    sidebarAccent: tokens.colors.light.sidebarAccent.value,
    sidebarAccentForeground: tokens.colors.light.sidebarAccentForeground.value,
    sidebarBorder: tokens.colors.light.sidebarBorder.value,
    chart1: tokens.colors.light.chart1.value,
    chart2: tokens.colors.light.chart2.value,
    chart3: tokens.colors.light.chart3.value,
    chart4: tokens.colors.light.chart4.value,
    chart5: tokens.colors.light.chart5.value,
  },
  dark: {
    background: tokens.colors.dark.background.value,
    foreground: tokens.colors.dark.foreground.value,
    primary: tokens.colors.dark.primary.value,
    primaryForeground: tokens.colors.dark.primaryForeground.value,
    secondary: tokens.colors.dark.secondary.value,
    secondaryForeground: tokens.colors.dark.secondaryForeground.value,
    accent: tokens.colors.dark.accent.value,
    accentForeground: tokens.colors.dark.accentForeground.value,
    destructive: tokens.colors.dark.destructive.value,
    destructiveForeground: tokens.colors.dark.destructiveForeground.value,
    success: tokens.colors.dark.success.value,
    warning: tokens.colors.dark.warning.value,
    info: tokens.colors.dark.info.value,
    muted: tokens.colors.dark.muted.value,
    mutedForeground: tokens.colors.dark.mutedForeground.value,
    border: tokens.colors.dark.border.value,
    input: tokens.colors.dark.input.value,
    ring: tokens.colors.dark.ring.value,
    card: tokens.colors.dark.card.value,
    cardForeground: tokens.colors.dark.cardForeground.value,
    popover: tokens.colors.dark.popover.value,
    popoverForeground: tokens.colors.dark.popoverForeground.value,
    sidebar: tokens.colors.dark.sidebar.value,
    sidebarForeground: tokens.colors.dark.sidebarForeground.value,
    sidebarPrimary: tokens.colors.dark.sidebarPrimary.value,
    sidebarPrimaryForeground: tokens.colors.dark.sidebarPrimaryForeground.value,
    sidebarAccent: tokens.colors.dark.sidebarAccent.value,
    sidebarAccentForeground: tokens.colors.dark.sidebarAccentForeground.value,
    sidebarBorder: tokens.colors.dark.sidebarBorder.value,
    chart1: tokens.colors.dark.chart1.value,
    chart2: tokens.colors.dark.chart2.value,
    chart3: tokens.colors.dark.chart3.value,
    chart4: tokens.colors.dark.chart4.value,
    chart5: tokens.colors.dark.chart5.value,
  },
};

// ===== TYPOGRAPHY FROM DESIGN_TOKENS.JSON =====
export const Typography = {
  fontFamily: {
    sans: tokens.typography.fontFamily.sans.value,
    mono: tokens.typography.fontFamily.mono.value,
  },
  fontSize: {
    xs: tokens.typography.fontSize.xs.px,
    sm: tokens.typography.fontSize.sm.px,
    base: tokens.typography.fontSize.base.px,
    lg: tokens.typography.fontSize.lg.px,
    xl: tokens.typography.fontSize.xl.px,
    '2xl': tokens.typography.fontSize['2xl'].px,
    '3xl': tokens.typography.fontSize['3xl'].px,
    '4xl': tokens.typography.fontSize['4xl'].px,
    '5xl': tokens.typography.fontSize['5xl'].px,
  },
  fontWeight: {
    normal: tokens.typography.fontWeight.normal.value,
    medium: tokens.typography.fontWeight.medium.value,
    semibold: tokens.typography.fontWeight.semibold.value,
    bold: tokens.typography.fontWeight.bold.value,
    extrabold: tokens.typography.fontWeight.extrabold.value,
  },
  lineHeight: {
    tight: parseFloat(tokens.typography.lineHeight.tight.value),
    normal: parseFloat(tokens.typography.lineHeight.normal.value),
    relaxed: parseFloat(tokens.typography.lineHeight.relaxed.value),
    loose: parseFloat(tokens.typography.lineHeight.loose.value),
  },
  letterSpacing: {
    tighter: parseFloat(tokens.typography.letterSpacing.tighter.value.replace('em', '')),
    tight: parseFloat(tokens.typography.letterSpacing.tight.value.replace('em', '')),
    normal: parseFloat(tokens.typography.letterSpacing.normal.value.replace('em', '')),
    wide: parseFloat(tokens.typography.letterSpacing.wide.value.replace('em', '')),
    wider: parseFloat(tokens.typography.letterSpacing.wider.value.replace('em', '')),
    widest: parseFloat(tokens.typography.letterSpacing.widest.value.replace('em', '')),
  },
};

// ===== SPACING FROM DESIGN_TOKENS.JSON =====
export const Spacing = {
  scale: {
    0: parseInt(tokens.spacing.scale['0'].value),
    1: parseInt(tokens.spacing.scale['1'].value),
    2: parseInt(tokens.spacing.scale['2'].value),
    3: parseInt(tokens.spacing.scale['3'].value),
    4: parseInt(tokens.spacing.scale['4'].value),
    5: parseInt(tokens.spacing.scale['5'].value),
    6: parseInt(tokens.spacing.scale['6'].value),
    8: parseInt(tokens.spacing.scale['8'].value),
    10: parseInt(tokens.spacing.scale['10'].value),
    12: parseInt(tokens.spacing.scale['12'].value),
    16: parseInt(tokens.spacing.scale['16'].value),
    20: parseInt(tokens.spacing.scale['20'].value),
    24: parseInt(tokens.spacing.scale['24'].value),
  },
  borderRadius: {
    none: parseInt(tokens.spacing.borderRadius.none.value),
    sm: parseInt(tokens.spacing.borderRadius.sm.value),
    md: parseInt(tokens.spacing.borderRadius.md.value),
    lg: parseInt(tokens.spacing.borderRadius.lg.value),
    xl: parseInt(tokens.spacing.borderRadius.xl.value),
    '2xl': parseInt(tokens.spacing.borderRadius['2xl'].value),
    full: 9999,
  },
  unit: parseInt(tokens.spacing.unit.value),
};

// ===== ANIMATIONS FROM DESIGN_TOKENS.JSON =====
export const Animations = {
  duration: {
    fast: parseInt(tokens.animations.duration.fast.value),
    normal: parseInt(tokens.animations.duration.normal.value),
    slow: parseInt(tokens.animations.duration.slow.value),
    slower: parseInt(tokens.animations.duration.slower.value),
  },
  easing: {
    default: tokens.animations.easing.default.value,
    linear: tokens.animations.easing.linear.value,
    easeIn: tokens.animations.easing.easeIn.value,
    easeOut: tokens.animations.easing.easeOut.value,
    easeInOut: tokens.animations.easing.easeInOut.value,
  },
};

// ===== SHADOWS (React Native compatible) =====
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 20,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
  },
};

// ===== USAGE EXAMPLES =====

/**
 * Example 1: Using Colors in StyleSheet
 * 
 * import { Colors } from './theme/tokens';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: Colors.light.background,
 *   },
 *   button: {
 *     backgroundColor: Colors.light.primary,
 *     color: Colors.light.primaryForeground,
 *   },
 * });
 */

/**
 * Example 2: Using Typography in Text
 * 
 * import { Typography } from './theme/tokens';
 * 
 * <Text style={{
 *   fontFamily: Typography.fontFamily.sans,
 *   fontSize: Typography.fontSize.base,
 *   fontWeight: Typography.fontWeight.bold,
 * }}>
 *   Hello World
 * </Text>
 */

/**
 * Example 3: Using Spacing
 * 
 * import { Spacing } from './theme/tokens';
 * 
 * const styles = StyleSheet.create({
 *   card: {
 *     padding: Spacing.scale[4],
 *     borderRadius: Spacing.borderRadius.lg,
 *     margin: Spacing.scale[2],
 *   },
 * });
 */

/**
 * Example 4: Using Shadows
 * 
 * import { Shadows } from './theme/tokens';
 * 
 * const styles = StyleSheet.create({
 *   card: {
 *     ...Shadows.md,
 *   },
 * });
 */

export default {
  Colors,
  Typography,
  Spacing,
  Animations,
  Shadows,
};
