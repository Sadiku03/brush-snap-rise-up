
import { useEffect, useState } from 'react';
import ProgressMap from '@/components/ProgressMap';
import { useUserStore } from '@/store/userStore';
import { calculateWakeUpPlan, analyzeWakeUpPlan } from '@/utils/planCalculator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import RecalculatePlanModal from '@/components/RecalculatePlanModal';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { shouldAutoReplan, autoReplanWakeUpSchedule } from '@/utils/replanner';

const Progress = () => {
  const { 
    wakeUpPlan, 
    setWakeUpPlan, 
    setShowRecalculationModal, 
    showRecalculationModal,
    brushSnaps,
    checkInHistory
  } = useUserStore();
  const { toast } = useToast();
  const [autoAdjusted, setAutoAdjusted] = useState(false);
  const [autoRefreshed, setAutoRefreshed] = useState(false);

  // Function to refresh the wake-up plan with the latest calculation logic
  const handleRefreshPlan = () => {
    if (!wakeUpPlan) return;

    const refreshedPlan = calculateWakeUpPlan(
      wakeUpPlan.currentWakeTime,
      wakeUpPlan.targetWakeTime,
      wakeUpPlan.targetDate
    );

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
      adjustmentHistory: wakeUpPlan.adjustmentHistory || []
    };

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
  
  // Analyze plan to see if it needs adjustment
  const planAnalysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false, reason: null };

  // Check for automatic recalculation on component mount
  useEffect(() => {
    if (!wakeUpPlan || !checkInHistory || checkInHistory.length === 0) return;
    
    if (shouldAutoReplan(checkInHistory) && !autoAdjusted) {
      const newPlan = autoReplanWakeUpSchedule(wakeUpPlan, checkInHistory);
      
      if (newPlan) {
        setWakeUpPlan(newPlan);
        setAutoAdjusted(true);
        
        toast({
          title: "Plan Automatically Adjusted",
          description: "Your wake-up schedule has been recalculated due to missed check-ins.",
          duration: 5000,
        });
      }
    }
  }, [wakeUpPlan, checkInHistory, autoAdjusted, setWakeUpPlan, toast]);

  // Automatically check for disruptions on component mount
  useEffect(() => {
    if (wakeUpPlan && planAnalysis.needsReset && !showRecalculationModal && !autoAdjusted) {
      const timer = setTimeout(() => {
        setShowRecalculationModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [wakeUpPlan, planAnalysis.needsReset, showRecalculationModal, setShowRecalculationModal, autoAdjusted]);

  return (
    <div className="space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo mb-1">Your Progress</h1>
          <p className="text-sm text-indigo/70">Track your sleep journey</p>
        </div>
      </div>
      
      {/* Display an alert if plan was automatically adjusted */}
      {wakeUpPlan && autoAdjusted && (
        <Alert className="bg-skyblue/10 text-indigo border-skyblue/20 mb-4">
          <Clock className="h-4 w-4" />
          <AlertTitle className="text-indigo">Your wake-up plan was automatically adjusted</AlertTitle>
          <AlertDescription>
            Due to missed check-ins, your schedule has been recalculated to keep you on track for your target date.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Display an alert if plan was automatically refreshed */}
      {wakeUpPlan && autoRefreshed && (
        <Alert className="bg-skyblue/10 text-indigo border-skyblue/20 mb-4">
          <RefreshCw className="h-4 w-4" />
          <AlertTitle className="text-indigo">Your wake-up plan has been refreshed</AlertTitle>
          <AlertDescription>
            Your schedule has been automatically updated with the latest calculation improvements.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Display an alert if plan needs recalculation */}
      {wakeUpPlan && planAnalysis.needsReset && !showRecalculationModal && !autoAdjusted && (
        <Alert className="bg-coral/10 text-coral border-coral/20 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-coral">Your wake-up plan needs adjustment</AlertTitle>
          <AlertDescription>
            {planAnalysis.reason || "Your progress has deviated from the original plan."}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        <ProgressMap />
      </div>
      
      {/* Add the recalculation modal */}
      <RecalculatePlanModal />
    </div>
  );
};

export default Progress;
