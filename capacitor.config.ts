import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techcrest.news',
  appName: 'TechCrest',
  webDir: 'out',
  server: {
    url: 'https://technews-lyart.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f172a',
  },
};

export default config;
