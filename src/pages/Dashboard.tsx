import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import SmartWakeUpPlan from '@/components/SmartWakeUpPlan';
import { getNextWakeUpTime, calculateWakeUpPlan, analyzeWakeUpPlan } from '@/utils/planCalculator';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { useToast } from '@/hooks/use-toast';
import RecalculatePlanModal from '@/components/RecalculatePlanModal';

const Dashboard = () => {
  const { name, wakeUpPlan, progress, setWakeUpPlan, setShowRecalculationModal } = useUserStore();
  const { toast } = useToast();
  const [autoRefreshed, setAutoRefreshed] = useState(false);
  const refreshedRef = useRef(false);
  
  const nextWakeUp = wakeUpPlan ? getNextWakeUpTime(wakeUpPlan) : null;
  
  const handleRefreshPlan = () => {
    if (!wakeUpPlan || refreshedRef.current) return;

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
    refreshedRef.current = true;

    if (!autoRefreshed) {
      setAutoRefreshed(true);
      toast({
        title: "Wake-up Plan Updated",
        description: "Your plan has been automatically refreshed with the latest calculations.",
        duration: 3000,
      });
    }
  };
  
  useEffect(() => {
    if (wakeUpPlan && !refreshedRef.current) {
      handleRefreshPlan();
    }
  }, [wakeUpPlan]);
  
  const planAnalysis = wakeUpPlan ? analyzeWakeUpPlan(wakeUpPlan) : { needsReset: false };
  
  useEffect(() => {
    if (wakeUpPlan && planAnalysis.needsReset) {
      const timer = setTimeout(() => {
        setShowRecalculationModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [wakeUpPlan, planAnalysis.needsReset, setShowRecalculationModal]);
  
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
            <div className="flex justify-center">
              <ScheduleCalendar wakeUpPlan={wakeUpPlan} />
            </div>
          </div>
        )}
      </div>
      
      <RecalculatePlanModal />
    </div>
  );
};

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export default Dashboard;
