import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  dateAssigned: string;
}

export interface WakeUpPlan {
  currentWakeTime: string;
  targetWakeTime: string;
  targetDate: string;
  intervals: {
    date: string;
    wakeTime: string;
    completed: boolean;
  }[];
  adjustmentHistory?: {
    date: string;
    reason: string;
    previousWakeTime: string;
    newWakeTime: string;
  }[];
}

export interface BrushSnap {
  id: string;
  date: string;
  imageUrl: string;
  prompt: string;
  actualWakeTime?: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastCheckIn: string | null;
}

interface UserStore {
  name: string | null;
  email: string | null;
  isOnboarded: boolean;
  
  wakeUpPlan: WakeUpPlan | null;
  
  availableQuests: Quest[];
  completedQuests: Quest[];
  
  progress: UserProgress;
  brushSnaps: BrushSnap[];
  
  showRecalculationModal: boolean;
  
  setUser: (name: string, email: string) => void;
  completeOnboarding: () => void;
  setWakeUpPlan: (plan: WakeUpPlan) => void;
  completeQuest: (questId: string) => void;
  addBrushSnap: (brushSnap: BrushSnap) => void;
  recordWakeUp: (date: string) => void;
  resetProgress: () => void;
  setShowRecalculationModal: (show: boolean) => void;
  recalculateWakeUpPlan: (latestWakeTime: string) => void;
}

const calculateXpWithStreak = (baseXp: number, streak: number): number => {
  const bonusPercentage = 0.1;
  const multiplier = 1 + (streak * bonusPercentage);
  return Math.round(baseXp * multiplier);
};

const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Wake up at your scheduled time',
    xpReward: 50,
    completed: false,
    dateAssigned: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Screen-Free Wind-Down',
    description: 'Spend 30 minutes without screens before bed',
    xpReward: 30,
    completed: false,
    dateAssigned: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Consistency Champion',
    description: 'Go to bed within 30 minutes of your target bedtime',
    xpReward: 40,
    completed: false,
    dateAssigned: new Date().toISOString(),
  },
];

const initialProgress: UserProgress = {
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  longestStreak: 0,
  lastCheckIn: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      name: null,
      email: null,
      isOnboarded: false,
      wakeUpPlan: null,
      availableQuests: initialQuests,
      completedQuests: [],
      progress: initialProgress,
      brushSnaps: [],
      showRecalculationModal: false,
      
      setUser: (name, email) => set({ name, email }),
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      setWakeUpPlan: (plan) => set({ wakeUpPlan: plan }),
      
      setShowRecalculationModal: (show) => set({ showRecalculationModal: show }),
      
      recalculateWakeUpPlan: (latestWakeTime) => {
        const { wakeUpPlan } = get();
        if (!wakeUpPlan) return;
        
        const today = new Date().toISOString().split('T')[0];
        
        const { recalculateWakePlan } = require('../utils/planCalculator');
        
        const recalculatedPlan = recalculateWakePlan({
          currentDate: today,
          latestWakeTime,
          targetWakeTime: wakeUpPlan.targetWakeTime,
          targetDate: wakeUpPlan.targetDate,
          originalPlan: wakeUpPlan
        });
        
        const adjustmentHistory = wakeUpPlan.adjustmentHistory || [];
        
        const updatedPlan = {
          ...recalculatedPlan,
          adjustmentHistory: [
            ...adjustmentHistory,
            {
              date: today,
              reason: "Plan recalculated after disruption",
              previousWakeTime: wakeUpPlan.currentWakeTime,
              newWakeTime: latestWakeTime
            }
          ]
        };
        
        set({
          wakeUpPlan: updatedPlan,
          showRecalculationModal: false
        });
      },
      
      completeQuest: (questId) => {
        const { availableQuests, completedQuests, progress } = get();
        
        const questIndex = availableQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;
        
        const quest = availableQuests[questIndex];
        const newAvailableQuests = [...availableQuests];
        newAvailableQuests.splice(questIndex, 1);
        
        const completedQuest = { ...quest, completed: true };
        
        const streakAdjustedXp = calculateXpWithStreak(quest.xpReward, progress.streak);
        
        const newXp = progress.xp + streakAdjustedXp;
        const newTotalXp = progress.totalXp + streakAdjustedXp;
        const xpToNextLevel = progress.level * 100;
        const newLevel = newXp >= xpToNextLevel 
          ? progress.level + 1 
          : progress.level;
        const finalXp = newXp >= xpToNextLevel ? newXp - xpToNextLevel : newXp;
        
        set({
          availableQuests: newAvailableQuests,
          completedQuests: [...completedQuests, completedQuest],
          progress: {
            ...progress,
            xp: finalXp,
            totalXp: newTotalXp,
            level: newLevel,
          }
        });
      },
      
      addBrushSnap: (brushSnap) => {
        const { brushSnaps, progress, wakeUpPlan } = get();
        const today = new Date().toISOString().split('T')[0];
        
        const isNewDay = progress.lastCheckIn !== today;
        
        let newStreak = progress.streak;
        let newLongestStreak = progress.longestStreak;
        
        if (isNewDay) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (progress.lastCheckIn === yesterdayStr) {
            newStreak += 1;
            if (newStreak > newLongestStreak) {
              newLongestStreak = newStreak;
            }
          } else {
            newStreak = 1;
          }
          
          const baseCheckInXp = 10;
          const streakAdjustedXp = calculateXpWithStreak(baseCheckInXp, newStreak);
          
          const newXp = progress.xp + streakAdjustedXp;
          const newTotalXp = progress.totalXp + streakAdjustedXp;
          const xpToNextLevel = progress.level * 100;
          const newLevel = newXp >= xpToNextLevel 
            ? progress.level + 1 
            : progress.level;
          const finalXp = newXp >= xpToNextLevel ? newXp - xpToNextLevel : newXp;
          
          const { analyzeWakeUpPlan } = require('../utils/planCalculator');
          
          const shouldShowModal = wakeUpPlan ? 
            analyzeWakeUpPlan(wakeUpPlan).needsReset : false;
          
          set({
            brushSnaps: [...brushSnaps, brushSnap],
            progress: {
              ...progress,
              streak: newStreak,
              longestStreak: newLongestStreak,
              lastCheckIn: today,
              xp: finalXp,
              totalXp: newTotalXp,
              level: newLevel,
            },
            showRecalculationModal: shouldShowModal
          });
        } else {
          set({
            brushSnaps: [...brushSnaps, brushSnap],
          });
        }
      },
      
      recordWakeUp: (date) => {
        const { wakeUpPlan } = get();
        if (!wakeUpPlan) return;
        
        const newIntervals = wakeUpPlan.intervals.map(interval => {
          if (interval.date === date) {
            return { ...interval, completed: true };
          }
          return interval;
        });
        
        set({
          wakeUpPlan: {
            ...wakeUpPlan,
            intervals: newIntervals
          }
        });
      },
      
      resetProgress: () => set({
        wakeUpPlan: null,
        availableQuests: initialQuests,
        completedQuests: [],
        progress: initialProgress,
        brushSnaps: [],
        showRecalculationModal: false,
      }),
    }),
    {
      name: 'risequest-storage',
    }
  )
);
