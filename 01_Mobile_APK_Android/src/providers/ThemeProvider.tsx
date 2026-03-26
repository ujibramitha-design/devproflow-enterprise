/**
 * DevPro Theme Provider — 01_Mobile_APK_Android
 *
 * Wraps the entire app with:
 *   - React Native Paper's PaperProvider (MD3 theme)
 *   - System dark/light mode detection
 *   - Theme context for deep consumption
 *
 * Token chain:
 *   Design_Tokens.json → tokens.ts → paperTheme.ts → THIS PROVIDER → all screens
 *
 * Usage:
 *   <DevProThemeProvider>
 *     <App />
 *   </DevProThemeProvider>
 *
 *   // In any component:
 *   const { theme, colors, isDark, toggleTheme } = useDevProTheme()
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { paperLightTheme, paperDarkTheme, PaperSpacing } from '../theme/paperTheme'
import { Colors, Typography, Spacing, Animations } from '../theme/tokens'

// ── Theme context shape ───────────────────────────────────────────────────────
interface DevProThemeContextValue {
  isDark:       boolean
  toggleTheme:  () => void
  colors:       typeof Colors.light & { raw: typeof Colors }
  typography:   typeof Typography
  spacing:      typeof Spacing
  animations:   typeof Animations
  paperSpacing: typeof PaperSpacing
}

const DevProThemeContext = createContext<DevProThemeContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────
interface DevProThemeProviderProps {
  children: React.ReactNode
  forceDark?: boolean
}

export function DevProThemeProvider({ children, forceDark }: DevProThemeProviderProps) {
  const systemScheme = useColorScheme()
  const [manualDark, setManualDark] = useState<boolean | null>(null)

  // Manual toggle overrides system preference
  const isDark = manualDark !== null
    ? manualDark
    : (forceDark !== undefined ? forceDark : systemScheme === 'dark')

  const toggleTheme = useCallback(() => {
    setManualDark(prev => prev === null ? !isDark : !prev)
  }, [isDark])

  const activeColors = isDark ? Colors.dark : Colors.light

  const contextValue: DevProThemeContextValue = {
    isDark,
    toggleTheme,
    colors: { ...activeColors, raw: Colors },
    typography: Typography,
    spacing: Spacing,
    animations: Animations,
    paperSpacing: PaperSpacing,
  }

  return (
    <DevProThemeContext.Provider value={contextValue}>
      <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
        {children}
      </PaperProvider>
    </DevProThemeContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useDevProTheme(): DevProThemeContextValue {
  const ctx = useContext(DevProThemeContext)
  if (!ctx) {
    throw new Error('useDevProTheme must be used within DevProThemeProvider')
  }
  return ctx
}

export default DevProThemeProvider
