/**
 * Tailwind CSS Configuration - 02_Web_Application
 * Token-Based: All design values imported from Design_Tokens.json
 * NO HARD-CODED colors, spacing, or fonts outside of tokens
 */

// ⭐ Single Source of Truth
const tokens = require('../../05_UI_Design_System/Shared/Design_Tokens.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    // Include 05_UI_Design_System components for class scanning
    '../../05_UI_Design_System/Implementation/Web/components/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ── Standard shadcn/ui CSS-variable references (keep for component compat) ──
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ── DevPro token colors (from Design_Tokens.json) ──
        'devpro-primary':           tokens.colors.light.primary.value,
        'devpro-primary-fg':        tokens.colors.light.primaryForeground.value,
        'devpro-secondary':         tokens.colors.light.secondary.value,
        'devpro-secondary-fg':      tokens.colors.light.secondaryForeground.value,
        'devpro-accent':            tokens.colors.light.accent.value,
        'devpro-accent-fg':         tokens.colors.light.accentForeground.value,
        'devpro-background':        tokens.colors.light.background.value,
        'devpro-foreground':        tokens.colors.light.foreground.value,
        'devpro-muted':             tokens.colors.light.muted.value,
        'devpro-muted-fg':          tokens.colors.light.mutedForeground.value,
        'devpro-border':            tokens.colors.light.border.value,
        'devpro-input':             tokens.colors.light.input.value,
        'devpro-ring':              tokens.colors.light.ring.value,
        'devpro-card':              tokens.colors.light.card.value,
        'devpro-card-fg':           tokens.colors.light.cardForeground.value,
        'devpro-popover':           tokens.colors.light.popover.value,
        'devpro-popover-fg':        tokens.colors.light.popoverForeground.value,
        'devpro-success':           tokens.colors.light.success.value,
        'devpro-warning':           tokens.colors.light.warning.value,
        'devpro-destructive':       tokens.colors.light.destructive.value,
        'devpro-info':              tokens.colors.light.info.value,

        // ── DevPro dark mode token colors ──
        'devpro-dark-primary':      tokens.colors.dark.primary.value,
        'devpro-dark-background':   tokens.colors.dark.background.value,
        'devpro-dark-foreground':   tokens.colors.dark.foreground.value,
        'devpro-dark-card':         tokens.colors.dark.card.value,
        'devpro-dark-border':       tokens.colors.dark.border.value,
        'devpro-dark-muted':        tokens.colors.dark.muted.value,
        'devpro-dark-muted-fg':     tokens.colors.dark.mutedForeground.value,

        // ── Chart colors from tokens ──
        'chart-1': tokens.colors.light.chart1.value,
        'chart-2': tokens.colors.light.chart2.value,
        'chart-3': tokens.colors.light.chart3.value,
        'chart-4': tokens.colors.light.chart4.value,
        'chart-5': tokens.colors.light.chart5.value,

        // ── Sidebar colors from tokens ──
        sidebar: {
          DEFAULT:            tokens.colors.light.sidebar.value,
          foreground:         tokens.colors.light.sidebarForeground.value,
          primary:            tokens.colors.light.sidebarPrimary.value,
          'primary-foreground': tokens.colors.light.sidebarPrimaryForeground.value,
          accent:             tokens.colors.light.sidebarAccent.value,
          'accent-foreground': tokens.colors.light.sidebarAccentForeground.value,
          border:             tokens.colors.light.sidebarBorder.value,
          ring:               tokens.colors.light.sidebarBorder.value,
        },
      },

      // ── Typography from tokens ──
      fontFamily: {
        sans:    tokens.typography.fontFamily.sans.value.split(', '),
        mono:    tokens.typography.fontFamily.mono.value.split(', '),
        kprflow: tokens.typography.fontFamily.sans.value.split(', '),
        devpro:  tokens.typography.fontFamily.sans.value.split(', '),
      },
      fontSize: {
        xs:   [tokens.typography.fontSize.xs.value,   { lineHeight: tokens.typography.lineHeight.normal.value }],
        sm:   [tokens.typography.fontSize.sm.value,   { lineHeight: tokens.typography.lineHeight.normal.value }],
        base: [tokens.typography.fontSize.base.value, { lineHeight: tokens.typography.lineHeight.normal.value }],
        lg:   [tokens.typography.fontSize.lg.value,   { lineHeight: tokens.typography.lineHeight.normal.value }],
        xl:   [tokens.typography.fontSize.xl.value,   { lineHeight: tokens.typography.lineHeight.tight.value }],
        '2xl': [tokens.typography.fontSize['2xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '3xl': [tokens.typography.fontSize['3xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '4xl': [tokens.typography.fontSize['4xl'].value, { lineHeight: tokens.typography.lineHeight.tight.value }],
        '5xl': [tokens.typography.fontSize['5xl'].value, { lineHeight: '1' }],
      },
      fontWeight: {
        normal:    tokens.typography.fontWeight.normal.value,
        medium:    tokens.typography.fontWeight.medium.value,
        semibold:  tokens.typography.fontWeight.semibold.value,
        bold:      tokens.typography.fontWeight.bold.value,
        extrabold: tokens.typography.fontWeight.extrabold.value,
      },

      // ── Border Radius from tokens (uses radius.base = --radius = 1rem) ──
      borderRadius: {
        none:    tokens.spacing.borderRadius.none.value,
        sm:      tokens.radius.sm.value,                // calc(1rem - 4px)
        DEFAULT: tokens.radius.base.value,             // 1rem
        md:      tokens.radius.md.value,               // calc(1rem - 2px)
        lg:      tokens.radius.base.value,             // 1rem  ← matches --radius
        xl:      tokens.radius.xl.value,               // calc(1rem + 4px)
        '2xl':   tokens.spacing.borderRadius['2xl'].value,
        full:    tokens.spacing.borderRadius.full.value,
      },

      // ── Z-Index from tokens ──
      zIndex: {
        base:     tokens.zIndex.base.value,
        raised:   tokens.zIndex.raised.value,
        dropdown: tokens.zIndex.dropdown.value,
        sticky:   tokens.zIndex.sticky.value,
        overlay:  tokens.zIndex.overlay.value,
        modal:    tokens.zIndex.modal.value,
        popover:  tokens.zIndex.popover.value,
        toast:    tokens.zIndex.toast.value,
        tooltip:  tokens.zIndex.tooltip.value,
      },

      // ── Opacity from tokens ──
      opacity: {
        '0':   tokens.opacity['0'].value,
        '5':   tokens.opacity['5'].value,
        '10':  tokens.opacity['10'].value,
        '20':  tokens.opacity['20'].value,
        '30':  tokens.opacity['30'].value,
        '40':  tokens.opacity['40'].value,
        '50':  tokens.opacity['50'].value,
        '60':  tokens.opacity['60'].value,
        '70':  tokens.opacity['70'].value,
        '75':  tokens.opacity['75'].value,
        '80':  tokens.opacity['80'].value,
        '90':  tokens.opacity['90'].value,
        '95':  tokens.opacity['95'].value,
        '100': tokens.opacity['100'].value,
      },

      // ── Shadows from tokens ──
      boxShadow: {
        sm:         tokens.shadows.sm.value,
        DEFAULT:    tokens.shadows.md.value,
        md:         tokens.shadows.md.value,
        lg:         tokens.shadows.lg.value,
        xl:         tokens.shadows.xl.value,
        '2xl':      tokens.shadows['2xl'].value,
        inner:      tokens.shadows.inner.value,
        kprflow:    tokens.shadows.md.value,
        devpro:     tokens.shadows.md.value,
        'kprflow-lg': tokens.shadows.lg.value,
        'devpro-lg':  tokens.shadows.lg.value,
      },

      // ── Gradient backgrounds from tokens ──
      backgroundImage: {
        'devpro-gradient':   `linear-gradient(135deg, ${tokens.colors.light.primary.value} 0%, ${tokens.colors.dark.primary.value} 100%)`,
        'kprflow-gradient':  `linear-gradient(135deg, ${tokens.colors.light.primary.value} 0%, ${tokens.colors.dark.primary.value} 100%)`,
        'success-gradient':  `linear-gradient(135deg, ${tokens.colors.light.success.value} 0%, ${tokens.colors.dark.success.value} 100%)`,
        'warning-gradient':  `linear-gradient(135deg, ${tokens.colors.light.warning.value} 0%, ${tokens.colors.dark.warning.value} 100%)`,
        'error-gradient':    `linear-gradient(135deg, ${tokens.colors.light.destructive.value} 0%, ${tokens.colors.dark.destructive.value} 100%)`,
      },

      // ── Animation durations from tokens ──
      transitionDuration: {
        fast:   tokens.animations.duration.fast.value,
        normal: tokens.animations.duration.normal.value,
        slow:   tokens.animations.duration.slow.value,
        slower: tokens.animations.duration.slower.value,
      },

      // ── Keyframes (existing + token-sourced additions) ──
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "kprflow-slide-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "kprflow-fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "kprflow-scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "kprflow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        "kprflow-bounce": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%":      { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        // Token-sourced keyframes from Master Layout
        "fadeInUp": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slideInRight": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "scaleIn": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down":     "accordion-down 0.2s ease-out",
        "accordion-up":       "accordion-up 0.2s ease-out",
        "kprflow-slide-in":   "kprflow-slide-in 0.3s ease-out",
        "kprflow-fade-in":    "kprflow-fade-in 0.3s ease-out",
        "kprflow-scale-in":   "kprflow-scale-in 0.3s ease-out",
        "kprflow-pulse":      "kprflow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "kprflow-bounce":     "kprflow-bounce 1s infinite",
        "fade-in-up":         `fadeInUp ${tokens.animations.duration.normal.value} ${tokens.animations.easing.default.value} both`,
        "slide-in-right":     `slideInRight ${tokens.animations.duration.normal.value} ${tokens.animations.easing.default.value} both`,
        "scale-in":           `scaleIn ${tokens.animations.duration.normal.value} ${tokens.animations.easing.default.value} both`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
