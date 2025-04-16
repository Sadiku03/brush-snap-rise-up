
import { NativeBridge } from './NativeBridge';

/**
 * Set up native bridge and request permissions for notifications on app startup
 */
export const setupNativeBridge = async () => {
  // Request permission for notifications if on native platform
  const hasPermission = await NativeBridge.requestNotificationPermission();
  console.log('Notification permission status:', hasPermission ? 'granted' : 'denied');
  
  // Set up notification handlers
  await NativeBridge.setupNotificationHandlers((notification) => {
    console.log('Notification received:', notification);
    // Handle notification actions here
  });
  
  // Log platform info
  if (NativeBridge.isNativePlatform()) {
    console.log('Running on native platform:', NativeBridge.getPlatform());
  } else {
    console.log('Running in web environment');
  }
};
