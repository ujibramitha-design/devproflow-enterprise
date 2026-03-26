# 05_UI_Design_System

**Version:** 2.0.0 (Protocol-Compliant)  
**Last Updated:** 2026-03-25  
**Status:** Active

---

## Overview

Centralized design system for DevPro Flow Enterprise following strict separation protocol. This folder contains:
- **Design Assets:** Raw Figma files, SVG/PNG exports
- **Design Tokens:** Single source of truth for colors, typography, spacing
- **Implementation Code:** Platform-specific code (Web, Mobile, Desktop)
- **Documentation:** Design-to-code mapping and guidelines

---

## Folder Structure

```
05_UI_Design_System/
├── Shared/                          ← DESIGN ASSETS & TOKENS
│   ├── Figma/                       ← RAW DESIGN ASSETS ONLY
│   │   ├── Components/              ← Figma component files (.fig)
│   │   │   └── Exports/             ← SVG/PNG exports
│   │   ├── Screens/                 ← Full screen designs
│   │   └── Styleguide/              ← Design documentation (PDF)
│   └── Design_Tokens.json           ← SINGLE SOURCE OF TRUTH
│
├── Implementation/                   ← CODE IMPLEMENTATIONS
│   ├── Web/                         ← Next.js 15 + React 19
│   ├── Mobile/                      ← React Native (placeholder)
│   └── Desktop/                     ← Electron (placeholder)
│
├── Documentation/                    ← DESIGN GUIDELINES
│   ├── MAPPING_DOCUMENT.md          ← Figma ↔ Code mapping
│   ├── PROTOCOL.md                  ← Separation protocol rules
│   └── Component_Usage.md           ← Usage guidelines
│
└── README.md                         ← This file
```

---

## Protocol Rules

### 1. Asset Separation
✅ **All visual assets (.fig, .svg, .png, .pdf) MUST be in `Shared/Figma/`**  
❌ **No visual assets in `Implementation/` folders**

### 2. Code Separation
✅ **All code (.tsx, .ts, .js, .css) MUST be in `Implementation/`**  
❌ **No code files in `Shared/Figma/`**

### 3. Single Source of Truth
✅ **All design values MUST come from `Shared/Design_Tokens.json`**  
❌ **No hard-coded colors, spacing, or fonts in code**

### 4. Traceability
✅ **All components MUST be documented in `Documentation/MAPPING_DOCUMENT.md`**

---

## Quick Start

### For Designers

**Export Figma Components:**
```bash
1. Design in Figma
2. Export component to: Shared/Figma/Components/[ComponentName].fig
3. Export SVG/PNG to: Shared/Figma/Components/Exports/
4. Update Design_Tokens.json if colors/spacing changed
5. Notify developer
```

### For Developers

**Implement Component:**
```bash
# 1. Check Design_Tokens.json for values
cat Shared/Design_Tokens.json

# 2. Create component in Implementation/Web/
# Example: Implementation/Web/components/ui/button.tsx

# 3. Import tokens (NO hard-coded values!)
import tokens from '../../../Shared/Design_Tokens.json';

# 4. Update MAPPING_DOCUMENT.md
# Add entry linking Figma file to code file

# 5. Test across platforms
npm run test
```

---

## Design Tokens Usage

### Web (Tailwind CSS)

```typescript
// Implementation/Web/tailwind.config.ts
import tokens from '../../Shared/Design_Tokens.json';

export default {
  theme: {
    colors: {
      primary: tokens.colors.light.primary.value,
      background: tokens.colors.light.background.value,
    },
    spacing: {
      4: tokens.spacing.scale['4'].value,
    }
  }
};
```

### Mobile (React Native)

```typescript
// Implementation/Mobile/theme/colors.ts
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';

export const Colors = {
  primary: tokens.colors.light.primary.value,
  background: tokens.colors.light.background.value,
};

// Usage in component
<View style={{ backgroundColor: Colors.primary }}>
```

### Desktop (Electron)

```typescript
// Desktop reuses Web implementation
import webTheme from '../../Web/tailwind.config';
export default webTheme;
```

---

## Available Tokens

### Colors
- **Light Theme:** 40+ color tokens (primary, secondary, accent, etc.)
- **Dark Theme:** Full dark mode palette
- **Format:** HEX, OKLCH, RGB

### Typography
- **Font Families:** Plus Jakarta Sans (sans), Geist Mono (mono)
- **Font Sizes:** xs (12px) to 5xl (48px)
- **Font Weights:** 400-800

### Spacing
- **Base Unit:** 8px grid system
- **Scale:** 0px to 96px
- **Border Radius:** none to full (9999px)

### Animations
- **Durations:** 150ms (fast) to 800ms (slower)
- **Easings:** cubic-bezier, linear, ease-in/out
- **Keyframes:** fadeInUp, slideInRight, scaleIn, etc.

### Icons
- **Library:** Lucide v0.474.0
- **Sizes:** 12px to 48px
- **Stroke Width:** 1.5 to 2.5

---

## Platform Support

| Platform | Framework | Status | Location |
|----------|-----------|--------|----------|
| **Web** | Next.js 15 + React 19 | ✅ Active | `Implementation/Web/` |
| **Mobile** | React Native | 🔄 Planned | `Implementation/Mobile/` |
| **Desktop** | Electron | 🔄 Planned | `Implementation/Desktop/` |

---

## Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **PROTOCOL.md** | Separation protocol rules | `Documentation/PROTOCOL.md` |
| **MAPPING_DOCUMENT.md** | Figma ↔ Code mapping | `Documentation/MAPPING_DOCUMENT.md` |
| **Design_Tokens.json** | Single source of truth | `Shared/Design_Tokens.json` |

---

## Validation

### Pre-Commit Checks
```bash
# Check for protocol violations
npm run validate-protocol

# Validate Design_Tokens.json
jq empty Shared/Design_Tokens.json

# Check for hard-coded colors
grep -r "#[0-9A-Fa-f]{6}" Implementation/
```

### Code Review Checklist
- [ ] No visual assets in `Implementation/`
- [ ] No code files in `Shared/Figma/`
- [ ] All colors from `Design_Tokens.json`
- [ ] Component documented in `MAPPING_DOCUMENT.md`
- [ ] Visual consistency verified

---

## Migration Status

### Completed
- ✅ Created `Shared/` folder structure
- ✅ Created `Implementation/` folder structure
- ✅ Generated `Design_Tokens.json` from Master Layout UI
- ✅ Moved Web code from `web_ui/` to `Implementation/Web/`
- ✅ Created `MAPPING_DOCUMENT.md`
- ✅ Created `PROTOCOL.md`

### Pending
- 🔄 Update Web code to import `Design_Tokens.json`
- 🔄 Create Mobile implementation
- 🔄 Create Desktop implementation
- 🔄 Populate `Shared/Figma/` with design files
- 🔄 Add pre-commit hooks

---

## Development Workflow

### 1. Design Phase
```
Designer → Figma → Export to Shared/Figma/ → Update Design_Tokens.json
```

### 2. Development Phase
```
Developer → Read Design_Tokens.json → Implement in Implementation/ → Update MAPPING_DOCUMENT.md
```

### 3. Validation Phase
```
QA → Visual regression → Cross-platform check → Approve
```

---

## Tools & Technologies

- **Design:** Figma
- **Web:** Next.js 15, React 19, Tailwind CSS 4, shadcn/ui
- **Mobile:** React Native (planned)
- **Desktop:** Electron (planned)
- **Icons:** Lucide v0.474.0
- **Fonts:** Plus Jakarta Sans, Geist Mono

---

## Contributing

1. Read `Documentation/PROTOCOL.md`
2. Follow separation rules
3. Reference `Design_Tokens.json` for all values
4. Update `MAPPING_DOCUMENT.md`
5. Submit PR with validation checks passing

---

## Support

**Questions?** Contact DevPro Enterprise Team  
**Issues?** Create ticket with label `design-system`  
**Protocol Violations?** See `Documentation/PROTOCOL.md`

---

## Change Log

- **2026-03-25:** Protocol implementation complete
- **2026-03-25:** Migrated Web code to `Implementation/Web/`
- **2026-03-25:** Created `Design_Tokens.json` v1.0.0
- **2026-03-25:** Created documentation (PROTOCOL.md, MAPPING_DOCUMENT.md)

---

## License

Proprietary - DevPro Enterprise Team © 2026
