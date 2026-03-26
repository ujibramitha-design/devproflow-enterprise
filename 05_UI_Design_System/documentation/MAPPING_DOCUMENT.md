# Design to Code Mapping Document — DevPro Flow Enterprise

**Version:** 2.0.0  
**Last Updated:** 2026-03-25  
**Source UI Kit:** Master Layout UI Design System  
**Token File:** `05_UI_Design_System/Shared/Design_Tokens.json`

---

## 1. Overview

This document is the **single traceability reference** linking:
- Figma design assets (`Shared/Figma/`) → Code implementations (`Implementation/Web/`)
- Design tokens (`Shared/Design_Tokens.json`) → CSS variables (`globals.css`)
- Web components (`Implementation/Web/`) → Platform adaptations (Mobile / Desktop)

**Token Flow:**
```
Master Layout globals.css
    ↓ extracted to
Shared/Design_Tokens.json  ←  Single Source of Truth
    ↓ consumed by
├── 02_Web_Application/frontend/tailwind.config.js
├── 01_Mobile_APK_Android/src/theme/tokens.ts
└── 03_Desktop_Application/src/main/main.js
```

---

## 2. UI Components — shadcn/ui (57 Components)

**Source folder:** `Implementation/Web/components/ui/`  
**Figma folder:** `Shared/Figma/Components/Atoms/` and `Molecules/`

| # | Component | Code File | Figma Asset | Category | Radix Primitive | Status |
|---|-----------|-----------|-------------|----------|-----------------|--------|
| 1 | **Accordion** | `ui/accordion.tsx` | `Atoms/Accordion.fig` | Disclosure | `@radix-ui/react-accordion` | ✅ |
| 2 | **Alert** | `ui/alert.tsx` | `Atoms/Alert.fig` | Feedback | — | ✅ |
| 3 | **Alert Dialog** | `ui/alert-dialog.tsx` | `Molecules/AlertDialog.fig` | Overlay | `@radix-ui/react-alert-dialog` | ✅ |
| 4 | **Aspect Ratio** | `ui/aspect-ratio.tsx` | `Atoms/AspectRatio.fig` | Layout | `@radix-ui/react-aspect-ratio` | ✅ |
| 5 | **Avatar** | `ui/avatar.tsx` | `Atoms/Avatar.fig` | Media | `@radix-ui/react-avatar` | ✅ |
| 6 | **Badge** | `ui/badge.tsx` | `Atoms/Badge.fig` | Display | — | ✅ |
| 7 | **Breadcrumb** | `ui/breadcrumb.tsx` | `Molecules/Breadcrumb.fig` | Navigation | — | ✅ |
| 8 | **Button** | `ui/button.tsx` | `Atoms/Button.fig` | Action | — | ✅ |
| 9 | **Button Group** | `ui/button-group.tsx` | `Molecules/ButtonGroup.fig` | Action | — | ✅ |
| 10 | **Calendar** | `ui/calendar.tsx` | `Molecules/Calendar.fig` | Date/Time | `react-day-picker` | ✅ |
| 11 | **Card** | `ui/card.tsx` | `Atoms/Card.fig` | Layout | — | ✅ |
| 12 | **Carousel** | `ui/carousel.tsx` | `Organisms/Carousel.fig` | Media | `embla-carousel-react` | ✅ |
| 13 | **Chart** | `ui/chart.tsx` | `Organisms/Chart.fig` | Data Viz | `recharts` | ✅ |
| 14 | **Checkbox** | `ui/checkbox.tsx` | `Atoms/Checkbox.fig` | Form | `@radix-ui/react-checkbox` | ✅ |
| 15 | **Collapsible** | `ui/collapsible.tsx` | `Atoms/Collapsible.fig` | Disclosure | `@radix-ui/react-collapsible` | ✅ |
| 16 | **Command** | `ui/command.tsx` | `Molecules/Command.fig` | Search | `cmdk` | ✅ |
| 17 | **Context Menu** | `ui/context-menu.tsx` | `Molecules/ContextMenu.fig` | Navigation | `@radix-ui/react-context-menu` | ✅ |
| 18 | **Dialog** | `ui/dialog.tsx` | `Molecules/Dialog.fig` | Overlay | `@radix-ui/react-dialog` | ✅ |
| 19 | **Drawer** | `ui/drawer.tsx` | `Molecules/Drawer.fig` | Overlay | `vaul` | ✅ |
| 20 | **Dropdown Menu** | `ui/dropdown-menu.tsx` | `Molecules/Dropdown.fig` | Navigation | `@radix-ui/react-dropdown-menu` | ✅ |
| 21 | **Empty** | `ui/empty.tsx` | `Atoms/EmptyState.fig` | Feedback | — | ✅ |
| 22 | **Field** | `ui/field.tsx` | `Molecules/Field.fig` | Form | — | ✅ |
| 23 | **Form** | `ui/form.tsx` | `Organisms/Form.fig` | Form | `react-hook-form` | ✅ |
| 24 | **Hover Card** | `ui/hover-card.tsx` | `Molecules/HoverCard.fig` | Overlay | `@radix-ui/react-hover-card` | ✅ |
| 25 | **Input** | `ui/input.tsx` | `Atoms/Input.fig` | Form | — | ✅ |
| 26 | **Input Group** | `ui/input-group.tsx` | `Molecules/InputGroup.fig` | Form | — | ✅ |
| 27 | **Input OTP** | `ui/input-otp.tsx` | `Molecules/InputOTP.fig` | Form | `input-otp` | ✅ |
| 28 | **Item** | `ui/item.tsx` | `Atoms/Item.fig` | List | — | ✅ |
| 29 | **Kbd** | `ui/kbd.tsx` | `Atoms/Kbd.fig` | Display | — | ✅ |
| 30 | **Label** | `ui/label.tsx` | `Atoms/Label.fig` | Form | `@radix-ui/react-label` | ✅ |
| 31 | **Menubar** | `ui/menubar.tsx` | `Organisms/Menubar.fig` | Navigation | `@radix-ui/react-menubar` | ✅ |
| 32 | **Navigation Menu** | `ui/navigation-menu.tsx` | `Organisms/NavigationMenu.fig` | Navigation | `@radix-ui/react-navigation-menu` | ✅ |
| 33 | **Pagination** | `ui/pagination.tsx` | `Molecules/Pagination.fig` | Navigation | — | ✅ |
| 34 | **Popover** | `ui/popover.tsx` | `Molecules/Popover.fig` | Overlay | `@radix-ui/react-popover` | ✅ |
| 35 | **Progress** | `ui/progress.tsx` | `Atoms/Progress.fig` | Feedback | `@radix-ui/react-progress` | ✅ |
| 36 | **Radio Group** | `ui/radio-group.tsx` | `Atoms/RadioGroup.fig` | Form | `@radix-ui/react-radio-group` | ✅ |
| 37 | **Resizable** | `ui/resizable.tsx` | `Molecules/Resizable.fig` | Layout | `react-resizable-panels` | ✅ |
| 38 | **Scroll Area** | `ui/scroll-area.tsx` | `Atoms/ScrollArea.fig` | Layout | `@radix-ui/react-scroll-area` | ✅ |
| 39 | **Select** | `ui/select.tsx` | `Molecules/Select.fig` | Form | `@radix-ui/react-select` | ✅ |
| 40 | **Separator** | `ui/separator.tsx` | `Atoms/Separator.fig` | Layout | `@radix-ui/react-separator` | ✅ |
| 41 | **Sheet** | `ui/sheet.tsx` | `Molecules/Sheet.fig` | Overlay | `@radix-ui/react-dialog` | ✅ |
| 42 | **Sidebar** | `ui/sidebar.tsx` | `Organisms/Sidebar.fig` | Navigation | `@radix-ui/react-slot` | ✅ |
| 43 | **Skeleton** | `ui/skeleton.tsx` | `Atoms/Skeleton.fig` | Feedback | — | ✅ |
| 44 | **Slider** | `ui/slider.tsx` | `Atoms/Slider.fig` | Form | `@radix-ui/react-slider` | ✅ |
| 45 | **Sonner** | `ui/sonner.tsx` | `Atoms/Toast.fig` | Feedback | `sonner` | ✅ |
| 46 | **Spinner** | `ui/spinner.tsx` | `Atoms/Spinner.fig` | Feedback | — | ✅ |
| 47 | **Switch** | `ui/switch.tsx` | `Atoms/Switch.fig` | Form | `@radix-ui/react-switch` | ✅ |
| 48 | **Table** | `ui/table.tsx` | `Organisms/Table.fig` | Data | — | ✅ |
| 49 | **Tabs** | `ui/tabs.tsx` | `Molecules/Tabs.fig` | Navigation | `@radix-ui/react-tabs` | ✅ |
| 50 | **Textarea** | `ui/textarea.tsx` | `Atoms/Textarea.fig` | Form | — | ✅ |
| 51 | **Toast** | `ui/toast.tsx` | `Atoms/Toast.fig` | Feedback | `@radix-ui/react-toast` | ✅ |
| 52 | **Toaster** | `ui/toaster.tsx` | `Atoms/Toaster.fig` | Feedback | `@radix-ui/react-toast` | ✅ |
| 53 | **Toggle** | `ui/toggle.tsx` | `Atoms/Toggle.fig` | Action | `@radix-ui/react-toggle` | ✅ |
| 54 | **Toggle Group** | `ui/toggle-group.tsx` | `Molecules/ToggleGroup.fig` | Action | `@radix-ui/react-toggle-group` | ✅ |
| 55 | **Tooltip** | `ui/tooltip.tsx` | `Atoms/Tooltip.fig` | Overlay | `@radix-ui/react-tooltip` | ✅ |
| 56 | **Use Mobile** | `ui/use-mobile.tsx` | — (utility hook) | Utility | — | ✅ |
| 57 | **Use Toast** | `ui/use-toast.ts` | — (utility hook) | Utility | — | ✅ |

---

## 3. Dashboard Components (9 Components)

**Source folder:** `Implementation/Web/components/dashboard/`  
**Figma folder:** `Shared/Figma/Screens/Dashboard/` and `Figma/Components/Organisms/`

| # | Component | Code File | Figma Asset | Tokens Used | Description |
|---|-----------|-----------|-------------|-------------|-------------|
| 1 | **Sidebar** | `dashboard/sidebar.tsx` | `Screens/Dashboard/Sidebar.fig` | `colors.*.sidebar*`, `radius.base` | Collapsible nav sidebar with Lucide icons |
| 2 | **Topbar** | `dashboard/topbar.tsx` | `Screens/Dashboard/Topbar.fig` | `colors.*.primary`, `typography.sans` | Breadcrumb + clock + search + user avatar |
| 3 | **KPI Cards** | `dashboard/kpi-cards.tsx` | `Organisms/KPICard.fig` | `textStyles.kpiValue`, `textStyles.kpiLabel`, `colors.*.chart*` | Metric cards with animated sparklines |
| 4 | **Live Clock** | `dashboard/live-clock.tsx` | `Organisms/LiveClock.fig` | `typography.fontFamily.mono`, `colors.*.mutedForeground` | Real-time clock display |
| 5 | **Logo 3D** | `dashboard/logo-3d.tsx` | `Atoms/Logo.fig` | `animations.keyframes.float`, `colors.*.primary` | 3D animated logo with float animation |
| 6 | **Quick Stats** | `dashboard/quick-stats.tsx` | `Organisms/QuickStats.fig` | `colors.*.success`, `colors.*.warning`, `colors.*.destructive` | Summary stats widget |
| 7 | **Recent Applications** | `dashboard/recent-applications.tsx` | `Organisms/RecentApplications.fig` | `colors.*.muted`, `textStyles.bodySmall`, `colors.*.border` | Paginated application list table |
| 8 | **Theme Toggle** | `dashboard/theme-toggle.tsx` | `Atoms/ThemeToggle.fig` | `colors.light.*`, `colors.dark.*` | Dark/light mode toggle button |
| 9 | **Header** | `dashboard/header.tsx` | `Organisms/PageHeader.fig` | `textStyles.h3`, `colors.*.foreground` | Page-level header with title + actions |

---

## 4. Shared Components (2 Files)

| File | Code Path | Description | Tokens Used |
|------|-----------|-------------|-------------|
| **Theme Provider** | `components/theme-provider.tsx` | next-themes wrapper for dark mode | All `colors.*` |
| **Root Layout** | `app/layout.tsx` | Next.js root layout with sidebar + topbar pattern | `typography.fontFamily.sans`, `typography.fontFamily.mono` |

---

## 5. Design Token → CSS Variable Mapping

Complete mapping from `Design_Tokens.json` keys to `globals.css` CSS variables.  
**Authority:** `Shared/Design_Tokens.json` → `Implementation/Web/app/globals.css`

### 5.1 Colors — Light Theme (`:root`)

| CSS Variable | Token Key | Value (Light) | Usage |
|-------------|-----------|---------------|-------|
| `--background` | `colors.light.background` | `#FAFAF9` | Page background |
| `--foreground` | `colors.light.foreground` | `#18181B` | Primary text |
| `--card` | `colors.light.card` | `#FFFFFF` | Card surface |
| `--card-foreground` | `colors.light.cardForeground` | `#18181B` | Card text |
| `--popover` | `colors.light.popover` | `#FFFFFF` | Popover surface |
| `--popover-foreground` | `colors.light.popoverForeground` | `#18181B` | Popover text |
| `--primary` | `colors.light.primary` | `#3B82F6` | Primary brand (blue) |
| `--primary-foreground` | `colors.light.primaryForeground` | `#FFFFFF` | Text on primary |
| `--secondary` | `colors.light.secondary` | `#F5F5F4` | Secondary surface |
| `--secondary-foreground` | `colors.light.secondaryForeground` | `#1C1917` | Text on secondary |
| `--muted` | `colors.light.muted` | `#F0F0EE` | Muted surface |
| `--muted-foreground` | `colors.light.mutedForeground` | `#78716C` | Muted text |
| `--accent` | `colors.light.accent` | `#FB923C` | Accent (orange) |
| `--accent-foreground` | `colors.light.accentForeground` | `#292524` | Text on accent |
| `--destructive` | `colors.light.destructive` | `#EF4444` | Error/danger |
| `--border` | `colors.light.border` | `#E7E5E4` | Borders |
| `--input` | `colors.light.input` | `#E7E5E4` | Input borders |
| `--ring` | `colors.light.ring` | `#3B82F6` | Focus ring |
| `--radius` | `radius.base` | `1rem` (16px) | Global border radius |
| `--chart-1` | `colors.light.chart1` | `#3B82F6` | Chart: blue |
| `--chart-2` | `colors.light.chart2` | `#10B981` | Chart: green |
| `--chart-3` | `colors.light.chart3` | `#FB923C` | Chart: orange |
| `--chart-4` | `colors.light.chart4` | `#F59E0B` | Chart: amber |
| `--chart-5` | `colors.light.chart5` | `#8B5CF6` | Chart: purple |
| `--sidebar` | `colors.light.sidebar` | `#FAFAF8` | Sidebar bg |
| `--sidebar-foreground` | `colors.light.sidebarForeground` | `#44403C` | Sidebar text |
| `--sidebar-primary` | `colors.light.sidebarPrimary` | `#3B82F6` | Sidebar active |
| `--sidebar-primary-foreground` | `colors.light.sidebarPrimaryForeground` | `#FFFFFF` | Sidebar active text |
| `--sidebar-accent` | `colors.light.sidebarAccent` | `#EFF6FF` | Sidebar hover bg |
| `--sidebar-accent-foreground` | `colors.light.sidebarAccentForeground` | `#1E3A8A` | Sidebar hover text |
| `--sidebar-border` | `colors.light.sidebarBorder` | `#E7E5E4` | Sidebar divider |
| `--font-sans` | `typography.fontFamily.sans` | `Plus Jakarta Sans, Inter, system-ui` | Primary font |
| `--font-mono` | `typography.fontFamily.mono` | `Geist Mono, Monaco, Consolas` | Monospace font |

### 5.2 Colors — Dark Theme (`.dark`)

| CSS Variable | Token Key | Value (Dark) |
|-------------|-----------|--------------|
| `--background` | `colors.dark.background` | `#0F172A` |
| `--foreground` | `colors.dark.foreground` | `#F8FAFC` |
| `--card` | `colors.dark.card` | `#1E293B` |
| `--primary` | `colors.dark.primary` | `#60A5FA` |
| `--secondary` | `colors.dark.secondary` | `#1E293B` |
| `--muted` | `colors.dark.muted` | `#334155` |
| `--muted-foreground` | `colors.dark.mutedForeground` | `#94A3B8` |
| `--accent` | `colors.dark.accent` | `#FDBA74` |
| `--destructive` | `colors.dark.destructive` | `#DC2626` |
| `--border` | `colors.dark.border` | `#475569` |
| `--ring` | `colors.dark.ring` | `#60A5FA` |
| `--sidebar` | `colors.dark.sidebar` | `#0C1222` |
| `--chart-1` | `colors.dark.chart1` | `#60A5FA` |

### 5.3 Typography Tokens

| Token Key | Value | CSS Class (Tailwind) | Usage |
|-----------|-------|---------------------|-------|
| `typography.fontFamily.sans` | `Plus Jakarta Sans, Inter, system-ui` | `font-sans` | Body text |
| `typography.fontFamily.mono` | `Geist Mono, Monaco, Consolas` | `font-mono` | Code |
| `typography.fontSize.xs` | `0.75rem` (12px) | `text-xs` | Captions |
| `typography.fontSize.sm` | `0.875rem` (14px) | `text-sm` | Secondary |
| `typography.fontSize.base` | `1rem` (16px) | `text-base` | Body |
| `typography.fontSize.lg` | `1.125rem` (18px) | `text-lg` | Large body |
| `typography.fontSize.xl` | `1.25rem` (20px) | `text-xl` | Subheadings |
| `typography.fontSize.2xl` | `1.5rem` (24px) | `text-2xl` | Headings |
| `typography.fontSize.3xl` | `1.875rem` (30px) | `text-3xl` | KPI values |
| `typography.fontSize.4xl` | `2.25rem` (36px) | `text-4xl` | Page titles |
| `typography.fontSize.5xl` | `3rem` (48px) | `text-5xl` | Display |
| `typography.fontWeight.normal` | `400` | `font-normal` | Body |
| `typography.fontWeight.medium` | `500` | `font-medium` | Labels |
| `typography.fontWeight.semibold` | `600` | `font-semibold` | Headings |
| `typography.fontWeight.bold` | `700` | `font-bold` | Strong |
| `typography.fontWeight.extrabold` | `800` | `font-extrabold` | Display |

---

## 6. Text Style Presets

| Style Name | Font | Size | Weight | Usage | Token Reference |
|------------|------|------|--------|-------|----------------|
| `display` | Sans | 5xl (48px) | Bold | Hero headings | `textStyles.display` |
| `h1` | Sans | 4xl (36px) | Bold | Page titles | `textStyles.h1` |
| `h2` | Sans | 3xl (30px) | Semibold | Section headings | `textStyles.h2` |
| `h3` | Sans | 2xl (24px) | Semibold | Card titles | `textStyles.h3` |
| `h4` | Sans | xl (20px) | Semibold | Widget titles | `textStyles.h4` |
| `body` | Sans | base (16px) | Normal | Default text | `textStyles.body` |
| `bodySmall` | Sans | sm (14px) | Normal | Descriptions | `textStyles.bodySmall` |
| `caption` | Sans | xs (12px) | Normal | Timestamps, helpers | `textStyles.caption` |
| `label` | Sans | sm (14px) | Medium | Form labels, buttons | `textStyles.label` |
| `code` | Mono | sm (14px) | Normal | Code snippets | `textStyles.code` |
| `kpiValue` | Sans | 3xl (30px) | Bold | KPI numbers | `textStyles.kpiValue` |
| `kpiLabel` | Sans | sm (14px) | Medium | KPI labels | `textStyles.kpiLabel` |

---

## 7. Figma Asset Folder Structure

```
Shared/Figma/
│
├── Components/
│   ├── Atoms/           ← Single-purpose components (Button, Input, Badge, etc.)
│   │   ├── Button.fig
│   │   ├── Card.fig
│   │   ├── Input.fig
│   │   ├── Badge.fig
│   │   ├── Avatar.fig
│   │   ├── Checkbox.fig
│   │   ├── Switch.fig
│   │   ├── Toggle.fig
│   │   ├── Slider.fig
│   │   ├── Progress.fig
│   │   ├── Skeleton.fig
│   │   ├── Spinner.fig
│   │   ├── Separator.fig
│   │   ├── Label.fig
│   │   ├── Textarea.fig
│   │   ├── Kbd.fig
│   │   ├── Toast.fig
│   │   ├── Toaster.fig
│   │   ├── Tooltip.fig
│   │   ├── Sonner.fig
│   │   ├── Collapsible.fig
│   │   ├── AspectRatio.fig
│   │   ├── ScrollArea.fig
│   │   ├── EmptyState.fig
│   │   ├── Item.fig
│   │   ├── Logo.fig
│   │   └── ThemeToggle.fig
│   │
│   ├── Molecules/       ← Composed components (Dialog, Dropdown, etc.)
│   │   ├── AlertDialog.fig
│   │   ├── Breadcrumb.fig
│   │   ├── ButtonGroup.fig
│   │   ├── Calendar.fig
│   │   ├── Command.fig
│   │   ├── ContextMenu.fig
│   │   ├── Dialog.fig
│   │   ├── Drawer.fig
│   │   ├── Dropdown.fig
│   │   ├── Field.fig
│   │   ├── HoverCard.fig
│   │   ├── InputGroup.fig
│   │   ├── InputOTP.fig
│   │   ├── Pagination.fig
│   │   ├── Popover.fig
│   │   ├── Resizable.fig
│   │   ├── Select.fig
│   │   ├── Sheet.fig
│   │   ├── Tabs.fig
│   │   └── ToggleGroup.fig
│   │
│   └── Organisms/       ← Complex patterns (Table, Form, Chart, etc.)
│       ├── Carousel.fig
│       ├── Chart.fig
│       ├── Form.fig
│       ├── KPICard.fig
│       ├── LiveClock.fig
│       ├── Menubar.fig
│       ├── NavigationMenu.fig
│       ├── PageHeader.fig
│       ├── QuickStats.fig
│       ├── RecentApplications.fig
│       ├── Sidebar.fig (ui/sidebar.tsx — complex 21KB component)
│       └── Table.fig
│
├── Screens/
│   ├── Dashboard/
│   │   ├── Dashboard.fig         ← Full dashboard layout
│   │   ├── Sidebar.fig           ← dashboard/sidebar.tsx
│   │   └── Topbar.fig            ← dashboard/topbar.tsx
│   ├── Auth/
│   │   ├── Login.fig
│   │   └── Register.fig
│   └── Units/
│       ├── UnitList.fig
│       └── UnitDetail.fig
│
├── Styleguide/
│   ├── Colors/
│   │   ├── ColorPalette_Light.fig
│   │   └── ColorPalette_Dark.fig
│   ├── Typography/
│   │   ├── TypeScale.fig
│   │   └── TextStyles.fig
│   └── Spacing/
│       └── SpacingScale.fig
│
├── Icons/
│   ├── SVG/              ← Exported SVG icons from Lucide set
│   └── PNG/              ← PNG exports at 1x/2x/3x
│
├── Exports/
│   ├── Web/              ← Web-optimized exports (SVG, WebP)
│   └── Mobile/           ← Mobile-optimized exports (PNG @2x, @3x)
│
└── README.md             ← Figma folder usage guide
```

---

## 8. Icon Mapping

**Icon Library:** Lucide React v0.474.0  
**Token Reference:** `icons.library`, `icons.sizes`, `icons.strokeWidth`

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| `icons.sizes.xs` | 12px | `size-3` | Inline badges |
| `icons.sizes.sm` | 16px | `size-4` | Buttons, inputs |
| `icons.sizes.md` | 20px | `size-5` | Default icons |
| `icons.sizes.lg` | 24px | `size-6` | Navigation icons |
| `icons.sizes.xl` | 32px | `size-8` | Feature icons |
| `icons.sizes.2xl` | 48px | `size-12` | Empty states |
| `icons.strokeWidth.thin` | 1.5 | — | Decorative |
| `icons.strokeWidth.normal` | 2 | — | Default |
| `icons.strokeWidth.bold` | 2.5 | — | Emphasis |

**Icons used in Dashboard Components:**
- `sidebar.tsx` → `LayoutDashboard`, `Building2`, `Users`, `FileText`, `Settings`, `LogOut`, `ChevronLeft`
- `topbar.tsx` → `Search`, `Bell`, `MessageSquare`, `Moon`, `Sun`, `User`
- `kpi-cards.tsx` → `TrendingUp`, `TrendingDown`, `FileCheck`, `XCircle`

---

## 9. Z-Index & Overlay Layers

| Token Key | Value | Component | Description |
|-----------|-------|-----------|-------------|
| `zIndex.dropdown` | 1000 | Dropdown Menu, Select | Below sticky |
| `zIndex.sticky` | 1020 | Topbar, Sidebar | Sticky nav |
| `zIndex.overlay` | 1030 | Sheet, Drawer backdrop | Below modal |
| `zIndex.modal` | 1040 | Dialog, Alert Dialog | Modal layer |
| `zIndex.popover` | 1050 | Popover, Command | Above modal |
| `zIndex.toast` | 1060 | Sonner, Toaster | Notifications |
| `zIndex.tooltip` | 1070 | Tooltip | Top layer |

---

## 10. Component Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Extracted to `Implementation/Web/` |
| 🎨 | Figma asset placeholder — designer must export |
| ⏳ | Mobile adaptation pending |
| 🔄 | In progress |

---

## 11. Platform Adaptation Status

| Component Category | 05 Web | 02 Web | 03 Desktop | 01 Mobile |
|-------------------|--------|--------|------------|-----------|
| **UI Components (57)** | ✅ Source | ✅ Direct import via `@/ds-components/*` | ✅ Via Electron | ⏳ RN Paper |
| **Dashboard (9)** | ✅ Source | ✅ Direct import | ✅ Via Electron | ⏳ RN Navigation |
| **Design Tokens** | ✅ Source | ✅ `tailwind.config.js` | ✅ `main.js` | ✅ `theme/tokens.ts` |
| **CSS Variables** | ✅ `globals.css` | ✅ Inherited | ✅ Inherited | ❌ N/A (StyleSheet) |

---

## 12. Update Protocol

When adding new components or changing design tokens:

1. **Designer adds/updates Figma asset** in `Shared/Figma/`
2. **Designer updates** this `MAPPING_DOCUMENT.md` — add row to Component table
3. **Developer updates** `Design_Tokens.json` if new color/font/spacing introduced
4. **Developer extracts** component code to `Implementation/Web/components/`
5. **Developer updates** `tailwind.config.js` if new token classes needed
6. **Mobile developer** adapts component with React Native Paper if needed

**Never:**
- Hard-code HEX/spacing values in platform code
- Create platform-specific token files without updating `Design_Tokens.json` first
- Add files to `Shared/Figma/` that are NOT visual design assets

---

## 13. Quick Reference — Token to Component

| Token | Components That Use It |
|-------|----------------------|
| `colors.*.primary` | Button (default), Badge (default), Ring, Sidebar active |
| `colors.*.secondary` | Button (secondary), Badge (secondary), Card |
| `colors.*.destructive` | Button (destructive), Alert (destructive), Badge (destructive) |
| `colors.*.accent` | Badge (outline), hover states, KPI trend up |
| `colors.*.muted` | Skeleton, Separator, Input placeholder, Empty state |
| `colors.*.border` | Input, Card, Table, Separator, all form elements |
| `colors.*.sidebar*` | Sidebar (all 6 sidebar color variants) |
| `colors.*.chart*` | Chart (recharts), KPI mini sparklines |
| `radius.base` | All rounded components (1rem = 16px default) |
| `typography.fontFamily.sans` | All non-code text in every component |
| `typography.fontFamily.mono` | Kbd, Code blocks, Live Clock, Input OTP |
| `animations.keyframes.float` | Logo 3D (dashboard/logo-3d.tsx) |
| `animations.keyframes.shimmerSlide` | Skeleton loading animation |
| `animations.keyframes.dotPing` | Status indicators, notification dots |
| `shadows.md` | Card, Dialog, Dropdown, Popover |
| `shadows.lg` | Sheet, Sidebar (elevated) |
| `zIndex.modal` | Dialog, Alert Dialog, Sheet |
| `zIndex.toast` | Sonner, Toaster |
| `zIndex.tooltip` | Tooltip |

---

**Document Maintained By:** DevPro Enterprise Team  
**Source:** Master Layout UI Design System → 05_UI_Design_System  
**Version:** 2.0.0 | Last Updated: 2026-03-25
