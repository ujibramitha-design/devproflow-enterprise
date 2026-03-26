# Design Token Usage Guide

**Version:** 1.0.0  
**Last Updated:** 2026-03-25  
**Platforms:** Web (B), Mobile (A), Desktop (C)

---

## Overview

This guide explains how to use design tokens from `05_UI_Design_System/Shared/Design_Tokens.json` across all platforms **WITHOUT hard-coding values**.

**Single Source of Truth:**
```
05_UI_Design_System/Shared/Design_Tokens.json
```

---

## Platform A: Mobile (01_Mobile_APK_Android)

### Setup

**Token File:** `01_Mobile_APK_Android/src/theme/tokens.ts`

```typescript
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';
```

### Color Usage

**❌ WRONG - Hard-coded:**
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',  // ❌ Hard-coded HEX
  }
});
```

**✅ CORRECT - Token reference:**
```typescript
import { Colors } from './theme/tokens';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,  // ✅ From Design_Tokens.json
  }
});
```

### Typography Usage

**❌ WRONG - Hard-coded:**
```typescript
<Text style={{
  fontFamily: 'Plus Jakarta Sans',  // ❌ Hard-coded
  fontSize: 16,                      // ❌ Hard-coded
  fontWeight: '700',                 // ❌ Hard-coded
}}>
  Hello World
</Text>
```

**✅ CORRECT - Token reference:**
```typescript
import { Typography } from './theme/tokens';

<Text style={{
  fontFamily: Typography.fontFamily.sans,     // ✅ From tokens
  fontSize: Typography.fontSize.base,         // ✅ From tokens
  fontWeight: Typography.fontWeight.bold,     // ✅ From tokens
}}>
  Hello World
</Text>
```

### Spacing Usage

**❌ WRONG - Hard-coded:**
```typescript
const styles = StyleSheet.create({
  card: {
    padding: 16,        // ❌ Hard-coded
    borderRadius: 12,   // ❌ Hard-coded
    margin: 8,          // ❌ Hard-coded
  }
});
```

**✅ CORRECT - Token reference:**
```typescript
import { Spacing } from './theme/tokens';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.scale[4],           // ✅ 16px from tokens
    borderRadius: Spacing.borderRadius.lg, // ✅ 12px from tokens
    margin: Spacing.scale[2],            // ✅ 8px from tokens
  }
});
```

### Complete Example (Mobile)

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from './theme/tokens';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.body}>This uses design tokens</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Spacing.scale[4],
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.scale[6],
    ...Shadows.md,
  },
  title: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.foreground,
    marginBottom: Spacing.scale[2],
  },
  body: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.light.mutedForeground,
  },
});

export default MyComponent;
```

---

## Platform B: Web (02_Web_Application)

### Setup

**Token File:** `05_UI_Design_System/Implementation/Web/tailwind.config.tokens.ts`

```typescript
import tokens from '../../Shared/Design_Tokens.json';
```

### Tailwind Config

```typescript
import type { Config } from 'tailwindcss';
import tokens from '../../Shared/Design_Tokens.json';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.light.primary.value,
        // ... all colors from tokens
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans.value.split(', '),
      },
      spacing: {
        4: tokens.spacing.scale['4'].value,
      },
    },
  },
};
```

### Usage in Components

**❌ WRONG - Hard-coded:**
```tsx
<button className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg">
  Click Me
</button>
```

**✅ CORRECT - Token reference via Tailwind:**
```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
  Click Me
</button>
```

### Direct Token Import (if needed)

```typescript
import tokens from '../../Shared/Design_Tokens.json';

const customStyle = {
  backgroundColor: tokens.colors.light.primary.value,
  color: tokens.colors.light.primaryForeground.value,
};
```

### Complete Example (Web)

```tsx
import React from 'react';

const MyComponent = () => {
  return (
    <div className="bg-background p-4">
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h1 className="font-sans text-2xl font-bold text-foreground mb-2">
          Welcome
        </h1>
        <p className="font-sans text-base font-normal text-muted-foreground">
          This uses design tokens via Tailwind
        </p>
      </div>
    </div>
  );
};

export default MyComponent;
```

---

## Platform C: Desktop (03_Desktop_Application)

### Setup

**Token File:** `03_Desktop_Application/src/theme/tokens.ts`

Desktop inherits from Web implementation via Electron.

### Renderer Process (Web UI)

```tsx
// Same as Web - use Tailwind classes
<button className="bg-primary text-primary-foreground">
  Click Me
</button>
```

### Main Process (Node.js)

```typescript
import { DesignTokens } from './theme/tokens';
import { BrowserWindow } from 'electron';

const mainWindow = new BrowserWindow({
  backgroundColor: DesignTokens.colors.light.background.value,
  width: 1280,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
  },
});
```

---

## Token Categories

### 1. Colors

**Available Tokens:**
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `accent`, `accentForeground`
- `destructive`, `destructiveForeground`
- `success`, `warning`, `info`
- `muted`, `mutedForeground`
- `background`, `foreground`
- `border`, `input`, `ring`
- `card`, `cardForeground`
- `popover`, `popoverForeground`
- `sidebar` (+ variants)
- `chart1` to `chart5`

**Both Light and Dark themes available.**

### 2. Typography

**Font Families:**
- `sans`: Plus Jakarta Sans, Inter, system-ui
- `mono`: Geist Mono, Monaco, Consolas

**Font Sizes:**
- `xs` (12px), `sm` (14px), `base` (16px)
- `lg` (18px), `xl` (20px), `2xl` (24px)
- `3xl` (30px), `4xl` (36px), `5xl` (48px)

**Font Weights:**
- `normal` (400), `medium` (500), `semibold` (600)
- `bold` (700), `extrabold` (800)

**Line Heights:**
- `tight` (1.25), `normal` (1.5), `relaxed` (1.75), `loose` (2)

**Letter Spacing:**
- `tighter` (-0.05em) to `widest` (0.1em)

### 3. Spacing

**Scale:** 0px to 96px (8px grid system)
- `0`, `1` (4px), `2` (8px), `3` (12px), `4` (16px)
- `5` (20px), `6` (24px), `8` (32px), `10` (40px)
- `12` (48px), `16` (64px), `20` (80px), `24` (96px)

**Border Radius:**
- `none`, `sm` (4px), `md` (8px), `lg` (12px)
- `xl` (16px), `2xl` (20px), `full` (9999px)

### 4. Animations

**Durations:**
- `fast` (150ms), `normal` (300ms), `slow` (500ms), `slower` (800ms)

**Easings:**
- `default`: cubic-bezier(0.22, 1, 0.36, 1)
- `linear`, `easeIn`, `easeOut`, `easeInOut`

**Keyframes:**
- `float`, `glowPulse`, `fadeInUp`, `slideInRight`
- `scaleIn`, `barGrow`, `dotPing`, `shimmerSlide`, `tickIn`

### 5. Shadows

**Levels:** `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `none`

---

## Validation Checklist

### Before Committing Code

- [ ] No hard-coded HEX colors (e.g., `#3B82F6`)
- [ ] No hard-coded spacing values (e.g., `padding: 16`)
- [ ] No hard-coded font families (e.g., `fontFamily: 'Arial'`)
- [ ] All values imported from `Design_Tokens.json`
- [ ] Token imports at top of file
- [ ] No inline styles with hard-coded values

### Automated Check

```bash
# Check for hard-coded colors
grep -r "#[0-9A-Fa-f]{6}" src/

# Expected: No matches (or only in token files)
```

---

## Cross-Platform Consistency

### Color Consistency Example

**Mobile (React Native):**
```typescript
backgroundColor: Colors.light.primary  // "#3B82F6"
```

**Web (Tailwind):**
```tsx
className="bg-primary"  // "#3B82F6"
```

**Desktop (Electron Main):**
```typescript
backgroundColor: DesignTokens.colors.light.primary.value  // "#3B82F6"
```

**All three platforms use the SAME color value from Design_Tokens.json.**

---

## Dark Mode Support

### Mobile

```typescript
import { useColorScheme } from 'react-native';
import { Colors } from './theme/tokens';

const MyComponent = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
    </View>
  );
};
```

### Web

```tsx
// Tailwind automatically handles dark mode with 'dark:' prefix
<div className="bg-background dark:bg-dark-background">
  <p className="text-foreground dark:text-dark-foreground">Hello</p>
</div>
```

### Desktop

```typescript
// Same as Web in Renderer Process
// Main Process can detect system theme
import { nativeTheme } from 'electron';

const isDark = nativeTheme.shouldUseDarkColors;
const colors = isDark ? DesignTokens.colors.dark : DesignTokens.colors.light;
```

---

## Troubleshooting

### Issue: "Cannot find module Design_Tokens.json"

**Solution:** Check relative path from your file to `05_UI_Design_System/Shared/Design_Tokens.json`

**Mobile:**
```typescript
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';
```

**Web:**
```typescript
import tokens from '../../Shared/Design_Tokens.json';
```

### Issue: "Property 'value' does not exist"

**Solution:** Ensure you're accessing the correct nested property

```typescript
// ❌ Wrong
tokens.colors.light.primary

// ✅ Correct
tokens.colors.light.primary.value
```

### Issue: "Colors look different across platforms"

**Solution:** Verify all platforms import from the same `Design_Tokens.json`

```bash
# Check token file is identical
md5sum 05_UI_Design_System/Shared/Design_Tokens.json
```

---

## Best Practices

### 1. Always Import Tokens at Top

```typescript
// ✅ Good
import { Colors, Typography, Spacing } from './theme/tokens';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
  }
});
```

### 2. Create Theme Hooks (Mobile)

```typescript
// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { Colors, Typography, Spacing } from '../theme/tokens';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return {
    colors,
    typography: Typography,
    spacing: Spacing,
  };
};

// Usage
const { colors, typography, spacing } = useTheme();
```

### 3. Use Semantic Names

```typescript
// ✅ Good - semantic
const primaryButton = {
  backgroundColor: Colors.light.primary,
  color: Colors.light.primaryForeground,
};

// ❌ Bad - not semantic
const blueButton = {
  backgroundColor: '#3B82F6',
  color: '#FFFFFF',
};
```

---

## Summary

**Key Rules:**
1. ✅ **ALWAYS** import from `Design_Tokens.json`
2. ❌ **NEVER** hard-code colors, spacing, or fonts
3. ✅ **USE** platform-specific token files (`tokens.ts`)
4. ✅ **VALIDATE** no hard-coded values before commit

**Token Locations:**
- **Source:** `05_UI_Design_System/Shared/Design_Tokens.json`
- **Mobile:** `01_Mobile_APK_Android/src/theme/tokens.ts`
- **Web:** `05_UI_Design_System/Implementation/Web/tailwind.config.tokens.ts`
- **Desktop:** `03_Desktop_Application/src/theme/tokens.ts`

**All platforms reference the SAME Design_Tokens.json = Perfect consistency!**
