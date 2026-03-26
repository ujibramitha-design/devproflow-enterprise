/**
 * KPRFlow Enterprise - Desktop Application Shared Utilities
 * Common utilities for Electron desktop application
 */

const { app, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')

class ElectronUtils {
  constructor() {
    this.appDataPath = app.getPath('appData')
    this.appName = 'KPRFlow Enterprise'
    this.appVersion = app.getVersion()
  }

  /**
   * Get application data directory
   */
  getAppDataDir() {
    return path.join(this.appDataPath, this.appName)
  }

  /**
   * Ensure app data directory exists
   */
  ensureAppDataDir() {
    const appDataDir = this.getAppDataDir()
    if (!fs.existsSync(appDataDir)) {
      fs.mkdirSync(appDataDir, { recursive: true })
    }
    return appDataDir
  }

  /**
   * Show error dialog
   */
  showErrorDialog(title, message) {
    dialog.showErrorBox(title, message)
  }

  /**
   * Show information dialog
   */
  showInfoDialog(title, message) {
    dialog.showMessageBox({
      type: 'info',
      title: title,
      message: message,
      buttons: ['OK']
    })
  }

  /**
   * Show confirmation dialog
   */
  async showConfirmDialog(title, message) {
    const result = await dialog.showMessageBox({
      type: 'question',
      title: title,
      message: message,
      buttons: ['Yes', 'No'],
      defaultId: 0
    })
    return result.response === 0
  }

  /**
   * Open external URL
   */
  openExternal(url) {
    shell.openExternal(url)
  }

  /**
   * Get application version
   */
  getVersion() {
    return this.appVersion
  }

  /**
   * Check if running in development mode
   */
  isDev() {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * Get platform information
   */
  getPlatformInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node
    }
  }

  /**
   * Save data to app data directory
   */
  saveData(filename, data) {
    try {
      const appDataDir = this.ensureAppDataDir()
      const filePath = path.join(appDataDir, filename)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error('Error saving data:', error)
      return false
    }
  }

  /**
   * Load data from app data directory
   */
  loadData(filename) {
    try {
      const appDataDir = this.getAppDataDir()
      const filePath = path.join(appDataDir, filename)
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
      }
      return null
    } catch (error) {
      console.error('Error loading data:', error)
      return null
    }
  }

  /**
   * Delete data file
   */
  deleteData(filename) {
    try {
      const appDataDir = this.getAppDataDir()
      const filePath = path.join(appDataDir, filename)
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting data:', error)
      return false
    }
  }

  /**
   * Get all data files
   */
  getDataFiles() {
    try {
      const appDataDir = this.getAppDataDir()
      
      if (fs.existsSync(appDataDir)) {
        return fs.readdirSync(appDataDir).filter(file => 
          file.endsWith('.json') || file.endsWith('.data')
        )
      }
      return []
    } catch (error) {
      console.error('Error getting data files:', error)
      return []
    }
  }

  /**
   * Clear all app data
   */
  clearAllData() {
    try {
      const appDataDir = this.getAppDataDir()
      
      if (fs.existsSync(appDataDir)) {
        const files = fs.readdirSync(appDataDir)
        files.forEach(file => {
          const filePath = path.join(appDataDir, file)
          fs.unlinkSync(filePath)
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Get system information
   */
  getSystemInfo() {
    const os = require('os')
    
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      hostname: os.hostname(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      uptime: os.uptime(),
      loadAverage: os.loadavg()
    }
  }

  /**
   * Validate application configuration
   */
  validateConfig() {
    const errors = []
    
    // Check required directories
    const requiredDirs = [
      this.getAppDataDir()
    ]
    
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        errors.push(`Required directory missing: ${dir}`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
  }
}

module.exports = ElectronUtils
