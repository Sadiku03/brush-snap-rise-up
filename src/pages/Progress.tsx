
import { useEffect } from 'react';
import ProgressMap from '@/components/ProgressMap';
import { useUserStore } from '@/store/userStore';
import { calculateWakeUpPlan, analyzeWakeUpPlan } from '@/utils/planCalculator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Zap } from 'lucide-react';
import RecalculatePlanModal from '@/components/RecalculatePlanModal';

const Progress = () => {
  const { wakeUpPlan, setWakeUpPlan, setShowRecalculationModal } = useUserStore();
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
      }),
      // Preserve adjustment history if any
      adjustmentHistory: wakeUpPlan.adjustmentHistory || []
    };

    // Update the plan in the store
    setWakeUpPlan(updatedPlan);

    toast({
      title: "Wake-up Plan Refreshed",
      description: "Your plan has been updated with the improved calculation.",
      duration: 3000,
    });
  };
  
  // Function to manually open recalculation modal
  const handleOpenRecalculationModal = () => {
    setShowRecalculationModal(true);
  };
  
  // Analyze plan to see if it needs adjustment
  const planAnalysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false };

  return (
    <div className="space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo mb-1">Your Progress</h1>
          <p className="text-sm text-indigo/70">Track your sleep journey</p>
        </div>
        {wakeUpPlan && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshPlan}
              className="text-indigo/70 hover:text-indigo flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Plan</span>
            </Button>
            
            <Button
              variant={planAnalysis.needsReset ? "default" : "outline"}
              size="sm"
              onClick={handleOpenRecalculationModal}
              className={`flex items-center gap-2 ${
                planAnalysis.needsReset 
                  ? "bg-coral hover:bg-coral/90 text-white" 
                  : "text-indigo/70 hover:text-indigo"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Recalculate</span>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ProgressMap />
      </div>
      
      {/* Add the recalculation modal */}
      <RecalculatePlanModal />
    </div>
  );
};

export default Progress;
