
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
}

export interface BrushSnap {
  id: string;
  date: string;
  imageUrl: string;
  prompt: string;
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
  // User Profile
  name: string | null;
  email: string | null;
  isOnboarded: boolean;
  
  // Wake Up Plan
  wakeUpPlan: WakeUpPlan | null;
  
  // Quests
  availableQuests: Quest[];
  completedQuests: Quest[];
  
  // Progress
  progress: UserProgress;
  brushSnaps: BrushSnap[];
  
  // Actions
  setUser: (name: string, email: string) => void;
  completeOnboarding: () => void;
  setWakeUpPlan: (plan: WakeUpPlan) => void;
  completeQuest: (questId: string) => void;
  addBrushSnap: (brushSnap: BrushSnap) => void;
  recordWakeUp: (date: string) => void;
  resetProgress: () => void;
}

// Initial quests data
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

// Initial user progress
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
      // Initial state
      name: null,
      email: null,
      isOnboarded: false,
      wakeUpPlan: null,
      availableQuests: initialQuests,
      completedQuests: [],
      progress: initialProgress,
      brushSnaps: [],
      
      // Actions
      setUser: (name, email) => set({ name, email }),
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      setWakeUpPlan: (plan) => set({ wakeUpPlan: plan }),
      
      completeQuest: (questId) => {
        const { availableQuests, completedQuests, progress } = get();
        
        const questIndex = availableQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;
        
        const quest = availableQuests[questIndex];
        const newAvailableQuests = [...availableQuests];
        newAvailableQuests.splice(questIndex, 1);
        
        const completedQuest = { ...quest, completed: true };
        
        // Calculate new XP and level
        const newXp = progress.xp + quest.xpReward;
        const newTotalXp = progress.totalXp + quest.xpReward;
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
        const { brushSnaps, progress } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Check if this is a new day
        const isNewDay = progress.lastCheckIn !== today;
        
        // Update streak
        let newStreak = progress.streak;
        let newLongestStreak = progress.longestStreak;
        
        if (isNewDay) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          // Check if the last check-in was yesterday
          if (progress.lastCheckIn === yesterdayStr) {
            newStreak += 1;
            if (newStreak > newLongestStreak) {
              newLongestStreak = newStreak;
            }
          } else {
            // Streak broken
            newStreak = 1;
          }
        }
        
        set({
          brushSnaps: [...brushSnaps, brushSnap],
          progress: {
            ...progress,
            streak: newStreak,
            longestStreak: newLongestStreak,
            lastCheckIn: today,
          }
        });
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
      }),
    }),
    {
      name: 'risequest-storage',
    }
  )
);
