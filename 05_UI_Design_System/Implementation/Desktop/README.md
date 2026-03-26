# Implementation/Desktop — Platform C

**Strategy:** 100% Reuse via Electron  
**Source:** 05_UI_Design_System/Implementation/Web/ + 02_Web_Application  
**Wrapper:** Electron (Chromium renderer)

---

## ✅ Direct Reuse — No Adaptation Needed

Electron renders web content (Chromium), so all React + Tailwind components  
from `Implementation/Web/` work natively without modification.

---

## Architecture

```
Implementation/Web/  (React + Tailwind components)
        ↓
02_Web_Application/  (Next.js app)
        ↓
03_Desktop_Application/  (Electron wraps the web app)
```

---

## Desktop-Specific Additions

Only these need to be built in `03_Desktop_Application/`:

- `src/main/main.js` — BrowserWindow configuration
- `src/menu.js` — Native OS menus (File, Edit, View)
- `src/tray.js` — System tray icon + context menu
- `src/main/preload.js` — IPC bridge (renderer ↔ main)

---

## Token Path

```typescript
import { DesignTokens } from '../../../03_Desktop_Application/src/theme/tokens';
```

---

**Code Location:** `03_Desktop_Application/src/`  
**Guide:** `03_Desktop_Application/DESKTOP_IMPLEMENTATION_GUIDE.md`  
**Token Reference:** `Shared/Design_Tokens.json`
