/**
 * KPRFlow Enterprise - Desktop Application Main Process
 * Electron main process for desktop application
 */

const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
// Detect dev mode from either NODE_ENV or the --dev flag passed by "npm run dev"
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev')

// ⭐ Design Tokens - Single Source of Truth
const tokens = require('../../../05_UI_Design_System/Shared/Design_Tokens.json')

// Disable hardware acceleration to prevent GPU crash on Windows (exit -1073740791)
app.disableHardwareAcceleration()

// Keep global references to prevent garbage collection
let mainWindow
let tray

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    // ── Token-based window background (no hard-coded hex) ──
    backgroundColor: tokens.colors.light.background.value,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    ...((() => { const p = path.join(__dirname, '../../assets/icon.png'); return fs.existsSync(p) ? { icon: p } : {} })()),
    show: false,
    titleBarStyle: 'default'
  })

  // Load the app
  // Dev: Next.js dev server (02_Web_Application)
  // Prod: Static export bundled via electron-builder extraResources
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(process.resourcesPath, 'web-app', 'index.html')}`

  mainWindow.loadURL(startUrl)

  // In dev: retry if Next.js server isn't ready yet
  if (isDev) {
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDesc) => {
      if (errorCode === -102 || errorCode === -106 || errorDesc === 'ERR_CONNECTION_REFUSED' || errorDesc === 'ERR_INTERNET_DISCONNECTED') {
        console.log(`[Electron] Server not ready (${errorDesc}), retrying in 2s...`)
        setTimeout(() => {
          mainWindow.loadURL(startUrl)
        }, 2000)
      }
    })
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// App event handlers
app.whenReady().then(() => {
  createWindow()
  setupTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Application',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('menu-new-application')
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          mainWindow.webContents.send('menu-open')
        }
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: () => {
          mainWindow.webContents.send('menu-about')
        }
      },
      {
        label: 'Documentation',
        click: () => {
          shell.openExternal('https://github.com/kprflow/enterprise')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform', () => {
  return process.platform
})

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.handle('close-window', () => {
  mainWindow.close()
})

// Handle app protocol for deep linking
app.setAsDefaultProtocolClient('kprflow')

// Handle deep linking (Windows)
if (process.platform === 'win32') {
  app.on('open-url', (event, url) => {
    event.preventDefault()
    mainWindow.webContents.send('deep-link', url)
  })
}

// ── System Tray Setup ──
function setupTray() {
  const iconPath = path.join(__dirname, '../../assets/icon.png')
  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => { if (mainWindow) mainWindow.show() }
    },
    {
      label: 'Dashboard',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.webContents.send('navigate', '/dashboard')
        }
      }
    },
    { type: 'separator' },
    {
      label: `v${app.getVersion()}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => { app.quit() }
    }
  ])

  tray.setToolTip('DevPro Flow Enterprise')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { if (mainWindow) mainWindow.show() })
}

console.log('KPRFlow Enterprise Desktop Application - Main Process Started')
