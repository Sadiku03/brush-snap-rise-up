
import { useEffect } from 'react';
import ProgressMap from '@/components/ProgressMap';
import { useUserStore } from '@/store/userStore';
import { calculateWakeUpPlan, analyzeWakeUpPlan } from '@/utils/planCalculator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Zap, AlertTriangle } from 'lucide-react';
import RecalculatePlanModal from '@/components/RecalculatePlanModal';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Progress = () => {
  const { wakeUpPlan, setWakeUpPlan, setShowRecalculationModal, showRecalculationModal } = useUserStore();
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
  const planAnalysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false, reason: null };

  // Automatically check for disruptions on component mount
  useEffect(() => {
    if (wakeUpPlan && planAnalysis.needsReset && !showRecalculationModal) {
      // Wait a moment before showing the modal to avoid immediate popup on page load
      const timer = setTimeout(() => {
        setShowRecalculationModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [wakeUpPlan, planAnalysis.needsReset, showRecalculationModal, setShowRecalculationModal]);

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
      
      {/* Display an alert if plan needs recalculation */}
      {wakeUpPlan && planAnalysis.needsReset && !showRecalculationModal && (
        <Alert className="bg-coral/10 text-coral border-coral/20 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-coral">Your wake-up plan needs adjustment</AlertTitle>
          <AlertDescription>
            {planAnalysis.reason || "Your progress has deviated from the original plan."}
            <Button 
              variant="link" 
              className="text-coral p-0 h-auto ml-1"
              onClick={handleOpenRecalculationModal}
            >
              Recalculate plan now →
            </Button>
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
