
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyCheckIn, logCheckIn, timeToMinutes } from '../utils/checkInTracker';
import { generateDailyQuests } from '../utils/questManager';

export enum QuestCategory {
  MORNING = "Morning",
  NIGHT = "Night", 
  CONSISTENCY = "Consistency",
  GENERAL = "General",
  SLEEP_HYGIENE = "Sleep Hygiene",
  NUTRITION = "Nutrition",
  MENTAL_PREP = "Mental Prep",
  TECH_DETOX = "Tech Detox"
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  dateAssigned: string;
  dateCompleted?: string;
  category: QuestCategory;
  detailedDescription?: string;
}

export interface WakeUpPlan {
  currentWakeTime: string;
  targetWakeTime: string;
  targetDate: string;
  intervals: {
    date: string;
    wakeTime: string;
    completed: boolean;
    isAdjusted?: boolean;
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
  lastQuestRefresh: string | null;
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
  checkInHistory: DailyCheckIn[];
  
  showRecalculationModal: boolean;
  
  setUser: (name: string, email: string) => void;
  completeOnboarding: () => void;
  setWakeUpPlan: (plan: WakeUpPlan) => void;
  completeQuest: (questId: string) => void;
  addBrushSnap: (brushSnap: BrushSnap) => void;
  recordWakeUp: (date: string, actualWakeTime?: string) => void;
  resetProgress: () => void;
  setShowRecalculationModal: (show: boolean) => void;
  recalculateWakeUpPlan: (latestWakeTime: string) => void;
  refreshDailyQuests: () => void;
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
    category: QuestCategory.MORNING,
    detailedDescription: 'Get up within 15 minutes of your target wake-up time to establish a consistent rhythm.'
  },
  {
    id: '2',
    title: 'Screen-Free Wind-Down',
    description: 'Spend 30 minutes without screens before bed',
    xpReward: 30,
    completed: false,
    dateAssigned: new Date().toISOString(),
    category: QuestCategory.NIGHT,
    detailedDescription: 'Avoid blue light from devices to help your body naturally prepare for sleep.'
  },
  {
    id: '3',
    title: 'Consistency Champion',
    description: 'Go to bed within 30 minutes of your target bedtime',
    xpReward: 40,
    completed: false,
    dateAssigned: new Date().toISOString(),
    category: QuestCategory.CONSISTENCY,
    detailedDescription: 'Maintain a steady sleep schedule by going to bed at approximately the same time each night.'
  },
];

const initialProgress: UserProgress = {
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  longestStreak: 0,
  lastCheckIn: null,
  lastQuestRefresh: null
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
      checkInHistory: [],
      showRecalculationModal: false,
      
      setUser: (name, email) => set({ name, email }),
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      setWakeUpPlan: (plan) => set({ wakeUpPlan: plan }),
      
      setShowRecalculationModal: (show) => set({ showRecalculationModal: show }),
      
      refreshDailyQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        const { progress } = get();
        const newQuests = generateDailyQuests(progress.level);
        
        set((state) => ({
          availableQuests: newQuests,
          progress: {
            ...state.progress,
            lastQuestRefresh: today
          }
        }));
      },
      
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
        
        const completedQuest = { 
          ...quest, 
          completed: true,
          dateCompleted: new Date().toISOString()
        };
        
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
        const { brushSnaps, progress, wakeUpPlan, checkInHistory } = get();
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
          
          const { autoReplanWakeUpSchedule } = require('../utils/replanner');
          const { analyzeWakeUpPlan } = require('../utils/planCalculator');
          
          const shouldShowModal = wakeUpPlan ? 
            analyzeWakeUpPlan(wakeUpPlan).needsReset : false;
          
          let updatedCheckInHistory = [...checkInHistory];
          
          if (wakeUpPlan) {
            const todayInterval = wakeUpPlan.intervals.find(interval => interval.date === today);
            
            if (todayInterval) {
              const scheduledWakeMinutes = timeToMinutes(todayInterval.wakeTime);
              const actualWakeMinutes = brushSnap.actualWakeTime 
                ? timeToMinutes(brushSnap.actualWakeTime)
                : scheduledWakeMinutes;
              
              updatedCheckInHistory = logCheckIn(checkInHistory, {
                date: today,
                scheduledWakeMinutes,
                actualWakeMinutes
              });
            }
          }
          
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
            showRecalculationModal: shouldShowModal,
            checkInHistory: updatedCheckInHistory
          });
        } else {
          set({
            brushSnaps: [...brushSnaps, brushSnap],
          });
        }
      },
      
      recordWakeUp: (date, actualWakeTime) => {
        const { wakeUpPlan, checkInHistory } = get();
        if (!wakeUpPlan) return;
        
        const newIntervals = wakeUpPlan.intervals.map(interval => {
          if (interval.date === date) {
            return { ...interval, completed: true };
          }
          return interval;
        });
        
        const updatedPlan = {
          ...wakeUpPlan,
          intervals: newIntervals
        };
        
        const todayInterval = wakeUpPlan.intervals.find(interval => interval.date === date);
        let updatedCheckInHistory = [...checkInHistory];
        
        if (todayInterval) {
          const scheduledWakeMinutes = timeToMinutes(todayInterval.wakeTime);
          const actualWakeMinutes = actualWakeTime 
            ? timeToMinutes(actualWakeTime)
            : scheduledWakeMinutes;
          
          updatedCheckInHistory = logCheckIn(checkInHistory, {
            date,
            scheduledWakeMinutes,
            actualWakeMinutes
          });
        }
        
        set({
          wakeUpPlan: updatedPlan,
          checkInHistory: updatedCheckInHistory
        });
        
        const { analyzeWakeUpPlan } = require('../utils/planCalculator');
        const shouldShowModal = analyzeWakeUpPlan(updatedPlan).needsReset;
        
        if (shouldShowModal && !get().showRecalculationModal) {
          setTimeout(() => {
            set({ showRecalculationModal: true });
          }, 1000);
        }
      },
      
      resetProgress: () => set({
        wakeUpPlan: null,
        availableQuests: initialQuests,
        completedQuests: [],
        progress: initialProgress,
        brushSnaps: [],
        checkInHistory: [],
        showRecalculationModal: false,
      }),
    }),
    {
      name: 'risequest-storage',
    }
  )
);
