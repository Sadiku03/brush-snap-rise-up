
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { analyzeWakeUpPlan } from '@/utils/planCalculator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, RefreshCw, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const RecalculatePlanModal = () => {
  const { wakeUpPlan, showRecalculationModal, setShowRecalculationModal, recalculateWakeUpPlan } = useUserStore();
  const { toast } = useToast();
  
  // Get analysis of the current plan
  const analysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false, reason: null, latestWakeTime: null };
  
  // Use the latest wake time from analysis or current wake time as default
  const [latestWakeTime, setLatestWakeTime] = useState(
    analysis.latestWakeTime || wakeUpPlan?.currentWakeTime || "08:00"
  );
  
  const handleRecalculate = () => {
    if (!wakeUpPlan) return;
    
    recalculateWakeUpPlan(latestWakeTime);
    
    toast({
      title: "Plan Recalculated",
      description: "Your wake-up plan has been updated based on your current progress.",
      duration: 3000,
    });
  };
  
  const handleDismiss = () => {
    setShowRecalculationModal(false);
  };
  
  if (!wakeUpPlan) return null;

  // Calculate days remaining in the plan
  const today = new Date().toISOString().split('T')[0];
  const targetDate = new Date(wakeUpPlan.targetDate);
  const currentDate = new Date(today);
  const daysRemaining = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Dialog open={showRecalculationModal} onOpenChange={setShowRecalculationModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-coral" />
            <DialogTitle className="text-indigo">Adjust Your Wake-up Plan</DialogTitle>
          </div>
          <DialogDescription>
            {analysis.reason || "Your wake-up schedule seems to be off track. Would you like to recalculate your plan?"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-skyblue/10 p-3 border border-skyblue/20">
            <p className="text-sm text-indigo mb-2">
              This will recalculate your remaining {daysRemaining} days while still aiming for your original target time.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-wake" className="text-indigo/80 mb-1 block">
              Your Current Wake-Up Time
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="current-wake"
                type="time"
                value={latestWakeTime}
                onChange={(e) => setLatestWakeTime(e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-indigo/70">
              We'll use this as the starting point for your updated plan.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-skyblue/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo" />
              </div>
              <span className="text-sm font-medium text-indigo">
                Your target time is still {wakeUpPlan.targetWakeTime}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-skyblue/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo" />
              </div>
              <span className="text-sm font-medium text-indigo">
                Your target date is still {new Date(wakeUpPlan.targetDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Keep Current Plan
          </Button>
          
          <Button 
            onClick={handleRecalculate}
            className="bg-indigo hover:bg-indigo/90 text-white flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Recalculate Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecalculatePlanModal;
