/**
 * DsModal — Mobile Atomic Component (React Native)
 *
 * Token chain: Design_Tokens.json → tokens.ts → useDevProTheme() → this component
 *
 * Interactions (consistent with Web):
 *   open  → fade-in backdrop + slide-up sheet  (animations.duration.normal)
 *   close → fade-out + slide-down
 *   backdrop tap → close (matches Web overlay click)
 *   close btn → opacity ripple                 (matches Web hover:bg-accent)
 *
 * Sizes: sm, default, lg, full (bottom sheet)
 */

import React, { useEffect, useRef, useCallback } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  type ViewStyle,
  type StyleProp,
} from 'react-native'
import { useDevProTheme } from '../../providers/ThemeProvider'

const SCREEN_HEIGHT = Dimensions.get('window').height

// ── Types ─────────────────────────────────────────────────────────────────────
type ModalSize = 'sm' | 'default' | 'lg' | 'full'

export interface DsModalProps {
  visible:       boolean
  onClose:       () => void
  title?:        string
  description?:  string
  size?:         ModalSize
  showCloseBtn?: boolean
  closeOnBackdrop?: boolean
  children?:     React.ReactNode
  footer?:       React.ReactNode
  scrollable?:   boolean
}

// ── Component ─────────────────────────────────────────────────────────────────
export function DsModal({
  visible,
  onClose,
  title,
  description,
  size             = 'default',
  showCloseBtn     = true,
  closeOnBackdrop  = true,
  children,
  footer,
  scrollable       = false,
}: DsModalProps) {
  const { colors, spacing, typography, animations } = useDevProTheme()

  // ── Animations ─────────────────────────────────────────────────────────────
  // Backdrop fade (matches Web overlay fade-in-0 / fade-out-0)
  const backdropOpacity = useRef(new Animated.Value(0)).current
  // Sheet slide (matches Web slide-in-from-top)
  const sheetTranslateY = useRef(new Animated.Value(80)).current

  useEffect(() => {
    if (visible) {
      // Open: fade in + slide up — animations.duration.normal (200ms)
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: animations.duration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: animations.duration.normal,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Close: fade out + slide down
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: animations.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 80,
          duration: animations.duration.fast,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, animations])

  // ── Sheet max-height from size token ─────────────────────────────────────
  const maxHeight = {
    sm:      SCREEN_HEIGHT * 0.35,
    default: SCREEN_HEIGHT * 0.55,
    lg:      SCREEN_HEIGHT * 0.75,
    full:    SCREEN_HEIGHT * 0.92,
  }[size]

  // ── Border radius (radius.base = 1rem = 16px from tokens) ────────────────
  const borderRadius = spacing.borderRadius.lg  // 16px

  const ContentWrapper = scrollable ? ScrollView : View

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop — bg-black/50 matches Web overlay */}
      <Animated.View
        style={[s.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdrop ? onClose : undefined}
          accessible={false}
        />
      </Animated.View>

      {/* Sheet container */}
      <View style={s.container} pointerEvents="box-none">
        <Animated.View
          style={[
            s.sheet,
            {
              maxHeight,
              backgroundColor: colors.background,  // --background token
              borderTopLeftRadius:  borderRadius,
              borderTopRightRadius: borderRadius,
              borderWidth: 1,
              borderColor: colors.border,           // --border token
              // shadows.lg equivalent on mobile
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 16,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          {/* Drag handle */}
          <View style={[s.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          {(title || showCloseBtn) && (
            <View style={[
              s.header,
              {
                borderBottomColor: colors.border,
                paddingHorizontal: spacing.scale[6],
                paddingVertical: spacing.scale[4],
              },
            ]}>
              <View style={s.headerContent}>
                {title && (
                  <Text style={[s.title, {
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold as '600',
                    color: colors.foreground,
                  }]} numberOfLines={2}>
                    {title}
                  </Text>
                )}
                {description && (
                  <Text style={[s.description, {
                    fontSize: typography.fontSize.sm,
                    color: colors.mutedForeground,
                    marginTop: spacing.scale[1],
                  }]} numberOfLines={2}>
                    {description}
                  </Text>
                )}
              </View>

              {/* Close button — matches Web hover:bg-accent close button */}
              {showCloseBtn && (
                <Pressable
                  onPress={onClose}
                  android_ripple={{ color: colors.accent + '40', borderless: true, radius: 16 }}
                  style={[s.closeBtn, {
                    backgroundColor: colors.muted,
                    borderRadius: spacing.borderRadius.md,
                  }]}
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                >
                  <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 20 }}>✕</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Body */}
          <ContentWrapper
            style={{ flex: scrollable ? 1 : undefined }}
            contentContainerStyle={scrollable ? { padding: spacing.scale[6] } : undefined}
          >
            {!scrollable ? (
              <View style={{ padding: spacing.scale[6] }}>
                {children}
              </View>
            ) : children}
          </ContentWrapper>

          {/* Footer */}
          {footer && (
            <View style={[
              s.footer,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.muted + '80',
                paddingHorizontal: spacing.scale[6],
                paddingVertical: spacing.scale[4],
              },
            ]}>
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  container:    { flex: 1, justifyContent: 'flex-end' },
  sheet:        { width: '100%' },
  handle:       { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header:       { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderBottomWidth: 1 },
  headerContent:{ flex: 1, marginRight: 12 },
  title:        {},
  description:  {},
  closeBtn:     { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  footer:       { borderTopWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
})

export default DsModal
