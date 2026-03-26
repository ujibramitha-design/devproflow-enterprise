# Mobile Implementation Guide - React Native Paper

**Platform:** 01_Mobile_APK_Android (Platform A)  
**Strategy:** Reference Design + Native Implementation  
**UI Library:** React Native Paper (Recommended)

---

## Overview

Mobile platform menggunakan **05_UI_Design_System sebagai reference design**, tetapi diimplementasikan dengan **React Native Paper** untuk native performance dan UX.

**❌ TIDAK:** Copy langsung komponen web  
**✅ YA:** Gunakan sebagai visual reference, implement dengan React Native Paper

---

## Why React Native Paper?

**Advantages:**
- ✅ Material Design 3 compliant
- ✅ 50+ pre-built components
- ✅ Built-in theming system
- ✅ Excellent TypeScript support
- ✅ Active maintenance & community
- ✅ Accessible by default
- ✅ Customizable with Design_Tokens.json

**Installation:**
```bash
npm install react-native-paper
npm install react-native-vector-icons
```

---

## Component Adaptation Strategy

### Step 1: Review Web Component

**Look at:** `05_UI_Design_System/Implementation/Web/components/ui/button.tsx`

```typescript
// Web component (reference only)
export const Button = ({ variant, children, ...props }) => {
  return (
    <button className={cn(
      "bg-primary text-primary-foreground",
      variant === "destructive" && "bg-destructive"
    )}>
      {children}
    </button>
  );
};
```

### Step 2: Implement with React Native Paper

**Create:** `01_Mobile_APK_Android/src/components/Button.tsx`

```typescript
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { Colors } from '../theme/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  children: React.ReactNode;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onPress,
  ...props 
}) => {
  const getButtonColor = () => {
    switch (variant) {
      case 'primary': return Colors.light.primary;
      case 'secondary': return Colors.light.secondary;
      case 'destructive': return Colors.light.destructive;
      default: return Colors.light.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return Colors.light.primaryForeground;
      case 'secondary': return Colors.light.secondaryForeground;
      case 'destructive': return Colors.light.destructiveForeground;
      default: return Colors.light.primaryForeground;
    }
  };

  return (
    <PaperButton
      mode="contained"
      buttonColor={getButtonColor()}
      textColor={getTextColor()}
      onPress={onPress}
      {...props}
    >
      {children}
    </PaperButton>
  );
};
```

### Step 3: Use Design Tokens

**✅ ALWAYS use tokens from Design_Tokens.json:**

```typescript
import { Colors, Typography, Spacing } from '../theme/tokens';

// ✅ CORRECT
backgroundColor: Colors.light.primary
fontSize: Typography.fontSize.base
padding: Spacing.scale[4]

// ❌ WRONG
backgroundColor: '#3B82F6'
fontSize: 16
padding: 16
```

---

## Component Mapping

### Direct Equivalents (Low Effort)

| Web Component (05) | React Native Paper | Example |
|-------------------|-------------------|---------|
| **Button** | `<Button>` | `<Button mode="contained">Click</Button>` |
| **Card** | `<Card>` | `<Card><Card.Content>...</Card.Content></Card>` |
| **Input** | `<TextInput>` | `<TextInput label="Name" value={text} />` |
| **Checkbox** | `<Checkbox>` | `<Checkbox status={checked ? 'checked' : 'unchecked'} />` |
| **Switch** | `<Switch>` | `<Switch value={enabled} onValueChange={setEnabled} />` |
| **Badge** | `<Badge>` | `<Badge>3</Badge>` |
| **Chip** | `<Chip>` | `<Chip>Tag</Chip>` |
| **Divider** | `<Divider>` | `<Divider />` |
| **Progress** | `<ProgressBar>` | `<ProgressBar progress={0.5} />` |

### Medium Adaptation (Medium Effort)

| Web Component (05) | React Native Paper | Notes |
|-------------------|-------------------|-------|
| **Dialog** | `<Dialog>` + `<Portal>` | Different API, use Portal for overlay |
| **Dropdown Menu** | `<Menu>` | Different interaction pattern |
| **Tooltip** | `<Tooltip>` (RN Paper 5.x) | No hover, use long press |
| **Alert** | `<Snackbar>` or `<Banner>` | Different positioning |
| **Tabs** | Custom with `<SegmentedButtons>` | Different visual style |

### High Adaptation (High Effort)

| Web Component (05) | React Native Solution | Library |
|-------------------|----------------------|---------|
| **Sidebar** | `<Drawer>` | `@react-navigation/drawer` |
| **Table** | `<DataTable>` or `<FlatList>` | React Native Paper / Core |
| **Calendar** | `<Calendar>` | `react-native-calendars` |
| **Chart** | Chart components | `react-native-chart-kit` |
| **Carousel** | `<Carousel>` | `react-native-reanimated-carousel` |

---

## Complete Component Examples

### Button Component

```typescript
// src/components/Button.tsx
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { Colors, Spacing } from '../theme/tokens';

export const Button = ({ variant = 'primary', children, ...props }) => {
  const variants = {
    primary: {
      buttonColor: Colors.light.primary,
      textColor: Colors.light.primaryForeground,
    },
    secondary: {
      buttonColor: Colors.light.secondary,
      textColor: Colors.light.secondaryForeground,
    },
    destructive: {
      buttonColor: Colors.light.destructive,
      textColor: Colors.light.destructiveForeground,
    },
  };

  return (
    <PaperButton
      mode="contained"
      style={{ borderRadius: Spacing.borderRadius.md }}
      {...variants[variant]}
      {...props}
    >
      {children}
    </PaperButton>
  );
};
```

### Card Component

```typescript
// src/components/Card.tsx
import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { Colors, Spacing, Shadows } from '../theme/tokens';

export const Card = ({ children, ...props }) => {
  return (
    <PaperCard
      style={{
        backgroundColor: Colors.light.card,
        borderRadius: Spacing.borderRadius.lg,
        ...Shadows.md,
      }}
      {...props}
    >
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};
```

### Input Component

```typescript
// src/components/Input.tsx
import React from 'react';
import { TextInput } from 'react-native-paper';
import { Colors, Typography, Spacing } from '../theme/tokens';

export const Input = ({ label, value, onChangeText, ...props }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      style={{
        backgroundColor: Colors.light.background,
        fontFamily: Typography.fontFamily.sans,
        fontSize: Typography.fontSize.base,
      }}
      outlineColor={Colors.light.border}
      activeOutlineColor={Colors.light.primary}
      {...props}
    />
  );
};
```

---

## Navigation Setup

### Install React Navigation

```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context
```

### Drawer Navigation (Replaces Sidebar)

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PaperProvider } from 'react-native-paper';
import { Colors } from './src/theme/tokens';

import DashboardScreen from './src/screens/DashboardScreen';
import UnitsScreen from './src/screens/UnitsScreen';
import CustomersScreen from './src/screens/CustomersScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: Colors.light.sidebar,
            },
            drawerActiveTintColor: Colors.light.sidebarPrimary,
            drawerInactiveTintColor: Colors.light.sidebarForeground,
          }}
        >
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Units" component={UnitsScreen} />
          <Drawer.Screen name="Customers" component={CustomersScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
```

---

## Theming with Design Tokens

### Configure React Native Paper Theme

```typescript
// src/theme/paperTheme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors, Typography, Spacing } from './tokens';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    secondary: Colors.light.secondary,
    tertiary: Colors.light.accent,
    error: Colors.light.destructive,
    background: Colors.light.background,
    surface: Colors.light.card,
    onPrimary: Colors.light.primaryForeground,
    onSecondary: Colors.light.secondaryForeground,
    onBackground: Colors.light.foreground,
    onSurface: Colors.light.cardForeground,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: Typography.fontFamily.sans,
      fontWeight: Typography.fontWeight.normal,
    },
    medium: {
      fontFamily: Typography.fontFamily.sans,
      fontWeight: Typography.fontWeight.medium,
    },
    bold: {
      fontFamily: Typography.fontFamily.sans,
      fontWeight: Typography.fontWeight.bold,
    },
  },
  roundness: Spacing.borderRadius.md,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    secondary: Colors.dark.secondary,
    tertiary: Colors.dark.accent,
    error: Colors.dark.destructive,
    background: Colors.dark.background,
    surface: Colors.dark.card,
    onPrimary: Colors.dark.primaryForeground,
    onSecondary: Colors.dark.secondaryForeground,
    onBackground: Colors.dark.foreground,
    onSurface: Colors.dark.cardForeground,
  },
};
```

### Use Theme in App

```typescript
// App.tsx
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/theme/paperTheme';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      {/* Your app */}
    </PaperProvider>
  );
}
```

---

## Best Practices

### DO ✅

1. **Use React Native Paper components**
   ```typescript
   import { Button, Card, TextInput } from 'react-native-paper';
   ```

2. **Import Design Tokens**
   ```typescript
   import { Colors, Typography, Spacing } from './theme/tokens';
   ```

3. **Reference Web design for visual consistency**
   - Look at 05_UI_Design_System for layout patterns
   - Match colors, spacing, typography
   - Adapt interactions for touch

4. **Use FlatList for long lists**
   ```typescript
   <FlatList
     data={items}
     renderItem={({ item }) => <ItemCard item={item} />}
     keyExtractor={item => item.id}
   />
   ```

5. **Optimize images**
   ```typescript
   <Image source={{ uri: url }} resizeMode="cover" />
   ```

### DON'T ❌

1. **Don't copy web components directly**
   ```typescript
   // ❌ WRONG - Web component won't work
   import { Button } from '05_UI_Design_System/components/ui/button';
   ```

2. **Don't hard-code design values**
   ```typescript
   // ❌ WRONG
   backgroundColor: '#3B82F6'
   
   // ✅ CORRECT
   backgroundColor: Colors.light.primary
   ```

3. **Don't use web-specific libraries**
   ```typescript
   // ❌ WRONG - Recharts is for web
   import { LineChart } from 'recharts';
   
   // ✅ CORRECT - Use React Native chart library
   import { LineChart } from 'react-native-chart-kit';
   ```

4. **Don't ignore platform-specific UX**
   - Use native navigation patterns
   - Respect touch target sizes (44px minimum)
   - Use platform-specific gestures

---

## Testing

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test
```

---

## Summary

**Strategy:**
```
05_UI_Design_System (Web)
    ↓ VISUAL REFERENCE
React Native Paper
    ↓ NATIVE IMPLEMENTATION
01_Mobile_APK_Android
```

**Key Points:**
- ✅ Use 05 as visual reference
- ✅ Implement with React Native Paper
- ✅ Use Design_Tokens.json for consistency
- ✅ Adapt for touch interactions
- ❌ Don't copy web components directly

**Result:** Native mobile app with consistent design across all platforms!
