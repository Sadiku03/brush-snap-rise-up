import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import SmartWakeUpPlan from '@/components/SmartWakeUpPlan';
import { getNextWakeUpTime, calculateWakeUpPlan, analyzeWakeUpPlan } from '@/utils/planCalculator';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RecalculatePlanModal from '@/components/RecalculatePlanModal';

const Dashboard = () => {
  const { name, wakeUpPlan, progress, setWakeUpPlan, setShowRecalculationModal } = useUserStore();
  const { toast } = useToast();
  const [autoRefreshed, setAutoRefreshed] = useState(false);
  
  // Get the next wake-up time from the plan
  const nextWakeUp = wakeUpPlan ? getNextWakeUpTime(wakeUpPlan) : null;
  
  // Function to refresh the wake-up plan with the latest calculation logic
  const handleRefreshPlan = () => {
    if (!wakeUpPlan) return;

    // Recalculate the plan with the same parameters but using the updated algorithm
    const refreshedPlan = calculateWakeUpPlan(
      wakeUpPlan.currentWakeTime,
      wakeUpPlan.targetWakeTime,
      wakeUpPlan.targetDate
    );

    // Preserve completed status from the original plan
    const updatedPlan = {
      ...refreshedPlan,
      intervals: refreshedPlan.intervals.map(newInterval => {
        const originalInterval = wakeUpPlan.intervals.find(
          oldInterval => oldInterval.date === newInterval.date
        );
        return {
          ...newInterval,
          completed: originalInterval ? originalInterval.completed : false
        };
      }),
      // Preserve adjustment history if any
      adjustmentHistory: wakeUpPlan.adjustmentHistory || []
    };

    // Update the plan in the store
    setWakeUpPlan(updatedPlan);

    if (!autoRefreshed) {
      toast({
        title: "Wake-up Plan Updated",
        description: "Your plan has been automatically refreshed with the latest calculations.",
        duration: 3000,
      });
      setAutoRefreshed(true);
    }
  };
  
  // Automatically refresh plan on component mount
  useEffect(() => {
    if (wakeUpPlan && !autoRefreshed) {
      handleRefreshPlan();
    }
  }, [wakeUpPlan]); // Only depend on wakeUpPlan to avoid infinite refreshes
  
  // Function to manually open recalculation modal
  const handleOpenRecalculationModal = () => {
    setShowRecalculationModal(true);
  };
  
  // Analyze plan to see if it needs adjustment
  const planAnalysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo mb-1">
          Good {getTimeOfDay()}, {name || 'Quester'}!
        </h1>
        <p className="text-indigo/70">
          {getWelcomeMessage(progress.streak, nextWakeUp)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <SmartWakeUpPlan />
        
        {wakeUpPlan && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-indigo">Schedule Calendar</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={planAnalysis.needsReset ? "default" : "outline"}
                  size="sm"
                  onClick={handleOpenRecalculationModal}
                  className={`flex items-center gap-1 text-xs py-1 ${
                    planAnalysis.needsReset 
                      ? "bg-coral hover:bg-coral/90 text-white" 
                      : "text-indigo/70 hover:text-indigo"
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  <span>Recalculate</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <ScheduleCalendar wakeUpPlan={wakeUpPlan} />
            </div>
          </div>
        )}
      </div>
      
      {/* Add the recalculation modal */}
      <RecalculatePlanModal />
    </div>
  );
};

// Helper function to determine the time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "evening";
  } else {
    return "night";
  }
}

// Helper function to generate welcome message
function getWelcomeMessage(streak: number, nextWakeUp: { date: string; time: string } | null) {
  if (streak === 0) {
    return "Welcome to your sleep journey! Set up your wake-up plan to get started.";
  }
  
  if (streak === 1) {
    return "Great start! You've completed your first day.";
  }
  
  if (nextWakeUp) {
    const today = new Date().toISOString().split('T')[0];
    
    if (nextWakeUp.date === today) {
      return `You're on a ${streak}-day streak! Your next wake-up time is ${nextWakeUp.time} today.`;
    } else {
      return `You're on a ${streak}-day streak! Your next wake-up time is ${nextWakeUp.time} on ${formatDate(nextWakeUp.date)}.`;
    }
  }
  
  return `You're on a ${streak}-day streak! Keep up the great work.`;
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export default Dashboard;
