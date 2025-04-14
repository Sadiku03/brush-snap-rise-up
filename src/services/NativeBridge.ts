
import { Capacitor } from '@capacitor/core';
import { LocalNotifications, ScheduleOptions, ActionPerformed } from '@capacitor/local-notifications';

class NativeBridgeService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  // Request permission for notifications
  async requestNotificationPermission(): Promise<boolean> {
    if (!this.isNative) return false;
    
    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Schedule a wake-up notification
  async scheduleWakeUpNotification(id: number, title: string, body: string, wakeUpTime: Date, extraData?: any): Promise<void> {
    if (!this.isNative) {
      console.log('Would schedule notification on native platform:', { id, title, body, wakeUpTime });
      return;
    }

    try {
      const options: ScheduleOptions = {
        notifications: [
          {
            id,
            title,
            body,
            schedule: { at: wakeUpTime },
            sound: 'beep.wav',
            actionTypeId: 'WAKE_UP_ACTION',
            extra: extraData || {}
          }
        ]
      };

      await LocalNotifications.schedule(options);
      console.log('Wake-up notification scheduled for:', wakeUpTime);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Set up notification handlers
  async setupNotificationHandlers(onNotificationReceived: (data: any) => void): Promise<void> {
    if (!this.isNative) return;

    // When app is in foreground
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received in foreground:', notification);
      onNotificationReceived(notification);
    });

    // When notification is tapped
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction: ActionPerformed) => {
      console.log('Notification action performed:', notificationAction);
      
      // If on iOS and we have a special wake-up action
      if (Capacitor.getPlatform() === 'ios' && notificationAction.notification.extra?.wakeUpTime) {
        this.openSiriShortcutForAlarm(notificationAction.notification.extra.wakeUpTime);
      }
      
      onNotificationReceived(notificationAction.notification);
    });
  }

  // Open a Siri Shortcut to set an alarm (iOS only)
  async openSiriShortcutForAlarm(wakeUpTime: string): Promise<void> {
    if (Capacitor.getPlatform() !== 'ios') {
      console.log('Siri Shortcuts only available on iOS');
      return;
    }

    // In a real implementation, we would have a custom Capacitor plugin
    // to handle this functionality. For now, we'll simulate it with a console log
    console.log('Would open Siri Shortcut for alarm at:', wakeUpTime);
    
    // Using Capacitor.convertFileSrc to create a deep link
    const shortcutUrl = `shortcuts://run-shortcut?name=SetRiseQuestAlarm&input=${encodeURIComponent(wakeUpTime)}`;
    
    // Opening the URL would be done via App plugin in a real implementation
    console.log('Would open URL:', shortcutUrl);
    
    // We'd need a custom plugin to really implement this
    // For example: await Plugins.AppLauncher.openUrl({ url: shortcutUrl });
  }

  // Cancel a scheduled notification
  async cancelNotification(id: number): Promise<void> {
    if (!this.isNative) return;
    
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log('Notification cancelled:', id);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Check if running on a native platform
  isNativePlatform(): boolean {
    return this.isNative;
  }

  // Get platform name
  getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

// Export as a singleton
export const NativeBridge = new NativeBridgeService();
