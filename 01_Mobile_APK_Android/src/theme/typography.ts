/**
 * KPRFlow Enterprise - Design System Typography
 * Extracted from 05_UI_Design_System for React Native
 */

import { TextStyle, Platform } from 'react-native'

export interface TypographyVariant {
  fontSize: number
  fontWeight: string | 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  lineHeight?: number
  letterSpacing?: number
  fontFamily?: string
}

export const DesignSystemTypography = {
  // Font Family
  fontFamily: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
  }),
  
  // Heading Styles
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily: 'Inter',
  } as TextStyle,
  
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    fontFamily: 'Inter',
  } as TextStyle,
  
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter',
  } as TextStyle,
  
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Inter',
  } as TextStyle,
  
  h5: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: 'Inter',
  } as TextStyle,
  
  h6: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Inter',
  } as TextStyle,
  
  // Body Styles
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
  } as TextStyle,
  
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: 'Inter',
  } as TextStyle,
  
  body3: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Inter',
  } as TextStyle,
  
  // Caption Styles
  caption1: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    fontFamily: 'Inter',
  } as TextStyle,
  
  caption2: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    fontFamily: 'Inter',
  } as TextStyle,
  
  caption3: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
    fontFamily: 'Inter',
  } as TextStyle,
  
  // Button Styles
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  } as TextStyle,
  
  buttonLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  } as TextStyle,
  
  buttonSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  } as TextStyle,
  
  // Label Styles
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  } as TextStyle,
  
  // Input Styles
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
  } as TextStyle,
  
  // Code Styles
  code: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Monaco, Consolas, monospace',
  } as TextStyle,
  
  // Utility Styles
  overline: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    fontFamily: 'Inter',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as any,
  } as TextStyle,
  
  // Mobile Optimized Styles
  mobileH1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    fontFamily: 'Inter',
  } as TextStyle,
  
  mobileH2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter',
  } as TextStyle,
  
  mobileBody: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
  } as TextStyle,
  
  // New Architecture Optimized Styles
  fabricOptimized: {
    // Optimized for Fabric rendering
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Inter',
    // Performance optimizations
    includeFontPadding: false,
    textAlignVertical: 'center' as any,
  } as TextStyle,
}

// Typography utility functions
export const getTypographyStyle = (variant: keyof typeof DesignSystemTypography): TextStyle => {
  return DesignSystemTypography[variant] as TextStyle
}

export const getResponsiveTypography = (
  mobileVariant: keyof typeof DesignSystemTypography,
  tabletVariant: keyof typeof DesignSystemTypography
) => {
  return Platform.select({
    ios: DesignSystemTypography[mobileVariant] as TextStyle,
    android: DesignSystemTypography[mobileVariant] as TextStyle,
    default: DesignSystemTypography[tabletVariant] as TextStyle,
  })
}

export const createCustomTypography = (base: TextStyle, overrides: Partial<TextStyle>): TextStyle => {
  return {
    ...base,
    ...overrides,
  }
}

// Typography scale for different screen sizes
export const TypographyScale = {
  xs: {
    h1: { fontSize: 24 },
    h2: { fontSize: 20 },
    body1: { fontSize: 14 },
  },
  sm: {
    h1: { fontSize: 28 },
    h2: { fontSize: 22 },
    body1: { fontSize: 15 },
  },
  md: {
    h1: { fontSize: 32 },
    h2: { fontSize: 24 },
    body1: { fontSize: 16 },
  },
  lg: {
    h1: { fontSize: 36 },
    h2: { fontSize: 28 },
    body1: { fontSize: 17 },
  },
  xl: {
    h1: { fontSize: 40 },
    h2: { fontSize: 32 },
    body1: { fontSize: 18 },
  },
}

export default DesignSystemTypography
