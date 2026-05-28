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
};

export default config;
