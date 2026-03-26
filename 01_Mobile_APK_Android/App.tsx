/**
 * DevPro Flow Enterprise — Main App Entry
 *
 * Token chain:
 *   Design_Tokens.json → tokens.ts → paperTheme.ts
 *     → DevProThemeProvider (PaperProvider)
 *       → DashboardScreen (all colors/fonts from tokens)
 *
 * primary color (#3B82F6 light / #60A5FA dark) = identical to 02_Web_Application
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DevProThemeProvider } from './src/providers/ThemeProvider'
import DashboardScreen from './src/screens/DashboardScreen'

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DevProThemeProvider>
          <View style={styles.root}>
            <DashboardScreen />
          </View>
        </DevProThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})

export default App
