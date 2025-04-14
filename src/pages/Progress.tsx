
import { useEffect } from 'react';
import ProgressMap from '@/components/ProgressMap';
import { useUserStore } from '@/store/userStore';
import { calculateWakeUpPlan } from '@/utils/planCalculator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

const Progress = () => {
  const { wakeUpPlan, setWakeUpPlan } = useUserStore();
  const { toast } = useToast();

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
    <div className="space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo mb-1">Your Progress</h1>
          <p className="text-sm text-indigo/70">Track your sleep journey</p>
        </div>
        {wakeUpPlan && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshPlan}
            className="text-indigo/70 hover:text-indigo flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Plan</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ProgressMap />
      </div>
    </div>
  );
};

export default Progress;
