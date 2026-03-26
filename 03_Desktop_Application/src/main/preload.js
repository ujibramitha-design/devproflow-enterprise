/**
 * KPRFlow Enterprise - Desktop Application Preload Script
 * Secure bridge between main and renderer processes
 */

const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process
// to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Menu events
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-application', callback)
    ipcRenderer.on('menu-open', callback)
    ipcRenderer.on('menu-about', callback)
  },
  
  // Navigation (from tray or menu)
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, path) => callback(path))
  },

  // Deep linking
  onDeepLink: (callback) => {
    ipcRenderer.on('deep-link', callback)
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// Security: Prevent node integration in renderer
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
