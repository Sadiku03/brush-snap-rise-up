
import { Capacitor } from '@capacitor/core';

// This file is imported in the main.tsx file to initialize Capacitor
export const initializeCapacitor = () => {
  if (Capacitor.isNativePlatform()) {
    console.log('Running on native platform:', Capacitor.getPlatform());
    
    // Initialize any plugins that need to be set up at app start
    
    // Add any platform-specific initializations here
    if (Capacitor.getPlatform() === 'ios') {
      console.log('Initializing iOS-specific features...');
      // iOS-specific initialization
    } else if (Capacitor.getPlatform() === 'android') {
      console.log('Initializing Android-specific features...');
      // Android-specific initialization
    }
  } else {
    console.log('Running in web environment');
  }
};

// Documentation for users about Siri Shortcuts
export const getSiriShortcutsSetupInfo = () => {
  return `
    # Setting Up Siri Shortcuts for RiseQuest Alarms
    
    To get the most out of the alarm integration, you'll need to create a simple Siri Shortcut:
    
    1. Open the Shortcuts app on your iOS device
    2. Tap the + button to create a new shortcut
    3. Name it "SetRiseQuestAlarm"
    4. Add the "Set Alarm" action
    5. Configure it to accept input for the time
    6. Save the shortcut
    
    Now when you tap "Set Native Alarm" in the app, it will launch this shortcut with your wake-up time.
  `;
};
