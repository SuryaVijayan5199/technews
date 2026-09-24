import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techcrest.news',
  appName: 'TechCrest',
  webDir: 'out',
  server: {
    url: 'https://technews-lyart.vercel.app',
    cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f172a',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0f172a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
