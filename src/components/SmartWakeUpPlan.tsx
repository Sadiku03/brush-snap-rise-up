
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, ArrowRight, Edit2, Check, Camera, Bell } from "lucide-react";
import { calculateWakeUpPlan, getNextWakeUpTime, isValidWakeUpTime } from '@/utils/planCalculator';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/use-toast';
import { NativeBridge } from '@/services/NativeBridge';

const SmartWakeUpPlan = () => {
  const { wakeUpPlan, setWakeUpPlan, brushSnaps, addBrushSnap, recordWakeUp } = useUserStore();
  const [editing, setEditing] = useState(!wakeUpPlan);
  const [currentWakeTime, setCurrentWakeTime] = useState(
    wakeUpPlan?.currentWakeTime || "08:00"
  );
  const [targetWakeTime, setTargetWakeTime] = useState(
    wakeUpPlan?.targetWakeTime || "06:00"
  );
  const [targetDate, setTargetDate] = useState(
    wakeUpPlan?.targetDate || (() => {
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      return twoWeeksFromNow.toISOString().split('T')[0];
    })()
  );
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const { toast } = useToast();
  
  const nextWakeUp = wakeUpPlan ? getNextWakeUpTime(wakeUpPlan) : null;
  
  const forceShowCheckIn = false; // Changed to false to disable forced check-in
  
  // Setup notification handling
  useEffect(() => {
    const setupNotifications = async () => {
      if (NativeBridge.isNativePlatform()) {
        const hasPermission = await NativeBridge.requestNotificationPermission();
        setNotificationsEnabled(hasPermission);
        
        if (hasPermission) {
          // Set up notification handlers
          await NativeBridge.setupNotificationHandlers((notificationData) => {
            console.log('Notification received:', notificationData);
            
            if (notificationData.extra?.wakeUpDate) {
              // Mark the wake-up as completed if notification was triggered
              recordWakeUp(notificationData.extra.wakeUpDate);
              
              toast({
                title: "Wake-up recorded!",
                description: "Your wake-up has been marked as completed.",
                duration: 3000,
              });
            }
          });
          
          toast({
            title: "Notifications Enabled",
            description: "You'll receive wake-up reminders at your scheduled times.",
            duration: 3000,
          });
        }
      }
    };
    
    setupNotifications();
    
    // Clean up notification listeners on unmount
    return () => {
      // This would clean up listeners in a real implementation
    };
  }, [toast, recordWakeUp]);
  
  // Schedule notifications for wake-up times
  useEffect(() => {
    if (!wakeUpPlan || !notificationsEnabled || !NativeBridge.isNativePlatform()) return;
    
    // Cancel any existing notifications first
    const cancelExistingNotifications = async () => {
      for (let i = 0; i < wakeUpPlan.intervals.length; i++) {
        await NativeBridge.cancelNotification(i + 1000);
      }
    };
    
    // Schedule new notifications
    const scheduleNewNotifications = async () => {
      await cancelExistingNotifications();
      
      const today = new Date().toISOString().split('T')[0];
      
      wakeUpPlan.intervals.forEach((interval, index) => {
        if (interval.date >= today && !interval.completed) {
          const [hours, minutes] = interval.wakeTime.split(':').map(Number);
          
          const wakeDate = new Date(interval.date);
          wakeDate.setHours(hours, minutes, 0, 0);
          
          // Don't schedule if it's in the past
          if (wakeDate > new Date()) {
            NativeBridge.scheduleWakeUpNotification(
              index + 1000, // Unique ID for each notification
              "Time to Wake Up!",
              `It's ${interval.wakeTime}, your scheduled wake-up time. Tap to check in and set an alarm.`,
              wakeDate,
              {
                wakeUpTime: interval.wakeTime,
                wakeUpDate: interval.date
              }
            );
          }
        }
      });
      
      toast({
        title: "Wake-up Reminders Set",
        description: "You'll be notified at your scheduled wake-up times.",
        duration: 3000,
      });
    };
    
    scheduleNewNotifications();
  }, [wakeUpPlan, notificationsEnabled, toast]);
  
  useEffect(() => {
    if (!wakeUpPlan || !nextWakeUp) return;
    
    const checkWindow = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      if (nextWakeUp.date !== today) {
        setShowCheckIn(forceShowCheckIn);
        return;
      }
      
      const wakeUpHours = parseInt(nextWakeUp.time.split(':')[0]);
      const wakeUpMinutes = parseInt(nextWakeUp.time.split(':')[1]);
      
      const wakeUpDate = new Date();
      wakeUpDate.setHours(wakeUpHours, wakeUpMinutes, 0, 0);
      
      const fiveMinutes = 5 * 60 * 1000;
      
      const timeDiff = Math.abs(now.getTime() - wakeUpDate.getTime());
      
      setShowCheckIn(forceShowCheckIn || timeDiff <= fiveMinutes);
      
      console.log("Current time:", now.toTimeString());
      console.log("Wake up time:", wakeUpDate.toTimeString());
      console.log("Time difference (ms):", timeDiff);
      console.log("Check-in window (ms):", fiveMinutes);
      console.log("Should show check-in:", forceShowCheckIn || timeDiff <= fiveMinutes);
    };
    
    checkWindow();
    
    const interval = setInterval(checkWindow, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [wakeUpPlan, nextWakeUp, forceShowCheckIn]);
  
  const handleCreatePlan = () => {
    const plan = calculateWakeUpPlan(currentWakeTime, targetWakeTime, targetDate);
    setWakeUpPlan(plan);
    setEditing(false);
    
    toast({
      title: "Wake-up Plan Created",
      description: "Your personalized wake-up plan is ready!",
      duration: 3000,
    });
    
    // Request notification permissions if we haven't already
    if (NativeBridge.isNativePlatform() && !notificationsEnabled) {
      NativeBridge.requestNotificationPermission().then((hasPermission) => {
        setNotificationsEnabled(hasPermission);
      });
    }
  };
  
  const calculateProgress = () => {
    if (!wakeUpPlan) return 0;
    
    const completedIntervals = wakeUpPlan.intervals.filter(i => i.completed).length;
    return (completedIntervals / wakeUpPlan.intervals.length) * 100;
  };
  
  const today = new Date().toISOString().split('T')[0];
  const alreadyVerifiedToday = brushSnaps.some(snap => snap.date === today);
  
  // Function to request to set a native alarm
  const requestSetNativeAlarm = async (time: string) => {
    if (!NativeBridge.isNativePlatform()) {
      toast({
        title: "Native Feature",
        description: "This feature is only available on mobile devices.",
        duration: 3000,
      });
      return;
    }
    
    if (NativeBridge.getPlatform() === 'ios') {
      // On iOS, we'd use Siri Shortcuts
      await NativeBridge.openSiriShortcutForAlarm(time);
      
      toast({
        title: "Setting Alarm",
        description: `Opening Siri to set an alarm for ${time}.`,
        duration: 3000,
      });
    } else {
      // For Android, we'd need a different approach
      toast({
        title: "Feature In Development",
        description: "Setting alarms on Android will be available soon.",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo">Your Wake-Up Plan</h2>
        {wakeUpPlan && !editing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setEditing(true)}
            className="text-indigo/70 hover:text-indigo hover:bg-skyblue/30"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Plan
          </Button>
        )}
      </div>
      
      <div className="p-5">
        {editing ? (
          <div className="space-y-5 animate-fade-in">
            <div>
              <Label htmlFor="current-wake" className="text-indigo/80 mb-1 block">
                Current Wake-Up Time
              </Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo/70" />
                <Input
                  id="current-wake"
                  type="time"
                  value={currentWakeTime}
                  onChange={(e) => setCurrentWakeTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="target-wake" className="text-indigo/80 mb-1 block">
                Target Wake-Up Time
              </Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo/70" />
                <Input
                  id="target-wake"
                  type="time"
                  value={targetWakeTime}
                  onChange={(e) => setTargetWakeTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="target-date" className="text-indigo/80 mb-1 block">
                Target Date
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo/70" />
                <Input
                  id="target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreatePlan}
              className="btn-primary w-full mt-4"
            >
              {wakeUpPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        ) : wakeUpPlan ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-indigo/60">Current Wake-Up</p>
                <p className="text-xl font-semibold text-indigo">{wakeUpPlan.currentWakeTime}</p>
              </div>
              
              <ArrowRight className="h-5 w-5 text-indigo/40" />
              
              <div>
                <p className="text-sm text-indigo/60">Target Wake-Up</p>
                <p className="text-xl font-semibold text-indigo">{wakeUpPlan.targetWakeTime}</p>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-indigo/60 mb-1">Progress</p>
              <div className="h-2 bg-indigo/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-coral rounded-full transition-all duration-700"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
            
            {nextWakeUp && (
              <div className="bg-coral/10 p-4 rounded-lg border border-coral/20 mt-4 relative overflow-hidden">
                <p className="text-sm text-indigo/80 mb-1">Your next wake-up time:</p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-coral">{nextWakeUp.time}</p>
                  <p className="text-indigo/70">
                    {new Date(nextWakeUp.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Add new button for setting a native alarm */}
                <Button
                  onClick={() => requestSetNativeAlarm(nextWakeUp.time)}
                  className="mt-3 w-full bg-indigo hover:bg-indigo/90 text-white"
                  disabled={!NativeBridge.isNativePlatform()}
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Set Native Alarm
                </Button>
                
                {showCheckIn && !alreadyVerifiedToday && (
                  <CheckInButton 
                    onCheckIn={() => {
                      document.getElementById('brush-snap-component')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                      
                      const brushSnapElement = document.getElementById('brush-snap-component');
                      if (brushSnapElement) {
                        brushSnapElement.classList.add('ring-4', 'ring-coral', 'ring-opacity-70');
                        setTimeout(() => {
                          brushSnapElement.classList.remove('ring-4', 'ring-coral', 'ring-opacity-70');
                        }, 2000);
                      }
                      
                      toast({
                        title: "Time to check in!",
                        description: "Take a photo with your toothbrush to verify your wake-up.",
                        duration: 5000,
                      });
                    }}
                  />
                )}
                
                {alreadyVerifiedToday && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm font-medium text-indigo mb-2">Wake-Up Schedule</p>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                {wakeUpPlan.intervals.map((interval, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border flex justify-between items-center
                      ${interval.completed 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-white border-lilac/20'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full 
                          ${interval.completed ? 'bg-emerald-400' : 'bg-indigo/20'}`}
                      />
                      <span className="font-medium">{interval.wakeTime}</span>
                    </div>
                    <span className="text-sm text-indigo/70">
                      {new Date(interval.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-indigo/70 mb-4">You haven't created a wake-up plan yet.</p>
            <Button 
              onClick={() => setEditing(true)}
              className="btn-primary"
            >
              Create Your Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckInButton = ({ onCheckIn }: { onCheckIn: () => void }) => {
  const [isPulsing, setIsPulsing] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Button
      onClick={onCheckIn}
      className={`mt-4 w-full bg-coral hover:bg-coral/90 text-white transition-all duration-300
        ${isPulsing ? 'scale-[1.02]' : 'scale-100'}`}
    >
      <Camera className="h-5 w-5 mr-2" />
      Check In Now
    </Button>
  );
};

export default SmartWakeUpPlan;
