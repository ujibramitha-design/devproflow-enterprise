/**
 * KPRFlow Enterprise - Design System Spacing
 * Extracted from 05_UI_Design_System for React Native
 */

export const DesignSystemSpacing = {
  // Base spacing unit (8px grid system)
  unit: 8,
  
  // Spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Component-specific spacing
  componentPadding: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  // Layout spacing
  layoutSpacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Card spacing
  cardSpacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  // Form spacing
  formSpacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  // Button spacing
  buttonSpacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  // List spacing
  listSpacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  // Grid spacing
  gridSpacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Screen-specific spacing
  screenPadding: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  
  // Section spacing
  sectionSpacing: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // Container spacing
  containerSpacing: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  
  // Navigation spacing
  navigationSpacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  // Header spacing
  headerSpacing: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // Footer spacing
  footerSpacing: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // Modal spacing
  modalSpacing: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // Touch target spacing (44px minimum)
  touchTarget: {
    min: 44,
    comfortable: 48,
    large: 56,
  },
  
  // Icon spacing
  iconSpacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  // Text spacing
  textSpacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    xxl: 16,
    full: 9999,
  },
  
  // Shadow spacing
  shadowSpacing: {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
  },
}

// Spacing utility functions
export const getSpacing = (size: keyof typeof DesignSystemSpacing): number => {
  return DesignSystemSpacing[size] as number
}

export const getResponsiveSpacing = (
  mobileSize: keyof typeof DesignSystemSpacing,
  tabletSize: keyof typeof DesignSystemSpacing
) => {
  // This would be implemented with device detection
  return DesignSystemSpacing[mobileSize] as number
}

export const createCustomSpacing = (base: number, multiplier: number = 1): number => {
  return base * multiplier
}

// Spacing presets for common patterns
export const SpacingPresets = {
  // Card preset
  card: {
    padding: DesignSystemSpacing.md,
    margin: DesignSystemSpacing.sm,
    borderRadius: DesignSystemSpacing.borderRadius.lg,
  },
  
  // Button preset
  button: {
    paddingHorizontal: DesignSystemSpacing.md,
    paddingVertical: DesignSystemSpacing.sm,
    borderRadius: DesignSystemSpacing.borderRadius.md,
  },
  
  // Input preset
  input: {
    paddingHorizontal: DesignSystemSpacing.md,
    paddingVertical: DesignSystemSpacing.sm,
    borderRadius: DesignSystemSpacing.borderRadius.md,
  },
  
  // Modal preset
  modal: {
    padding: DesignSystemSpacing.lg,
    margin: DesignSystemSpacing.md,
    borderRadius: DesignSystemSpacing.borderRadius.xl,
  },
  
  // List item preset
  listItem: {
    padding: DesignSystemSpacing.md,
    marginVertical: DesignSystemSpacing.xs,
    borderRadius: DesignSystemSpacing.borderRadius.md,
  },
  
  // Section preset
  section: {
    padding: DesignSystemSpacing.lg,
    marginBottom: DesignSystemSpacing.lg,
  },
  
  // Container preset
  container: {
    padding: DesignSystemSpacing.md,
    margin: DesignSystemSpacing.sm,
  },
  
  // Header preset
  header: {
    padding: DesignSystemSpacing.lg,
    paddingBottom: DesignSystemSpacing.md,
  },
  
  // Footer preset
  footer: {
    padding: DesignSystemSpacing.lg,
    paddingTop: DesignSystemSpacing.md,
  },
}

export default DesignSystemSpacing
