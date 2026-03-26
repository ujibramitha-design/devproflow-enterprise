# Implementation - Platform Code

**Purpose:** Platform-specific code implementations (Web, Mobile, Desktop)

---

## Folder Structure

```
Implementation/
├── Web/                     ← Next.js 15 + React 19
│   ├── app/                 ← Next.js App Router pages
│   ├── components/          ← React components
│   ├── lib/                 ← Utilities
│   ├── tailwind.config.ts   ← Tailwind config (imports Design_Tokens.json)
│   └── package.json
├── Mobile/                  ← React Native (placeholder)
│   ├── components/
│   ├── screens/
│   ├── theme/
│   └── package.json
└── Desktop/                 ← Electron (placeholder)
    ├── components/
    ├── native/
    └── package.json
```

---

## Protocol Rules

### ✅ ALLOWED in this folder:
- `.tsx`, `.ts`, `.jsx`, `.js` (Code files)
- `.css`, `.scss` (Stylesheets)
- `.json` (Config files)
- `.md` (Documentation)

### ❌ FORBIDDEN in this folder:
- `.fig` (Figma files → move to `../Shared/Figma/`)
- `.svg`, `.png`, `.jpg` (Visual assets → move to `../Shared/Figma/Components/Exports/`)
- `.pdf` (Design docs → move to `../Shared/Figma/Styleguide/`)

### ⚠️ CRITICAL RULE:
**NO hard-coded design values!**
- ❌ `backgroundColor: '#3B82F6'`
- ✅ `backgroundColor: tokens.colors.light.primary.value`

---

## Platform Status

| Platform | Framework | Status | Components |
|----------|-----------|--------|------------|
| **Web** | Next.js 15 + React 19 | ✅ Active | 27 files migrated |
| **Mobile** | React Native | 🔄 Planned | 0 files |
| **Desktop** | Electron | 🔄 Planned | 0 files |

---

## Token Usage Examples

### Web (Tailwind CSS)

```typescript
// Web/tailwind.config.ts
import tokens from '../../Shared/Design_Tokens.json';

export default {
  theme: {
    colors: {
      primary: tokens.colors.light.primary.value,
      background: tokens.colors.light.background.value,
    },
    spacing: {
      4: tokens.spacing.scale['4'].value,
    },
    borderRadius: {
      lg: tokens.spacing.borderRadius.lg.value,
    }
  }
};
```

### Mobile (React Native)

```typescript
// Mobile/theme/colors.ts
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';

export const Colors = {
  light: {
    primary: tokens.colors.light.primary.value,
    background: tokens.colors.light.background.value,
  },
  dark: {
    primary: tokens.colors.dark.primary.value,
    background: tokens.colors.dark.background.value,
  }
};

// Usage in component
import { Colors } from './theme/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
  }
});
```

### Desktop (Electron)

```typescript
// Desktop inherits from Web
import webTheme from '../../Web/tailwind.config';
export default webTheme;
```

---

## Development Workflow

### 1. Check Design Tokens
```bash
# View available tokens
cat ../Shared/Design_Tokens.json
```

### 2. Create Component
```bash
# Web example
touch Web/components/ui/new-component.tsx

# Import tokens (NO hard-coded values!)
import tokens from '../../../Shared/Design_Tokens.json';
```

### 3. Update Mapping
```bash
# Add entry to mapping document
# Link Figma file → Code file
vim ../Documentation/MAPPING_DOCUMENT.md
```

### 4. Test
```bash
cd Web/
npm run dev
```

---

## Validation

### Pre-Commit Checks
```bash
# Check for hard-coded colors
grep -r "#[0-9A-Fa-f]{6}" Web/

# Check for visual assets in wrong location
find . -type f \( -name "*.svg" -o -name "*.png" \)
```

### Expected Output:
- ✅ No hard-coded HEX colors
- ✅ No visual assets in Implementation/
- ✅ All components reference Design_Tokens.json

---

## Next Steps

### Web (Priority 1)
- [ ] Update existing components to import Design_Tokens.json
- [ ] Remove hard-coded color values
- [ ] Test visual consistency

### Mobile (Priority 2)
- [ ] Create theme folder structure
- [ ] Create token import files
- [ ] Implement core components

### Desktop (Priority 3)
- [ ] Setup Electron wrapper
- [ ] Create OS-specific components
- [ ] Test desktop build
