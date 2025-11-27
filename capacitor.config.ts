import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bpmgr.app',
  appName: 'BPM',
  webDir: 'dist/acomdev',
  server: {
    cleartext: true,
    androidScheme: 'http'
    
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
