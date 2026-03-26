# Desktop Implementation Guide - Electron Wrapper

**Platform:** 03_Desktop_Application (Platform C)  
**Strategy:** 100% Reuse via Electron  
**Source:** 02_Web_Application + 05_UI_Design_System

---

## Overview

Desktop platform menggunakan **Electron wrapper** untuk menjalankan web application (02_Web_Application) sebagai desktop app.

**✅ YA:** Wrap web app dengan Electron  
**❌ TIDAK:** Create separate desktop UI

---

## Why Electron?

**Advantages:**
- ✅ 100% reuse web components
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Native OS integration
- ✅ File system access
- ✅ Auto-updates
- ✅ System tray support
- ✅ Native menus
- ✅ Offline capability

---

## Setup

### Install Electron

```bash
cd 03_Desktop_Application
npm install electron electron-builder
npm install --save-dev @types/electron
```

### Project Structure

```
03_Desktop_Application/
├── src/
│   ├── main.ts              ← Electron Main Process
│   ├── preload.ts           ← Preload script
│   ├── menu.ts              ← Native menu
│   ├── tray.ts              ← System tray
│   └── theme/
│       └── tokens.ts        ← Re-export from 05
├── build/                   ← Build resources (icons, etc.)
├── dist/                    ← Built app
├── package.json
└── electron-builder.json    ← Build configuration
```

---

## Main Process Setup

### Main Entry Point

```typescript
// src/main.ts

import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { DesignTokens } from './theme/tokens';
import { createMenu } from './menu';
import { createTray } from './tray';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: DesignTokens.colors.light.background.value,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden', // Custom title bar
    frame: false, // Frameless window
  });

  // Load web application
  if (process.env.NODE_ENV === 'development') {
    // Development: Load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from built files
    mainWindow.loadFile(
      path.join(__dirname, '../../02_Web_Application/frontend/out/index.html')
    );
  }

  // Set native menu
  const menu = createMenu(mainWindow);
  Menu.setApplicationMenu(menu);

  // Create system tray
  createTray(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

---

## Native Menu

```typescript
// src/menu.ts

import { Menu, BrowserWindow, app } from 'electron';

export function createMenu(mainWindow: BrowserWindow): Menu {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new');
          },
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open');
          },
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          role: 'quit',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', role: 'reload' },
        { label: 'Force Reload', role: 'forceReload' },
        { label: 'Toggle DevTools', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', role: 'resetZoom' },
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', role: 'minimize' },
        { label: 'Close', role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://devproflow.com/docs');
          },
        },
        {
          label: 'About',
          click: () => {
            mainWindow.webContents.send('menu-about');
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}
```

---

## System Tray

```typescript
// src/tray.ts

import { Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';

export function createTray(mainWindow: BrowserWindow): Tray {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../build/icon.png')
  );
  
  const tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Dashboard',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/dashboard');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy();
      },
    },
  ]);

  tray.setToolTip('DevPro Flow Enterprise');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });

  return tray;
}
```

---

## Preload Script

```typescript
// src/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Menu events
  onMenuNew: (callback: () => void) => ipcRenderer.on('menu-new', callback),
  onMenuOpen: (callback: () => void) => ipcRenderer.on('menu-open', callback),
  onMenuSave: (callback: () => void) => ipcRenderer.on('menu-save', callback),
  onMenuAbout: (callback: () => void) => ipcRenderer.on('menu-about', callback),
  
  // Navigation
  onNavigate: (callback: (event: any, path: string) => void) => 
    ipcRenderer.on('navigate', callback),
  
  // File system
  selectFile: () => ipcRenderer.invoke('dialog:selectFile'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // System
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => process.platform,
});
```

---

## Package Configuration

```json
// package.json

{
  "name": "devpro-flow-desktop",
  "version": "1.0.0",
  "main": "dist/main.js",
  "scripts": {
    "dev": "electron .",
    "build": "tsc && electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "dependencies": {
    "electron": "^28.0.0"
  },
  "devDependencies": {
    "@types/electron": "^1.6.10",
    "electron-builder": "^24.9.1",
    "typescript": "^5.3.3"
  }
}
```

### Electron Builder Configuration

```json
// electron-builder.json

{
  "appId": "com.devproflow.enterprise",
  "productName": "DevPro Flow Enterprise",
  "directories": {
    "output": "dist",
    "buildResources": "build"
  },
  "files": [
    "dist/**/*",
    "../../02_Web_Application/frontend/out/**/*"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "build/icon.ico"
  },
  "mac": {
    "target": ["dmg", "zip"],
    "icon": "build/icon.icns",
    "category": "public.app-category.business"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "build/icon.png",
    "category": "Office"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

---

## Desktop-Specific Features

### File System Access

```typescript
// In Main Process
import { dialog } from 'electron';

ipcMain.handle('dialog:selectFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  
  return result.filePaths;
});

// In Renderer Process (Web App)
const filePaths = await window.electron.selectFile();
```

### Auto-Updates

```typescript
// src/updater.ts

import { autoUpdater } from 'electron-updater';
import { BrowserWindow } from 'electron';

export function setupAutoUpdater(mainWindow: BrowserWindow) {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });
}
```

### Native Notifications

```typescript
// In Main Process
import { Notification } from 'electron';

function showNotification(title: string, body: string) {
  new Notification({
    title,
    body,
    icon: path.join(__dirname, '../build/icon.png'),
  }).show();
}
```

---

## Development Workflow

### 1. Start Web App (Development)

```bash
# Terminal 1: Start Next.js dev server
cd 02_Web_Application/frontend
npm run dev
```

### 2. Start Electron (Development)

```bash
# Terminal 2: Start Electron
cd 03_Desktop_Application
npm run dev
```

### 3. Build for Production

```bash
# Build web app first
cd 02_Web_Application/frontend
npm run build

# Then build desktop app
cd 03_Desktop_Application
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

---

## Best Practices

### DO ✅

1. **Reuse web application**
   - Load from 02_Web_Application
   - No separate desktop UI

2. **Add desktop-specific features**
   - Native menus
   - System tray
   - File system access
   - Auto-updates

3. **Use IPC for communication**
   ```typescript
   // Main → Renderer
   mainWindow.webContents.send('event', data);
   
   // Renderer → Main
   window.electron.someMethod();
   ```

4. **Handle window state**
   ```typescript
   // Save window position/size
   // Restore on next launch
   ```

### DON'T ❌

1. **Don't create separate UI**
   - Use web app UI

2. **Don't expose entire Electron API**
   - Use preload script
   - Expose only needed methods

3. **Don't ignore security**
   - Use contextIsolation: true
   - Use nodeIntegration: false

---

## Summary

**Strategy:**
```
02_Web_Application (Web App)
    ↓ ELECTRON WRAPPER
03_Desktop_Application
```

**Key Points:**
- ✅ 100% reuse web UI
- ✅ Add desktop features (menus, tray, file system)
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Auto-updates
- ❌ Don't create separate UI

**Result:** Native desktop app with web UI consistency!
