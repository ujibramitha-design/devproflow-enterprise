# Shared/Figma - Design Assets

**Purpose:** Raw design assets storage (Figma files, SVG/PNG exports)

---

## Folder Structure

```
Figma/
├── Components/              ← Figma component files
│   ├── Button.fig
│   ├── Card.fig
│   ├── Input.fig
│   └── Exports/             ← SVG/PNG exports from Figma
│       ├── icon-home.svg
│       ├── icon-user.svg
│       └── logo-devpro.png
├── Screens/                 ← Full screen designs
│   ├── Dashboard.fig
│   ├── Login.fig
│   └── UnitCatalog.fig
└── Styleguide/              ← Design documentation
    ├── Colors.pdf
    ├── Typography.pdf
    └── Spacing-Grid.pdf
```

---

## Protocol Rules

### ✅ ALLOWED in this folder:
- `.fig` (Figma design files)
- `.svg` (Vector graphics)
- `.png`, `.jpg` (Raster images)
- `.pdf` (Design documentation)
- `.sketch` (Sketch files)

### ❌ FORBIDDEN in this folder:
- `.tsx`, `.ts`, `.jsx`, `.js` (Code files)
- `.css`, `.scss` (Stylesheets)
- `.json` (Config files - except Design_Tokens.json in parent)

---

## Usage

### For Designers

**Exporting Components:**
```
1. Design component in Figma
2. Export .fig file to: Components/[ComponentName].fig
3. Export SVG/PNG to: Components/Exports/[asset-name].svg
4. Update ../Design_Tokens.json if design tokens changed
5. Notify developer team
```

**Naming Convention:**
- Figma files: `PascalCase.fig` (e.g., `Button.fig`, `InputField.fig`)
- Exports: `kebab-case.svg` (e.g., `icon-home.svg`, `logo-devpro.png`)

---

## Current Status

**Components:** 0 files (awaiting Figma exports)  
**Screens:** 0 files (awaiting Figma exports)  
**Styleguide:** 0 files (awaiting design documentation)

---

## Next Steps

1. Export existing Figma components to `Components/`
2. Export screen designs to `Screens/`
3. Create design documentation PDFs for `Styleguide/`
4. Update `../../Documentation/MAPPING_DOCUMENT.md` with asset mappings
