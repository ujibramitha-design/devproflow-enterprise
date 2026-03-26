/**
 * DsCard — Mobile Atomic Component (React Native)
 *
 * Token chain: Design_Tokens.json → tokens.ts → useDevProTheme() → this component
 *
 * Interactions (consistent with Web):
 *   pressed (Android ripple)  → ripple effect           (matches Web active:scale-[0.99])
 *   pressed (iOS)             → opacity 0.85 + scale 0.99
 *   hoverable                 → N/A (tap is native)
 *   elevation variants        → shadows.sm/md/lg tokens
 */

import React, { useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { Surface } from 'react-native-paper'
import { useDevProTheme } from '../../providers/ThemeProvider'
import { Shadows } from '../../theme/tokens'

// ── Types ─────────────────────────────────────────────────────────────────────
type CardElevation = 'flat' | 'sm' | 'md' | 'lg'
type CardPadding   = 'none' | 'sm' | 'md' | 'lg'

export interface DsCardProps {
  elevation?:  CardElevation
  padding?:    CardPadding
  pressable?:  boolean
  disabled?:   boolean
  bordered?:   boolean
  onPress?:    () => void
  children?:   React.ReactNode
  style?:      StyleProp<ViewStyle>
  header?:     React.ReactNode
  footer?:     React.ReactNode
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// ── Component ─────────────────────────────────────────────────────────────────
export function DsCard({
  elevation  = 'md',
  padding    = 'md',
  pressable  = false,
  disabled   = false,
  bordered   = true,
  onPress,
  children,
  style,
  header,
  footer,
}: DsCardProps) {
  const { colors, spacing, animations } = useDevProTheme()
  const scale = useSharedValue(1)
  const isInteractive = pressable || !!onPress

  // ── Press animation (mirrors Web active:scale-[0.99]) ─────────────────────
  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.99, { duration: animations.duration.fast })
  }, [scale, animations.duration.fast])

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: animations.duration.fast })
  }, [scale, animations.duration.fast])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }))

  // ── Elevation → shadow (from Shadows token) ───────────────────────────────
  const shadowStyle = {
    flat: {},
    sm:   Shadows.sm,
    md:   Shadows.md,
    lg:   Shadows.lg,
  }[elevation]

  // ── Padding (from spacing.scale tokens) ───────────────────────────────────
  const paddingValue = {
    none: 0,
    sm:   spacing.scale[3],   // 12
    md:   spacing.scale[4],   // 16
    lg:   spacing.scale[6],   // 24
  }[padding]

  // ── Border radius = radius.base (1rem = 16px from spacing.borderRadius.lg) ─
  const borderRadius = spacing.borderRadius.lg  // 16px

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius,
    borderWidth: bordered ? 1 : 0,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadowStyle,
  }

  const content = (
    <>
      {/* Header */}
      {header && (
        <View style={[s.header, { borderBottomColor: colors.border, paddingHorizontal: spacing.scale[4] }]}>
          {typeof header === 'string' ? (
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>{header}</Text>
          ) : header}
        </View>
      )}

      {/* Content */}
      <View style={{ padding: paddingValue }}>
        {children}
      </View>

      {/* Footer */}
      {footer && (
        <View style={[s.footer, {
          borderTopColor: colors.border,
          backgroundColor: colors.muted,
          paddingHorizontal: spacing.scale[4],
        }]}>
          {typeof footer === 'string' ? (
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{footer}</Text>
          ) : footer}
        </View>
      )}
    </>
  )

  if (isInteractive && !disabled) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: colors.primary + '20', borderless: false }}
        style={[cardStyle, animatedStyle, style]}
      >
        {content}
      </AnimatedPressable>
    )
  }

  return (
    <Animated.View style={[cardStyle, animatedStyle, style]}>
      {content}
    </Animated.View>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
export function DsCardHeader({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing, typography } = useDevProTheme()
  return (
    <View style={[{
      paddingHorizontal: spacing.scale[4],
      paddingVertical: spacing.scale[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }, style]}>
      {children}
    </View>
  )
}

export function DsCardTitle({ children }: { children: string }) {
  const { colors, typography } = useDevProTheme()
  return (
    <Text style={{
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold as '600',
      color: colors.foreground,
    }}>
      {children}
    </Text>
  )
}

export function DsCardContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { spacing } = useDevProTheme()
  return <View style={[{ padding: spacing.scale[4] }, style]}>{children}</View>
}

export function DsCardFooter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useDevProTheme()
  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.scale[2],
      padding: spacing.scale[3],
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.muted,
    }, style]}>
      {children}
    </View>
  )
}

const s = StyleSheet.create({
  header: { paddingVertical: 12, borderBottomWidth: 1 },
  footer: { paddingVertical: 12, borderTopWidth: 1 },
})

export default DsCard
