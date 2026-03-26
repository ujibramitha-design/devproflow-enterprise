module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@shared':        '../06_Shared_Components',
          '@design-system': './src/theme',
          '@components':    './src/components',
          '@screens':       './src/screens',
          '@navigation':    './src/navigation',
          '@utils':         './src/utils',
          '@providers':     './src/providers',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel-plugin'],
    },
  },
};
