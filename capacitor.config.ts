import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dz.mantoudj.fellahbladi',
  appName: 'منتوج فلاح بلادي',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1B4332',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '242283208162-aed2aic87cjkt54l1k2dlanh9jmkv7mh.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
