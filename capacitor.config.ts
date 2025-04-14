
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0a7afa82b88f437e868b5db616d37314',
  appName: 'brush-snap-rise-up',
  webDir: 'dist',
  server: {
    url: 'https://0a7afa82-b88f-437e-868b-5db616d37314.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#CE5B78",
      sound: "beep.wav",
    }
  }
};

export default config;
