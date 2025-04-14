
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, ArrowRight, Edit2, Check, Camera } from "lucide-react";
import { calculateWakeUpPlan, getNextWakeUpTime, isValidWakeUpTime } from '@/utils/planCalculator';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/use-toast';

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
  
  const { toast } = useToast();
  
  const nextWakeUp = wakeUpPlan ? getNextWakeUpTime(wakeUpPlan) : null;
  
  // Check if it's within the check-in window
  useEffect(() => {
    if (!wakeUpPlan || !nextWakeUp) return;
    
    const checkWindow = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Only show the check-in button if today is the next wake up date
      if (nextWakeUp.date !== today) {
        setShowCheckIn(false);
        return;
      }
      
      // Check if the current time is within 15 minutes before or after the wake-up time
      const wakeUpHours = parseInt(nextWakeUp.time.split(':')[0]);
      const wakeUpMinutes = parseInt(nextWakeUp.time.split(':')[1]);
      
      const wakeUpDate = new Date();
      wakeUpDate.setHours(wakeUpHours, wakeUpMinutes, 0, 0);
      
      // 15 minutes in milliseconds
      const fifteenMinutes = 15 * 60 * 1000;
      
      const timeDiff = Math.abs(now.getTime() - wakeUpDate.getTime());
      
      setShowCheckIn(timeDiff <= fifteenMinutes);
    };
    
    // Check initially
    checkWindow();
    
    // Then check every minute
    const interval = setInterval(checkWindow, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [wakeUpPlan, nextWakeUp]);
  
  const handleCreatePlan = () => {
    const plan = calculateWakeUpPlan(currentWakeTime, targetWakeTime, targetDate);
    setWakeUpPlan(plan);
    setEditing(false);
  };
  
  const calculateProgress = () => {
    if (!wakeUpPlan) return 0;
    
    const completedIntervals = wakeUpPlan.intervals.filter(i => i.completed).length;
    return (completedIntervals / wakeUpPlan.intervals.length) * 100;
  };
  
  // Check if user already has a verification for today
  const today = new Date().toISOString().split('T')[0];
  const alreadyVerifiedToday = brushSnaps.some(snap => snap.date === today);
  
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
                
                {/* Check-in button - only shown during the check-in window */}
                {showCheckIn && !alreadyVerifiedToday && (
                  <CheckInButton 
                    onCheckIn={() => {
                      // Simulate opening a camera modal by redirecting to the BrushSnap component
                      // In a real app, this would open a camera modal
                      document.getElementById('brush-snap-component')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                      
                      // Flash the brush snap component to draw attention
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
                
                {/* Already verified today indicator */}
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

// Check-in button component with pulsing animation
const CheckInButton = ({ onCheckIn }: { onCheckIn: () => void }) => {
  const [isPulsing, setIsPulsing] = useState(true);
  
  // Start pulsing animation
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
