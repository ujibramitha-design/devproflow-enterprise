# 05_UI_Design_System - Separation Protocol

**Version:** 1.0.0  
**Effective Date:** 2026-03-25  
**Status:** Active

---

## Protocol Overview

This document defines the strict separation protocol for the `05_UI_Design_System` folder to ensure clean organization between design assets and implementation code.

---

## Core Principles

### 1. Asset Separation
**All raw design assets (SVG, PNG, PDF, .fig) MUST be stored in `Shared/Figma/` folder.**

- ✅ Allowed in `Shared/Figma/`: `.fig`, `.svg`, `.png`, `.pdf`, `.jpg`, `.sketch`
- ❌ Forbidden in `Implementation/`: Any visual asset files
- ⚠️ Exception: `node_modules/` library assets are exempt

### 2. Code Separation
**All implementation code (React/HTML/CSS/TypeScript) MUST be stored in `Implementation/` or platform-specific folders.**

- ✅ Allowed in `Implementation/`: `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss`
- ❌ Forbidden in `Shared/Figma/`: Any code files
- ✅ Configuration files: `.json`, `.config.js`, `.config.ts` allowed in `Implementation/`

### 3. Single Source of Truth
**All design tokens MUST be defined in `Shared/Design_Tokens.json`.**

- ✅ Token file: `Shared/Design_Tokens.json`
- ❌ Hard-coded values: No HEX colors, spacing, or font values in code
- ✅ Token reference: All platforms import from `Design_Tokens.json`

### 4. Traceability
**All design-to-code relationships MUST be documented in `Documentation/MAPPING_DOCUMENT.md`.**

- ✅ Mapping required: Every Figma component → Code implementation
- ✅ Status tracking: ✅ Complete, 🔄 In Progress, ❌ Not Started
- ✅ Update frequency: After each design sprint

---

## Folder Structure

```
05_UI_Design_System/
├── Shared/                          ← DESIGN ASSETS & TOKENS
│   ├── Figma/                       ← RAW DESIGN ASSETS ONLY
│   │   ├── Components/              ← Figma component files
│   │   │   ├── Button.fig
│   │   │   ├── Card.fig
│   │   │   └── Exports/             ← SVG/PNG exports
│   │   │       ├── icon-home.svg
│   │   │       └── logo-devpro.png
│   │   ├── Screens/                 ← Full screen designs
│   │   │   ├── Dashboard.fig
│   │   │   └── Login.fig
│   │   └── Styleguide/              ← Design documentation
│   │       ├── Colors.pdf
│   │       └── Typography.pdf
│   └── Design_Tokens.json           ← SINGLE SOURCE OF TRUTH
│
├── Implementation/                   ← CODE IMPLEMENTATIONS
│   ├── Web/                         ← Framework A (Next.js/React)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── tailwind.config.ts       ← Imports Design_Tokens.json
│   │   └── package.json
│   ├── Mobile/                      ← Framework B (React Native)
│   │   ├── components/
│   │   ├── screens/
│   │   ├── theme/
│   │   │   └── colors.ts            ← Imports Design_Tokens.json
│   │   └── package.json
│   └── Desktop/                     ← Framework C (Electron)
│       ├── components/
│       ├── native/
│       └── package.json
│
├── Documentation/                    ← DESIGN GUIDELINES
│   ├── MAPPING_DOCUMENT.md          ← Figma ↔ Code mapping
│   ├── PROTOCOL.md                  ← This file
│   └── Component_Usage.md
│
└── README.md                         ← Overview
```

---

## Protocol Rules

### Rule 1: No Visual Assets in Implementation Folders

**Violation Example:**
```
❌ Implementation/Web/assets/logo.png
❌ Implementation/Mobile/images/icon.svg
```

**Correct Example:**
```
✅ Shared/Figma/Components/Exports/logo.png
✅ Shared/Figma/Components/Exports/icon.svg
```

**Enforcement:**
- Pre-commit hook checks for image files in `Implementation/`
- CI/CD pipeline fails if violations detected

### Rule 2: No Hard-Coded Design Values

**Violation Example:**
```typescript
// ❌ WRONG - Hard-coded values
const buttonStyle = {
  backgroundColor: '#3B82F6',
  borderRadius: '12px',
  fontSize: '16px'
};
```

**Correct Example:**
```typescript
// ✅ CORRECT - Token reference
import tokens from '../../Shared/Design_Tokens.json';

const buttonStyle = {
  backgroundColor: tokens.colors.light.primary.value,
  borderRadius: tokens.spacing.borderRadius.lg.value,
  fontSize: tokens.typography.fontSize.base.value
};
```

**Enforcement:**
- ESLint rule: `no-hardcoded-colors`
- Code review checklist item

### Rule 3: All Platforms Reference Same Tokens

**Web Example:**
```typescript
// Implementation/Web/tailwind.config.ts
import tokens from '../../Shared/Design_Tokens.json';

export default {
  theme: {
    colors: {
      primary: tokens.colors.light.primary.value,
    }
  }
};
```

**Mobile Example:**
```typescript
// Implementation/Mobile/theme/colors.ts
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';

export const Colors = {
  primary: tokens.colors.light.primary.value,
};
```

**Desktop Example:**
```typescript
// Desktop reuses Web implementation
import webTheme from '../../Web/tailwind.config';
export default webTheme;
```

### Rule 4: Mapping Document Must Be Updated

**When to Update:**
- After adding new Figma component
- After implementing new code component
- After changing design tokens
- After design sprint review

**Update Process:**
1. Add component to mapping table
2. Link Figma file to code file
3. Update status (✅/🔄/❌)
4. Document token references
5. Commit with message: `docs: update mapping for [ComponentName]`

---

## Validation Checklist

### Pre-Commit Validation

- [ ] No `.fig`, `.svg`, `.png`, `.pdf` files in `Implementation/`
- [ ] No `.tsx`, `.ts`, `.jsx`, `.js` files in `Shared/Figma/`
- [ ] `Design_Tokens.json` is valid JSON
- [ ] All color values in code reference tokens
- [ ] `MAPPING_DOCUMENT.md` is up-to-date

### Code Review Validation

- [ ] Component imports tokens from `Design_Tokens.json`
- [ ] No hard-coded HEX colors (e.g., `#3B82F6`)
- [ ] No hard-coded spacing values (e.g., `padding: 16px`)
- [ ] No hard-coded font families (e.g., `font-family: 'Arial'`)
- [ ] Component documented in `MAPPING_DOCUMENT.md`

### Design Sprint Validation

- [ ] All new Figma components exported to `Shared/Figma/Components/`
- [ ] All new tokens added to `Design_Tokens.json`
- [ ] All platforms updated to use new tokens
- [ ] Visual regression tests pass
- [ ] Cross-platform consistency verified

---

## Token Update Workflow

### 1. Designer Updates Figma

```
Designer:
1. Update color/spacing/typography in Figma
2. Export updated component to Shared/Figma/Components/
3. Notify developer of token changes
```

### 2. Developer Updates Tokens

```
Developer:
1. Update Shared/Design_Tokens.json with new values
2. Validate JSON schema
3. Run token transformer (if automated)
4. Commit: "feat: update [token-name] token"
```

### 3. Platforms Consume Tokens

```
Automatic (if build system configured):
- Web: Tailwind rebuilds with new tokens
- Mobile: Theme files regenerate
- Desktop: Inherits from Web

Manual (if needed):
- Restart dev servers
- Clear build caches
- Verify visual changes
```

### 4. Validation

```
QA:
1. Visual regression testing
2. Cross-platform consistency check
3. Accessibility audit
4. Performance testing
```

---

## File Naming Conventions

### Figma Files

```
Shared/Figma/Components/
├── Button.fig              ← PascalCase, descriptive
├── Card.fig
├── InputField.fig
└── Exports/
    ├── icon-home.svg       ← kebab-case, prefixed
    ├── icon-user.svg
    └── logo-devpro.png
```

### Code Files

```
Implementation/Web/components/ui/
├── button.tsx              ← kebab-case for files
├── card.tsx
└── input-field.tsx
```

### Token Keys

```json
{
  "colors": {
    "light": {
      "primary": { ... },           // camelCase
      "primaryForeground": { ... }  // camelCase
    }
  }
}
```

---

## Migration Guide

### Migrating Existing Projects

**Step 1: Audit Current Structure**
```bash
# Find all visual assets in wrong locations
find Implementation/ -type f \( -name "*.svg" -o -name "*.png" \)

# Find all hard-coded colors
grep -r "#[0-9A-Fa-f]{6}" Implementation/
```

**Step 2: Move Assets**
```bash
# Move visual assets to Shared/Figma/
mv Implementation/Web/assets/*.svg Shared/Figma/Components/Exports/
mv Implementation/Web/assets/*.png Shared/Figma/Components/Exports/
```

**Step 3: Extract Tokens**
```bash
# Create Design_Tokens.json from existing code
# (Manual process - extract all colors, spacing, fonts)
```

**Step 4: Update Code References**
```typescript
// Before
const color = '#3B82F6';

// After
import tokens from '../../Shared/Design_Tokens.json';
const color = tokens.colors.light.primary.value;
```

**Step 5: Validate**
```bash
# Run validation script
npm run validate-protocol

# Run tests
npm test

# Visual regression
npm run test:visual
```

---

## Enforcement

### Automated Checks

**Pre-commit Hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for visual assets in Implementation/
if find Implementation/ -type f \( -name "*.svg" -o -name "*.png" \) | grep -q .; then
  echo "ERROR: Visual assets found in Implementation/ folder"
  echo "Move them to Shared/Figma/Components/Exports/"
  exit 1
fi

# Validate Design_Tokens.json
if ! jq empty Shared/Design_Tokens.json 2>/dev/null; then
  echo "ERROR: Design_Tokens.json is not valid JSON"
  exit 1
fi

exit 0
```

**CI/CD Pipeline:**
```yaml
# .github/workflows/protocol-validation.yml
name: Protocol Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check asset separation
        run: |
          if find Implementation/ -type f \( -name "*.svg" -o -name "*.png" \); then
            echo "Protocol violation: Visual assets in Implementation/"
            exit 1
          fi
      - name: Validate tokens
        run: jq empty Shared/Design_Tokens.json
```

### Manual Reviews

**Code Review Checklist:**
- [ ] No hard-coded design values
- [ ] Tokens imported from `Design_Tokens.json`
- [ ] Assets in correct folders
- [ ] Mapping document updated
- [ ] Visual consistency verified

---

## Exceptions

### Allowed Exceptions

1. **Library Assets:** `node_modules/` can contain any files
2. **Build Artifacts:** `.next/`, `dist/`, `build/` folders exempt
3. **Temporary Files:** `.tmp/`, `.cache/` folders exempt
4. **Documentation Images:** `Documentation/images/` for screenshots

### Requesting Exception

If you need an exception to this protocol:

1. Create issue: `protocol-exception: [reason]`
2. Provide justification
3. Propose alternative solution
4. Get approval from tech lead
5. Document exception in this file

---

## Maintenance

**Document Owner:** DevPro Enterprise Team  
**Review Frequency:** Quarterly  
**Last Review:** 2026-03-25

**Change Log:**
- 2026-03-25: Initial protocol creation
- 2026-03-25: Added validation rules
- 2026-03-25: Added enforcement mechanisms

---

## Quick Reference

### ✅ DO

- Store all `.fig`, `.svg`, `.png` in `Shared/Figma/`
- Store all `.tsx`, `.ts`, `.js` in `Implementation/`
- Reference `Design_Tokens.json` for all design values
- Update `MAPPING_DOCUMENT.md` after changes
- Use token imports in all platforms

### ❌ DON'T

- Put visual assets in `Implementation/`
- Put code files in `Shared/Figma/`
- Hard-code colors, spacing, or fonts
- Skip mapping document updates
- Create platform-specific token files

---

## Support

**Questions?** Contact DevPro Enterprise Team  
**Issues?** Create ticket with label `protocol-violation`  
**Suggestions?** Submit PR to this document
