/**
 * Tailwind Config - Token-Based (Web Platform)
 * 
 * This configuration imports design tokens from Design_Tokens.json
 * NO HARD-CODED VALUES - All colors, spacing, typography from tokens
 */

import type { Config } from 'tailwindcss';
import tokens from '../../Shared/Design_Tokens.json';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ===== COLORS FROM DESIGN_TOKENS.JSON =====
      colors: {
        // Light theme colors
        background: tokens.colors.light.background.value,
        foreground: tokens.colors.light.foreground.value,
        primary: {
          DEFAULT: tokens.colors.light.primary.value,
          foreground: tokens.colors.light.primaryForeground.value,
        },
        secondary: {
          DEFAULT: tokens.colors.light.secondary.value,
          foreground: tokens.colors.light.secondaryForeground.value,
        },
        accent: {
          DEFAULT: tokens.colors.light.accent.value,
          foreground: tokens.colors.light.accentForeground.value,
        },
        destructive: {
          DEFAULT: tokens.colors.light.destructive.value,
          foreground: tokens.colors.light.destructiveForeground.value,
        },
        success: tokens.colors.light.success.value,
        warning: tokens.colors.light.warning.value,
        info: tokens.colors.light.info.value,
        muted: {
          DEFAULT: tokens.colors.light.muted.value,
          foreground: tokens.colors.light.mutedForeground.value,
        },
        border: tokens.colors.light.border.value,
        input: tokens.colors.light.input.value,
        ring: tokens.colors.light.ring.value,
        card: {
          DEFAULT: tokens.colors.light.card.value,
          foreground: tokens.colors.light.cardForeground.value,
        },
        popover: {
          DEFAULT: tokens.colors.light.popover.value,
          foreground: tokens.colors.light.popoverForeground.value,
        },
        sidebar: {
          DEFAULT: tokens.colors.light.sidebar.value,
          foreground: tokens.colors.light.sidebarForeground.value,
          primary: tokens.colors.light.sidebarPrimary.value,
          'primary-foreground': tokens.colors.light.sidebarPrimaryForeground.value,
          accent: tokens.colors.light.sidebarAccent.value,
          'accent-foreground': tokens.colors.light.sidebarAccentForeground.value,
          border: tokens.colors.light.sidebarBorder.value,
        },
        chart: {
          '1': tokens.colors.light.chart1.value,
          '2': tokens.colors.light.chart2.value,
          '3': tokens.colors.light.chart3.value,
          '4': tokens.colors.light.chart4.value,
          '5': tokens.colors.light.chart5.value,
        },
      },

      // ===== TYPOGRAPHY FROM DESIGN_TOKENS.JSON =====
      fontFamily: {
        sans: tokens.typography.fontFamily.sans.value.split(', '),
        mono: tokens.typography.fontFamily.mono.value.split(', '),
      },
      fontSize: {
        xs: [tokens.typography.fontSize.xs.value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        sm: [tokens.typography.fontSize.sm.value, { lineHeight: tokens.typography.lineHeight.normal.value }],
        base: [tokens.typography.fontSize.base.value, { lineHeight: tokens.typography.lineHeight.normal.value }],
        lg: [tokens.typography.fontSize.lg.value, { lineHeight: tokens.typography.lineHeight.normal.value }],
        xl: [tokens.typography.fontSize.xl.value, { lineHeight: tokens.typography.lineHeight.normal.value }],
        '2xl': [tokens.typography.fontSize['2xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '3xl': [tokens.typography.fontSize['3xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '4xl': [tokens.typography.fontSize['4xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '5xl': [tokens.typography.fontSize['5xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
      },
      fontWeight: {
        normal: tokens.typography.fontWeight.normal.value,
        medium: tokens.typography.fontWeight.medium.value,
        semibold: tokens.typography.fontWeight.semibold.value,
        bold: tokens.typography.fontWeight.bold.value,
        extrabold: tokens.typography.fontWeight.extrabold.value,
      },
      letterSpacing: {
        tighter: tokens.typography.letterSpacing.tighter.value,
        tight: tokens.typography.letterSpacing.tight.value,
        normal: tokens.typography.letterSpacing.normal.value,
        wide: tokens.typography.letterSpacing.wide.value,
        wider: tokens.typography.letterSpacing.wider.value,
        widest: tokens.typography.letterSpacing.widest.value,
      },

      // ===== SPACING FROM DESIGN_TOKENS.JSON =====
      spacing: {
        '0': tokens.spacing.scale['0'].value,
        '1': tokens.spacing.scale['1'].value,
        '2': tokens.spacing.scale['2'].value,
        '3': tokens.spacing.scale['3'].value,
        '4': tokens.spacing.scale['4'].value,
        '5': tokens.spacing.scale['5'].value,
        '6': tokens.spacing.scale['6'].value,
        '8': tokens.spacing.scale['8'].value,
        '10': tokens.spacing.scale['10'].value,
        '12': tokens.spacing.scale['12'].value,
        '16': tokens.spacing.scale['16'].value,
        '20': tokens.spacing.scale['20'].value,
        '24': tokens.spacing.scale['24'].value,
      },
      borderRadius: {
        none: tokens.spacing.borderRadius.none.value,
        sm: tokens.spacing.borderRadius.sm.value,
        md: tokens.spacing.borderRadius.md.value,
        lg: tokens.spacing.borderRadius.lg.value,
        xl: tokens.spacing.borderRadius.xl.value,
        '2xl': tokens.spacing.borderRadius['2xl'].value,
        full: tokens.spacing.borderRadius.full.value,
      },

      // ===== SHADOWS FROM DESIGN_TOKENS.JSON =====
      boxShadow: {
        sm: tokens.shadows.sm.value,
        md: tokens.shadows.md.value,
        lg: tokens.shadows.lg.value,
        xl: tokens.shadows.xl.value,
        '2xl': tokens.shadows['2xl'].value,
        inner: tokens.shadows.inner.value,
        none: tokens.shadows.none.value,
      },

      // ===== ANIMATIONS FROM DESIGN_TOKENS.JSON =====
      transitionDuration: {
        fast: tokens.animations.duration.fast.value,
        normal: tokens.animations.duration.normal.value,
        slow: tokens.animations.duration.slow.value,
        slower: tokens.animations.duration.slower.value,
      },
      transitionTimingFunction: {
        default: tokens.animations.easing.default.value,
        linear: tokens.animations.easing.linear.value,
        in: tokens.animations.easing.easeIn.value,
        out: tokens.animations.easing.easeOut.value,
        'in-out': tokens.animations.easing.easeInOut.value,
      },
      keyframes: {
        float: tokens.animations.keyframes.float,
        glowPulse: tokens.animations.keyframes.glowPulse,
        fadeInUp: tokens.animations.keyframes.fadeInUp,
        slideInRight: tokens.animations.keyframes.slideInRight,
        scaleIn: tokens.animations.keyframes.scaleIn,
        barGrow: tokens.animations.keyframes.barGrow,
        dotPing: tokens.animations.keyframes.dotPing,
        shimmerSlide: tokens.animations.keyframes.shimmerSlide,
        tickIn: tokens.animations.keyframes.tickIn,
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'bar-grow': 'barGrow 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'dot-ping': 'dotPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        shimmer: 'shimmerSlide 2.5s ease-in-out infinite',
        'tick-in': 'tickIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
      },

      // ===== BREAKPOINTS FROM DESIGN_TOKENS.JSON =====
      screens: {
        xs: tokens.breakpoints.xs.value,
        sm: tokens.breakpoints.sm.value,
        md: tokens.breakpoints.md.value,
        lg: tokens.breakpoints.lg.value,
        xl: tokens.breakpoints.xl.value,
        '2xl': tokens.breakpoints['2xl'].value,
      },
    },
  },
  plugins: [],
};

export default config;
