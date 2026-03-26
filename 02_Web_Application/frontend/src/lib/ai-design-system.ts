// AI-Powered Design System Generator for KPRFlow Enterprise
import { useState, useEffect } from 'react'

// Design System Variations
export interface DesignSystem {
  name: string
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  components: ComponentStyles
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  error: string
  success: string
  warning: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    muted: string
    inverse: string
  }
}

export interface Typography {
  fontFamily: {
    primary: string
    secondary: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

export interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
}

export interface ComponentStyles {
  button: ButtonStyles
  card: CardStyles
  input: InputStyles
  modal: ModalStyles
}

export interface ButtonStyles {
  borderRadius: string
  padding: string
  fontSize: string
  fontWeight: number
  transition: string
}

export interface CardStyles {
  borderRadius: string
  padding: string
  shadow: string
  border: string
}

export interface InputStyles {
  borderRadius: string
  padding: string
  border: string
  focus: string
}

export interface ModalStyles {
  borderRadius: string
  padding: string
  backdrop: string
}

// Pre-defined Design System Variations
export const designSystemVariations: DesignSystem[] = [
  {
    name: 'DevPro-Enterprise (Current)',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Inter", sans-serif',
        secondary: '"Poppins", sans-serif',
        mono: '"JetBrains Mono", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    components: {
      button: {
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.2s ease-in-out'
      },
      card: {
        borderRadius: '0.75rem',
        padding: '1.5rem',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      },
      input: {
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        focus: 'border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)'
      },
      modal: {
        borderRadius: '1rem',
        padding: '2rem',
        backdrop: 'rgba(0, 0, 0, 0.5)'
      }
    }
  },
  {
    name: 'Modern Minimal',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#ea580c',
      background: '#ffffff',
      surface: '#f9fafb',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#9ca3af',
        inverse: '#ffffff'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Inter", sans-serif',
        secondary: '"Space Grotesk", sans-serif',
        mono: '"Fira Code", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    components: {
      button: {
        borderRadius: '0.375rem',
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        transition: 'all 0.15s ease-in-out'
      },
      card: {
        borderRadius: '0.5rem',
        padding: '1.5rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      },
      input: {
        borderRadius: '0.25rem',
        padding: '0.625rem 0.875rem',
        border: '1px solid #e5e7eb',
        focus: 'border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1)'
      },
      modal: {
        borderRadius: '0.75rem',
        padding: '2rem',
        backdrop: 'rgba(0, 0, 0, 0.6)'
      }
    }
  },
  {
    name: 'Dark Professional',
    colors: {
      primary: '#0ea5e9',
      secondary: '#14b8a6',
      accent: '#f97316',
      error: '#f43f5e',
      success: '#22c55e',
      warning: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#64748b',
        inverse: '#0f172a'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Inter", sans-serif',
        secondary: '"Roboto", sans-serif',
        mono: '"Source Code Pro", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    components: {
      button: {
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.2s ease-in-out'
      },
      card: {
        borderRadius: '0.75rem',
        padding: '1.5rem',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      },
      input: {
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
        border: '1px solid #374151',
        focus: 'border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)'
      },
      modal: {
        borderRadius: '1rem',
        padding: '2rem',
        backdrop: 'rgba(0, 0, 0, 0.8)'
      }
    }
  }
]

// AI Design System Generator Hook
export function useAIDesignSystem() {
  const [currentSystem, setCurrentSystem] = useState<DesignSystem>(designSystemVariations[0])
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate new design system based on preferences
  const generateDesignSystem = async (preferences: {
    style: 'modern' | 'classic' | 'minimal' | 'bold'
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'dark'
    target: 'dashboard' | 'mobile' | 'enterprise' | 'startup'
  }) => {
    setIsGenerating(true)
    
    // Simulate AI generation (in real implementation, this would call AI API)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newSystem: DesignSystem = {
      name: `AI Generated - ${preferences.style} ${preferences.colorScheme}`,
      colors: generateColorPalette(preferences.colorScheme),
      typography: generateTypography(preferences.style),
      spacing: designSystemVariations[0].spacing,
      components: generateComponentStyles(preferences.target)
    }
    
    setCurrentSystem(newSystem)
    setIsGenerating(false)
    
    return newSystem
  }

  return {
    currentSystem,
    variations: designSystemVariations,
    generateDesignSystem,
    isGenerating,
    setCurrentSystem
  }
}

// Helper functions for AI generation
function generateColorPalette(scheme: string): ColorPalette {
  const palettes = {
    blue: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#ea580c',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff'
      }
    },
    green: {
      primary: '#16a34a',
      secondary: '#0891b2',
      accent: '#f97316',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#f59e0b',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: {
        primary: '#14532d',
        secondary: '#166534',
        muted: '#64748b',
        inverse: '#ffffff'
      }
    },
    purple: {
      primary: '#9333ea',
      secondary: '#c026d3',
      accent: '#f59e0b',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#f59e0b',
      background: '#ffffff',
      surface: '#faf5ff',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff'
      }
    },
    orange: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#2563eb',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#f59e0b',
      background: '#ffffff',
      surface: '#fff7ed',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff'
      }
    },
    dark: {
      primary: '#0ea5e9',
      secondary: '#14b8a6',
      accent: '#f97316',
      error: '#f43f5e',
      success: '#22c55e',
      warning: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#64748b',
        inverse: '#0f172a'
      }
    }
  }
  
  return palettes[scheme as keyof typeof palettes] || palettes.blue
}

function generateTypography(style: string): Typography {
  const baseTypography = designSystemVariations[0].typography
  
  if (style === 'minimal') {
    return {
      ...baseTypography,
      fontFamily: {
        primary: '"Inter", sans-serif',
        secondary: '"Inter", sans-serif',
        mono: '"JetBrains Mono", monospace'
      }
    }
  }
  
  if (style === 'bold') {
    return {
      ...baseTypography,
      fontWeight: {
        light: 400,
        normal: 500,
        medium: 600,
        semibold: 700,
        bold: 800
      }
    }
  }
  
  return baseTypography
}

function generateComponentStyles(target: string): ComponentStyles {
  const baseComponents = designSystemVariations[0].components
  
  if (target === 'mobile') {
    return {
      ...baseComponents,
      button: {
        ...baseComponents.button,
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '0.75rem'
      },
      card: {
        ...baseComponents.card,
        padding: '1rem',
        borderRadius: '1rem'
      }
    }
  }
  
  if (target === 'enterprise') {
    return {
      ...baseComponents,
      button: {
        ...baseComponents.button,
        padding: '0.5rem 1.25rem',
        fontSize: '0.875rem',
        borderRadius: '0.375rem'
      },
      card: {
        ...baseComponents.card,
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    }
  }
  
  return baseComponents
}

// CSS Variables Generator
export function generateCSSVariables(system: DesignSystem): string {
  const { colors, typography, spacing } = system
  
  return `
:root {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-error: ${colors.error};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-background: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text-primary: ${colors.text.primary};
  --color-text-secondary: ${colors.text.secondary};
  --color-text-muted: ${colors.text.muted};
  --color-text-inverse: ${colors.text.inverse};
  
  /* Typography */
  --font-primary: ${typography.fontFamily.primary};
  --font-secondary: ${typography.fontFamily.secondary};
  --font-mono: ${typography.fontFamily.mono};
  
  /* Spacing */
  --spacing-xs: ${spacing.xs};
  --spacing-sm: ${spacing.sm};
  --spacing-md: ${spacing.md};
  --spacing-lg: ${spacing.lg};
  --spacing-xl: ${spacing.xl};
  --spacing-2xl: ${spacing['2xl']};
  --spacing-3xl: ${spacing['3xl']};
}
  `.trim()
}

// Tailwind Config Generator
export function generateTailwindConfig(system: DesignSystem) {
  return {
    theme: {
      extend: {
        colors: {
          primary: system.colors.primary,
          secondary: system.colors.secondary,
          accent: system.colors.accent,
          error: system.colors.error,
          success: system.colors.success,
          warning: system.colors.warning,
          background: system.colors.background,
          surface: system.colors.surface,
          'text-primary': system.colors.text.primary,
          'text-secondary': system.colors.text.secondary,
          'text-muted': system.colors.text.muted,
          'text-inverse': system.colors.text.inverse
        },
        fontFamily: {
          primary: system.typography.fontFamily.primary.split(','),
          secondary: system.typography.fontFamily.secondary.split(','),
          mono: system.typography.fontFamily.mono.split(',')
        },
        fontSize: system.typography.fontSize,
        fontWeight: system.typography.fontWeight,
        spacing: system.spacing
      }
    }
  }
}
