/**
 * KPRFlow Enterprise - Design System Card
 * Converted from 05_UI_Design_System for React Native with New Architecture
 */

import React from 'react'
import { View, Text, StyleSheet, ViewStyle, ViewProps } from 'react-native'
import { Theme } from '@design-system'

export interface DesignSystemCardProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'elevated'
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export const DesignSystemCard: React.FC<DesignSystemCardProps> = ({
  variant = 'elevated',
  padding = 'md',
  children,
  style,
  ...props
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Theme.spacing.borderRadius.lg,
      overflow: 'hidden',
    }

    // Padding styles
    const paddingStyles: Record<string, ViewStyle> = {
      xs: {
        padding: Theme.spacing.xs,
      },
      sm: {
        padding: Theme.spacing.sm,
      },
      md: {
        padding: Theme.spacing.md,
      },
      lg: {
        padding: Theme.spacing.lg,
      },
      xl: {
        padding: Theme.spacing.xl,
      }
    }

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: Theme.colors.primary,
        borderWidth: 1,
        borderColor: Theme.colors.primary,
      },
      secondary: {
        backgroundColor: Theme.colors.secondary,
        borderWidth: 1,
        borderColor: Theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Theme.colors.border,
      },
      elevated: {
        backgroundColor: Theme.colors.card,
        shadowColor: Theme.colors.gray[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    }

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...variantStyles[variant],
    }
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  )
}

// Card content components
export interface DesignSystemCardHeaderProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const DesignSystemCardHeader: React.FC<DesignSystemCardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <View style={styles.headerText}>
          {title && (
            <Text style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
      )}
    </View>
  )
}

export interface DesignSystemCardContentProps {
  children: React.ReactNode
}

export const DesignSystemCardContent: React.FC<DesignSystemCardContentProps> = ({
  children
}) => {
  return (
    <View style={styles.content}>
      {children}
    </View>
  )
}

export interface DesignSystemCardFooterProps {
  children: React.ReactNode
}

export const DesignSystemCardFooter: React.FC<DesignSystemCardFooterProps> = ({
  children
}) => {
  return (
    <View style={styles.footer}>
      {children}
    </View>
  )
}

// Combined card component
export interface DesignSystemFullCardProps extends DesignSystemCardProps {
  header?: DesignSystemCardHeaderProps
  footer?: DesignSystemCardFooterProps
  content?: DesignSystemCardContentProps
}

export const DesignSystemFullCard: React.FC<DesignSystemFullCardProps> = ({
  header,
  footer,
  content,
  children,
  ...cardProps
}) => {
  return (
    <DesignSystemCard {...cardProps}>
      {header && <DesignSystemCardHeader {...header} />}
      {content ? (
        <DesignSystemCardContent {...content}>
          {content.children}
        </DesignSystemCardContent>
      ) : (
        <DesignSystemCardContent>
          {children}
        </DesignSystemCardContent>
      )}
      {footer && <DesignSystemCardFooter {...footer} />}
    </DesignSystemCard>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Theme.typography.h5,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body2,
    color: Theme.colors.mutedForeground,
  },
  actionContainer: {
    marginLeft: Theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
})

export default DesignSystemCard
