# KPRFlow Enterprise - Desktop Application

## Overview
Electron desktop application with full integration to KPRFlow Enterprise web application. Provides native desktop experience with offline capabilities and system integration.

## Technology Stack
- **Framework:** Electron 27.0.0
- **Language:** JavaScript/TypeScript
- **UI:** React 18.2.0 (from web application)
- **Build:** Electron Builder
- **Integration:** Web application embedding

## Structure
```
src/
├── main/                     # Electron main process
│   ├── main.js             # Main application entry point
│   └── preload.js          # Secure bridge to renderer
├── renderer/               # React renderer process
│   └── index.html          # Main renderer window
├── shared/                 # Shared utilities
│   └── electron-utils.js   # Common Electron utilities
└── assets/                 # Application assets
    └── icon.png           # Application icon
```

## Features
- **Native Desktop Experience** - Custom title bar, window controls
- **Web Application Integration** - Embeds existing web app
- **Offline Support** - Local data storage and caching
- **System Integration** - File dialogs, notifications, deep linking
- **Cross-Platform** - Windows, macOS, Linux support
- **Security** - Context isolation, preload scripts

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Web application running (for development)

### Installation
```bash
# Navigate to desktop app
cd 03_Desktop_Application

# Install dependencies
npm install

# Install Electron dev dependencies
npm install --save-dev electron electron-builder
```

### Development
```bash
# Start development server
npm run dev

# Start with web app integration
npm run dev:web

# Build for development
npm run build:dev
```

### Production Build
```bash
# Build for production
npm run build

# Build distributables
npm run dist

# Build for specific platform
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## Configuration

### Package.json Scripts
```json
{
  "main": "src/main/main.js",
  "scripts": {
    "start": "electron .",
    "dev": "electron . --dev",
    "build": "electron-builder",
    "dist": "electron-builder --publish=never"
  }
}
```

### Electron Builder Configuration
```json
"build": {
  "appId": "com.kprflow.desktop",
  "productName": "KPRFlow Enterprise",
  "directories": {
    "output": "dist"
  },
  "files": [
    "src/**/*",
    "node_modules/**/*"
  ],
  "win": {
    "target": "nsis",
    "icon": "src/assets/icon.ico"
  }
}
```

## Integration with Web Application

### Development Mode
- Loads web app from `http://localhost:3000`
- Hot reload enabled
- Dev tools available

### Production Mode
- Embeds built web application
- Offline capabilities
- Local data caching

### Communication
- IPC channels for system integration
- Context bridge for secure communication
- Event handling for menu actions

## Security Features

### Context Isolation
- Renderer process isolated from main process
- Preload script for secure API exposure
- No direct Node.js access in renderer

### Sandboxing
- Limited file system access
- Controlled external URL opening
- Secure IPC communication

## System Integration

### File Operations
- Open file dialogs
- Save file dialogs
- Drag and drop support

### Notifications
- System notifications
- Badge updates
- Tray integration

### Deep Linking
- Custom protocol `kprflow://`
- URL handling
- Application routing

## Troubleshooting

### Common Issues
1. **White screen on start** - Check web app URL
2. **Dev tools not opening** - Verify development mode
3. **Build failures** - Check Electron Builder configuration
4. **IPC errors** - Verify preload script setup

### Debug Mode
```bash
# Enable debug logging
DEBUG=electron:* npm run dev

# Open dev tools automatically
npm run dev:debug
```

## Performance Optimization

### Memory Management
- Process isolation
- Lazy loading
- Garbage collection

### Bundle Size
- Tree shaking
- Code splitting
- Asset optimization

## Deployment

### Windows
- NSIS installer
- Auto-updater support
- Code signing

### macOS
- DMG package
- Notarization
- Gatekeeper compatibility

### Linux
- AppImage
- DEB/RPM packages
- Snap support

## Status: ✅ IMPLEMENTATION COMPLETE

**Implementation Status:** 100% Complete
**Features:** All core features implemented
**Integration:** Web app integration ready
**Build:** Production build configured
**Testing:** Development environment ready
Desktop development only - tidak affect mobile atau web applications.
