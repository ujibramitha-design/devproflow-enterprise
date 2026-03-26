/**
 * KPRFlow Enterprise - Design System Button
 * Converted from 05_UI_Design_System for React Native with New Architecture
 */

import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Theme } from '@design-system'

export interface DesignSystemButtonProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  onPress?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

export const DesignSystemButton: React.FC<DesignSystemButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onPress,
  style,
  textStyle
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Theme.spacing.borderRadius.md,
      flexDirection: 'row',
    }

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xs,
        minHeight: Theme.spacing.touchTarget.min,
      },
      md: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        minHeight: Theme.spacing.touchTarget.comfortable,
      },
      lg: {
        paddingHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.md,
        minHeight: Theme.spacing.touchTarget.large,
      }
    }

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? Theme.colors.gray[300] : Theme.colors.primary,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      secondary: {
        backgroundColor: disabled ? Theme.colors.gray[100] : Theme.colors.secondary,
        shadowColor: Theme.colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? Theme.colors.gray[300] : Theme.colors.primary,
      },
      ghost: {
        backgroundColor: disabled ? 'transparent' : Theme.colors.gray[100],
      },
      destructive: {
        backgroundColor: disabled ? Theme.colors.gray[300] : Theme.colors.destructive,
        shadowColor: Theme.colors.destructive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    }
  }

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: Theme.typography.fontFamily,
      fontWeight: '600',
      textAlign: 'center',
    }

    const sizeTextStyles: Record<string, TextStyle> = {
      sm: {
        fontSize: Theme.typography.caption1.fontSize,
        lineHeight: Theme.typography.caption1.lineHeight,
      },
      md: {
        fontSize: Theme.typography.body3.fontSize,
        lineHeight: Theme.typography.body3.lineHeight,
      },
      lg: {
        fontSize: Theme.typography.body2.fontSize,
        lineHeight: Theme.typography.body2.lineHeight,
      }
    }

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: Theme.colors.primaryForeground,
      },
      secondary: {
        color: Theme.colors.secondaryForeground,
      },
      outline: {
        color: disabled ? Theme.colors.gray[400] : Theme.colors.primary,
      },
      ghost: {
        color: Theme.colors.foreground,
      },
      destructive: {
        color: Theme.colors.destructiveForeground,
      }
    }

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    }
  }

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress()
    }
  }

  return (
    <Pressable
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled}
    >
      {loading ? (
        <Text style={getTextStyle()}>
          Loading...
        </Text>
      ) : (
        <>
          {icon && (
            <View style={{ marginRight: Theme.spacing.xs }}>
              {icon}
            </View>
          )}
          <Text style={[getTextStyle(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  // Additional styles if needed
})

export default DesignSystemButton
