
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import SmartWakeUpPlan from '@/components/SmartWakeUpPlan';
import QuestSystem from '@/components/QuestSystem';
import BrushSnap from '@/components/BrushSnap';
import { getNextWakeUpTime } from '@/utils/planCalculator';

const Dashboard = () => {
  const { name, wakeUpPlan, progress } = useUserStore();
  
  // Get the next wake-up time from the plan
  const nextWakeUp = wakeUpPlan ? getNextWakeUpTime(wakeUpPlan) : null;
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartWakeUpPlan />
        <BrushSnap />
        <QuestSystem />
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
