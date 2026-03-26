/**
 * DsButton — Mobile Atomic Component (React Native)
 *
 * Token chain: Design_Tokens.json → tokens.ts → useDevProTheme() → this component
 *
 * Interactions (platform-native, consistent with Web):
 *   pressed (iOS)      → opacity 0.8 + scale 0.97  (matches Web active:scale-[0.97])
 *   ripple  (Android)  → android_ripple with primary/40 color
 *   disabled           → opacity 0.5               (matches Web disabled:opacity-50)
 *   loading            → ActivityIndicator replaces content
 *
 * Variants match Web: default, secondary, outline, ghost, destructive, success, warning
 */

import React, { useCallback } from 'react'
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useDevProTheme } from '../../providers/ThemeProvider'

// ── Types ─────────────────────────────────────────────────────────────────────
type ButtonVariant =
  | 'default' | 'secondary' | 'outline' | 'ghost'
  | 'destructive' | 'success' | 'warning' | 'link'

type ButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl'

export interface DsButtonProps extends Omit<PressableProps, 'style'> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  fullWidth?: boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  label:      string
}

// ── Animated Pressable ────────────────────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// ── Component ─────────────────────────────────────────────────────────────────
export function DsButton({
  variant    = 'default',
  size       = 'default',
  loading    = false,
  fullWidth  = false,
  disabled,
  leftIcon,
  rightIcon,
  label,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: DsButtonProps) {
  const { colors, spacing, typography, animations } = useDevProTheme()
  const scale = useSharedValue(1)
  const isDisabled = disabled || loading

  // ── Interaction: scale animation (mirrors Web active:scale-[0.97]) ──────────
  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: animations.duration.fast })
    onPressIn?.({} as any)
  }, [scale, animations.duration.fast, onPressIn])

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: animations.duration.fast })
    onPressOut?.({} as any)
  }, [scale, animations.duration.fast, onPressOut])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isDisabled ? 0.5 : 1,  // matches Web disabled:opacity-50
  }))

  // ── Variant → colors (from Design_Tokens.json) ────────────────────────────
  const variantStyles = {
    default:     { bg: colors.primary,     text: colors.primaryForeground, ripple: colors.primary    + '40', border: 'transparent' },
    secondary:   { bg: colors.secondary,   text: colors.secondaryForeground ?? colors.foreground, ripple: colors.muted, border: 'transparent' },
    outline:     { bg: 'transparent',      text: colors.foreground,         ripple: colors.muted,    border: colors.border },
    ghost:       { bg: 'transparent',      text: colors.foreground,         ripple: colors.muted,    border: 'transparent' },
    destructive: { bg: colors.destructive, text: '#FFFFFF',                 ripple: colors.destructive + '40', border: 'transparent' },
    success:     { bg: colors.success,     text: '#FFFFFF',                 ripple: colors.success   + '40', border: 'transparent' },
    warning:     { bg: colors.warning,     text: '#FFFFFF',                 ripple: colors.warning   + '40', border: 'transparent' },
    link:        { bg: 'transparent',      text: colors.primary,            ripple: colors.muted,    border: 'transparent' },
  }[variant]

  // ── Size → height + padding (from spacing.scale tokens) ──────────────────
  const sizeStyles = {
    xs:      { height: 28,  paddingH: spacing.scale[2],  fontSize: typography.fontSize.xs,   iconSize: 12 },
    sm:      { height: 32,  paddingH: spacing.scale[3],  fontSize: typography.fontSize.xs,   iconSize: 14 },
    default: { height: 36,  paddingH: spacing.scale[4],  fontSize: typography.fontSize.sm,   iconSize: 16 },
    lg:      { height: 40,  paddingH: spacing.scale[5],  fontSize: typography.fontSize.sm,   iconSize: 16 },
    xl:      { height: 48,  paddingH: spacing.scale[6],  fontSize: typography.fontSize.base, iconSize: 20 },
  }[size]

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={isDisabled ? undefined : onPress}
      android_ripple={{
        color: variantStyles.ripple,
        borderless: false,
        radius: spacing.borderRadius.lg,
      }}
      style={[
        animatedStyle,
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: spacing.borderRadius.lg,  // 1rem = 16px from radius.base
          overflow: 'hidden',
        },
      ]}
      {...props}
    >
      <View
        style={[
          s.inner,
          {
            height: sizeStyles.height,
            paddingHorizontal: sizeStyles.paddingH,
            backgroundColor: variantStyles.bg,
            borderRadius: spacing.borderRadius.lg,
            borderWidth: variantStyles.border !== 'transparent' ? 1 : 0,
            borderColor: variantStyles.border,
          },
        ]}
      >
        {/* Loading indicator (matches Web spinner behavior) */}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.text}
          />
        ) : (
          <>
            {leftIcon && <View style={s.iconWrap}>{leftIcon}</View>}

            {variant !== 'link' ? (
              <Text
                numberOfLines={1}
                style={[
                  s.label,
                  {
                    color: variantStyles.text,
                    fontSize: sizeStyles.fontSize,
                    fontWeight: typography.fontWeight.medium as '500',
                    textDecorationLine: variant === 'link' ? 'underline' : 'none',
                  },
                ]}
              >
                {label}
              </Text>
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  s.label,
                  {
                    color: variantStyles.text,
                    fontSize: sizeStyles.fontSize,
                    fontWeight: typography.fontWeight.medium as '500',
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                {label}
              </Text>
            )}

            {rightIcon && <View style={s.iconWrap}>{rightIcon}</View>}
          </>
        )}
      </View>
    </AnimatedPressable>
  )
}

const s = StyleSheet.create({
  inner:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label:   { letterSpacing: 0.1 },
  iconWrap:{ alignItems: 'center', justifyContent: 'center' },
})

export default DsButton
