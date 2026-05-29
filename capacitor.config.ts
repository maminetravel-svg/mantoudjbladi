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
      clientId: '304971212581-iu0u5jperspddcv9b6bcfp99ops2unqc.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
