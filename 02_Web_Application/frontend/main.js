const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0b0e14', // DevPro-Enterprise dark theme
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the Next.js server - use environment variable for production
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  win.loadURL(appUrl);

  // Optional: Open DevTools for debugging
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
