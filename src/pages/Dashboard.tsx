
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import SmartWakeUpPlan from '@/components/SmartWakeUpPlan';
import { getNextWakeUpTime, calculateWakeUpPlan } from '@/utils/planCalculator';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { name, wakeUpPlan, progress, setWakeUpPlan } = useUserStore();
  const { toast } = useToast();
  
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
      })
    };

    // Update the plan in the store
    setWakeUpPlan(updatedPlan);

    toast({
      title: "Wake-up Plan Refreshed",
      description: "Your plan has been updated with the improved calculation.",
      duration: 3000,
    });
  };
  
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshPlan}
                className="text-indigo/70 hover:text-indigo flex items-center gap-1 text-xs py-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh Plan</span>
              </Button>
            </div>
            <div className="flex justify-center">
              <ScheduleCalendar wakeUpPlan={wakeUpPlan} />
            </div>
          </div>
        )}
      </div>
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
