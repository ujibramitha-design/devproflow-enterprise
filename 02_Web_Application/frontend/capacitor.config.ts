import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devproflow.enterprise',
  appName: 'DevPro-Enterprise',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0b0e14",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerStyle: "large",
      spinnerColor: "#3b82f6"
    }
  }
};

export default config;
