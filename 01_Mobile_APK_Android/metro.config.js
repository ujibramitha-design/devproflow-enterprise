const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = {
  ...getDefaultConfig(projectRoot),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Allow Metro to resolve modules from workspace root
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    alias: {
      '@shared':        path.resolve(workspaceRoot, '06_Shared_Components'),
      '@design-system': path.resolve(projectRoot,   'src/theme'),
      '@components':    path.resolve(projectRoot,   'src/components'),
      '@screens':       path.resolve(projectRoot,   'src/screens'),
      '@navigation':    path.resolve(projectRoot,   'src/navigation'),
      '@utils':         path.resolve(projectRoot,   'src/utils'),
      '@providers':     path.resolve(projectRoot,   'src/providers'),
    },
  },
  // Watch 05_UI_Design_System so token changes hot-reload in the app
  watchFolders: [
    path.resolve(workspaceRoot, '06_Shared_Components'),
    path.resolve(workspaceRoot, '05_UI_Design_System'),
  ],
};

module.exports = config;
