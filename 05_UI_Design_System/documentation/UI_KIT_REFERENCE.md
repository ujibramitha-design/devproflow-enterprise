# UI Kit Reference - Master Layout UI Design System

**Status:** ✅ CONFIRMED  
**Date:** 2026-03-25  
**Authority:** DevPro Enterprise Team

---

## Official Designation

**Master Layout UI Design System** is hereby designated as the **PRIMARY UI KIT** for the DevPro Flow Enterprise project.

**Location:**
```
WORKFLOW PROTOCOL - DevPro-Enterprise/Master Layout UI Design System/
```

---

## Authority & Scope

### Single Source of Truth

All visual components, design patterns, and UI implementations MUST reference the Master Layout UI Design System as the canonical source.

**Hierarchy:**
```
Master Layout UI Design System (PRIMARY)
    ↓
05_UI_Design_System (EXTRACTION & ORGANIZATION)
    ↓
01_Mobile_APK_Android (ADAPTATION)
02_Web_Application (IMPLEMENTATION)
03_Desktop_Application (IMPLEMENTATION)
```

---

## Component Inventory

### UI Components (57 total)

**Location:** `Master Layout UI Design System/components/ui/`

| Component | File | Status | Extraction Target |
|-----------|------|--------|-------------------|
| accordion | accordion.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| alert-dialog | alert-dialog.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| alert | alert.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| aspect-ratio | aspect-ratio.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| avatar | avatar.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| badge | badge.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| breadcrumb | breadcrumb.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| button-group | button-group.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| button | button.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| calendar | calendar.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| card | card.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| carousel | carousel.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| chart | chart.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| checkbox | checkbox.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| collapsible | collapsible.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| command | command.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| context-menu | context-menu.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| dialog | dialog.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| drawer | drawer.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| dropdown-menu | dropdown-menu.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| empty | empty.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| field | field.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| form | form.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| hover-card | hover-card.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| input-group | input-group.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| input-otp | input-otp.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| input | input.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| item | item.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| kbd | kbd.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| label | label.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| menubar | menubar.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| navigation-menu | navigation-menu.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| pagination | pagination.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| popover | popover.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| progress | progress.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| radio-group | radio-group.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| resizable | resizable.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| scroll-area | scroll-area.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| select | select.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| separator | separator.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| sheet | sheet.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| sidebar | sidebar.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| skeleton | skeleton.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| slider | slider.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| sonner | sonner.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| spinner | spinner.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| switch | switch.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| table | table.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| tabs | tabs.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| textarea | textarea.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| toast | toast.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| toaster | toaster.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| toggle-group | toggle-group.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| toggle | toggle.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| tooltip | tooltip.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| use-mobile | use-mobile.tsx | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |
| use-toast | use-toast.ts | ✅ Ready | 05_UI_Design_System/Implementation/Web/components/ui/ |

### Dashboard Components (9 total)

**Location:** `Master Layout UI Design System/components/dashboard/`

| Component | File | Purpose | Extraction Target |
|-----------|------|---------|-------------------|
| header | header.tsx | Page header | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| kpi-cards | kpi-cards.tsx | KPI metric cards with sparklines | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| live-clock | live-clock.tsx | Real-time clock display | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| logo-3d | logo-3d.tsx | 3D animated logo | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| quick-stats | quick-stats.tsx | Quick statistics | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| recent-applications | recent-applications.tsx | Recent applications list | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| sidebar | sidebar.tsx | Navigation sidebar (collapsible) | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| theme-toggle | theme-toggle.tsx | Dark/light mode toggle | 05_UI_Design_System/Implementation/Web/components/dashboard/ |
| topbar | topbar.tsx | Top navigation bar | 05_UI_Design_System/Implementation/Web/components/dashboard/ |

### Design System Files

**Location:** `Master Layout UI Design System/app/`

| File | Purpose | Extraction Target |
|------|---------|-------------------|
| globals.css | Design tokens (CSS variables) | 05_UI_Design_System/Shared/Design_Tokens.json (already extracted) |
| layout.tsx | Root layout pattern | 05_UI_Design_System/Implementation/Web/app/ |

---

## Extraction Protocol

### Phase 1: Component Extraction ✅ READY

**Source:** `Master Layout UI Design System/components/`  
**Target:** `05_UI_Design_System/Implementation/Web/components/`

**Method:**
```bash
# Copy all UI components
robocopy "Master Layout UI Design System/components/ui" \
         "05_UI_Design_System/Implementation/Web/components/ui" \
         /E /COPY:DAT

# Copy all dashboard components
robocopy "Master Layout UI Design System/components/dashboard" \
         "05_UI_Design_System/Implementation/Web/components/dashboard" \
         /E /COPY:DAT
```

### Phase 2: Design Token Validation ✅ COMPLETE

**Status:** Design_Tokens.json already generated from Master Layout globals.css

**Validation:**
- ✅ 40+ color tokens extracted
- ✅ Typography tokens (Plus Jakarta Sans, Geist Mono)
- ✅ Spacing tokens (8px grid, border-radius)
- ✅ Animation keyframes (9 animations)
- ✅ Icon configuration (Lucide)

### Phase 3: Visual Asset Extraction 🔄 PENDING

**Source:** `Master Layout UI Design System/public/` (if exists)  
**Target:** `05_UI_Design_System/Shared/Figma/Components/Exports/`

**Assets to Extract:**
- SVG icons
- Logo files
- Brand assets
- Image exports

### Phase 4: Documentation Update 🔄 PENDING

**Update Files:**
- `05_UI_Design_System/Documentation/MAPPING_DOCUMENT.md`
- `05_UI_Design_System/README.md`

**Add Mappings:**
- All 57 UI components
- All 9 dashboard components
- Design token references

---

## Reference Standards

### Technology Stack (from Master Layout)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.11 | React framework |
| React | 19.0.0 | UI library |
| TypeScript | 5.7.2 | Type safety |
| Tailwind CSS | 4.0.0 | Styling |
| shadcn/ui | Latest | Component library |
| Radix UI | Latest | Primitives |
| Lucide React | 0.474.0 | Icons |
| Recharts | 2.15.0 | Charts |

### Design Principles (from Master Layout)

1. **Color System:** OKLCH color space for perceptual uniformity
2. **Typography:** Plus Jakarta Sans (primary), Geist Mono (code)
3. **Spacing:** 8px base grid system, 1rem (16px) border-radius
4. **Animations:** Smooth cubic-bezier easing, 300-500ms durations
5. **Dark Mode:** Full dark theme support with enhanced contrast
6. **Accessibility:** WCAG 2.1 AA compliant

---

## Usage Guidelines

### For Developers

**When implementing new features:**

1. **Check Master Layout first:**
   ```bash
   cd "Master Layout UI Design System"
   ls components/ui/
   ```

2. **Use extracted components from 05_UI_Design_System:**
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Card } from '@/components/ui/card';
   ```

3. **Reference Design_Tokens.json:**
   ```typescript
   import tokens from '../../Shared/Design_Tokens.json';
   const color = tokens.colors.light.primary.value;
   ```

### For Designers

**When creating new designs:**

1. **Reference Master Layout patterns**
2. **Export to:** `05_UI_Design_System/Shared/Figma/`
3. **Update:** `Design_Tokens.json` if new tokens needed
4. **Document:** In `MAPPING_DOCUMENT.md`

---

## Validation Checklist

### Component Extraction
- [ ] All 57 UI components copied to 05_UI_Design_System
- [ ] All 9 dashboard components copied to 05_UI_Design_System
- [ ] Component imports updated
- [ ] No broken dependencies

### Design Tokens
- [x] Design_Tokens.json matches Master Layout globals.css
- [x] All color tokens present (light + dark)
- [x] Typography tokens complete
- [x] Spacing tokens complete
- [x] Animation tokens complete

### Documentation
- [ ] MAPPING_DOCUMENT.md updated with all components
- [ ] README.md reflects Master Layout as primary reference
- [ ] Protocol compliance verified

---

## Maintenance

**Update Frequency:** When Master Layout UI Design System changes

**Update Process:**
1. Identify changes in Master Layout
2. Extract updated components to 05_UI_Design_System
3. Update Design_Tokens.json if needed
4. Update MAPPING_DOCUMENT.md
5. Test across all platforms
6. Deploy updates

---

## Authority Confirmation

**Confirmed By:** DevPro Enterprise Team  
**Date:** 2026-03-25  
**Status:** ACTIVE

**Master Layout UI Design System** is the official, canonical UI Kit for all DevPro Flow Enterprise implementations.

All visual components, design patterns, and UI implementations MUST derive from this source.

---

## Quick Reference

**Master Layout Location:**
```
d:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\Master Layout UI Design System\
```

**Extraction Target:**
```
d:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\05_UI_Design_System\
```

**Component Count:**
- UI Components: 57
- Dashboard Components: 9
- Total: 66 components

**Design Tokens:**
- Colors: 40+ tokens (light + dark)
- Typography: 2 font families, 9 sizes
- Spacing: 13 scale values
- Animations: 9 keyframes
- Icons: Lucide library
