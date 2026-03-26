/**
 * DsInput — Mobile Atomic Component (React Native)
 *
 * Token chain: Design_Tokens.json → tokens.ts → useDevProTheme() → this component
 *
 * Interactions (consistent with Web):
 *   focus   → border-primary color + subtle bg shift  (matches Web focus:border-primary)
 *   error   → border-destructive                       (matches Web border-destructive)
 *   hover   → N/A on mobile (tap replaces hover)
 *   disabled → opacity-50                              (matches Web disabled:opacity-50)
 *
 * Animated:
 *   border color animates over animations.duration.fast (150ms) on focus/blur
 */

import React, { useRef, useState, useCallback, useId } from 'react'
import {
  View,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { useDevProTheme } from '../../providers/ThemeProvider'

// ── Types ─────────────────────────────────────────────────────────────────────
type InputSize    = 'sm' | 'default' | 'lg'
type InputVariant = 'default' | 'filled' | 'flushed'

export interface DsInputProps extends TextInputProps {
  label?:       string
  helperText?:  string
  errorText?:   string
  leftIcon?:    React.ReactNode
  rightIcon?:   React.ReactNode
  inputSize?:   InputSize
  variant?:     InputVariant
  isRequired?:  boolean
  disabled?:    boolean
  containerStyle?: ViewStyle
}

// ── Component ─────────────────────────────────────────────────────────────────
export function DsInput({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  inputSize  = 'default',
  variant    = 'default',
  isRequired = false,
  disabled,
  editable,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: DsInputProps) {
  const { colors, spacing, typography, animations } = useDevProTheme()
  const [isFocused, setIsFocused] = useState(false)
  const borderAnim = useRef(new Animated.Value(0)).current   // 0 = blur, 1 = focus
  const isDisabled = disabled || editable === false
  const hasError   = !!errorText

  // ── Animate border on focus/blur (duration from animations.duration.fast) ──
  const handleFocus = useCallback((e: any) => {
    setIsFocused(true)
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: animations.duration.fast,
      useNativeDriver: false,
    }).start()
    onFocus?.(e)
  }, [borderAnim, animations.duration.fast, onFocus])

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false)
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: animations.duration.fast,
      useNativeDriver: false,
    }).start()
    onBlur?.(e)
  }, [borderAnim, animations.duration.fast, onBlur])

  // ── Animated border color ──────────────────────────────────────────────────
  // error → destructive, focus → primary, default → border
  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: hasError
      ? [colors.destructive, colors.destructive]     // stays destructive
      : [colors.border, colors.primary],             // border → primary on focus
  })

  // ── Size config (from spacing.scale tokens) ───────────────────────────────
  const sizeConfig = {
    sm:      { height: 32, paddingH: spacing.scale[3], fontSize: typography.fontSize.xs },
    default: { height: 40, paddingH: spacing.scale[3], fontSize: typography.fontSize.sm },
    lg:      { height: 48, paddingH: spacing.scale[4], fontSize: typography.fontSize.sm },
  }[inputSize]

  // ── Background (variant) ──────────────────────────────────────────────────
  const bgColor = variant === 'filled'
    ? colors.muted
    : variant === 'flushed'
      ? 'transparent'
      : colors.background

  // ── Border radius (from spacing.borderRadius / radius.base) ───────────────
  const borderRadius = variant === 'flushed' ? 0 : spacing.borderRadius.lg  // 1rem = 16px

  return (
    <View style={[s.container, containerStyle]}>

      {/* Label */}
      {label && (
        <Text
          style={[
            s.label,
            {
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium as '500',
              color: colors.foreground,
              opacity: isDisabled ? 0.5 : 1,
              marginBottom: spacing.scale[1],
            },
          ]}
        >
          {label}
          {isRequired && (
            <Text style={{ color: colors.destructive }}>{' *'}</Text>
          )}
        </Text>
      )}

      {/* Input row */}
      <Animated.View
        style={[
          s.inputWrap,
          {
            height: sizeConfig.height,
            backgroundColor: bgColor,
            borderRadius,
            borderWidth: variant === 'flushed' ? 0 : 1,
            borderBottomWidth: 1,
            borderColor: animatedBorderColor as any,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}
      >
        {/* Left icon */}
        {leftIcon && (
          <View style={[s.iconLeft, { paddingLeft: spacing.scale[3] }]}>
            {leftIcon}
          </View>
        )}

        {/* TextInput */}
        <TextInput
          style={[
            s.input,
            {
              paddingHorizontal: leftIcon || rightIcon ? spacing.scale[2] : sizeConfig.paddingH,
              paddingLeft: leftIcon ? spacing.scale[2] : sizeConfig.paddingH,
              paddingRight: rightIcon ? spacing.scale[2] : sizeConfig.paddingH,
              fontSize: sizeConfig.fontSize,
              fontWeight: typography.fontWeight.normal as '400',
              color: colors.foreground,
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.mutedForeground}
          editable={!isDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityState={{ disabled: !!isDisabled }}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <View style={[s.iconRight, { paddingRight: spacing.scale[3] }]}>
            {rightIcon}
          </View>
        )}
      </Animated.View>

      {/* Error text — text-destructive */}
      {errorText && (
        <View style={s.errorRow}>
          <Text style={[s.errorText, {
            fontSize: typography.fontSize.xs,
            color: colors.destructive,
            fontWeight: typography.fontWeight.medium as '500',
            marginTop: spacing.scale[1],
          }]}>
            ⚠ {errorText}
          </Text>
        </View>
      )}

      {/* Helper text — text-mutedForeground */}
      {!errorText && helperText && (
        <Text style={[s.helperText, {
          fontSize: typography.fontSize.xs,
          color: colors.mutedForeground,
          marginTop: spacing.scale[1],
        }]}>
          {helperText}
        </Text>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { width: '100%' },
  label:     {},
  inputWrap: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  input:     { flex: 1 },
  iconLeft:  { flexDirection: 'row', alignItems: 'center' },
  iconRight: { flexDirection: 'row', alignItems: 'center' },
  errorRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: {},
  helperText:{},
})

export default DsInput
