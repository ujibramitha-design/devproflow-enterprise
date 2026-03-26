/**
 * KPRFlow Enterprise - Design System Theme Index
 * Central theme provider for React Native with 05_UI_Design_System consistency
 */

import { useColorScheme } from 'react-native'
import { DesignSystemColors } from './colors'
import { DesignSystemTypography } from './typography'
import { DesignSystemSpacing } from './spacing'

export interface DesignSystemTheme {
  colors: typeof DesignSystemColors
  typography: typeof DesignSystemTypography
  spacing: typeof DesignSystemSpacing
  isDark: boolean
}

export const useDesignSystemTheme = (): DesignSystemTheme => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  
  return {
    colors: {
      ...DesignSystemColors,
      // Dark mode overrides
      ...(isDark && {
        background: DesignSystemColors.dark.background,
        foreground: DesignSystemColors.dark.foreground,
        surface: DesignSystemColors.dark.surface,
        card: DesignSystemColors.dark.card,
        border: DesignSystemColors.dark.border,
        input: DesignSystemColors.dark.input,
        muted: DesignSystemColors.dark.muted,
        accent: DesignSystemColors.dark.accent,
      })
    },
    typography: DesignSystemTypography,
    spacing: DesignSystemSpacing,
    isDark
  }
}

// Theme context provider
export const DesignSystemThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useDesignSystemTheme()
  
  // In a real implementation, this would use React Context
  // For now, we'll export the theme hook
  return children
}

// Theme constants
export const Theme = {
  colors: DesignSystemColors,
  typography: DesignSystemTypography,
  spacing: DesignSystemSpacing,
}

export default Theme
